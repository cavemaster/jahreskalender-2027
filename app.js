/**
 * CHRONOS 2027 // FUTURISTIC TEMPORAL MATRIX ENGINE
 * Vanilla JS 2027 Calendar, ISO-8601 KW, German/RLP Holidays, Cyber HUD
 */

// -----------------------------------------------------------------------------
// 1. CONSTANTS & HOLIDAYS (2027)
// -----------------------------------------------------------------------------
const YEAR = 2027;

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

const WEEKDAY_NAMES = [
  'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'
];

// Gesetzliche & Brauchtums-Feiertage 2027 (Rheinland-Pfalz / Deutschland)
const HOLIDAYS_2027 = {
  '2027-01-01': { name: 'Neujahr', type: 'official', desc: 'Gesetzlicher Feiertag' },
  '2027-03-26': { name: 'Karfreitag', type: 'official', desc: 'Gesetzlicher Feiertag (Ostern)' },
  '2027-03-28': { name: 'Ostersonntag', type: 'special', desc: 'Ostersonntag' },
  '2027-03-29': { name: 'Ostermontag', type: 'official', desc: 'Gesetzlicher Feiertag (Ostern)' },
  '2027-05-01': { name: 'Tag der Arbeit', type: 'official', desc: 'Gesetzlicher Feiertag' },
  '2027-05-06': { name: 'Christi Himmelfahrt', type: 'official', desc: 'Gesetzlicher Feiertag (Vatertag)' },
  '2027-05-16': { name: 'Pfingstsonntag', type: 'special', desc: 'Pfingstsonntag' },
  '2027-05-17': { name: 'Pfingstmontag', type: 'official', desc: 'Gesetzlicher Feiertag' },
  '2027-05-27': { name: 'Fronleichnam', type: 'official', desc: 'Gesetzlicher Feiertag (RLP)' },
  '2027-10-03': { name: 'Tag der Deutschen Einheit', type: 'official', desc: 'Nationalfeiertag Deutschland' },
  '2027-11-01': { name: 'Allerheiligen', type: 'official', desc: 'Gesetzlicher Feiertag (RLP)' },
  '2027-12-24': { name: 'Heiligabend', type: 'special', desc: 'Heiliger Abend (Bankfeiertag)' },
  '2027-12-25': { name: '1. Weihnachtstag', type: 'official', desc: 'Gesetzlicher Feiertag (Weihnachten)' },
  '2027-12-26': { name: '2. Weihnachtstag', type: 'official', desc: 'Gesetzlicher Feiertag (Weihnachten)' },
  '2027-12-31': { name: 'Silvester', type: 'special', desc: 'Jahresabschluss 2027' }
};

// Brückentage 2027 (optimale Urlaubstage)
const BRIDGE_DAYS_2027 = {
  '2027-05-07': 'Freitag nach Christi Himmelfahrt (1 Urlaubstag = 4 freie Tage)',
  '2027-05-28': 'Freitag nach Fronleichnam (1 Urlaubstag = 4 freie Tage)',
  '2027-12-27': 'Montag nach Weihnachten (Brückenwoche zum Jahreswechsel)',
  '2027-12-28': 'Dienstag nach Weihnachten',
  '2027-12-29': 'Mittwoch nach Weihnachten',
  '2027-12-30': 'Donnerstag vor Silvester'
};

// State
let activeQuarterFilter = 'all'; // 'all', '1', '2', '3', '4'
let showHolidaysHighlight = true;
let showBridgesHighlight = false;
let showOnlyNotesFilter = false;
let selectedDateKey = null;

// -----------------------------------------------------------------------------
// 2. INITIALIZATION
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initCyberCanvas();
  renderCalendarMatrix();
  setupEventListeners();
});

// -----------------------------------------------------------------------------
// 3. LIVE HUD DIGITAL CLOCK
// -----------------------------------------------------------------------------
function initLiveClock() {
  const clockEl = document.getElementById('hudLiveClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

// -----------------------------------------------------------------------------
// 4. ISO-8601 KALENDERWOCHE (KW) & JAHRESTAG BERECHNUNG
// -----------------------------------------------------------------------------
function getISOWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function getDayOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDateKey(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

// -----------------------------------------------------------------------------
// 5. RENDER 12-MONTH CYBER MATRIX
// -----------------------------------------------------------------------------
function renderCalendarMatrix() {
  const grid = document.getElementById('monthsGrid');
  if (!grid) return;

  grid.innerHTML = '';

  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const quarter = Math.floor(monthIndex / 3) + 1;
    if (activeQuarterFilter !== 'all' && activeQuarterFilter !== String(quarter)) {
      continue;
    }

    const monthCard = createMonthCard(YEAR, monthIndex);
    grid.appendChild(monthCard);
  }
}

function createMonthCard(year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayIndex = new Date(year, monthIndex, 1).getDay(); // 0 is Sun, 1 is Mon...
  // Convert to Mon=0, Tue=1 ... Sun=6
  const startOffset = (firstDayIndex + 6) % 7;

  const card = document.createElement('div');
  card.className = 'month-card';
  card.setAttribute('data-month', monthIndex);

  const monthNumStr = String(monthIndex + 1).padStart(2, '0');
  const monthName = MONTH_NAMES[monthIndex];

  card.innerHTML = `
    <div class="month-header">
      <div class="month-title-wrap">
        <span class="month-index">${monthNumStr}</span>
        <span class="month-name">${monthName}</span>
      </div>
      <span class="month-days-count">${daysInMonth} Tage</span>
    </div>

    <div class="month-calendar-body">
      <div class="days-week-headers">
        <span class="col-kw-head">KW</span>
        <span>MO</span>
        <span>DI</span>
        <span>MI</span>
        <span>DO</span>
        <span>FR</span>
        <span>SA</span>
        <span>SO</span>
      </div>
      <div class="days-grid" id="month-grid-${monthIndex}"></div>
    </div>
  `;

  const daysGrid = card.querySelector(`#month-grid-${monthIndex}`);

  // Generate rows
  let dayCounter = 1;
  let currentWeekDate = new Date(year, monthIndex, 1);

  // We loop by weeks (max 6 weeks)
  for (let w = 0; w < 6; w++) {
    if (dayCounter > daysInMonth) break;

    // First cell in row: KW
    const kwNumber = getISOWeekNumber(new Date(year, monthIndex, Math.min(dayCounter, daysInMonth)));
    const kwBadge = document.createElement('div');
    kwBadge.className = 'kw-badge';
    kwBadge.textContent = String(kwNumber).padStart(2, '0');
    daysGrid.appendChild(kwBadge);

    // 7 days in week (Mon to Sun)
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (w === 0 && dayOfWeek < startOffset) {
        // Empty slot before month start
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell empty-slot';
        daysGrid.appendChild(emptyCell);
      } else if (dayCounter <= daysInMonth) {
        const currentDate = new Date(year, monthIndex, dayCounter);
        const dateKey = formatDateKey(year, monthIndex, dayCounter);
        const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6);
        const holiday = HOLIDAYS_2027[dateKey];
        const bridge = BRIDGE_DAYS_2027[dateKey];
        const hasNote = !!localStorage.getItem(`cyber_note_${dateKey}`);

        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        dayCell.textContent = dayCounter;
        dayCell.setAttribute('data-date', dateKey);

        if (isWeekend) dayCell.classList.add('is-weekend');
        if (holiday && showHolidaysHighlight) dayCell.classList.add('is-holiday');
        if (bridge && showBridgesHighlight) dayCell.classList.add('is-bridge');
        if (hasNote) dayCell.classList.add('has-note');

        // Hover tooltip
        let tip = `${dayCounter}. ${monthName} 2027`;
        if (holiday) tip += `\n⚡ ${holiday.name}`;
        if (bridge) tip += `\n🌉 ${bridge}`;
        dayCell.title = tip;

        dayCell.addEventListener('click', () => openDayModal(dateKey, currentDate));

        daysGrid.appendChild(dayCell);
        dayCounter++;
      } else {
        // Empty slot after month end
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell empty-slot';
        daysGrid.appendChild(emptyCell);
      }
    }
  }

  return card;
}

// -----------------------------------------------------------------------------
// 6. INTERACTIVE DAY INSPECTOR MODAL
// -----------------------------------------------------------------------------
function openDayModal(dateKey, dateObj) {
  selectedDateKey = dateKey;
  const modal = document.getElementById('dayModal');
  if (!modal) return;

  const [y, m, d] = dateKey.split('-').map(Number);
  const dayName = WEEKDAY_NAMES[dateObj.getDay()];
  const monthName = MONTH_NAMES[m - 1];
  const kw = getISOWeekNumber(dateObj);
  const dayOfYear = getDayOfYear(dateObj);
  const quarter = Math.floor((m - 1) / 3) + 1;

  // Title & Telemetry
  document.getElementById('modalDateTitle').textContent = `${String(d).padStart(2, '0')}. ${monthName.toUpperCase()} ${y}`;
  document.getElementById('modalWeekday').textContent = dayName;
  document.getElementById('modalKw').textContent = `KW ${String(kw).padStart(2, '0')}`;
  document.getElementById('modalDayOfYear').textContent = `Tag ${dayOfYear} von 365`;
  document.getElementById('modalQuarter').textContent = `Q${quarter}`;

  // Holiday Banner
  const holiday = HOLIDAYS_2027[dateKey];
  const holidayBanner = document.getElementById('modalHolidayBanner');
  if (holiday) {
    document.getElementById('modalHolidayName').textContent = holiday.name;
    holidayBanner.style.display = 'flex';
  } else {
    holidayBanner.style.display = 'none';
  }

  // Bridge Day Banner
  const bridge = BRIDGE_DAYS_2027[dateKey];
  const bridgeBanner = document.getElementById('modalBridgeBanner');
  if (bridge) {
    document.getElementById('modalBridgeDesc').textContent = bridge;
    bridgeBanner.style.display = 'flex';
  } else {
    bridgeBanner.style.display = 'none';
  }

  // Notes
  const existingNote = localStorage.getItem(`cyber_note_${dateKey}`) || '';
  const noteInput = document.getElementById('modalNoteInput');
  const deleteBtn = document.getElementById('btnDeleteNote');
  noteInput.value = existingNote;
  deleteBtn.style.display = existingNote ? 'inline-block' : 'none';

  // Open
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDayModal() {
  const modal = document.getElementById('dayModal');
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// -----------------------------------------------------------------------------
// 7. EVENT LISTENERS & FILTERS
// -----------------------------------------------------------------------------
function setupEventListeners() {
  // Modal Close
  const closeBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('dayModal');
  if (closeBtn) closeBtn.addEventListener('click', closeDayModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeDayModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDayModal();
  });

  // Note Save & Delete
  const saveNoteBtn = document.getElementById('btnSaveNote');
  const deleteNoteBtn = document.getElementById('btnDeleteNote');
  const noteInput = document.getElementById('modalNoteInput');

  if (saveNoteBtn && noteInput) {
    saveNoteBtn.addEventListener('click', () => {
      if (!selectedDateKey) return;
      const text = noteInput.value.trim();
      if (text) {
        localStorage.setItem(`cyber_note_${selectedDateKey}`, text);
      } else {
        localStorage.removeItem(`cyber_note_${selectedDateKey}`);
      }
      renderCalendarMatrix();
      closeDayModal();
    });
  }

  if (deleteNoteBtn) {
    deleteNoteBtn.addEventListener('click', () => {
      if (!selectedDateKey) return;
      localStorage.removeItem(`cyber_note_${selectedDateKey}`);
      renderCalendarMatrix();
      closeDayModal();
    });
  }

  // Quarter Tabs
  const quarterTabs = document.querySelectorAll('.quarter-tab-btn');
  quarterTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      quarterTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeQuarterFilter = btn.getAttribute('data-quarter');
      renderCalendarMatrix();
    });
  });

  // Filter Pills
  const btnFilterHolidays = document.getElementById('btnFilterHolidays');
  if (btnFilterHolidays) {
    btnFilterHolidays.addEventListener('click', () => {
      showHolidaysHighlight = !showHolidaysHighlight;
      btnFilterHolidays.classList.toggle('active-pill', showHolidaysHighlight);
      renderCalendarMatrix();
    });
  }

  const btnFilterBridges = document.getElementById('btnFilterBridges');
  if (btnFilterBridges) {
    btnFilterBridges.addEventListener('click', () => {
      showBridgesHighlight = !showBridgesHighlight;
      btnFilterBridges.classList.toggle('active-pill', showBridgesHighlight);
      renderCalendarMatrix();
    });
  }

  const btnFilterNotes = document.getElementById('btnFilterNotes');
  if (btnFilterNotes) {
    btnFilterNotes.addEventListener('click', () => {
      showOnlyNotesFilter = !showOnlyNotesFilter;
      btnFilterNotes.classList.toggle('active-pill', showOnlyNotesFilter);
      // Highlight/filter logic
      const cells = document.querySelectorAll('.day-cell:not(.empty-slot)');
      cells.forEach(c => {
        if (showOnlyNotesFilter && !c.classList.contains('has-note')) {
          c.style.opacity = '0.15';
        } else {
          c.style.opacity = '1';
        }
      });
    });
  }

  // Export All Holidays .ics
  const btnExportIcs = document.getElementById('btnExportIcs');
  if (btnExportIcs) {
    btnExportIcs.addEventListener('click', exportHolidaysIcs);
  }

  // Export Single Day .ics
  const btnExportSingleIcs = document.getElementById('btnExportSingleIcs');
  if (btnExportSingleIcs) {
    btnExportSingleIcs.addEventListener('click', () => {
      if (selectedDateKey) exportSingleDayIcs(selectedDateKey);
    });
  }
}

// -----------------------------------------------------------------------------
// 8. ICS CALENDAR EXPORT (Apple Calendar / Google Calendar / Outlook)
// -----------------------------------------------------------------------------
function exportHolidaysIcs() {
  const events = [];

  for (const [dateStr, info] of Object.entries(HOLIDAYS_2027)) {
    const [y, m, d] = dateStr.split('-');
    const nextDay = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d) + 1));
    const nextY = nextDay.getUTCFullYear();
    const nextM = String(nextDay.getUTCMonth() + 1).padStart(2, '0');
    const nextD = String(nextDay.getUTCDate()).padStart(2, '0');

    events.push([
      'BEGIN:VEVENT',
      `UID:holiday-${dateStr}-2027@juliejung.de`,
      `DTSTAMP:${y}${m}${d}T000000Z`,
      `DTSTART;VALUE=DATE:${y}${m}${d}`,
      `DTEND;VALUE=DATE:${nextY}${nextM}${nextD}`,
      `SUMMARY:${info.name}`,
      `DESCRIPTION:${info.desc} (Jahreskalender 2027)`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    ].join('\r\n'));
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//juliejung.de//CHRONOS 2027 Kalender//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Feiertage 2027 (RLP / DE)',
    'X-WR-TIMEZONE:Europe/Berlin',
    events.join('\r\n'),
    'END:VCALENDAR'
  ].join('\r\n');

  downloadBlob(icsContent, 'Feiertage_2027_RLP.ics', 'text/calendar;charset=utf-8');
}

function exportSingleDayIcs(dateKey) {
  const [y, m, d] = dateKey.split('-');
  const nextDay = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d) + 1));
  const nextY = nextDay.getUTCFullYear();
  const nextM = String(nextDay.getUTCMonth() + 1).padStart(2, '0');
  const nextD = String(nextDay.getUTCDate()).padStart(2, '0');

  const holiday = HOLIDAYS_2027[dateKey];
  const userNote = localStorage.getItem(`cyber_note_${dateKey}`);
  let summary = holiday ? holiday.name : `Termin ${d}.${m}.${y}`;
  if (userNote) summary += ` - ${userNote.slice(0, 30)}`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//juliejung.de//CHRONOS 2027//DE',
    'BEGIN:VEVENT',
    `UID:single-${dateKey}@juliejung.de`,
    `DTSTAMP:${y}${m}${d}T000000Z`,
    `DTSTART;VALUE=DATE:${y}${m}${d}`,
    `DTEND;VALUE=DATE:${nextY}${nextM}${nextD}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${userNote || holiday?.desc || 'Termin aus CHRONOS 2027'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  downloadBlob(ics, `Termin_${dateKey}.ics`, 'text/calendar;charset=utf-8');
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// -----------------------------------------------------------------------------
// 9. ANIMATED CYBER GRID & STARLIGHT CANVAS
// -----------------------------------------------------------------------------
function initCyberCanvas() {
  const canvas = document.getElementById('cyberCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Cyber nodes / stars
  const nodeCount = Math.min(65, Math.floor(width / 24));
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.6,
      color: Math.random() > 0.3 ? '#00f3ff' : '#ff007f'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Subtle dark gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#050811');
    bgGrad.addColorStop(1, '#090e1c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle horizon grid lines (perspective)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridStep = 60;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Floating Starlight Nodes
    for (let i = 0; i < nodeCount; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0) n.x = width;
      if (n.x > width) n.x = 0;
      if (n.y < 0) n.y = height;
      if (n.y > height) n.y = 0;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
