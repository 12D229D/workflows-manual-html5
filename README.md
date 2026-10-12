# Manual y Guía de Workflows — HTML5

Un manual interactivo de **workflows de desarrollo** construido con **HTML5 semántico, CSS3 moderno y JavaScript vanilla (ES6+)**, sin frameworks ni dependencias de `node_modules`.

Cada workflow documentado sigue una **metodología de 10 bloques canónicos**: objetivo, cuándo usarlo, roles y responsabilidades, pasos detallados, herramientas, plantillas/ejemplos, puntos de control, errores frecuentes, métricas de éxito y checklist final.

## 🌟 Características Principales

- **Navegación SPA de Alta Fidelidad**: Carga dinámica de secciones sin recargar la página, sincronizada con el hash de la URL (`#introduccion`, `#git-flow`, `#trunk-based`, ...).
- **Modo Oscuro / Claro Persistente**: Toggle de tema con persistencia automática en `localStorage` (oscuro por defecto).
- **Búsqueda en Tiempo Real**: Filtrado de la navegación al escribir palabras clave, con atajo de teclado **`Ctrl` + `K`**.
- **Copia de Código**: Botón interactivo para copiar fragmentos de código con retroalimentación visual (`¡Copiado!`).
- **Seguimiento de Progreso**: Indicador porcentual dinámico que calcula las secciones leídas/completadas guardando el progreso en `localStorage`.
- **Checklists Interactivos**: Cada workflow termina con un checklist persistente (guardado en `localStorage`).
- **Accesibilidad**: `<a class="skip-link">` para saltar al contenido, `aria-label`/`aria-selected` en navegación, foco visible y respeto a `prefers-reduced-motion`.
- **Diseño Responsive**: Barra lateral fija en escritorio y menú tipo "drawer" con botón hamburguesa y overlay en móvil.

## 📁 Estructura del Proyecto

```text
manual-workflow-html5/
├── index.html         # Estructura semántica HTML5 y contenido del manual (SPA)
├── css/
│   └── styles.css     # Variables CSS (dark/light), layout, componentes y a11y
├── js/
│   └── app.js         # Router de hash, búsqueda, copiado, progreso, checklists, mobile, atajos
├── README.md          # Documentación del proyecto
└── plan.md            # Bitácora y plan de desarrollo
```

## 🚀 Cómo Visualizar o Ejecutar

No requiere servidores de compilación ni dependencias de `node_modules`.

1. Abre directamente el archivo `index.html` en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).
2. O bien sírvelo localmente con cualquier servidor estático:
   ```bash
   # Opción con Python:
   cd manual-workflow-html5
   python -m http.server 8080

   # Opción con npx:
   npx serve .
   ```

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl` + `K` | Enfocar la barra de búsqueda del sidebar |
| `Esc` | Limpiar la búsqueda / cerrar el menú móvil |
| `Tab` | Navegación accesible (aparece el enlace "Saltar al contenido") |

## 📚 Contenido Incluido

Esta versión del manual incluye la guía completa y el asistente interactivo:

1. **Introducción a los Workflows** — Qué es un workflow y los 10 bloques canónicos de la metodología.
2. **Git Flow** — Flujo clásico de ramas para releases planificadas.
3. **Trunk-Based Development** — Flujo de integración continua rápido para CD.
4. **GitHub Flow** — Flujo de ramas simple basado en Pull Requests para entrega ágil.
5. **GitLab Flow** — Integración simplificada orientada a entornos fijos (Staging/Production).
6. **Release Flow** — Flujo empresarial con ramas dedicadas para estabilizar sprints periódicos.
7. **Asistente de Selección** — Un calculador inteligente (Wizard) para encontrar el flujo óptimo para tu equipo.

## 🎨 Notas de Diseño

- **Paleta**: slate con acento índigo `#6366f1` y cian `#06b6d4` (consistente con otros manuales del portafolio Codex).
- **Tipografía**: *Inter* (sans) + *Fira Code* (mono), desde Google Fonts.
- **Glassmorphism sutil**: `backdrop-filter: blur(8px)` en el header sticky y glow en el brand-icon.
- **Microinteracciones**: hover con `translateY` en cards, transición `cubic-bezier(0.4,0,0.2,1)`.

## 🔗 Ver también

- [`PLANS-STATUS.md`](../PLANS-STATUS.md) — Estado global del portafolio.
- [`plan.md`](./plan.md) — Bitácora y plan de este subproyecto.
- [`AGENTS.md`](../AGENTS.md) — Directrices para agentes de IA del repositorio.
