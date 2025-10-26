import type { Skill } from '@conduit8/core';

import chalk from 'chalk';

/**
 * Wrap text to fit within a specific width
 */
function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxWidth) {
      currentLine = testLine;
    }
    else {
      if (currentLine)
        lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine)
    lines.push(currentLine);

  return lines;
}

/**
 * Display skill installation success message
 */
export function displayInstallSuccess(skill: Skill): void {
  const boxWidth = 60;
  const contentWidth = boxWidth - 2; // Account for leading space and padding

  // Wrap description to fit within box
  const descLines = wrapText(skill.description, contentWidth);
  const maxDescLines = 3;
  const displayLines = descLines.slice(0, maxDescLines);

  console.log();
  console.log(chalk.green('✓ Installed successfully!'));
  console.log();
  console.log(chalk.bold('━'.repeat(boxWidth)));
  console.log(chalk.bold(` ${skill.name}`));
  displayLines.forEach((line, i) => {
    const suffix = (i === maxDescLines - 1 && descLines.length > maxDescLines) ? '...' : '';
    console.log(` ${chalk.dim(line + suffix)}`);
  });
  console.log(chalk.bold('━'.repeat(boxWidth)));
  console.log();

  // Show author and verification status
  const authorInfo = skill.authorKind === 'verified'
    ? `By ${skill.author} · Verified`
    : `By ${skill.author}`;
  console.log(chalk.dim(` ${skill.downloadCount} downloads · ${authorInfo}`));
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
    console.log(chalk.cyan(skill.slug.padEnd(20)) + skill.name);
    console.log(' '.repeat(20) + chalk.dim(skill.description.slice(0, 60) + (skill.description.length > 60 ? '...' : '')));
    console.log();
  });

  console.log(chalk.dim('Run: npx conduit8 install skill <name>'));
  console.log();
}

/**
 * Display installed skills list
 */
export function displayInstalledSkills(skills: Array<{ id: string; name: string; description: string }>): void {
  if (skills.length === 0) {
    console.log(chalk.yellow('\nNo skills installed yet.'));
    console.log(chalk.dim('Run: npx conduit8 search skills'));
    return;
  }

  console.log();
  console.log(chalk.bold(`Installed Skills (${skills.length})`));
  console.log();

  skills.forEach((skill) => {
    console.log(chalk.cyan(skill.id.padEnd(20)) + skill.name);
    const desc = skill.description || '';
    console.log(' '.repeat(20) + chalk.dim(desc.slice(0, 60) + (desc.length > 60 ? '...' : '')));
    console.log();
  });

  console.log(chalk.dim('Run: npx conduit8 install skill <name>'));
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
