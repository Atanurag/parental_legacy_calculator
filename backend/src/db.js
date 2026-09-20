import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../data/db.json');

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify({ calculations: [] }, null, 2));
  }
}

export async function readDb() {
  await ensureDb();
  return JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
}

export async function writeDb(db) {
  await ensureDb();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function addCalculation(calculation) {
  const db = await readDb();
  // Keep one saved result per DOB. Recalculating the same DOB updates its existing record
  // instead of creating repeated history entries.
  db.calculations = db.calculations.filter((item) => item.dob !== calculation.dob);
  db.calculations.unshift(calculation);
  db.calculations = db.calculations.slice(0, 100);
  await writeDb(db);
  return calculation;
}

export async function deleteCalculation(id) {
  const db = await readDb();
  const before = db.calculations.length;
  db.calculations = db.calculations.filter((item) => item.id !== id);
  await writeDb(db);
  return db.calculations.length !== before;
}
