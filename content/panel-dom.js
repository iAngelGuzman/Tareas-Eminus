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
          <button class="ep-btn" id="ep-theme-toggle" title="Temas">[ ⚙ ]</button>
          <div id="ep-theme-menu" class="ep-theme-menu ep-hidden">
             <button class="ep-theme-option" data-theme="light">Light</button>
             <button class="ep-theme-option" data-theme="dark">Dark</button>
             <button class="ep-theme-option" data-theme="hacker">Hacker</button>
             <button class="ep-theme-option" data-theme="ocean">Ocean</button>
             <button class="ep-theme-option" data-theme="dracula">Dracula</button>
             <button class="ep-theme-option" data-theme="nord">Nord</button>
             <button class="ep-theme-option" data-theme="solarized">Solarized</button>
             <button class="ep-theme-option" data-theme="solarizedlight">Solarized Light</button>
             <button class="ep-theme-option" data-theme="gruvbox">Gruvbox</button>
             <button class="ep-theme-option" data-theme="sakura">Sakura</button>
             <button class="ep-theme-option" data-theme="lavender">Lavender</button>
             <button class="ep-theme-option" data-theme="rosa">Rosa</button>
          </div>
          <button class="ep-btn" id="ep-refresh" title="Actualizar">[ ref ]</button>
          <select class="ep-autorefresh-select" id="ep-autorefresh" title="Auto-refresh">
            <option value="0">off</option>
            <option value="1">1 min</option>
            <option value="5">5 min</option>
            <option value="10">10 min</option>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
          </select>
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
        <button class="ep-tab" data-tab="log">Log</button>
      </div>

      <section class="ep-body" id="ep-body-pending"></section>
      <section class="ep-body ep-hidden" id="ep-body-overdue"></section>
      <section class="ep-body ep-hidden" id="ep-body-agenda"></section>
      <section class="ep-body ep-hidden" id="ep-body-log"></section>

      <footer class="ep-footer" id="ep-footer-status">Listo</footer>
    `;

  document.body.appendChild(root);

  em.panelEls = {
    root,
    subtitle: root.querySelector("#ep-subtitle"),
    sealArt: root.querySelector("#ep-seal-art"),
    header: root.querySelector(".ep-header"),
    themeBtn: root.querySelector("#ep-theme-toggle"),
    themeMenu: root.querySelector("#ep-theme-menu"),
    themeOptions: root.querySelectorAll(".ep-theme-option"),
    refreshBtn: root.querySelector("#ep-refresh"),
    autoRefreshSelect: root.querySelector("#ep-autorefresh"),
    archiveBtn: root.querySelector("#ep-archive-toggle"),
    collapseBtn: root.querySelector("#ep-collapse"),
    tabButtons: root.querySelectorAll(".ep-tab"),
    pendingBody: root.querySelector("#ep-body-pending"),
    overdueBody: root.querySelector("#ep-body-overdue"),
    agendaBody: root.querySelector("#ep-body-agenda"),
    logBody: root.querySelector("#ep-body-log"),
    footer: root.querySelector("#ep-footer-status")
  };

  em.panelEls.themeBtn.addEventListener("click", em.toggleThemeMenu);
  em.panelEls.themeOptions.forEach((btn) => {
    btn.addEventListener("click", () => em.setTheme(btn.dataset.theme));
  });
  em.panelEls.refreshBtn.addEventListener("click", () => em.scanPending());
  em.panelEls.autoRefreshSelect.addEventListener("change", (e) => {
    const minutes = parseInt(e.target.value, 10);
    em.setAutoRefresh(minutes);
  });
  em.panelEls.archiveBtn.addEventListener("click", em.toggleArchiveView);
  em.panelEls.collapseBtn.addEventListener("click", em.toggleCollapse);
  em.panelEls.tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => em.setTab(btn.dataset.tab));
  });

  document.addEventListener("click", (e) => {
    if (
      em.panelEls.themeMenu &&
      !em.panelEls.themeMenu.classList.contains("ep-hidden") &&
      e.target instanceof Element &&
      !e.target.closest("#ep-theme-menu") &&
      !e.target.closest("#ep-theme-toggle")
    ) {
      em.panelEls.themeMenu.classList.add("ep-hidden");
    }
  });

  em.updateArchiveToggleButton();
  em.setupPanelDrag();
};
