# Maintenance guide: keeping STAC up to date

This guide is for everyone who looks after the STAC archive. You **don't need any programming knowledge**. Everything can be done in the browser on github.com.

**Good to know first:** GitHub keeps every earlier version. If something goes wrong, you can always go back (see section 6). After every change, the website is up to date within **1–2 minutes**.

---

## 1. How the archive is organized

```
Art and Aesthetics/                        ← section
    AFS – Aesthetic Fluency Scale/         ← measure (has a README.md)
        README.md          ← all information about the measure
        AFS_English.pdf    ← the files
        ...
    Musical and Artistic Taste/            ← sub-folder (no README.md)
        GMSI – Goldsmith Musical Sophistication Index/
Creativity/
    Self-Report Scales/
        Creative Self/
            ...
    Tasks/
        Divergent Thinking/
            AUT – Alternate Uses Task/
Personality and Individual Differences/
    Curiosity/
        ...

_config.yml               ← texts and settings of the website
assets/style.css          ← colors, fonts, spacing
README_Template.md        ← template for new READMEs
_data/osf_downloads.json  ← download counts from OSF (starting values)
```

The website reads **all READMEs automatically**. You never have to change the website itself when a measure is added.

**The folders decide where a measure appears on the website.** Every folder that contains a `README.md` is a measure. All folders above it (without a README) are shown as sub-folders. You can create, rename or move sub-folders freely, with as many levels as you like; the website follows automatically. A sub-folder must not contain a `README.md`, and a measure folder must not contain another measure folder.

---

## 2. Adding a new measure

1. On github.com, go to the right section and sub-folder, e.g. `Creativity` → `Self-Report Scales` → `Creative Self`.
2. Click **Add file** → **Upload files**.
3. GitHub has no button for new folders. The trick: drag the **whole folder** from your computer into the window, e.g. the folder "XYZ – Example Scale" with all its files and the README inside.
4. Click **Commit changes** at the bottom.

**The README needs the header block at the top** (between the two `---` lines):

```
---
title: "Example Scale"
acronym: "XYZ"
languages: [English, German]
---
```

Rules for the header block:
- Section and sub-folder are **not** written here: they come from the folder the measure is in.
- Delete the `acronym` line if there is no acronym.
- Put text in quotation marks `"..."`. Don't leave square brackets `[ ]` anywhere except in `languages`.
- Don't delete the two `---` lines.

**Limits when uploading in the browser:** at most 100 files at once and at most 25 MB per file. For larger files, use the **GitHub Desktop** program.

**Folder names:** don't use these characters, because Windows doesn't allow them: `" : * ? < > |`

**The three section folders** (`Art and Aesthetics`, `Creativity`, `Personality and Individual Differences`) must keep exactly these names. To add or rename a section, also change the list `sections:` in `_config.yml`.

**Moving or renaming a measure folder:** the download count from OSF is stored under the folder name in `_data/osf_downloads.json`. Moving a folder into another sub-folder is fine. If you **rename** a measure folder, also change its name there, otherwise the OSF count shows 0. Renaming also resets the new GoatCounter count, because it is stored under the web address of the measure.

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

- **A measure is missing on the website:** usually the header block of its README has an error, e.g. a missing quotation mark, or the measure folder sits directly in the top level instead of inside a section folder. Compare it with the example above.
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
