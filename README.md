<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Logo_of_Twitter.svg" alt="Twitter Clone" width="180"/>
</p>

# Twitter Clone

## Descripción general

**Twitter Clone** es una red social moderna desarrollada con [Next.js 14](https://nextjs.org/), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) y un backend serverless sobre [Neon PostgreSQL](https://neon.tech/). La aplicación replica la experiencia de Twitter con publicaciones en tiempo real, sistema de seguidores, reposts y gestión de comments, apoyada en una arquitectura modular con estado global controlado por [Zustand](https://github.com/pmndrs/zustand). Incluye autenticación segura basada en JWT, servicios desacoplados y una suite de pruebas que garantizan la calidad del código.

---

## ⚙️ Características Principales

- **Autenticación y Sesiones Seguras:** Registro y login mediante endpoints Next.js con cookies firmadas por JWT (jose), persistiendo la sesión del usuario y sus credenciales.
- **Gestión de Publicaciones:** Creación, lectura y actualización dinámica de posteos con contador de likes, soporte para reposts y control de límites paginados.
- **Sistema de Seguidores:** Seguimiento bidireccional con verificación de amistad, listado de seguidores/mis seguidos y acciones para seguir/dejar de seguir.
- **Timeline Personalizado:** Feed con artículos propios y de usuarios seguidos, refresco automático mediante `change` flag y actualizaciones reactivas en el store.
- **Búsqueda Inteligente:** Motor de búsqueda unificado que filtra publicaciones y usuarios, con soporte para keywords parciales y filtros dinámicos.
- **Perfiles Dinámicos:** Páginas dedicadas a cada usuario con su actividad completa, datos personales, estadísticas y publicaciones recientes.
- **Comentarios e Interacciones:** Detalle de post con comentarios anidados, likes en tiempo real y utilidades para repostear contenido.
- **UI Responsive y Animada:** Interfaces diseñadas con SCSS modular, componentes reutilizables y animaciones suaves gracias a `motion/react`.
- **Pruebas Robustas:** Cobertura de hooks y componentes críticos con Jest + React Testing Library, enfocadas en servicios, formularios y flujos de datos.
- **Arquitectura Limpia:** Separación entre capas de presentación, infraestructura y dominio; servicios desacoplados y tipado consistente con TypeScript y Zod.

---

# 🧪 Guía de Pruebas End-to-End con Jest

Esta guía describe cómo ejecutar la batería completa de pruebas unitarias e integraciones ligeras que validan el comportamiento del **Twitter Clone**.

---

## 📦 Dependencias de Testing

| Herramienta                | Uso principal                                                |
|---------------------------|--------------------------------------------------------------|
| **Jest 30**               | Framework de testing para JavaScript/TypeScript              |
| **React Testing Library** | Renderizado y aserciones específicas de componentes React    |
| **@testing-library/jest-dom** | Matchers adicionales para DOM                           |
| **jest-environment-jsdom**| Emulación de entorno DOM para pruebas de hooks y componentes |

---

## ▶️ Ejecución Rápida

```bash
npm test          # Ejecuta la suite completa
npm run test:watch # Modo watch para desarrollo
npm run test:coverage # Genera reporte de cobertura
```

Cada suite se enfoca en los hooks principales (`useFeed`, `usePostForm`, `useHomeData`, `useUserData`, `usePostDetail`, `useSearch`) y en componentes críticos como `PosteoFeed`.

---

## 🔍 Escenarios Validables

- **Autenticación de formularios:** Verifica flujos de login/register y validación con Zod.
- **Gestión de publicaciones:** Confirma creación de posts, reinicio de formularios y sincronización con el store.
- **Feed y búsqueda:** Asegura llamadas al backend al montar, paginación por `limit` y relevancia de resultados.
- **Detalle de post:** Garantiza la carga de información, validación de seguidores y manejo de errores del servicio.
- **Hooks personalizados:** Comprueba side-effects, dependencias y estabilidad de referencias externas.

Para simular servicios HTTP se mockean los módulos de infraestructura y el store global de Zustand, desacoplando las pruebas del backend real.

---

## 🚀 Tecnologías Utilizadas

- **Framework:** Next.js 14, React 18, TypeScript 5
- **Gestión de Estado:** Zustand 5, React Context para modales
- **Estilos:** SCSS modular, fuentes personalizadas y assets SVG
- **Validación:** Zod para esquemas de formularios
- **Autenticación:** JWT + jose, cookies HTTP only
- **HTTP Client:** Axios con manejo centralizado de errores AxiosError
- **Persistencia:** Neon Serverless PostgreSQL (via HTTP API)
- **UI & Animaciones:** motion/react, react-icons, avvvatars-react
- **Notificaciones:** react-hot-toast
- **Testing:** Jest, React Testing Library, jest-dom, user-event

---

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos y migraciones](#base-de-datos-y-migraciones)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Gestión de Estado](#gestión-de-estado)
- [Hooks Personalizados](#hooks-personalizados)
- [Servicios](#servicios)
- [Pruebas](#pruebas)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/Lucascabral95/twitter-clone.git
   cd twitter-clone
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Duplicá el archivo `.env.example` (si no existe, crealo manualmente) y completá los valores correspondientes:

   ```env
   JWT_SECRET=tu_secreto
   DATABASE_URL=postgresql://usuario:password@host/neondb?sslmode=require
   ORIGINAL_URL=http://localhost:3000
   ```

4. **Crear el esquema de la base de datos**

   ```bash
   npm run db:migrate
   ```

   Ver la sección [Base de datos y migraciones](#base-de-datos-y-migraciones) para más detalle.

5. **(Opcional) Poblar la base con datos de ejemplo**

   ```bash
   npm run db:seed
   ```

6. **Levantar el entorno de desarrollo**

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`.

---

## Uso

- **Modo desarrollo:** `npm run dev`
- **Build producción:** `npm run build`
- **Servidor producción:** `npm start`
- **Analizar errores de lint:** `npm run lint`
- **Pruebas unitarias:** `npm test`
- **Migrar la base de datos:** `npm run db:migrate`
- **Poblar la base con datos de ejemplo:** `npm run db:seed`
- **Recrear la base desde cero (destructivo):** `npm run db:reset`

---

## Variables de entorno

| Variable       | Descripción                                      |
|----------------|--------------------------------------------------|
| `JWT_SECRET`   | Clave para firmar y validar JWT                   |
| `DATABASE_URL` | Cadena de conexión a Neon Serverless PostgreSQL   |
| `ORIGINAL_URL` | URL base utilizada para redirecciones y cookies   |

Variables opcionales del pool de conexiones (`src/services/db.ts`), todas con default sano si no se definen:

| Variable               | Default | Descripción                                              |
|------------------------|---------|-----------------------------------------------------------|
| `DB_POOL_MAX`          | `10`    | Máximo de conexiones simultáneas en el pool                |
| `DB_IDLE_TIMEOUT_MS`   | `30000` | Ms que una conexión ociosa espera antes de cerrarse         |
| `DB_CONN_TIMEOUT_MS`   | `5000`  | Ms de espera para obtener una conexión antes de fallar      |
| `DB_MAX_USES`          | `7500`  | Queries máximas por conexión antes de reciclarla            |
| `DB_RETRY_ATTEMPTS`    | `3`     | Reintentos ante errores transitorios de conexión            |
| `DB_RETRY_BASE_MS`     | `100`   | Delay base del backoff exponencial (con jitter)             |
| `DB_RETRY_MAX_MS`      | `2000`  | Tope del delay entre reintentos                             |

---

## Base de datos y migraciones

El proyecto no usa un ORM ni un framework de migraciones (Prisma, Drizzle, etc.): las consultas son SQL crudo en las clases DAO (`src/models/DAO/`). El **esquema completo** vive versionado en `sql/migrations/` y se aplica con scripts propios en `scripts/`, así que cambiar de base de datos (por ejemplo apuntar a una Neon nueva) es tan simple como correr un comando.

### Pool de conexiones

`src/services/db.ts` mantiene un `Pool` de `@neondatabase/serverless` (WebSocket, no el driver HTTP) cacheado en `globalThis` — una sola instancia por proceso, con reintentos con backoff exponencial + jitter ante errores transitorios de conexión (nunca ante violaciones de constraint o errores de sintaxis), health check (`GET /api/health`, público) y graceful shutdown en `SIGTERM`/`SIGINT` (`pool.end()` antes de salir). Los DAO no cambian: siguen llamando `const data = await db(); await data\`select ...\`` — el shim tagged-template preserva ese contrato. `scripts/migrate.mjs` y `scripts/seed.mjs` intencionalmente siguen usando el driver HTTP `neon()` (son procesos one-shot que abren y cierran; el pool no aporta ahí).

### Comandos

```bash
npm run db:migrate   # Crea las tablas/vistas que falten. Seguro e idempotente: se puede correr las veces que quieras.
npm run db:seed      # Puebla la base con datos de ejemplo (usuarios, posteos, comentarios, seguimientos, reposteos).
npm run db:reset     # DESTRUCTIVO: borra todas las tablas conocidas y vuelve a migrar + poblar. Pide confirmación ("yes").
```

### Cómo funciona

- `sql/migrations/*.sql` son snapshots de esquema numerados (`001_initial_schema.sql`, `002_...`, …), aplicados en orden.
- `scripts/migrate.mjs` registra cada migración aplicada en una tabla de control `schema_migrations`, así que solo ejecuta las que faltan. Correrlo sobre una base que ya tiene todo no rompe nada (usa `create table if not exists` / `create or replace view`).
- `scripts/seed.mjs` inserta un dataset de ejemplo (5 usuarios, posteos, comentarios, seguimientos y reposteos) y es seguro de re-ejecutar: si detecta que los usuarios demo ya tienen contenido, no duplica nada.
- `npm run db:reset` (`migrate.mjs --fresh` + `seed.mjs`) borra **todas** las tablas y vistas conocidas antes de recrear el esquema — pensado para desarrollo local, pide confirmación explícita para evitar borrar datos reales por accidente (usar `--force` para saltarla en CI).

### Cambiar de base de datos

1. Actualizá `DATABASE_URL` en `.env` apuntando a la Neon nueva (o cualquier Postgres compatible).
2. Corré `npm run db:migrate` — crea las 8 tablas (`usuarios`, `posteos`, `datos_personales`, `comentarios`, `reposteos`, `seguimientos`, `seguidores`, `refresh_tokens`) y las 4 vistas (`usuarios_posteos`, `comentarios_de_posteos_new`, `seguimientos_usuarios`, `reposteos_usuarios`) que usa la app.
3. (Opcional) Corré `npm run db:seed` para tener usuarios y contenido de prueba de entrada. Credenciales demo: cualquier email `*@seed.local` listado en la salida del comando, contraseña `Password1`.

### Agregar una migración nueva

Sumá un archivo `sql/migrations/00N_descripcion.sql` con sentencias idempotentes (`create table if not exists`, `create or replace view`, `alter table ... add column if not exists`, etc.) y corré `npm run db:migrate`; el runner detecta el archivo nuevo y solo aplica lo que falta.

---

## Estructura del proyecto

```bash
twitter-clone/
├── src/
│   ├── app/                   # Rutas Next.js (App Router)
│   │   ├── api/               # Endpoints serverless (auth, post, user, follows)
│   │   ├── feed/              # Feed principal y búsqueda
│   │   ├── home/              # Home autenticado, post detail y perfiles
│   │   ├── login/             # Ruta de autenticación
│   │   └── page.tsx           # Landing pública
│   ├── components/            # UI y widgets reutilizables
│   ├── infrastructure/        # Servicios, interfaces y constantes
│   ├── presentation/          # Hooks, layouts y lógica de presentación
│   ├── utils/                 # Helpers (likes, reposts, formateos)
│   └── zustand.tsx            # Store global
├── test/__mocks__/            # Mocks de librerías (Zustand, estilos, avatares)
├── public/                    # Assets estáticos (logos, imágenes)
├── jest.config.ts             # Configuración de testing
├── tsconfig.json              # Configuración TypeScript
└── next.config.mjs            # Configuración Next.js
```

---

## Arquitectura

El proyecto sigue principios de **Clean Architecture** y separación por capas:

1. **Presentación (`presentation/` + `components/` + `app/`):** Componentes React, hooks y layout responsables de la UI y los eventos del usuario.
2. **Infraestructura (`infrastructure/`):** Servicios HTTP (axios), contratos TypeScript, validaciones con Zod y constantes compartidas.
3. **Estado Global (`zustand.tsx`):** Orquestador central con acciones asíncronas, fetch de API y sincronización entre vistas.
4. **API Routes (`app/api/`):** Endpoints serverless en Next.js que interactúan con la base de datos Neon y exponen lógica de negocio.

Cada capa se comunica mediante interfaces tipadas y funciones puras, favoreciendo testabilidad y mantenibilidad.

---

## Rutas de la Aplicación

### Rutas Públicas

| Ruta              | Componente          | Descripción                                     |
|-------------------|---------------------|-------------------------------------------------|
| `/`               | Landing             | Página inicial con modales de login/register    |
| `/not-found`      | NotFound            | Página de error genérica                        |

### Rutas Protegidas

| Ruta                     | Componente           | Descripción                                         |
|--------------------------|----------------------|-----------------------------------------------------|
| `/home`                  | Home                 | Dashboard con estadísticas y feed personalizado     |
| `/home/user/[id]`        | UserID               | Perfil completo del usuario                         |
| `/home/post/[id]`        | PostDetail           | Detalle extendido del post y comentarios            |
| `/feed`                  | Feed                 | Timeline general y formulario de publicación        |
| `/feed/search`           | Search               | Resultados de búsqueda de usuarios/publicaciones    |

Middleware de autenticación (`middleware.ts`) asegura que las rutas protegidas sean accesibles únicamente con sesión válida.

---

## Gestión de Estado

El store global se define en `src/zustand.tsx` usando `create` de Zustand. Se encarga de:

- **Autenticación:** `getCookieLogueo`, `obtenerDatosDeCookie`.
- **Posts:** `getAllTweets`, `addTweet`, `getTweetsByID`, `getTweetsByIDUser`, `getTweetsOfHome`.
- **Seguidores:** `getMisSeguidos`, `obtenerSeguidores`, `seguirUsuario`, `eliminarSeguimiento`, `existeEnMiListaDeAmigos`.
- **Búsqueda:** `obtenerResultadosDeBusqueda` con filtros dinámicos.
- **Estado UI:** Flags `loading`, `error`, `change`, `limit`, `limitFeed`.

Ejemplo simplificado:

```ts
const useStore = create<StoreState>((set, get) => ({
  posteos: [],
  datosLogueo: {} as Logueo,
  getAllTweets: async () => {
    set({ loading: true });
    const { data } = await axios.get('/api/posteo');
    set({ posteos: data.result, loading: false });
  },
  addTweet: async () => {
    await get().getCookieLogueo();
    await get().getAllTweets();
    set({ change: !get().change });
  },
  obtenerResultadosDeBusqueda: async ({ busqueda, tipoDeBusqueda }) => {
    const endpoint = tipoDeBusqueda === 'usuarios' ? '/api/usuario' : '/api/posteo';
    const { data } = await axios.get(endpoint);
    const lower = busqueda.toLowerCase();
    set({ arrayDeBusqueda: data.result.filter(item =>
      ['nombre', 'email', 'titulo', 'contenido']
        .some(key => item[key]?.toLowerCase().includes(lower))
    ) });
  },
}));
```

---

## Hooks Personalizados

- **`useAuthModals`**: Controla los modales de login y registro en la landing.
- **`useRegister` / `useLogin`**: Gestionan formularios, validación con Zod y consumo de `authService`.
- **`useFeed`**: Obtiene posts del timeline y sincroniza con cambios de `limit`.
- **`usePostForm`**: Maneja el formulario de creación de posteo, reseteo de campos y toast de feedback.
- **`useHomeData`**: Carga datos personales, seguidores, seguidos y feed del usuario autenticado.
- **`useSearch`**: Orquesta filtros de búsqueda y actualiza resultados en tiempo real.
- **`useUserData`**: Recupera información del perfil y publicaciones de un usuario específico.
- **`usePostDetail`**: Trae el detalle de un post, verifica amistades y gestiona estados de error.

Cada hook se encuentra testeado en `src/presentation/hooks/__tests__` y se integra con el store global y servicios HTTP.

---

## Servicios

Los servicios de infraestructura encapsulan las llamadas a la API:

- **`authService.service.ts`**: Login y registro con manejo de toast y AxiosError.
- **`postService.service.ts`**: Creación de posts, con respuestas tipadas y manejo de errores.
- **`postDetailService.service.ts`**: Obtiene detalle completo del post por ID.
- **`userService.service.ts`**: Recupera información de usuario y relaciones.

Todos retornan objetos con la forma `{ success: boolean; data?: T; error?: string }` para simplificar la lógica de presentación.

---

## Pruebas

La carpeta `src/presentation/hooks/__tests__` incluye suites para cada hook clave y para componentes como `PosteoFeed`.

Puntos destacados:

- Mock dedicado de Zustand en `test/__mocks__/zustand.ts` con helpers `__setMockState` y `__resetMockState`.
- Mock de servicios (`postService`, `userService`, `postDetailService`) para aislar efectos secundarios.
- Verificación de side-effects (`toast.success`, `toast.error`), resets de formularios y control de `isLoading`.
- Cobertura sobre flujos felices y de error, garantizando robustez en escenarios reales.

Ejecutá `npm test` para asegurar que todo se mantiene estable antes de publicar.

---

## Contribuciones

¡Las contribuciones son bienvenidas! Para colaborar:

1. Fork del repositorio y creación de rama (`git checkout -b feature/nueva-feature`).
2. Implementar cambios con pruebas correspondientes.
3. Seguir las convenciones de [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `test:`, `docs:`...).
4. Abrir un Pull Request describiendo los cambios y adjuntando evidencia (capturas/tests).

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Consultá el archivo `LICENSE` si necesitás más detalles.

---

## 📬 Contacto

- **Autor:** Lucas Cabral
- **Email:** lucassimple@hotmail.com
- **LinkedIn:** [lucas-gastón-cabral](https://www.linkedin.com/in/lucas-gastón-cabral/)
- **Portafolio:** [https://portfolio-web-dev-git-main-lucascabral95s-projects.vercel.app/](https://portfolio-web-dev-git-main-lucascabral95s-projects.vercel.app/)
- **GitHub:** [@Lucascabral95](https://github.com/Lucascabral95)

---

<p align="center">
  Desarrollado con ❤️ por Lucas Cabral
</p>

