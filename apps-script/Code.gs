/**
 * IAI member sign-ups -> Google Sheet.
 * Paste into Extensions > Apps Script on the "IAI Members" sheet, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 */
const SHEET_NAME = 'Members';
const HEADERS = ['Joined', 'First name', 'Last name', 'Email', 'Program', 'Class of',
                 'Interests', 'Email consent', 'Source', 'Last updated'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter || {};
    if (p.website) return ok_(); // bot trap
    const email = String(p.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return ok_();

    const sheet = getSheet_();
    const now = new Date();
    const row = [now, clean_(p.firstName), clean_(p.lastName), email, clean_(p.stream),
                 clean_(p.classOf), clean_(p.interests), p.consent === 'yes' ? 'Yes' : 'No',
                 clean_(p.source), now];

    // Update the existing row if this email already signed up.
    const last = sheet.getLastRow();
    if (last > 1) {
      const emails = sheet.getRange(2, 4, last - 1, 1).getValues().map(r => String(r[0]).toLowerCase());
      const i = emails.indexOf(email);
      if (i !== -1) {
        row[0] = sheet.getRange(i + 2, 1).getValue(); // keep original join date
        sheet.getRange(i + 2, 1, 1, row.length).setValues([row]);
        return ok_();
      }
    }
    sheet.appendRow(row);
    return ok_();
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// Strip leading characters that would make a spreadsheet treat input as a formula.
function clean_(v) {
  return String(v || '').trim().slice(0, 300).replace(/^[=+\-@]+/, '');
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
