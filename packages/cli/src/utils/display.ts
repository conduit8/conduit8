import chalk from 'chalk';

import type { Skill } from './api.js';

/**
 * Display skill installation success message
 */
export function displayInstallSuccess(skill: Skill): void {
  console.log();
  console.log(chalk.green('✓ Installed successfully!'));
  console.log();
  console.log(chalk.bold('━'.repeat(60)));
  console.log(chalk.bold(` ${skill.name}`));
  console.log(` ${chalk.dim(skill.description.slice(0, 60))}${skill.description.length > 60 ? '...' : ''}`);
  console.log(chalk.bold('━'.repeat(60)));
  console.log();
  console.log(chalk.bold(' Try it:'));
  skill.examples.slice(0, 3).forEach((example) => {
    console.log(chalk.cyan(` • ${example}`));
  });
  console.log();
  console.log(chalk.dim(` ${skill.downloadCount} downloads · ${skill.authorKind === 'official' ? 'Official' : 'Community'} by ${skill.author}`));
  console.log();
}

/**
 * Display search results
 */
export function displaySearchResults(skills: Skill[], query?: string): void {
  if (skills.length === 0) {
    console.log(chalk.yellow('\nNo skills found.'));
    if (query) {
      console.log(chalk.dim('Try a different search term.'));
    }
    return;
  }

  console.log();
  if (query) {
    console.log(chalk.bold(`Found ${skills.length} skill${skills.length === 1 ? '' : 's'} matching "${query}"`));
  }
  else {
    console.log(chalk.bold(`${skills.length} skill${skills.length === 1 ? '' : 's'} in registry`));
  }
  console.log();

  skills.forEach((skill) => {
    console.log(chalk.cyan(skill.id.padEnd(20)) + skill.name);
    console.log(' '.repeat(20) + chalk.dim(skill.description.slice(0, 60) + (skill.description.length > 60 ? '...' : '')));
    console.log();
  });

  console.log(chalk.dim('Run: npx @conduit8/cli install skill <name>'));
  console.log();
}

/**
 * Display installed skills list
 */
export function displayInstalledSkills(skills: Array<{ id: string; name: string; description: string }>): void {
  if (skills.length === 0) {
    console.log(chalk.yellow('\nNo skills installed yet.'));
    console.log(chalk.dim('Run: npx @conduit8/cli search skills'));
    return;
  }

  console.log();
  console.log(chalk.bold(`Installed Skills (${skills.length})`));
  console.log();

  skills.forEach((skill) => {
    console.log(chalk.cyan(skill.id.padEnd(20)) + skill.name);
    console.log(' '.repeat(20) + chalk.dim(skill.description.slice(0, 60) + (skill.description.length > 60 ? '...' : '')));
    console.log();
  });

  console.log(chalk.dim('Run: npx @conduit8/cli install skill <name>'));
  console.log();
}

/**
 * Format file size
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes}B`;
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
