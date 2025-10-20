import chalk from 'chalk';

import { PERSONAL_SKILLS_DIR, PROJECT_SKILLS_DIR } from '../utils/config';
import { removeSkill } from '../utils/fs';

interface RemoveOptions {
  force?: boolean;
  project?: boolean;
}

export async function remove(name: string, options: RemoveOptions): Promise<void> {
  try {
    // Determine removal directory
    const skillsDir = options.project ? PROJECT_SKILLS_DIR : PERSONAL_SKILLS_DIR;

    await removeSkill(name, skillsDir);
    console.log(chalk.green(`✓ Removed ${name} from ${skillsDir}/${name}`));
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red('✗ ') + error.message);

      if (error.message.includes('not installed')) {
        console.log(chalk.dim('Run: npx conduit8 list skills'));
      }
    }
    else {
      console.error(chalk.red('✗ Removal failed'));
    }
    process.exit(1);
  }
}
