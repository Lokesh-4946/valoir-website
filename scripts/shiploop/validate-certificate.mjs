#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { validateCertificate } from './lib/certificate.mjs';
import { validateMission } from './lib/mission.mjs';
import { parsePolicy } from './lib/policy.mjs';
import { deriveChangedPaths } from './lib/git-changes.mjs';

const [certificatePath, missionPath, reviewPath, policyPath, headSha, baseSha, uiChangesValue, now] = process.argv.slice(2);
if (![certificatePath, missionPath, reviewPath, policyPath, headSha, baseSha, uiChangesValue].every(Boolean)) throw new Error('usage: validate-certificate.mjs <certificate.json> <mission.json> <review.json> <policy.yml> <head-sha> <base-sha> <ui-changes:true|false> [now]');
if (!['true', 'false'].includes(uiChangesValue)) throw new Error('ui-changes must be true or false');
const certificate = JSON.parse(await readFile(certificatePath, 'utf8'));
const mission = validateMission(JSON.parse(await readFile(missionPath, 'utf8')));
const review = JSON.parse(await readFile(reviewPath, 'utf8'));
const policy = parsePolicy(await readFile(policyPath, 'utf8'));
const changedPaths = deriveChangedPaths({ baseSha, headSha });
validateCertificate(certificate, { mission, review, policy, headSha, baseSha, now, uiChanges: uiChangesValue === 'true', changedPaths });
console.log('Shiploop certificate valid');
