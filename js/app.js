/* ============================================================
   Manual y Guía de Workflows — HTML5
   app.js · Lógica SPA con init* modulares (patrón manual-frontend-html5
            + atajos de teclado de la variante claude)
   ============================================================ */

(function () {
    'use strict';

    // Claves de persistencia
    const STORAGE_KEYS = {
        theme: 'workflow_guide_theme',
        progress: 'workflow_guide_progress',
        checklist: 'workflow_guide_checklist'
    };

    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initNavigation();
        initSearch();
        initCodeCopy();
        initProgressTracking();
        initChecklists();
        initWizard();
        initMobileMenu();
        initShortcuts();
    });

    /* ---------------- THEME ---------------- */
    function initTheme() {
        const html = document.documentElement;
        const toggle = document.getElementById('theme-toggle');
        const icon = document.getElementById('theme-icon');
        const saved = localStorage.getItem(STORAGE_KEYS.theme);
        const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
        html.setAttribute('data-theme', theme);
        updateThemeIcon(theme, icon);

        if (!toggle) return;
        toggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem(STORAGE_KEYS.theme, next);
            updateThemeIcon(next, icon);
        });
    }

    function updateThemeIcon(theme, icon) {
        if (!icon) return;
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    /* ---------------- NAVIGATION (hash routing) ---------------- */
    function initNavigation() {
        const sections = Array.from(document.querySelectorAll('.doc-section'));
        const navItems = Array.from(document.querySelectorAll('.nav-item'));
        const crumb = document.getElementById('current-crumb');

        function showSection(id) {
            const target = id || 'introduccion';
            let active = null;

            sections.forEach(section => {
                const match = section.id === target;
                section.classList.toggle('active', match);
                if (match) section.removeAttribute('hidden');
                else if (!match) section.setAttribute('hidden', '');
                if (match) active = section;
            });

            navItems.forEach(item => {
                const isActive = item.dataset.target === target;
                item.classList.toggle('active', isActive);
                item.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // Breadcrumb dinámico
            if (crumb && active) {
                const h1 = active.querySelector('h1');
                crumb.textContent = h1 ? h1.textContent : target;
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
            updateProgress();
        }

        // Clic en items de navegación
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.dataset.target;
                if (target) {
                    location.hash = target;
                    closeMobileMenu();
                }
            });
        });

        // Cambios en el hash (carga, navegación, back/forward)
        function handleHash() {
            const hash = location.hash.replace('#', '');
            showSection(hash);
        }
        window.addEventListener('hashchange', handleHash);
        handleHash();
    }

    /* ---------------- SEARCH ---------------- */
    function initSearch() {
        const input = document.getElementById('search-input');
        const results = document.getElementById('search-results');
        const navItems = Array.from(document.querySelectorAll('.nav-item'));
        if (!input || !results) return;

        function render(matches) {
            results.innerHTML = '';
            if (matches.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'search-empty';
                empty.textContent = 'Sin resultados para tu búsqueda.';
                results.appendChild(empty);
            } else {
                matches.forEach(item => {
                    const li = document.createElement('a');
                    li.className = 'search-result-item';
                    li.setAttribute('role', 'option');
                    li.href = '#' + item.dataset.target;
                    li.textContent = item.querySelector('.nav-text')?.textContent || item.dataset.target;
                    li.addEventListener('click', (e) => {
                        e.preventDefault();
                        location.hash = item.dataset.target;
                        clearSearch();
                    });
                    results.appendChild(li);
                });
            }
            results.hidden = false;
        }

        function clearSearch() {
            results.hidden = true;
            results.innerHTML = '';
            navItems.forEach(n => n.style.display = '');
            input.value = '';
        }

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (!query) {
                clearSearch();
                return;
            }
            const matches = navItems.filter(item => {
                const text = item.querySelector('.nav-text')?.textContent.toLowerCase() || '';
                return text.includes(query);
            });
            // También oculta/muestra en el sidebar
            navItems.forEach(item => {
                const text = item.querySelector('.nav-text')?.textContent.toLowerCase() || '';
                item.style.display = text.includes(query) ? '' : 'none';
            });
            render(matches);
        });

        // Click fuera limpia
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !results.contains(e.target)) {
                if (!input.value) results.hidden = true;
            }
        });
    }

    /* ---------------- CODE COPY ---------------- */
    function initCodeCopy() {
        const buttons = Array.from(document.querySelectorAll('.copy-btn'));
        buttons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const wrapper = btn.closest('.code-wrapper');
                const code = wrapper?.querySelector('code');
                if (!code) return;
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    const original = btn.textContent;
                    btn.textContent = '¡Copiado!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.textContent = original;
                        btn.classList.remove('copied');
                    }, 1800);
                } catch (err) {
                    btn.textContent = 'Error';
                    setTimeout(() => btn.textContent = 'Copiar', 1800);
                }
            });
        });
    }

    /* ---------------- PROGRESS TRACKING ---------------- */
    function initProgressTracking() {
        const buttons = Array.from(document.querySelectorAll('.complete-btn'));
        buttons.forEach(btn => {
            // Estado persistido
            const sectionId = btn.dataset.section;
            if (isSectionDone(sectionId)) markButtonDone(btn);

            btn.addEventListener('click', () => {
                const id = btn.dataset.section;
                toggleSectionDone(id);
                if (isSectionDone(id)) markButtonDone(btn);
                updateProgress();
            });
        });
        updateProgress();
    }

    function getDone() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.progress);
            return raw ? JSON.parse(raw) : [];
        } catch (_) { return []; }
    }
    function saveDone(arr) {
        localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(arr));
    }
    function isSectionDone(id) { return getDone().includes(id); }
    function toggleSectionDone(id) {
        const arr = getDone();
        const idx = arr.indexOf(id);
        if (idx === -1) arr.push(id);
        else arr.splice(idx, 1);
        saveDone(arr);
    }
    function markButtonDone(btn) {
        btn.classList.add('completed');
        btn.textContent = '✓ Sección leída';
    }

    function updateProgress() {
        const sections = Array.from(document.querySelectorAll('.doc-section'));
        const total = sections.length;
        const done = getDone().filter(id => document.getElementById(id)).length;
        const pct = total ? Math.round((done / total) * 100) : 0;

        const fill = document.getElementById('progress-fill');
        const text = document.getElementById('progress-text');
        const bar = document.getElementById('progress-bar');
        if (fill) fill.style.width = pct + '%';
        if (text) text.textContent = pct + '%';
        if (bar) bar.setAttribute('aria-valuenow', String(pct));
    }

    /* ---------------- CHECKLISTS (interactivos y persistentes) ---------------- */
    function initChecklists() {
        const boxes = Array.from(document.querySelectorAll('.checklist input[type="checkbox"]'));
        const state = getChecklistState();
        boxes.forEach(box => {
            const key = box.dataset.checklist + ':' + box.closest('.checklist')?.id + ':' + Array.prototype.indexOf.call(box.closest('.checklist').querySelectorAll('input'), box);
            // No usamos key: simpler por índice global de la checklist
            const listId = box.closest('.checklist')?.id || box.dataset.checklist;
            const index = Array.prototype.indexOf.call(box.closest('.checklist').querySelectorAll('input'), box);
            const storageKey = listId + '_' + index;
            if (state[storageKey]) box.checked = true;

            box.addEventListener('change', () => {
                const s = getChecklistState();
                s[storageKey] = box.checked;
                localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(s));
            });
        });
    }
    function getChecklistState() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.checklist)) || {}; }
        catch (_) { return {}; }
    }

    /* ---------------- WIZARD (interactivo) ---------------- */
    function initWizard() {
        const container = document.getElementById('wizard-container');
        if (!container) return;

        const card = document.getElementById('wizard-card');
        const resultCard = document.getElementById('wizard-result-card');
        const stepsHeader = container.querySelector('.wizard-steps-header');
        
        const prevBtn = document.getElementById('wizard-prev-btn');
        const nextBtn = document.getElementById('wizard-next-btn');
        const resetBtn = document.getElementById('reset-wizard-btn');
        const goBtn = document.getElementById('go-to-workflow-btn');
        
        const stepLabel = document.getElementById('wizard-step-label');
        const stepTitle = document.getElementById('wizard-step-title');
        const progressFill = document.getElementById('wizard-progress-fill');
        
        const groups = Array.from(container.querySelectorAll('.wizard-question-group'));
        
        let currentStep = 1;
        const totalSteps = 4;
        
        const stepInfo = {
            1: { title: 'Tipo de Producto', pct: '25%' },
            2: { title: 'Frecuencia de Despliegue', pct: '50%' },
            3: { title: 'Tamaño del Equipo', pct: '75%' },
            4: { title: 'Soporte de Versiones', pct: '100%' }
        };
        
        function updateStepUI() {
            groups.forEach(g => {
                const step = parseInt(g.dataset.step, 10);
                if (step === currentStep) {
                    g.removeAttribute('hidden');
                    g.classList.add('active');
                } else {
                    g.setAttribute('hidden', '');
                    g.classList.remove('active');
                }
            });
            
            // Botones de acción
            if (prevBtn) prevBtn.disabled = currentStep === 1;
            if (nextBtn) {
                if (currentStep === totalSteps) {
                    nextBtn.textContent = 'Calcular Recomendación ✓';
                } else {
                    nextBtn.textContent = 'Siguiente';
                }
            }
            
            // Cabecera del paso
            if (stepLabel) stepLabel.textContent = `Paso ${currentStep} de ${totalSteps}`;
            if (stepTitle && stepInfo[currentStep]) stepTitle.textContent = stepInfo[currentStep].title;
            if (progressFill && stepInfo[currentStep]) progressFill.style.width = stepInfo[currentStep].pct;
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateStepUI();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateStepUI();
                } else {
                    calculateRecommendation();
                }
            });
        }
        
        function calculateRecommendation() {
            // Obtener respuestas seleccionadas
            const product = container.querySelector('input[name="q1_product"]:checked')?.value || 'saas';
            const freq = container.querySelector('input[name="q2_freq"]:checked')?.value || 'continuous';
            const team = container.querySelector('input[name="q3_team"]:checked')?.value || 'small';
            const versions = container.querySelector('input[name="q4_versions"]:checked')?.value || 'no';
            
            let recommended = 'github-flow';
            let title = 'GitHub Flow';
            let icon = '🐙';
            let description = '';
            let reasons = [];
            
            if (versions === 'yes' && (product === 'onpremise' || product === 'mobile') && freq === 'scheduled') {
                recommended = 'git-flow';
                title = 'Git Flow';
                icon = '🌿';
                description = 'Tu proyecto requiere un control riguroso de versiones y estabilidad total de cada release. Git Flow es el estándar para el desarrollo estructurado con releases planificadas.';
                reasons = [
                    'Soporte avanzado y nativo para mantener múltiples versiones concurrentes de forma controlada.',
                    'Aislamiento estricto de las etapas de estabilización (release/*) para no interferir en el desarrollo de nuevas características.',
                    'Historial de cambios (commits) limpio y alineado perfectamente con el versionamiento semántico formal.'
                ];
            } else if (freq === 'continuous' && versions === 'no') {
                recommended = 'trunk-based';
                title = 'Trunk-Based Development';
                icon = '🪵';
                description = 'Buscas el ritmo de despliegue continuo (CD) más rápido posible. Trunk-Based elimina la fricción de integración acumulada, ideal para productos web modernos.';
                reasons = [
                    'Evita los "merge hells" al obligar al equipo a integrar cambios pequeños y rápidos directamente en main diariamente.',
                    'Incentiva el uso continuo de feature flags, desacoplando de manera efectiva el despliegue de código del lanzamiento de funcionalidades.',
                    'Reduce el Lead Time de parches a producción a unos pocos minutos.'
                ];
            } else if (versions === 'yes' || (freq === 'sprint' && (product === 'saas' || team === 'medium'))) {
                recommended = 'gitlab-flow';
                title = 'GitLab Flow';
                icon = '🦊';
                description = 'Necesitas equilibrar un flujo de desarrollo ágil con la validación de código a través de diferentes entornos de infraestructura fijos (Staging, Pre-producción, Producción).';
                reasons = [
                    'Flujo guiado por el despliegue con ramas dedicadas que representan entornos reales (ej: main despliega a Staging, production a producción).',
                    'Sigue la filosofía ágil "upstream-first": todo commit va primero a la rama principal antes de promoverse río abajo.',
                    'Fácil rastreabilidad y control visual de qué versión está desplegada en qué entorno desde la propia interfaz de Git.'
                ];
            } else if (team === 'enterprise' && freq === 'sprint') {
                recommended = 'release-flow';
                title = 'Release Flow';
                icon = '🚀';
                description = 'Gestionas una base de código de gran tamaño con decenas de ingenieros. Release Flow (utilizado por Azure DevOps) permite integrar a diario en main estabilizando sprints en ramas independientes.';
                reasons = [
                    'Desarrollo centralizado en main altamente automatizado mediante PRs, mientras que los lanzamientos por sprint se aíslan para estabilización.',
                    'Directriz "Fix first in main" que previene de forma absoluta la reaparición de bugs viejos en lanzamientos futuros.',
                    'Sección dedicada a parches que se portan controladamente con comandos estructurados como git cherry-pick.'
                ];
            } else {
                // Default: GitHub Flow
                recommended = 'github-flow';
                title = 'GitHub Flow';
                icon = '🐙';
                description = 'Priorizas la simplicidad, la velocidad de revisión por pares mediante Pull Requests y un flujo de trabajo ágil con una rama principal siempre desplegable.';
                reasons = [
                    'Enfoque minimalista ideal para equipos medianos o pequeños con entrega semanal o diaria.',
                    'Las discusiones, sugerencias e integraciones se centran en los Pull Requests, actuando como un espacio colaborativo transparente.',
                    'Una única rama permanente (main) simplifica exponencialmente el soporte diario.'
                ];
            }
            
            // Mostrar resultados
            const resTitle = document.getElementById('result-title');
            const resIcon = document.getElementById('result-icon');
            const resDesc = document.getElementById('result-description');
            const resList = document.getElementById('result-reasons-list');
            
            if (resTitle) resTitle.textContent = title;
            if (resIcon) resIcon.textContent = icon;
            if (resDesc) resDesc.textContent = description;
            
            if (resList) {
                resList.innerHTML = '';
                reasons.forEach(r => {
                    const li = document.createElement('li');
                    li.textContent = r;
                    resList.appendChild(li);
                });
            }
            
            // Guardar id recomendado para el botón "Ver guía"
            if (goBtn) goBtn.dataset.target = recommended;
            
            // Ocultar preguntas, mostrar resultado
            if (card) card.setAttribute('hidden', '');
            if (stepsHeader) stepsHeader.setAttribute('hidden', '');
            if (resultCard) resultCard.removeAttribute('hidden');
        }
        
        // Botón de reiniciar
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                currentStep = 1;
                // Desmarcar / Reset radios a la primera opción
                container.querySelectorAll('.wizard-question-group').forEach(group => {
                    const radios = group.querySelectorAll('input[type="radio"]');
                    if (radios.length > 0) radios[0].checked = true;
                });
                
                if (resultCard) resultCard.setAttribute('hidden', '');
                if (card) card.removeAttribute('hidden');
                if (stepsHeader) stepsHeader.removeAttribute('hidden');
                updateStepUI();
            });
        }
        
        // Botón de ir al workflow recomendado
        if (goBtn) {
            goBtn.addEventListener('click', () => {
                const target = goBtn.dataset.target;
                if (target) {
                    location.hash = target;
                }
            });
        }
        
        // Cargar paso inicial
        updateStepUI();
    }

    /* ---------------- MOBILE MENU ---------------- */
    function initMobileMenu() {
        const toggle = document.getElementById('mobile-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (!toggle || !sidebar || !overlay) return;

        toggle.addEventListener('click', () => {
            const open = sidebar.classList.toggle('open');
            overlay.hidden = false;
            requestAnimationFrame(() => overlay.classList.toggle('visible', open));
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        overlay.addEventListener('click', closeMobileMenu);
    }

    function closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggle = document.getElementById('mobile-toggle');
        if (!sidebar) return;
        sidebar.classList.remove('open');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => { if (!sidebar.classList.contains('open')) overlay.hidden = true; }, 300);
        }
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
    // Exponer para initNavigation
    window.__closeMobileMenu = closeMobileMenu;

    /* ---------------- SHORTCUTS de teclado (variante C) ---------------- */
    function initShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+K / Cmd+K → enfocar búsqueda
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const input = document.getElementById('search-input');
                if (input) {
                    input.focus();
                    input.select();
                }
            }
            // Esc → cerrar menú móvil / limpiar búsqueda
            if (e.key === 'Escape') {
                closeMobileMenu();
                const input = document.getElementById('search-input');
                const results = document.getElementById('search-results');
                if (input && document.activeElement === input) {
                    input.value = '';
                    if (results) results.hidden = true;
                    input.blur();
                }
            }
        });
    }
})();
