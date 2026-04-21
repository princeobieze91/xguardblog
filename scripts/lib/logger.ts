import fs from 'node:fs';
import path from 'node:path';

const LOG_DIR = path.join(process.cwd(), 'scripts', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'agent.log');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function formatMessage(level: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  let log = `[${timestamp}] [${level}] ${message}`;
  if (data !== undefined) {
    log += ` ${JSON.stringify(data)}`;
  }
  return log;
}

export function log(message: string, data?: unknown): void {
  ensureLogDir();
  const entry = formatMessage('INFO', message, data);
  console.log(entry);
  fs.appendFileSync(LOG_FILE, entry + '\n');
}

export function error(message: string, err?: unknown): void {
  ensureLogDir();
  const entry = formatMessage('ERROR', message, err);
  console.error(entry);
  fs.appendFileSync(LOG_FILE, entry + '\n');
}

export function warn(message: string, data?: unknown): void {
  ensureLogDir();
  const entry = formatMessage('WARN', message, data);
  console.warn(entry);
  fs.appendFileSync(LOG_FILE, entry + '\n');
}

export function debug(message: string, data?: unknown): void {
  if (process.env.DEBUG) {
    ensureLogDir();
    const entry = formatMessage('DEBUG', message, data);
    console.log(entry);
    fs.appendFileSync(LOG_FILE, entry + '\n');
  }
}