/* ══════════════════════════════════════════
   PERSISTENCE & SCAN
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.hydrateFromStorage = async function () {
  let data = await em.storageGet([em.STORAGE_KEYS.LOG, em.STORAGE_KEYS.SNAPSHOT, em.STORAGE_KEYS.THEME, em.STORAGE_KEYS.ACCOUNT_ID, em.STORAGE_KEYS.ARCHIVED, em.STORAGE_KEYS.PINNED, em.STORAGE_KEYS.AUTO_REFRESH]);

  const storedAccountId = data[em.STORAGE_KEYS.ACCOUNT_ID];
  const currentToken = em.getToken();
  const currentAccountId = em.getAccountIdFromToken(currentToken);

  if (storedAccountId && currentAccountId && storedAccountId !== currentAccountId) {
    const clearPayload = {};
    clearPayload[em.STORAGE_KEYS.LOG] = [];
    clearPayload[em.STORAGE_KEYS.SNAPSHOT] = null;
    clearPayload[em.STORAGE_KEYS.KNOWN_IDS] = [];
    clearPayload[em.STORAGE_KEYS.ARCHIVED] = [];
    clearPayload[em.STORAGE_KEYS.PINNED] = [];
    clearPayload[em.STORAGE_KEYS.ACCOUNT_ID] = currentAccountId;
    await em.storageSet(clearPayload);
    data[em.STORAGE_KEYS.LOG] = [];
    data[em.STORAGE_KEYS.SNAPSHOT] = null;
    data[em.STORAGE_KEYS.ARCHIVED] = [];
    data[em.STORAGE_KEYS.PINNED] = [];
    await em.syncBadge(0);
  } else if (currentAccountId && !storedAccountId) {
    const idPayload = {};
    idPayload[em.STORAGE_KEYS.ACCOUNT_ID] = currentAccountId;
    await em.storageSet(idPayload);
  } else if (!currentToken && storedAccountId) {
    await em.syncBadge(0);
  }

  em.state.logs = Array.isArray(data[em.STORAGE_KEYS.LOG]) ? data[em.STORAGE_KEYS.LOG] : [];
  em.state.archivedIds = em.normalizeArchivedIds(data[em.STORAGE_KEYS.ARCHIVED]);
  em.state.pinnedIds = em.normalizePinnedIds(data[em.STORAGE_KEYS.PINNED]);

  const theme = data[em.STORAGE_KEYS.THEME] || "light";
  if (theme !== "light") {
    em.panelEls.root.classList.add("ep-" + theme + "-theme");
  }

  const snapshot = data[em.STORAGE_KEYS.SNAPSHOT];
  if (snapshot && Array.isArray(snapshot.pending)) {
    em.state.pending = em.applyArchivedState(snapshot.pending, em.state.archivedIds);
    em.applyPinnedState(em.state.pending, em.state.pinnedIds);
    em.state.lastUpdatedAt = snapshot.updatedAt || null;

    const prunedArchived = em.pruneArchivedIds(em.state.pending, em.state.archivedIds);
    if (!em.setsEqual(prunedArchived, em.state.archivedIds)) {
      em.state.archivedIds = prunedArchived;
      const archPayload = {};
      archPayload[em.STORAGE_KEYS.ARCHIVED] = Array.from(prunedArchived);
      await em.storageSet(archPayload);
    }

    const prunedPinned = em.prunePinnedIds(em.state.pending, em.state.pinnedIds);
    if (!em.setsEqual(prunedPinned, em.state.pinnedIds)) {
      em.state.pinnedIds = prunedPinned;
      const pinPayload = {};
      pinPayload[em.STORAGE_KEYS.PINNED] = Array.from(prunedPinned);
      await em.storageSet(pinPayload);
    }

    em.state.pending.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (!a.deadlineRaw && !b.deadlineRaw) return 0;
      if (!a.deadlineRaw) return 1;
      if (!b.deadlineRaw) return -1;
      return new Date(a.deadlineRaw).getTime() - new Date(b.deadlineRaw).getTime();
    });

    if (em.panelEls && em.panelEls.subtitle) {
      em.panelEls.subtitle.textContent = "Última lectura: " + em.formatDateTime(snapshot.updatedAt);
    }
    em.renderPending(em.state.pending);
    const visibleCount = em.getVisiblePendingCount(em.state.pending);
    const overdueCount = em.state.pending.filter((item) => item.urgency === "overdue" && !item.archived).length;
    await em.syncBadge(visibleCount, 0, overdueCount);
  } else {
    em.state.pending = [];
    em.state.lastUpdatedAt = null;
    em.renderPending([]);
    if (em.panelEls && em.panelEls.subtitle) {
      em.panelEls.subtitle.textContent = "Última lectura: Nunca";
    }
    await em.syncBadge(0, 0, 0);
  }

  em.renderLogs(em.state.logs);

  const storedAutoRefresh = Number(data[em.STORAGE_KEYS.AUTO_REFRESH]) || 0;
  if (storedAutoRefresh > 0 && em.panelEls && em.panelEls.autoRefreshSelect) {
    em.panelEls.autoRefreshSelect.value = String(storedAutoRefresh);
    em.startAutoRefresh(storedAutoRefresh);
  }
};

em.scanPending = async function () {
  em.setStatus("Consultando cursos y actividades...");
  if (em.panelEls && em.panelEls.refreshBtn) {
    em.panelEls.refreshBtn.disabled = true;
  }

  try {
    const token = em.getToken();
    if (!token) {
      em.setStatus("No se encontró accessToken. Entra a tu curso y vuelve a intentar.");
      return;
    }

    const currentAccountId = em.getAccountIdFromToken(token);
    let knownData = await em.storageGet([em.STORAGE_KEYS.KNOWN_IDS, em.STORAGE_KEYS.ACCOUNT_ID, em.STORAGE_KEYS.ARCHIVED, em.STORAGE_KEYS.PINNED]);

    if (knownData[em.STORAGE_KEYS.ACCOUNT_ID] && currentAccountId && knownData[em.STORAGE_KEYS.ACCOUNT_ID] !== currentAccountId) {
      knownData[em.STORAGE_KEYS.KNOWN_IDS] = [];
      knownData[em.STORAGE_KEYS.ARCHIVED] = [];
      knownData[em.STORAGE_KEYS.PINNED] = [];
      em.state.logs = [];
      const clearPayload = {};
      clearPayload[em.STORAGE_KEYS.LOG] = [];
      clearPayload[em.STORAGE_KEYS.SNAPSHOT] = null;
      clearPayload[em.STORAGE_KEYS.KNOWN_IDS] = [];
      clearPayload[em.STORAGE_KEYS.ARCHIVED] = [];
      clearPayload[em.STORAGE_KEYS.PINNED] = [];
      clearPayload[em.STORAGE_KEYS.ACCOUNT_ID] = currentAccountId;
      await em.storageSet(clearPayload);
    } else if (!knownData[em.STORAGE_KEYS.ACCOUNT_ID] && currentAccountId) {
      const idPayload = {};
      idPayload[em.STORAGE_KEYS.ACCOUNT_ID] = currentAccountId;
      await em.storageSet(idPayload);
    }

    const knownIds = new Set(Array.isArray(knownData[em.STORAGE_KEYS.KNOWN_IDS]) ? knownData[em.STORAGE_KEYS.KNOWN_IDS] : []);
    em.state.archivedIds = em.normalizeArchivedIds(knownData[em.STORAGE_KEYS.ARCHIVED]);
    em.state.pinnedIds = em.normalizePinnedIds(knownData[em.STORAGE_KEYS.PINNED]);

    const pending = await em.buildPendingData(token, em.state.pinnedIds);
    em.applyArchivedState(pending, em.state.archivedIds);

    const prunedArchived = em.pruneArchivedIds(pending, em.state.archivedIds);
    if (!em.setsEqual(prunedArchived, em.state.archivedIds)) {
      em.state.archivedIds = prunedArchived;
      const archPayload = {};
      archPayload[em.STORAGE_KEYS.ARCHIVED] = Array.from(prunedArchived);
      await em.storageSet(archPayload);
    }

    const prunedPinned = em.prunePinnedIds(pending, em.state.pinnedIds);
    if (!em.setsEqual(prunedPinned, em.state.pinnedIds)) {
      em.state.pinnedIds = prunedPinned;
      const pinPayload = {};
      pinPayload[em.STORAGE_KEYS.PINNED] = Array.from(prunedPinned);
      await em.storageSet(pinPayload);
    }

    const visiblePending = em.getVisiblePending(pending);

    const previousPending = em.state.pending || [];
    const previousOverdueIds = new Set(previousPending.filter((item) => item.urgency === "overdue" && !item.archived).map((item) => item.id));
    const currentOverdue = visiblePending.filter((item) => item.urgency === "overdue");
    const currentOverdueIds = new Set(currentOverdue.map((item) => item.id));
    const newlyOverdue = currentOverdue.filter((item) => !previousOverdueIds.has(item.id));

    em.state.pending = pending;
    em.renderPending(pending);

    const logMeta = await em.appendLog(pending, knownIds, visiblePending, previousPending);
    em.renderLogs(em.state.logs);
    em.state.lastUpdatedAt = logMeta.updatedAt;

    if (em.panelEls && em.panelEls.subtitle) {
      em.panelEls.subtitle.textContent = "Última lectura: " + em.formatDateTime(logMeta.updatedAt);
    }
    em.updateAutoRefreshLabel(em.autoRefreshMinutes);
    const status = visiblePending.length + " pendientes | " + logMeta.newCount + " nuevas";
    em.setStatus(status);

    if (logMeta.newCount > 0) {
      const msg = logMeta.newCount === 1 ? "1 nueva tarea detectada" : logMeta.newCount + " nuevas tareas detectadas";
      em.showToast(msg, "new");
      await em.notifyUser("Nueva tarea en Eminus", msg);
    }

    if (newlyOverdue.length > 0) {
      const msg = newlyOverdue.length === 1 ? "1 tarea acaba de vencerse" : newlyOverdue.length + " tareas acaban de vencerse";
      em.showToast(msg, "overdue");
      await em.notifyUser("Tarea vencida en Eminus", msg);
    }

    await em.syncBadge(visiblePending.length, logMeta.newCount, currentOverdue.length);
  } catch (err) {
    console.error("[Eminus Pending Panel]", err);
    if (!navigator.onLine) {
      const snapshot = await em.storageGet([em.STORAGE_KEYS.SNAPSHOT, em.STORAGE_KEYS.PINNED]);
      const cached = snapshot[em.STORAGE_KEYS.SNAPSHOT];
      if (cached && Array.isArray(cached.pending) && cached.pending.length > 0) {
        em.state.pinnedIds = em.normalizePinnedIds(snapshot[em.STORAGE_KEYS.PINNED]);
        em.state.pending = em.applyArchivedState(cached.pending, em.state.archivedIds);
        em.applyPinnedState(em.state.pending, em.state.pinnedIds);
        em.state.pending.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          if (!a.deadlineRaw && !b.deadlineRaw) return 0;
          if (!a.deadlineRaw) return 1;
          if (!b.deadlineRaw) return -1;
          return new Date(a.deadlineRaw).getTime() - new Date(b.deadlineRaw).getTime();
        });
        em.state.lastUpdatedAt = cached.updatedAt;
        em.renderPending(em.state.pending);
        em.renderLogs(em.state.logs);
        if (em.panelEls && em.panelEls.subtitle) {
          em.panelEls.subtitle.textContent = "Última lectura: " + em.formatDateTime(cached.updatedAt);
        }
        em.updateAutoRefreshLabel(em.autoRefreshMinutes);
        const visible = em.getVisiblePending(em.state.pending);
        const overdueCount = visible.filter((item) => item.urgency === "overdue").length;
        em.setStatus("Sin conexión — " + visible.length + " pendientes (caché)");
        await em.syncBadge(visible.length, 0, overdueCount);
      } else {
        em.setStatus("Sin conexión — sin datos en caché");
      }
    } else {
      em.setStatus(err.message || "Error al leer pendientes");
    }
  } finally {
    if (em.panelEls && em.panelEls.refreshBtn) {
      em.panelEls.refreshBtn.disabled = false;
    }
  }
};
