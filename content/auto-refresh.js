/* ══════════════════════════════════════════
   AUTO REFRESH
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.startAutoRefresh = function (minutes) {
  em.stopAutoRefresh();
  if (!minutes || minutes <= 0) return;
  em.autoRefreshMinutes = minutes;
  const ms = minutes * 60 * 1000;
  em.autoRefreshTimer = window.setInterval(() => {
    em.scanPending();
  }, ms);

  if (em.panelEls && em.panelEls.autoRefreshSelect) {
    em.panelEls.autoRefreshSelect.value = String(minutes);
  }
  em.updateAutoRefreshLabel(minutes);
};

em.stopAutoRefresh = function () {
  if (em.autoRefreshTimer) {
    window.clearInterval(em.autoRefreshTimer);
    em.autoRefreshTimer = null;
  }
  em.autoRefreshMinutes = 0;
  if (em.panelEls && em.panelEls.autoRefreshSelect) {
    em.panelEls.autoRefreshSelect.value = "0";
  }
  em.updateAutoRefreshLabel(0);
};

em.setAutoRefresh = async function (minutes) {
  em.autoRefreshMinutes = minutes;
  const payload = {};
  payload[em.STORAGE_KEYS.AUTO_REFRESH] = minutes;
  await em.storageSet(payload);
  if (minutes > 0) {
    em.startAutoRefresh(minutes);
  } else {
    em.stopAutoRefresh();
  }
};

em.updateAutoRefreshLabel = function (minutes) {
  if (!em.panelEls || !em.panelEls.subtitle) return;
  const baseText = em.panelEls.subtitle.textContent.split(" · ")[0];
  if (minutes > 0) {
    em.panelEls.subtitle.textContent = baseText + " · " + em.t("autorefresh_label") + ": " + minutes + " " + em.t("unit_min");
  } else {
    em.panelEls.subtitle.textContent = baseText;
  }
};
