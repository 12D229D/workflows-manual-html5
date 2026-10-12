# Plan y Bitácora — Manual y Guía de Workflows (HTML5)

## 📌 Resumen
SPA interactiva de guía de workflows de desarrollo (HTML5 semántico + CSS3 Vanilla + JS ES6+, sin dependencias externas ni `node_modules`). Cada workflow sigue una metodología estructurada de **10 bloques canónicos** (Objetivo, Cuándo utilizarlo, Roles, Pasos, Herramientas, Ejemplos, Puntos de control, Errores frecuentes, Métricas de éxito y Checklist final).

## 🎯 Objetivos
- [x] Proveer una SPA responsiva, accesible y de alto nivel visual para la consulta de flujos de trabajo en desarrollo de software.
- [x] Implementar temas claro y oscuro persistentes con detector/selector en la cabecera.
- [x] Incluir navegación SPA basada en hash (`#introduccion`, `#git-flow`, `#trunk-based`, `#github-flow`, `#gitlab-flow`, `#release-flow`, `#asistente`).
- [x] Incluir buscador en tiempo real (`Ctrl+K`) y seguimiento de progreso de lectura persistente.
- [x] Proveer un Asistente/Wizard interactivo para recomendar el workflow óptimo según tamaño de equipo, frecuencia de deploy y tipo de producto.
- [x] Incluir checklists interactivos persistentes por cada workflow.

## 🏗️ Arquitectura de Archivos
```text
manual-workflow-html5/
├── index.html         # Shell SPA, sidebar de navegación, buscador y secciones de contenido
├── css/
│   └── styles.css     # Design tokens (dark/light), layout, tarjetas, wizard y responsive
├── js/
│   └── app.js         # Módulos initTheme, initNavigation, initSearch, initCodeCopy, initProgressTracking, initChecklists, initWizard, initMobileMenu, initShortcuts
├── README.md          # Documentación general de uso
└── plan.md            # Plan de trabajo y bitácora del subproyecto
```

## 📊 Estado Actual

### Implementado `[x]`
- [x] Shell HTML5 semántico (`<header>`, `<aside>`, `<main>`, `<section>`, `<footer>`) con a11y (`.skip-link`, `aria-*`).
- [x] Sistema de estilos con CSS Custom Properties, paleta slate/indigo/cyan, microinteracciones y modo oscuro/claro.
- [x] Router SPA vanilla por hash de URL con breadcrumb dinámico y barra de progreso de lectura.
- [x] Búsqueda interactiva con filtrado en tiempo real y atajo de teclado `Ctrl+K`.
- [x] Botones de copia de fragmentos de código con feedback visual.
- [x] Sección 1: Introducción a los Workflows y la metodología de los 10 bloques.
- [x] Sección 2: Git Flow (10 bloques metodológicos + checklist interactivo).
- [x] Sección 3: Trunk-Based Development (10 bloques metodológicos + checklist interactivo).
- [x] Sección 4: GitHub Flow (10 bloques metodológicos + checklist interactivo).
- [x] Sección 5: GitLab Flow (10 bloques metodológicos + checklist interactivo).
- [x] Sección 6: Release Flow (10 bloques metodológicos + checklist interactivo).
- [x] Sección 7: Asistente Interactivo (Wizard) con recomendador inteligente de workflows.
- [x] Menú drawer responsive en dispositivos móviles (<992px) con overlay interactivo.

### Completado / Futuras Mejoras `[x]`
- [x] Exportación de checklists completados a formato Markdown / JSON.
- [x] Integración de diagramas de secuencia visuales SVG o Mermaid interactivos por cada flujo.

## 🚀 Cómo Ejecutar
No requiere instalación ni proceso de build.
```bash
# Navegar a la carpeta e iniciar servidor HTTP estático
cd manual-workflow-html5
python -m http.server 8080
```
O abrir directamente `index.html` en cualquier navegador web.

## 📜 Historial de Cambios
- **2026-07-29**: Creación inicial del esqueleto SPA y secciones demo (`Git Flow`, `Trunk-Based`).
- **2026-07-29**: Incorporación de `GitHub Flow`, `GitLab Flow`, `Release Flow`, implementación completa del Wizard interactivo de recomendación de workflows y sincronización de `plan.md` y `PLANS-STATUS.md`.

## ?? Paradigma de Programaci�n

- **H�brido: Declarativo + Event-Driven**
- Basado en componentes declarativos (UI) y manejo de eventos para la interacci�n.



---

## 🧠 Paradigma de Programación

- **Híbrido: Declarativo + Event-Driven**
- Vistas declarativas por hash y reactividad por eventos DOM para el wizard de recomendación y los checklists interactivos.

---

## 🌐 Propósito de Visibilidad y Destino Remoto

- **Visibilidad**: Público (Open Source / Portafolio).
- **Plataforma Remota Asignada**: GitHub.
- **Plataforma de Despliegue CI/CD**: GitHub Pages / Cloudflare Pages.
- **Justificación**: Guía interactiva de workflows de desarrollo y branching Git (Git Flow, Trunk-Based, GitHub Flow) con wizard recomendador; ideal para GitHub Pages.

---

## 📊 Estado Actual

🟢 **Completado** — Entregable interactivo verificado.
