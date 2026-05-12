/* ══════════════════════════════════════════
   STORAGE HELPERS
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};

var em = window.eminus;

(function () {
  var hasChrome = typeof chrome !== "undefined";
  em.hasChrome = hasChrome;
  em.hasStorageApi = hasChrome && !!((chrome || {}).storage || {}).local;
  em.hasRuntimeApi = hasChrome && !!chrome.runtime;
})();

em.storageGet = async function (keys) {
  if (!em.hasStorageApi) {
    return {};
  }
  return chrome.storage.local.get(keys);
};

em.storageSet = async function (payload) {
  if (!em.hasStorageApi) {
    return;
  }
  return chrome.storage.local.set(payload);
};

em.storageClear = async function () {
  if (!em.hasStorageApi) {
    return;
  }
  return chrome.storage.local.clear();
};
