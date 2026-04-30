const STORAGE_KEYS = {
  config: "topheart-line-app-config",
  appToken: "topheart-line-app-token",
  pendingToken: "topheart-line-pending-token",
  uiPreferences: "topheart-line-app-ui-preferences",
};

const ROLE_LABELS = {
  preacher: "傳道人",
  district_leader: "區長",
  big_family_leader: "大家長",
  small_group_leader: "小家長",
  trainee_small_group_leader: "實習小家長",
  member: "小家人",
  best: "新朋友",
};

const ROLE_ORDER = {
  preacher: 1,
  district_leader: 2,
  big_family_leader: 3,
  small_group_leader: 4,
  trainee_small_group_leader: 4,
  member: 6,
  best: 7,
};

const ORG_SUFFIXES = {
  district: "區",
  big_family: "大家",
  small_group: "小家",
};

const GENDER_LABELS = {
  brother: "弟兄",
  sister: "姊妹",
};

const STATUS_LABELS = {
  unknown: "待確認",
  present: "出席",
  absent: "未出席",
};

const LOGIN_ROLES = [
  "preacher",
  "district_leader",
  "big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
];

const SMALL_GROUP_LEADER_ROLES = [
  "small_group_leader",
  "trainee_small_group_leader",
];

const MEMBER_ROLES = ["member", "best"];

const MANAGEMENT_CREATE_ROLES = [
  "district_leader",
  "big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
  "member",
  "best",
];

const ADMIN_CREATE_ROLES = ["preacher", ...MANAGEMENT_CREATE_ROLES];

const OVERVIEW_ROLES = ["preacher", "district_leader", "big_family_leader"];

const DEFAULT_PROJECT_URL = "https://aiifotwroawqxkcsfjzi.supabase.co";
const NOTE_MAX_LENGTH = 1000;
const LAYOUT_SIZES = ["small", "medium", "large"];
const V2_API_ACTIONS = new Set([
  "attendance-overview",
  "create-members-batch",
  "dashboard",
  "create-member",
  "save-attendance",
  "update-member",
]);

const TABS = {
  attendance: "attendance",
  overview: "overview",
  people: "people",
  orgs: "orgs",
  invites: "invites",
};
const TAB_SWIPE_THRESHOLD_PX = 64;
const TAB_SWIPE_MAX_VERTICAL_PX = 54;

const els = {
  pageShell: document.querySelector(".page-shell"),
  pageDescription: document.querySelector("#pageDescription"),
  userBar: document.querySelector("#userBar"),
  userNameText: document.querySelector("#userNameText"),
  userScopeText: document.querySelector("#userScopeText"),
  toggleSettingsBtn: document.querySelector("#toggleSettingsBtn"),
  manageAllWrap: document.querySelector("#manageAllWrap"),
  manageAllInput: document.querySelector("#manageAllInput"),
  uiSettingsCard: document.querySelector("#uiSettingsCard"),
  layoutSizeInputs: document.querySelectorAll('input[name="layoutSize"]'),
  setupCard: document.querySelector("#setupCard"),
  configForm: document.querySelector("#configForm"),
  projectUrlInput: document.querySelector("#projectUrlInput"),
  callbackPreview: document.querySelector("#callbackPreview"),
  startPreview: document.querySelector("#startPreview"),
  saveConfigBtn: document.querySelector("#saveConfigBtn"),
  clearConfigBtn: document.querySelector("#clearConfigBtn"),
  loginSettingsBtn: document.querySelector("#loginSettingsBtn"),
  loginCard: document.querySelector("#loginCard"),
  signInBtn: document.querySelector("#signInBtn"),
  signOutBtn: document.querySelector("#signOutBtn"),
  authSummary: document.querySelector("#authSummary"),
  sessionBadge: document.querySelector("#sessionBadge"),
  bindCard: document.querySelector("#bindCard"),
  bindForm: document.querySelector("#bindForm"),
  inviteCodeInput: document.querySelector("#inviteCodeInput"),
  bindInviteBtn: document.querySelector("#bindInviteBtn"),
  pendingProfileBox: document.querySelector("#pendingProfileBox"),
  pendingPicture: document.querySelector("#pendingPicture"),
  pendingDisplayName: document.querySelector("#pendingDisplayName"),
  pendingLineUserId: document.querySelector("#pendingLineUserId"),
  navCard: document.querySelector("#navCard"),
  tabAttendanceBtn: document.querySelector("#tabAttendanceBtn"),
  tabOverviewBtn: document.querySelector("#tabOverviewBtn"),
  tabPeopleBtn: document.querySelector("#tabPeopleBtn"),
  tabOrgsBtn: document.querySelector("#tabOrgsBtn"),
  tabInvitesBtn: document.querySelector("#tabInvitesBtn"),
  attendanceView: document.querySelector("#attendanceView"),
  attendanceHeaderPanel: document.querySelector("#attendanceHeaderPanel"),
  dirtyBadge: document.querySelector("#dirtyBadge"),
  weekInput: document.querySelector("#weekInput"),
  weekStatusChip: document.querySelector("#weekStatusChip"),
  prevWeekBtn: document.querySelector("#prevWeekBtn"),
  nextWeekBtn: document.querySelector("#nextWeekBtn"),
  refreshBtn: document.querySelector("#refreshBtn"),
  saveAttendanceBtn: document.querySelector("#saveAttendanceBtn"),
  saveAttendanceBtnBottom: document.querySelector("#saveAttendanceBtnBottom"),
  attendanceSaveBar: document.querySelector("#attendanceSaveBar"),
  attendanceSaveWeek: document.querySelector("#attendanceSaveWeek"),
  attendanceSaveStatus: document.querySelector("#attendanceSaveStatus"),
  attendanceSearchInput: document.querySelector("#attendanceSearchInput"),
  attendanceRoleFilter: document.querySelector("#attendanceRoleFilter"),
  attendanceStatusFilter: document.querySelector("#attendanceStatusFilter"),
  attendanceFilterRow: document.querySelector(".attendance-filter-row"),
  weekSummary: document.querySelector("#weekSummary"),
  rosterTableBody: document.querySelector("#rosterTableBody"),
  overviewView: document.querySelector("#overviewView"),
  overviewEventTabs: document.querySelector("#overviewEventTabs"),
  overviewEventButtons: document.querySelectorAll("[data-overview-event]"),
  overviewUnitTypeSelect: document.querySelector("#overviewUnitTypeSelect"),
  overviewWeekScroller: document.querySelector("#overviewWeekScroller"),
  overviewScopeSummary: document.querySelector("#overviewScopeSummary"),
  overviewUnitList: document.querySelector("#overviewUnitList"),
  peopleView: document.querySelector("#peopleView"),
  orgsView: document.querySelector("#orgsView"),
  peopleSearchInput: document.querySelector("#peopleSearchInput"),
  peopleRoleFilter: document.querySelector("#peopleRoleFilter"),
  peopleSummary: document.querySelector("#peopleSummary"),
  bulkMemberBtn: document.querySelector("#bulkMemberBtn"),
  newMemberBtn: document.querySelector("#newMemberBtn"),
  peopleTableBody: document.querySelector("#peopleTableBody"),
  memberEditorCard: document.querySelector("#memberEditorCard"),
  memberEditorTitle: document.querySelector("#memberEditorTitle"),
  memberEditorHint: document.querySelector("#memberEditorHint"),
  closeMemberEditorBtn: document.querySelector("#closeMemberEditorBtn"),
  memberForm: document.querySelector("#memberForm"),
  memberNameInput: document.querySelector("#memberNameInput"),
  memberRoleSelect: document.querySelector("#memberRoleSelect"),
  memberGenderSelect: document.querySelector("#memberGenderSelect"),
  memberDistrictLabel: document.querySelector("#memberDistrictLabel"),
  memberDistrictSelect: document.querySelector("#memberDistrictSelect"),
  memberBigFamilyLabel: document.querySelector("#memberBigFamilyLabel"),
  memberBigFamilySelect: document.querySelector("#memberBigFamilySelect"),
  memberSmallGroupLabel: document.querySelector("#memberSmallGroupLabel"),
  memberSmallGroupSelect: document.querySelector("#memberSmallGroupSelect"),
  memberActiveLabel: document.querySelector("#memberActiveLabel"),
  memberActiveSelect: document.querySelector("#memberActiveSelect"),
  memberIsAdminWrap: document.querySelector("#memberIsAdminWrap"),
  memberIsAdminInput: document.querySelector("#memberIsAdminInput"),
  memberNoteLabel: document.querySelector("#memberNoteLabel"),
  memberNoteInput: document.querySelector("#memberNoteInput"),
  memberScopeHint: document.querySelector("#memberScopeHint"),
  memberSubmitBtn: document.querySelector("#memberSubmitBtn"),
  bulkMemberEditorCard: document.querySelector("#bulkMemberEditorCard"),
  closeBulkMemberEditorBtn: document.querySelector("#closeBulkMemberEditorBtn"),
  bulkMemberForm: document.querySelector("#bulkMemberForm"),
  bulkRoleSelect: document.querySelector("#bulkRoleSelect"),
  bulkGenderSelect: document.querySelector("#bulkGenderSelect"),
  bulkDistrictLabel: document.querySelector("#bulkDistrictLabel"),
  bulkDistrictSelect: document.querySelector("#bulkDistrictSelect"),
  bulkBigFamilyLabel: document.querySelector("#bulkBigFamilyLabel"),
  bulkBigFamilySelect: document.querySelector("#bulkBigFamilySelect"),
  bulkSmallGroupLabel: document.querySelector("#bulkSmallGroupLabel"),
  bulkSmallGroupSelect: document.querySelector("#bulkSmallGroupSelect"),
  bulkActiveSelect: document.querySelector("#bulkActiveSelect"),
  bulkNamesInput: document.querySelector("#bulkNamesInput"),
  bulkPreviewBtn: document.querySelector("#bulkPreviewBtn"),
  bulkSubmitBtn: document.querySelector("#bulkSubmitBtn"),
  bulkSummary: document.querySelector("#bulkSummary"),
  bulkPreviewList: document.querySelector("#bulkPreviewList"),
  districtDetails: document.querySelector("#districtDetails"),
  districtForm: document.querySelector("#districtForm"),
  districtNameInput: document.querySelector("#districtNameInput"),
  districtDescriptionInput: document.querySelector("#districtDescriptionInput"),
  districtSubmitBtn: document.querySelector("#districtSubmitBtn"),
  bigFamilyForm: document.querySelector("#bigFamilyForm"),
  bigFamilyDistrictSelect: document.querySelector("#bigFamilyDistrictSelect"),
  bigFamilyNameInput: document.querySelector("#bigFamilyNameInput"),
  bigFamilyDescriptionInput: document.querySelector("#bigFamilyDescriptionInput"),
  bigFamilySubmitBtn: document.querySelector("#bigFamilySubmitBtn"),
  smallGroupForm: document.querySelector("#smallGroupForm"),
  smallGroupDistrictSelect: document.querySelector("#smallGroupDistrictSelect"),
  smallGroupBigFamilySelect: document.querySelector("#smallGroupBigFamilySelect"),
  smallGroupNameInput: document.querySelector("#smallGroupNameInput"),
  smallGroupDescriptionInput: document.querySelector("#smallGroupDescriptionInput"),
  smallGroupSubmitBtn: document.querySelector("#smallGroupSubmitBtn"),
  districtSection: document.querySelector("#districtSection"),
  districtSummary: document.querySelector("#districtSummary"),
  districtTableBody: document.querySelector("#districtTableBody"),
  bigFamilySection: document.querySelector("#bigFamilySection"),
  bigFamilySummary: document.querySelector("#bigFamilySummary"),
  bigFamilyTableBody: document.querySelector("#bigFamilyTableBody"),
  smallGroupSection: document.querySelector("#smallGroupSection"),
  smallGroupSummary: document.querySelector("#smallGroupSummary"),
  smallGroupTableBody: document.querySelector("#smallGroupTableBody"),
  orgEditorCard: document.querySelector("#orgEditorCard"),
  orgEditorTitle: document.querySelector("#orgEditorTitle"),
  orgEditorHint: document.querySelector("#orgEditorHint"),
  closeOrgEditorBtn: document.querySelector("#closeOrgEditorBtn"),
  orgEditorForm: document.querySelector("#orgEditorForm"),
  orgDistrictLabel: document.querySelector("#orgDistrictLabel"),
  orgDistrictSelect: document.querySelector("#orgDistrictSelect"),
  orgBigFamilyLabel: document.querySelector("#orgBigFamilyLabel"),
  orgBigFamilySelect: document.querySelector("#orgBigFamilySelect"),
  orgNameInput: document.querySelector("#orgNameInput"),
  orgDescriptionInput: document.querySelector("#orgDescriptionInput"),
  orgSubmitBtn: document.querySelector("#orgSubmitBtn"),
  invitesView: document.querySelector("#invitesView"),
  inviteForm: document.querySelector("#inviteForm"),
  inviteMemberSelect: document.querySelector("#inviteMemberSelect"),
  inviteExpiresInput: document.querySelector("#inviteExpiresInput"),
  inviteSubmitBtn: document.querySelector("#inviteSubmitBtn"),
  inviteSummary: document.querySelector("#inviteSummary"),
  latestInviteBox: document.querySelector("#latestInviteBox"),
  latestInviteCode: document.querySelector("#latestInviteCode"),
  latestInviteExpires: document.querySelector("#latestInviteExpires"),
  latestInviteTarget: document.querySelector("#latestInviteTarget"),
  copyLatestInviteBtn: document.querySelector("#copyLatestInviteBtn"),
  inviteTableBody: document.querySelector("#inviteTableBody"),
  toast: document.querySelector("#toast"),
};

const state = {
  config: {
    projectUrl: "",
  },
  appToken: null,
  pendingToken: null,
  currentMember: null,
  pendingProfile: null,
  currentWeek: null,
  attendanceAnalytics: emptyAttendanceAnalytics(),
  roster: [],
  attendanceBaseline: new Map(),
  overviewData: null,
  adminData: emptyAdminData(),
  ui: {
    activeTab: TABS.attendance,
    attendanceSearch: "",
    attendanceRole: "",
    attendanceStatus: "",
    overviewEvent: "sunday_service",
    overviewWeekStart: "",
    overviewLoading: false,
    overviewUnitType: "",
    overviewHistoryRange: "month",
    settingsOpen: false,
    manageAll: false,
    layoutSize: "medium",
    editorMode: null,
    editingMemberId: null,
    orgEditorMode: null,
    editingOrgId: null,
    orgFocusTarget: null,
    peopleSearch: "",
    peopleRole: "",
    peopleOpenGroups: new Set(),
    overviewOpenUnitKey: "",
    overviewOpenMemberKeys: new Set(),
  },
  bulkMembers: [],
  dirty: false,
  toastTimer: null,
  saveFeedbackTimer: null,
  dashboardCache: new Map(),
  prefetchingWeeks: new Set(),
};

const tabSwipe = {
  startX: 0,
  startY: 0,
  target: null,
};

boot()
  .catch((error) => {
    console.error(error);
    showToast(error.message || "初始化失敗，請檢查設定。");
  })
  .finally(() => {
    document.body.classList.remove("is-booting");
  });

async function boot() {
  bindEvents();
  hydrateLocalState();
  updateCallbackPreview();
  syncSignInLink();
  handleAuthReturnFromHash();

  if (!els.weekInput.value) {
    els.weekInput.value = getMondayIso(new Date());
  }

  await refreshSessionState();
}

function bindEvents() {
  els.configForm.addEventListener("submit", handleSaveConfig);
  els.clearConfigBtn.addEventListener("click", handleClearConfig);
  els.loginSettingsBtn.addEventListener("click", handleToggleSettings);
  els.toggleSettingsBtn.addEventListener("click", handleToggleSettings);
  els.manageAllInput?.addEventListener("change", handleManageAllChange);
  els.layoutSizeInputs?.forEach((input) => {
    input.addEventListener("change", handleLayoutSizeChange);
  });
  els.signOutBtn.addEventListener("click", handleSignOut);
  els.bindForm.addEventListener("submit", handleBindInvite);

  els.tabAttendanceBtn.addEventListener("click", () => switchTab(TABS.attendance));
  els.tabOverviewBtn?.addEventListener("click", () => switchTab(TABS.overview));
  els.tabPeopleBtn.addEventListener("click", () => switchTab(TABS.people));
  els.tabOrgsBtn?.addEventListener("click", () => switchTab(TABS.orgs));
  els.tabInvitesBtn.addEventListener("click", () => switchTab(TABS.invites));
  els.pageShell?.addEventListener("touchstart", handleTabSwipeStart, { passive: true });
  els.pageShell?.addEventListener("touchend", handleTabSwipeEnd, { passive: true });

  els.prevWeekBtn.addEventListener("click", () => handleShiftWeek(-7));
  els.nextWeekBtn.addEventListener("click", () => handleShiftWeek(7));
  els.refreshBtn.addEventListener("click", handleRefreshDashboard);
  els.saveAttendanceBtn.addEventListener("click", handleSaveAttendance);
  els.saveAttendanceBtnBottom.addEventListener("click", handleSaveAttendance);
  els.weekInput.addEventListener("change", handleWeekChange);
  els.rosterTableBody.addEventListener("change", handleAttendanceFieldChange);
  els.rosterTableBody.addEventListener("input", handleAttendanceFieldChange);
  els.rosterTableBody.addEventListener("click", handleRosterActions);
  els.attendanceSearchInput?.addEventListener("input", handleAttendanceFilters);
  els.attendanceRoleFilter?.addEventListener("change", handleAttendanceFilters);
  els.attendanceStatusFilter?.addEventListener("change", handleAttendanceFilters);
  els.overviewEventButtons?.forEach((button) => {
    button.addEventListener("click", () => switchOverviewEvent(button.dataset.overviewEvent));
  });
  els.overviewUnitTypeSelect?.addEventListener("change", (event) =>
    switchOverviewUnitType(event.target.value || ""),
  );
  els.overviewWeekScroller?.addEventListener("click", handleOverviewWeekClick);
  els.overviewWeekScroller?.addEventListener("change", handleOverviewDateChange);
  els.overviewUnitList?.addEventListener("click", handleOverviewHistoryRangeClick);
  els.overviewUnitList?.addEventListener("toggle", handleOverviewUnitToggle, true);

  els.peopleSearchInput.addEventListener("input", handlePeopleFilters);
  els.peopleRoleFilter.addEventListener("change", handlePeopleFilters);
  els.bulkMemberBtn?.addEventListener("click", openBulkMemberEditor);
  els.newMemberBtn.addEventListener("click", () => openMemberEditor("create"));
  els.peopleTableBody.addEventListener("click", handlePeopleTableClick);
  els.peopleTableBody.addEventListener("toggle", handlePeopleGroupToggle, true);
  els.closeMemberEditorBtn.addEventListener("click", closeMemberEditor);
  els.closeBulkMemberEditorBtn?.addEventListener("click", closeBulkMemberEditor);

  els.memberForm.addEventListener("submit", handleSaveMember);
  els.memberRoleSelect.addEventListener("change", () => {
    syncEditorBigFamilyOptions();
    syncEditorSmallGroupOptions();
    syncMemberFormScope();
  });
  els.memberDistrictSelect.addEventListener("change", () => {
    els.memberBigFamilySelect.value = "";
    els.memberSmallGroupSelect.value = "";
    syncEditorBigFamilyOptions();
    syncEditorSmallGroupOptions();
    syncMemberFormScope();
  });
  els.memberBigFamilySelect.addEventListener("change", () => {
    els.memberSmallGroupSelect.value = "";
    syncEditorSmallGroupOptions();
    syncMemberFormScope();
  });
  els.bulkRoleSelect?.addEventListener("change", syncBulkDefaultScope);
  els.bulkDistrictSelect?.addEventListener("change", () => {
    els.bulkBigFamilySelect.value = "";
    els.bulkSmallGroupSelect.value = "";
    syncBulkDefaultScope();
  });
  els.bulkBigFamilySelect?.addEventListener("change", () => {
    els.bulkSmallGroupSelect.value = "";
    syncBulkDefaultScope();
  });
  els.bulkPreviewBtn?.addEventListener("click", handleGenerateBulkPreview);
  els.bulkMemberForm?.addEventListener("submit", handleSaveBulkMembers);
  els.bulkPreviewList?.addEventListener("change", handleBulkPreviewInput);
  els.bulkPreviewList?.addEventListener("click", handleBulkPreviewClick);

  els.districtForm.addEventListener("submit", handleCreateDistrict);
  els.bigFamilyForm.addEventListener("submit", handleCreateBigFamily);
  els.bigFamilyDistrictSelect.addEventListener("change", syncOrgSelects);
  els.smallGroupDistrictSelect.addEventListener("change", syncOrgSelects);
  els.smallGroupForm.addEventListener("submit", handleCreateSmallGroup);
  els.districtTableBody.addEventListener("click", handleOrgTableClick);
  els.bigFamilyTableBody.addEventListener("click", handleOrgTableClick);
  els.smallGroupTableBody.addEventListener("click", handleOrgTableClick);
  els.closeOrgEditorBtn.addEventListener("click", closeOrgEditor);
  els.orgEditorForm.addEventListener("submit", handleSaveOrganization);
  els.orgDistrictSelect.addEventListener("change", syncOrgEditorBigFamilyOptions);

  els.inviteForm.addEventListener("submit", handleCreateInvite);
  els.inviteTableBody.addEventListener("click", handleInviteTableClick);
  els.copyLatestInviteBtn.addEventListener("click", handleCopyLatestInvite);

  window.addEventListener("beforeunload", (event) => {
    if (!state.dirty) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  });
}

function hydrateLocalState() {
  state.config = loadConfig();
  state.appToken = loadStoredValue(STORAGE_KEYS.appToken);
  state.pendingToken = loadStoredValue(STORAGE_KEYS.pendingToken);
  state.ui.layoutSize = loadUiPreferences().layoutSize;
  els.projectUrlInput.value = state.config.projectUrl || "";
  applyLayoutSize();
}

function loadConfig() {
  return {
    projectUrl: DEFAULT_PROJECT_URL,
  };
}

function loadStoredValue(key) {
  return window.localStorage.getItem(key);
}

function saveStoredValue(key, value) {
  if (value) {
    window.localStorage.setItem(key, value);
  } else {
    window.localStorage.removeItem(key);
  }
}

function loadUiPreferences() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.uiPreferences) || "{}");
    return {
      layoutSize: LAYOUT_SIZES.includes(value.layoutSize) ? value.layoutSize : "medium",
    };
  } catch (_error) {
    return { layoutSize: "medium" };
  }
}

function saveUiPreferences() {
  window.localStorage.setItem(
    STORAGE_KEYS.uiPreferences,
    JSON.stringify({ layoutSize: state.ui.layoutSize }),
  );
}

function applyLayoutSize() {
  for (const size of LAYOUT_SIZES) {
    document.documentElement.classList.toggle(`layout-${size}`, state.ui.layoutSize === size);
    document.body.classList.toggle(`layout-${size}`, state.ui.layoutSize === size);
  }
  els.layoutSizeInputs?.forEach((input) => {
    input.checked = input.value === state.ui.layoutSize;
  });
}

function normalizeProjectUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function updateCallbackPreview() {
  const projectUrl = normalizeProjectUrl(els.projectUrlInput.value);
  if (!projectUrl) {
    els.callbackPreview.textContent = "請先填入 Project URL";
    els.startPreview.textContent = "請先填入 Project URL";
    return;
  }

  els.callbackPreview.textContent =
    `${projectUrl}/functions/v1/line-login-callback`;
  els.startPreview.textContent =
    `${projectUrl}/functions/v1/line-login-start`;
}

function buildLineLoginStartUrl(projectUrl) {
  if (!projectUrl) {
    return "";
  }

  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const url = new URL(`${projectUrl}/functions/v1/line-login-start`);
  url.searchParams.set("mode", "redirect");
  url.searchParams.set("redirect_to", redirectTo);
  return url.toString();
}

function syncSignInLink() {
  const href = buildLineLoginStartUrl(state.config.projectUrl);

  if (href) {
    els.signInBtn.href = href;
    els.signInBtn.classList.remove("is-disabled");
    els.signInBtn.setAttribute("aria-disabled", "false");
    els.signInBtn.removeAttribute("tabindex");
    return;
  }

  els.signInBtn.removeAttribute("href");
  els.signInBtn.classList.add("is-disabled");
  els.signInBtn.setAttribute("aria-disabled", "true");
  els.signInBtn.setAttribute("tabindex", "-1");
}

function handleAuthReturnFromHash() {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const search = window.location.search.startsWith("?")
    ? window.location.search.slice(1)
    : window.location.search;

  const hashParams = new URLSearchParams(hash);
  const searchParams = new URLSearchParams(search);
  let needsCleanup = false;

  const appToken = hashParams.get("app_token");
  if (appToken) {
    state.appToken = appToken;
    state.pendingToken = null;
    saveStoredValue(STORAGE_KEYS.appToken, appToken);
    saveStoredValue(STORAGE_KEYS.pendingToken, "");
    needsCleanup = true;
  }

  const pendingToken = hashParams.get("pending_token");
  if (pendingToken) {
    state.pendingToken = pendingToken;
    state.appToken = null;
    saveStoredValue(STORAGE_KEYS.pendingToken, pendingToken);
    saveStoredValue(STORAGE_KEYS.appToken, "");
    needsCleanup = true;
  }

  const authError =
    hashParams.get("auth_error") || searchParams.get("error_description");
  if (authError) {
    showToast(decodeURIComponent(authError.replaceAll("+", " ")));
    needsCleanup = true;
  }

  if (needsCleanup) {
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, "", cleanUrl);
  }
}

function hasProjectUrl() {
  return Boolean(state.config.projectUrl);
}

function setBadge(element, text, tone) {
  element.textContent = text;
  element.className = `badge ${tone}`;
}

function setHidden(element, shouldHide) {
  if (!element) {
    return;
  }
  element.classList.toggle("hidden", shouldHide);
}

function showToast(message) {
  els.toast.textContent = message;
  setHidden(els.toast, false);

  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    setHidden(els.toast, true);
  }, 4200);
}

async function handleSaveConfig(event) {
  event.preventDefault();
  const projectUrl = normalizeProjectUrl(els.projectUrlInput.value);
  if (!projectUrl) {
    showToast("請填入 Supabase Project URL。");
    return;
  }

  state.config.projectUrl = projectUrl;
  window.localStorage.setItem(
    STORAGE_KEYS.config,
    JSON.stringify(state.config),
  );
  updateCallbackPreview();
  syncSignInLink();
  if (state.currentMember) {
    state.ui.settingsOpen = false;
  }
  renderLayout();
  await refreshSessionState();
  showToast("專案設定已儲存。");
}

async function handleClearConfig() {
  if (!window.confirm("要清除目前保存的專案設定與登入狀態嗎？")) {
    return;
  }

  state.config.projectUrl = DEFAULT_PROJECT_URL;
  state.appToken = null;
  state.pendingToken = null;
  state.currentMember = null;
  state.pendingProfile = null;
  state.currentWeek = null;
  state.attendanceAnalytics = emptyAttendanceAnalytics();
  state.roster = [];
  state.adminData = emptyAdminData();
  state.ui.activeTab = TABS.attendance;
  state.ui.settingsOpen = false;
  state.ui.editorMode = null;
  state.ui.editingMemberId = null;
  state.ui.orgEditorMode = null;
  state.ui.editingOrgId = null;
  state.dirty = false;

  if (DEFAULT_PROJECT_URL) {
    window.localStorage.setItem(
      STORAGE_KEYS.config,
      JSON.stringify({ projectUrl: DEFAULT_PROJECT_URL }),
    );
  } else {
    window.localStorage.removeItem(STORAGE_KEYS.config);
  }
  window.localStorage.removeItem(STORAGE_KEYS.appToken);
  window.localStorage.removeItem(STORAGE_KEYS.pendingToken);

  els.projectUrlInput.value = state.config.projectUrl || "";
  updateCallbackPreview();
  syncSignInLink();
  renderLayout();
  showToast("已清除專案設定。");
}

function handleToggleSettings() {
  state.ui.settingsOpen = !state.ui.settingsOpen;
  renderLayout();
}

async function handleManageAllChange(event) {
  const nextValue = Boolean(event.target.checked);
  if (state.ui.manageAll === nextValue) {
    return;
  }

  if (!canUseManageAllToggle()) {
    state.ui.manageAll = false;
    event.target.checked = false;
    return;
  }

  if (!canDiscardDirtyChanges()) {
    event.target.checked = state.ui.manageAll;
    return;
  }

  state.ui.manageAll = nextValue;
  state.dashboardCache.clear();
  await loadDashboard({ skipDirtyCheck: true });
}

function handleLayoutSizeChange(event) {
  const size = event.target.value;
  if (!LAYOUT_SIZES.includes(size)) {
    return;
  }

  state.ui.layoutSize = size;
  saveUiPreferences();
  applyLayoutSize();
}

async function handleSignOut() {
  if (state.appToken) {
    try {
      await apiRequest("logout", { method: "POST", authMode: "app" });
    } catch (error) {
      console.warn("Logout API failed", error);
    }
  }

  state.appToken = null;
  state.pendingToken = null;
  state.ui.activeTab = TABS.attendance;
  state.ui.manageAll = false;
  state.ui.settingsOpen = false;
  saveStoredValue(STORAGE_KEYS.appToken, "");
  saveStoredValue(STORAGE_KEYS.pendingToken, "");
  renderLayout();
  await refreshSessionState();
  showToast("已登出。");
}

async function handleBindInvite(event) {
  event.preventDefault();
  const inviteCode = els.inviteCodeInput.value.trim().toUpperCase();
  if (!inviteCode) {
    showToast("請輸入邀請碼。");
    return;
  }

  els.bindInviteBtn.disabled = true;
  try {
    const data = await apiRequest("bind", {
      method: "POST",
      authMode: "pending",
      body: {
        invite_code: inviteCode,
      },
    });

    if (!data?.app_token) {
      throw new Error("綁定成功，但沒有收到 app token。");
    }

    state.appToken = data.app_token;
    state.pendingToken = null;
    saveStoredValue(STORAGE_KEYS.appToken, data.app_token);
    saveStoredValue(STORAGE_KEYS.pendingToken, "");
    els.inviteCodeInput.value = "";
    state.ui.activeTab = TABS.attendance;
    state.ui.settingsOpen = false;

    showToast("綁定完成，已登入系統。");
    await refreshSessionState();
  } catch (error) {
    console.error(error);
    showToast(error.message || "邀請碼綁定失敗。");
  } finally {
    els.bindInviteBtn.disabled = false;
  }
}

async function refreshSessionState() {
  if (!hasProjectUrl()) {
    state.currentMember = null;
    state.pendingProfile = null;
    state.currentWeek = null;
    state.attendanceAnalytics = emptyAttendanceAnalytics();
    state.adminData = emptyAdminData();
    renderLayout();
    return;
  }

  try {
    const data = await apiRequest("session", {
      method: "GET",
      authMode: "auto",
      suppressUnauthorizedToast: true,
    });

    if (data?.status === "authenticated") {
      const previousMemberId = state.currentMember?.id || null;
      state.currentMember = data.current_member;
      state.pendingProfile = null;
      state.ui.activeTab = TABS.attendance;
      if (previousMemberId !== state.currentMember?.id) {
        state.ui.manageAll = false;
        state.dashboardCache.clear();
      }
      if (state.currentMember) {
        state.ui.settingsOpen = false;
      }
      renderLayout();
      await loadDashboard({ skipDirtyCheck: true });
      await loadAdminPanel();
      return;
    }

    if (data?.status === "pending_binding") {
      state.currentMember = null;
      state.pendingProfile = data.pending_profile;
      state.currentWeek = null;
      state.attendanceAnalytics = emptyAttendanceAnalytics();
      state.adminData = emptyAdminData();
    state.ui.manageAll = false;
      renderLayout();
      return;
    }
  } catch (error) {
    console.error(error);
    showToast(error.message || "讀取登入狀態失敗。");
  }

  state.appToken = null;
  state.pendingToken = null;
  state.currentMember = null;
  state.pendingProfile = null;
  state.currentWeek = null;
  state.attendanceAnalytics = emptyAttendanceAnalytics();
  state.adminData = emptyAdminData();
  state.ui.manageAll = false;
  saveStoredValue(STORAGE_KEYS.appToken, "");
  saveStoredValue(STORAGE_KEYS.pendingToken, "");
  renderLayout();
}

function renderLayout() {
  const isAuthenticated = Boolean(state.currentMember);
  const isPending = Boolean(state.pendingProfile && !state.currentMember);
  document.body.classList.toggle("is-authenticated", isAuthenticated);

  setHidden(els.setupCard, true);
  setHidden(els.loginCard, isAuthenticated || isPending);
  setHidden(els.loginSettingsBtn, true);
  setHidden(els.bindCard, !isPending);
  setHidden(els.userBar, !isAuthenticated);
  setHidden(els.navCard, !isAuthenticated);
  setHidden(els.toggleSettingsBtn, !isAuthenticated);
  setHidden(els.uiSettingsCard, !isAuthenticated || !state.ui.settingsOpen);

  if (!isAuthenticated) {
    setHidden(els.manageAllWrap, true);
    setHidden(els.uiSettingsCard, true);
    setHidden(els.attendanceView, true);
    setHidden(els.overviewView, true);
    setHidden(els.peopleView, true);
    setHidden(els.orgsView, true);
    setHidden(els.invitesView, true);
    setBadge(els.sessionBadge, isPending ? "待綁定" : "尚未登入", isPending ? "warning" : "neutral");
    els.authSummary.textContent =
      "請使用 LINE 登入。若這是第一次登入，系統會在下一步引導你輸入邀請碼。";
    syncSignInLink();
    renderPendingProfile();
    return;
  }

  renderTopBar();
  syncManageAllToggle();
  applyLayoutSize();
  renderTabs();
  renderActiveView();
  syncAttendanceFilterVisibility();
}

function renderTopBar() {
  const scope = [
    state.currentMember.district_name,
    state.currentMember.big_family_name,
    state.currentMember.small_group_name,
  ]
    .filter(Boolean)
    .join(" / ");

  els.userNameText.textContent = `${state.currentMember.full_name} (${getRoleLabel(
    state.currentMember.role,
  )}${state.currentMember.is_admin ? " / 管理員" : ""})`;
  els.userScopeText.textContent = scope
    ? `所屬牧區：${scope}`
    : "尚未設定牧區";
  setBadge(els.sessionBadge, "已登入", "success");
  els.authSummary.textContent = `目前登入：${state.currentMember.full_name}`;
}

function syncManageAllToggle() {
  const canUse = canUseManageAllToggle();
  if (!canUse) {
    state.ui.manageAll = false;
  }
  setHidden(els.manageAllWrap, !canUse);
  if (els.manageAllInput) {
    els.manageAllInput.checked = Boolean(canUse && state.ui.manageAll);
  }
}

function syncAttendanceFilterVisibility() {
  const canUse = canUseAttendanceFilters();
  setHidden(els.attendanceFilterRow, !canUse);
  if (!canUse) {
    state.ui.attendanceSearch = "";
    state.ui.attendanceRole = "";
    state.ui.attendanceStatus = "";
    if (els.attendanceSearchInput) {
      els.attendanceSearchInput.value = "";
    }
    if (els.attendanceRoleFilter) {
      els.attendanceRoleFilter.value = "";
    }
    if (els.attendanceStatusFilter) {
      els.attendanceStatusFilter.value = "";
    }
  }
}

function renderTabs() {
  const canViewOverview = canUseOverview();
  const canManagePeople = canUseManagement();
  const canManageOrgs = canUseOrganizationManagement();
  const canManageInvites = canUseInvites();
  setHidden(els.tabOverviewBtn, !canViewOverview);
  setHidden(els.tabPeopleBtn, !canManagePeople);
  setHidden(els.tabOrgsBtn, !canManageOrgs);
  setHidden(els.tabInvitesBtn, !canManageInvites);

  if (
    (state.ui.activeTab === TABS.overview && !canViewOverview) ||
    (state.ui.activeTab === TABS.people && !canManagePeople) ||
    (state.ui.activeTab === TABS.orgs && !canManageOrgs) ||
    (state.ui.activeTab === TABS.invites && !canManageInvites)
  ) {
    state.ui.activeTab = TABS.attendance;
  }

  setTabActive(els.tabAttendanceBtn, state.ui.activeTab === TABS.attendance);
  setTabActive(els.tabOverviewBtn, state.ui.activeTab === TABS.overview);
  setTabActive(els.tabPeopleBtn, state.ui.activeTab === TABS.people);
  setTabActive(els.tabOrgsBtn, state.ui.activeTab === TABS.orgs);
  setTabActive(els.tabInvitesBtn, state.ui.activeTab === TABS.invites);
}

function renderActiveView() {
  setHidden(els.attendanceView, state.ui.activeTab !== TABS.attendance);
  setHidden(els.overviewView, state.ui.activeTab !== TABS.overview || !canUseOverview());
  setHidden(els.peopleView, state.ui.activeTab !== TABS.people || !canUseManagement());
  setHidden(els.orgsView, state.ui.activeTab !== TABS.orgs || !canUseOrganizationManagement());
  setHidden(els.invitesView, state.ui.activeTab !== TABS.invites || !canUseInvites());
}

function renderPendingProfile() {
  if (!state.pendingProfile) {
    setHidden(els.pendingProfileBox, true);
    return;
  }

  els.pendingDisplayName.textContent =
    state.pendingProfile.display_name || "未提供顯示名稱";
  els.pendingLineUserId.textContent = state.pendingProfile.line_user_id || "-";

  if (state.pendingProfile.picture_url) {
    els.pendingPicture.src = state.pendingProfile.picture_url;
    els.pendingPicture.classList.remove("hidden");
  } else {
    els.pendingPicture.removeAttribute("src");
    els.pendingPicture.classList.add("hidden");
  }

  setHidden(els.pendingProfileBox, false);
}

function setTabActive(button, isActive) {
  if (!button) {
    return;
  }

  button.classList.toggle("is-active", isActive);
}

function switchTab(tabId) {
  state.ui.activeTab = tabId;
  renderTabs();
  renderActiveView();
  if (tabId === TABS.overview) {
    loadAttendanceOverview();
  }
}

function handleTabSwipeStart(event) {
  const touch = event.changedTouches?.[0];
  if (!touch || shouldIgnoreTabSwipe(event.target)) {
    tabSwipe.target = null;
    return;
  }

  tabSwipe.startX = touch.clientX;
  tabSwipe.startY = touch.clientY;
  tabSwipe.target = event.target;
}

function handleTabSwipeEnd(event) {
  if (!tabSwipe.target || !state.currentMember) {
    return;
  }

  const touch = event.changedTouches?.[0];
  if (!touch) {
    return;
  }

  const deltaX = touch.clientX - tabSwipe.startX;
  const deltaY = touch.clientY - tabSwipe.startY;
  tabSwipe.target = null;

  if (
    Math.abs(deltaX) < TAB_SWIPE_THRESHOLD_PX ||
    Math.abs(deltaY) > TAB_SWIPE_MAX_VERTICAL_PX
  ) {
    return;
  }

  const visibleTabs = getVisibleMainTabs();
  const currentIndex = visibleTabs.indexOf(state.ui.activeTab);
  if (currentIndex === -1) {
    return;
  }

  const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1;
  const nextTab = visibleTabs[nextIndex];
  if (nextTab) {
    switchTab(nextTab);
  }
}

function shouldIgnoreTabSwipe(target) {
  return Boolean(
    target?.closest?.(
      [
        "button",
        "a",
        "input",
        "select",
        "textarea",
        "summary",
        ".tab-row",
        ".overview-week-scroller",
        ".overview-history-grid",
        ".attendance-save-bar",
      ].join(","),
    ),
  );
}

function getVisibleMainTabs() {
  return [
    TABS.attendance,
    canUseOverview() ? TABS.overview : null,
    canUseManagement() ? TABS.people : null,
    canUseOrganizationManagement() ? TABS.orgs : null,
    canUseInvites() ? TABS.invites : null,
  ].filter(Boolean);
}

async function loadDashboard(options = {}) {
  const { skipDirtyCheck = false } = options;
  if (!state.currentMember) {
    return;
  }

  if (!skipDirtyCheck && !canDiscardDirtyChanges()) {
    return;
  }

  try {
    const weekStart = getMondayIso(els.weekInput.value || new Date());
    els.weekInput.value = weekStart;

    const data = await fetchDashboardData(weekStart);
    applyDashboardData(data, weekStart);
    setDirty(false);
    prefetchAdjacentWeeks(weekStart);
  } catch (error) {
    console.error(error);
    showToast(error.message || "載入點名資料失敗。");
  }
}

async function fetchDashboardData(weekStart) {
  const cacheKey = getDashboardCacheKey(weekStart);
  const params = new URLSearchParams({ week_start: weekStart });
  if (state.ui.manageAll && canUseManageAllToggle()) {
    params.set("manage_all", "true");
  }
  const data = await apiRequest(
    `dashboard&${params.toString()}`,
    {
      method: "GET",
      authMode: "app",
    },
  );
  state.dashboardCache.set(cacheKey, data);
  return data;
}

function applyDashboardData(data, weekStart) {
  state.currentMember = data.current_member;
  state.currentWeek = normalizeWeek(data.week, weekStart);
  state.attendanceAnalytics = normalizeAttendanceAnalytics(data.analytics);
  state.roster = sortMembers((data.roster || []).map(enrichRosterMember));
  captureAttendanceBaseline();
  populateAttendanceRoleFilter();
  renderAttendanceHeader();
  renderWeekSummary();
  syncAttendanceFilterVisibility();
  renderAttendanceRows();
}

function getDashboardCacheKey(weekStart) {
  return `${weekStart || ""}:${state.ui.manageAll && canUseManageAllToggle() ? "all" : "scope"}`;
}

function prefetchAdjacentWeeks(weekStart) {
  for (const dayDelta of [-7, 7]) {
    const target = parseIsoDate(weekStart);
    target.setDate(target.getDate() + dayDelta);
    const targetWeek = getMondayIso(target);
    const cacheKey = getDashboardCacheKey(targetWeek);
    if (state.dashboardCache.has(cacheKey) || state.prefetchingWeeks.has(cacheKey)) {
      continue;
    }

    state.prefetchingWeeks.add(cacheKey);
    fetchDashboardData(targetWeek)
      .catch((error) => console.warn("Prefetch dashboard failed", error))
      .finally(() => state.prefetchingWeeks.delete(cacheKey));
  }
}

function enrichRosterMember(member) {
  return {
    ...member,
    is_self: Boolean(state.currentMember && member.id === state.currentMember.id),
    note: member.note || "",
    note_carry_forward: member.note_carry_forward !== false,
    note_priority_high: Boolean(member.note && member.note_priority_high),
    attendance: {
      sunday_service: member.attendance?.sunday_service || "unknown",
      small_group_fellowship:
        member.attendance?.small_group_fellowship || "unknown",
    },
    can_edit_note: Boolean(
      member.can_edit_note ?? member.can_edit_attendance,
    ),
    can_edit_profile: canEditProfile(member),
  };
}

function captureAttendanceBaseline() {
  state.attendanceBaseline = new Map(
    state.roster.map((member) => [member.id, serializeAttendanceMember(member)]),
  );
}

function serializeAttendanceMember(member) {
  return JSON.stringify({
    sunday_service: getAttendanceStatus(member, "sunday_service"),
    small_group_fellowship: getAttendanceStatus(member, "small_group_fellowship"),
    note: String(member.note || "").trim(),
    note_carry_forward: member.note_carry_forward !== false,
    note_priority_high: Boolean(String(member.note || "").trim() && member.note_priority_high),
  });
}

function hasAttendanceChanges() {
  if (!state.roster.length) {
    return false;
  }

  return state.roster.some((member) => {
    if (!member.can_edit_attendance && !member.can_edit_note) {
      return false;
    }

    return state.attendanceBaseline.get(member.id) !== serializeAttendanceMember(member);
  });
}

function syncDirtyFromAttendanceChanges() {
  setDirty(hasAttendanceChanges());
}

function normalizeWeek(week, fallbackWeekStart) {
  if (!week) {
    return null;
  }

  const weekStart = week.week_start_date || fallbackWeekStart || "";
  return {
    ...week,
    label: buildWeekLabel(weekStart),
  };
}

function normalizeAttendanceAnalytics(analytics) {
  const empty = emptyAttendanceAnalytics();
  if (!analytics) {
    return empty;
  }

  return {
    recentThreeMonths: {
      ...empty.recentThreeMonths,
      ...analytics.recent_three_months,
      sunday_service: {
        ...empty.recentThreeMonths.sunday_service,
        ...(analytics.recent_three_months?.sunday_service || {}),
      },
      small_group_fellowship: {
        ...empty.recentThreeMonths.small_group_fellowship,
        ...(analytics.recent_three_months?.small_group_fellowship || {}),
      },
    },
    yearToDate: {
      ...empty.yearToDate,
      ...analytics.year_to_date,
      sunday_service: {
        ...empty.yearToDate.sunday_service,
        ...(analytics.year_to_date?.sunday_service || {}),
      },
      small_group_fellowship: {
        ...empty.yearToDate.small_group_fellowship,
        ...(analytics.year_to_date?.small_group_fellowship || {}),
      },
    },
  };
}

function getDisplayedWeekLabel() {
  return buildWeekLabel(
    state.currentWeek?.week_start_date || els.weekInput.value || getMondayIso(new Date()),
  );
}

function getDisplayedWeekStatus() {
  const selectedWeek = state.currentWeek?.week_start_date || els.weekInput.value;
  if (!selectedWeek) {
    return { label: "未選週次", tone: "neutral" };
  }

  const selectedTime = parseIsoDate(selectedWeek).getTime();
  const currentTime = parseIsoDate(getMondayIso(new Date())).getTime();
  if (selectedTime === currentTime) {
    return { label: "本週", tone: "current" };
  }

  return selectedTime < currentTime
    ? { label: "過去週次", tone: "past" }
    : { label: "未來週次", tone: "future" };
}

function syncWeekStatusChip() {
  if (!els.weekStatusChip) {
    return;
  }

  const status = getDisplayedWeekStatus();
  els.weekStatusChip.textContent = status.label;
  els.weekStatusChip.className = `week-status-chip is-${status.tone}`;
}

function renderAttendanceHeader() {
  if (!state.currentMember) {
    els.attendanceHeaderPanel.innerHTML = "";
    els.attendanceSaveWeek.textContent = "尚未載入週次";
    return;
  }

  const scope = [
    state.currentMember.district_name,
    state.currentMember.big_family_name,
    state.currentMember.small_group_name,
  ]
    .filter(Boolean)
    .join(" / ");

  els.attendanceHeaderPanel.innerHTML = `
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">目前登入</span>
        <span class="info-value">${escapeHtml(state.currentMember.full_name)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">職分</span>
        <span class="info-value">${escapeHtml(getRoleLabel(state.currentMember.role))}${state.currentMember.is_admin ? " / 管理員" : ""}</span>
      </div>
      <div class="info-item">
        <span class="info-label">管轄範圍</span>
        <span class="info-value">${escapeHtml(scope || "未設定")}</span>
      </div>
      <div class="info-item">
        <span class="info-label">顯示範圍</span>
        <span class="info-value">${escapeHtml(getAttendanceScopeModeLabel())}</span>
      </div>
      <div class="info-item">
        <span class="info-label">週次</span>
        <span class="info-value">${escapeHtml(getDisplayedWeekLabel())}</span>
      </div>
    </div>
  `;

  els.attendanceSaveWeek.textContent = getDisplayedWeekLabel();
  syncWeekStatusChip();
}

function getAttendanceScopeModeLabel() {
  if (!canUseManageAllToggle()) {
    return "依職分權限";
  }
  return state.ui.manageAll ? "全部管理" : "直屬小家";
}

function renderWeekSummary() {
  const visibleCount = state.roster.length;
  const pendingCount = state.roster.filter(hasPendingAttendance).length;
  const completedCount = Math.max(visibleCount - pendingCount, 0);
  const sundayPresentCount = countStatus("sunday_service", "present");
  const fellowshipPresentCount = countStatus(
    "small_group_fellowship",
    "present",
  );
  const recentThreeMonths = state.attendanceAnalytics.recentThreeMonths;
  const yearToDate = state.attendanceAnalytics.yearToDate;

  els.weekSummary.innerHTML = `
    <div class="summary-item">
      <span class="info-label">總人數</span>
      <strong>${visibleCount}</strong>
    </div>
    <div class="summary-item">
      <span class="info-label">完成/待確認</span>
      <strong>${completedCount} / ${pendingCount}</strong>
    </div>
    <div class="summary-item">
      <span class="info-label">主日</span>
      <strong>${sundayPresentCount} / ${formatPercent(
        sundayPresentCount,
        visibleCount,
      )}</strong>
    </div>
    <div class="summary-item">
      <span class="info-label">小家</span>
      <strong>${fellowshipPresentCount} / ${formatPercent(
        fellowshipPresentCount,
        visibleCount,
      )}</strong>
    </div>
    <details class="summary-details">
      <summary>歷史出席率</summary>
      <div class="summary-details-grid">
        ${renderAnalyticsSummaryCard("近三個月主日", recentThreeMonths.sunday_service)}
        ${renderAnalyticsSummaryCard(
          "近三個月小家",
          recentThreeMonths.small_group_fellowship,
        )}
        ${renderAnalyticsSummaryCard("今年主日", yearToDate.sunday_service)}
        ${renderAnalyticsSummaryCard(
          "今年小家",
          yearToDate.small_group_fellowship,
        )}
      </div>
    </details>
  `;
}

function renderAnalyticsSummaryCard(label, stats) {
  return `
    <div class="summary-item">
      <span class="info-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(formatAnalyticsRate(stats))}</strong>
      <span class="summary-subtext">${escapeHtml(formatAnalyticsBreakdown(stats))}</span>
    </div>
  `;
}

function formatAnalyticsRate(stats) {
  if (!stats?.confirmed_count) {
    return "尚無資料";
  }

  return formatPercent(stats.present_count || 0, stats.confirmed_count);
}

function formatAnalyticsBreakdown(stats) {
  if (!stats) {
    return "尚無歷史資料";
  }

  if (stats.confirmed_count) {
    return `出席 ${stats.present_count || 0} / 已填 ${stats.confirmed_count}`;
  }

  if (stats.unknown_count) {
    return `待確認 ${stats.unknown_count}`;
  }

  return "尚無歷史資料";
}

function renderAttendanceRows() {
  const rows = getFilteredRosterMembers();
  if (!state.roster.length) {
    els.rosterTableBody.innerHTML =
      '<div class="empty-state-card">目前沒有可顯示的人員資料。</div>';
    return;
  }

  if (!rows.length) {
    els.rosterTableBody.innerHTML =
      '<div class="empty-state-card">目前沒有符合條件的人員資料。</div>';
    return;
  }

  let lastGroupLabel = "";
  const shouldGroupRows = shouldGroupAttendanceRows();
  els.rosterTableBody.innerHTML = rows
    .map((member) => {
      const meta = formatMemberScopeSummary(member);
      const groupLabel = getAttendanceGroupLabel(member);
      const groupHeader = shouldGroupRows && groupLabel !== lastGroupLabel
        ? `<div class="attendance-group-header">${escapeHtml(groupLabel)}</div>`
        : "";
      lastGroupLabel = groupLabel;
      const noteValue = escapeHtml(member.note || "");
      const noteCarryChecked = member.note_carry_forward !== false ? "checked" : "";
      const notePriorityChecked = member.note_priority_high ? "checked" : "";
      const notePriorityDisabled = member.note.trim() && member.can_edit_note ? "" : "disabled";
      const readonlyBadge = member.can_edit_attendance
        ? ""
        : '<span class="status-chip neutral">僅檢視</span>';

      return `
        ${groupHeader}
        <article class="attendance-card${member.can_edit_attendance ? "" : " is-readonly"}${member.note_priority_high ? " has-priority-note" : ""}${member.is_self ? " is-self" : ""}">
          <div class="attendance-card-head">
            <div class="row-meta">
              <div class="attendance-name-line">
                <strong class="attendance-member-name name-card gender-${escapeHtml(member.gender || "unknown")}">${escapeHtml(member.full_name)}</strong>
                ${renderGenderBadge(member.gender)}
              </div>
              <div class="attendance-meta-line">
                <span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span>
                ${meta ? `<span class="muted small-text">${escapeHtml(meta)}</span>` : ""}
              </div>
              <div class="attendance-role-line">
                <span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span>
              </div>
            </div>
            ${readonlyBadge
              ? `<div class="attendance-card-actions">${readonlyBadge}</div>`
              : ""}
          </div>

          <div class="attendance-event-grid">
            ${renderAttendanceEventCard(member, "sunday_service", "主日")}
            ${renderAttendanceEventCard(member, "small_group_fellowship", "小家")}
          </div>

          <details class="attendance-note-details${member.note.trim() ? " is-filled" : ""}">
            <summary>${buildNoteSummary(member)}</summary>
            <div class="attendance-note-panel">
              <textarea
                class="note-input"
                data-member-id="${member.id}"
                maxlength="${NOTE_MAX_LENGTH}"
                placeholder="記錄近況、代禱與需要跟進的事項"
                ${member.can_edit_note ? "" : "disabled"}
              >${noteValue}</textarea>
              <div class="attendance-note-actions">
                <label class="note-carry-row">
                  <input
                    class="note-carry-input"
                    type="checkbox"
                    data-member-id="${member.id}"
                    ${noteCarryChecked}
                    ${member.can_edit_note ? "" : "disabled"}
                  />
                  <span>持續提醒</span>
                </label>
                <label class="note-carry-row note-priority-row">
                  <input
                    class="note-priority-input"
                    type="checkbox"
                    data-member-id="${member.id}"
                    ${notePriorityChecked}
                    ${notePriorityDisabled}
                  />
                  <span>高優先度</span>
                </label>
              </div>
            </div>
          </details>
        </article>
      `;
    })
    .join("");
}

function shouldGroupAttendanceRows() {
  if (!state.currentMember || (canUseManageAllToggle() && !state.ui.manageAll)) {
    return false;
  }

  return Boolean(
    state.currentMember.is_admin ||
      ["preacher", "district_leader", "big_family_leader"].includes(
        state.currentMember.role,
      ),
  );
}

function getAttendanceGroupLabel(member) {
  if (!shouldGroupAttendanceRows()) {
    return "";
  }

  if (state.currentMember?.is_admin || state.currentMember?.role === "preacher") {
    return member.district_name || (member.role === "preacher" ? "傳道人" : "其他");
  }

  if (state.currentMember?.role === "district_leader") {
    return member.big_family_name || member.small_group_name || "未設定大家 / 小家";
  }

  if (state.currentMember?.role === "big_family_leader") {
    return member.small_group_name || "未設定小家";
  }

  return "";
}

function getFilteredRosterMembers() {
  const search = state.ui.attendanceSearch.trim().toLowerCase();
  const roleFilter = state.ui.attendanceRole;
  const statusFilter = state.ui.attendanceStatus;

  return state.roster.filter((member) => {
    if (roleFilter && member.role !== roleFilter) {
      return false;
    }

    if (statusFilter === "pending" && !hasPendingAttendance(member)) {
      return false;
    }

    if (statusFilter === "priority" && !member.note_priority_high) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = [
      member.full_name,
      member.district_name,
      member.big_family_name,
      member.small_group_name,
      getRoleLabel(member.role),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

function populateAttendanceRoleFilter() {
  if (!els.attendanceRoleFilter) {
    return;
  }

  const roles = Array.from(new Set(state.roster.map((member) => member.role)))
    .sort((a, b) => (ROLE_ORDER[a] || 99) - (ROLE_ORDER[b] || 99));
  const currentValue = els.attendanceRoleFilter.value;
  els.attendanceRoleFilter.innerHTML = '<option value="">全部職分</option>';
  for (const role of roles) {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = getRoleLabel(role);
    els.attendanceRoleFilter.appendChild(option);
  }
  els.attendanceRoleFilter.value = roles.includes(currentValue) ? currentValue : "";
  state.ui.attendanceRole = els.attendanceRoleFilter.value;
}

function handleAttendanceFilters() {
  if (!canUseAttendanceFilters()) {
    syncAttendanceFilterVisibility();
    renderAttendanceRows();
    return;
  }
  state.ui.attendanceSearch = els.attendanceSearchInput?.value || "";
  state.ui.attendanceRole = els.attendanceRoleFilter?.value || "";
  state.ui.attendanceStatus = els.attendanceStatusFilter?.value || "";
  renderAttendanceRows();
}

function renderAttendanceEventCard(member, eventType, label) {
  const status = getAttendanceStatus(member, eventType);

  return `
    <section class="attendance-event-card status-${status}" data-status="${status}">
      <div class="attendance-event-head">
        <span class="attendance-event-title">${label}</span>
        <span class="attendance-status-text">${STATUS_LABELS[status]}</span>
      </div>
      ${renderAttendanceSelect(member, eventType)}
    </section>
  `;
}

function buildNoteSummary(member) {
  if (member.note_priority_high) {
    return '<span class="note-priority-summary"><span>高度</span><span>優先</span></span>';
  }

  return member.can_edit_note || member.note.trim() ? "備註" : "無備註";
}

function hasPendingAttendance(member) {
  return ["sunday_service", "small_group_fellowship"].some(
    (eventType) => getAttendanceStatus(member, eventType) === "unknown",
  );
}

function getAttendanceStatus(member, eventType) {
  return member.attendance?.[eventType] || "unknown";
}

function updateMemberAttendance(memberId, eventType, status) {
  const member = state.roster.find((item) => item.id === memberId);
  if (!member) {
    return null;
  }

  const currentStatus = getAttendanceStatus(member, eventType);
  const nextStatus = currentStatus === status ? "unknown" : status;

  member.attendance = {
    ...member.attendance,
    [eventType]: nextStatus,
  };

  return {
    member,
    status: nextStatus,
  };
}

function updateMemberNote(memberId, note) {
  const member = state.roster.find((item) => item.id === memberId);
  if (!member) {
    return null;
  }

  member.note = note;
  if (!member.note.trim()) {
    member.note_priority_high = false;
  }
  return member;
}

function updateMemberNoteCarryForward(memberId, shouldCarryForward) {
  const member = state.roster.find((item) => item.id === memberId);
  if (!member) {
    return null;
  }

  member.note_carry_forward = shouldCarryForward;
  return member;
}

function updateMemberNotePriority(memberId, isPriority) {
  const member = state.roster.find((item) => item.id === memberId);
  if (!member) {
    return null;
  }

  member.note_priority_high = Boolean(member.note.trim() && isPriority);
  return member;
}

function syncAttendanceOptionUi(group, status) {
  if (!group) {
    return;
  }

  const options = group.querySelectorAll(".attendance-option");
  for (const option of options) {
    option.classList.toggle("is-active", option.dataset.status === status);
  }

  const eventCard = group.closest(".attendance-event-card");
  if (eventCard) {
    eventCard.dataset.status = status;
    eventCard.classList.remove("status-unknown", "status-present", "status-absent");
    eventCard.classList.add(`status-${status}`);
    const statusText = eventCard.querySelector(".attendance-status-text");
    if (statusText) {
      statusText.textContent = STATUS_LABELS[status];
    }
  }
}

function syncNoteSummary(details, member) {
  if (!details || !member) {
    return;
  }

  details.classList.toggle("is-filled", Boolean(member.note.trim()));
  details.closest(".attendance-card")?.classList.toggle(
    "has-priority-note",
    Boolean(member.note_priority_high),
  );
  const summary = details.querySelector("summary");
  if (summary) {
    summary.innerHTML = buildNoteSummary(member);
  }

  const priorityInput = details.querySelector(".note-priority-input");
  if (priorityInput) {
    priorityInput.disabled = !member.can_edit_note || !member.note.trim();
    priorityInput.checked = Boolean(member.note_priority_high);
  }
}

function renderAttendanceSelect(member, eventType) {
  const label = eventType === "sunday_service" ? "主日聚會" : "小家團契";
  const disabled = member.can_edit_attendance ? "" : "disabled";
  const currentStatus = getAttendanceStatus(member, eventType);

  return `
    <div
      class="attendance-toggle"
      role="group"
      aria-label="${escapeHtml(member.full_name)} ${label}"
    >
      <button
        type="button"
        class="attendance-option is-present${currentStatus === "present" ? " is-active" : ""}"
        data-member-id="${member.id}"
        data-event-type="${eventType}"
        data-status="present"
        ${disabled}
      >
        出席
      </button>
      <button
        type="button"
        class="attendance-option is-absent${currentStatus === "absent" ? " is-active" : ""}"
        data-member-id="${member.id}"
        data-event-type="${eventType}"
        data-status="absent"
        ${disabled}
      >
        未出席
      </button>
    </div>
  `;
}

function countStatus(eventType, status) {
  return state.roster.filter(
    (member) => getSelectedAttendanceStatus(member.id, eventType) === status,
  ).length;
}

function getSelectedAttendanceStatus(memberId, eventType) {
  const member = state.roster.find((item) => item.id === memberId);
  return member ? getAttendanceStatus(member, eventType) : "unknown";
}

function getSelectedNote(memberId) {
  const member = state.roster.find((item) => item.id === memberId);
  return normalizeNote(member?.note || "");
}

async function handleShiftWeek(dayDelta) {
  if (!canDiscardDirtyChanges()) {
    return;
  }

  const current = parseIsoDate(els.weekInput.value || getMondayIso(new Date()));
  current.setDate(current.getDate() + dayDelta);
  const weekStart = getMondayIso(current);
  els.weekInput.value = weekStart;
  const cached = state.dashboardCache.get(getDashboardCacheKey(weekStart));
  if (cached) {
    applyDashboardData(cached, weekStart);
    setDirty(false);
    prefetchAdjacentWeeks(weekStart);
    return;
  }

  await loadDashboard();
}

async function handleRefreshDashboard() {
  if (!state.currentMember) {
    return;
  }

  await loadDashboard();
  showToast("資料已重新整理。");
}

async function handleWeekChange() {
  if (!state.currentMember) {
    return;
  }

  await loadDashboard();
}

function handleAttendanceFieldChange(event) {
  if (!event.target.matches(".note-input, .note-carry-input, .note-priority-input")) {
    return;
  }

  const memberId = Number(event.target.dataset.memberId);
  if (!memberId) {
    return;
  }

  if (event.target.matches(".note-input")) {
    const normalizedNote = normalizeNote(event.target.value);
    if (event.target.value !== normalizedNote) {
      event.target.value = normalizedNote;
      showToast(`備註最多 ${NOTE_MAX_LENGTH} 字。`);
    }
    const member = updateMemberNote(memberId, normalizedNote);
    syncNoteSummary(event.target.closest(".attendance-note-details"), member);
  } else if (event.target.matches(".note-carry-input")) {
    updateMemberNoteCarryForward(memberId, event.target.checked);
  } else {
    const member = updateMemberNotePriority(memberId, event.target.checked);
    syncNoteSummary(event.target.closest(".attendance-note-details"), member);
  }
  syncDirtyFromAttendanceChanges();
}

function handleRosterActions(event) {
  const attendanceOption = event.target.closest(".attendance-option");
  if (attendanceOption) {
    const memberId = Number(attendanceOption.dataset.memberId);
    const eventType = attendanceOption.dataset.eventType;
    const status = attendanceOption.dataset.status;

    if (!memberId || !eventType || !status) {
      return;
    }

    const updated = updateMemberAttendance(memberId, eventType, status);
    if (!updated) {
      return;
    }

    syncAttendanceOptionUi(
      attendanceOption.closest(".attendance-toggle"),
      updated.status,
    );
    syncDirtyFromAttendanceChanges();
    renderWeekSummary();
    return;
  }

  const button = event.target.closest(".roster-edit-btn");
  if (!button) {
    return;
  }

  const memberId = Number(button.dataset.memberId);
  if (!memberId) {
    return;
  }

  switchTab(TABS.people);
  openMemberEditor("edit", memberId);
}

async function handleSaveAttendance() {
  if (!state.currentWeek) {
    showToast("尚未載入點名資料。");
    return;
  }

  const entries = state.roster
    .filter((member) => member.can_edit_attendance || member.can_edit_note)
    .map((member) => ({
      member_id: member.id,
      sunday_service: getSelectedAttendanceStatus(member.id, "sunday_service"),
      small_group_fellowship: getSelectedAttendanceStatus(
        member.id,
        "small_group_fellowship",
      ),
      note: getSelectedNote(member.id),
      note_carry_forward: member.note_carry_forward !== false,
      note_priority_high: Boolean(member.note.trim() && member.note_priority_high),
    }));

  if (!entries.length) {
    showToast("目前沒有可儲存的內容。");
    return;
  }

  setButtonLoading(els.saveAttendanceBtn, true, "儲存中...");
  setButtonLoading(els.saveAttendanceBtnBottom, true, "儲存中...");
  let saveSucceeded = false;
  try {
    const data = await apiRequest("save-attendance", {
      method: "POST",
      authMode: "app",
      body: {
        week_start: els.weekInput.value,
        manage_all: state.ui.manageAll && canUseManageAllToggle(),
        entries,
      },
    });

    setDirty(false);
    await Promise.all([loadDashboard({ skipDirtyCheck: true }), loadAdminPanel()]);
    saveSucceeded = true;
  } catch (error) {
    console.error(error);
    showToast(error.message || "儲存點名失敗。");
  } finally {
    setButtonLoading(els.saveAttendanceBtn, false);
    setButtonLoading(els.saveAttendanceBtnBottom, false);
    if (saveSucceeded) {
      showAttendanceSaveSuccessFeedback();
    }
  }
}

function formatMemberScopeSummary(member) {
  if (!state.currentMember) {
    return "";
  }

  const viewer = state.currentMember;
  if (viewer.is_admin) {
    return [member.district_name, member.big_family_name, member.small_group_name]
      .filter(Boolean)
      .join(" / ");
  }

  if (viewer.role === "district_leader") {
    return [member.big_family_name, member.small_group_name]
      .filter(Boolean)
      .join(" / ");
  }

  if (viewer.role === "big_family_leader") {
    return [member.small_group_name].filter(Boolean).join(" / ");
  }

  return "";
}

function formatPercent(numerator, denominator) {
  if (!denominator) {
    return "0%";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function normalizeNote(value) {
  const note = String(value || "").trim();
  return note.length > NOTE_MAX_LENGTH ? note.slice(0, NOTE_MAX_LENGTH) : note;
}

function renderGenderBadge(gender) {
  if (!gender) {
    return "";
  }

  return `<span class="gender-badge ${gender}">${escapeHtml(
    getGenderLabel(gender),
  )}</span>`;
}

async function loadAdminPanel() {
  if (!canUseManagement()) {
    state.adminData = emptyAdminData();
    closeMemberEditor();
    renderManagement();
    renderInvites();
    return;
  }

  try {
    const data = await apiRequest("admin-overview", {
      method: "GET",
      authMode: "app",
    });

    state.adminData = {
      districts: data.districts || [],
      bigFamilies: data.big_families || [],
      smallGroups: data.small_groups || [],
      members: sortMembers(data.members || []),
      invites: data.invites || [],
      latestInvite: state.adminData.latestInvite,
    };
    renderManagement();
    renderInvites();
  } catch (error) {
    console.error(error);
    showToast(error.message || "載入管理資料失敗。");
  }
}

async function loadAttendanceOverview(weekStart = "") {
  if (!canUseOverview()) {
    state.overviewData = null;
    state.ui.overviewLoading = false;
    renderAttendanceOverview();
    return;
  }

  state.ui.overviewLoading = true;
  renderAttendanceOverview();

  try {
    const targetWeek = weekStart || state.ui.overviewWeekStart || els.weekInput.value || getMondayIso(new Date());
    const data = await apiRequest(
      `attendance-overview&week_start=${encodeURIComponent(targetWeek)}`,
      {
        method: "GET",
        authMode: "app",
      },
    );
    state.overviewData = normalizeOverviewData(data);
    state.ui.overviewWeekStart = state.overviewData.selectedWeekStart;
  } catch (error) {
    console.error(error);
    showToast(error.message || "載入出席總覽失敗。");
  } finally {
    state.ui.overviewLoading = false;
    renderAttendanceOverview();
  }
}

function normalizeOverviewData(data) {
  const selectedWeekStart = data?.selected_week_start || getMondayIso(new Date());
  return {
    scopeLabel: data?.scope_label || "可檢視範圍",
    selectedWeekStart,
    weeks: buildOverviewWeekOptions(data?.weeks || [], selectedWeekStart),
    units: data?.units || [],
  };
}

function buildOverviewWeekOptions(serverWeeks, selectedWeekStart) {
  const currentWeekStart = getMondayIso(new Date());
  const weekMap = new Map();

  for (let index = 0; index < 26; index += 1) {
    const weekDate = parseIsoDate(currentWeekStart);
    weekDate.setDate(weekDate.getDate() - index * 7);
    const weekStart = formatDate(weekDate);
    weekMap.set(weekStart, {
      week_start_date: weekStart,
      label: buildWeekLabel(weekStart),
    });
  }

  for (const week of serverWeeks) {
    if (week?.week_start_date) {
      weekMap.set(week.week_start_date, week);
    }
  }

  if (selectedWeekStart && !weekMap.has(selectedWeekStart)) {
    weekMap.set(selectedWeekStart, {
      week_start_date: selectedWeekStart,
      label: buildWeekLabel(selectedWeekStart),
    });
  }

  return Array.from(weekMap.values()).sort((left, right) =>
    String(right.week_start_date).localeCompare(String(left.week_start_date)),
  );
}

function switchOverviewEvent(eventType) {
  if (!eventType || state.ui.overviewEvent === eventType) {
    return;
  }

  state.ui.overviewEvent = eventType;
  renderAttendanceOverview();
}

function switchOverviewUnitType(unitType) {
  if (state.ui.overviewUnitType === unitType) {
    return;
  }

  state.ui.overviewUnitType = unitType;
  renderAttendanceOverview();
}

function handleOverviewWeekClick(event) {
  const dateButton = event.target.closest("[data-overview-date-button]");
  if (dateButton) {
    const input = els.overviewWeekScroller?.querySelector("#overviewDateInput");
    if (input?.showPicker) {
      input.showPicker();
    } else {
      input?.focus();
      input?.click();
    }
    return;
  }

  const button = event.target.closest("[data-overview-week]");
  if (!button) {
    return;
  }

  loadAttendanceOverview(button.dataset.overviewWeek);
}

function handleOverviewDateChange(event) {
  const input = event.target.closest("#overviewDateInput");
  if (!input?.value) {
    return;
  }

  loadAttendanceOverview(getMondayIso(input.value));
}

function handleOverviewUnitToggle(event) {
  const details = event.target;
  if (details.matches?.(".overview-member-details")) {
    const memberKey = details.dataset.overviewMemberKey || "";
    if (!memberKey) {
      return;
    }
    if (details.open) {
      state.ui.overviewOpenMemberKeys.add(memberKey);
    } else {
      state.ui.overviewOpenMemberKeys.delete(memberKey);
    }
    return;
  }

  if (!details.matches?.(".overview-unit-details")) {
    return;
  }

  const unitKey = details.dataset.overviewUnitKey || "";
  if (!details.open) {
    if (state.ui.overviewOpenUnitKey === unitKey) {
      state.ui.overviewOpenUnitKey = "";
    }
    return;
  }

  state.ui.overviewOpenUnitKey = unitKey;

  els.overviewUnitList
    ?.querySelectorAll(".overview-unit-details[open]")
    .forEach((item) => {
      if (item !== details) {
        item.open = false;
      }
    });
}

function handleOverviewHistoryRangeClick(event) {
  const button = event.target.closest("[data-overview-history-range]");
  if (!button) {
    return;
  }

  const rangeKey = button.dataset.overviewHistoryRange;
  if (!getOverviewHistoryRangeDefinitions().some((range) => range.key === rangeKey)) {
    return;
  }

  state.ui.overviewHistoryRange = rangeKey;
  renderOverviewUnits();
}

function renderAttendanceOverview() {
  if (!els.overviewView) {
    return;
  }

  setTabActive(
    document.querySelector(`[data-overview-event="${state.ui.overviewEvent}"]`),
    true,
  );
  els.overviewEventButtons?.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.overviewEvent === state.ui.overviewEvent);
  });
  if (els.overviewUnitTypeSelect) {
    els.overviewUnitTypeSelect.value = state.ui.overviewUnitType;
  }

  if (!state.overviewData) {
    if (els.overviewScopeSummary) {
      els.overviewScopeSummary.textContent = canUseOverview()
        ? "正在載入出席總覽..."
        : "此職分無法使用出席總覽。";
    }
    if (els.overviewUnitList) {
      els.overviewUnitList.innerHTML = "";
    }
    return;
  }

  if (els.overviewScopeSummary) {
    els.overviewScopeSummary.textContent =
      state.ui.overviewLoading
        ? `正在更新出席總覽...目前顯示 ${buildWeekLabel(state.overviewData.selectedWeekStart)}`
        : `${state.overviewData.scopeLabel}，目前週次 ${buildWeekLabel(state.overviewData.selectedWeekStart)}`;
  }

  els.overviewView?.classList.toggle("is-loading", state.ui.overviewLoading);

  renderOverviewWeeks();
  renderOverviewUnits();
}

function renderOverviewWeeks() {
  if (!els.overviewWeekScroller) {
    return;
  }

  const currentWeekStart = getMondayIso(new Date());
  const quickWeeks = [
    { label: "本週", week_start_date: currentWeekStart },
    { label: "上週", week_start_date: addDaysIso(currentWeekStart, -7) },
    { label: "前週", week_start_date: addDaysIso(currentWeekStart, -14) },
  ];
  const quickWeekSet = new Set(quickWeeks.map((week) => week.week_start_date));
  const isCustomWeek = !quickWeekSet.has(state.overviewData.selectedWeekStart);
  els.overviewWeekScroller.innerHTML = `
    <div class="overview-week-quick">
      ${quickWeeks.map((week) => `
        <button
          type="button"
          class="overview-week-chip overview-week-current${state.overviewData.selectedWeekStart === week.week_start_date ? " is-active" : ""}"
          data-overview-week="${escapeHtml(week.week_start_date)}"
        >
          <strong>${escapeHtml(week.label)}</strong>
          <span>${escapeHtml(buildShortWeekLabel(week.week_start_date))}</span>
        </button>
      `).join("")}
    </div>
    <button type="button" class="overview-date-button${isCustomWeek ? " is-active" : ""}" data-overview-date-button>
      選日期
    </button>
    <input id="overviewDateInput" class="overview-date-input" type="date" value="${escapeHtml(state.overviewData.selectedWeekStart)}" />
  `;
}

function renderOverviewUnits() {
  if (!els.overviewUnitList) {
    return;
  }

  const units = (state.overviewData.units || []).filter((unit) =>
    state.ui.overviewUnitType ? unit.type === state.ui.overviewUnitType : true,
  );
  if (!units.length) {
    els.overviewUnitList.innerHTML =
      '<div class="empty-state-card">目前沒有符合篩選的出席單位。</div>';
    return;
  }

  els.overviewUnitList.innerHTML = units.map(renderOverviewUnitCard).join("");
}

function renderOverviewUnitCard(unit) {
  const eventType = state.ui.overviewEvent;
  const stats = unit.stats?.[eventType] || createEmptyEventStats();
  const detail = unit.detail?.[eventType] || createEmptyOverviewDetail();
  const memberCount = Number(unit.member_count || 0);
  const presentCount = Number(stats.present_count || 0);
  const absentCount = Number(stats.absent_count || 0);
  const confirmedCount = Number(stats.confirmed_count || presentCount + absentCount);
  const unknownCount = Math.max(0, Number(stats.unknown_count ?? (memberCount - confirmedCount)));
  const parentLabel = unit.parent_name ? `所屬 ${unit.parent_name}` : "";
  const unitKey = getOverviewUnitKey(unit);
  const shouldOpen = state.ui.overviewOpenUnitKey === unitKey;

  return `
    <details
      class="overview-unit-details overview-level-${escapeHtml(unit.level || unit.type)}"
      data-overview-unit-key="${escapeHtml(unitKey)}"
      ${shouldOpen ? "open" : ""}
    >
      <summary>
        <span class="overview-unit-main">
          <span class="overview-unit-title">${escapeHtml(unit.name)}</span>
          ${parentLabel ? `<span class="muted small-text">${escapeHtml(parentLabel)}</span>` : ""}
        </span>
        <span class="overview-unit-stat">
          <strong>${escapeHtml(formatOverviewRate(stats, memberCount))}</strong>
          <span class="summary-subtext">出席 ${presentCount} 人 / 未出席 ${absentCount} 人 / 待確認 ${unknownCount} 人</span>
        </span>
      </summary>
      <div class="overview-mini-stats">
        <span class="status-chip success">出席 ${presentCount} 人</span>
        <span class="status-chip warning">未出席 ${absentCount} 人</span>
        <span class="status-chip neutral">待確認 ${unknownCount} 人</span>
        <span class="status-chip neutral">共 ${memberCount} 人</span>
      </div>
      <div class="overview-detail-grid">
        ${renderOverviewStatusGroup("出席", detail.present || [])}
        ${renderOverviewStatusGroup("未出席", detail.absent || [])}
        ${renderOverviewStatusGroup("待確認", detail.unknown || [])}
      </div>
    </details>
  `;
}

function getOverviewUnitKey(unit) {
  return `${unit.type || "unit"}:${unit.id || unit.name || ""}`;
}

function renderOverviewStatusGroup(label, members) {
  const sortedMembers = sortMembers([...(members || [])]);
  return `
    <section class="overview-status-group">
      <div class="overview-status-head">
        <strong>${escapeHtml(label)}</strong>
        <span class="status-chip neutral">${sortedMembers.length}</span>
      </div>
      <div class="overview-member-list">
        ${sortedMembers.length
          ? sortedMembers.map(renderOverviewMember).join("")
          : '<span class="muted small-text">無人員</span>'}
      </div>
    </section>
  `;
}

function renderOverviewMember(member) {
  const alerts = getOverviewMemberAlerts(member);
  const hasRegularNote = Boolean(member.note && !member.note_priority_high);
  const memberKey = getOverviewMemberKey(member);
  const shouldOpen = state.ui.overviewOpenMemberKeys.has(memberKey);
  return `
    <details
      class="overview-member-details${alerts.length ? " has-alerts" : ""}"
      data-overview-member-key="${escapeHtml(memberKey)}"
      ${shouldOpen ? "open" : ""}
    >
      <summary class="overview-member-row">
        <span class="name-card gender-${escapeHtml(member.gender || "unknown")}">${escapeHtml(member.full_name)}</span>
        <span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span>
        ${alerts.map(renderOverviewAlertBadge).join("")}
        ${hasRegularNote ? '<span class="overview-note-badge">有備註</span>' : ""}
      </summary>
      ${alerts.length ? renderOverviewAlertPanel(alerts) : ""}
      ${hasRegularNote ? renderOverviewNotePanel(member.note) : ""}
      ${renderOverviewMemberHistory(member.history)}
    </details>
  `;
}

function getOverviewMemberAlerts(member) {
  const alerts = [];
  const eventType = state.ui.overviewEvent;
  const monthStats = member.history?.month?.[eventType] || null;
  const threeMonthStats = member.history?.three_months?.[eventType] || null;

  if (member.note_priority_high && member.note) {
    alerts.push({
      tone: "danger",
      label: "高優先備註",
      detail: `高優先備註：${member.note}`,
    });
  }

  const monthPresent = Number(monthStats?.present_count || 0);
  const monthAbsent = Number(monthStats?.absent_count || 0);
  const monthConfirmed = Number(monthStats?.confirmed_count || monthPresent + monthAbsent);
  if (monthConfirmed >= 2 && monthAbsent >= 2 && monthPresent === 0) {
    alerts.push({
      tone: "danger",
      label: "近月連缺",
      detail: `近一個月已填 ${monthConfirmed} 次，皆未出席。`,
    });
  } else if (monthAbsent >= 1 && monthPresent === 0 && monthConfirmed >= 1) {
    alerts.push({
      tone: "warning",
      label: "最近未出席",
      detail: `近一個月已填 ${monthConfirmed} 次，尚無出席紀錄。`,
    });
  }

  const threePresent = Number(threeMonthStats?.present_count || 0);
  const threeAbsent = Number(threeMonthStats?.absent_count || 0);
  const threeConfirmed = Number(threeMonthStats?.confirmed_count || threePresent + threeAbsent);
  const threeRate = threeConfirmed ? threePresent / threeConfirmed : null;
  if (threeConfirmed >= 4 && threeRate !== null && threeRate < 0.5) {
    alerts.push({
      tone: "warning",
      label: "近三月偏低",
      detail: `近三個月出席率 ${formatPercent(threePresent, threeConfirmed)}（出席 ${threePresent} / 已填 ${threeConfirmed}）。`,
    });
  }

  return alerts;
}

function renderOverviewAlertBadge(alert) {
  return `<span class="overview-alert-badge ${escapeHtml(alert.tone)}">${escapeHtml(alert.label)}</span>`;
}

function renderOverviewAlertPanel(alerts) {
  return `
    <div class="overview-alert-panel">
      ${alerts.map((alert) => `
        <span class="overview-alert-reason ${escapeHtml(alert.tone)}">${escapeHtml(alert.detail)}</span>
      `).join("")}
    </div>
  `;
}

function renderOverviewNotePanel(note) {
  return `
    <div class="overview-alert-panel">
      <span class="overview-alert-reason note">備註：${escapeHtml(note)}</span>
    </div>
  `;
}

function renderOverviewMemberHistory(history) {
  const ranges = getOverviewHistoryRangeDefinitions()
    .map((range) => ({
      ...range,
      data: history?.[range.key],
    }))
    .filter((range) => range.data);
  if (!ranges.length) {
    return '<div class="overview-history-grid"><span class="muted small-text" style="padding: 10px;">尚無歷史出席資料</span></div>';
  }

  const selectedRange = ranges.find((range) => range.key === state.ui.overviewHistoryRange) || ranges[0];

  return `
    <div class="overview-history-panel">
      <div class="overview-history-range-tabs">
        ${ranges.map((range) => renderOverviewHistoryRangeButton(range)).join("")}
      </div>
      ${renderOverviewHistoryRange(selectedRange.data)}
    </div>
  `;
}

function getOverviewHistoryRangeDefinitions() {
  return [
    { key: "month", label: "本月" },
    { key: "three_months", label: "近三個月" },
    { key: "half_year", label: "近半年" },
    { key: "year", label: "近一年" },
  ];
}

function renderOverviewHistoryRangeButton(range) {
  const isActive = range.key === state.ui.overviewHistoryRange;
  return `
    <button
      type="button"
      class="overview-history-range-btn${isActive ? " is-active" : ""}"
      data-overview-history-range="${escapeHtml(range.key)}"
    >
      ${escapeHtml(range.label)}
    </button>
  `;
}

function getOverviewMemberKey(member) {
  return `member:${member.id || member.full_name || ""}`;
}

function renderOverviewHistoryRange(range) {
  return `
    <section class="overview-history-card">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
        <strong style="font-size: 1.05rem;">${escapeHtml(range.label || "出席率")}</strong>
        <span class="muted" style="font-size: 0.72rem; opacity: 0.8;">${escapeHtml(range.start_date || "")} ~ ${escapeHtml(range.end_date || "")}</span>
      </div>
      <div class="overview-history-events" style="display: grid; gap: 8px;">
        ${renderOverviewHistoryEvent("主日聚會", range.sunday_service)}
        ${renderOverviewHistoryEvent("小家團契", range.small_group_fellowship)}
      </div>
    </section>
  `;
}

function renderOverviewHistoryEvent(label, stats) {
  return `
    <div class="overview-history-event">
      <span class="info-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(formatAnalyticsRate(stats))}</strong>
      <span class="summary-subtext">${escapeHtml(formatDetailedAnalyticsBreakdown(stats))}</span>
    </div>
  `;
}

function formatDetailedAnalyticsBreakdown(stats) {
  if (!stats) {
    return "尚無資料";
  }
  return `出席 ${stats.present_count || 0} / 缺席 ${stats.absent_count || 0} / 待確認 ${stats.unknown_count || 0}`;
}

function createEmptyEventStats() {
  return {
    present_count: 0,
    absent_count: 0,
    unknown_count: 0,
    confirmed_count: 0,
  };
}

function createEmptyOverviewDetail() {
  return {
    present: [],
    absent: [],
    unknown: [],
  };
}

function formatOverviewRate(stats, memberCount = 0) {
  return memberCount
    ? formatPercent(stats?.present_count || 0, memberCount)
    : "尚無資料";
}

function renderManagement() {
  if (!canUseManagement()) {
    setHidden(els.peopleView, true);
    closeOrgEditor();
    return;
  }

  const editableMembers = getEditableManagementMembers();
  renderPeopleFilters(editableMembers);
  renderPeopleTable(editableMembers);
  renderOrganizationTools();
  refreshOpenMemberEditorOptions();
  renderMemberEditor();
  renderOrganizationTables();
}

function refreshOpenMemberEditorOptions() {
  if (!state.ui.editorMode) {
    return;
  }

  const editingMember = state.ui.editingMemberId
    ? state.adminData.members.find((member) => member.id === state.ui.editingMemberId)
    : null;

  syncEditorBigFamilyOptions(editingMember);
  syncEditorSmallGroupOptions(editingMember);
  syncMemberFormScope();
}

function renderPeopleFilters(editableMembers) {
  const availableRoles = Array.from(
    new Set(editableMembers.map((member) => member.role)),
  ).sort((a, b) => (ROLE_ORDER[a] || 99) - (ROLE_ORDER[b] || 99));

  fillSelect(
    els.peopleRoleFilter,
    availableRoles.map((role) => ({
      value: role,
      label: getRoleLabel(role),
    })),
    {
      placeholder: "全部職分",
      keepEmptyOption: true,
    },
  );

  if (
    state.ui.peopleRole &&
    availableRoles.includes(state.ui.peopleRole)
  ) {
    els.peopleRoleFilter.value = state.ui.peopleRole;
  } else {
    state.ui.peopleRole = "";
    els.peopleRoleFilter.value = "";
  }

  els.peopleSearchInput.value = state.ui.peopleSearch;
}

function getEditableManagementMembers() {
  if (!state.currentMember) {
    return [];
  }

  if (state.currentMember.is_admin) {
    return state.adminData.members;
  }

  return state.adminData.members.filter(
    (member) =>
      member.district_id === state.currentMember.district_id &&
      MEMBER_ROLES.includes(member.role),
  );
}

function getFilteredManagementMembers() {
  const search = state.ui.peopleSearch.trim().toLowerCase();
  const roleFilter = state.ui.peopleRole;

  return getEditableManagementMembers().filter((member) => {
    if (roleFilter && member.role !== roleFilter) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = [
      member.full_name,
      member.district_name,
      member.big_family_name,
      member.small_group_name,
      getRoleLabel(member.role),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });
}

function renderPeopleTable(editableMembers) {
  const rows = getFilteredManagementMembers();
  if (els.peopleSummary) {
    els.peopleSummary.textContent = editableMembers.length
      ? `目前顯示 ${rows.length} 位，可管理總數 ${editableMembers.length} 位`
      : "目前沒有可編輯的人員資料";
  }

  if (!rows.length) {
    els.peopleTableBody.innerHTML =
      '<div class="empty-state-card">目前沒有符合條件、且你可編輯的人員資料。</div>';
    return;
  }

  const shouldOpenGroups = Boolean(state.ui.peopleSearch || state.ui.peopleRole);
  els.peopleTableBody.innerHTML = buildPeopleHierarchy(rows)
    .map((district) => renderPeopleDistrictGroup(district, shouldOpenGroups))
    .join("");
}

function buildPeopleHierarchy(rows) {
  const districts = new Map();

  for (const member of rows) {
    const districtKey = member.district_id || `name:${member.district_name || "其他"}`;
    const districtLabel = member.district_name || "未設定區";
    const bigFamilyKey = member.big_family_id || `name:${member.big_family_name || "未設定大家"}`;
    const bigFamilyLabel = member.big_family_name || "未設定大家";
    const smallGroupKey = member.small_group_id || `name:${member.small_group_name || "未設定小家"}`;
    const smallGroupLabel = member.small_group_name || "未設定小家";

    if (!districts.has(districtKey)) {
      districts.set(districtKey, {
        key: `district:${districtKey}`,
        label: districtLabel,
        count: 0,
        bigFamilies: new Map(),
        smallGroups: new Map(),
      });
    }
    const district = districts.get(districtKey);
    district.count += 1;

    if (!member.big_family_id && !member.big_family_name) {
      if (!district.smallGroups.has(smallGroupKey)) {
        district.smallGroups.set(smallGroupKey, {
          key: `district:${districtKey}:small:${smallGroupKey}`,
          label: smallGroupLabel,
          members: [],
        });
      }
      district.smallGroups.get(smallGroupKey).members.push(member);
      continue;
    }

    if (!district.bigFamilies.has(bigFamilyKey)) {
      district.bigFamilies.set(bigFamilyKey, {
        key: `district:${districtKey}:big:${bigFamilyKey}`,
        label: bigFamilyLabel,
        count: 0,
        smallGroups: new Map(),
      });
    }
    const bigFamily = district.bigFamilies.get(bigFamilyKey);
    bigFamily.count += 1;

    if (!bigFamily.smallGroups.has(smallGroupKey)) {
      bigFamily.smallGroups.set(smallGroupKey, {
        key: `district:${districtKey}:big:${bigFamilyKey}:small:${smallGroupKey}`,
        label: smallGroupLabel,
        members: [],
      });
    }
    bigFamily.smallGroups.get(smallGroupKey).members.push(member);
  }

  return Array.from(districts.values())
    .sort((left, right) => left.label.localeCompare(right.label, "zh-Hant"))
    .map((district) => ({
      ...district,
      bigFamilies: Array.from(district.bigFamilies.values())
        .sort((left, right) => left.label.localeCompare(right.label, "zh-Hant"))
        .map((bigFamily) => ({
          ...bigFamily,
          smallGroups: Array.from(bigFamily.smallGroups.values())
            .sort((left, right) => left.label.localeCompare(right.label, "zh-Hant"))
            .map((smallGroup) => ({
              ...smallGroup,
              members: sortMembers(smallGroup.members),
            })),
        })),
      smallGroups: Array.from(district.smallGroups.values())
        .sort((left, right) => left.label.localeCompare(right.label, "zh-Hant"))
        .map((smallGroup) => ({
          ...smallGroup,
          members: sortMembers(smallGroup.members),
        })),
    }));
}

function renderPeopleDistrictGroup(district, shouldOpen = false) {
  const groupKey = district.key;
  const isOpen = shouldOpen || state.ui.peopleOpenGroups.has(groupKey);
  return `
    <details class="people-scope-group people-level-district" data-people-group-key="${escapeHtml(groupKey)}" ${isOpen ? "open" : ""}>
      <summary>
        <span class="people-scope-title">${escapeHtml(district.label)}</span>
        <span class="status-chip neutral">${district.count}</span>
      </summary>
      <div class="people-scope-children">
        ${district.bigFamilies.map((bigFamily) => renderPeopleBigFamilyGroup(bigFamily, shouldOpen)).join("")}
        ${district.smallGroups.map((smallGroup) => renderPeopleSmallGroup(smallGroup, shouldOpen)).join("")}
      </div>
    </details>
  `;
}

function renderPeopleBigFamilyGroup(bigFamily, shouldOpen = false) {
  const groupKey = bigFamily.key;
  const isOpen = shouldOpen || state.ui.peopleOpenGroups.has(groupKey);
  return `
    <details class="people-scope-group people-level-big-family" data-people-group-key="${escapeHtml(groupKey)}" ${isOpen ? "open" : ""}>
      <summary>
        <span class="people-scope-title">${escapeHtml(bigFamily.label)}</span>
        <span class="status-chip neutral">${bigFamily.count}</span>
      </summary>
      <div class="people-scope-children">
        ${bigFamily.smallGroups.map((smallGroup) => renderPeopleSmallGroup(smallGroup, shouldOpen)).join("")}
      </div>
    </details>
  `;
}

function renderPeopleSmallGroup(smallGroup, shouldOpen = false) {
  const groupKey = smallGroup.key;
  const isOpen = shouldOpen || state.ui.peopleOpenGroups.has(groupKey);
  return `
    <details class="people-scope-group people-level-small-group" data-people-group-key="${escapeHtml(groupKey)}" ${isOpen ? "open" : ""}>
      <summary>
        <span class="people-scope-title">${escapeHtml(smallGroup.label)}</span>
        <span class="status-chip neutral">${smallGroup.members.length}</span>
      </summary>
      <div class="people-scope-members">
        ${smallGroup.members.map(renderPeopleMemberCard).join("")}
      </div>
    </details>
  `;
}

function handlePeopleGroupToggle(event) {
  const details = event.target;
  if (!details.matches?.(".people-scope-group")) {
    return;
  }

  const groupKey = details.dataset.peopleGroupKey;
  if (!groupKey) {
    return;
  }

  if (details.open) {
    state.ui.peopleOpenGroups.add(groupKey);
  } else {
    state.ui.peopleOpenGroups.delete(groupKey);
  }
}

function renderPeopleMemberCard(member) {
      const path = formatPeopleScopeSummary(member);
      const lineStatus = member.line_user_id
        ? '<span class="status-chip success">已綁定</span>'
        : LOGIN_ROLES.includes(member.role)
          ? '<span class="status-chip warning">待綁定</span>'
          : "";
      const lineBindingText = member.line_user_id
        ? "已完成綁定"
        : LOGIN_ROLES.includes(member.role)
          ? "尚待綁定"
          : "";
      const canDelete = canDeleteMember(member);
      const canRestore = canRestoreMember(member);

      return `
        <article class="member-card">
          <div class="member-card-head">
            <div class="row-meta">
              <div class="member-card-title">
                <strong>${escapeHtml(member.full_name)}</strong>
                ${renderGenderBadge(member.gender)}
              </div>
              <div class="member-card-chips">
                <span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span>
                ${lineStatus}
              </div>
              ${path ? `<div class="member-card-path muted small-text">${escapeHtml(path)}</div>` : ""}
            </div>
            <div class="row-actions">
              <button type="button" class="secondary people-edit-btn" data-member-id="${member.id}">編輯</button>
              ${canRestore
                ? `<button type="button" class="secondary people-restore-btn" data-member-id="${member.id}" data-member-name="${escapeHtml(member.full_name)}">恢復啟用</button>`
                : ""}
              ${canDelete
                ? `<button type="button" class="secondary danger-button people-delete-btn" data-member-id="${member.id}" data-member-name="${escapeHtml(member.full_name)}">停用封存</button>`
                : ""}
            </div>
          </div>

          ${path || lineBindingText
            ? `<div class="member-card-grid">
                ${path
                  ? `<div class="info-item">
                      <span class="info-label">歸屬</span>
                      <span>${escapeHtml(path)}</span>
                    </div>`
                  : ""}
                ${lineBindingText
                  ? `<div class="info-item">
                      <span class="info-label">LINE 綁定</span>
                      <span>${escapeHtml(lineBindingText)}</span>
                    </div>`
                  : ""}
              </div>`
            : ""}
        </article>
      `;
}

function handlePeopleFilters() {
  state.ui.peopleSearch = els.peopleSearchInput.value || "";
  state.ui.peopleRole = els.peopleRoleFilter.value || "";
  renderPeopleTable(getEditableManagementMembers());
}

function handlePeopleTableClick(event) {
  const restoreButton = event.target.closest(".people-restore-btn");
  if (restoreButton) {
    const memberId = Number(restoreButton.dataset.memberId);
    const memberName = restoreButton.dataset.memberName || "這位人員";
    if (!memberId) {
      return;
    }

    handleRestoreMember(restoreButton, memberId, memberName);
    return;
  }

  const deleteButton = event.target.closest(".people-delete-btn");
  if (deleteButton) {
    const memberId = Number(deleteButton.dataset.memberId);
    const memberName = deleteButton.dataset.memberName || "這位人員";
    if (!memberId) {
      return;
    }

    handleDeleteMember(deleteButton, memberId, memberName);
    return;
  }

  const editButton = event.target.closest(".people-edit-btn");
  if (!editButton) {
    return;
  }

  const memberId = Number(editButton.dataset.memberId);
  if (!memberId) {
    return;
  }

  openMemberEditor("edit", memberId);
}

async function handleRestoreMember(button, memberId, memberName) {
  const member = state.adminData.members.find((item) => item.id === memberId);
  if (!member) {
    showToast("找不到這筆人員資料。");
    return;
  }

  setButtonLoading(button, true);
  try {
    await apiRequest("update-member", {
      method: "POST",
      authMode: "app",
      body: {
        member_id: memberId,
        full_name: member.full_name,
        role: member.role,
        gender: member.gender || null,
        note: member.note || "",
        district_id: member.district_id || null,
        big_family_id: member.big_family_id || null,
        small_group_id: member.small_group_id || null,
        is_admin: Boolean(member.is_admin),
        is_active: true,
      },
    });

    await Promise.all([loadAdminPanel(), loadDashboard({ skipDirtyCheck: true })]);
    showToast(`已恢復啟用 ${memberName}。`);
  } catch (error) {
    console.error(error);
    showToast(error.message || "恢復啟用失敗。");
  } finally {
    setButtonLoading(button, false);
  }
}

async function handleDeleteMember(button, memberId, memberName) {
  const member = state.adminData.members.find((item) => item.id === memberId);
  const canSkipConfirm = member && MEMBER_ROLES.includes(member.role);

  if (!canSkipConfirm) {
    if (
      !window.confirm(
        `確定要停用並封存「${memberName}」嗎？歷史點名紀錄會保留，但此人將無法登入並不再出現在點名名單。`,
      )
    ) {
      return;
    }
    const confirmName = window.prompt(`請輸入「${memberName}」確認停用封存。`);
    if (confirmName !== memberName) {
      showToast("已取消停用封存。");
      return;
    }
  }

  setButtonLoading(button, true);
  try {
    const data = await apiRequest("delete-member", {
      method: "POST",
      authMode: "app",
      body: {
        member_id: memberId,
      },
    });

    if (state.ui.editingMemberId === memberId) {
      closeMemberEditor();
    }

    await Promise.all([loadAdminPanel(), loadDashboard({ skipDirtyCheck: true })]);
    showToast(data?.message || "人員已停用封存。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "停用封存人員失敗。");
  } finally {
    setButtonLoading(button, false);
  }
}

function renderMemberEditor() {
  if (!state.ui.editorMode) {
    setHidden(els.memberEditorCard, true);
    return;
  }

  if (
    state.ui.editorMode === "edit" &&
    !state.adminData.members.some((member) => member.id === state.ui.editingMemberId)
  ) {
    closeMemberEditor();
  }
}

function openMemberEditor(mode, memberId = null) {
  closeBulkMemberEditor();
  state.ui.editorMode = mode;
  state.ui.editingMemberId = memberId;

  const editableMember = memberId
    ? state.adminData.members.find((member) => member.id === memberId)
    : null;

  if (mode === "edit" && !editableMember) {
    showToast("找不到這筆人員資料。");
    return;
  }

  populateRoleOptions(mode, editableMember);
  populateDistrictOptions(editableMember);
  fillMemberForm(mode, editableMember);
  syncEditorBigFamilyOptions(editableMember);
  syncEditorSmallGroupOptions(editableMember);
  syncMemberFormScope();
  setHidden(els.memberNoteLabel, true);
  setHidden(els.memberEditorCard, false);
  requestAnimationFrame(() => {
    els.memberEditorCard.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    els.memberNameInput.focus({ preventScroll: true });
  });
}

function closeMemberEditor() {
  state.ui.editorMode = null;
  state.ui.editingMemberId = null;
  els.memberForm.reset();
  setHidden(els.memberNoteLabel, true);
  setHidden(els.memberEditorCard, true);
}

function openBulkMemberEditor() {
  closeMemberEditor();
  state.bulkMembers = [];
  populateBulkRoleOptions();
  populateBulkDistrictOptions();
  els.bulkGenderSelect.value = "";
  els.bulkNamesInput.value = "";
  els.bulkActiveSelect.value = "true";
  syncBulkDefaultScope();
  renderBulkPreview();
  setHidden(els.bulkMemberEditorCard, false);
  requestAnimationFrame(() => {
    els.bulkMemberEditorCard.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    els.bulkNamesInput.focus({ preventScroll: true });
  });
}

function closeBulkMemberEditor() {
  state.bulkMembers = [];
  els.bulkMemberForm?.reset();
  setHidden(els.bulkMemberEditorCard, true);
  renderBulkPreview();
}

function populateBulkRoleOptions() {
  if (!els.bulkRoleSelect) {
    return;
  }

  const roles = state.currentMember?.is_admin ? ADMIN_CREATE_ROLES : MANAGEMENT_CREATE_ROLES;
  fillSelect(
    els.bulkRoleSelect,
    roles.map((role) => ({ value: role, label: getRoleLabel(role) })),
    { placeholder: "請選擇預設職分" },
  );
  if (roles.includes("member")) {
    els.bulkRoleSelect.value = "member";
  }
}

function populateBulkDistrictOptions() {
  if (!els.bulkDistrictSelect) {
    return;
  }

  const districtOptions = getSelectableDistricts().map((district) => ({
    value: String(district.id),
    label: getOrganizationDisplayName(district.name, district.is_active),
  }));
  fillSelect(els.bulkDistrictSelect, districtOptions, {
    placeholder: districtOptions.length ? "可留空（無區）" : "尚無可選區",
  });

  if (state.currentMember?.is_admin) {
    els.bulkDistrictSelect.disabled = false;
  } else {
    els.bulkDistrictSelect.value = String(state.currentMember?.district_id || "");
    els.bulkDistrictSelect.disabled = true;
  }
}

function syncBulkDefaultScope() {
  if (!els.bulkRoleSelect || !els.bulkDistrictSelect) {
    return;
  }

  const role = els.bulkRoleSelect.value;
  const districtId = Number(els.bulkDistrictSelect.value || 0);
  const availableBigFamilies = getSelectableBigFamilies(districtId);
  fillSelect(
    els.bulkBigFamilySelect,
    availableBigFamilies.map((bigFamily) => ({
      value: String(bigFamily.id),
      label: getOrganizationDisplayName(bigFamily.name, bigFamily.is_active),
    })),
    { placeholder: availableBigFamilies.length ? "可留空（無大家）" : "可留空（無大家）" },
  );

  const bigFamilyId = Number(els.bulkBigFamilySelect.value || 0);
  const availableSmallGroups = getSelectableSmallGroups({
    role,
    districtId,
    bigFamilyId,
  });
  fillSelect(
    els.bulkSmallGroupSelect,
    availableSmallGroups.map((smallGroup) => ({
      value: String(smallGroup.id),
      label: [
        getOrganizationDisplayName(smallGroup.name, smallGroup.is_active),
        smallGroup.big_family_name,
        smallGroup.district_name,
      ].filter(Boolean).join(" / "),
    })),
    { placeholder: availableSmallGroups.length ? "請選擇小家" : "尚無可選小家" },
  );

  const isDistrictLeaderCreate = role === "district_leader";
  const isBigFamilyLeaderCreate = role === "big_family_leader";
  const isSmallGroupRole = SMALL_GROUP_LEADER_ROLES.includes(role);
  setHidden(els.bulkDistrictLabel, false);
  setHidden(els.bulkBigFamilyLabel, isDistrictLeaderCreate);
  setHidden(els.bulkSmallGroupLabel, isDistrictLeaderCreate || isBigFamilyLeaderCreate || isSmallGroupRole);
}

function parseBulkNames(value) {
  return String(value || "")
    .split(/[\n\r,，、;；\t]+|\s{2,}/)
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, 100);
}

function handleGenerateBulkPreview() {
  const names = parseBulkNames(els.bulkNamesInput.value);
  if (!names.length) {
    showToast("請先輸入至少一個姓名。");
    return;
  }

  state.bulkMembers = names.map((name, index) => createBulkMemberDraft(name, index));
  validateBulkMembers();
  renderBulkPreview();
}

function createBulkMemberDraft(name, index) {
  const smallGroupId = Number(els.bulkSmallGroupSelect.value || 0);
  const smallGroup = state.adminData.smallGroups.find((item) => item.id === smallGroupId);
  const bigFamilyId = smallGroup?.big_family_id || Number(els.bulkBigFamilySelect.value || 0) || null;
  const districtId = smallGroup?.district_id || Number(els.bulkDistrictSelect.value || 0) || null;

  return {
    client_id: `bulk-${Date.now()}-${index}`,
    full_name: name,
    role: els.bulkRoleSelect.value || "member",
    gender: els.bulkGenderSelect.value || "",
    district_id: districtId,
    big_family_id: bigFamilyId,
    small_group_id: smallGroupId || null,
    is_active: els.bulkActiveSelect.value !== "false",
    error: "",
  };
}

function handleBulkPreviewInput(event) {
  const field = event.target?.dataset?.bulkField;
  const index = Number(event.target?.dataset?.bulkIndex);
  if (!field || !Number.isInteger(index) || !state.bulkMembers[index]) {
    return;
  }

  const member = state.bulkMembers[index];
  if (field === "full_name") {
    member.full_name = event.target.value.trimStart();
  } else if (field === "role") {
    member.role = event.target.value;
    member.big_family_id = null;
    member.small_group_id = null;
  } else if (field === "gender") {
    member.gender = event.target.value;
  } else if (field === "district_id") {
    member.district_id = Number(event.target.value || 0) || null;
    member.big_family_id = null;
    member.small_group_id = null;
  } else if (field === "big_family_id") {
    member.big_family_id = Number(event.target.value || 0) || null;
    member.small_group_id = null;
  } else if (field === "small_group_id") {
    const smallGroupId = Number(event.target.value || 0) || null;
    const smallGroup = state.adminData.smallGroups.find((item) => item.id === smallGroupId);
    member.small_group_id = smallGroupId;
    if (smallGroup) {
      member.district_id = smallGroup.district_id || member.district_id;
      member.big_family_id = smallGroup.big_family_id || null;
    }
  }

  validateBulkMembers();
  renderBulkPreview();
}

function handleBulkPreviewClick(event) {
  const removeButton = event.target.closest("[data-bulk-remove]");
  if (!removeButton) {
    return;
  }

  const index = Number(removeButton.dataset.bulkRemove);
  if (!Number.isInteger(index)) {
    return;
  }

  state.bulkMembers.splice(index, 1);
  validateBulkMembers();
  renderBulkPreview();
}

function validateBulkMembers() {
  state.bulkMembers.forEach((member) => {
    member.full_name = String(member.full_name || "").trim();
    member.error = getBulkMemberError(member);
  });
}

function getBulkMemberError(member) {
  if (!member.full_name) {
    return "姓名不可空白。";
  }
  if (!member.role) {
    return "請選擇職分。";
  }
  if (!state.currentMember?.is_admin && member.role === "preacher") {
    return "非管理員不可新增傳道人。";
  }
  if (!state.currentMember?.is_admin && member.district_id !== state.currentMember?.district_id) {
    return "只能新增到自己的轄區。";
  }
  if (member.role === "big_family_leader" && !member.district_id) {
    return "新增大家長需要選擇所屬區。";
  }
  if (SMALL_GROUP_LEADER_ROLES.includes(member.role) && !member.district_id) {
    return "新增小家長需要選擇所屬區。";
  }
  if (MEMBER_ROLES.includes(member.role) && !member.small_group_id) {
    return "新增小家人或新朋友需要選擇小家。";
  }
  return "";
}

function renderBulkPreview() {
  if (!els.bulkPreviewList || !els.bulkSummary || !els.bulkSubmitBtn) {
    return;
  }

  const members = state.bulkMembers;
  const errorCount = members.filter((member) => member.error).length;
  els.bulkSubmitBtn.disabled = !members.length || errorCount > 0;
  els.bulkSummary.textContent = members.length
    ? `預覽 ${members.length} 位，${errorCount ? `${errorCount} 位需要修正` : "可送出新增"}`
    : "尚未產生批量新增預覽";

  if (!members.length) {
    els.bulkPreviewList.innerHTML = '<div class="empty-state-card">貼上姓名後按「產生預覽」。</div>';
    return;
  }

  els.bulkPreviewList.innerHTML = members.map(renderBulkMemberCard).join("");
}

function renderBulkMemberCard(member, index) {
  const roleOptions = getBulkRoleOptions(member.role);
  const districtOptions = getBulkDistrictOptions(member.district_id);
  const bigFamilyOptions = getBulkBigFamilyOptions(member);
  const smallGroupOptions = getBulkSmallGroupOptions(member);
  return `
    <article class="bulk-member-card${member.error ? " has-error" : ""}">
      <div class="bulk-member-head">
        <span class="bulk-member-index">#${index + 1}</span>
        <button type="button" class="secondary danger-button" data-bulk-remove="${index}">移除</button>
      </div>
      <div class="bulk-member-grid">
        <label>
          <span>姓名</span>
          <input type="text" value="${escapeHtml(member.full_name)}" data-bulk-index="${index}" data-bulk-field="full_name" required />
        </label>
        <label>
          <span>職分</span>
          <select data-bulk-index="${index}" data-bulk-field="role" required>${roleOptions}</select>
        </label>
        <label>
          <span>性別</span>
          <select data-bulk-index="${index}" data-bulk-field="gender">${getGenderOptions(member.gender)}</select>
        </label>
      </div>
      <div class="bulk-member-scope-grid">
        <label>
          <span>所屬區</span>
          <select data-bulk-index="${index}" data-bulk-field="district_id">${districtOptions}</select>
        </label>
        <label>
          <span>所屬大家</span>
          <select data-bulk-index="${index}" data-bulk-field="big_family_id">${bigFamilyOptions}</select>
        </label>
        <label>
          <span>所屬小家</span>
          <select data-bulk-index="${index}" data-bulk-field="small_group_id">${smallGroupOptions}</select>
        </label>
      </div>
      ${member.error ? `<p class="bulk-row-error">${escapeHtml(member.error)}</p>` : ""}
    </article>
  `;
}

function getBulkRoleOptions(selectedValue) {
  const roles = state.currentMember?.is_admin ? ADMIN_CREATE_ROLES : MANAGEMENT_CREATE_ROLES;
  return renderSelectOptions(
    roles.map((role) => ({ value: role, label: getRoleLabel(role) })),
    selectedValue,
    "請選擇職分",
  );
}

function getGenderOptions(selectedValue) {
  return renderSelectOptions(
    [
      { value: "brother", label: "弟兄" },
      { value: "sister", label: "姊妹" },
    ],
    selectedValue,
    "未設定",
  );
}

function getBulkDistrictOptions(selectedValue) {
  const districts = state.currentMember?.is_admin
    ? getSelectableDistricts()
    : getSelectableDistricts(state.currentMember?.district_id || 0).filter(
        (district) => district.id === state.currentMember?.district_id,
      );
  return renderSelectOptions(
    districts.map((district) => ({
      value: String(district.id),
      label: getOrganizationDisplayName(district.name, district.is_active),
    })),
    selectedValue ? String(selectedValue) : "",
    "可留空（無區）",
  );
}

function getBulkBigFamilyOptions(member) {
  const options = getSelectableBigFamilies(Number(member.district_id || 0), Number(member.big_family_id || 0))
    .map((bigFamily) => ({
      value: String(bigFamily.id),
      label: getOrganizationDisplayName(bigFamily.name, bigFamily.is_active),
    }));
  return renderSelectOptions(options, member.big_family_id ? String(member.big_family_id) : "", "可留空（無大家）");
}

function getBulkSmallGroupOptions(member) {
  const options = getSelectableSmallGroups({
    role: member.role,
    districtId: Number(member.district_id || 0),
    bigFamilyId: Number(member.big_family_id || 0),
    includeSmallGroupId: Number(member.small_group_id || 0),
  }).map((smallGroup) => ({
    value: String(smallGroup.id),
    label: [
      getOrganizationDisplayName(smallGroup.name, smallGroup.is_active),
      smallGroup.big_family_name,
      smallGroup.district_name,
    ].filter(Boolean).join(" / "),
  }));
  return renderSelectOptions(options, member.small_group_id ? String(member.small_group_id) : "", "請選擇小家");
}

function renderSelectOptions(items, selectedValue, placeholder) {
  const selected = String(selectedValue || "");
  const options = [`<option value=""${selected ? "" : " selected"}>${escapeHtml(placeholder)}</option>`];
  for (const item of items) {
    const value = String(item.value);
    options.push(
      `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(item.label)}</option>`,
    );
  }
  return options.join("");
}

async function handleSaveBulkMembers(event) {
  event.preventDefault();
  validateBulkMembers();
  renderBulkPreview();

  const members = state.bulkMembers;
  if (!members.length) {
    showToast("請先產生批量新增預覽。");
    return;
  }
  if (members.some((member) => member.error)) {
    showToast("請先修正預覽清單中的錯誤。");
    return;
  }

  setButtonLoading(els.bulkSubmitBtn, true, "新增中...");
  try {
    const payload = members.map(serializeBulkMember);
    let data;
    try {
      data = await apiRequest("create-members-batch", {
        method: "POST",
        authMode: "app",
        body: {
          members: payload,
        },
      });
    } catch (error) {
      if (!isMissingBatchCreateAction(error)) {
        throw error;
      }
      data = await createBulkMembersIndividually(payload);
    }

    const results = data?.results || [];
    const failed = results.filter((result) => !result.ok);
    if (failed.length) {
      state.bulkMembers = failed.map((result) => ({
        ...members[result.index],
        error: result.error || "新增失敗，請確認資料。",
      }));
      renderBulkPreview();
      showToast(`已新增 ${results.length - failed.length} 位，${failed.length} 位失敗，請確認後再送出。`);
      return;
    }

    closeBulkMemberEditor();
    showToast(`已批量新增 ${results.length} 位人員。`);
    await loadAdminPanel();
    await loadDashboard({ skipDirtyCheck: true });
  } catch (error) {
    console.error(error);
    showToast(error.message || "批量新增失敗。");
  } finally {
    setButtonLoading(els.bulkSubmitBtn, false);
    renderBulkPreview();
  }
}

function serializeBulkMember(member) {
  return {
    full_name: member.full_name,
    role: member.role,
    gender: member.gender || null,
    district_id: member.district_id || null,
    big_family_id: member.big_family_id || null,
    small_group_id: member.small_group_id || null,
    is_active: member.is_active,
  };
}

function isMissingBatchCreateAction(error) {
  const message = String(error?.message || "");
  return message.includes("Unknown action") || message.includes("404");
}

async function createBulkMembersIndividually(payload) {
  const results = [];
  for (const [index, member] of payload.entries()) {
    try {
      const data = await apiRequest("create-member", {
        method: "POST",
        authMode: "app",
        body: member,
      });
      results.push({
        index,
        ok: true,
        member: data?.member || null,
        error: null,
      });
    } catch (error) {
      results.push({
        index,
        ok: false,
        member: null,
        error: error.message || "新增失敗。",
      });
    }
  }

  return {
    created_count: results.filter((result) => result.ok).length,
    failed_count: results.filter((result) => !result.ok).length,
    results,
  };
}

function formatPeopleScopeSummary(member) {
  const parts = [];
  if (member.small_group_name) {
    parts.push(member.small_group_name);
  }
  if (member.big_family_name) {
    parts.push(member.big_family_name);
  }
  if (!parts.length && member.district_name) {
    parts.push(member.district_name);
  }
  return parts.join(" / ");
}

function populateRoleOptions(mode, member) {
  let roles;
  if (mode === "create") {
    roles = state.currentMember?.is_admin ? ADMIN_CREATE_ROLES : MANAGEMENT_CREATE_ROLES;
  } else {
    if (state.currentMember?.is_admin) {
      roles = ADMIN_CREATE_ROLES;
    } else {
      roles = [member.role];
    }
  }

  fillSelect(
    els.memberRoleSelect,
    roles.map((role) => ({ value: role, label: getRoleLabel(role) })),
    { placeholder: "請選擇身分" },
  );

  els.memberRoleSelect.disabled = mode === "edit" && !state.currentMember?.is_admin;
}

function getOrganizationDisplayName(name, isActive) {
  return isActive ? name : `${name}（已封存）`;
}

function getOrganizationBaseName(name, orgType) {
  const suffix = ORG_SUFFIXES[orgType];
  const value = String(name || "").trim();
  return suffix && value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
}

function buildOrganizationName(value, orgType) {
  const suffix = ORG_SUFFIXES[orgType];
  const baseName = getOrganizationBaseName(value, orgType);
  return suffix && baseName ? `${baseName}${suffix}` : baseName;
}

function getSelectableDistricts(includeDistrictId = 0) {
  return state.adminData.districts.filter(
    (district) => district.is_active || district.id === includeDistrictId,
  );
}

function getSelectableBigFamilies(districtId, includeBigFamilyId = 0) {
  return state.adminData.bigFamilies.filter((bigFamily) => {
    const matchesDistrict = districtId ? bigFamily.district_id === districtId : true;
    return matchesDistrict && (bigFamily.is_active || bigFamily.id === includeBigFamilyId);
  });
}

function getSelectableSmallGroups({
  role,
  districtId,
  bigFamilyId,
  includeSmallGroupId = 0,
}) {
  return state.adminData.smallGroups.filter((smallGroup) => {
    if (!districtId && !bigFamilyId && !MEMBER_ROLES.includes(role) && role !== "preacher") {
      return smallGroup.id === includeSmallGroupId;
    }

    const matchesScope =
      MEMBER_ROLES.includes(role) || role === "preacher"
        ? bigFamilyId
          ? smallGroup.big_family_id === bigFamilyId
          : districtId
            ? smallGroup.district_id === districtId
            : true
        : bigFamilyId
          ? smallGroup.big_family_id === bigFamilyId
          : districtId
            ? smallGroup.district_id === districtId
            : true;
    return matchesScope && (smallGroup.is_active || smallGroup.id === includeSmallGroupId);
  });
}

function populateDistrictOptions(member) {
  const includeDistrictId =
    state.ui.editorMode === "edit" ? Number(member?.district_id || 0) : 0;
  const districtOptions = getSelectableDistricts(includeDistrictId).map((district) => ({
    value: String(district.id),
    label: getOrganizationDisplayName(district.name, district.is_active),
  }));
  fillSelect(els.memberDistrictSelect, districtOptions, {
    placeholder: districtOptions.length ? "可留空（無區）" : "可留空（無區）",
  });

  if (state.currentMember?.is_admin) {
    els.memberDistrictSelect.disabled = false;
    if (member?.district_id) {
      els.memberDistrictSelect.value = String(member.district_id);
    }
  } else {
    const districtId = String(state.currentMember?.district_id || "");
    els.memberDistrictSelect.value = districtId;
    els.memberDistrictSelect.disabled = true;
  }
}

function syncEditorBigFamilyOptions(member = null) {
  const districtId = Number(els.memberDistrictSelect.value || 0);
  const includeBigFamilyId =
    Number(member?.big_family_id || els.memberBigFamilySelect.value || 0);
  const available = getSelectableBigFamilies(districtId, includeBigFamilyId);

  fillSelect(
    els.memberBigFamilySelect,
    available.map((bigFamily) => ({
      value: String(bigFamily.id),
      label: getOrganizationDisplayName(bigFamily.name, bigFamily.is_active),
    })),
    {
      placeholder: available.length ? "可留空（無大家）" : "可留空（無大家）",
    },
  );

  if (member?.big_family_id) {
    els.memberBigFamilySelect.value = String(member.big_family_id);
  }
}

function syncEditorSmallGroupOptions(member = null) {
  const role = els.memberRoleSelect.value;
  const districtId = Number(els.memberDistrictSelect.value || 0);
  const bigFamilyId = Number(els.memberBigFamilySelect.value || 0);
  const includeSmallGroupId =
    Number(member?.small_group_id || els.memberSmallGroupSelect.value || 0);
  const available = getSelectableSmallGroups({
    role,
    districtId,
    bigFamilyId,
    includeSmallGroupId,
  });

  fillSelect(
    els.memberSmallGroupSelect,
    available.map((smallGroup) => ({
      value: String(smallGroup.id),
      label:
        MEMBER_ROLES.includes(role) || role === "preacher"
          ? [
              getOrganizationDisplayName(smallGroup.name, smallGroup.is_active),
              smallGroup.big_family_name,
              smallGroup.district_name,
            ]
              .filter(Boolean)
              .join(" / ")
          : getOrganizationDisplayName(smallGroup.name, smallGroup.is_active),
    })),
    {
      placeholder: available.length ? "請選擇小家" : "尚無可選小家",
    },
  );

  if (member?.small_group_id) {
    els.memberSmallGroupSelect.value = String(member.small_group_id);
  }
}

function fillMemberForm(mode, member) {
  if (mode === "create") {
    els.memberEditorTitle.textContent = "新增人員";
    els.memberEditorHint.textContent = state.currentMember?.is_admin
      ? "管理員可建立所有職分；新增區長、大家長、小家長或實習小家長時，系統會自動建立對應組織。"
      : "區長可建立自己轄區內的大/小家長、小家人與新朋友；新增管理職時會自動建立同名組織。";
    els.memberNameInput.value = "";
    els.memberGenderSelect.value = "";
    els.memberNoteInput.value = "";
    els.memberActiveSelect.value = "true";
    els.memberIsAdminInput.checked = false;
    els.memberIsAdminWrap.open = false;
    if (Array.from(els.memberRoleSelect.options).some((option) => option.value === "member")) {
      els.memberRoleSelect.value = "member";
    } else if (els.memberRoleSelect.options.length > 1) {
      els.memberRoleSelect.value = els.memberRoleSelect.options[1].value;
    }
  } else {
    els.memberEditorTitle.textContent = `編輯：${member.full_name}`;
    els.memberEditorHint.textContent = state.currentMember?.is_admin
      ? "管理員可調整所有資料與職分。"
      : "區長可編輯轄區內小家人與新朋友的基本資料與所屬。";
    els.memberNameInput.value = member.full_name || "";
    els.memberRoleSelect.value = member.role;
    els.memberGenderSelect.value = member.gender || "";
    els.memberNoteInput.value = member.note || "";
    els.memberActiveSelect.value = member.is_active ? "true" : "false";
    els.memberIsAdminInput.checked = Boolean(member.is_admin);
    els.memberIsAdminWrap.open = false;
  }
}

function syncMemberFormScope() {
  const role = els.memberRoleSelect.value;
  const isCreateMode = state.ui.editorMode === "create";
  const isEditMode = state.ui.editorMode === "edit";
  const needsBigFamily =
    MEMBER_ROLES.includes(role)
      ? isEditMode
      : role === "big_family_leader"
        ? !isCreateMode
        : SMALL_GROUP_LEADER_ROLES.includes(role)
          ? true
          : false;
  const showSmallGroupField =
    role === "preacher" ||
    MEMBER_ROLES.includes(role) ||
    (SMALL_GROUP_LEADER_ROLES.includes(role) && !isCreateMode);
  const showDistrictField =
    role === "preacher" ||
    (!(role === "district_leader" && isCreateMode) &&
      (!MEMBER_ROLES.includes(role) || isEditMode));
  const districtRequired =
    role === "preacher"
      ? false
      : isCreateMode && (role === "big_family_leader" || SMALL_GROUP_LEADER_ROLES.includes(role));

  setHidden(els.memberDistrictLabel, !showDistrictField);
  setHidden(els.memberBigFamilyLabel, !needsBigFamily);
  setHidden(els.memberSmallGroupLabel, !showSmallGroupField);
  const canEditAdminPermission = Boolean(state.currentMember?.is_admin && isEditMode);
  setHidden(els.memberIsAdminWrap, !canEditAdminPermission);

  els.memberDistrictSelect.required = districtRequired;
  els.memberBigFamilySelect.required = false;
  els.memberSmallGroupSelect.required =
    isCreateMode && MEMBER_ROLES.includes(role);
  els.memberIsAdminInput.disabled = !canEditAdminPermission;

  if (!canEditAdminPermission) {
    els.memberIsAdminInput.checked = false;
    els.memberIsAdminWrap.open = false;
  }

  const hints = {
    preacher: isCreateMode
      ? "傳道人可選擇直屬小家作為預設點名範圍；需要時可勾選全部管理檢視全體。"
      : "傳道人可設定直屬小家作為預設點名範圍；需要時可勾選全部管理檢視全體。",
    district_leader: isCreateMode
      ? "新增區長時，系統會自動建立「姓名區」。"
      : "編輯區長時，可調整基本資料；所屬區也可留空。",
    big_family_leader: isCreateMode
      ? "新增大家長時，只需選區；系統會自動建立「姓名大家」。"
      : "編輯大家長時，可調整基本資料；所屬區/大家可留空。",
    small_group_leader: isCreateMode
      ? "新增小家長時，只需選區，大家可留空；系統會自動建立「姓名小家」。"
      : "編輯小家長時，可調整基本資料；區、大家與小家都可暫時留空。",
    trainee_small_group_leader: isCreateMode
      ? "新增實習小家長時，只需選區，大家可留空；系統會自動建立「姓名小家」。"
      : "實習小家長與小家長同權限；可調整基本資料與小家歸屬。",
    member: isCreateMode
      ? "新增小家人時，只要選小家，系統會自動帶出上層歸屬。"
      : "編輯小家人時，可改派小家；若要暫時不歸屬任何小家，也可留空。",
    best: isCreateMode
      ? "新增新朋友時，只要選小家，系統會自動帶出上層歸屬。"
      : "編輯新朋友時，可改派小家；若要暫時不歸屬任何小家，也可留空。",
  };
  els.memberScopeHint.textContent = hints[role] || "請選擇正確的職分與層級。";
}

async function handleSaveMember(event) {
  event.preventDefault();
  const mode = state.ui.editorMode;
  if (!mode) {
    return;
  }

  const body = {
    full_name: els.memberNameInput.value.trim(),
    role: els.memberRoleSelect.value,
    gender: els.memberGenderSelect.value || null,
    note: els.memberNoteInput.value.trim(),
    district_id: Number(els.memberDistrictSelect.value || 0) || null,
    big_family_id: Number(els.memberBigFamilySelect.value || 0) || null,
    small_group_id: Number(els.memberSmallGroupSelect.value || 0) || null,
    is_admin: els.memberIsAdminInput.checked,
    is_active: els.memberActiveSelect.value === "true",
  };

  if (!body.full_name || !body.role) {
    showToast("請完整填寫姓名與身分。");
    return;
  }

  if (
    (body.role === "big_family_leader" || SMALL_GROUP_LEADER_ROLES.includes(body.role)) &&
    !body.district_id &&
    state.ui.editorMode === "create"
  ) {
    showToast("此身分至少需要指定所屬區。");
    return;
  }

  if (MEMBER_ROLES.includes(body.role) && !body.small_group_id && mode === "create") {
    showToast("新增小家人或新朋友時，請先選擇所屬小家。");
    return;
  }

  if (mode === "create") {
    body.is_admin = false;
  } else {
    const originalMember = state.adminData.members.find(
      (member) => member.id === state.ui.editingMemberId,
    );
    if (
      originalMember &&
      !originalMember.is_admin &&
      body.is_admin &&
      !window.confirm(`確定要賦予「${body.full_name}」管理員權限嗎？此人將可管理全部資料。`)
    ) {
      return;
    }
  }

  const action =
    mode === "create"
      ? "create-member"
      : `update-member`;

  const requestBody =
    mode === "create"
      ? body
      : {
          member_id: state.ui.editingMemberId,
          ...body,
        };

  setButtonLoading(els.memberSubmitBtn, true);
  try {
    await apiRequest(action, {
      method: "POST",
      authMode: "app",
      body: requestBody,
    });

    closeMemberEditor();
    await Promise.all([loadAdminPanel(), loadDashboard({ skipDirtyCheck: true })]);
    showToast(mode === "create" ? "已建立新的人員資料。" : "人員資料已更新。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "儲存人員資料失敗。");
  } finally {
    setButtonLoading(els.memberSubmitBtn, false);
  }
}

function getManagedActiveDistricts() {
  return state.adminData.districts.filter((district) => district.is_active);
}

function getOrganizationSectionId(orgType) {
  return {
    district: "districtSection",
    big_family: "bigFamilySection",
    small_group: "smallGroupSection",
  }[orgType];
}

function queueOrganizationFocus(target) {
  state.ui.orgFocusTarget = target;
}

function restoreOrganizationFocus() {
  const target = state.ui.orgFocusTarget;
  if (!target || state.ui.activeTab !== TABS.people) {
    return;
  }

  state.ui.orgFocusTarget = null;
  requestAnimationFrame(() => {
    const card = target.id
      ? document.querySelector(`[data-org-card-key="${target.type}:${target.id}"]`)
      : null;
    const fallback = target.sectionId ? document.querySelector(`#${target.sectionId}`) : null;
    const element = card || fallback;
    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: target.behavior || "smooth",
      block: card ? "center" : "start",
    });
  });
}

function renderOrganizationTools() {
  const activeDistricts = getManagedActiveDistricts();
  setHidden(els.districtDetails, !state.currentMember?.is_admin);

  fillSelect(
    els.bigFamilyDistrictSelect,
    activeDistricts.map((district) => ({
      value: String(district.id),
      label: district.name,
    })),
    {
      placeholder: activeDistricts.length ? "請選擇區" : "目前沒有可用的啟用區",
    },
  );

  fillSelect(
    els.smallGroupDistrictSelect,
    activeDistricts.map((district) => ({
      value: String(district.id),
      label: district.name,
    })),
    {
      placeholder: activeDistricts.length ? "請選擇區" : "目前沒有可用的啟用區",
    },
  );

  if (!state.currentMember?.is_admin) {
    const currentDistrict = activeDistricts.find(
      (district) => district.id === state.currentMember?.district_id,
    );
    els.bigFamilyDistrictSelect.value = currentDistrict ? String(currentDistrict.id) : "";
    els.smallGroupDistrictSelect.value = currentDistrict ? String(currentDistrict.id) : "";
    els.bigFamilyDistrictSelect.disabled = true;
    els.smallGroupDistrictSelect.disabled = true;
  } else {
    if (!els.bigFamilyDistrictSelect.value && activeDistricts[0]) {
      els.bigFamilyDistrictSelect.value = String(activeDistricts[0].id);
    }
    if (!els.smallGroupDistrictSelect.value && activeDistricts[0]) {
      els.smallGroupDistrictSelect.value = String(activeDistricts[0].id);
    }
    els.bigFamilyDistrictSelect.disabled = false;
    els.smallGroupDistrictSelect.disabled = false;
  }

  syncOrgSelects();
  els.bigFamilySubmitBtn.disabled = !Number(els.bigFamilyDistrictSelect.value || 0);
}

function syncOrgSelects() {
  els.bigFamilySubmitBtn.disabled = !Number(els.bigFamilyDistrictSelect.value || 0);
  const districtId = Number(els.smallGroupDistrictSelect.value || 0);
  const available = state.adminData.bigFamilies.filter((bigFamily) => {
    return bigFamily.is_active && (districtId ? bigFamily.district_id === districtId : true);
  });

  fillSelect(
    els.smallGroupBigFamilySelect,
    available.map((bigFamily) => ({
      value: String(bigFamily.id),
      label: bigFamily.name,
    })),
    {
      placeholder: "可留空（無大家）",
    },
  );

  els.smallGroupBigFamilySelect.disabled = !districtId;
  els.smallGroupSubmitBtn.disabled = !districtId;
}

function syncOrgEditorBigFamilyOptions() {
  const districtId = Number(els.orgDistrictSelect.value || 0);
  const available = state.adminData.bigFamilies.filter((bigFamily) => {
    return bigFamily.is_active && (districtId ? bigFamily.district_id === districtId : true);
  });

  fillSelect(
    els.orgBigFamilySelect,
    available.map((bigFamily) => ({
      value: String(bigFamily.id),
      label: bigFamily.name,
    })),
    {
      placeholder: "可留空（無大家）",
    },
  );
}

async function handleCreateDistrict(event) {
  event.preventDefault();
  const name = buildOrganizationName(els.districtNameInput.value, "district");
  if (!name) {
    showToast("請輸入區名稱。");
    return;
  }

  setButtonLoading(els.districtSubmitBtn, true);
  try {
    await apiRequest("create-district", {
      method: "POST",
      authMode: "app",
      body: {
        name,
        description: els.districtDescriptionInput.value.trim(),
      },
    });

    els.districtForm.reset();
    queueOrganizationFocus({
      type: "district",
      id: null,
      sectionId: getOrganizationSectionId("district"),
    });
    await loadAdminPanel();
    showToast("已建立新的區。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "建立區失敗。");
  } finally {
    setButtonLoading(els.districtSubmitBtn, false);
  }
}

async function handleCreateBigFamily(event) {
  event.preventDefault();
  const districtId = Number(els.bigFamilyDistrictSelect.value || 0);
  const name = buildOrganizationName(els.bigFamilyNameInput.value, "big_family");
  if (!districtId || !name) {
    showToast("請完整選擇區並輸入大家名稱。");
    return;
  }

  setButtonLoading(els.bigFamilySubmitBtn, true);
  try {
    await apiRequest("create-big-family", {
      method: "POST",
      authMode: "app",
      body: {
        district_id: districtId,
        name,
        description: els.bigFamilyDescriptionInput.value.trim(),
      },
    });

    els.bigFamilyForm.reset();
    queueOrganizationFocus({
      type: "big_family",
      id: null,
      sectionId: getOrganizationSectionId("big_family"),
    });
    await loadAdminPanel();
    showToast("已建立新的大家。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "建立大家失敗。");
  } finally {
    setButtonLoading(els.bigFamilySubmitBtn, false);
  }
}

async function handleCreateSmallGroup(event) {
  event.preventDefault();
  const districtId = Number(els.smallGroupDistrictSelect.value || 0);
  const bigFamilyId = Number(els.smallGroupBigFamilySelect.value || 0);
  const name = buildOrganizationName(els.smallGroupNameInput.value, "small_group");
  if (!districtId || !name) {
    showToast("請完整選擇區並輸入小家名稱。");
    return;
  }

  setButtonLoading(els.smallGroupSubmitBtn, true);
  try {
    await apiRequest("create-small-group", {
      method: "POST",
      authMode: "app",
      body: {
        district_id: districtId,
        big_family_id: bigFamilyId || null,
        name,
        description: els.smallGroupDescriptionInput.value.trim(),
      },
    });

    els.smallGroupForm.reset();
    queueOrganizationFocus({
      type: "small_group",
      id: null,
      sectionId: getOrganizationSectionId("small_group"),
    });
    await loadAdminPanel();
    showToast("已建立新的小家。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "建立小家失敗。");
  } finally {
    setButtonLoading(els.smallGroupSubmitBtn, false);
  }
}

function renderOrganizationTables() {
  renderOrganizationDirectory();
  restoreOrganizationFocus();
}

function renderOrganizationDirectory() {
  renderOrganizationSummary(els.districtSummary, "組織", [
    ...state.adminData.districts,
    ...state.adminData.bigFamilies,
    ...state.adminData.smallGroups,
  ]);
  renderOrganizationSummary(els.bigFamilySummary, "大家", state.adminData.bigFamilies);
  renderOrganizationSummary(els.smallGroupSummary, "小家", state.adminData.smallGroups);
  setHidden(els.bigFamilySection, true);
  setHidden(els.smallGroupSection, true);

  if (!state.adminData.districts.length) {
    els.districtTableBody.innerHTML = '<div class="empty-state-card">尚未載入組織資料。</div>';
    return;
  }

  const activeFirstDistricts = [...state.adminData.districts].sort((left, right) => {
    if (left.is_active !== right.is_active) {
      return left.is_active ? -1 : 1;
    }
    return String(left.name || "").localeCompare(String(right.name || ""), "zh-Hant");
  });

  els.districtTableBody.innerHTML = activeFirstDistricts
    .map(renderOrganizationDistrictGroup)
    .join("");
}

function renderOrganizationDistrictGroup(district) {
  const bigFamilies = state.adminData.bigFamilies
    .filter((bigFamily) => bigFamily.district_id === district.id)
    .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "zh-Hant"));
  const directSmallGroups = state.adminData.smallGroups
    .filter((smallGroup) => smallGroup.district_id === district.id && !smallGroup.big_family_id)
    .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "zh-Hant"));
  const memberCount = state.adminData.members.filter((member) => member.district_id === district.id).length;
  const childCount = bigFamilies.length + directSmallGroups.length;

  return `
    <details class="org-scope-group org-level-district">
      <summary>
        <span class="org-scope-title">${escapeHtml(district.name)}</span>
        <span class="org-scope-counts">
          <span class="status-chip neutral">${bigFamilies.length} 大家</span>
          <span class="status-chip neutral">${directSmallGroups.length} 直屬小家</span>
          <span class="status-chip neutral">${memberCount} 人</span>
        </span>
      </summary>
      <div class="org-scope-body">
        ${renderOrganizationCard("district", district)}
        ${childCount
          ? `<div class="org-scope-children">
              ${bigFamilies.map(renderOrganizationBigFamilyGroup).join("")}
              ${directSmallGroups.map((smallGroup) => renderOrganizationSmallGroupItem(smallGroup)).join("")}
            </div>`
          : '<div class="empty-state-card">此區目前沒有大家或小家。</div>'}
      </div>
    </details>
  `;
}

function renderOrganizationBigFamilyGroup(bigFamily) {
  const smallGroups = state.adminData.smallGroups
    .filter((smallGroup) => smallGroup.big_family_id === bigFamily.id)
    .sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "zh-Hant"));
  const memberCount = state.adminData.members.filter((member) => member.big_family_id === bigFamily.id).length;

  return `
    <details class="org-scope-group org-level-big-family">
      <summary>
        <span class="org-scope-title">${escapeHtml(bigFamily.name)}</span>
        <span class="org-scope-counts">
          <span class="status-chip neutral">${smallGroups.length} 小家</span>
          <span class="status-chip neutral">${memberCount} 人</span>
        </span>
      </summary>
      <div class="org-scope-body">
        ${renderOrganizationCard("big_family", bigFamily)}
        ${smallGroups.length
          ? `<div class="org-card-list compact-org-list">
              ${smallGroups.map((smallGroup) => renderOrganizationSmallGroupItem(smallGroup)).join("")}
            </div>`
          : '<div class="empty-state-card">此大家目前沒有小家。</div>'}
      </div>
    </details>
  `;
}

function renderOrganizationSmallGroupItem(smallGroup) {
  return renderOrganizationCard("small_group", smallGroup);
}

function renderOrganizationSummary(element, label, items) {
  if (!element) {
    return;
  }

  if (!items.length) {
    element.textContent = `目前沒有${label}資料`;
    return;
  }

  const activeCount = items.filter((item) => item.is_active).length;
  const archivedCount = items.length - activeCount;
  const unitLabel = label === "區" ? "區" : `個${label}`;
  element.textContent = `共 ${items.length} ${unitLabel}，啟用 ${activeCount}、封存 ${archivedCount}`;
}

function getOrganizationDependencySummary(orgType, orgId) {
  const summary = {
    bigFamilies: 0,
    smallGroups: 0,
    members: 0,
    blockers: [],
  };

  if (orgType === "district") {
    summary.bigFamilies = state.adminData.bigFamilies.filter(
      (bigFamily) => bigFamily.district_id === orgId,
    ).length;
    summary.smallGroups = state.adminData.smallGroups.filter(
      (smallGroup) => smallGroup.district_id === orgId,
    ).length;
    summary.members = state.adminData.members.filter((member) => member.district_id === orgId).length;
  } else if (orgType === "big_family") {
    summary.smallGroups = state.adminData.smallGroups.filter(
      (smallGroup) => smallGroup.big_family_id === orgId,
    ).length;
    summary.members = state.adminData.members.filter((member) => member.big_family_id === orgId).length;
  } else {
    summary.members = state.adminData.members.filter((member) => member.small_group_id === orgId).length;
  }

  if (summary.bigFamilies) {
    summary.blockers.push(`${summary.bigFamilies} 個大家`);
  }
  if (summary.smallGroups) {
    summary.blockers.push(`${summary.smallGroups} 個小家`);
  }
  if (summary.members) {
    summary.blockers.push(`${summary.members} 位成員`);
  }

  return {
    ...summary,
    canDelete: summary.blockers.length === 0,
    blockerText: summary.blockers.join("、"),
  };
}

function buildOrganizationDependencyChips(summary) {
  const chips = [];
  if (summary.bigFamilies) {
    chips.push(`<span class="status-chip neutral">${summary.bigFamilies} 大家</span>`);
  }
  if (summary.smallGroups) {
    chips.push(`<span class="status-chip neutral">${summary.smallGroups} 小家</span>`);
  }
  if (summary.members) {
    chips.push(`<span class="status-chip neutral">${summary.members} 人</span>`);
  }

  if (!chips.length) {
    chips.push('<span class="status-chip success">空</span>');
  }

  return chips.join("");
}

function getOrganizationTypeLabel(orgType) {
  return {
    district: "區",
    big_family: "大家",
    small_group: "小家",
  }[orgType];
}

function getOrganizationParentLabel(orgType, organization) {
  if (orgType === "district") {
    return "牧區根層級";
  }

  if (orgType === "big_family") {
    return organization.district_name || "-";
  }

  return [organization.big_family_name, organization.district_name]
    .filter(Boolean)
    .join(" / ");
}

function canEditOrganization(orgType) {
  if (orgType === "district") {
    return Boolean(state.currentMember?.is_admin);
  }

  return canUseManagement();
}

function getOrganizationActionSlug(orgType) {
  return {
    district: "district",
    big_family: "big-family",
    small_group: "small-group",
  }[orgType];
}

function getOrganizationRequestIdKey(orgType) {
  return {
    district: "district_id",
    big_family: "big_family_id",
    small_group: "small_group_id",
  }[orgType];
}

function renderOrganizationCard(orgType, organization) {
  const summary = getOrganizationDependencySummary(orgType, organization.id);
  const actionButtons = [];

  if (canEditOrganization(orgType)) {
    actionButtons.push(`
      <button
        type="button"
        class="secondary org-action-btn"
        data-org-action="edit"
        data-org-type="${orgType}"
        data-org-id="${organization.id}"
        data-org-name="${escapeHtml(organization.name)}"
      >
        編輯
      </button>
    `);
  }

  if (state.currentMember?.is_admin) {
    actionButtons.push(`
      <button
        type="button"
        class="secondary org-action-btn"
        data-org-action="${organization.is_active ? "archive" : "restore"}"
        data-org-type="${orgType}"
        data-org-id="${organization.id}"
        data-org-name="${escapeHtml(organization.name)}"
      >
        ${organization.is_active ? "封存" : "恢復"}
      </button>
    `);
    actionButtons.push(`
      <button
        type="button"
        class="secondary danger-button org-action-btn ${summary.canDelete ? "" : "is-blocked"}"
        data-org-action="delete"
        data-org-type="${orgType}"
        data-org-id="${organization.id}"
        data-org-name="${escapeHtml(organization.name)}"
        data-blocked-reason="${escapeHtml(
          summary.canDelete
            ? ""
            : `尚不可刪除：${summary.blockerText}。請先整理後再刪除。`,
        )}"
      >
        刪除
      </button>
    `);
  }

  return `
    <article
      class="org-card ${organization.is_active ? "" : "is-archived"}"
      data-org-card-key="${orgType}:${organization.id}"
      id="org-card-${orgType}-${organization.id}"
    >
      <div class="org-card-head">
        <div class="row-meta">
          <div class="org-card-title">
            <strong>${escapeHtml(organization.name)}</strong>
            <span class="status-chip ${organization.is_active ? "success" : "archived"}">
              ${organization.is_active ? "啟用" : "已封存"}
            </span>
          </div>
          <div class="org-card-subline">
            ${escapeHtml(getOrganizationParentLabel(orgType, organization) || "未設定歸屬")}
          </div>
        </div>
        ${actionButtons.length ? `<div class="row-actions">${actionButtons.join("")}</div>` : ""}
      </div>

      <div class="org-card-chips">${buildOrganizationDependencyChips(summary)}</div>
      ${organization.description ? `<p class="org-card-description">${escapeHtml(organization.description)}</p>` : ""}

      <p class="org-card-hint ${summary.canDelete ? "" : "warning"}">
        ${escapeHtml(
          summary.canDelete
            ? "可刪除"
            : `尚不可刪除：${summary.blockerText}`,
        )}
      </p>
    </article>
  `;
}

function renderDistrictTable() {
  renderOrganizationSummary(els.districtSummary, "區", state.adminData.districts);
  if (!state.adminData.districts.length) {
    els.districtTableBody.innerHTML = '<div class="empty-state-card">尚未載入區資料。</div>';
    return;
  }

  els.districtTableBody.innerHTML = state.adminData.districts
    .map((district) => renderOrganizationCard("district", district))
    .join("");
}

function renderBigFamilyTable() {
  renderOrganizationSummary(els.bigFamilySummary, "大家", state.adminData.bigFamilies);
  if (!state.adminData.bigFamilies.length) {
    els.bigFamilyTableBody.innerHTML = '<div class="empty-state-card">尚未載入大家資料。</div>';
    return;
  }

  els.bigFamilyTableBody.innerHTML = state.adminData.bigFamilies
    .map((bigFamily) => renderOrganizationCard("big_family", bigFamily))
    .join("");
}

function renderSmallGroupTable() {
  renderOrganizationSummary(els.smallGroupSummary, "小家", state.adminData.smallGroups);
  if (!state.adminData.smallGroups.length) {
    els.smallGroupTableBody.innerHTML = '<div class="empty-state-card">尚未載入小家資料。</div>';
    return;
  }

  els.smallGroupTableBody.innerHTML = state.adminData.smallGroups
    .map((smallGroup) => renderOrganizationCard("small_group", smallGroup))
    .join("");
}

function buildOrganizationConfirmMessage(action, orgType, orgName) {
  const label = getOrganizationTypeLabel(orgType);
  if (action === "archive") {
    return orgType === "district"
      ? `封存「${orgName}」後，底下大家與小家也會同步封存，但不會刪除成員資料。確定要繼續嗎？`
      : orgType === "big_family"
        ? `封存「${orgName}」後，底下小家也會同步封存，但不會刪除成員資料。確定要繼續嗎？`
        : `封存「${orgName}」後，它將不再出現在新增或改派選單。確定要繼續嗎？`;
  }

  if (action === "restore") {
    return `恢復「${orgName}」後，這個${label}會重新出現在新增與改派選單。確定要繼續嗎？`;
  }

  return `只有空${label}才能刪除，且不會刪除任何成員資料。確定要刪除「${orgName}」嗎？`;
}

async function handleOrganizationAction(button, action, orgType, orgId, orgName) {
  const actionName = `${action}-${getOrganizationActionSlug(orgType)}`;
  const requestIdKey = getOrganizationRequestIdKey(orgType);
  const isDelete = action === "delete";

  if (!window.confirm(buildOrganizationConfirmMessage(action, orgType, orgName))) {
    return;
  }

  setButtonLoading(button, true);
  try {
    const data = await apiRequest(actionName, {
      method: "POST",
      authMode: "app",
      body: {
        [requestIdKey]: orgId,
      },
    });

    if (state.ui.orgEditorMode === orgType && state.ui.editingOrgId === orgId) {
      closeOrgEditor();
    }

    queueOrganizationFocus({
      type: orgType,
      id: isDelete ? null : orgId,
      sectionId: getOrganizationSectionId(orgType),
    });
    await loadAdminPanel();
    showToast(data?.message || "組織狀態已更新。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "更新組織狀態失敗。");
  } finally {
    setButtonLoading(button, false);
  }
}

function handleOrgTableClick(event) {
  const button = event.target.closest("[data-org-action]");
  if (!button) {
    return;
  }

  const orgType = button.dataset.orgType;
  const orgId = Number(button.dataset.orgId);
  const orgName = button.dataset.orgName || "";
  const action = button.dataset.orgAction;
  if (!orgType || !orgId || !action) {
    return;
  }

  if (action === "edit") {
    openOrgEditor(orgType, orgId);
    return;
  }

  if (action === "delete" && button.dataset.blockedReason) {
    showToast(button.dataset.blockedReason);
    return;
  }

  handleOrganizationAction(button, action, orgType, orgId, orgName);
}

function openOrgEditor(type, id) {
  state.ui.orgEditorMode = type;
  state.ui.editingOrgId = id;

  let entity = null;
  if (type === "district") {
    entity = state.adminData.districts.find((item) => item.id === id);
    els.orgEditorTitle.textContent = "編輯區名稱";
  } else if (type === "big_family") {
    entity = state.adminData.bigFamilies.find((item) => item.id === id);
    els.orgEditorTitle.textContent = "編輯大家名稱";
  } else if (type === "small_group") {
    entity = state.adminData.smallGroups.find((item) => item.id === id);
    els.orgEditorTitle.textContent = "編輯小家名稱";
  }

  if (!entity) {
    showToast("找不到這筆組織資料。");
    return;
  }

  const showParentControls = type === "small_group";
  setHidden(els.orgDistrictLabel, !showParentControls);
  setHidden(els.orgBigFamilyLabel, !showParentControls);

  if (showParentControls) {
    const activeDistricts = getManagedActiveDistricts();
    const includeDistrict = state.adminData.districts.find(
      (district) => district.id === entity.district_id,
    );
    const districtOptions = [
      ...activeDistricts,
      ...(includeDistrict && !activeDistricts.some((district) => district.id === includeDistrict.id)
        ? [includeDistrict]
        : []),
    ];

    fillSelect(
      els.orgDistrictSelect,
      districtOptions.map((district) => ({
        value: String(district.id),
        label: getOrganizationDisplayName(district.name, district.is_active),
      })),
      {
        placeholder: "請選擇區",
      },
    );
    els.orgDistrictSelect.value = entity.district_id ? String(entity.district_id) : "";
    els.orgDistrictSelect.disabled = !state.currentMember?.is_admin;
    syncOrgEditorBigFamilyOptions();
    els.orgBigFamilySelect.value = entity.big_family_id ? String(entity.big_family_id) : "";
  } else {
    els.orgDistrictSelect.value = "";
    els.orgBigFamilySelect.value = "";
  }

  const summary = getOrganizationDependencySummary(type, id);
  els.orgEditorHint.textContent = entity.is_active
    ? summary.canDelete
      ? "這個組織目前是啟用，且已符合空組織條件。"
      : `這個組織目前是啟用；若要刪除，還需先處理 ${summary.blockerText}。`
    : summary.canDelete
      ? "這個組織目前已封存，若確認不再需要可直接刪除。"
      : `這個組織目前已封存；若要刪除，還需先處理 ${summary.blockerText}。`;
  els.orgNameInput.value = getOrganizationBaseName(entity.name, type);
  els.orgDescriptionInput.value = entity.description || "";
  setHidden(els.orgEditorCard, false);
  requestAnimationFrame(() => {
    els.orgEditorCard.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    els.orgNameInput.focus({ preventScroll: true });
  });
}

function closeOrgEditor() {
  state.ui.orgEditorMode = null;
  state.ui.editingOrgId = null;
  els.orgEditorForm.reset();
  setHidden(els.orgDistrictLabel, true);
  setHidden(els.orgBigFamilyLabel, true);
  setHidden(els.orgEditorCard, true);
}

async function handleSaveOrganization(event) {
  event.preventDefault();
  if (!state.ui.orgEditorMode || !state.ui.editingOrgId) {
    return;
  }

  const name = buildOrganizationName(els.orgNameInput.value, state.ui.orgEditorMode);
  if (!name) {
    showToast("請輸入名稱。");
    return;
  }

  const actionMap = {
    district: "update-district",
    big_family: "update-big-family",
    small_group: "update-small-group",
  };
  const idKeyMap = {
    district: "district_id",
    big_family: "big_family_id",
    small_group: "small_group_id",
  };

  const action = actionMap[state.ui.orgEditorMode];
  const idKey = idKeyMap[state.ui.orgEditorMode];
  const requestBody = {
    [idKey]: state.ui.editingOrgId,
    name,
    description: els.orgDescriptionInput.value.trim(),
  };

  if (state.ui.orgEditorMode === "small_group") {
    requestBody.district_id = Number(els.orgDistrictSelect.value || 0) || null;
    requestBody.big_family_id = Number(els.orgBigFamilySelect.value || 0) || null;
  }

  setButtonLoading(els.orgSubmitBtn, true);
  try {
    await apiRequest(action, {
      method: "POST",
      authMode: "app",
      body: requestBody,
    });

    const focusType = state.ui.orgEditorMode;
    const focusId = state.ui.editingOrgId;
    closeOrgEditor();
    queueOrganizationFocus({
      type: focusType,
      id: focusId,
      sectionId: getOrganizationSectionId(focusType),
    });
    await loadAdminPanel();
    showToast("組織名稱已更新。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "更新組織名稱失敗。");
  } finally {
    setButtonLoading(els.orgSubmitBtn, false);
  }
}

function renderInvites() {
  if (!canUseInvites()) {
    setHidden(els.invitesView, true);
    return;
  }

  const candidates = getInviteCandidates();
  const activeInviteCount = state.adminData.invites.filter((invite) => {
    return !invite.used_at && new Date(invite.expires_at).getTime() >= Date.now();
  }).length;

  fillSelect(
    els.inviteMemberSelect,
    candidates.map((member) => ({
      value: String(member.id),
      label: `${member.full_name}（${getRoleLabel(member.role)}）`,
    })),
    {
      placeholder: candidates.length ? "請選擇領袖" : "目前沒有可產生邀請碼的人",
    },
  );

  if (els.inviteSummary) {
    els.inviteSummary.textContent = candidates.length
      ? `目前可產生邀請碼 ${candidates.length} 位，仍可使用 ${activeInviteCount} 組`
      : "目前沒有可產生邀請碼的對象";
  }

  renderInviteTable();
  renderLatestInvite();
}

function getInviteCandidates() {
  if (!canUseInvites()) {
    return [];
  }

  return state.adminData.members.filter((member) => {
    if (!member.is_active || member.line_user_id) {
      return false;
    }

    if (!LOGIN_ROLES.includes(member.role)) {
      return false;
    }

    return true;
  });
}

function renderInviteTable() {
  if (!state.adminData.invites.length) {
    els.inviteTableBody.innerHTML =
      '<div class="empty-state-card">目前沒有邀請碼資料。</div>';
    return;
  }

  els.inviteTableBody.innerHTML = state.adminData.invites
    .map((invite) => {
      const status = invite.used_at
        ? '<span class="status-chip success">已使用</span>'
        : new Date(invite.expires_at).getTime() < Date.now()
          ? '<span class="status-chip warning">已過期</span>'
          : '<span class="status-chip neutral">可使用</span>';

      return `
        <article class="invite-card">
          <div class="invite-card-head">
            <div class="row-meta">
              <strong>${escapeHtml(invite.target_name)}</strong>
              <div class="member-card-chips">
                <span class="role-pill role-${escapeHtml(invite.target_role)}">${escapeHtml(getRoleLabel(invite.target_role))}</span>
                ${status}
              </div>
            </div>
          </div>

          <div class="invite-code-row">
            <code class="invite-code-display">${escapeHtml(invite.invite_code)}</code>
            <button
              type="button"
              class="secondary invite-copy-btn"
              data-invite-code="${escapeHtml(invite.invite_code)}"
            >
              複製
            </button>
          </div>

          <div class="invite-meta-grid">
            <div class="info-item">
              <span class="info-label">到期日</span>
              <span>${escapeHtml(formatDateTime(invite.expires_at))}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邀請碼狀態</span>
              <span>${invite.used_at ? "已完成綁定" : new Date(invite.expires_at).getTime() < Date.now() ? "已失效" : "等待對方輸入"}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderLatestInvite() {
  if (!state.adminData.latestInvite) {
    setHidden(els.latestInviteBox, true);
    return;
  }

  els.latestInviteCode.textContent = state.adminData.latestInvite.invite_code;
  els.latestInviteExpires.textContent = formatDateTime(
    state.adminData.latestInvite.expires_at,
  );
  els.latestInviteTarget.textContent = `${state.adminData.latestInvite.target_name}（${getRoleLabel(
    state.adminData.latestInvite.target_role,
  )}）`;
  setHidden(els.latestInviteBox, false);
}

function handleInviteTableClick(event) {
  const copyButton = event.target.closest(".invite-copy-btn");
  if (!copyButton) {
    return;
  }

  copyInviteCode(copyButton.dataset.inviteCode || "");
}

function handleCopyLatestInvite() {
  copyInviteCode(els.latestInviteCode.textContent.trim());
}

async function copyInviteCode(inviteCode) {
  if (!inviteCode) {
    return;
  }

  const copied = await copyTextToClipboard(inviteCode);
  showToast(copied ? `已複製邀請碼：${inviteCode}` : "複製失敗，請手動複製。");
}

async function handleCreateInvite(event) {
  event.preventDefault();
  const memberId = Number(els.inviteMemberSelect.value || 0);
  const expiresInDays = Number(els.inviteExpiresInput.value || 7);
  if (!memberId) {
    showToast("請先選擇要登入的領袖。");
    return;
  }

  setButtonLoading(els.inviteSubmitBtn, true);
  try {
    const data = await apiRequest("create-invite", {
      method: "POST",
      authMode: "app",
      body: {
        member_id: memberId,
        expires_in_days: expiresInDays,
      },
    });

    state.adminData.latestInvite = data.invite;
    await loadAdminPanel();
    renderLatestInvite();
    showToast("已產生新的邀請碼。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "產生邀請碼失敗。");
  } finally {
    setButtonLoading(els.inviteSubmitBtn, false);
  }
}

function canUseManagement() {
  return Boolean(
    state.currentMember &&
      (state.currentMember.is_admin || state.currentMember.role === "district_leader"),
  );
}

function canUseOrganizationManagement() {
  return Boolean(state.currentMember?.is_admin);
}

function canUseOverview() {
  return Boolean(
    state.currentMember &&
      (state.currentMember.is_admin || OVERVIEW_ROLES.includes(state.currentMember.role)),
  );
}

function canUseManageAllToggle() {
  return Boolean(
    state.currentMember &&
      state.currentMember.small_group_id &&
      (state.currentMember.is_admin || state.currentMember.role === "preacher"),
  );
}

function canUseAttendanceFilters() {
  if (!state.currentMember) {
    return false;
  }

  if (canUseManageAllToggle() && !state.ui.manageAll) {
    return false;
  }

  return Boolean(
    state.currentMember.is_admin ||
      ["preacher", "district_leader", "big_family_leader"].includes(
        state.currentMember.role,
      ),
  );
}

function canUseInvites() {
  return Boolean(state.currentMember?.is_admin);
}

function canEditProfile(member) {
  if (!state.currentMember) {
    return false;
  }

  if (state.currentMember.is_admin) {
    return true;
  }

  return (
    state.currentMember.role === "district_leader" &&
    member.district_id === state.currentMember.district_id &&
    MEMBER_ROLES.includes(member.role)
  );
}

function canDeleteMember(member) {
  if (!state.currentMember || member.id === state.currentMember.id) {
    return false;
  }

  if (!member.is_active) {
    return false;
  }

  if (state.currentMember.is_admin) {
    return true;
  }

  return (
    state.currentMember.role === "district_leader" &&
    Boolean(state.currentMember.district_id) &&
    member.district_id === state.currentMember.district_id &&
    MEMBER_ROLES.includes(member.role)
  );
}

function canRestoreMember(member) {
  if (!state.currentMember || member.is_active) {
    return false;
  }

  if (state.currentMember.is_admin) {
    return true;
  }

  return (
    state.currentMember.role === "district_leader" &&
    Boolean(state.currentMember.district_id) &&
    member.district_id === state.currentMember.district_id &&
    MEMBER_ROLES.includes(member.role)
  );
}

function handleAdminRefresh() {
  loadAdminPanel()
    .then(() => showToast("管理資料已重新載入。"))
    .catch((error) => {
      console.error(error);
      showToast(error.message || "重新載入管理資料失敗。");
    });
}

async function copyTextToClipboard(text) {
  if (!text) {
    return false;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn("Clipboard API failed", error);
  }

  try {
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length);
    const copied = document.execCommand("copy");
    document.body.removeChild(input);
    return copied;
  } catch (error) {
    console.warn("execCommand copy failed", error);
    return false;
  }
}

function setButtonLoading(button, isLoading, loadingText = "") {
  if (!button) {
    return;
  }

  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent.trim();
  }

  button.disabled = isLoading;
  button.textContent = isLoading && loadingText
    ? loadingText
    : button.dataset.originalText;
}

function emptyAdminData() {
  return {
    districts: [],
    bigFamilies: [],
    smallGroups: [],
    members: [],
    invites: [],
    latestInvite: null,
  };
}

function emptyAttendanceAnalytics() {
  const emptyEventStats = () => ({
    present_count: 0,
    absent_count: 0,
    unknown_count: 0,
    confirmed_count: 0,
  });

  return {
    recentThreeMonths: {
      label: "近三個月",
      sunday_service: emptyEventStats(),
      small_group_fellowship: emptyEventStats(),
    },
    yearToDate: {
      label: "今年",
      sunday_service: emptyEventStats(),
      small_group_fellowship: emptyEventStats(),
    },
  };
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function fillSelect(select, items, options = {}) {
  const previousValue = select.value;
  const placeholder = options.placeholder || "請選擇";
  const keepEmptyOption = options.keepEmptyOption !== false;

  select.innerHTML = "";
  if (keepEmptyOption) {
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    select.appendChild(placeholderOption);
  }

  for (const item of items) {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.appendChild(option);
  }

  if (items.some((item) => item.value === previousValue)) {
    select.value = previousValue;
  } else if (!keepEmptyOption && items[0]) {
    select.value = items[0].value;
  } else {
    select.value = "";
  }
}

function setDirty(isDirty) {
  state.dirty = isDirty;
  if (isDirty) {
    clearAttendanceSaveSuccessFeedback();
  }
  setBadge(
    els.dirtyBadge,
    isDirty ? "尚有未儲存變更" : "已同步",
    isDirty ? "warning" : "neutral",
  );

  if (els.attendanceSaveStatus) {
    els.attendanceSaveStatus.textContent = isDirty
      ? "你有尚未儲存的點名變更"
      : "目前已同步，可直接離開";
  }
}

function showAttendanceSaveSuccessFeedback() {
  if (!els.attendanceSaveBar || !els.attendanceSaveStatus) {
    return;
  }

  clearTimeout(state.saveFeedbackTimer);
  els.attendanceSaveBar.classList.add("is-save-success");
  els.attendanceSaveStatus.textContent = "已成功儲存，資料已同步";
  setBadge(els.dirtyBadge, "已儲存", "success");
  setAttendanceSaveButtonText("儲存成功");

  state.saveFeedbackTimer = window.setTimeout(() => {
    clearAttendanceSaveSuccessFeedback();
    if (!state.dirty) {
      setDirty(false);
    }
  }, 1200);
}

function clearAttendanceSaveSuccessFeedback() {
  clearTimeout(state.saveFeedbackTimer);
  state.saveFeedbackTimer = null;
  els.attendanceSaveBar?.classList.remove("is-save-success");
  setAttendanceSaveButtonText("");
}

function setAttendanceSaveButtonText(text) {
  [els.saveAttendanceBtn, els.saveAttendanceBtnBottom].forEach((button) => {
    if (!button) {
      return;
    }
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent.trim();
    }
    button.textContent = text || button.dataset.originalText;
  });
}

function canDiscardDirtyChanges() {
  if (!state.dirty) {
    return true;
  }

  return window.confirm(
    "目前有尚未儲存的點名與備註變更，確定要放棄並重新載入嗎？",
  );
}

function getRoleLabel(role) {
  return ROLE_LABELS[role] || role || "-";
}

function getGenderLabel(gender) {
  return GENDER_LABELS[gender] || "-";
}

async function apiRequest(action, options = {}) {
  if (!hasProjectUrl()) {
    throw new Error("尚未設定 Supabase Project URL。");
  }

  const {
    method = "GET",
    authMode = "none",
    body = null,
    suppressUnauthorizedToast = false,
  } = options;

  const actionName = String(action).split("&")[0];
  const functionName = V2_API_ACTIONS.has(actionName) ? "app-api-v2" : "app-api";
  const url = `${state.config.projectUrl}/functions/v1/${functionName}?action=${action}`;
  const headers = {
    "Content-Type": "application/json",
  };

  if ((authMode === "app" || authMode === "auto") && state.appToken) {
    headers.Authorization = `Bearer ${state.appToken}`;
  }

  if (
    authMode === "pending" ||
    (authMode === "auto" && !state.appToken && state.pendingToken)
  ) {
    if (state.pendingToken) {
      headers["X-Pending-Token"] = state.pendingToken;
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (
      (response.status === 401 || response.status === 403) &&
      !suppressUnauthorizedToast
    ) {
      if (authMode === "app") {
        state.appToken = null;
        saveStoredValue(STORAGE_KEYS.appToken, "");
      }

      if (authMode === "pending") {
        state.pendingToken = null;
        saveStoredValue(STORAGE_KEYS.pendingToken, "");
      }
    }

    throw new Error(data?.error || `Request failed with status ${response.status}.`);
  }

  return data;
}

function getMondayIso(source) {
  const date = source instanceof Date ? new Date(source) : parseIsoDate(source);
  const day = date.getDay();
  const diff = -day;
  date.setDate(date.getDate() + diff);
  return formatDate(date);
}

function addDaysIso(source, days) {
  const date = parseIsoDate(source);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function buildWeekLabel(weekStartIso) {
  const start = parseIsoDate(weekStartIso);
  return formatDate(start);
}

function buildShortWeekLabel(weekStartIso) {
  const start = parseIsoDate(weekStartIso);
  return `${start.getMonth() + 1}/${start.getDate()}`;
}

function parseIsoDate(isoDate) {
  const [year, month, day] = String(isoDate)
    .split("-")
    .map((value) => Number(value));
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sortMembers(members) {
  return [...members].sort((left, right) => {
    const leftRole = ROLE_ORDER[left.role] || 99;
    const rightRole = ROLE_ORDER[right.role] || 99;
    if (leftRole !== rightRole) {
      return leftRole - rightRole;
    }

    const leftDistrict = left.district_name || "";
    const rightDistrict = right.district_name || "";
    if (leftDistrict !== rightDistrict) {
      return leftDistrict.localeCompare(rightDistrict, "zh-Hant");
    }

    const leftBigFamily = left.big_family_name || "";
    const rightBigFamily = right.big_family_name || "";
    if (leftBigFamily !== rightBigFamily) {
      return leftBigFamily.localeCompare(rightBigFamily, "zh-Hant");
    }

    const leftSmallGroup = left.small_group_name || "";
    const rightSmallGroup = right.small_group_name || "";
    if (leftSmallGroup !== rightSmallGroup) {
      return leftSmallGroup.localeCompare(rightSmallGroup, "zh-Hant");
    }

    return left.full_name.localeCompare(right.full_name, "zh-Hant");
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
