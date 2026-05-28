/* ══════════════════════════════════════════
   PANEL DOM CREATION
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.createPanel = function () {
  const root = document.createElement("aside");
  root.id = "eminus-pending-panel";
  root.classList.add("ep-collapsed");

  const archiveBtnHtml = em.ARCHIVE_BUTTON_HTML;
  const archiveIconSvg = em.ARCHIVE_ICON_SVG;

  root.innerHTML = `
      <header class="ep-header">
        <div class="ep-brand-inline">
          <div style="display: flex; gap: 16px; align-items: center;">
            <pre class="ep-seal-art" id="ep-seal-art">
 ▒▒▒▒         ▒▒▒▒
 ▒▒▒▒▒▒▒░░░░░░▒▒▒▒
   ▒▒░░░▒▒▒░░▒▒▒░▒▒
   ▒▒▓▒▓▒░░░░▒▒▓█▓▒
  ▒░▒▓▓▓▒▒▒░░░▒▒▓▓▒▒
  ░▒▒░░░░░░▒▒▒▒▒▒▒▒▒
  ░░▒▒▒░░░▒▓▓▓▓▓▓▒▒▒
  ░░░▒░░░░░▒▓▓█▓▒▒▒▒
  ░░░░░░▒▒▒▒▒▓▓▓▓▓▓▒▒
  ░░░░░░░▒▒▓▓▓▓▓▓▓▓
  ░░░░░░▒▒▒▒▓▓▓▓▓▓▓</pre>
            <pre class="ep-miyu-text">
           _                 
 _ __ ___ (_)_   _ _   _     
 | '_ \` _ \\| | | | | | | |    
 | | | | | | | |_| | |_| |    
 |_| |_| |_|_|\\__, |\\__,_|    
              |___/ --pendientes</pre>
          </div>
        </div>
        <div class="ep-title-wrap">
          <div class="ep-title">pendientes eminus</div>
          <div class="ep-subtitle" id="ep-subtitle">Sin lectura</div>
        </div>
        <div class="ep-actions" style="position: relative;">
          <button class="ep-btn" id="ep-refresh" title="Actualizar">[ ref ]</button>
          <div class="ep-archive-stack">
            <button class="ep-btn ep-archive-btn" id="ep-archive-toggle" title="Archivadas" aria-label="Archivadas">
              ${archiveBtnHtml}
            </button>
            <button class="ep-btn" id="ep-collapse" title="Desplegar">[ + ]</button>
          </div>
        </div>
      </header>

      <div class="ep-tabs">
        <button class="ep-tab ep-tab-active" data-tab="pending">Pendientes</button>
        <button class="ep-tab" data-tab="overdue">Vencidas</button>
        <button class="ep-tab" data-tab="agenda">Agenda</button>
        <button class="ep-tab" data-tab="content">Contenido</button>
        <button class="ep-tab" data-tab="log">Log</button>
        <button class="ep-tab" data-tab="config">Config</button>
      </div>

      <section class="ep-filters" id="ep-filters">
        <div class="ep-filters-head">
          <button class="ep-btn ep-filter-compact-btn" id="ep-filter-compact" type="button">[ compactar ]</button>
        </div>
        <div class="ep-filters-grid">
          <input type="text" id="ep-filter-query" class="ep-config-select ep-filter-input" placeholder="buscar tarea o curso" />
          <select id="ep-filter-course" class="ep-config-select">
            <option value="all">todos los cursos</option>
          </select>
          <select id="ep-filter-urgency" class="ep-config-select">
            <option value="all">todas las urgencias</option>
            <option value="overdue">vencidas</option>
            <option value="imminent">inminentes (&lt;24h)</option>
            <option value="urgent">urgentes (&lt;48h)</option>
            <option value="normal">normales</option>
          </select>
          <select id="ep-filter-date" class="ep-config-select">
            <option value="all">cualquier fecha</option>
            <option value="today">vence hoy</option>
            <option value="3d">próximos 3 días</option>
            <option value="7d">próximos 7 días</option>
            <option value="30d">próximos 30 días</option>
            <option value="nodate">sin fecha</option>
            <option value="overdue">ya vencidas</option>
          </select>
          <select id="ep-filter-content-type" class="ep-config-select ep-content-filter">
            <option value="all">todo contenido</option>
            <option value="unit">módulos</option>
            <option value="element">mensajes</option>
            <option value="files">archivos</option>
          </select>
          <select id="ep-filter-content-module" class="ep-config-select ep-content-filter">
            <option value="all">todos los módulos</option>
          </select>
          <select id="ep-filter-content-sort" class="ep-config-select ep-content-filter">
            <option value="newest">más reciente</option>
            <option value="oldest">más antiguo</option>
            <option value="course">por curso</option>
            <option value="module">por módulo</option>
            <option value="title">por título</option>
          </select>
        </div>
      </section>

      <section class="ep-body" id="ep-body-pending"></section>
      <section class="ep-body ep-hidden" id="ep-body-overdue"></section>
      <section class="ep-body ep-hidden" id="ep-body-agenda"></section>
      <section class="ep-body ep-hidden" id="ep-body-content"></section>
      <section class="ep-body ep-hidden" id="ep-body-log"></section>
      <section class="ep-body ep-hidden" id="ep-body-config">
        <div class="ep-config-group">
          <label class="ep-config-label">Tema del panel</label>
          <div class="ep-theme-grid">
             <button class="ep-theme-chip" data-theme="light">Light</button>
             <button class="ep-theme-chip" data-theme="jazmin">Jazmín</button>
             <button class="ep-theme-chip" data-theme="dark">Dark</button>
             <button class="ep-theme-chip" data-theme="hacker">Hacker</button>
             <button class="ep-theme-chip" data-theme="ocean">Ocean</button>
             <button class="ep-theme-chip" data-theme="dracula">Dracula</button>
             <button class="ep-theme-chip" data-theme="nord">Nord</button>
             <button class="ep-theme-chip" data-theme="solarized">Solarized</button>
             <button class="ep-theme-chip" data-theme="solarizedlight">Solarized Light</button>
             <button class="ep-theme-chip" data-theme="gruvbox">Gruvbox</button>
             <button class="ep-theme-chip" data-theme="sakura">Sakura</button>
             <button class="ep-theme-chip" data-theme="lavender">Lavender</button>
             <button class="ep-theme-chip" data-theme="rosa">Rosa</button>
             <button class="ep-theme-chip" data-theme="sandia">Sandia</button>
             <button class="ep-theme-chip" data-theme="matcha">Matcha</button>
             <button class="ep-theme-chip" data-theme="moka">Moka</button>
             <button class="ep-theme-chip" data-theme="candy">Candy</button>
             <button class="ep-theme-chip" data-theme="aurora">Aurora</button>
             <button class="ep-theme-chip" data-theme="synthwave">Synthwave</button>
             <button class="ep-theme-chip" data-theme="minimal">Minimal</button>
             <button class="ep-theme-chip" data-theme="wispr">Wispr</button>
             <button class="ep-theme-chip" data-theme="solarized-osaka">Solarized Osaka</button>
             <button class="ep-theme-chip" data-theme="olivia">Olivia</button>
             <button class="ep-theme-chip" data-theme="codex">Codex</button>
             <button class="ep-theme-chip" data-theme="custom">Personalizado</button>
          </div>
        </div>

        <div class="ep-config-group ep-custom-theme-controls ep-hidden" id="ep-custom-theme-controls">
          <label class="ep-config-label">Tema personalizado</label>
          <div class="ep-custom-base-row">
            <label class="ep-custom-base-label" for="ep-custom-base-theme">Tomar como base</label>
            <select class="ep-config-select" id="ep-custom-base-theme">
              <option value="">elige un tema...</option>
              <option value="light">Light</option>
              <option value="jazmin">Jazmín</option>
              <option value="dark">Dark</option>
              <option value="hacker">Hacker</option>
              <option value="ocean">Ocean</option>
              <option value="dracula">Dracula</option>
              <option value="nord">Nord</option>
              <option value="solarized">Solarized</option>
              <option value="solarizedlight">Solarized Light</option>
              <option value="gruvbox">Gruvbox</option>
              <option value="sakura">Sakura</option>
              <option value="lavender">Lavender</option>
              <option value="rosa">Rosa</option>
              <option value="sandia">Sandia</option>
              <option value="matcha">Matcha</option>
              <option value="moka">Moka</option>
              <option value="candy">Candy</option>
              <option value="aurora">Aurora</option>
              <option value="synthwave">Synthwave</option>
              <option value="minimal">Minimal</option>
              <option value="wispr">Wispr</option>
              <option value="solarized-osaka">Solarized Osaka</option>
              <option value="olivia">Olivia</option>
              <option value="codex">Codex</option>
            </select>
          </div>
          <div class="ep-custom-theme-grid">
            <label class="ep-color-field">Fondo <input type="color" id="ep-custom-bg" value="#ffffff" /></label>
            <label class="ep-color-field">Texto <input type="color" id="ep-custom-text" value="#111111" /></label>
            <label class="ep-color-field">Borde <input type="color" id="ep-custom-border" value="#111111" /></label>
            <label class="ep-color-field">Acento <input type="color" id="ep-custom-accent" value="#6c5ce7" /></label>
            <label class="ep-color-field">Vencida <input type="color" id="ep-custom-overdue" value="#e74c3c" /></label>
            <label class="ep-color-field">Inminente <input type="color" id="ep-custom-imminent" value="#f1c40f" /></label>
            <label class="ep-color-field">Urgente <input type="color" id="ep-custom-urgent" value="#e67e22" /></label>
          </div>
        </div>

        <div class="ep-config-row">
          <div class="ep-config-group">
            <label class="ep-config-label">Auto-refresh</label>
            <select class="ep-config-select ep-autorefresh-select" id="ep-autorefresh">
              <option value="0">desactivado</option>
              <option value="1">cada 1 min</option>
              <option value="5">cada 5 min</option>
              <option value="10">cada 10 min</option>
              <option value="15">cada 15 min</option>
              <option value="30">cada 30 min</option>
            </select>
          </div>

          <div class="ep-config-group">
            <label class="ep-config-label">Avisos preventivos</label>
            <select class="ep-config-select ep-autorefresh-select" id="ep-reminder">
              <option value="0">desactivado</option>
              <option value="1">1 hora antes</option>
              <option value="3">3 horas antes</option>
              <option value="6">6 horas antes</option>
              <option value="12">12 horas antes</option>
              <option value="24">24 horas antes</option>
              <option value="48">48 horas antes</option>
            </select>
          </div>
        </div>

        <div class="ep-config-group">
          <label class="ep-config-label">Animación de entrega</label>
          <select class="ep-config-select" id="ep-delivery-animation">
            <option value="cycle">rotar animaciones</option>
            <option value="off">desactivada</option>
            <option value="confetti">confetti</option>
            <option value="abduction">ovni</option>
            <option value="teams">disco</option>
            <option value="pinata">piñata</option>
          </select>
        </div>

        <div class="ep-config-group">
          <label class="ep-config-label">Fuente de la interfaz</label>
          <select class="ep-config-select" id="ep-font">
            <optgroup label="Coding Fonts (Monospace)">
              <option value="mono">Default Mono</option>
              <option value="fira">Fira Code</option>
              <option value="jetbrains">JetBrains Mono</option>
              <option value="cascadia">Cascadia Code</option>
              <option value="hack">Hack Mono</option>
              <option value="input">Input Mono</option>
              <option value="dank">Dank Mono</option>
              <option value="monolisa">MonoLisa</option>
              <option value="operator">Operator Mono</option>
              <option value="comic-mono">Comic Mono</option>
            </optgroup>
            <optgroup label="Modern Sans">
              <option value="sans">Inter / Standard Sans</option>
              <option value="roboto">Roboto</option>
              <option value="open-sans">Open Sans</option>
              <option value="montserrat">Montserrat</option>
            </optgroup>
            <optgroup label="Other">
              <option value="serif">Classic Serif</option>
              <option value="system">System Native</option>
            </optgroup>
          </select>
        </div>
        <div class="ep-config-group">
          <label class="ep-config-label">Tamaño del panel</label>
          <select class="ep-config-select" id="ep-panel-size">
            <option value="compact">compacto</option>
            <option value="normal">normal</option>
            <option value="wide">ancho</option>
          </select>
        </div>
        <div class="ep-config-group">
          <label class="ep-config-label" id="ep-log-visibility-label">Apartado de log</label>
          <select class="ep-config-select" id="ep-log-visibility">
            <option value="visible">visible</option>
            <option value="removed">oculto</option>
          </select>
        </div>
        <div class="ep-config-group">
          <label class="ep-config-label" id="ep-lang-label">Idioma</label>
          <select class="ep-config-select" id="ep-lang">
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="zh">中文</option>
          </select>
        </div>

        <div class="ep-config-group">
          <button class="ep-btn ep-clear-local-data" id="ep-clear-local-data" type="button">Borrar datos locales</button>
        </div>
      </section>

      <footer class="ep-footer" id="ep-footer-status">Listo</footer>
      <img class="ep-jazmin-bg" id="ep-jazmin-bg" src="" alt="" />
    `;

  document.body.appendChild(root);

  const jazminBg = root.querySelector("#ep-jazmin-bg");
  if (jazminBg) {
    jazminBg.src = chrome.runtime.getURL("jazmin.png");
  }

  em.panelEls = {
    root,
    subtitle: root.querySelector("#ep-subtitle"),
    sealArt: root.querySelector("#ep-seal-art"),
    header: root.querySelector(".ep-header"),
    refreshBtn: root.querySelector("#ep-refresh"),
    autoRefreshSelect: root.querySelector("#ep-autorefresh"),
    reminderSelect: root.querySelector("#ep-reminder"),
    deliveryAnimationSelect: root.querySelector("#ep-delivery-animation"),
    fontSelect: root.querySelector("#ep-font"),
    panelSizeSelect: root.querySelector("#ep-panel-size"),
    logVisibilitySelect: root.querySelector("#ep-log-visibility"),
    langSelect: root.querySelector("#ep-lang"),
    customThemeControls: root.querySelector("#ep-custom-theme-controls"),
    customBaseThemeSelect: root.querySelector("#ep-custom-base-theme"),
    customColorInputs: {
      bg: root.querySelector("#ep-custom-bg"),
      text: root.querySelector("#ep-custom-text"),
      border: root.querySelector("#ep-custom-border"),
      accent: root.querySelector("#ep-custom-accent"),
      overdue: root.querySelector("#ep-custom-overdue"),
      imminent: root.querySelector("#ep-custom-imminent"),
      urgent: root.querySelector("#ep-custom-urgent")
    },
    archiveBtn: root.querySelector("#ep-archive-toggle"),
    collapseBtn: root.querySelector("#ep-collapse"),
    tabButtons: root.querySelectorAll(".ep-tab"),
    filtersWrap: root.querySelector("#ep-filters"),
    filterCompactBtn: root.querySelector("#ep-filter-compact"),
    filterQuery: root.querySelector("#ep-filter-query"),
    filterCourse: root.querySelector("#ep-filter-course"),
    filterUrgency: root.querySelector("#ep-filter-urgency"),
    filterDate: root.querySelector("#ep-filter-date"),
    contentFilters: root.querySelectorAll(".ep-content-filter"),
    filterContentType: root.querySelector("#ep-filter-content-type"),
    filterContentModule: root.querySelector("#ep-filter-content-module"),
    filterContentSort: root.querySelector("#ep-filter-content-sort"),
    pendingBody: root.querySelector("#ep-body-pending"),
    overdueBody: root.querySelector("#ep-body-overdue"),
    agendaBody: root.querySelector("#ep-body-agenda"),
    contentBody: root.querySelector("#ep-body-content"),
    logBody: root.querySelector("#ep-body-log"),
    configBody: root.querySelector("#ep-body-config"),
    clearLocalDataBtn: root.querySelector("#ep-clear-local-data"),
    themeChips: root.querySelectorAll(".ep-theme-chip"),
    footer: root.querySelector("#ep-footer-status"),
    jazminBg: root.querySelector("#ep-jazmin-bg"),
    
    // Labels for i18n
    themeLabel: root.querySelector(".ep-config-group:nth-child(1) .ep-config-label"),
    autorefreshLabel: root.querySelector("#ep-autorefresh").previousElementSibling,
    reminderLabel: root.querySelector("#ep-reminder").previousElementSibling,
    deliveryAnimationLabel: root.querySelector("#ep-delivery-animation").previousElementSibling,
    fontLabel: root.querySelector("#ep-font").previousElementSibling,
    panelSizeLabel: root.querySelector("#ep-panel-size").previousElementSibling,
    logVisibilityLabel: root.querySelector("#ep-log-visibility-label"),
    langLabel: root.querySelector("#ep-lang-label"),
    filterQueryPlaceholder: root.querySelector("#ep-filter-query"),
    filterCourseSelect: root.querySelector("#ep-filter-course"),
    filterUrgencySelect: root.querySelector("#ep-filter-urgency"),
    filterDateSelect: root.querySelector("#ep-filter-date")
  };

  em.panelEls.refreshBtn.addEventListener("click", () => em.scanPendingWhenTokenReady());
  em.panelEls.autoRefreshSelect.addEventListener("change", (e) => {
    const minutes = parseInt(e.target.value, 10);
    em.setAutoRefresh(minutes);
  });
  em.panelEls.reminderSelect.addEventListener("change", (e) => {
    const hours = parseInt(e.target.value, 10);
    em.setReminderHours(hours);
  });
  em.panelEls.deliveryAnimationSelect.addEventListener("change", (e) => {
    if (em.setDeliveryAnimation) em.setDeliveryAnimation(e.target.value);
  });
  em.panelEls.fontSelect.addEventListener("change", (e) => {
    em.setFont(e.target.value);
  });
  em.panelEls.panelSizeSelect.addEventListener("change", (e) => {
    if (em.setPanelSize) em.setPanelSize(e.target.value);
  });
  em.panelEls.customBaseThemeSelect.addEventListener("change", (e) => {
    if (em.setCustomThemeFromBase) em.setCustomThemeFromBase(e.target.value);
  });
  Object.keys(em.panelEls.customColorInputs).forEach((key) => {
    const input = em.panelEls.customColorInputs[key];
    if (!input) return;
    input.addEventListener("input", () => {
      if (em.updateCustomThemeFromInputs) em.updateCustomThemeFromInputs(true);
    });
  });
  em.panelEls.logVisibilitySelect.addEventListener("change", (e) => {
    if (em.setLogTabVisible) em.setLogTabVisible(e.target.value !== "removed");
  });
  em.panelEls.langSelect.addEventListener("change", (e) => {
    if (em.setLanguage) em.setLanguage(e.target.value);
  });
  em.panelEls.clearLocalDataBtn.addEventListener("click", () => {
    if (em.clearLocalData) em.clearLocalData();
  });
  em.panelEls.themeChips.forEach((chip) => {
    chip.addEventListener("click", () => em.setTheme(chip.dataset.theme));
  });
  em.panelEls.archiveBtn.addEventListener("click", em.toggleArchiveView);
  em.panelEls.collapseBtn.addEventListener("click", em.toggleCollapse);
  em.panelEls.tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => em.setTab(btn.dataset.tab));
  });
  em.panelEls.filterQuery.addEventListener("input", (e) => {
    em.state.filters.query = String(e.target.value || "");
    em.renderPending(em.state.pending);
  });
  em.panelEls.filterCourse.addEventListener("change", (e) => {
    em.state.filters.course = String(e.target.value || "all");
    em.renderPending(em.state.pending);
  });
  em.panelEls.filterUrgency.addEventListener("change", (e) => {
    em.state.filters.urgency = String(e.target.value || "all");
    em.renderPending(em.state.pending);
  });
  em.panelEls.filterDate.addEventListener("change", (e) => {
    em.state.filters.dateRange = String(e.target.value || "all");
    em.renderPending(em.state.pending);
  });
  em.panelEls.filterContentType.addEventListener("change", (e) => {
    em.state.contentFilters.type = String(e.target.value || "all");
    em.renderPending(em.state.pending);
  });
  em.panelEls.filterContentModule.addEventListener("change", (e) => {
    em.state.contentFilters.module = String(e.target.value || "all");
    em.renderPending(em.state.pending);
  });
  em.panelEls.filterContentSort.addEventListener("change", (e) => {
    em.state.contentFilters.sort = String(e.target.value || "newest");
    em.renderPending(em.state.pending);
  });
  em.panelEls.filterCompactBtn.addEventListener("click", () => {
    em.toggleFiltersCompact();
  });

  document.addEventListener("click", (e) => {
    // No longer need theme menu click-outside logic
  });

  em.updateArchiveToggleButton();
  if (em.applyTranslations) em.applyTranslations();
  em.setupPanelDrag();
  em.filterAvailableFonts();
};
