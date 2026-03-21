#!/usr/bin/env node
'use strict';

const { init } = require('../src/index');
const [, , command] = process.argv;

if (!command || command === 'init') {
  init().catch(err => { console.error('\n  Error:', err.message); process.exit(1); });
} else if (command === '--version' || command === '-v') {
  console.log(require('../kelar-refactor/package.json').version);
} else if (command === '--help' || command === '-h') {
  console.log('\n  kelar [command]\n\n  Commands:\n    init      Set up KELAR in your project (default)\n\n  Options:\n    -v, --version   Show version\n    -h, --help      Show help\n');
} else {
  console.error(`\n  Unknown command: ${command}\n  Run kelar --help for usage.\n`);
  process.exit(1);
}
