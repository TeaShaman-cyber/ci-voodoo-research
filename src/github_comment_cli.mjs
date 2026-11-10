import { parseGithubCommentRequest } from './github_comment_request.mjs';
import { runCanonical } from './runner.mjs';

const body = process.env.CI_VOODOO_COMMENT_BODY;
if (body === undefined) {
  throw new TypeError('CI_VOODOO_COMMENT_BODY is required');
}

const request = parseGithubCommentRequest(body);
const outDir = process.env.CI_VOODOO_OUT_DIR || 'artifacts/canonical';
const runnerRevision = process.env.CI_VOODOO_RUNNER_REVISION || process.env.GITHUB_SHA || 'LOCAL';

const receipt = await runCanonical({ request, outDir, runnerRevision });
process.stdout.write(JSON.stringify(receipt) + '\n');
