const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../public/swe-routine-spring-2026-c2a0150ffc.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Filter rows that contain course codes (pattern: SE or CSE)
const routineRows = data.filter(row => row.some(cell => typeof cell === 'string' && /SE\d+|CSE\d+/i.test(cell)));

console.log(JSON.stringify(routineRows.slice(0, 20), null, 2));
