#!/usr/bin/env node
/**
 * Wire the real Kulas Chili Garlic Sauce photograph into the site.
 *
 * Usage:
 *   1. Put the photo at public/products/kulas-chili-garlic-sauce.jpg
 *      (or pass a path:  node scripts/use-real-photo.mjs ./my-photo.jpg)
 *   2. Run:  npm run use-photo
 *
 * It copies the file into place if needed, then repoints every product/OG
 * image reference from the placeholder SVG to the real JPEG. Re-runnable and
 * idempotent. Revert with:  npm run use-photo -- --revert
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DEST = path.join(ROOT, "public", "products", "kulas-chili-garlic-sauce.jpg");
const SVG_REF = "/products/kulas-chili-garlic-sauce.svg";
const JPG_REF = "/products/kulas-chili-garlic-sauce.jpg";
const TARGETS = ["src/data/products.ts", "src/data/site.ts"];

const args = process.argv.slice(2);
const revert = args.includes("--revert");
const srcArg = args.find((a) => !a.startsWith("--"));

function rewrite(from, to) {
  let changed = 0;
  for (const rel of TARGETS) {
    const file = path.join(ROOT, rel);
    const before = readFileSync(file, "utf8");
    const after = before.split(from).join(to);
    if (after !== before) {
      writeFileSync(file, after);
      changed += before.split(from).length - 1;
    }
  }
  return changed;
}

if (revert) {
  const n = rewrite(JPG_REF, SVG_REF);
  console.log(`↩  Reverted ${n} reference(s) back to the placeholder SVG.`);
  process.exit(0);
}

// Copy a provided source into place if the destination isn't there yet.
if (srcArg) {
  const src = path.resolve(ROOT, srcArg);
  if (!existsSync(src)) {
    console.error(`✗ Source image not found: ${src}`);
    process.exit(1);
  }
  mkdirSync(path.dirname(DEST), { recursive: true });
  copyFileSync(src, DEST);
  console.log(`✓ Copied ${srcArg} → public/products/kulas-chili-garlic-sauce.jpg`);
}

if (!existsSync(DEST)) {
  console.error(
    [
      "✗ No photo found at public/products/kulas-chili-garlic-sauce.jpg",
      "",
      "  Add the real jar photo there first, then run: npm run use-photo",
      "  Or point at a file:  npm run use-photo -- ./path/to/photo.jpg",
    ].join("\n"),
  );
  process.exit(1);
}

const n = rewrite(SVG_REF, JPG_REF);
console.log(
  n > 0
    ? `✓ Wired the real photo into ${n} reference(s). The SVG stays as a fallback asset.`
    : "✓ Already using the real photo — nothing to change.",
);
console.log("  Next: npm run dev (and re-seed with npm run db:seed if using a database).");
