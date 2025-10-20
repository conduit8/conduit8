import chalk from 'chalk';
import ora from 'ora';

import { getSkill, trackDownload } from '../utils/api';
import { PERSONAL_SKILLS_DIR, PROJECT_SKILLS_DIR } from '../utils/config';
import { displayInstallSuccess } from '../utils/display';
import { installSkill, isSkillInstalled } from '../utils/fs';

interface InstallOptions {
  force?: boolean;
  project?: boolean;
}

export async function install(name: string, options: InstallOptions): Promise<void> {
  try {
    // Determine installation directory
    const skillsDir = options.project ? PROJECT_SKILLS_DIR : PERSONAL_SKILLS_DIR;

    // Check if already installed
    if (isSkillInstalled(name, skillsDir) && !options.force) {
      console.error(chalk.red(`✗ Skill '${name}' is already installed in ${skillsDir}`));
      console.log(chalk.dim('Use --force to reinstall'));
      process.exit(1);
    }

    // Fetch skill metadata
    const spinner = ora('Fetching skill...').start();
    const skill = await getSkill(name);
    spinner.succeed(`Found ${skill.name}`);

    // Download and install
    const installSpinner = ora('Downloading and installing...').start();
    await installSkill(skill, skillsDir);
    installSpinner.succeed(`Installed to ${skillsDir}/${skill.slug}`);

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
