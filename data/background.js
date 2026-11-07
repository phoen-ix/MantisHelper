/* global findIssueId, normalizeMantisUrl -- mantis.js */
// Chrome's service worker loads mantis.js here; Firefox's manifest lists it before this script.
if (typeof importScripts === 'function') {
  importScripts('mantis.js');
}

const MENU_ID = 'openInMantis';
const MENU_PROPERTIES = {
  title: 'Open “%s” in Mantis',
  contexts: ['selection']
};

// The browser keeps the menu across restarts and still has it when onInstalled fires
// after a browser update, so update an existing menu instead of failing on the
// duplicate id. onStartup repairs a menu that the browser did not get to save.
function setUpMenu() {
  chrome.contextMenus.create({ id: MENU_ID, ...MENU_PROPERTIES }, () => {
    if (chrome.runtime.lastError) {
      chrome.contextMenus.update(MENU_ID, MENU_PROPERTIES);
    }
  });
}

chrome.runtime.onInstalled.addListener(setUpMenu);
chrome.runtime.onStartup.addListener(setUpMenu);
chrome.contextMenus.onClicked.addListener(handleMenuClick);

async function handleMenuClick(info, tab) {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const { customUrl } = await chrome.storage.sync.get('customUrl');
  const urlPrefix = normalizeMantisUrl(customUrl);
  if (!urlPrefix) {
    // Not configured yet, or configured with an unusable URL
    await chrome.runtime.openOptionsPage();
    return;
  }

  const issueId = findIssueId(info.selectionText);
  if (issueId) {
    await openBesideTab(`${urlPrefix}${issueId}`, tab);
    return;
  }
  const hintUrl = chrome.runtime.getURL('data/invalid_selection.html');
  // Chrome opens extension pages from incognito tabs in a normal window; Firefox
  // (moz-extension:) opens them in the private window
  if (tab?.incognito && hintUrl.startsWith('chrome-extension:')) {
    await chrome.tabs.create({ url: hintUrl });
  } else {
    await openBesideTab(hintUrl, tab);
  }
}

// Opens the URL next to the tab the menu was used in and in its tab group (and in
// Firefox its container), like links open. Outside of tabs (e.g. sidebars, side
// panels) there is no tab or tab id -1, and popup windows have no tab strip, so
// those get a plain new tab.
async function openBesideTab(url, tab) {
  const sourceWindow = tab?.id >= 0 ? await chrome.windows.get(tab.windowId).catch(() => null) : null;
  if (sourceWindow?.type !== 'normal') {
    await chrome.tabs.create({ url });
    return;
  }
  const newTab = await chrome.tabs.create({ url, windowId: tab.windowId, index: tab.index + 1, openerTabId: tab.id });
  // Only a tab that lands between two tabs of the group is added to it by itself
  if (tab.groupId >= 0 && newTab.groupId !== tab.groupId) {
    // Fails e.g. while a tab is being dragged; the tab is open either way
    await chrome.tabs.group({ groupId: tab.groupId, tabIds: newTab.id }).catch(() => {});
  }
}
