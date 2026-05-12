/* ══════════════════════════════════════════
   PERSISTENCE & SCAN
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.hydrateFromStorage = async function () {
  let data = await em.storageGet([
    em.STORAGE_KEYS.LOG,
    em.STORAGE_KEYS.SNAPSHOT,
    em.STORAGE_KEYS.THEME,
    em.STORAGE_KEYS.ACCOUNT_ID,
    em.STORAGE_KEYS.ARCHIVED,
    em.STORAGE_KEYS.PINNED,
    em.STORAGE_KEYS.AUTO_REFRESH,
    em.STORAGE_KEYS.REMINDER_HOURS,
    em.STORAGE_KEYS.NOTIFIED_UPCOMING,
    em.STORAGE_KEYS.FONT,
    em.STORAGE_KEYS.LANG,
    em.STORAGE_KEYS.LOG_TAB_VISIBLE,
    em.STORAGE_KEYS.FILTERS_COMPACT,
    em.STORAGE_KEYS.CUSTOM_THEME,
    em.STORAGE_KEYS.PANEL_SIZE,
    em.STORAGE_KEYS.DELIVERY_ANIMATION
  ]);

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
    clearPayload[em.STORAGE_KEYS.NOTIFIED_UPCOMING] = [];
    clearPayload[em.STORAGE_KEYS.ACCOUNT_ID] = currentAccountId;
    await em.storageSet(clearPayload);
    data[em.STORAGE_KEYS.LOG] = [];
    data[em.STORAGE_KEYS.SNAPSHOT] = null;
    data[em.STORAGE_KEYS.ARCHIVED] = [];
    data[em.STORAGE_KEYS.PINNED] = [];
    data[em.STORAGE_KEYS.NOTIFIED_UPCOMING] = [];
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
  em.state.notifiedUpcomingIds = em.normalizeNotifiedUpcomingIds(data[em.STORAGE_KEYS.NOTIFIED_UPCOMING]);

  em.applyCustomTheme(data[em.STORAGE_KEYS.CUSTOM_THEME]);

  const storedPanelSize = data[em.STORAGE_KEYS.PANEL_SIZE] || "normal";
  if (em.setPanelSize) {
    await em.setPanelSize(storedPanelSize, false);
  }

  const storedDeliveryAnimation = data[em.STORAGE_KEYS.DELIVERY_ANIMATION] || "cycle";
  if (em.setDeliveryAnimation) {
    await em.setDeliveryAnimation(storedDeliveryAnimation, false);
  }

  const theme = data[em.STORAGE_KEYS.THEME] || "light";
  if (em.PANEL_THEME_CLASSES) {
    em.panelEls.root.classList.remove(...em.PANEL_THEME_CLASSES);
  }
  if (theme !== "light") {
    em.panelEls.root.classList.add("ep-" + theme + "-theme");
  }
  em.updateActiveThemeChip && em.updateActiveThemeChip(theme);
  em.updateCustomThemeVisibility && em.updateCustomThemeVisibility(theme);

  const snapshot = data[em.STORAGE_KEYS.SNAPSHOT];
  if (snapshot && Array.isArray(snapshot.pending)) {
    em.state.pending = em.applyArchivedState(snapshot.pending, em.state.archivedIds);
    em.applyPinnedState(em.state.pending, em.state.pinnedIds);
    em.state.lastUpdatedAt = snapshot.updatedAt || null;

    // Prune settings against actual pending tasks
    em.state.archivedIds = em.pruneArchivedIds(em.state.pending, em.state.archivedIds);
    em.state.pinnedIds = em.prunePinnedIds(em.state.pending, em.state.pinnedIds);
    em.state.notifiedUpcomingIds = em.pruneNotifiedUpcomingIds(em.state.pending, em.state.notifiedUpcomingIds);

    const prunePayload = {};
    prunePayload[em.STORAGE_KEYS.ARCHIVED] = Array.from(em.state.archivedIds);
    prunePayload[em.STORAGE_KEYS.PINNED] = Array.from(em.state.pinnedIds);
    prunePayload[em.STORAGE_KEYS.NOTIFIED_UPCOMING] = Array.from(em.state.notifiedUpcomingIds);
    await em.storageSet(prunePayload);

    em.state.pending.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (!a.deadlineRaw && !b.deadlineRaw) return 0;
      if (!a.deadlineRaw) return 1;
      if (!b.deadlineRaw) return -1;
      return new Date(a.deadlineRaw).getTime() - new Date(b.deadlineRaw).getTime();
    });

    if (em.panelEls && em.panelEls.subtitle) {
      em.panelEls.subtitle.textContent = em.t("last_read") + ": " + em.formatDateTime(snapshot.updatedAt);
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
      em.panelEls.subtitle.textContent = em.t("last_read") + ": " + em.t("never");
    }
    await em.syncBadge(0, 0, 0);
  }

  em.renderLogs(em.state.logs);

  const storedAutoRefresh = Number(data[em.STORAGE_KEYS.AUTO_REFRESH]) || 0;
  if (storedAutoRefresh > 0 && em.panelEls && em.panelEls.autoRefreshSelect) {
    em.startAutoRefresh(storedAutoRefresh);
  }

  const storedReminderHours = data[em.STORAGE_KEYS.REMINDER_HOURS] !== undefined ? Number(data[em.STORAGE_KEYS.REMINDER_HOURS]) : 24;
  em.state.reminderHours = storedReminderHours;
  if (em.panelEls && em.panelEls.reminderSelect) {
    em.panelEls.reminderSelect.value = String(storedReminderHours);
  }

  const storedFont = data[em.STORAGE_KEYS.FONT] || "mono";
  em.setFont(storedFont);

  em.state.isLogTabVisible = data[em.STORAGE_KEYS.LOG_TAB_VISIBLE] !== false;
  if (em.panelEls && em.panelEls.logVisibilitySelect) {
    em.panelEls.logVisibilitySelect.value = em.state.isLogTabVisible ? "visible" : "removed";
  }
  if (em.updateTabVisibility) em.updateTabVisibility();

  em.state.isFiltersCompact = data[em.STORAGE_KEYS.FILTERS_COMPACT] === true;
  if (em.panelEls && em.panelEls.root) {
    em.panelEls.root.classList.toggle("ep-filters-compact", em.state.isFiltersCompact);
  }
  if (em.updateFiltersCompactButton) em.updateFiltersCompactButton();
  
  const storedLang = data[em.STORAGE_KEYS.LANG] || "es";
  em.state.lang = storedLang;
  if (em.panelEls && em.panelEls.langSelect) {
    em.panelEls.langSelect.value = storedLang;
  }
  if (em.applyTranslations) em.applyTranslations();
};

em.setReminderHours = async function (hours) {
  em.state.reminderHours = hours;
  const payload = {};
  payload[em.STORAGE_KEYS.REMINDER_HOURS] = hours;
  await em.storageSet(payload);
};

em.pruneNotifiedUpcomingIds = function (items, notifiedSet) {
  const next = new Set();
  if (!Array.isArray(items)) return next;
  items.forEach((item) => {
    if (item && item.id && notifiedSet.has(item.id)) {
      next.add(item.id);
    }
  });
  return next;
};

em.scanPending = async function () {
  em.setStatus(em.t("status_scanning"));
  if (em.panelEls && em.panelEls.refreshBtn) {
    em.panelEls.refreshBtn.disabled = true;
  }

  try {
    const token = em.getToken();
    if (!token) {
      em.setStatus(em.t("error_no_token"));
      return;
    }

    const currentAccountId = em.getAccountIdFromToken(token);
    let knownData = await em.storageGet([
      em.STORAGE_KEYS.KNOWN_IDS,
      em.STORAGE_KEYS.ACCOUNT_ID,
      em.STORAGE_KEYS.ARCHIVED,
      em.STORAGE_KEYS.PINNED,
      em.STORAGE_KEYS.NOTIFIED_UPCOMING
    ]);

    if (knownData[em.STORAGE_KEYS.ACCOUNT_ID] && currentAccountId && knownData[em.STORAGE_KEYS.ACCOUNT_ID] !== currentAccountId) {
      knownData[em.STORAGE_KEYS.KNOWN_IDS] = [];
      knownData[em.STORAGE_KEYS.ARCHIVED] = [];
      knownData[em.STORAGE_KEYS.PINNED] = [];
      knownData[em.STORAGE_KEYS.NOTIFIED_UPCOMING] = [];
      em.state.logs = [];
      const clearPayload = {};
      clearPayload[em.STORAGE_KEYS.LOG] = [];
      clearPayload[em.STORAGE_KEYS.SNAPSHOT] = null;
      clearPayload[em.STORAGE_KEYS.KNOWN_IDS] = [];
      clearPayload[em.STORAGE_KEYS.ARCHIVED] = [];
      clearPayload[em.STORAGE_KEYS.PINNED] = [];
      clearPayload[em.STORAGE_KEYS.NOTIFIED_UPCOMING] = [];
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
    em.state.notifiedUpcomingIds = em.normalizeNotifiedUpcomingIds(knownData[em.STORAGE_KEYS.NOTIFIED_UPCOMING]);

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

    // Upcoming reminders logic
    const upcomingNotifications = [];
    if (em.state.reminderHours > 0) {
      const thresholdMs = em.state.reminderHours * 60 * 60 * 1000;
      const now = Date.now();
      for (const item of visiblePending) {
        if (!item.deadlineRaw || item.urgency === "overdue") continue;
        const deadline = new Date(item.deadlineRaw).getTime();
        const diff = deadline - now;
        if (diff > 0 && diff <= thresholdMs) {
          if (!em.state.notifiedUpcomingIds.has(item.id)) {
            upcomingNotifications.push(item);
            em.state.notifiedUpcomingIds.add(item.id);
          }
        }
      }
    }

    em.state.pending = pending;
    em.renderPending(pending);

    const logMeta = await em.appendLog(pending, knownIds, visiblePending, previousPending);
    
    // Save notified IDs
    if (upcomingNotifications.length > 0) {
      const notifiedPayload = {};
      notifiedPayload[em.STORAGE_KEYS.NOTIFIED_UPCOMING] = Array.from(em.state.notifiedUpcomingIds);
      await em.storageSet(notifiedPayload);
    }

    em.renderLogs(em.state.logs);
    em.state.lastUpdatedAt = logMeta.updatedAt;

    if (em.panelEls && em.panelEls.subtitle) {
      em.panelEls.subtitle.textContent = em.t("last_read") + ": " + em.formatDateTime(logMeta.updatedAt);
    }
    em.updateAutoRefreshLabel(em.autoRefreshMinutes);
    const status = visiblePending.length + " " + em.t("status_pending") + " | " + logMeta.newCount + " " + em.t("status_new");
    em.setStatus(status);

    if (logMeta.newCount > 0) {
      const msg = logMeta.newCount === 1 ? em.t("new_task_toast_1") : logMeta.newCount + " " + em.t("new_task_toast_n");
      em.showToast(msg, "new");
      await em.notifyUser(em.t("new_task_notif"), msg);
    }

    if (newlyOverdue.length > 0) {
      const msg = newlyOverdue.length === 1 ? em.t("overdue_toast_1") : newlyOverdue.length + " " + em.t("overdue_toast_n");
      em.showToast(msg, "overdue");
      await em.notifyUser(em.t("overdue_notif"), msg);
    }

    for (const item of upcomingNotifications) {
      const msg = em.t("reminder_toast").replace("{h}", em.state.reminderHours) + ": " + item.title;
      em.showToast(msg, "urgent");
      await em.notifyUser(em.t("reminder_title"), msg);
    }

    await em.syncBadge(visiblePending.length, logMeta.newCount, currentOverdue.length);
  } catch (err) {
    console.error("[Eminus Pending Panel] Error de lectura");
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
          em.panelEls.subtitle.textContent = em.t("last_read") + ": " + em.formatDateTime(cached.updatedAt);
        }
        em.updateAutoRefreshLabel(em.autoRefreshMinutes);
        const visible = em.getVisiblePending(em.state.pending);
        const overdueCount = visible.filter((item) => item.urgency === "overdue").length;
        em.setStatus(em.t("offline") + " — " + visible.length + " " + em.t("status_pending") + " " + em.t("status_cache"));
        await em.syncBadge(visible.length, 0, overdueCount);
      } else {
        em.setStatus(em.t("offline") + " — " + em.t("no_cache"));
      }
    } else {
      em.setStatus(err.message || em.t("error_read"));
    }
  } finally {
    if (em.panelEls && em.panelEls.refreshBtn) {
      em.panelEls.refreshBtn.disabled = false;
    }
  }
};
