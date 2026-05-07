/* ══════════════════════════════════════════
   AUTH TOKEN HELPERS
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

em.getToken = function () {
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || "";
};

em.getAccountIdFromToken = function (token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const paddedBase64 = pad ? base64 + "=".repeat(4 - pad) : base64;
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    return parsed.nameid || parsed.unique_name || parsed.sub || parsed.email || parsed.idPersona || parsed.matricula || base64Url;
  } catch (err) {
    return token.split(".")[1] || token;
  }
};
