/* ══════════════════════════════════════════
   RENDERING
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.renderAgenda = function (items) {
  if (!em.panelEls || !em.panelEls.agendaBody) return;

  const visibleItems = items.filter((item) => !item.archived);
  const overdueItems = visibleItems.filter((item) => item.urgency === "overdue");
  const noDateItems = visibleItems.filter((item) => !item.deadlineRaw && item.urgency !== "overdue");
  const datedItems = visibleItems.filter((item) => item.deadlineRaw && item.urgency !== "overdue");

  const groups = {};
  datedItems.forEach((item) => {
    const d = new Date(item.deadlineRaw);
    if (Number.isNaN(d.getTime())) return;
    const dateStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(item);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let html = "";

  const buildMiniItem = (item) => {
    const urgencyClass = "ep-" + item.urgency;
    const originalIndex = items.indexOf(item);
    
    // Recalculate deadline label for current language
    const dDate = item.deadlineRaw ? new Date(item.deadlineRaw) : null;
    const remaining = em.getTimeRemaining(dDate);
    const timeMatch = remaining ? remaining.match(/(\d{1,2}:\d{2})/) : null; // This might be wrong if getTimeRemaining doesn't return time
    // Better: extract time from deadlineStr which is original from Eminus
    const timeMatch2 = item.deadlineStr ? item.deadlineStr.match(/(\d{1,2}:\d{2})/) : null;
    const timeStr = timeMatch2 ? timeMatch2[1] : "";
    
    const pinIcon = item.pinned ? `<span style="margin-right:4px;opacity:0.9;">★</span>` : "";
    return `
        <div class="ep-item-btn" role="button" tabindex="0" data-item-index="${originalIndex}">
          <article class="ep-item ${urgencyClass} ep-agenda-item">
            <div class="ep-meta-row" style="margin-bottom: 4px;">
              <div class="ep-course">${em.escapeHtml(item.course)}</div>
              ${timeStr ? `<div class="ep-meta" style="font-weight: 700;">${em.escapeHtml(timeStr)}</div>` : ""}
            </div>
            <div class="ep-title-task" style="font-size: 12px; margin-bottom: 0;">${pinIcon}<span class="ep-wave-text">${em.wrapTextSpans(item.title)}</span></div>
          </article>
        </div>
      `;
  };

  if (overdueItems.length > 0) {
    html += `<div class="ep-agenda-day">`;
    html += `<div class="ep-agenda-day-header ep-agenda-overdue">${em.escapeHtml(em.t("agenda_overdue"))}</div>`;
    overdueItems.forEach((item) => {
      html += buildMiniItem(item);
    });
    html += `</div>`;
  }

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const dayName = em.t("day_" + d.getDay());
    const dayLabel = i === 0 ? em.t("agenda_today") : i === 1 ? em.t("agenda_tomorrow") : `${dayName} ${d.getDate()}`;
    const dayItems = groups[dateStr] || [];

    html += `<div class="ep-agenda-day">`;
    html += `<div class="ep-agenda-day-header">${em.escapeHtml(dayLabel)}</div>`;
    if (dayItems.length === 0) {
      html += `<div class="ep-agenda-empty">${em.escapeHtml(em.t("agenda_free"))}</div>`;
    } else {
      dayItems.forEach((item) => {
        html += buildMiniItem(item);
      });
    }
    html += `</div>`;
  }

  const futureItems = datedItems.filter((item) => {
    const d = new Date(item.deadlineRaw);
    const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return dOnly.getTime() >= today.getTime() + 7 * 24 * 60 * 60 * 1000;
  });

  if (futureItems.length > 0) {
    html += `<div class="ep-agenda-day">`;
    html += `<div class="ep-agenda-day-header">${em.escapeHtml(em.t("agenda_later"))}</div>`;
    futureItems.forEach((item) => {
      const originalIndex = items.indexOf(item);
      const urgencyClass = "ep-" + item.urgency;
      
      const dDate = item.deadlineRaw ? new Date(item.deadlineRaw) : null;
      const remaining = em.getTimeRemaining(dDate);
      const currentDeadlineLabel = remaining ? item.deadlineStr + " (" + remaining + ")" : item.deadlineStr;
      
      const pinIcon = item.pinned ? `<span style="margin-right:4px;opacity:0.9;">★</span>` : "";
      html += `
          <div class="ep-item-btn" role="button" tabindex="0" data-item-index="${originalIndex}">
            <article class="ep-item ${urgencyClass} ep-agenda-item">
              <div class="ep-course">${em.escapeHtml(item.course)}</div>
              <div class="ep-title-task" style="font-size: 12px; margin-bottom: 4px;">${pinIcon}${em.escapeHtml(item.title)}</div>
              <div class="ep-meta">${em.escapeHtml(currentDeadlineLabel)}</div>
            </article>
          </div>
        `;
    });
    html += `</div>`;
  }

  if (noDateItems.length > 0) {
    html += `<div class="ep-agenda-day">`;
    html += `<div class="ep-agenda-day-header">${em.escapeHtml(em.t("agenda_nodate"))}</div>`;
    noDateItems.forEach((item) => {
      html += buildMiniItem(item);
    });
    html += `</div>`;
  }

  em.panelEls.agendaBody.innerHTML = html;
};

em.renderPending = function (items) {
  if (!em.panelEls || !em.panelEls.pendingBody) return;
  if (!em.panelEls || !em.panelEls.overdueBody) return;

  const pendingItems = items.filter((item) => item.urgency !== "overdue" && !item.archived);
  const overdueItems = items.filter((item) => item.urgency === "overdue" && !item.archived);
  const archivedItems = items.filter((item) => item.archived);

  const buildListHtml = (list, emptyMsg, actionConfig, showPin) => {
    actionConfig = actionConfig || null;
    showPin = showPin || false;
    if (!list.length) {
      return `<div class="ep-empty">${emptyMsg}</div>`;
    }
    return list
      .map((item) => {
        const urgencyClass = "ep-" + item.urgency;
        
        // Recalculate deadline label for current language
        const dDate = item.deadlineRaw ? new Date(item.deadlineRaw) : null;
        const remaining = em.getTimeRemaining(dDate);
        const currentDeadlineLabel = remaining ? item.deadlineStr + " (" + remaining + ")" : (item.deadlineStr || em.t("due_nodate"));
        
        const originalIndex = items.indexOf(item);
        const archivedClass = item.archived ? "ep-archived" : "";
        const pinLabel = item.pinned ? em.t("action_unpin") : em.t("action_pin");
        const pinAction = item.pinned ? "unpin" : "pin";
        const pinHtml = showPin
          ? `<button class="ep-mini-btn ep-pin-btn" type="button" data-action="${pinAction}" data-item-index="${originalIndex}" title="${em.escapeHtml(pinLabel)}">${item.pinned ? "★" : "☆"}</button>`
          : "";
        const actionHtml = actionConfig
          ? `<button class="ep-mini-btn" type="button" data-action="${actionConfig.action}" data-item-index="${originalIndex}">${em.escapeHtml(actionConfig.label)}</button>`
          : "";
        const buttonsHtml = [pinHtml, actionHtml].filter(Boolean).join("");
        const metaHtml = buttonsHtml
          ? `<div class="ep-meta-row"><div class="ep-meta">${em.t("due")} ${em.escapeHtml(currentDeadlineLabel)}</div><div style="display:flex;gap:6px;">${buttonsHtml}</div></div>`
          : `<div class="ep-meta">${em.t("due")} ${em.escapeHtml(currentDeadlineLabel)}</div>`;
        return `
            <div class="ep-item-btn" role="button" tabindex="0" data-item-index="${originalIndex}">
              <article class="ep-item ${urgencyClass} ${archivedClass}">
                <div class="ep-course">${em.escapeHtml(item.course)}</div>
                <div class="ep-title-task"><span class="ep-wave-text">${em.wrapTextSpans(item.title)}</span></div>
                ${metaHtml}
              </article>
            </div>
          `;
      })
      .join("");
  };

  if (em.state.isArchiveView) {
    em.panelEls.pendingBody.innerHTML = buildListHtml(archivedItems, em.t("empty_archived"), { label: em.t("action_restore"), action: "unarchive" }, false);
    em.panelEls.overdueBody.innerHTML = "";
    em.panelEls.agendaBody.innerHTML = "";
  } else {
    em.panelEls.pendingBody.innerHTML = buildListHtml(pendingItems, em.t("empty_pending"), null, true);
    em.panelEls.overdueBody.innerHTML = buildListHtml(overdueItems, em.t("empty_overdue"), { label: em.t("action_archive"), action: "archive" }, true);
    em.renderAgenda(items);
  }

  const addItemListeners = (container) => {
    if (!container) return;
    container.querySelectorAll(".ep-item-btn").forEach((card) => {
      const openItem = () => {
        const index = Number(card.getAttribute("data-item-index"));
        const item = em.state.pending[index];
        if (item) {
          em.navigateToActivity(item);
        }
      };

      card.addEventListener("click", (event) => {
        if (event.target instanceof HTMLElement && event.target.closest(".ep-mini-btn")) {
          return;
        }
        openItem();
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openItem();
        }
      });
    });
  };

  const addActionListeners = (container) => {
    if (!container) return;
    container.querySelectorAll(".ep-mini-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const index = Number(btn.getAttribute("data-item-index"));
        const action = btn.getAttribute("data-action");
        if (action === "archive") {
          await em.archiveItemByIndex(index);
        } else if (action === "unarchive") {
          await em.unarchiveItemByIndex(index);
        } else if (action === "pin") {
          await em.pinItemByIndex(index);
        } else if (action === "unpin") {
          await em.unpinItemByIndex(index);
        }
      });
    });
  };

  const containers = em.state.isArchiveView
    ? [em.panelEls.pendingBody]
    : [em.panelEls.pendingBody, em.panelEls.overdueBody, em.panelEls.agendaBody];

  containers.forEach((container) => {
    addItemListeners(container);
    addActionListeners(container);
  });
};

em.renderLogs = function (logs) {
  if (!em.panelEls || !em.panelEls.logBody) return;

  const safeLogs = Array.isArray(logs) ? logs.filter((entry) => entry && typeof entry === "object") : [];
  if (!safeLogs.length) {
    em.panelEls.logBody.innerHTML = `<div class="ep-empty">${em.escapeHtml(em.t("empty_log"))}</div>`;
    return;
  }

  let html = `<button id="ep-clear-log" class="ep-item-btn" style="margin-bottom: 16px; border: 1px dashed #000; padding: 6px; font-size: 11px; text-align: center; cursor: pointer; background: transparent; color: #000; font-family: inherit; width: 100%; box-sizing: border-box;">${em.escapeHtml(em.t("log_clear"))}</button>`;

  html += safeLogs
    .map((entry) => {
      const previewTitles = Array.isArray(entry.previewTitles) ? entry.previewTitles : [];
      const lines = previewTitles.length
        ? `<div class="ep-log-lines">${previewTitles.map((t) => `<div>• ${em.escapeHtml(t)}</div>`).join("")}</div>`
        : "";
      const pendingCount = Number(entry.pendingCount || 0);
      const newCount = Number(entry.newCount || 0);
      const changes = Array.isArray(entry.changes) ? entry.changes : [];
      const changesHtml = changes.length
        ? `<div class="ep-log-changes">${changes.map((c) => {
            const label = c.type === "deadline" ? em.t("log_changed_date") : em.t("log_changed_state");
            return `<div class="ep-log-change">• ${em.escapeHtml(c.title)} ${label}: ${em.escapeHtml(c.from)} → ${em.escapeHtml(c.to)}</div>`;
          }).join("")}</div>`
        : "";

      return `
          <article class="ep-log-item">
            <div class="ep-log-time">${em.escapeHtml(em.formatDateTime(entry.timestamp))}</div>
            <div class="ep-log-summary">${pendingCount} ${em.t("status_pending")} (${newCount} ${em.t("status_new")})</div>
            ${changesHtml}
            ${lines}
          </article>
        `;
    })
    .join("");

  em.panelEls.logBody.innerHTML = html;

  const clearBtn = em.panelEls.logBody.querySelector("#ep-clear-log");
  if (clearBtn) {
    clearBtn.addEventListener("click", async () => {
      em.state.logs = [];
      const payload = {};
      payload[em.STORAGE_KEYS.LOG] = [];
      await em.storageSet(payload);
      em.renderLogs([]);
    });
  }
};