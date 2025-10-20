import chalk from 'chalk';
import ora from 'ora';

import { getSkill, trackDownload } from '../utils/api';
import { displayInstallSuccess } from '../utils/display';
import { installSkill, isSkillInstalled } from '../utils/fs';

interface InstallOptions {
  force?: boolean;
}

export async function install(name: string, options: InstallOptions): Promise<void> {
  try {
    // Check if already installed
    if (isSkillInstalled(name) && !options.force) {
      console.error(chalk.red(`✗ Skill '${name}' is already installed`));
      console.log(chalk.dim('Use --force to reinstall'));
      process.exit(1);
    }

    // Fetch skill metadata
    const spinner = ora('Fetching skill...').start();
    const skill = await getSkill(name);
    spinner.succeed(`Found ${skill.name}`);

    // Simulate download with progress
    const downloadSpinner = ora('Downloading...').start();

    // Simulate download progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      downloadSpinner.text = `Downloading... ${i}%`;
    }

    downloadSpinner.succeed('Downloaded');

    // Install skill
    const installSpinner = ora(`Installing to ~/.claude/skills/${skill.slug}...`).start();
    await installSkill(skill);
    installSpinner.succeed('Installed');

    // Track download (fire and forget)
    trackDownload(skill.slug).catch(() => {});

    // Display success message
    displayInstallSuccess(skill);
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red('✗ ') + error.message);

      if (error.message.includes('not found')) {
        console.log(chalk.dim('Try: npx conduit8 search skills'));
      }
    }
    else {
      console.error(chalk.red('✗ Installation failed'));
    }
    process.exit(1);
  }
}
