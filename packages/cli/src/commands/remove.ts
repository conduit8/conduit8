import chalk from 'chalk';

import { removeSkill } from '../utils/fs';

interface RemoveOptions {
  force?: boolean;
}

export async function remove(name: string, options: RemoveOptions): Promise<void> {
  try {
    await removeSkill(name);
    console.log(chalk.green(`✓ Removed ${name} from ~/.claude/skills/${name}`));
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
