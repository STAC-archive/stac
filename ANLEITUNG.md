# Anleitung: STAC pflegen

Diese Anleitung ist für alle, die das STAC-Archiv betreuen. Man braucht **keine Programmierkenntnisse**. Alles geht im Browser auf github.com.

**Wichtig vorweg:** GitHub speichert jede frühere Version. Wenn etwas schiefgeht, kann man immer zurück (siehe Abschnitt 6). Nach jeder Änderung ist die Webseite nach **1–2 Minuten** aktuell.

---

## 1. So ist das Archiv aufgebaut

```
Art and Aesthetics/
    AFS – Aesthetic Fluency Scale/
        README.md          ← alle Infos zum Instrument
        AFS_English.pdf    ← die Dateien
        ...
Creativity/
    Self-Report Scales/
    Tasks/
        Methods & Scoring/
Personality and Individual Differences/

_config.yml               ← Texte und Einstellungen der Webseite
assets/style.css          ← Farben, Schriften, Abstände
README_Template.md        ← Vorlage für neue READMEs
_data/osf_downloads.json  ← Download-Zahlen von OSF (Startwerte)
```

Die Webseite liest **alle READMEs automatisch** aus. Man muss die Webseite also nie selbst anpassen, wenn ein Instrument dazukommt.

---

## 2. Neues Instrument hinzufügen

1. Auf github.com in den passenden Bereich gehen, z. B. `Creativity` → `Self-Report Scales`.
2. **Add file** → **Upload files**.
3. Einen neuen Ordner gibt es auf GitHub nicht direkt. Trick: Den **ganzen Ordner** vom Computer ins Fenster ziehen, also z. B. den Ordner „XYZ – Beispiel Scale“ mit allen Dateien und der README darin.
4. Unten **Commit changes** klicken.

**Die README braucht oben den Kopfblock** (zwischen den zwei `---`-Zeilen):

```
---
title: "Beispiel Scale"
acronym: "XYZ"
section: "Creativity"
subsection: "Self-Report Scales"
languages: [English, German]
---
```

Regeln für den Kopfblock:
- `section` muss **genau** einer dieser Namen sein: `Art and Aesthetics`, `Creativity`, `Personality and Individual Differences`.
- `subsection` nur bei Creativity: `Self-Report Scales`, `Tasks` oder `Methods and Scoring`. Sonst die Zeile weglassen.
- `acronym` weglassen, wenn es keine Abkürzung gibt.
- Text in Anführungszeichen `"..."` setzen. Keine eckigen Klammern `[ ]` stehen lassen, außer bei `languages`.
- Die zwei `---`-Zeilen nicht löschen.

**Grenzen beim Hochladen im Browser:** höchstens 100 Dateien auf einmal und jede Datei höchstens 25 MB. Für größere Dateien das Programm **GitHub Desktop** verwenden.

---

## 3. README eines Instruments ändern

1. Den Ordner des Instruments öffnen und auf `README.md` klicken.
2. Oben rechts auf das **Stift-Symbol** klicken.
3. Text ändern, dann **Commit changes** klicken.

---

## 4. Texte der Webseite ändern

Alle Texte (Welcome, History, Contribute, Kontakte, Zitation) stehen in **`_config.yml`**.

1. `_config.yml` öffnen und auf den **Stift** klicken.
2. Nur den Text **nach dem Doppelpunkt** ändern. Die Leerzeichen am Zeilenanfang genau so lassen.
3. **Commit changes** klicken.

Links schreibt man so: `[Linktext](https://adresse)`.

**Ansichten auf „Measures“:** In `_config.yml` stehen die Zeilen
```
views: [folders, list, grid]
default_view: folders
```
`folders` = Ordner, `list` = Liste, `grid` = Kacheln. Wer z. B. die Kacheln nicht mehr anbieten möchte, löscht `grid` aus der Liste: `views: [folders, list]`. Mit `default_view` wählt man, was Besucher:innen zuerst sehen.

---

## 5. Farben und Schriften ändern

In **`assets/style.css`** stehen ganz oben alle Farben, jeweils mit Erklärung, z. B.:
```
--ink:     #27374D;  /* Überschriften, Knöpfe, aktiver Reiter */
```
Den Farbcode (z. B. `#27374D`) austauschen und **Commit changes** klicken. Farbcodes findet man z. B. mit einem „Color Picker“ im Internet.

---

## 6. Etwas ist schiefgegangen

- **Ein Instrument fehlt auf der Webseite:** Meist ist der Kopfblock der README fehlerhaft, z. B. wegen eines fehlenden Anführungszeichens oder einer falsch geschriebenen `section`. Mit dem Beispiel oben vergleichen.
- **Die Webseite zeigt alte Inhalte:** 2 Minuten warten und die Seite neu laden. Unter **Actions** sieht man, ob GitHub die Seite gerade neu baut. Ein grüner Haken bedeutet fertig, ein rotes X bedeutet Fehler.
- **Eine Änderung rückgängig machen:** Die Datei öffnen, auf **History** klicken, die gewünschte alte Version öffnen und ihren Inhalt in die aktuelle Datei kopieren.

---

## 7. Download-Zähler

- Die Zahl auf jeder Instrument-Seite setzt sich so zusammen: **Downloads auf OSF** (bis 17. November 2026, steht in `_data/osf_downloads.json`) **plus neue Downloads**, die der Dienst **GoatCounter** zählt.
- GoatCounter-Konto: `stacarchive.goatcounter.com`. Dort sieht man die neuen Downloads im Detail.
- Wichtig in GoatCounter unter *Settings*: „Allow adding visitor counts on your website“ muss angehakt sein.
- Den Zähler ausschalten: in `_config.yml` `goatcounter: ""` eintragen.

---

## 8. Wer hat Zugriff?

Das Archiv gehört der GitHub-Organisation **STAC-archive**. Neue Betreuer:innen brauchen ein eigenes GitHub-Konto. Hinzufügen geht über die Organisation → **People** → **Invite member**, Rolle **Owner**. Es sollten immer mindestens zwei Personen Owner sein.
