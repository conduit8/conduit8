#!/usr/bin/env node

import { Command } from 'commander';

import { install } from './commands/install.js';
import { list } from './commands/list.js';
import { remove } from './commands/remove.js';
import { search } from './commands/search.js';

const program = new Command();

program
  .name('conduit8')
  .description('Claude Code Skills Manager')
  .version('0.1.0');

// Install command
const installCmd = program
  .command('install')
  .description('Install content');

installCmd
  .command('skill <name>')
  .description('Install a skill')
  .option('-f, --force', 'Overwrite if exists')
  .action(install);

// Remove command
const removeCmd = program
  .command('remove')
  .description('Remove content');

removeCmd
  .command('skill <name>')
  .description('Remove a skill')
  .option('-f, --force', 'Skip existence check')
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
