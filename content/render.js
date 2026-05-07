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

  if (visibleItems.length === 0) {
    em.panelEls.agendaBody.innerHTML = `<div class="ep-empty">Sin tareas pendientes detectadas.</div>`;
    return;
  }

  let html = "";

  const buildMiniItem = (item) => {
    const urgencyClass = "ep-" + item.urgency;
    const originalIndex = items.indexOf(item);
    const timeMatch = item.deadlineLabel ? item.deadlineLabel.match(/(\d{1,2}:\d{2})/) : null;
    const timeStr = timeMatch ? timeMatch[1] : "";
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
    html += `<div class="ep-agenda-day-header ep-agenda-overdue">Vencidas</div>`;
    overdueItems.forEach((item) => {
      html += buildMiniItem(item);
    });
    html += `</div>`;
  }

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const dayName = dayNames[d.getDay()];
    const dayLabel = i === 0 ? "Hoy" : i === 1 ? "Mañana" : `${dayName} ${d.getDate()}`;
    const dayItems = groups[dateStr] || [];

    html += `<div class="ep-agenda-day">`;
    html += `<div class="ep-agenda-day-header">${em.escapeHtml(dayLabel)}</div>`;
    if (dayItems.length === 0) {
      html += `<div class="ep-agenda-empty">Libre</div>`;
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
    html += `<div class="ep-agenda-day-header">Más adelante</div>`;
    futureItems.forEach((item) => {
      const originalIndex = items.indexOf(item);
      const urgencyClass = "ep-" + item.urgency;
      const due = item.deadlineLabel || "";
      const pinIcon = item.pinned ? `<span style="margin-right:4px;opacity:0.9;">★</span>` : "";
      html += `
          <div class="ep-item-btn" role="button" tabindex="0" data-item-index="${originalIndex}">
            <article class="ep-item ${urgencyClass} ep-agenda-item">
              <div class="ep-course">${em.escapeHtml(item.course)}</div>
              <div class="ep-title-task" style="font-size: 12px; margin-bottom: 4px;">${pinIcon}${em.escapeHtml(item.title)}</div>
              <div class="ep-meta">${em.escapeHtml(due)}</div>
            </article>
          </div>
        `;
    });
    html += `</div>`;
  }

  if (noDateItems.length > 0) {
    html += `<div class="ep-agenda-day">`;
    html += `<div class="ep-agenda-day-header">Sin fecha</div>`;
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
        const due = item.deadlineLabel || "Sin fecha";
        const originalIndex = items.indexOf(item);
        const archivedClass = item.archived ? "ep-archived" : "";
        const pinLabel = item.pinned ? "Desfijar" : "Fijar";
        const pinAction = item.pinned ? "unpin" : "pin";
        const pinHtml = showPin
          ? `<button class="ep-mini-btn ep-pin-btn" type="button" data-action="${pinAction}" data-item-index="${originalIndex}" title="${em.escapeHtml(pinLabel)}">${item.pinned ? "★" : "☆"}</button>`
          : "";
        const actionHtml = actionConfig
          ? `<button class="ep-mini-btn" type="button" data-action="${actionConfig.action}" data-item-index="${originalIndex}">${em.escapeHtml(actionConfig.label)}</button>`
          : "";
        const buttonsHtml = [pinHtml, actionHtml].filter(Boolean).join("");
        const metaHtml = buttonsHtml
          ? `<div class="ep-meta-row"><div class="ep-meta">Vence: ${em.escapeHtml(due)}</div><div style="display:flex;gap:6px;">${buttonsHtml}</div></div>`
          : `<div class="ep-meta">Vence: ${em.escapeHtml(due)}</div>`;
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
    em.panelEls.pendingBody.innerHTML = buildListHtml(archivedItems, "Sin tareas archivadas.", { label: "Restaurar", action: "unarchive" }, false);
    em.panelEls.overdueBody.innerHTML = "";
    em.panelEls.agendaBody.innerHTML = "";
  } else {
    em.panelEls.pendingBody.innerHTML = buildListHtml(pendingItems, "Sin tareas pendientes detectadas.", null, true);
    em.panelEls.overdueBody.innerHTML = buildListHtml(overdueItems, "Sin tareas vencidas detectadas.", { label: "Archivar", action: "archive" }, true);
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
    em.panelEls.logBody.innerHTML = `<div class="ep-empty">Aún no hay historial.</div>`;
    return;
  }

  let html = `<button id="ep-clear-log" class="ep-item-btn" style="margin-bottom: 16px; border: 1px dashed #000; padding: 6px; font-size: 11px; text-align: center; cursor: pointer; background: transparent; color: #000; font-family: inherit; width: 100%; box-sizing: border-box;">[ borrar_log ]</button>`;

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
            const label = c.type === "deadline" ? "cambió de fecha" : "cambió de estado";
            return `<div class="ep-log-change">• ${em.escapeHtml(c.title)} ${label}: ${em.escapeHtml(c.from)} → ${em.escapeHtml(c.to)}</div>`;
          }).join("")}</div>`
        : "";

      return `
          <article class="ep-log-item">
            <div class="ep-log-time">${em.escapeHtml(em.formatDateTime(entry.timestamp))}</div>
            <div class="ep-log-summary">${pendingCount} pendientes (${newCount} nuevas)</div>
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
