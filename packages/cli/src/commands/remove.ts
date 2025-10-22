import chalk from 'chalk';

import { PERSONAL_SKILLS_DIR, PROJECT_SKILLS_DIR } from '../utils/config';
import { CliError, SkillNotInstalledError } from '../utils/errors';
import { removeSkill } from '../utils/fs';
import { addBreadcrumb } from '../utils/sentry';

interface RemoveOptions {
  force?: boolean;
  project?: boolean;
}

export async function remove(name: string, options: RemoveOptions): Promise<void> {
  try {
    addBreadcrumb('remove command started', { skill: name, project: options.project });

    // Determine removal directory
    const skillsDir = options.project ? PROJECT_SKILLS_DIR : PERSONAL_SKILLS_DIR;

    await removeSkill(name, skillsDir);
    console.log(chalk.green(`✓ Removed ${name} from ${skillsDir}/${name}`));

    addBreadcrumb('skill removed', { skill: name });
  }
  catch (error) {
    // Handle typed errors
    if (error instanceof SkillNotInstalledError) {
      console.error(chalk.red('✗ ') + error.message);
      console.log(chalk.dim('Run: npx conduit8 list skills'));
      process.exit(1);
    }

    if (error instanceof CliError) {
      console.error(chalk.red('✗ ') + error.message);
      process.exit(1);
    }

    // Unknown error
    console.error(chalk.red('✗ Removal failed'));
    if (error instanceof Error) {
      console.error(chalk.dim(error.message));
    }
    process.exit(1);
  }
}
