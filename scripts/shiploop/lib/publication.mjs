import { requireSha } from './errors.mjs';

const SHIPLOOP_CONTEXTS = new Set(['valoir-shiploop', 'rizz-reviewloop']);

export function validatePrNumber(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) throw new Error('PR number must be a canonical positive integer');
  return value;
}

export function validateRepository(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) throw new Error('repository must be canonical owner/name');
  return value;
}

export function validateLiveEvidence({ requiredNames, reviewedSha, checkRuns, statuses, previewName }) {
  requireSha(reviewedSha, '$.reviewedSha');
  const requiredChecks = [];
  for (const name of requiredNames) {
    if (SHIPLOOP_CONTEXTS.has(name.toLowerCase())) throw new Error(`${name} recursively requires Shiploop`);
    const run = checkRuns.find((item) => item.name === name && item.head_sha === reviewedSha && !SHIPLOOP_CONTEXTS.has(item.name.toLowerCase()));
    const status = statuses.find((item) => item.context === name && item.sha === reviewedSha && !SHIPLOOP_CONTEXTS.has(item.context.toLowerCase()));
    if (!run && !status) throw new Error(`missing live required check ${name} for exact SHA`);
    const conclusion = run?.conclusion ?? (status?.state === 'success' ? 'success' : status?.state);
    if (conclusion !== 'success') throw new Error(`live required check ${name} did not succeed`);
    requiredChecks.push({ name, conclusion: 'success', sha: reviewedSha });
  }
  const previewCheck = requiredChecks.find(({ name }) => name === previewName);
  if (!previewCheck) throw new Error(`missing live preview evidence ${previewName}`);
  return { requiredChecks, preview: { required: true, conclusion: 'success', sha: reviewedSha } };
}

export async function verifyPublicationTarget({ requestedSha, checkedOutSha, remotePrHeadSha, requestedBaseSha, remotePrBaseSha, baseIsAncestor }) {
  requireSha(requestedSha, '$.requestedSha');
  requireSha(checkedOutSha, '$.checkedOutSha');
  requireSha(remotePrHeadSha, '$.remotePrHeadSha');
  requireSha(requestedBaseSha, '$.requestedBaseSha');
  requireSha(remotePrBaseSha, '$.remotePrBaseSha');
  if (checkedOutSha !== requestedSha) throw new Error('checked-out HEAD does not equal the reviewed SHA');
  if (remotePrHeadSha !== requestedSha) throw new Error('remote PR head does not equal the reviewed SHA');
  if (remotePrBaseSha !== requestedBaseSha) throw new Error('remote PR base does not equal the certificate base SHA');
  if (!baseIsAncestor) throw new Error('certificate base SHA is not an ancestor of the reviewed SHA');
  return requestedSha;
}
