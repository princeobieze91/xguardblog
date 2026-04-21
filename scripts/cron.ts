import cron from 'node-cron';
import { log, error } from './lib/logger';

const CRON_EXPRESSION = '0 6 * * *';

async function runFetcher() {
  log('Cron triggered - starting article fetch');

  try {
    const { fetchArticles } = await import('./fetch-articles');
    await fetchArticles.main();
  } catch (err) {
    error('Failed to run article fetcher', err);
  }
}

function startCron() {
  if (!cron.validate(CRON_EXPRESSION)) {
    error(`Invalid cron expression: ${CRON_EXPRESSION}`);
    process.exit(1);
  }

  log(`Starting cron scheduler for expression: ${CRON_EXPRESSION}`);

  cron.schedule(CRON_EXPRESSION, () => {
    runFetcher();
  });
}

if (require.main === module) {
  startCron();
}

export { startCron, runFetcher };