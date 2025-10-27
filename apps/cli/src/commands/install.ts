import chalk from 'chalk';
import ora from 'ora';

import { trackEvent } from '../utils/analytics';
import { getSkill, trackDownload } from '../utils/api';
import { PERSONAL_SKILLS_DIR, PROJECT_SKILLS_DIR } from '../utils/config';
import { displayInstallSuccess } from '../utils/display';
import {
  ApiUnavailableError,
  CliError,
  NetworkError,
  SkillAlreadyInstalledError,
  SkillNotFoundError,
} from '../utils/errors';
import { installSkill, isSkillInstalled } from '../utils/fs';
import { addBreadcrumb } from '../utils/sentry';

interface InstallOptions {
  force?: boolean;
  project?: boolean;
}

export async function install(name: string, options: InstallOptions): Promise<void> {
  let spinner: ReturnType<typeof ora> | null = null;

  try {
    // Track command execution
    trackEvent('cli_command_executed', { command: 'install' });
    addBreadcrumb('install command started', { skill: name, project: options.project });

    // Determine installation directory
    const skillsDir = options.project ? PROJECT_SKILLS_DIR : PERSONAL_SKILLS_DIR;

    // Check if already installed
    if (isSkillInstalled(name, skillsDir) && !options.force) {
      throw new SkillAlreadyInstalledError(name, skillsDir);
    }

    // Fetch skill metadata
    spinner = ora('Fetching skill...').start();
    const skill = await getSkill(name);
    spinner.succeed(`Found ${skill.name}`);
    spinner = null;

    addBreadcrumb('skill fetched', { skill: skill.slug });

    // Download and install
    spinner = ora('Downloading and installing...').start();
    await installSkill(skill, skillsDir);
    spinner.succeed(`Installed to ${skillsDir}/${skill.slug}`);
    spinner = null;

    // Track download (backend API + PostHog)
    trackDownload(skill.slug).catch(() => {});
    trackEvent('cli_skill_downloaded', {
      slug: skill.slug,
      category: skill.category,
      installation_location: options.project ? 'project' : 'personal',
    });

    // Display success message
    displayInstallSuccess(skill);
  }
  catch (error) {
    // Stop spinner if still running
    if (spinner) {
      spinner.fail();
    }

    // Handle typed errors
    if (error instanceof SkillNotFoundError) {
      console.error(chalk.red('✗ ') + error.message);
      console.log(chalk.dim('Try: npx conduit8 search skills'));
      process.exit(1);
    }

    if (error instanceof SkillAlreadyInstalledError) {
      console.error(chalk.red('✗ ') + error.message);
      console.log(chalk.dim('Use --force to reinstall'));
      process.exit(1);
    }

    if (error instanceof ApiUnavailableError) {
      console.error(chalk.red('✗ ') + error.message);
      console.log(chalk.dim('Check your internet connection and try again'));
      process.exit(1);
    }

    if (error instanceof NetworkError) {
      console.error(chalk.red('✗ ') + error.message);
      process.exit(1);
    }

    if (error instanceof CliError) {
      console.error(chalk.red('✗ ') + error.message);
      process.exit(1);
    }

    // Unknown error
    console.error(chalk.red('✗ Installation failed'));
    if (error instanceof Error) {
      console.error(chalk.dim(error.message));
    }
    process.exit(1);
  }
}
