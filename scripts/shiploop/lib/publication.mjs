import { requireSha } from './errors.mjs';

export async function verifyPublicationTarget({ requestedSha, checkedOutSha, remotePrHeadSha }) {
  requireSha(requestedSha, '$.requestedSha');
  requireSha(checkedOutSha, '$.checkedOutSha');
  requireSha(remotePrHeadSha, '$.remotePrHeadSha');
  if (checkedOutSha !== requestedSha) throw new Error('checked-out HEAD does not equal the reviewed SHA');
  if (remotePrHeadSha !== requestedSha) throw new Error('remote PR head does not equal the reviewed SHA');
  return requestedSha;
}
