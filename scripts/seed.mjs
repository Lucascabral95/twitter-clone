#!/usr/bin/env node
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env scripts/seed.mjs');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const SEED_PASSWORD = 'Password1';

const USERS = [
  { nombre: 'Ada Lovelace', email: 'ada@seed.local', bio: 'Programadora pionera. Amante de los algoritmos.', loc: 'Londres, UK' },
  { nombre: 'Alan Turing', email: 'alan@seed.local', bio: 'Máquinas, lógica y un poco de criptografía.', loc: 'Manchester, UK' },
  { nombre: 'Grace Hopper', email: 'grace@seed.local', bio: 'Compiladores para todos.', loc: 'Nueva York, US' },
  { nombre: 'Linus Torvalds', email: 'linus@seed.local', bio: 'Talk is cheap. Show me the code.', loc: 'Helsinki, FI' },
  { nombre: 'Margaret Hamilton', email: 'margaret@seed.local', bio: 'Software engineering antes de que existiera el término.', loc: 'Houston, US' },
];

const POSTS = [
  { author: 0, titulo: 'Hola mundo', contenido: 'Mi primer posteo de prueba en el seed.' },
  { author: 0, titulo: 'Sobre algoritmos', contenido: 'Un algoritmo es una secuencia finita de instrucciones.' },
  { author: 1, titulo: 'Máquinas pensantes', contenido: '¿Pueden pensar las máquinas? Esa es la pregunta.' },
  { author: 1, titulo: 'Criptografía básica', contenido: 'Cifrar y descifrar mensajes, todo un arte.' },
  { author: 2, titulo: 'Compiladores', contenido: 'Un compilador traduce código fuente a código máquina.' },
  { author: 2, titulo: 'Debugging', contenido: 'El primer bug real era literalmente un insecto.' },
  { author: 3, titulo: 'Kernel news', contenido: 'Nueva versión del kernel con mejoras de rendimiento.' },
  { author: 3, titulo: 'Open source', contenido: 'El código abierto cambia el mundo, un commit a la vez.' },
  { author: 4, titulo: 'Apollo software', contenido: 'El software de guiado tiene que ser confiable, sí o sí.' },
  { author: 4, titulo: 'Ingeniería de software', contenido: 'Antes de que el término existiera, ya lo estábamos haciendo.' },
];

const COMMENTS = [
  { author: 1, post: 0, contenido: 'Gran primer posteo!' },
  { author: 2, post: 0, contenido: 'Bienvenida.' },
  { author: 0, post: 2, contenido: 'Excelente pregunta.' },
  { author: 3, post: 4, contenido: 'Totalmente de acuerdo.' },
  { author: 4, post: 6, contenido: 'Buenas noticias.' },
  { author: 0, post: 8, contenido: 'Impresionante trabajo en la NASA.' },
];

const FOLLOWS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 2],
];

const REPOSTS = [
  { user: 1, post: 0 },
  { user: 3, post: 6 },
];

async function seedUsers() {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
  const rows = [];

  for (const user of USERS) {
    await sql`
      insert into usuarios (nombre, email, password, identificador)
      values (${user.nombre}, ${user.email}, ${passwordHash}, ${crypto.randomUUID()})
      on conflict (email) do nothing
    `;
    const [row] = await sql`select id, nombre, email from usuarios where email = ${user.email}`;
    rows.push(row);
  }

  return rows;
}

async function seedDatosPersonales(users) {
  for (let i = 0; i < users.length; i++) {
    const meta = USERS[i];
    await sql`
      insert into datos_personales (biografia, localizacion, usuario_id)
      values (${meta.bio}, ${meta.loc}, ${users[i].id})
      on conflict (usuario_id) do nothing
    `;
  }
}

async function seedPosts(users) {
  const postIds = [];
  for (const post of POSTS) {
    const [row] = await sql`
      insert into posteos (titulo, contenido, creador_id)
      values (${post.titulo}, ${post.contenido}, ${users[post.author].id})
      returning id
    `;
    postIds.push(row.id);
  }
  return postIds;
}

async function seedComments(users, postIds) {
  for (const comment of COMMENTS) {
    await sql`
      insert into comentarios (emisor_id, id_del_posteo, contenido)
      values (${users[comment.author].id}, ${postIds[comment.post]}, ${comment.contenido})
    `;
  }
}

async function seedFollows(users) {
  for (const [from, to] of FOLLOWS) {
    await sql`
      insert into seguimientos (id_mio, id_a_seguir)
      values (${users[from].id}, ${users[to].id})
    `;
  }
}

async function seedReposts(users, postIds) {
  for (const repost of REPOSTS) {
    await sql`
      insert into reposteos (posteo_id, reposteador_id)
      values (${postIds[repost.post]}, ${users[repost.user].id})
    `;
  }
}

async function main() {
  const users = await seedUsers();
  await seedDatosPersonales(users);

  const [{ count }] = await sql`
    select count(*)::int as count from posteos where creador_id = ${users[0].id}
  `;

  if (count > 0) {
    console.log('Seed content already present for demo users, skipping posts/comments/follows/reposts.');
  } else {
    const postIds = await seedPosts(users);
    await seedComments(users, postIds);
    await seedFollows(users);
    await seedReposts(users, postIds);
    console.log(`Seeded ${postIds.length} posts, ${COMMENTS.length} comments, ${FOLLOWS.length} follows, ${REPOSTS.length} reposts.`);
  }

  console.log('\nDemo accounts (password for all: "Password1"):');
  for (const user of users) {
    console.log(`  - ${user.email}`);
  }
}

main().catch(error => {
  console.error('Seed failed:', error.message || error);
  process.exit(1);
});
