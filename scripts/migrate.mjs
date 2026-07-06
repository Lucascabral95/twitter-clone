#!/usr/bin/env node
import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import readline from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '..', 'sql', 'migrations');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env scripts/migrate.mjs');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

function execRawStatement(statement) {
  const strings = Object.assign([statement], { raw: [statement] });
  return sql(strings);
}

function splitStatements(fileContents) {
  const withoutComments = fileContents
    .split(/\r?\n/)
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');
  return withoutComments
    .split(';')
    .map(statement => statement.trim())
    .filter(Boolean);
}

async function confirm(question) {
  if (process.env.CI || process.argv.includes('--force')) return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise(resolve => rl.question(question, resolve));
  rl.close();
  return answer.trim().toLowerCase() === 'yes';
}

async function dropAll() {
  await sql`drop view if exists usuarios_posteos cascade`;
  await sql`drop view if exists comentarios_de_posteos_new cascade`;
  await sql`drop view if exists seguimientos_usuarios cascade`;
  await sql`drop view if exists reposteos_usuarios cascade`;
  await sql`drop table if exists refresh_tokens cascade`;
  await sql`drop table if exists seguidores cascade`;
  await sql`drop table if exists seguimientos cascade`;
  await sql`drop table if exists reposteos cascade`;
  await sql`drop table if exists comentarios cascade`;
  await sql`drop table if exists datos_personales cascade`;
  await sql`drop table if exists posteos cascade`;
  await sql`drop table if exists usuarios cascade`;
  await sql`drop table if exists schema_migrations cascade`;
  console.log('Dropped all known tables and views.');
}

async function ensureMigrationsTable() {
  await sql`
    create table if not exists schema_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `;
}

async function getAppliedMigrations() {
  const rows = await sql`select name from schema_migrations`;
  return new Set(rows.map(row => row.name));
}

async function applyMigration(filename) {
  const contents = readFileSync(join(MIGRATIONS_DIR, filename), 'utf8');
  const statements = splitStatements(contents);

  for (const statement of statements) {
    await execRawStatement(statement);
  }

  await sql`insert into schema_migrations (name) values (${filename})`;
  console.log(`Applied ${filename}`);
}

async function main() {
  const fresh = process.argv.includes('--fresh');

  if (fresh) {
    const ok = await confirm(
      'This will DROP ALL known tables and views before migrating. Type "yes" to continue: '
    );
    if (!ok) {
      console.log('Aborted.');
      process.exit(1);
    }
    await dropAll();
  }

  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = readdirSync(MIGRATIONS_DIR)
    .filter(name => name.endsWith('.sql'))
    .sort();

  let appliedCount = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    await applyMigration(file);
    appliedCount++;
  }

  if (appliedCount === 0) {
    console.log('Database schema is already up to date.');
  } else {
    console.log(`Applied ${appliedCount} migration(s).`);
  }
}

main().catch(error => {
  console.error('Migration failed:', error.message || error);
  process.exit(1);
});
