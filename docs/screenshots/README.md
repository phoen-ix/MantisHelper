# Screenshots

Every page Mantis Helper shows, in Firefox ([`firefox/`](firefox/)) and in Chromium for Chrome and Edge
([`chrome/`](chrome/)), with a fictional Mantis address. The pages are the same; the browsers draw the form
controls and fonts their own way. The context menu entry itself (**Open “…” in Mantis**) is browser UI and
cannot be captured. Regenerate the images with `scripts/docs-screenshots.sh` (see the
[README](../../README.md#screenshots)).

## Options: not configured yet

The options page as it first opens, also when "Open in Mantis" is used before a Mantis URL is set. The
line under the field explains what to enter.

<img src="firefox/options-empty.png" alt="Firefox: options page with an empty Mantis URL field and the hint to enter the address of the Mantis installation" width="800">

<img src="chrome/options-empty.png" alt="Chrome: options page with an empty Mantis URL field and the hint to enter the address of the Mantis installation" width="800">

## Options: unusable URL

An address without `http://` or `https://` is rejected: the hint stays, and **Save** does not store it.

<img src="firefox/options-invalid.png" alt="Firefox: options page with mantis.example.com typed into the Mantis URL field and the hint still shown" width="800">

<img src="chrome/options-invalid.png" alt="Chrome: options page with mantis.example.com typed into the Mantis URL field and the hint still shown" width="800">

## Options: saved

After **Save**, the base address has `view.php?id=` appended, the line under the field shows which
address an issue number opens, and "Options saved." confirms it.

<img src="firefox/options-saved.png" alt="Firefox: options page with https://mantis.example.com/view.php?id= saved, the preview for issue 1234 and the confirmation Options saved." width="800">

<img src="chrome/options-saved.png" alt="Chrome: options page with https://mantis.example.com/view.php?id= saved, the preview for issue 1234 and the confirmation Options saved." width="800">

## Invalid selection

Opens in a new tab when the selection holds no issue number, or several that are equally likely
(here: “Issues 12 and 34”).

<img src="firefox/menu-invalid-selection.png" alt="Firefox: hint page Invalid selection: no single issue number found in the selection" width="776">

<img src="chrome/menu-invalid-selection.png" alt="Chrome: hint page Invalid selection: no single issue number found in the selection" width="737">
