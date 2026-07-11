#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parsePolicy } from './lib/policy.mjs';

const [path] = process.argv.slice(2);
if (!path) throw new Error('usage: validate-policy.mjs <policy.yml>');
parsePolicy(await readFile(path, 'utf8'));
console.log('Shiploop policy valid');
