import chalk from 'chalk';
import ora from 'ora';

import { trackEvent } from '../utils/analytics';
import { searchSkills } from '../utils/api';
import { displaySearchResults } from '../utils/display';
import { ApiUnavailableError, CliError } from '../utils/errors';
import { addBreadcrumb } from '../utils/sentry';

export async function search(query?: string): Promise<void> {
  let spinner: ReturnType<typeof ora> | null = null;

  try {
    trackEvent('cli_command_executed', { command: 'search' });
    addBreadcrumb('search command started', { query });

    spinner = ora('Searching...').start();
    const skills = await searchSkills(query);
    spinner.stop();

    addBreadcrumb('search completed', { resultsCount: skills.length });
    displaySearchResults(skills, query);
  }
  catch (error) {
    // Stop spinner if still running
    if (spinner) {
      spinner.fail();
    }

    // Handle typed errors
    if (error instanceof ApiUnavailableError) {
      console.error(chalk.red('✗ ') + error.message);
      console.log(chalk.dim('You can still list installed skills: npx conduit8 list skills'));
      process.exit(1);
    }

    if (error instanceof CliError) {
      console.error(chalk.red('✗ ') + error.message);
      process.exit(1);
    }

    // Unknown error
    console.error(chalk.red('✗ Search failed'));
    if (error instanceof Error) {
      console.error(chalk.dim(error.message));
    }
    process.exit(1);
  }
}
