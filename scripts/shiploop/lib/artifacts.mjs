import { fail } from './errors.mjs';
import { validateCertificate } from './certificate.mjs';

export function validateArtifactSet(artifacts, context) {
  for (const name of ['mission', 'policy', 'review', 'certificate']) if (!artifacts?.[name]) fail(`missing_${name}`, `$.${name}`, 'required artifact is missing');
  validateCertificate(artifacts.certificate, { ...artifacts, ...context });
  return artifacts;
}
