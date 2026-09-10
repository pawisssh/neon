import { createHash, randomUUID } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { writeReviewPackage } from './harness/review/package.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const options = { 'base-url': 'http://localhost:5173', scene: 'all', 'functional-design-file': resolve(root, '../../design-md/finnomena/functional-layout/DESIGN.md'), 'immersive-design-file': resolve(root, '../../design-md/finnomena/immersive-layout/DESIGN.md') };
const forward = [];
const own = new Set(['base-url', 'scene', 'functional-design-file', 'immersive-design-file', 'model', 'run-label', 'recognition-model']);
try {
  for (let i = 0; i < argv.length; i++) {
    const [flag, ...parts] = argv[i].split('=');
    const name = flag.replace(/^--/, '');
    if (flag.startsWith('--') && own.has(name)) {
      const value = parts.length ? parts.join('=') : argv[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${flag}`);
      options[name] = value;
    } else forward.push(argv[i]);
  }
  const url = new URL(options['base-url']);
  if (!['all', 'functional', 'immersive'].includes(options.scene)) throw new Error('--scene must be all, functional, or immersive');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('--base-url must be an HTTP(S) origin without credentials, path, query, or fragment');
  }
  const functionalDesignPath = resolve(options['functional-design-file']);
  const immersiveDesignPath = resolve(options['immersive-design-file']);
  const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
  const hashFile = path => sha256(readFileSync(path));

  // Each scene's generation prompt and oracle module, individually hashed
  // and nulled when that scene isn't selected (same convention as the
  // design-file hashes above).
  const generationPromptFiles = { functional: resolve(root, 'generation/functional.md'), immersive: resolve(root, 'generation/immersive.md') };
  const oracleFiles = { functional: resolve(root, 'harness/oracles/functional.mjs'), immersive: resolve(root, 'harness/oracles/immersive.mjs') };
  const generationPromptHashes = {
    functional: options.scene === 'immersive' ? null : hashFile(generationPromptFiles.functional),
    immersive: options.scene === 'functional' ? null : hashFile(generationPromptFiles.immersive),
  };
  const oracleHashes = {
    functional: options.scene === 'immersive' ? null : hashFile(oracleFiles.functional),
    immersive: options.scene === 'functional' ? null : hashFile(oracleFiles.immersive),
  };
  // Legacy aggregate fields, retained for compatibility: a deterministic
  // hash of the selected generation-prompt / oracle file bytes, concatenated
  // in functional-then-immersive order (skipping any scene not selected).
  const concatSelected = paths => Buffer.concat(paths.filter(Boolean).map(path => readFileSync(path)));
  const promptSHA256 = sha256(concatSelected([
    options.scene === 'immersive' ? null : generationPromptFiles.functional,
    options.scene === 'functional' ? null : generationPromptFiles.immersive,
  ]));
  const oracleSHA256 = sha256(concatSelected([
    options.scene === 'immersive' ? null : oracleFiles.functional,
    options.scene === 'functional' ? null : oracleFiles.immersive,
  ]));

  const metadata = {
    startedAt: new Date().toISOString(), baseURL: url.origin,
    scene: options.scene,
    functionalDesignPath: options.scene === 'immersive' ? null : functionalDesignPath,
    functionalDesignSHA256: options.scene === 'immersive' ? null : sha256(readFileSync(functionalDesignPath)),
    immersiveDesignPath: options.scene === 'functional' ? null : immersiveDesignPath,
    immersiveDesignSHA256: options.scene === 'functional' ? null : sha256(readFileSync(immersiveDesignPath)),
    generationPromptHashes, oracleHashes, promptSHA256, oracleSHA256,
    model: options.model ?? null, runLabel: options['run-label'] ?? null,
    recognitionModel: options['recognition-model'] ?? null,
    playwrightArgs: forward,
  };
  const repoRoot = resolve(root, '../..');
  const output = resolve(repoRoot, '.local/evals/design-md/artifacts', `${Date.now()}-${randomUUID().slice(0, 8)}`);
  mkdirSync(output, { recursive: true });
  const metadataFile = resolve(output, 'run.json');
  writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  writeReviewPackage({ output, metadata, scene: options.scene });
  console.log(`Evaluation artifacts: ${output}`);
  const cli = fileURLToPath(import.meta.resolve('@playwright/test/cli'));
  const child = spawn(process.execPath, [cli, 'test', ...forward], {
    cwd: root, stdio: 'inherit', env: { ...process.env, EVAL_BASE_URL: url.origin, EVAL_OUTPUT: output, EVAL_METADATA: metadataFile, EVAL_SCENE: options.scene },
  });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
  child.on('error', error => { console.error(error); process.exitCode = 1; });
  child.on('exit', (code, signal) => {
    writeFileSync(metadataFile, JSON.stringify({ ...metadata, finishedAt: new Date().toISOString(), exitCode: code, signal }, null, 2));
    process.exitCode = code ?? 1;
  });
} catch (error) { console.error(error.message); process.exitCode = 1; }
