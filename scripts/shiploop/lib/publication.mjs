import { requireSha } from './errors.mjs';
import { isReservedCheckContext } from './check-contexts.mjs';

export function validatePrNumber(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) throw new Error('PR number must be a canonical positive integer');
  return value;
}

export function validateRepository(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) throw new Error('repository must be canonical owner/name');
  return value;
}

export function validateLiveEvidence({ requiredNames, trustedChecks, reviewedSha, checkRuns, statuses, previewName, workflowBlobs }) {
  requireSha(reviewedSha, '$.reviewedSha');
  const requiredChecks = [];
  for (const name of requiredNames) {
    if (isReservedCheckContext(name)) throw new Error(`${name} recursively requires Shiploop`);
    const trusted = trustedChecks.find((item) => item.name === name);
    if (!trusted) throw new Error(`missing trusted provenance for ${name}`);
    const run = checkRuns.find((item) => item.name === name && item.head_sha === reviewedSha && !isReservedCheckContext(item.name)
      && trusted.source === 'check_run' && item.app?.slug === trusted.app_slug && item.app?.id === trusted.app_id
      && item.workflow?.name === trusted.workflow_name && item.workflow?.path === trusted.workflow_path);
    const status = statuses.find((item) => item.context === name && item.sha === reviewedSha && !isReservedCheckContext(item.context)
      && trusted.source === 'status' && item.creator?.login === trusted.creator_login);
    if (!run && !status) {
      const sameName = checkRuns.some((item) => item.name === name && item.head_sha === reviewedSha)
        || statuses.some((item) => item.context === name && item.sha === reviewedSha);
      if (sameName) throw new Error(`live required check ${name} lacks trusted provenance`);
      throw new Error(`missing live required check ${name} for exact SHA`);
    }
    const conclusion = run?.conclusion ?? (status?.state === 'success' ? 'success' : status?.state);
    if (conclusion !== 'success') throw new Error(`live required check ${name} did not succeed`);
    const checkEvidence = { name, conclusion: 'success', sha: reviewedSha };
    if (trusted.source === 'check_run') {
      const blobs = workflowBlobs?.[trusted.workflow_path];
      if (!blobs || blobs.base !== blobs.head || blobs.base !== blobs.local) throw new Error(`trusted workflow definition changed for ${name}`);
      checkEvidence.workflow_base_blob_sha = blobs.base;
    }
    requiredChecks.push(checkEvidence);
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
