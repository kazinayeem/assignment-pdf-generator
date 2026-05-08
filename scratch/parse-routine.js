const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../public/swe-routine-spring-2026-c2a0150ffc.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Log the first 10 rows to see the structure
console.log(JSON.stringify(data.slice(0, 10), null, 2));
