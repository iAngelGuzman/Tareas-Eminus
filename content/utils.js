/* ══════════════════════════════════════════
   UTILITY FUNCTIONS
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.asBool = function (value) {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (!normalized || ["0", "false", "f", "no", "n", "null", "none", "sin entregar", "pendiente"].includes(normalized)) {
      return false;
    }
    if (["1", "true", "t", "si", "sí", "y", "yes", "entregada", "entregado", "completada", "completado"].includes(normalized)) {
      return true;
    }
  }
  return Boolean(value);
};

em.hasDeliveryDate = function (value) {
  if (value === null || value === undefined) return false;
  if (typeof value !== "string") return true;
  const normalized = value.trim().toLowerCase();
  return !["", "null", "none", "sin entrega", "sin entregar", "pendiente"].includes(normalized);
};

em.getActivityDeadlineStr = function (activity) {
  if (!activity || typeof activity !== "object") return "Sin fecha";
  const fields = ["fechaTermino", "fechaVencimiento", "fechaFin"];
  for (const field of fields) {
    const val = activity[field];
    if (val && String(val).trim().toLowerCase() !== "sin fecha") {
      return String(val).trim();
    }
  }
  return "Sin fecha";
};

em.parseEminusDate = function (dateStr) {
  if (!dateStr || dateStr === "Sin fecha") return null;

  const months = {
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11
  };

  const lower = String(dateStr).trim().toLowerCase();
  const match = lower.match(/(\d{1,2})\/(\w{3})\/(\d{4})\s*-\s*(\d{1,2}):(\d{2})/);
  if (match) {
    const [, dd, mon, yyyy, hh, mm] = match;
    if (months[mon] !== undefined) {
      const dt = new Date(Number(yyyy), months[mon], Number(dd), Number(hh), Number(mm), 0, 0);
      if (!Number.isNaN(dt.getTime())) return dt;
    }
  }

  const iso = new Date(String(dateStr));
  if (!Number.isNaN(iso.getTime())) return iso;
  return null;
};

em.getTimeRemaining = function (deadline) {
  if (!deadline) return "";
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  if (diff < 0) return "Vencida";
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `en ${days}d ${hours}h`;
  if (hours > 0) return `en ${hours}h ${minutes}m`;
  return `en ${minutes}m`;
};

em.isActivityPending = function (activity) {
  if (!activity || typeof activity !== "object") return false;

  if (em.asBool(activity.entregada)) return false;
  if (em.asBool(activity.completada)) return false;

  const estatus = String(activity.estatus || "").trim().toLowerCase();
  const doneStatuses = [
    "entregada", "entregado", "completada", "completado", "calificada", "cerrada", "cerrado",
    "finalizada", "finalizado", "enviada", "enviado", "revisada", "revisado"
  ];
  if (doneStatuses.includes(estatus)) return false;

  const pendingStatuses = [
    "pendiente", "abierta", "abierto", "activa", "activo", "en progreso", "por entregar",
    "sin entregar", "no entregada", "no entregado"
  ];

  const fechaEntrega = String(activity.fechaEntrega || "").trim();
  if (em.hasDeliveryDate(fechaEntrega)) {
    const deadlines = new Set([
      String(activity.fechaTermino || "").trim(),
      String(activity.fechaVencimiento || "").trim(),
      String(activity.fechaFin || "").trim()
    ]);
    const looksLikeDeadline = fechaEntrega && deadlines.has(fechaEntrega);
    if (!looksLikeDeadline && !pendingStatuses.includes(estatus)) {
      return false;
    }
  }

  return true;
};

em.classifyUrgency = function (deadline) {
  if (!deadline) return "normal";
  const diff = deadline.getTime() - Date.now();
  if (diff < 0) return "overdue";
  if (diff < 24 * 60 * 60 * 1000) return "imminent";
  if (diff < 48 * 60 * 60 * 1000) return "urgent";
  return "normal";
};

em.escapeHtml = function (text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
};

em.normalizePositiveId = function (value) {
  const raw = String(value ?? "").trim();
  if (!/^\d+$/.test(raw)) return "";
  const asNumber = Number(raw);
  if (!Number.isFinite(asNumber) || asNumber <= 0) return "";
  return String(asNumber);
};

em.formatDateTime = function (iso) {
  if (!iso) return "Sin fecha";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return iso;
  return dt.toLocaleString();
};

em.setsEqual = function (a, b) {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
};
