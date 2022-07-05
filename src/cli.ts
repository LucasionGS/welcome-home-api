#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args.pop();

function help() {
  console.log(`
  Usage:
    $ wchome <command> [options]

  Commands:
    help      Show this help message
    sync-db   Sync the database, should be used before running the server first time or after an update.
  `);
}

switch (command) {
  case "help":
    help();

  default:
    invoke(command, args).catch(err => {
      console.log(err.message ? err.message : err);
      console.log("Run 'wchome help' to see all available commands.");
      process.exit(1);
    });
    break;
}

async function invoke(command: string, args: string[]) {
  const module = await import(`./cli/${command}`).then(m => m.default).catch(() => null);

  if (module) {
    return module(args);
  }
  return Promise.reject(`Unknown command: ${command}`);
}