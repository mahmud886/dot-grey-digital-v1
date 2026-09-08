/**
 * Guards the CMS against schema drift.
 *
 * Keystatic validates a whole content file against its schema before it will render the
 * form, and treats any key the schema does not declare as a hard error. So a field added
 * to src/content/*.json without a matching field in keystatic.config.ts does not degrade
 * gracefully — the entry simply refuses to open, with the reason buried in the admin UI
 * rather than in the terminal. This runs before dev and build so the mismatch shows up
 * where whoever caused it is already looking.
 */
import { createJiti } from "jiti";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const jiti = createJiti(join(root, "x.mjs"), {
  interopDefault: true,
  // Icon.tsx is JSX, which jiti will not parse; the config only wants its icon-name list.
  alias: { "./src/components/ui/Icon": join(root, "scripts/icon-names.stub.ts") },
});

const config = (await jiti.import(join(root, "keystatic.config.ts"))).default;
const problems = [];

function walk(field, value, trail) {
  if (value === null || value === undefined) return;

  if (field?.kind === "array") {
    if (!Array.isArray(value)) {
      problems.push(`${trail} — schema says array, JSON has ${typeof value}`);
      return;
    }
    value.forEach((item, i) => walk(field.element, item, `${trail}[${i}]`));
    return;
  }

  const fields = field?.fields;
  if (!fields || typeof value !== "object" || Array.isArray(value)) return;

  for (const key of Object.keys(value)) {
    if (key in fields) walk(fields[key], value[key], `${trail}.${key}`);
    else problems.push(`${trail}.${key} — in the JSON, missing from keystatic.config.ts`);
  }
  // Only extra keys are checked. A field the JSON omits is filled from the schema's default,
  // so declaring a field before the content has it is legal and common — it is the reverse,
  // an undeclared key, that Keystatic rejects outright.
}

for (const [name, singleton] of Object.entries(config.singletons ?? {})) {
  const file = join(root, `${singleton.path}.json`);
  if (!existsSync(file)) {
    problems.push(`${name} — no content file at ${singleton.path}.json`);
    continue;
  }
  walk({ fields: singleton.schema }, JSON.parse(readFileSync(file, "utf8")), name);
}

if (problems.length) {
  console.error(`\nContent does not match the Keystatic schema (${problems.length} problem${problems.length > 1 ? "s" : ""}):\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error("\nThese entries will refuse to open in /keystatic until the two agree.\n");
  process.exit(1);
}

console.log(`Content matches the Keystatic schema (${Object.keys(config.singletons).length} singletons).`);
