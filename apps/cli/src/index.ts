#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';

import { install } from './commands/install';
import { list } from './commands/list';
import { remove } from './commands/remove';
import { search } from './commands/search';
import { flushSentry, initSentry } from './utils/sentry';

const program = new Command();

// Parse --no-telemetry flag early (before commander processes it)
const telemetryEnabled = !process.argv.includes('--no-telemetry');

// Initialize Sentry (skipped if --no-telemetry flag present)
initSentry(telemetryEnabled);

// Ensure Sentry events are flushed before exit
process.on('beforeExit', () => {
  void flushSentry();
});

program
  .name('conduit8')
  .description('Claude Code Skills Manager')
  .version(__VERSION__)
  .option('--no-telemetry', 'Disable anonymous error reporting')
  .configureHelp({
    formatHelp: () => {
      const help = `
${chalk.bold('conduit8')}
${chalk.dim(__VERSION__)}
${chalk.hex('#7c9ff5')('https://conduit8.dev')}

${chalk.bold('COMMANDS')}
  ${chalk.cyan('conduit8 search skills [query]')}    🔍 Search the skill registry
  ${chalk.cyan('conduit8 install skill <name>')}     📥 Install a skill from the registry
  ${chalk.cyan('conduit8 list skills')}              📋 List your installed skills
  ${chalk.cyan('conduit8 remove skill <name>')}      🗑️  Remove an installed skill

${chalk.bold('OPTIONS')}
  ${chalk.cyan('-f, --force')}                       Overwrite existing skill (install)
  ${chalk.cyan('-p, --project')}                     Install to project .claude/skills (team-shared)
  ${chalk.cyan('--no-telemetry')}                    Disable anonymous error reporting
  ${chalk.cyan('-h, --help')}                        Show help
  ${chalk.cyan('-v, --version')}                     Show version

${chalk.bold('EXAMPLES')}
  ${chalk.dim('$ npx conduit8 search skills pdf')}
  ${chalk.dim('$ npx conduit8 install skill pdf')}            ${chalk.dim('# Personal (~/.claude/skills)')}
  ${chalk.dim('$ npx conduit8 install skill pdf --project')}  ${chalk.dim('# Project (./.claude/skills)')}
  ${chalk.dim('$ npx conduit8 list skills')}
  ${chalk.dim('$ npx conduit8 --no-telemetry search skills')} ${chalk.dim('# Disable error tracking')}

Report an issue: ${chalk.hex('#7c9ff5')('https://github.com/conduit8/conduit8/issues')}
`;
      return help;
    }
  })
  .helpCommand(false);

// Install command
const installCmd = program
  .command('install')
  .description('Install content');

installCmd
  .command('skill <name>')
  .description('Install a skill')
  .option('-f, --force', 'Overwrite if exists')
  .option('-p, --project', 'Install to project directory (.claude/skills)')
  .action(install);

// Remove command
const removeCmd = program
  .command('remove')
  .description('Remove content');

removeCmd
  .command('skill <name>')
  .description('Remove a skill')
  .option('-f, --force', 'Skip existence check')
  .option('-p, --project', 'Remove from project directory (.claude/skills)')
  .action(remove);

// List command
const listCmd = program
  .command('list')
  .description('List installed content');

listCmd
  .command('skills')
  .description('List installed skills')
  .action(list);

// Search command
const searchCmd = program
  .command('search')
  .description('Search registry');

searchCmd
  .command('skills [query]')
  .description('Search for skills')
  .action(search);

program.parse();
