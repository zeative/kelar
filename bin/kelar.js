#!/usr/bin/env node
'use strict';

const { init } = require('../src/index');
const [, , command] = process.argv;

if (!command || command === 'init') {
  init().catch(err => { console.error('\n  Error:', err.message); process.exit(1); });
} else if (command === '--version' || command === '-v') {
  console.log(require('../kelar-complete-final/kelar-final/package.json').version);
} else if (command === '--help' || command === '-h') {
  console.log(`
  kelar [command]

  Commands:
    init      Set up KELAR in your project (default)

  Options:
    -v, --version   Show version
    -h, --help      Show help
`);
} else {
  console.error(`\n  Unknown command: ${command}\n  Run kelar --help for usage.\n`);
  process.exit(1);
}
