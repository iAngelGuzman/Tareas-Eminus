/* ══════════════════════════════════════════
   INTERNATIONALIZATION (i18n)
   ══════════════════════════════════════════ */

window.eminus = window.eminus || {};
var em = window.eminus;

em.i18n = {
  es: {
    title: "pendientes eminus",
    unread: "Sin lectura",
    refresh: "[ ref ]",
    archive_view: "Archivadas",
    archive_back: "Volver",
    tab_pending: "Pendientes",
    tab_overdue: "Vencidas",
    tab_agenda: "Agenda",
    tab_log: "Log",
    tab_config: "Config",
    theme_label: "Tema del panel",
    autorefresh_label: "Auto-refresh",
    ar_off: "desactivado",
    ar_1m: "cada 1 min",
    ar_5m: "cada 5 min",
    ar_10m: "cada 10 min",
    ar_15m: "cada 15 min",
    ar_30m: "cada 30 min",
    reminder_label: "Avisos preventivos",
    rem_off: "desactivado",
    rem_1h: "1 hora antes",
    rem_3h: "3 horas antes",
    rem_6h: "6 horas antes",
    rem_12h: "12 horas antes",
    rem_24h: "24 horas antes",
    rem_48h: "48 horas antes",
    font_label: "Fuente de la interfaz",
    lang_label: "Idioma",
    lang_es: "Español",
    lang_en: "English",
    lang_fr: "Français",
    lang_ja: "日本語",
    lang_ko: "한국어",
    lang_zh: "中文",
    ready: "Listo",
    empty_archived: "Sin tareas archivadas.",
    empty_pending: "Sin tareas pendientes detectadas.",
    empty_overdue: "Sin tareas vencidas detectadas.",
    empty_log: "Aún no hay historial.",
    action_restore: "Restaurar",
    action_archive: "Archivar",
    action_pin: "Fijar",
    action_unpin: "Desfijar",
    log_clear: "[ borrar_log ]",
    log_changed_date: "cambió de fecha",
    log_changed_state: "cambió de estado",
    agenda_overdue: "Vencidas",
    agenda_today: "Hoy",
    agenda_tomorrow: "Mañana",
    agenda_free: "Libre",
    agenda_later: "Más adelante",
    agenda_nodate: "Sin fecha",
    due: "Vence:",
    due_nodate: "Sin fecha",
    day_0: "Dom", day_1: "Lun", day_2: "Mar", day_3: "Mié", day_4: "Jue", day_5: "Vie", day_6: "Sáb"
  },
  en: {
    title: "eminus pending",
    unread: "Unread",
    refresh: "[ ref ]",
    archive_view: "Archived",
    archive_back: "Back",
    tab_pending: "Pending",
    tab_overdue: "Overdue",
    tab_agenda: "Agenda",
    tab_log: "Log",
    tab_config: "Config",
    theme_label: "Panel Theme",
    autorefresh_label: "Auto-refresh",
    ar_off: "disabled",
    ar_1m: "every 1 min",
    ar_5m: "every 5 min",
    ar_10m: "every 10 min",
    ar_15m: "every 15 min",
    ar_30m: "every 30 min",
    reminder_label: "Reminders",
    rem_off: "disabled",
    rem_1h: "1 hour before",
    rem_3h: "3 hours before",
    rem_6h: "6 hours before",
    rem_12h: "12 hours before",
    rem_24h: "24 hours before",
    rem_48h: "48 hours before",
    font_label: "Interface Font",
    lang_label: "Language",
    lang_es: "Español",
    lang_en: "English",
    lang_fr: "Français",
    lang_ja: "日本語",
    lang_ko: "한국어",
    lang_zh: "中文",
    ready: "Ready",
    empty_archived: "No archived tasks.",
    empty_pending: "No pending tasks detected.",
    empty_overdue: "No overdue tasks detected.",
    empty_log: "No history yet.",
    action_restore: "Restore",
    action_archive: "Archive",
    action_pin: "Pin",
    action_unpin: "Unpin",
    log_clear: "[ clear_log ]",
    log_changed_date: "changed date",
    log_changed_state: "changed state",
    agenda_overdue: "Overdue",
    agenda_today: "Today",
    agenda_tomorrow: "Tomorrow",
    agenda_free: "Free",
    agenda_later: "Later",
    agenda_nodate: "No date",
    due: "Due:",
    due_nodate: "No date",
    day_0: "Sun", day_1: "Mon", day_2: "Tue", day_3: "Wed", day_4: "Thu", day_5: "Fri", day_6: "Sat"
  },
  fr: {
    title: "eminus en attente",
    unread: "Non lu",
    refresh: "[ act ]",
    archive_view: "Archivées",
    archive_back: "Retour",
    tab_pending: "En attente",
    tab_overdue: "En retard",
    tab_agenda: "Agenda",
    tab_log: "Journal",
    tab_config: "Config",
    theme_label: "Thème du panneau",
    autorefresh_label: "Auto-actualisation",
    ar_off: "désactivé",
    ar_1m: "chaque 1 min",
    ar_5m: "chaque 5 min",
    ar_10m: "chaque 10 min",
    ar_15m: "chaque 15 min",
    ar_30m: "chaque 30 min",
    reminder_label: "Rappels",
    rem_off: "désactivé",
    rem_1h: "1 heure avant",
    rem_3h: "3 heures avant",
    rem_6h: "6 heures avant",
    rem_12h: "12 heures avant",
    rem_24h: "24 heures avant",
    rem_48h: "48 heures avant",
    font_label: "Police de l'interface",
    lang_label: "Langue",
    lang_es: "Español",
    lang_en: "English",
    lang_fr: "Français",
    lang_ja: "日本語",
    lang_ko: "한국어",
    lang_zh: "中文",
    ready: "Prêt",
    empty_archived: "Aucune tâche archivée.",
    empty_pending: "Aucune tâche en attente.",
    empty_overdue: "Aucune tâche en retard.",
    empty_log: "Pas encore d'historique.",
    action_restore: "Restaurer",
    action_archive: "Archiver",
    action_pin: "Épingler",
    action_unpin: "Désépingler",
    log_clear: "[ effacer_log ]",
    log_changed_date: "a changé de date",
    log_changed_state: "a changé d'état",
    agenda_overdue: "En retard",
    agenda_today: "Aujourd'hui",
    agenda_tomorrow: "Demain",
    agenda_free: "Libre",
    agenda_later: "Plus tard",
    agenda_nodate: "Sans date",
    due: "Échéance:",
    due_nodate: "Sans date",
    day_0: "Dim", day_1: "Lun", day_2: "Mar", day_3: "Mer", day_4: "Jeu", day_5: "Ven", day_6: "Sam"
  },
  ja: {
    title: "eminus 保留中",
    unread: "未読",
    refresh: "[ 更新 ]",
    archive_view: "アーカイブ",
    archive_back: "戻る",
    tab_pending: "保留中",
    tab_overdue: "期限切れ",
    tab_agenda: "予定",
    tab_log: "ログ",
    tab_config: "設定",
    theme_label: "パネルテーマ",
    autorefresh_label: "自動更新",
    ar_off: "無効",
    ar_1m: "1分ごと",
    ar_5m: "5分ごと",
    ar_10m: "10分ごと",
    ar_15m: "15分ごと",
    ar_30m: "30分ごと",
    reminder_label: "リマインダー",
    rem_off: "無効",
    rem_1h: "1時間前",
    rem_3h: "3時間前",
    rem_6h: "6時間前",
    rem_12h: "12時間前",
    rem_24h: "24時間前",
    rem_48h: "48時間前",
    font_label: "インターフェースフォント",
    lang_label: "言語",
    lang_es: "Español",
    lang_en: "English",
    lang_fr: "Français",
    lang_ja: "日本語",
    lang_ko: "한국어",
    lang_zh: "中文",
    ready: "準備完了",
    empty_archived: "アーカイブされたタスクはありません。",
    empty_pending: "保留中のタスクはありません。",
    empty_overdue: "期限切れのタスクはありません。",
    empty_log: "履歴はまだありません。",
    action_restore: "復元",
    action_archive: "アーカイブ",
    action_pin: "ピン留め",
    action_unpin: "ピン留め解除",
    log_clear: "[ ログをクリア ]",
    log_changed_date: "日付が変更されました",
    log_changed_state: "状態が変更されました",
    agenda_overdue: "期限切れ",
    agenda_today: "今日",
    agenda_tomorrow: "明日",
    agenda_free: "予定なし",
    agenda_later: "後で",
    agenda_nodate: "日付なし",
    due: "期限:",
    due_nodate: "日付なし",
    day_0: "日", day_1: "月", day_2: "火", day_3: "水", day_4: "木", day_5: "金", day_6: "土"
  },
  ko: {
    title: "eminus 대기 중",
    unread: "읽지 않음",
    refresh: "[ 새로고침 ]",
    archive_view: "보관됨",
    archive_back: "뒤로",
    tab_pending: "대기 중",
    tab_overdue: "기한 초과",
    tab_agenda: "일정",
    tab_log: "로그",
    tab_config: "설정",
    theme_label: "패널 테마",
    autorefresh_label: "자동 새로고침",
    ar_off: "비활성화",
    ar_1m: "1분마다",
    ar_5m: "5분마다",
    ar_10m: "10분마다",
    ar_15m: "15분마다",
    ar_30m: "30분마다",
    reminder_label: "알림",
    rem_off: "비활성화",
    rem_1h: "1시간 전",
    rem_3h: "3시간 전",
    rem_6h: "6시간 전",
    rem_12h: "12시간 전",
    rem_24h: "24시간 전",
    rem_48h: "48시간 전",
    font_label: "인터페이스 글꼴",
    lang_label: "언어",
    lang_es: "Español",
    lang_en: "English",
    lang_fr: "Français",
    lang_ja: "日本語",
    lang_ko: "한국어",
    lang_zh: "中文",
    ready: "준비됨",
    empty_archived: "보관된 작업이 없습니다.",
    empty_pending: "대기 중인 작업이 없습니다.",
    empty_overdue: "기한이 초과된 작업이 없습니다.",
    empty_log: "아직 기록이 없습니다.",
    action_restore: "복원",
    action_archive: "보관",
    action_pin: "고정",
    action_unpin: "고정 해제",
    log_clear: "[ 로그 지우기 ]",
    log_changed_date: "날짜가 변경됨",
    log_changed_state: "상태가 변경됨",
    agenda_overdue: "기한 초과",
    agenda_today: "오늘",
    agenda_tomorrow: "내일",
    agenda_free: "일정 없음",
    agenda_later: "나중에",
    agenda_nodate: "날짜 없음",
    due: "기한:",
    due_nodate: "날짜 없음",
    day_0: "일", day_1: "월", day_2: "화", day_3: "수", day_4: "목", day_5: "금", day_6: "토"
  },
  zh: {
    title: "eminus 待办",
    unread: "未读",
    refresh: "[ 刷新 ]",
    archive_view: "已归档",
    archive_back: "返回",
    tab_pending: "待办",
    tab_overdue: "已逾期",
    tab_agenda: "日程",
    tab_log: "日志",
    tab_config: "设置",
    theme_label: "面板主题",
    autorefresh_label: "自动刷新",
    ar_off: "已禁用",
    ar_1m: "每 1 分钟",
    ar_5m: "每 5 分钟",
    ar_10m: "每 10 分钟",
    ar_15m: "每 15 分钟",
    ar_30m: "每 30 分钟",
    reminder_label: "提醒",
    rem_off: "已禁用",
    rem_1h: "1 小时前",
    rem_3h: "3 小时前",
    rem_6h: "6 小时前",
    rem_12h: "12 小时前",
    rem_24h: "24 小时前",
    rem_48h: "48 小时前",
    font_label: "界面字体",
    lang_label: "语言",
    lang_es: "Español",
    lang_en: "English",
    lang_fr: "Français",
    lang_ja: "日本語",
    lang_ko: "한국어",
    lang_zh: "中文",
    ready: "就绪",
    empty_archived: "没有已归档的任务。",
    empty_pending: "没有检测到待办任务。",
    empty_overdue: "没有检测到逾期任务。",
    empty_log: "暂无历史记录。",
    action_restore: "恢复",
    action_archive: "归档",
    action_pin: "固定",
    action_unpin: "取消固定",
    log_clear: "[ 清除日志 ]",
    log_changed_date: "日期已更改",
    log_changed_state: "状态已更改",
    agenda_overdue: "已逾期",
    agenda_today: "今天",
    agenda_tomorrow: "明天",
    agenda_free: "空闲",
    agenda_later: "稍后",
    agenda_nodate: "无日期",
    due: "截止:",
    due_nodate: "无日期",
    day_0: "日", day_1: "一", day_2: "二", day_3: "三", day_4: "四", day_5: "五", day_6: "六"
  }
};

em.t = function(key) {
  const lang = em.state?.lang || 'es';
  const dictionary = em.i18n[lang] || em.i18n['es'];
  return dictionary[key] || key;
};

em.applyTranslations = function() {
  if (!em.panelEls) return;
  const els = em.panelEls;
  
  // Header
  const titleEl = els.root.querySelector('.ep-title');
  if (titleEl) titleEl.textContent = em.t('title');
  if (els.subtitle) els.subtitle.textContent = em.t('unread');
  if (els.refreshBtn) els.refreshBtn.textContent = em.t('refresh');
  em.updateArchiveToggleButton(); // uses em.t internally now

  // Tabs
  const tabPending = els.root.querySelector('[data-tab="pending"]');
  if (tabPending) tabPending.textContent = em.t('tab_pending');
  const tabOverdue = els.root.querySelector('[data-tab="overdue"]');
  if (tabOverdue) tabOverdue.textContent = em.t('tab_overdue');
  const tabAgenda = els.root.querySelector('[data-tab="agenda"]');
  if (tabAgenda) tabAgenda.textContent = em.t('tab_agenda');
  const tabLog = els.root.querySelector('[data-tab="log"]');
  if (tabLog) tabLog.textContent = em.t('tab_log');
  const tabConfig = els.root.querySelector('[data-tab="config"]');
  if (tabConfig) tabConfig.textContent = em.t('tab_config');

  // Config labels
  if (els.themeLabel) els.themeLabel.textContent = em.t('theme_label');
  if (els.autorefreshLabel) els.autorefreshLabel.textContent = em.t('autorefresh_label');
  if (els.reminderLabel) els.reminderLabel.textContent = em.t('reminder_label');
  if (els.fontLabel) els.fontLabel.textContent = em.t('font_label');
  if (els.langLabel) els.langLabel.textContent = em.t('lang_label');
  
  // Config Autorefresh options
  if (els.autoRefreshSelect) {
    els.autoRefreshSelect.options[0].textContent = em.t('ar_off');
    els.autoRefreshSelect.options[1].textContent = em.t('ar_1m');
    els.autoRefreshSelect.options[2].textContent = em.t('ar_5m');
    els.autoRefreshSelect.options[3].textContent = em.t('ar_10m');
    els.autoRefreshSelect.options[4].textContent = em.t('ar_15m');
    els.autoRefreshSelect.options[5].textContent = em.t('ar_30m');
  }

  // Config Reminder options
  if (els.reminderSelect) {
    els.reminderSelect.options[0].textContent = em.t('rem_off');
    els.reminderSelect.options[1].textContent = em.t('rem_1h');
    els.reminderSelect.options[2].textContent = em.t('rem_3h');
    els.reminderSelect.options[3].textContent = em.t('rem_6h');
    els.reminderSelect.options[4].textContent = em.t('rem_12h');
    els.reminderSelect.options[5].textContent = em.t('rem_24h');
    els.reminderSelect.options[6].textContent = em.t('rem_48h');
  }
  
  // Config Language options
  if (els.langSelect) {
    els.langSelect.options[0].textContent = em.t('lang_es');
    els.langSelect.options[1].textContent = em.t('lang_en');
    els.langSelect.options[2].textContent = em.t('lang_fr');
    els.langSelect.options[3].textContent = em.t('lang_ja');
    els.langSelect.options[4].textContent = em.t('lang_ko');
    els.langSelect.options[5].textContent = em.t('lang_zh');
  }

  // Footer
  if (els.footer && (els.footer.textContent === "Listo" || els.footer.textContent === em.t('ready'))) {
    em.setStatus(em.t('ready'));
  }
};