import chalk from 'chalk';

import { displayInstalledSkills } from '../utils/display';
import { CliError } from '../utils/errors';
import { listInstalledSkills } from '../utils/fs';

export async function list(): Promise<void> {
  try {
    const skills = await listInstalledSkills();
    displayInstalledSkills(skills);
  }
  catch (error) {
    // Handle typed errors
    if (error instanceof CliError) {
      console.error(chalk.red('✗ ') + error.message);
      process.exit(1);
    }

    // Unknown error
    console.error(chalk.red('✗ Failed to list skills'));
    if (error instanceof Error) {
      console.error(chalk.dim(error.message));
    }
    process.exit(1);
  }
}
