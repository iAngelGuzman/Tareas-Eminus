/* ══════════════════════════════════════════
   STATE & ARCHIVE/PIN NORMALIZATION HELPERS
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.state = {
  isCollapsed: true,
  activeTab: "pending",
  pending: [],
  logs: [],
  archivedIds: new Set(),
  pinnedIds: new Set(),
  notifiedUpcomingIds: new Set(),
  lastUpdatedAt: null,
  isArchiveView: false,
  lastTabBeforeArchive: "pending",
  reminderHours: 24,
  lang: "es"
};

em.routeObserverStarted = false;
em.detailForceTimer = null;
em.dragState = null;
em.autoRefreshTimer = null;
em.autoRefreshMinutes = 0;
em.panelEls = null;

em.normalizeNotifiedUpcomingIds = function (raw) {
  if (!Array.isArray(raw)) return new Set();
  const ids = raw.map((id) => String(id)).filter((id) => id);
  return new Set(ids);
};

em.normalizeArchivedIds = function (raw) {
  if (!Array.isArray(raw)) return new Set();
  const ids = raw.map((id) => String(id)).filter((id) => id);
  return new Set(ids);
};

em.normalizePinnedIds = function (raw) {
  if (!Array.isArray(raw)) return new Set();
  const ids = raw.map((id) => String(id)).filter((id) => id);
  return new Set(ids);
};

em.applyArchivedState = function (items, archivedSet) {
  if (!Array.isArray(items)) return [];
  items.forEach((item) => {
    if (!item || !item.id) return;
    item.archived = archivedSet.has(item.id);
  });
  return items;
};

em.pruneArchivedIds = function (items, archivedSet) {
  const next = new Set();
  if (!Array.isArray(items)) return next;
  items.forEach((item) => {
    if (item && item.id && archivedSet.has(item.id)) {
      next.add(item.id);
    }
  });
  return next;
};

em.applyPinnedState = function (items, pinnedSet) {
  if (!Array.isArray(items)) return [];
  items.forEach((item) => {
    if (!item || !item.id) return;
    item.pinned = pinnedSet.has(item.id);
  });
  return items;
};

em.prunePinnedIds = function (items, pinnedSet) {
  const next = new Set();
  if (!Array.isArray(items)) return next;
  items.forEach((item) => {
    if (item && item.id && pinnedSet.has(item.id)) {
      next.add(item.id);
    }
  });
  return next;
};

em.getVisiblePending = function (items) {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => !item.archived);
};

em.getVisiblePendingCount = function (items) {
  return em.getVisiblePending(items).length;
};
