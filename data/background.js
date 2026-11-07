const MENU_ID = 'openInMantis';

// Firefox keeps the menu of an event page across restarts, but onInstalled also
// fires after browser updates, so start clean to avoid a duplicate menu id.
// onStartup repairs a menu that Firefox did not get to save.
async function setUpMenu() {
  await browser.contextMenus.removeAll();
  browser.contextMenus.create({
    id: MENU_ID,
    title: 'Open “%s” in Mantis',
    contexts: ['selection']
  });
}

browser.runtime.onInstalled.addListener(setUpMenu);
browser.runtime.onStartup.addListener(setUpMenu);
browser.contextMenus.onClicked.addListener(handleMenuClick);

async function handleMenuClick(info, tab) {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const { customUrl } = await browser.storage.sync.get('customUrl');
  const urlPrefix = normalizeMantisUrl(customUrl);
  if (!urlPrefix) {
    // Not configured yet, or configured with an unusable URL
    await browser.runtime.openOptionsPage();
    return;
  }

  const issueId = findIssueId(info.selectionText);
  const url = issueId ? `${urlPrefix}${issueId}` : browser.runtime.getURL('data/invalid_selection.html');
  await openBesideTab(url, tab);
}

// Opens the URL next to the tab the menu was used in, which also keeps its container,
// and in its tab group. Outside of tabs (e.g. sidebars) there is no tab or tab id -1,
// and popup windows have no tab strip, so those get a plain new tab.
async function openBesideTab(url, tab) {
  const sourceWindow = tab?.id >= 0 ? await browser.windows.get(tab.windowId).catch(() => null) : null;
  if (sourceWindow?.type !== 'normal') {
    await browser.tabs.create({ url });
    return;
  }
  const newTab = await browser.tabs.create({ url, windowId: tab.windowId, index: tab.index + 1, openerTabId: tab.id });
  // A tab right after the group's last one is not added to the group by itself
  if (tab.groupId >= 0 && newTab.groupId !== tab.groupId) {
    // Fails e.g. while a tab is being dragged; the tab is open either way
    await browser.tabs.group({ groupId: tab.groupId, tabIds: newTab.id }).catch(() => {});
  }
}
