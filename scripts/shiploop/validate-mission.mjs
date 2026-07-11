#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { validateMission } from './lib/mission.mjs';

const [path] = process.argv.slice(2);
if (!path) throw new Error('usage: validate-mission.mjs <mission.json>');
validateMission(JSON.parse(await readFile(path, 'utf8')));
console.log('Shiploop mission valid');
