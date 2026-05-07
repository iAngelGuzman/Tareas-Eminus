/* ══════════════════════════════════════════
   PANEL UI
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.toggleCollapse = function () {
  em.state.isCollapsed = !em.state.isCollapsed;
  em.panelEls.root.classList.toggle("ep-collapsed", em.state.isCollapsed);
  em.panelEls.collapseBtn.textContent = em.state.isCollapsed ? "[ + ]" : "[ - ]";
};

em.toggleThemeMenu = function () {
  em.panelEls.themeMenu.classList.toggle("ep-hidden");
};

em.setTheme = async function (themeName) {
  em.panelEls.root.classList.remove("ep-dark-theme", "ep-hacker-theme", "ep-ocean-theme", "ep-dracula-theme", "ep-nord-theme", "ep-solarized-theme", "ep-solarizedlight-theme", "ep-gruvbox-theme", "ep-sakura-theme", "ep-lavender-theme", "ep-rosa-theme", "ep-sandia-theme");
  if (themeName !== "light") {
    em.panelEls.root.classList.add("ep-" + themeName + "-theme");
  }
  em.panelEls.themeMenu.classList.add("ep-hidden");
  const payload = {};
  payload[em.STORAGE_KEYS.THEME] = themeName;
  await em.storageSet(payload);
};

em.updateArchiveToggleButton = function () {
  if (!em.panelEls || !em.panelEls.archiveBtn) return;
  const label = em.state.isArchiveView ? "Volver" : "Archivadas";
  em.panelEls.archiveBtn.title = label;
  em.panelEls.archiveBtn.setAttribute("aria-label", label);
  em.panelEls.archiveBtn.innerHTML = em.state.isArchiveView ? em.ARCHIVE_BACK_HTML : em.ARCHIVE_BUTTON_HTML;
};

em.updateTabVisibility = function () {
  em.panelEls.tabButtons.forEach((btn) => {
    btn.classList.toggle("ep-tab-active", btn.dataset.tab === em.state.activeTab);
  });

  if (em.state.isArchiveView) {
    em.panelEls.pendingBody.classList.remove("ep-hidden");
    em.panelEls.overdueBody.classList.add("ep-hidden");
    em.panelEls.agendaBody.classList.add("ep-hidden");
    em.panelEls.logBody.classList.add("ep-hidden");
    return;
  }

  em.panelEls.pendingBody.classList.toggle("ep-hidden", em.state.activeTab !== "pending");
  em.panelEls.overdueBody.classList.toggle("ep-hidden", em.state.activeTab !== "overdue");
  em.panelEls.agendaBody.classList.toggle("ep-hidden", em.state.activeTab !== "agenda");
  em.panelEls.logBody.classList.toggle("ep-hidden", em.state.activeTab !== "log");
};

em.setArchiveView = function (isOpen) {
  if (em.state.isArchiveView === isOpen) return;
  if (isOpen) {
    em.state.lastTabBeforeArchive = em.state.activeTab;
    em.state.activeTab = "pending";
  }
  em.state.isArchiveView = isOpen;
  em.panelEls.root.classList.toggle("ep-archive-view", isOpen);
  em.updateArchiveToggleButton();

  if (!isOpen && em.state.lastTabBeforeArchive) {
    em.state.activeTab = em.state.lastTabBeforeArchive;
  }

  em.updateTabVisibility();
  em.renderPending(em.state.pending);
};

em.toggleArchiveView = function () {
  em.setArchiveView(!em.state.isArchiveView);
};

em.setTab = function (tab) {
  em.state.activeTab = tab;
  em.updateTabVisibility();
};

em.setStatus = function (text) {
  if (em.panelEls && em.panelEls.footer) {
    em.panelEls.footer.textContent = text;
  }
};
