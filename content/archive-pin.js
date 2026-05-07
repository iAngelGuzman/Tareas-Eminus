/* ══════════════════════════════════════════
   ARCHIVE & PIN ACTIONS
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.persistArchiveState = async function () {
  const archivedList = Array.from(em.state.archivedIds);
  const payload1 = {};
  payload1[em.STORAGE_KEYS.ARCHIVED] = archivedList;
  await em.storageSet(payload1);

  const pendingCount = em.getVisiblePendingCount(em.state.pending);
  const updatedAt = em.state.lastUpdatedAt || new Date().toISOString();
  em.state.lastUpdatedAt = updatedAt;

  const payload2 = {};
  payload2[em.STORAGE_KEYS.SNAPSHOT] = {
    updatedAt,
    pendingCount,
    pending: em.state.pending
  };
  await em.storageSet(payload2);

  const overdueCount = em.state.pending.filter((item) => item.urgency === "overdue" && !item.archived).length;
  await em.syncBadge(pendingCount, 0, overdueCount);
};

em.archiveItemByIndex = async function (index) {
  const item = em.state.pending[index];
  if (!item || item.urgency !== "overdue") return;
  if (item.archived) return;

  em.state.archivedIds.add(item.id);
  item.archived = true;

  em.renderPending(em.state.pending);
  await em.persistArchiveState();
  em.setStatus("Archivada: " + item.title);
};

em.unarchiveItemByIndex = async function (index) {
  const item = em.state.pending[index];
  if (!item || item.urgency !== "overdue") return;
  if (!item.archived) return;

  em.state.archivedIds.delete(item.id);
  item.archived = false;

  em.renderPending(em.state.pending);
  await em.persistArchiveState();
  em.setStatus("Restaurada: " + item.title);
};

em.persistPinnedState = async function () {
  const pinnedList = Array.from(em.state.pinnedIds);
  const payload = {};
  payload[em.STORAGE_KEYS.PINNED] = pinnedList;
  await em.storageSet(payload);
};

em.pinItemByIndex = async function (index) {
  const item = em.state.pending[index];
  if (!item) return;
  if (item.pinned) return;

  em.state.pinnedIds.add(item.id);
  item.pinned = true;

  em.state.pending.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (!a.deadlineRaw && !b.deadlineRaw) return 0;
    if (!a.deadlineRaw) return 1;
    if (!b.deadlineRaw) return -1;
    return new Date(a.deadlineRaw).getTime() - new Date(b.deadlineRaw).getTime();
  });

  em.renderPending(em.state.pending);
  await em.persistPinnedState();
  em.setStatus("Fijada: " + item.title);
};

em.unpinItemByIndex = async function (index) {
  const item = em.state.pending[index];
  if (!item) return;
  if (!item.pinned) return;

  em.state.pinnedIds.delete(item.id);
  item.pinned = false;

  em.state.pending.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (!a.deadlineRaw && !b.deadlineRaw) return 0;
    if (!a.deadlineRaw) return 1;
    if (!b.deadlineRaw) return -1;
    return new Date(a.deadlineRaw).getTime() - new Date(b.deadlineRaw).getTime();
  });

  em.renderPending(em.state.pending);
  await em.persistPinnedState();
  em.setStatus("Desfijada: " + item.title);
};
