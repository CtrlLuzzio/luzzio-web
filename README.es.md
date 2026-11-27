> ENGLISH README [HERE](README.md)
# luzzio-web

Este repositorio contiene el código fuente de (enlace del sitio web en progreso), un sitio web construido con Astro que funciona como blog personal y portafolio profesional abarcando mis múltiples disciplinas: Desarrollador de Software, Jugador Competitivo de Juegos de Pelea y Creador de Contenido.

## Características

* **Identidad Multidisciplinaria:** Selector de perfil interactivo (*Dev / FGC / Creator*) en la página principal con persistencia de sesión.
* **Internacionalización (i18n):** Soporte bilingüe completo (Inglés / Español) con autodetección de idioma y rutas localizadas.
* **Sistema de Temas:** Paletas [**Catppuccin**](https://catppuccin.com/) ([Mocha](https://catppuccin.com/palette/#flavor-mocha) y [Latte](https://catppuccin.com/palette/#flavor-latte)) con detección de preferencia del sistema y persistencia sin parpadeos (*FOUC*).
* **Integraciones Dinámicas:**
  * **GitHub API (SSG):** Listado automático de proyectos con renderizado sanitizado de sus `README` y soporte para repositorios privados.
  * **start.gg GraphQL API:** Historial de resultados competitivos vinculados automáticamente con artículos del blog.
  * **Twitch API:** Indicador de estado en vivo mediante `Astro Actions`.
* **Blog Interactivo:** Colecciones tipadas con *Content Layer API*, búsqueda en tiempo real, filtros combinados por categoría/etiquetas y paginación.
* **Embudo de Servicios y Contacto:** Catálogo interactivo con preselección automática en el formulario, validación con `Zod` y notificaciones vía **Resend** y **Discord Webhooks**.
* **Rendimiento y Accesibilidad:** Páginas pre-renderizadas (SSG), *View Transitions* (`<ClientRouter />`), etiquetas SEO/OpenGraph, sitemap bilingüe y navegación accesible por teclado.

## Stack Técnico

* **Framework y Lenguaje:** [Astro](https://astro.build/), [TypeScript](https://www.typescriptlang.org/)
* **Estilos e Íconos:** [Tailwind CSS v4](https://tailwindcss.com/), [Catppuccin](https://catppuccin.com/), [Tabler Icons](https://tabler.io/icons) (`astro-icon`)
* **Backend y Validación:** Astro Actions, [Zod](https://zod.dev/), [Resend](https://resend.com/), Discord Webhooks
* **APIs:** GitHub REST API, start.gg GraphQL API, Twitch Helix API
* **Despliegue:** [Cloudflare](https://www.cloudflare.com/) (`@astrojs/cloudflare`)

## Desarrollo Local

### Prerrequisitos

* [Node.js](https://nodejs.org/) (v20+ recomendado)
* [pnpm](https://pnpm.io/) *(gestor de paquetes recomendado; el proyecto incluye `pnpm-lock.yaml`)*
* *(Opcional)* [Nix](https://nixos.org/) con soporte para Flakes (`nix develop`) o `direnv` usando `.envrc.example`.

### Configuración y Ejecución

1. **Clona el repositorio e instala las dependencias:**

```bash
git clone https://github.com/CtrlLuzzio/luzzio-web.git
cd luzzio-web
pnpm install
```

2. **Configura las variables de entorno:**

Copia el archivo de ejemplo y rellena tus credenciales locales (APIs de GitHub, start.gg, Twitch, etc.):

```sh
# Linux / macOS / PowerShell
cp .env.example .env

# Windows (CMD)
copy .env.example .env
```

3. **Inicia el servidor de desarrollo:**

```bash
pnpm dev
```

### Comandos Disponibles

| Comando | Acción |
| :--- | :--- |
| `pnpm dev` | Inicia el servidor de desarrollo local en `localhost:4321` |
| `pnpm astro check` | Ejecuta el diagnóstico de TypeScript y Astro |
| `pnpm build` | Compila el sitio para producción en `./dist/` |
| `pnpm preview` | Previsualiza localmente el build de producción |

<details>
<summary>Equivalentes con npm/npx, Yarn y Bun</summary>

> **Nota:** Usar otro gestor distinto a `pnpm` ignorará `pnpm-lock.yaml` y puede instalar versiones ligeramente distintas de las dependencias.

| Acción | npm / npx | Yarn | Bun |
| :--- | :--- | :--- | :--- |
| Instalar dependencias | `npm install` | `yarn install` | `bun install` |
| Servidor de desarrollo | `npm run dev` | `yarn dev` | `bun run dev` |
| Diagnóstico (check) | `npx astro check` | `yarn astro check` | `bunx astro check` |
| Build de producción | `npm run build` | `yarn build` | `bun run build` |
| Vista previa | `npm run preview` | `yarn preview` | `bun run preview` |

</details>

## Declaración de Uso de IA

Este sitio web fue construido con la asistencia de IA (Gemini, para ser exactos), actuando como *pair-programmer* y consultor técnico.

Aunque la IA fue una herramienta valiosa para acelerar el flujo de trabajo, mantuve el control total sobre el proyecto. Todas las decisiones arquitectónicas clave, elecciones de diseño, selección del stack tecnológico, contenido editorial e implementaciones finales fueron dirigidas, revisadas y autorizadas estrictamente por mí.

En aras de la transparencia, aquí hay un desglose de cómo se integró la IA en el flujo de trabajo:

* **Discusiones sobre Arquitectura y UI/UX:** Validación e intercambio de conceptos de diseño, maquetación responsiva y jerarquía visual en todo el sitio.
* **Backend e Integraciones:** Asistencia en la configuración de `Astro Actions`, esquemas de `Zod`, sanitización de entradas y conexión segura con APIs externas sin exponer credenciales.
* **Debugging, Auditorías y Refactorización:** Resolución de errores de tipado y estilos, modularización de scripts cliente y revisiones de rendimiento, SEO y accesibilidad (`a11y`).
* **Copywriting e i18n:** Refinamiento de textos en inglés y español, corrigiendo falsos amigos y matices de traducción.

**TL;DR:** Yo ya conocía el camino; la IA solo me ayudó a llegar más rápido.

## Licencia

El código fuente (layouts, componentes, scripts, etc.) de este sitio web está bajo la [Licencia MIT](LICENSE).

Sin embargo, todo su contenido (artículos del blog, fotografías, la marca personal **Luzzio**, recursos visuales originales, etc.) está protegido por derechos de autor (Copyright © 2026 Luzzio) y no puede ser reproducido, distribuido ni reutilizado sin autorización explícita.

**Nota:** Las propiedades intelectuales, personajes, logotipos de torneos y marcas comerciales de terceros pertenecen a sus respectivos dueños y no están cubiertas por estos derechos de autor.