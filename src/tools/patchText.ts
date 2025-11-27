#!/usr/bin/env bun
/**
 * Simple Bun script to patch a text file in place.
 *
 * Actions:
 * 1) Replace all instances of 'https://schemas.openehr.org/v1' with 'https://schemas.openehr.org/v2'
 * 2) Remove any text '<match_negated>false</match_negated' (supports malformed closing tag lacking '>')
 * 3) Save the file
 *
 * Usage:
 *   bun src/tools/patchText.ts <path-to-text-file>
 * or via npm script:
 *   bun run patch-text <path-to-text-file>
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Returns the cleaned text applying the same transformations as the CLI tool.
 * - Replace all instances of 'https://schemas.openehr.org/v1' with 'https://schemas.openehr.org/v2'
 * - Remove any text '<match_negated>false</match_negated' (supports malformed closing tag lacking '>')
 */
export function cleanOptText(input: string): { output: string; stats: { urlV1Count: number; negFalseCount: number; urlV2Count: number } } {
  const urlV1Re = /http:\/\/schemas\.openehr\.org\/v1/g;
  const matchNegFalseRe = /<match_negated>\s*false\s*<\/match_negated>?/g; // optional final '>'

  const urlV1Count = (input.match(urlV1Re) || []).length;
  const negFalseCount = (input.match(matchNegFalseRe) || []).length;

  let output = input.replace(urlV1Re, 'http://schemas.openehr.org/v2');
  output = output.replace(matchNegFalseRe, '');

  const urlV2Count = (output.match(/http:\/\/schemas\.openehr\.org\/v2/g) || []).length;

  return { output, stats: { urlV1Count, negFalseCount, urlV2Count } };
}

async function main() {
  const [, , filePath] = process.argv;
  if (!filePath) {
    console.error('Usage: bun src/tools/patchText.ts <path-to-text-file>');
    process.exit(1);
  }

  const abs = path.resolve(process.cwd(), filePath);
  if (!(await fs.pathExists(abs))) {
    console.error(`File not found: ${abs}`);
    process.exit(1);
  }

  const original = await fs.readFile(abs, 'utf8');

  const { output: modified, stats } = cleanOptText(original);

  if (modified !== original) {
    await fs.writeFile(abs, modified, 'utf8');
  }

  // Report
  console.log('Patch complete');
  console.log(`  File: ${abs}`);
  console.log(`  Replaced URL occurrences: ${stats.urlV1Count}`);
  console.log(`  Removed <match_negated>false</match_negated> occurrences: ${stats.negFalseCount}`);
  console.log(`  New 'v2' URL count: ${stats.urlV2Count}`);
}

if (import.meta.main) {
  main().catch(err => {
    console.error('Error while patching file:', err);
    process.exit(1);
  });
}
