import { getRelativeLocaleUrl } from "astro:i18n";

export type Locale = "en" | "es";
export const defaultLocale: Locale = "en";

export const ui = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      results: "Results",
      blog: "Blog",
      projects: "Projects",
      contact: "Contact",
      toggleMenu: "Toggle menu",
      themeLabel: "Theme",
      themeLight: "Light",
      themeSystem: "System",
      themeDark: "Dark",
      langLabel: "Language",
    },
    footer: {
      explore: "Explore",
      social: "Social",
      source: "Source",
      sourceLink: "Check the code of this website here",
      madeWith: "Made with Astro and Tailwind CSS.",
      copyright:
        "© 2026 Luzzio. Code under MIT License. All rights reserved for content and multimedia.",
    },
    hero: {
      contactMe: "Contact Me",
      dev: {
        label: "Full-Stack Developer",
        desc: "Specializing in UI/UX design & web development, but capable of anything. Always looking for the optimal architectural route.",
        cta: "View Services",
      },
      fgc: {
        label: "FGC Competitor",
        desc: "Competitive fighting game player. Maining Juri in SF6 and Robo-Ky in GGST. Always looking for the optimal combo route.",
        cta: "View Results",
      },
      creator: {
        label: "Content Creator",
        desc: "Live streaming high-level gameplay, tournament brackets, and more. Always looking for the optimal route to throw for content.",
        cta: "Watch Live",
      },
    },
    home: {
      aboutTitle: "About Me",
      devCallout: "> Check some of the stuff I make:",
      devProjectsTitle: "Dev Projects",
      devProjectsDesc:
        "See some of the best projects I've built (both open and closed source!).",
      devServicesTitle: "Services",
      devServicesDesc: "Need a custom solution? Let's talk!",
      fgcCallout: "> See me in bracket:",
      fgcResultsTitle: "Tournament Results",
      fgcResultsDesc: "Watch my tournament results (pulled from start.gg).",
      creatorCallout: "> Get into the broadcast:",
      youtubeDesc: "VODs, stream highlights, and longer form content.",
      tiktokDesc: "Short clips and stream's best (and worst) moments.",
      blogTitle: "Blog",
      blogDesc:
        "Here I talk about tech guides, dev logs, personal anecdotes, and anything that comes to mind.",
      blogPrev: "Previous",
      blogNext: "Next",
      viewAll: "View All",
      viewAllDesc: "Explore the rest of the articles",
    },
    twitch: {
      title: "Watch me live on Twitch!",
      desc: "I don't have a schedule but you can see if I'm online here",
      offline: "Offline",
      live: "Live",
    },
    services: {
      pageTitle: "Services",
      heading: "Services",
      subtitle:
        "Custom software development. Explore the areas of specialization and request a technical proposal.",
      cards: {
        staticTitle: "Static Website",
        staticDesc: "Perfect for portfolios, campaigns and many more.",
        webappTitle: "Web App",
        webappDesc:
          "Dynamic platforms with databases, authentication and complex logic.",
        odooTitle: "Custom Odoo Module",
        odooDesc:
          "Custom Odoo module development to adapt the ERP to your company.",
        devopsTitle: "DevOps & Servers",
        devopsDesc:
          "Linux environment configuration, containers and VPS deployments for existing projects.",
        creatorTitle: "Creator Tools",
        creatorDesc:
          "Dynamic overlays, bots and API integrations for your streams.",
        customTitle: "Custom Request",
        customDesc:
          "Do you have something else in mind? Describe your needs in the quotation and I'll see if I can make it happen.",
      },
      quoteHeading: "Get a quote for your project",
      quoteSubtitle:
        "Fill the form to evaluate the technical requirements and the initial scope of the project.",
      form: {
        name: "Name",
        email: "Email",
        service: "Service",
        servicePlaceholder: "Select a Service...",
        optStatic: "Static Website",
        optWebapp: "Web App",
        optOdoo: "Custom Odoo Module",
        optDevops: "DevOps / Servers",
        optCreator: "Creator Tools",
        optCustom: "Custom quotation",
        deadline: "Deadline (Optional)",
        deadlinePlaceholder:
          "Specify your ideal timeframe, target date, or flexibility",
        details: "Project Details",
        detailsPlaceholder:
          "Briefly describe the project's objective, key features, and expectations",
        submit: "Submit Request",
        sending: "Sending...",
        connError: "Connection failed. Please try again.",
      },
    },
    contact: {
      pageTitle: "Contact",
      heading: "Contact",
      subtitle:
        "Whether you want to talk about code, invite me to a tournament, or collaborate on a stream, I'm always open to connect. Drop a message!",
      emailHeading: "Email",
      copyEmailAria: "Copy Email",
      softwareHeading: "Looking for a custom software solution?",
      softwareDesc:
        "If you need custom software development, please use the formal quotation form.",
      goToServices: "Go to Services",
      form: {
        name: "Name",
        email: "Email",
        topic: "What are you interested in?",
        topicPlaceholder: "Select a topic...",
        optDev: "Software Development & Tech",
        optFgc: "Fighting Games & Tournaments",
        optCreator: "Content Creation & Collabs",
        optOther: "Other",
        message: "Message",
        submit: "Send Message",
        sending: "Sending...",
        connError: "Connection failed. Please try again.",
      },
    },
    blog: {
      pageTitle: "Blog",
      heading: "Blog",
      subtitle:
        "Tech guides, dev logs, personal anecdotes, and everything in between.",
      searchPostsPlaceholder: "Search posts...",
      searchPostsAria: "Search posts",
      categoryLabel: "Category:",
      allPosts: "All Posts",
      projectDevlogs: "Project Devlogs",
      tournamentBlogs: "Tournament Blogs",
      tagsLabel: "Tags:",
      filterTagsPlaceholder: "Filter tags...",
      filterTagsAria: "Filter tags",
      noTagsMsg: "No matching tags",
      moreTagsTemplate: "+{count} more",
      showLess: "Show less",
      clearTags: "Clear tags",
      emptyState: "No posts found matching the selected filters.",
      publishedOn: "Published on:",
    },
    results: {
      pageTitle: "Results",
      heading: "Results",
      subtitle:
        "My 20 most recent tournament results (excluding where I DQed). Pulled directly from start.gg.",
      emptyState: "No results found or connection error.",
      logoAlt: "Logo of",
      placement: "Placement:",
      relatedPosts: "Related Posts:",
    },
    projects: {
      pageTitle: "Projects",
      heading: "Projects",
      subtitle:
        "A curated selection of my open-source repositories and private architectures, pulled directly from GitHub.",
      emptyState: "No projects found or connection error.",
      privateBadge: "Private",
      updated: "Updated",
      readMore: "Read more",
      showLess: "Show less",
      relatedPosts: "Related Posts:",
    },
    pagination: {
      navAria: "Pagination",
      prevAria: "Previous page",
      nextAria: "Next page",
      prev: "Prev",
      next: "Next",
      pageOf: "Page {current} of {total}",
      pageTitleSuffix: "Page",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      services: "Servicios",
      results: "Resultados",
      blog: "Blog",
      projects: "Proyectos",
      contact: "Contacto",
      toggleMenu: "Alternar menú",
      themeLabel: "Tema",
      themeLight: "Claro",
      themeSystem: "Sistema",
      themeDark: "Oscuro",
      langLabel: "Idioma",
    },
    footer: {
      explore: "Explorar",
      social: "Redes",
      source: "Código",
      sourceLink: "Mira el código de esta página web aquí",
      madeWith: "Hecho con Astro y Tailwind CSS.",
      copyright:
        "© 2026 Luzzio. Código bajo Licencia MIT. Todos los derechos reservados para el contenido y multimedia.",
    },
    hero: {
      contactMe: "Contáctame",
      dev: {
        label: "Desarrollador Full-Stack",
        desc: "Especializado en diseño UI/UX y desarrollo web, pero capaz de todo. Siempre buscando la arquitectura óptima.",
        cta: "Ver Servicios",
      },
      fgc: {
        label: "Competidor FGC",
        desc: "Jugador competitivo de fighting games. Main Juri en SF6 y Robo-Ky en GGST. Siempre buscando el combo óptimo.",
        cta: "Ver Resultados",
      },
      creator: {
        label: "Creador de Contenido",
        desc: "Streams en vivo de gameplay de alto nivel, brackets de torneos y más. Siempre buscando la manera óptima de trolear por contenido.",
        cta: "Ver en Vivo",
      },
    },
    home: {
      aboutTitle: "Sobre Mí",
      devCallout: "> Mira algunas de las cosas que hago:",
      devProjectsTitle: "Proyectos de Desarrollo",
      devProjectsDesc:
        "Explora algunos de los mejores proyectos que he construido (¡tanto open source como privados!).",
      devServicesTitle: "Servicios",
      devServicesDesc: "¿Necesitas una solución a medida? ¡Hablemos!",
      fgcCallout: "> Mírame en bracket:",
      fgcResultsTitle: "Resultados de Torneos",
      fgcResultsDesc:
        "Revisa mis resultados de torneos (extraídos de start.gg).",
      creatorCallout: "> Entra a la transmisión:",
      youtubeDesc: "VODs, mejores momentos del stream y contenido extenso.",
      tiktokDesc: "Clips cortos y los mejores (y peores) momentos del stream.",
      blogTitle: "Blog",
      blogDesc:
        "Aquí hablo sobre guías técnicas, devlogs, anécdotas personales y cualquier cosa que se me ocurra.",
      blogPrev: "Anterior",
      blogNext: "Siguiente",
      viewAll: "Ver Todo",
      viewAllDesc: "Explora el resto de los artículos",
    },
    twitch: {
      title: "¡Mírame en vivo en Twitch!",
      desc: "No tengo horario fijo, pero aquí puedes ver si estoy en directo",
      offline: "Offline",
      live: "En Vivo",
    },
    services: {
      pageTitle: "Servicios",
      heading: "Servicios",
      subtitle:
        "Desarrollo de software a medida. Explora las áreas de especialización y solicita una propuesta técnica.",
      cards: {
        staticTitle: "Sitio Web Estático",
        staticDesc: "Ideal para portafolios, campañas, landing pages y más.",
        webappTitle: "Aplicación Web",
        webappDesc:
          "Plataformas dinámicas con bases de datos, autenticación y lógica compleja.",
        odooTitle: "Módulo de Odoo a Medida",
        odooDesc:
          "Desarrollo de módulos personalizados en Odoo para adaptar el ERP a tu empresa.",
        devopsTitle: "DevOps y Servidores",
        devopsDesc:
          "Configuración de entornos Linux, contenedores y despliegues en VPS para proyectos existentes.",
        creatorTitle: "Herramientas para Creadores",
        creatorDesc:
          "Overlays dinámicos, bots e integraciones con APIs para tus streams.",
        customTitle: "Solicitud Personalizada",
        customDesc:
          "¿Tienes otra idea en mente? Describe tus necesidades en la cotización y veremos cómo hacerlo realidad.",
      },
      quoteHeading: "Cotiza tu proyecto",
      quoteSubtitle:
        "Completa el formulario para evaluar los requerimientos técnicos y el alcance inicial del proyecto.",
      form: {
        name: "Nombre",
        email: "Correo electrónico",
        service: "Servicio",
        servicePlaceholder: "Selecciona un servicio...",
        optStatic: "Sitio Web Estático",
        optWebapp: "Aplicación Web",
        optOdoo: "Módulo de Odoo a Medida",
        optDevops: "DevOps / Servidores",
        optCreator: "Herramientas para Creadores",
        optCustom: "Cotización personalizada",
        deadline: "Plazo estimado (Opcional)",
        deadlinePlaceholder:
          "Especifica tu plazo ideal, fecha objetivo o disponibilidad",
        details: "Detalles del Proyecto",
        detailsPlaceholder:
          "Describe brevemente el objetivo del proyecto, funciones clave y expectativas",
        submit: "Enviar Solicitud",
        sending: "Enviando...",
        connError: "Error de conexión. Por favor, inténtalo de nuevo.",
      },
    },
    contact: {
      pageTitle: "Contacto",
      heading: "Contacto",
      subtitle:
        "Ya sea que quieras hablar de código, invitarme a un torneo o colaborar en un stream, siempre estoy abierto a conectar. ¡Déjame un mensaje!",
      emailHeading: "Correo electrónico",
      copyEmailAria: "Copiar correo",
      softwareHeading: "¿Buscas una solución de software a medida?",
      softwareDesc:
        "Si necesitas desarrollo de software personalizado, por favor utiliza el formulario formal de cotización.",
      goToServices: "Ir a Servicios",
      form: {
        name: "Nombre",
        email: "Correo electrónico",
        topic: "¿En qué estás interesado?",
        topicPlaceholder: "Selecciona un tema...",
        optDev: "Desarrollo de Software y Tecnología",
        optFgc: "Juegos de Pelea y Torneos",
        optCreator: "Creación de Contenido y Colaboraciones",
        optOther: "Otro",
        message: "Mensaje",
        submit: "Enviar Mensaje",
        sending: "Enviando...",
        connError: "Error de conexión. Por favor, inténtalo de nuevo.",
      },
    },
    blog: {
      pageTitle: "Blog",
      heading: "Blog",
      subtitle:
        "Guías técnicas, devlogs, anécdotas personales y mucho más.",
      searchPostsPlaceholder: "Buscar artículos...",
      searchPostsAria: "Buscar artículos",
      categoryLabel: "Categoría:",
      allPosts: "Todos",
      projectDevlogs: "Devlogs de Proyectos",
      tournamentBlogs: "Blogs de Torneos",
      tagsLabel: "Etiquetas:",
      filterTagsPlaceholder: "Filtrar etiquetas...",
      filterTagsAria: "Filtrar etiquetas",
      noTagsMsg: "Sin etiquetas coincidentes",
      moreTagsTemplate: "+{count} más",
      showLess: "Mostrar menos",
      clearTags: "Limpiar",
      emptyState:
        "No se encontraron artículos que coincidan con los filtros seleccionados.",
      publishedOn: "Publicado el:",
    },
    results: {
      pageTitle: "Resultados",
      heading: "Resultados",
      subtitle:
        "Mis 20 resultados de torneos más recientes (excluyendo DQs). Extraídos directamente de start.gg.",
      emptyState: "No se encontraron resultados o hubo un error de conexión.",
      logoAlt: "Logo de",
      placement: "Posición:",
      relatedPosts: "Artículos relacionados:",
    },
    projects: {
      pageTitle: "Proyectos",
      heading: "Proyectos",
      subtitle:
        "Una selección curada de mis repositorios open-source y arquitecturas privadas, extraída directamente de GitHub.",
      emptyState: "No se encontraron proyectos o hubo un error de conexión.",
      privateBadge: "Privado",
      updated: "Actualizado el",
      readMore: "Leer más",
      showLess: "Mostrar menos",
      relatedPosts: "Artículos relacionados:",
    },
    pagination: {
      navAria: "Paginación",
      prevAria: "Página anterior",
      nextAria: "Página siguiente",
      prev: "Ant.",
      next: "Sig.",
      pageOf: "Página {current} de {total}",
      pageTitleSuffix: "Página",
    },
  },
} as const;

export function getLocale(currentLocale: string | undefined): Locale {
  return currentLocale === "es" ? "es" : defaultLocale;
}

export function useTranslations(lang: Locale) {
  return ui[lang] ?? ui[defaultLocale];
}

export function localizePath(path: string, lang: Locale = defaultLocale): string {
  const cleanPath = path.replace(/^\/es(?=\/|$)/, "") || "/";
  const url = getRelativeLocaleUrl(lang, cleanPath);
  return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}

export function formatDate(date: Date, lang: Locale): string {
  return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}