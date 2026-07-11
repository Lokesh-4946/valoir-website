#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { validateCertificate } from './lib/certificate.mjs';
import { validateMission } from './lib/mission.mjs';
import { parsePolicy } from './lib/policy.mjs';

const [certificatePath, missionPath, reviewPath, policyPath, headSha, baseSha, now] = process.argv.slice(2);
if (![certificatePath, missionPath, reviewPath, policyPath, headSha, baseSha].every(Boolean)) throw new Error('usage: validate-certificate.mjs <certificate.json> <mission.json> <review.json> <policy.yml> <head-sha> <base-sha> [now]');
const certificate = JSON.parse(await readFile(certificatePath, 'utf8'));
const mission = validateMission(JSON.parse(await readFile(missionPath, 'utf8')));
const review = JSON.parse(await readFile(reviewPath, 'utf8'));
const policy = parsePolicy(await readFile(policyPath, 'utf8'));
validateCertificate(certificate, { mission, review, policy, headSha, baseSha, now });
console.log('Shiploop certificate valid');
