# Maintenance guide: keeping STAC up to date

This guide is for everyone who looks after the STAC archive. You **don't need any programming knowledge**. Everything can be done in the browser on github.com.

**Good to know first:** GitHub keeps every earlier version. If something goes wrong, you can always go back (see section 6). After every change, the website is up to date within **1–2 minutes**.

---

## 1. How the archive is organized

```
Art and Aesthetics/
    AFS – Aesthetic Fluency Scale/
        README.md          ← all information about the measure
        AFS_English.pdf    ← the files
        ...
Creativity/
    Self-Report Scales/
    Tasks/
        Methods & Scoring/
Personality and Individual Differences/

_config.yml               ← texts and settings of the website
assets/style.css          ← colors, fonts, spacing
README_Template.md        ← template for new READMEs
_data/osf_downloads.json  ← download counts from OSF (starting values)
```

The website reads **all READMEs automatically**. You never have to change the website itself when a measure is added.

---

## 2. Adding a new measure

1. On github.com, go to the right section, e.g. `Creativity` → `Self-Report Scales`.
2. Click **Add file** → **Upload files**.
3. GitHub has no button for new folders. The trick: drag the **whole folder** from your computer into the window, e.g. the folder "XYZ – Example Scale" with all its files and the README inside.
4. Click **Commit changes** at the bottom.

**The README needs the header block at the top** (between the two `---` lines):

```
---
title: "Example Scale"
acronym: "XYZ"
section: "Creativity"
subsection: "Self-Report Scales"
languages: [English, German]
---
```

Rules for the header block:
- `section` must be **exactly** one of these names: `Art and Aesthetics`, `Creativity`, `Personality and Individual Differences`.
- `subsection` only for Creativity: `Self-Report Scales`, `Tasks` or `Methods and Scoring`. Otherwise delete the line.
- Delete the `acronym` line if there is no acronym.
- Put text in quotation marks `"..."`. Don't leave square brackets `[ ]` anywhere except in `languages`.
- Don't delete the two `---` lines.

**Limits when uploading in the browser:** at most 100 files at once and at most 25 MB per file. For larger files, use the **GitHub Desktop** program.

**Folder names:** don't use these characters, because Windows doesn't allow them: `" : * ? < > |`

---

## 3. Changing the README of a measure

1. Open the folder of the measure and click `README.md`.
2. Click the **pencil icon** at the top right.
3. Change the text, then click **Commit changes**.

---

## 4. Changing texts on the website

All texts (Welcome, History, Contribute, contacts, citation) are in **`_config.yml`**.

1. Open `_config.yml` and click the **pencil icon**.
2. Only change the text **after the colon**. Keep the spaces at the start of each line exactly as they are.
3. Click **Commit changes**.

Links are written like this: `[link text](https://address)`.

**Views on the "Measures" page:** `_config.yml` contains these lines:
```
views: [folders, list, grid]
default_view: folders
```
`folders` = folder view, `list` = list, `grid` = tiles. To stop offering the tiles, for example, delete `grid` from the list: `views: [folders, list]`. `default_view` sets what visitors see first.

---

## 5. Changing colors and fonts

At the top of **`assets/style.css`** you'll find all colors, each with an explanation, e.g.:
```
--ink:     #27374D;  /* headings, buttons, active tab */
```
Replace the color code (e.g. `#27374D`) and click **Commit changes**. You can find color codes with any online "color picker".

---

## 6. When something goes wrong

- **A measure is missing on the website:** usually the header block of its README has an error, e.g. a missing quotation mark or a misspelled `section`. Compare it with the example above.
- **The website shows old content:** wait 2 minutes and reload the page. The **Actions** tab shows whether GitHub is rebuilding the site: a green tick means done, a red X means an error.
- **Undoing a change:** open the file, click **History**, open the earlier version you want, and copy its content into the current file.

---

## 7. Download counter

- The number on each measure page is: **downloads on OSF** (until 17 November 2026, stored in `_data/osf_downloads.json`) **plus new downloads** counted by the **GoatCounter** service.
- GoatCounter account: `stacarchive.goatcounter.com`. You can see the new downloads in detail there.
- Important in GoatCounter under *Settings*: "Allow adding visitor counts on your website" must be ticked.
- To switch the counter off: set `goatcounter: ""` in `_config.yml`.

---

## 8. Who has access?

The archive belongs to the GitHub organization **STAC-archive**. New maintainers need their own GitHub account. Add them via the organization → **People** → **Invite member**, with the role **Owner**. There should always be at least two owners.
