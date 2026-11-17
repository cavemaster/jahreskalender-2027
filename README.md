# CHRONOS 2027 // Futuristischer Jahreskalender

Ein interaktiver Jahreskalender für das Jahr 2027 im futuristischen Cyberpunk / Sci-Fi HUD-Design.

🌐 **Live-Website:** [https://juliejung.de/kalender/](https://juliejung.de/kalender/)

---

## ⚡ Features

* **Cyberpunk HUD & Telemetrie-Interface:**
  * Live-Uhrzeit (CET) im Digitalcode-Format.
  * System-Statusanzeige (`SYS.STATUS: CHRONOS_ONLINE`).
  * Live-Statistiken: 365 Tage, 52 Kalenderwochen, 11 gesetzliche Feiertage (RLP/Bund), 104 Wochenendtage.
  * Animierter Canvas-Hintergrund mit Partikeln, Lichtknoten und CRT-Scanline-Effekt.

* **12-Monate-Matrix:**
  * Exakte kalendarische Abbildung des Jahres 2027 (Start am Freitag, 1. Januar 2027).
  * Gesetzliche Feiertage für Deutschland & Rheinland-Pfalz (RLP) hervorgehoben.
  * Automatische Markierung von Brückentagen für clevere Urlaubsplanung.

* **Filter & Quartalsansichten:**
  * Umschaltbar zwischen Gesamtjahr, Q1, Q2, Q3 und Q4.
  * Schnellfilter für *Nur Feiertage*, *Brückentage* und *Tage mit Notizen*.

* **Interaktiver "Node Inspector" (Tages-Modal):**
  * Klick auf einen beliebigen Tag zeigt Detailinformationen (Wochentag, KW, Jahrestag z. B. 85/365, Quartal, Feiertagsstatus).
  * **Lokale Notizen:** Eigene Tagesnotizen verfassen (bleiben per `localStorage` persistent im Browser gespeichert und markieren den Tag mit einer leuchtenden grünen LED).
  * **iCal (.ics) Kalender-Export:** Termine für einzelne Tage oder alle Feiertage auf einmal für Apple Kalender, Google Kalender oder Outlook herunterladen.

---

## 🛠️ Technologie

* **Frontend:** Vanilla JavaScript (ES6+), Modernes CSS3 (Glassmorphismus, CSS-Variablen, Responsive Grid), HTML5.
* **PWA-Ready:** Web App Manifest (`manifest.json`).
* **Deployment:** FTPS-Deployment per Python (`deploy.py`).
