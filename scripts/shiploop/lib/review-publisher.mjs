import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { requireExternalEvidencePath } from './runtime-evidence.mjs';

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

export async function bindReviewPublisher({ inputPath, outputPath, repositoryRoot = process.cwd() }) {
  const safeInput = await requireExternalEvidencePath(inputPath, repositoryRoot, { mustExist: true });
  const safeOutput = await requireExternalEvidencePath(outputPath, repositoryRoot);
  const review = JSON.parse(await readFile(safeInput, 'utf8'));
  const head = git(['rev-parse', 'HEAD'], repositoryRoot);
  if (review.reviewed_sha !== head) throw new Error('review draft must bind checked-out HEAD');
  review.publisher = {
    entry_path: 'scripts/shiploop/publish-status.mjs',
    publisher_tree_sha: git(['rev-parse', `${head}:scripts/shiploop`], repositoryRoot),
  };
  await writeFile(safeOutput, `${JSON.stringify(review, null, 2)}\n`, { flag: 'wx' });
  return safeOutput;
}
