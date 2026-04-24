const STORAGE_KEYS = {
  config: "topheart-line-app-config",
  appToken: "topheart-line-app-token",
  pendingToken: "topheart-line-pending-token",
};

const ROLE_LABELS = {
  district_leader: "區長",
  big_family_leader: "大家長",
  small_group_leader: "小家長",
  member: "小家人",
  best: "新朋友",
};

const ROLE_ORDER = {
  district_leader: 1,
  big_family_leader: 2,
  small_group_leader: 3,
  member: 4,
  best: 5,
};

const GENDER_LABELS = {
  brother: "弟兄",
  sister: "姊妹",
};

const STATUS_LABELS = {
  unknown: "未填寫",
  present: "出席",
  absent: "未出席",
};

const LOGIN_ROLES = [
  "district_leader",
  "big_family_leader",
  "small_group_leader",
];

const DEFAULT_PROJECT_URL = "https://aiifotwroawqxkcsfjzi.supabase.co";

const TABS = {
  attendance: "attendance",
  people: "people",
  invites: "invites",
};

const els = {
  pageDescription: document.querySelector("#pageDescription"),
  userBar: document.querySelector("#userBar"),
  userNameText: document.querySelector("#userNameText"),
  userScopeText: document.querySelector("#userScopeText"),
  toggleSettingsBtn: document.querySelector("#toggleSettingsBtn"),
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
  tabPeopleBtn: document.querySelector("#tabPeopleBtn"),
  tabInvitesBtn: document.querySelector("#tabInvitesBtn"),
  attendanceView: document.querySelector("#attendanceView"),
  attendanceHeaderPanel: document.querySelector("#attendanceHeaderPanel"),
  dirtyBadge: document.querySelector("#dirtyBadge"),
  weekInput: document.querySelector("#weekInput"),
  prevWeekBtn: document.querySelector("#prevWeekBtn"),
  nextWeekBtn: document.querySelector("#nextWeekBtn"),
  refreshBtn: document.querySelector("#refreshBtn"),
  saveAttendanceBtn: document.querySelector("#saveAttendanceBtn"),
  weekSummary: document.querySelector("#weekSummary"),
  rosterTableBody: document.querySelector("#rosterTableBody"),
  peopleView: document.querySelector("#peopleView"),
  peopleSearchInput: document.querySelector("#peopleSearchInput"),
  peopleRoleFilter: document.querySelector("#peopleRoleFilter"),
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
  memberNoteInput: document.querySelector("#memberNoteInput"),
  memberScopeHint: document.querySelector("#memberScopeHint"),
  memberSubmitBtn: document.querySelector("#memberSubmitBtn"),
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
  districtTableBody: document.querySelector("#districtTableBody"),
  bigFamilyTableBody: document.querySelector("#bigFamilyTableBody"),
  smallGroupTableBody: document.querySelector("#smallGroupTableBody"),
  orgEditorCard: document.querySelector("#orgEditorCard"),
  orgEditorTitle: document.querySelector("#orgEditorTitle"),
  orgEditorHint: document.querySelector("#orgEditorHint"),
  closeOrgEditorBtn: document.querySelector("#closeOrgEditorBtn"),
  orgEditorForm: document.querySelector("#orgEditorForm"),
  orgNameInput: document.querySelector("#orgNameInput"),
  orgDescriptionInput: document.querySelector("#orgDescriptionInput"),
  orgSubmitBtn: document.querySelector("#orgSubmitBtn"),
  invitesView: document.querySelector("#invitesView"),
  inviteForm: document.querySelector("#inviteForm"),
  inviteMemberSelect: document.querySelector("#inviteMemberSelect"),
  inviteExpiresInput: document.querySelector("#inviteExpiresInput"),
  inviteSubmitBtn: document.querySelector("#inviteSubmitBtn"),
  latestInviteBox: document.querySelector("#latestInviteBox"),
  latestInviteCode: document.querySelector("#latestInviteCode"),
  latestInviteExpires: document.querySelector("#latestInviteExpires"),
  latestInviteTarget: document.querySelector("#latestInviteTarget"),
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
  roster: [],
  adminData: emptyAdminData(),
  ui: {
    activeTab: TABS.attendance,
    settingsOpen: false,
    editorMode: null,
    editingMemberId: null,
    orgEditorMode: null,
    editingOrgId: null,
    peopleSearch: "",
    peopleRole: "",
  },
  dirty: false,
  toastTimer: null,
};

boot().catch((error) => {
  console.error(error);
  showToast(error.message || "初始化失敗，請檢查設定。");
});

async function boot() {
  bindEvents();
  hydrateLocalState();
  updateCallbackPreview();
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
  els.signInBtn.addEventListener("click", handleSignIn);
  els.signOutBtn.addEventListener("click", handleSignOut);
  els.bindForm.addEventListener("submit", handleBindInvite);

  els.tabAttendanceBtn.addEventListener("click", () => switchTab(TABS.attendance));
  els.tabPeopleBtn.addEventListener("click", () => switchTab(TABS.people));
  els.tabInvitesBtn.addEventListener("click", () => switchTab(TABS.invites));

  els.prevWeekBtn.addEventListener("click", () => handleShiftWeek(-7));
  els.nextWeekBtn.addEventListener("click", () => handleShiftWeek(7));
  els.refreshBtn.addEventListener("click", handleRefreshDashboard);
  els.saveAttendanceBtn.addEventListener("click", handleSaveAttendance);
  els.weekInput.addEventListener("change", handleWeekChange);
  els.rosterTableBody.addEventListener("change", handleAttendanceFieldChange);
  els.rosterTableBody.addEventListener("input", handleAttendanceFieldChange);
  els.rosterTableBody.addEventListener("click", handleRosterActions);

  els.peopleSearchInput.addEventListener("input", handlePeopleFilters);
  els.peopleRoleFilter.addEventListener("change", handlePeopleFilters);
  els.newMemberBtn.addEventListener("click", () => openMemberEditor("create"));
  els.peopleTableBody.addEventListener("click", handlePeopleTableClick);
  els.closeMemberEditorBtn.addEventListener("click", closeMemberEditor);

  els.memberForm.addEventListener("submit", handleSaveMember);
  els.memberRoleSelect.addEventListener("change", syncMemberFormScope);
  els.memberDistrictSelect.addEventListener("change", () => {
    syncEditorBigFamilyOptions();
    syncEditorSmallGroupOptions();
    syncMemberFormScope();
  });
  els.memberBigFamilySelect.addEventListener("change", () => {
    syncEditorSmallGroupOptions();
    syncMemberFormScope();
  });

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

  els.inviteForm.addEventListener("submit", handleCreateInvite);

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
  els.projectUrlInput.value = state.config.projectUrl || "";
}

function loadConfig() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.config);
    if (!raw) {
      return { projectUrl: DEFAULT_PROJECT_URL };
    }

    const parsed = JSON.parse(raw);
    return {
      projectUrl: normalizeProjectUrl(parsed.projectUrl || ""),
    };
  } catch (error) {
    console.warn("Unable to parse saved config", error);
    return { projectUrl: DEFAULT_PROJECT_URL };
  }
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
  renderLayout();
  showToast("已清除專案設定。");
}

function handleToggleSettings() {
  state.ui.settingsOpen = !state.ui.settingsOpen;
  renderLayout();
}

async function handleSignIn() {
  if (!hasProjectUrl()) {
    showToast("請先儲存 Supabase Project URL。");
    return;
  }

  try {
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const url = new URL(
      `${state.config.projectUrl}/functions/v1/line-login-start`,
    );
    url.searchParams.set("redirect_to", redirectTo);

    const response = await fetch(url.toString());
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.authorization_url) {
      throw new Error(data?.error || "無法開始 LINE 登入流程。");
    }

    window.location.assign(data.authorization_url);
  } catch (error) {
    console.error(error);
    showToast(error.message || "無法開始 LINE 登入流程。");
  }
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
  saveStoredValue(STORAGE_KEYS.appToken, "");
  saveStoredValue(STORAGE_KEYS.pendingToken, "");
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
      state.currentMember = data.current_member;
      state.pendingProfile = null;
      state.ui.activeTab = TABS.attendance;
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
      state.adminData = emptyAdminData();
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
  state.adminData = emptyAdminData();
  saveStoredValue(STORAGE_KEYS.appToken, "");
  saveStoredValue(STORAGE_KEYS.pendingToken, "");
  renderLayout();
}

function renderLayout() {
  const isAuthenticated = Boolean(state.currentMember);
  const isPending = Boolean(state.pendingProfile && !state.currentMember);
  const showSettings = !hasProjectUrl() || state.ui.settingsOpen;

  setHidden(els.setupCard, !showSettings);
  setHidden(els.loginCard, isAuthenticated || isPending);
  setHidden(els.loginSettingsBtn, !hasProjectUrl() || showSettings || isAuthenticated || isPending);
  setHidden(els.bindCard, !isPending);
  setHidden(els.userBar, !isAuthenticated);
  setHidden(els.navCard, !isAuthenticated);

  if (!isAuthenticated) {
    setHidden(els.attendanceView, true);
    setHidden(els.peopleView, true);
    setHidden(els.invitesView, true);
    setBadge(els.sessionBadge, isPending ? "待綁定" : "尚未登入", isPending ? "warning" : "neutral");
    els.authSummary.textContent = hasProjectUrl()
      ? "請使用 LINE 登入。"
      : "請先填寫並儲存 Supabase Project URL。";
    els.signInBtn.disabled = !hasProjectUrl();
    renderPendingProfile();
    return;
  }

  renderTopBar();
  renderTabs();
  renderActiveView();
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

function renderTabs() {
  const canManage = canUseManagement();
  setHidden(els.tabPeopleBtn, !canManage);
  setHidden(els.tabInvitesBtn, !canManage);

  if (!canManage && state.ui.activeTab !== TABS.attendance) {
    state.ui.activeTab = TABS.attendance;
  }

  setTabActive(els.tabAttendanceBtn, state.ui.activeTab === TABS.attendance);
  setTabActive(els.tabPeopleBtn, state.ui.activeTab === TABS.people);
  setTabActive(els.tabInvitesBtn, state.ui.activeTab === TABS.invites);
}

function renderActiveView() {
  setHidden(els.attendanceView, state.ui.activeTab !== TABS.attendance);
  setHidden(els.peopleView, state.ui.activeTab !== TABS.people);
  setHidden(els.invitesView, state.ui.activeTab !== TABS.invites);
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
  button.classList.toggle("is-active", isActive);
}

function switchTab(tabId) {
  state.ui.activeTab = tabId;
  renderTabs();
  renderActiveView();
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

    const data = await apiRequest(
      `dashboard&week_start=${encodeURIComponent(weekStart)}`,
      {
        method: "GET",
        authMode: "app",
      },
    );

    state.currentMember = data.current_member;
    state.currentWeek = data.week;
    state.roster = sortMembers((data.roster || []).map(enrichRosterMember));
    renderAttendanceHeader();
    renderWeekSummary();
    renderAttendanceRows();
    setDirty(false);
  } catch (error) {
    console.error(error);
    showToast(error.message || "載入點名資料失敗。");
  }
}

function enrichRosterMember(member) {
  return {
    ...member,
    can_edit_note: Boolean(
      member.can_edit_note ?? member.can_edit_attendance,
    ),
    can_edit_profile: canEditProfile(member),
  };
}

function renderAttendanceHeader() {
  if (!state.currentMember) {
    els.attendanceHeaderPanel.innerHTML = "";
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
        <span class="info-label">本週週次</span>
        <span class="info-value">${escapeHtml(
          state.currentWeek?.label || buildWeekLabel(els.weekInput.value || getMondayIso(new Date())),
        )}</span>
      </div>
    </div>
  `;
}

function renderWeekSummary() {
  const visibleCount = state.roster.length;
  const editableCount = state.roster.filter(
    (member) => member.can_edit_attendance,
  ).length;
  const sundayPresentCount = countStatus("sunday_service", "present");
  const fellowshipPresentCount = countStatus(
    "small_group_fellowship",
    "present",
  );

  els.weekSummary.innerHTML = `
    <div class="summary-item">
      <span class="info-label">總人數</span>
      <strong>${visibleCount}</strong>
    </div>
    <div class="summary-item">
      <span class="info-label">可點名</span>
      <strong>${editableCount}</strong>
    </div>
    <div class="summary-item">
      <span class="info-label">主日出席 / 出席率</span>
      <strong>${sundayPresentCount} / ${formatPercent(
        sundayPresentCount,
        visibleCount,
      )}</strong>
    </div>
    <div class="summary-item">
      <span class="info-label">小家團契出席 / 出席率</span>
      <strong>${fellowshipPresentCount} / ${formatPercent(
        fellowshipPresentCount,
        visibleCount,
      )}</strong>
    </div>
  `;
}

function renderAttendanceRows() {
  if (!state.roster.length) {
    els.rosterTableBody.innerHTML =
      '<tr><td colspan="6" class="empty-cell">目前沒有可顯示的人員資料。</td></tr>';
    return;
  }

  els.rosterTableBody.innerHTML = state.roster
    .map((member) => {
      const meta = formatMemberScopeSummary(member);
      const noteDisabled = member.can_edit_note ? "" : "disabled";
      const noteValue = escapeHtml(member.note || "");
      const editButton = member.can_edit_profile
        ? `<button type="button" class="secondary roster-edit-btn" data-member-id="${member.id}">編輯資料</button>`
        : `<span class="muted">-</span>`;

      return `
        <tr>
          <td>
            <div class="row-meta">
              <strong>${escapeHtml(member.full_name)}</strong>
              ${renderGenderBadge(member.gender)}
            </div>
          </td>
          <td>
            <div class="row-meta">
              <span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span>
              ${meta ? `<span class="muted">${escapeHtml(meta)}</span>` : ""}
            </div>
          </td>
          <td>${renderAttendanceSelect(member, "sunday_service")}</td>
          <td>${renderAttendanceSelect(member, "small_group_fellowship")}</td>
          <td>
            <textarea
              class="note-input"
              data-member-id="${member.id}"
              placeholder="記錄近況備註"
              ${noteDisabled}
            >${noteValue}</textarea>
          </td>
          <td>
            <div class="row-actions">${editButton}</div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderAttendanceSelect(member, eventType) {
  const label = eventType === "sunday_service" ? "主日聚會" : "小家團契";
  const disabled = member.can_edit_attendance ? "" : "disabled";
  const checked =
    (member.attendance?.[eventType] || "unknown") === "present" ? "checked" : "";

  return `
    <label class="checkbox-row">
      <input
      type="checkbox"
      class="attendance-checkbox"
      data-member-id="${member.id}"
      data-event-type="${eventType}"
      aria-label="${escapeHtml(member.full_name)} ${label}"
      ${disabled}
      ${checked}
      />
      <span>出席</span>
    </label>
  `;
}

function countStatus(eventType, status) {
  return state.roster.filter(
    (member) => getSelectedAttendanceStatus(member.id, eventType) === status,
  ).length;
}

function getSelectedAttendanceStatus(memberId, eventType) {
  const checkbox = document.querySelector(
    `.attendance-checkbox[data-member-id="${memberId}"][data-event-type="${eventType}"]`,
  );
  if (checkbox) {
    return checkbox.checked ? "present" : "absent";
  }

  const member = state.roster.find((item) => item.id === memberId);
  return member?.attendance?.[eventType] || "unknown";
}

function getSelectedNote(memberId) {
  const noteInput = document.querySelector(
    `.note-input[data-member-id="${memberId}"]`,
  );
  if (noteInput) {
    return noteInput.value.trim();
  }

  const member = state.roster.find((item) => item.id === memberId);
  return member?.note || "";
}

async function handleShiftWeek(dayDelta) {
  if (!canDiscardDirtyChanges()) {
    return;
  }

  const current = parseIsoDate(els.weekInput.value || getMondayIso(new Date()));
  current.setDate(current.getDate() + dayDelta);
  els.weekInput.value = getMondayIso(current);
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
  if (
    !event.target.matches(".attendance-checkbox") &&
    !event.target.matches(".note-input")
  ) {
    return;
  }

  setDirty(true);
  renderWeekSummary();
}

function handleRosterActions(event) {
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
    }));

  if (!entries.length) {
    showToast("目前沒有可儲存的內容。");
    return;
  }

  setButtonLoading(els.saveAttendanceBtn, true);
  try {
    const data = await apiRequest("save-attendance", {
      method: "POST",
      authMode: "app",
      body: {
        week_start: els.weekInput.value,
        entries,
      },
    });

    showToast(data?.message || "本週點名已儲存。");
    setDirty(false);
    await Promise.all([loadDashboard({ skipDirtyCheck: true }), loadAdminPanel()]);
  } catch (error) {
    console.error(error);
    showToast(error.message || "儲存點名失敗。");
  } finally {
    setButtonLoading(els.saveAttendanceBtn, false);
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

function renderManagement() {
  if (!canUseManagement()) {
    setHidden(els.peopleView, true);
    closeOrgEditor();
    return;
  }

  const editableMembers = getEditableManagementMembers();
  renderPeopleFilters(editableMembers);
  renderPeopleTable(editableMembers);
  renderMemberEditor();
  renderOrganizationTools();
  renderOrganizationTables();
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
      ["member", "best"].includes(member.role),
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
  if (!rows.length) {
    els.peopleTableBody.innerHTML =
      '<tr><td colspan="5" class="empty-cell">目前沒有符合條件、且你可編輯的人員資料。</td></tr>';
    return;
  }

  els.peopleTableBody.innerHTML = rows
    .map((member) => {
      const path = formatPeopleScopeSummary(member);

      const lineStatus = member.line_user_id
        ? '<span class="status-chip success">已綁定</span>'
        : LOGIN_ROLES.includes(member.role)
          ? '<span class="status-chip warning">待綁定</span>'
          : '<span class="status-chip neutral">不需登入</span>';

      return `
        <tr>
          <td>
            <div class="row-meta">
              <strong>${escapeHtml(member.full_name)}</strong>
              ${renderGenderBadge(member.gender)}
            </div>
          </td>
          <td><span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span></td>
          <td>${escapeHtml(path || "-")}</td>
          <td>${lineStatus}</td>
          <td>
            <div class="row-actions">
              <button type="button" class="secondary people-edit-btn" data-member-id="${member.id}">編輯</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function handlePeopleFilters() {
  state.ui.peopleSearch = els.peopleSearchInput.value || "";
  state.ui.peopleRole = els.peopleRoleFilter.value || "";
  renderPeopleTable(getEditableManagementMembers());
}

function handlePeopleTableClick(event) {
  const button = event.target.closest(".people-edit-btn");
  if (!button) {
    return;
  }

  const memberId = Number(button.dataset.memberId);
  if (!memberId) {
    return;
  }

  openMemberEditor("edit", memberId);
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
  syncEditorBigFamilyOptions(editableMember);
  syncEditorSmallGroupOptions(editableMember);
  fillMemberForm(mode, editableMember);
  syncMemberFormScope();
  setHidden(els.memberEditorCard, false);
}

function closeMemberEditor() {
  state.ui.editorMode = null;
  state.ui.editingMemberId = null;
  els.memberForm.reset();
  setHidden(els.memberEditorCard, true);
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
    roles = state.currentMember?.is_admin
      ? [
          "district_leader",
          "big_family_leader",
          "small_group_leader",
          "member",
          "best",
        ]
      : ["big_family_leader", "small_group_leader", "member", "best"];
  } else {
    if (state.currentMember?.is_admin) {
      roles = [
        "district_leader",
        "big_family_leader",
        "small_group_leader",
        "member",
        "best",
      ];
    } else {
      roles = [member.role];
    }
  }

  fillSelect(
    els.memberRoleSelect,
    roles.map((role) => ({ value: role, label: getRoleLabel(role) })),
    { placeholder: "請選擇職分" },
  );

  els.memberRoleSelect.disabled = mode === "edit" && !state.currentMember?.is_admin;
}

function populateDistrictOptions(member) {
  const districtOptions = state.adminData.districts.map((district) => ({
    value: String(district.id),
    label: district.name,
  }));
  fillSelect(els.memberDistrictSelect, districtOptions, {
    placeholder: districtOptions.length ? "請選擇區" : "尚無可選區",
  });

  if (state.currentMember?.is_admin) {
    els.memberDistrictSelect.disabled = false;
    if (member?.district_id) {
      els.memberDistrictSelect.value = String(member.district_id);
    } else if (state.adminData.districts[0]) {
      els.memberDistrictSelect.value = String(state.adminData.districts[0].id);
    }
  } else {
    const districtId = String(state.currentMember?.district_id || "");
    els.memberDistrictSelect.value = districtId;
    els.memberDistrictSelect.disabled = true;
  }
}

function syncEditorBigFamilyOptions(member = null) {
  const districtId = Number(els.memberDistrictSelect.value || 0);
  const available = state.adminData.bigFamilies.filter((bigFamily) =>
    districtId ? bigFamily.district_id === districtId : true,
  );

  fillSelect(
    els.memberBigFamilySelect,
    available.map((bigFamily) => ({
      value: String(bigFamily.id),
      label: bigFamily.name,
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
  const available = state.adminData.smallGroups.filter((smallGroup) => {
    if (role === "member" || role === "best") {
      return true;
    }

    if (bigFamilyId) {
      return smallGroup.big_family_id === bigFamilyId;
    }

    return districtId ? smallGroup.district_id === districtId : true;
  });

  fillSelect(
    els.memberSmallGroupSelect,
    available.map((smallGroup) => ({
      value: String(smallGroup.id),
      label:
        role === "member" || role === "best"
          ? [smallGroup.name, smallGroup.big_family_name, smallGroup.district_name]
              .filter(Boolean)
              .join(" / ")
          : smallGroup.name,
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
      ? "管理員可建立所有職分；新增區長/大家長/小家長時，系統會自動建立對應組織。"
      : "區長可建立自己轄區內的大/小家長、小家人與新朋友。";
    els.memberNameInput.value = "";
    els.memberGenderSelect.value = "";
    els.memberNoteInput.value = "";
    els.memberActiveSelect.value = "true";
    els.memberIsAdminInput.checked = false;
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
  }
}

function syncMemberFormScope() {
  const role = els.memberRoleSelect.value;
  const isCreateMode = state.ui.editorMode === "create";
  const needsBigFamily =
    role === "member" || role === "best"
      ? false
      : role === "big_family_leader"
        ? !isCreateMode
        : role === "small_group_leader"
          ? true
          : false;
  const needsSmallGroup = role === "member" || role === "best";
  const showSmallGroupField =
    role === "member" ||
    role === "best" ||
    (role === "small_group_leader" && !isCreateMode);
  const showDistrictField =
    (role !== "district_leader" || !isCreateMode) &&
    !["member", "best"].includes(role);
  const districtRequired =
    role === "big_family_leader" ||
    role === "small_group_leader" ||
    (!isCreateMode && role === "district_leader");

  setHidden(els.memberDistrictLabel, !showDistrictField);
  setHidden(els.memberBigFamilyLabel, !needsBigFamily);
  setHidden(els.memberSmallGroupLabel, !showSmallGroupField);
  setHidden(els.memberIsAdminWrap, !state.currentMember?.is_admin);

  els.memberDistrictSelect.required = districtRequired;
  els.memberBigFamilySelect.required =
    role === "big_family_leader" && !isCreateMode ? true : false;
  els.memberSmallGroupSelect.required = role === "member" || role === "best";
  els.memberIsAdminInput.disabled = !state.currentMember?.is_admin;

  if (!state.currentMember?.is_admin) {
    els.memberIsAdminInput.checked = false;
  }

  const hints = {
    district_leader: isCreateMode
      ? "新增區長時，系統會自動建立「姓名區」。"
      : "編輯區長時，可調整基本資料與所屬區。",
    big_family_leader: isCreateMode
      ? "新增大家長時，只需選區；系統會自動建立「姓名大家」。"
      : "編輯大家長時，可調整基本資料與所屬區/大家。",
    small_group_leader: isCreateMode
      ? "新增小家長時，只需選區，大家可留空；系統會自動建立「姓名小家」。"
      : "編輯小家長時，可調整基本資料與所屬。",
    member: "新增小家人時，只要選小家，系統會自動帶出上層歸屬。",
    best: "新增新朋友時，只要選小家，系統會自動帶出上層歸屬。",
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
    district_id: Number(els.memberDistrictSelect.value || 0),
    big_family_id: Number(els.memberBigFamilySelect.value || 0) || null,
    small_group_id: Number(els.memberSmallGroupSelect.value || 0) || null,
    is_admin: els.memberIsAdminInput.checked,
    is_active: els.memberActiveSelect.value === "true",
  };

  if (!body.full_name || !body.role) {
    showToast("請完整填寫姓名與職分。");
    return;
  }

  if (
    ["big_family_leader", "small_group_leader"].includes(body.role) &&
    !body.district_id &&
    state.ui.editorMode === "create"
  ) {
    showToast("此職分至少需要指定所屬區。");
    return;
  }

  if (["member", "best"].includes(body.role) && !body.small_group_id) {
    showToast("新增小家人或新朋友時，請先選擇所屬小家。");
    return;
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

function renderOrganizationTools() {
  setHidden(els.districtDetails, !state.currentMember?.is_admin);

  fillSelect(
    els.bigFamilyDistrictSelect,
    state.adminData.districts.map((district) => ({
      value: String(district.id),
      label: district.name,
    })),
    {
      placeholder: state.adminData.districts.length ? "請選擇區" : "尚無可選區",
    },
  );

  fillSelect(
    els.smallGroupDistrictSelect,
    state.adminData.districts.map((district) => ({
      value: String(district.id),
      label: district.name,
    })),
    {
      placeholder: state.adminData.districts.length ? "請選擇區" : "尚無可選區",
    },
  );

  if (!state.currentMember?.is_admin && state.currentMember?.district_id) {
    els.bigFamilyDistrictSelect.value = String(state.currentMember.district_id);
    els.bigFamilyDistrictSelect.disabled = true;
    els.smallGroupDistrictSelect.value = String(state.currentMember.district_id);
    els.smallGroupDistrictSelect.disabled = true;
  } else {
    if (!els.bigFamilyDistrictSelect.value && state.adminData.districts[0]) {
      els.bigFamilyDistrictSelect.value = String(state.adminData.districts[0].id);
    }
    if (!els.smallGroupDistrictSelect.value && state.adminData.districts[0]) {
      els.smallGroupDistrictSelect.value = String(state.adminData.districts[0].id);
    }
    els.bigFamilyDistrictSelect.disabled = false;
    els.smallGroupDistrictSelect.disabled = false;
  }

  syncOrgSelects();
}

function syncOrgSelects() {
  const districtId = Number(els.smallGroupDistrictSelect.value || 0);
  const available = state.adminData.bigFamilies.filter((bigFamily) =>
    districtId ? bigFamily.district_id === districtId : true,
  );

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
}

async function handleCreateDistrict(event) {
  event.preventDefault();
  const name = els.districtNameInput.value.trim();
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
  const name = els.bigFamilyNameInput.value.trim();
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
  const name = els.smallGroupNameInput.value.trim();
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
  renderDistrictTable();
  renderBigFamilyTable();
  renderSmallGroupTable();
}

function renderDistrictTable() {
  if (!state.adminData.districts.length) {
    els.districtTableBody.innerHTML =
      '<tr><td colspan="3" class="empty-cell">尚未載入區資料。</td></tr>';
    return;
  }

  els.districtTableBody.innerHTML = state.adminData.districts
    .map(
      (district) => `
        <tr>
          <td>${escapeHtml(district.name)}</td>
          <td>${escapeHtml(district.description || "-")}</td>
          <td>
            <button type="button" class="secondary org-edit-btn" data-org-type="district" data-org-id="${district.id}">編輯</button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderBigFamilyTable() {
  if (!state.adminData.bigFamilies.length) {
    els.bigFamilyTableBody.innerHTML =
      '<tr><td colspan="3" class="empty-cell">尚未載入大家資料。</td></tr>';
    return;
  }

  els.bigFamilyTableBody.innerHTML = state.adminData.bigFamilies
    .map(
      (bigFamily) => `
        <tr>
          <td>${escapeHtml(bigFamily.name)}</td>
          <td>${escapeHtml(bigFamily.district_name || "-")}</td>
          <td>
            <button type="button" class="secondary org-edit-btn" data-org-type="big_family" data-org-id="${bigFamily.id}">編輯</button>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderSmallGroupTable() {
  if (!state.adminData.smallGroups.length) {
    els.smallGroupTableBody.innerHTML =
      '<tr><td colspan="3" class="empty-cell">尚未載入小家資料。</td></tr>';
    return;
  }

  els.smallGroupTableBody.innerHTML = state.adminData.smallGroups
    .map((smallGroup) => {
      const path = [smallGroup.big_family_name, smallGroup.district_name]
        .filter(Boolean)
        .join(" / ");

      return `
        <tr>
          <td>${escapeHtml(smallGroup.name)}</td>
          <td>${escapeHtml(path || "直屬區")}</td>
          <td>
            <button type="button" class="secondary org-edit-btn" data-org-type="small_group" data-org-id="${smallGroup.id}">編輯</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function handleOrgTableClick(event) {
  const button = event.target.closest(".org-edit-btn");
  if (!button) {
    return;
  }

  openOrgEditor(button.dataset.orgType, Number(button.dataset.orgId));
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

  els.orgNameInput.value = entity.name || "";
  els.orgDescriptionInput.value = entity.description || "";
  setHidden(els.orgEditorCard, false);
}

function closeOrgEditor() {
  state.ui.orgEditorMode = null;
  state.ui.editingOrgId = null;
  els.orgEditorForm.reset();
  setHidden(els.orgEditorCard, true);
}

async function handleSaveOrganization(event) {
  event.preventDefault();
  if (!state.ui.orgEditorMode || !state.ui.editingOrgId) {
    return;
  }

  const name = els.orgNameInput.value.trim();
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
  setButtonLoading(els.orgSubmitBtn, true);
  try {
    await apiRequest(action, {
      method: "POST",
      authMode: "app",
      body: {
        [idKey]: state.ui.editingOrgId,
        name,
        description: els.orgDescriptionInput.value.trim(),
      },
    });

    closeOrgEditor();
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
  if (!canUseManagement()) {
    setHidden(els.invitesView, true);
    return;
  }

  const candidates = getInviteCandidates();
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

  renderInviteTable();
  renderLatestInvite();
}

function getInviteCandidates() {
  return state.adminData.members.filter((member) => {
    if (!member.is_active || member.line_user_id) {
      return false;
    }

    if (!LOGIN_ROLES.includes(member.role)) {
      return false;
    }

    if (state.currentMember.is_admin) {
      return true;
    }

    return (
      state.currentMember.role === "district_leader" &&
      member.district_id === state.currentMember.district_id &&
      ["big_family_leader", "small_group_leader"].includes(member.role)
    );
  });
}

function renderInviteTable() {
  if (!state.adminData.invites.length) {
    els.inviteTableBody.innerHTML =
      '<tr><td colspan="5" class="empty-cell">目前沒有邀請碼資料。</td></tr>';
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
        <tr>
          <td>${escapeHtml(invite.target_name)}</td>
          <td>${escapeHtml(getRoleLabel(invite.target_role))}</td>
          <td><code>${escapeHtml(invite.invite_code)}</code></td>
          <td>${status}</td>
          <td>${escapeHtml(formatDateTime(invite.expires_at))}</td>
        </tr>
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
    ["member", "best"].includes(member.role)
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

function setButtonLoading(button, isLoading) {
  button.disabled = isLoading;
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
  setBadge(
    els.dirtyBadge,
    isDirty ? "尚有未儲存變更" : "已同步",
    isDirty ? "warning" : "neutral",
  );
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

  const url = `${state.config.projectUrl}/functions/v1/app-api?action=${action}`;
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

function buildWeekLabel(weekStartIso) {
  const start = parseIsoDate(weekStartIso);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${formatDate(start)} 到 ${formatDate(end)}`;
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

    const leftRole = ROLE_ORDER[left.role] || 99;
    const rightRole = ROLE_ORDER[right.role] || 99;
    if (leftRole !== rightRole) {
      return leftRole - rightRole;
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
