#!/usr/bin/env node

import { Command } from "commander";
import * as figlet from "figlet";
import omelette from 'omelette';

const program = new Command();

console.log(figlet.textSync("chjs"));

import { setupConnectCommand } from './connect/connect.js';
import { listDir } from './chfs/chfs.js';
import { fetchFeed } from './feed/feed.js';
import { setupLfsCommand } from './lfs/lfs.js';

program
  .version("1.0.0")
  .description("A CLI for ChRIS");

// Setup the connect subcommand
setupConnectCommand(program);

// Setup the lfs subcommand
setupLfsCommand(program);

const completion = omelette(`chjs|chjs`);
completion.tree({
  connect: ['--user', '--password'],
  lfs: ['ls', 'mkdir', 'touch'],
});

completion.init();

if (~process.argv.indexOf('--completion')) {
  completion.setupShellInitFile();
}

program
  .option('-v, --verbose', 'Enable verbose output')
  .option('-c, --config <path>', 'Path to config file');

async function main() {
  program.parse(process.argv);

  const options = program.opts();

  // Handle global options
  if (options.verbose) {
    console.log('Verbose mode enabled');
  }

  if (options.config) {
    console.log(`Using config file: ${options.config}`);
  }

}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});


