const STORAGE_KEYS = {
  config: "topheart-line-app-config",
  appToken: "topheart-line-app-token",
  pendingToken: "topheart-line-pending-token",
  uiPreferences: "topheart-line-app-ui-preferences",
};

const ROLE_LABELS = {
  preacher: "傳道人",
  trainee_preacher: "實習傳道人",
  district_pastor: "區牧",
  district_leader: "區長",
  big_family_leader: "大家長",
  trainee_big_family_leader: "實習大家長",
  small_group_leader: "小家長",
  trainee_small_group_leader: "實習小家長",
  member: "小家人",
  best: "新朋友",
};

const ROLE_ORDER = {
  preacher: 1,
  trainee_preacher: 2,
  district_pastor: 3,
  district_leader: 4,
  big_family_leader: 5,
  trainee_big_family_leader: 6,
  small_group_leader: 7,
  trainee_small_group_leader: 8,
  member: 9,
  best: 10,
};

const ROLE_PERMISSION_TIER = {
  preacher: 1,
  trainee_preacher: 1,
  district_pastor: 2,
  district_leader: 3,
  big_family_leader: 4,
  trainee_big_family_leader: 4,
  small_group_leader: 5,
  trainee_small_group_leader: 5,
  member: 6,
  best: 7,
};

const ORG_SUFFIXES = {
  district: "區",
  big_family: "大家",
  small_group: "小家",
};

const OVERVIEW_LEVEL_ORDER = ["district", "big_family", "small_group"];

const GENDER_LABELS = {
  brother: "弟兄",
  sister: "姊妹",
};

const EQUIPMENT_PROGRESS_LABELS = {
  none: "未裝備",
  growth: "成長班",
  disciple: "門徒班",
  leader: "領袖班",
};

const EQUIPMENT_PROGRESS_ORDER = {
  leader: 1,
  disciple: 2,
  growth: 3,
  none: 4,
};

const STATUS_LABELS = {
  unknown: "待確認",
  present: "出席",
  absent: "未出席",
};

const MIN_ATTENDANCE_DATE = "2025-03-28";
const MIN_ATTENDANCE_WEEK_START = "2025-03-23";
const BIRTHDAY_REMINDER_DAYS = 30;

const LOGIN_ROLES = [
  "preacher",
  "trainee_preacher",
  "district_pastor",
  "district_leader",
  "big_family_leader",
  "trainee_big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
];

const PREACHER_ROLES = ["preacher", "trainee_preacher"];
const DISTRICT_PASTOR_ROLES = ["district_pastor"];
const DISTRICT_LEADER_ROLES = ["district_leader"];
const BIG_FAMILY_LEADER_ROLES = ["big_family_leader", "trainee_big_family_leader"];
const SMALL_GROUP_LEADER_ROLES = [
  "small_group_leader",
  "trainee_small_group_leader",
];

const MEMBER_ROLES = ["member", "best"];
const CREATE_SCOPE_MODES = ["empty", "create", "existing"];

const MANAGEMENT_CREATE_ROLES = [
  "district_leader",
  "big_family_leader",
  "trainee_big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
  "member",
  "best",
];

const ADMIN_CREATE_ROLES = ["preacher", "trainee_preacher", "district_pastor", ...MANAGEMENT_CREATE_ROLES];

const OVERVIEW_ROLES = [
  "preacher",
  "trainee_preacher",
  "district_pastor",
  "district_leader",
  "big_family_leader",
  "trainee_big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
];

const DEFAULT_PROJECT_URL = "https://aiifotwroawqxkcsfjzi.supabase.co";
const NOTE_MAX_LENGTH = 1000;
const LAYOUT_SIZES = ["small", "medium", "large"];
const ORG_TREE_MODES = ["compact", "vertical"];
const ORG_TREE_MIN_SCALE = 0.05;
const ORG_TREE_MAX_SCALE = 1.5;
const V2_API_ACTIONS = new Set([
  "attendance-overview",
  "create-members-batch",
  "dashboard",
  "create-member",
  "delete-invite",
  "save-attendance",
  "move-organization",
  "purge-member",
  "reset-member-line-binding",
  "update-member",
  "update-member-profile",
]);

const INVITE_SORT_OPTIONS = [
  "created_desc",
  "created_asc",
  "role",
  "unused",
];

const TABS = {
  attendance: "attendance",
  overview: "overview",
  profile: "profile",
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
  uiSettingsBackdrop: document.querySelector("#uiSettingsBackdrop"),
  uiSettingsCard: document.querySelector("#uiSettingsCard"),
  closeUiSettingsBtn: document.querySelector("#closeUiSettingsBtn"),
  layoutSizeInputs: document.querySelectorAll('input[name="layoutSize"]'),
  orgTreeDefaultModeInputs: document.querySelectorAll('input[name="orgTreeDefaultMode"]'),
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
  tabProfileBtn: document.querySelector("#tabProfileBtn"),
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
  attendanceReminderBtn: document.querySelector("#attendanceReminderBtn"),
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
  overviewSearchInput: document.querySelector("#overviewSearchInput"),
  overviewWeekScroller: document.querySelector("#overviewWeekScroller"),
  overviewScopeSummary: document.querySelector("#overviewScopeSummary"),
  overviewUnitList: document.querySelector("#overviewUnitList"),
  profileView: document.querySelector("#profileView"),
  profileSearchInput: document.querySelector("#profileSearchInput"),
  profileSummary: document.querySelector("#profileSummary"),
  profileTableBody: document.querySelector("#profileTableBody"),
  profileEditorBackdrop: document.querySelector("#profileEditorBackdrop"),
  profileEditorCard: document.querySelector("#profileEditorCard"),
  profileEditorTitle: document.querySelector("#profileEditorTitle"),
  profileEditorHint: document.querySelector("#profileEditorHint"),
  closeProfileEditorBtn: document.querySelector("#closeProfileEditorBtn"),
  profileForm: document.querySelector("#profileForm"),
  profileBirthdayInput: document.querySelector("#profileBirthdayInput"),
  profilePhoneInput: document.querySelector("#profilePhoneInput"),
  profileAddressInput: document.querySelector("#profileAddressInput"),
  profileNoteInput: document.querySelector("#profileNoteInput"),
  profileSubmitBtn: document.querySelector("#profileSubmitBtn"),
  peopleView: document.querySelector("#peopleView"),
  orgsView: document.querySelector("#orgsView"),
  peopleSearchInput: document.querySelector("#peopleSearchInput"),
  peopleRoleFilter: document.querySelector("#peopleRoleFilter"),
  peopleSummary: document.querySelector("#peopleSummary"),
  bulkMemberBtn: document.querySelector("#bulkMemberBtn"),
  newMemberBtn: document.querySelector("#newMemberBtn"),
  peopleTableBody: document.querySelector("#peopleTableBody"),
  memberEditorBackdrop: document.querySelector("#memberEditorBackdrop"),
  memberEditorCard: document.querySelector("#memberEditorCard"),
  memberEditorTitle: document.querySelector("#memberEditorTitle"),
  memberEditorHint: document.querySelector("#memberEditorHint"),
  closeMemberEditorBtn: document.querySelector("#closeMemberEditorBtn"),
  memberForm: document.querySelector("#memberForm"),
  memberNameInput: document.querySelector("#memberNameInput"),
  memberRoleSelect: document.querySelector("#memberRoleSelect"),
  memberGenderSelect: document.querySelector("#memberGenderSelect"),
  memberEquipmentProgressSelect: document.querySelector("#memberEquipmentProgressSelect"),
  memberDistrictLabel: document.querySelector("#memberDistrictLabel"),
  memberDistrictSelect: document.querySelector("#memberDistrictSelect"),
  memberCreateScopeModeLabel: document.querySelector("#memberCreateScopeModeLabel"),
  memberCreateScopeModeSelect: document.querySelector("#memberCreateScopeModeSelect"),
  memberBigFamilyLabel: document.querySelector("#memberBigFamilyLabel"),
  memberBigFamilySelect: document.querySelector("#memberBigFamilySelect"),
  memberSmallGroupLabel: document.querySelector("#memberSmallGroupLabel"),
  memberSmallGroupSelect: document.querySelector("#memberSmallGroupSelect"),
  memberManagedDistrictWrap: document.querySelector("#memberManagedDistrictWrap"),
  memberManagedDistrictList: document.querySelector("#memberManagedDistrictList"),
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
  bulkCreateScopeModeLabel: document.querySelector("#bulkCreateScopeModeLabel"),
  bulkCreateScopeModeSelect: document.querySelector("#bulkCreateScopeModeSelect"),
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
  orgManagementPanel: document.querySelector(".org-management-panel"),
  orgCreatePanel: document.querySelector(".org-create-panel"),
  districtForm: document.querySelector("#districtForm"),
  districtDetails: document.querySelector("#districtDetails"),
  districtNameInput: document.querySelector("#districtNameInput"),
  districtDescriptionInput: document.querySelector("#districtDescriptionInput"),
  districtSubmitBtn: document.querySelector("#districtSubmitBtn"),
  bigFamilyForm: document.querySelector("#bigFamilyForm"),
  bigFamilyDetails: document.querySelector("#bigFamilyDetails"),
  bigFamilyDistrictSelect: document.querySelector("#bigFamilyDistrictSelect"),
  bigFamilyNameInput: document.querySelector("#bigFamilyNameInput"),
  bigFamilyDescriptionInput: document.querySelector("#bigFamilyDescriptionInput"),
  bigFamilySubmitBtn: document.querySelector("#bigFamilySubmitBtn"),
  smallGroupForm: document.querySelector("#smallGroupForm"),
  smallGroupDetails: document.querySelector("#smallGroupDetails"),
  smallGroupDistrictSelect: document.querySelector("#smallGroupDistrictSelect"),
  smallGroupBigFamilySelect: document.querySelector("#smallGroupBigFamilySelect"),
  smallGroupNameInput: document.querySelector("#smallGroupNameInput"),
  smallGroupDescriptionInput: document.querySelector("#smallGroupDescriptionInput"),
  smallGroupSubmitBtn: document.querySelector("#smallGroupSubmitBtn"),
  orgTreePanel: document.querySelector("#orgTreePanel"),
  orgTreeBody: document.querySelector("#orgTreeBody"),
  orgTreeZoomRange: document.querySelector("#orgTreeZoomRange"),
  orgTreeZoomValue: document.querySelector("#orgTreeZoomValue"),
  orgTreeFitBtn: document.querySelector("#orgTreeFitBtn"),
  orgTreeZoomResetBtn: document.querySelector("#orgTreeZoomResetBtn"),
  captureOrgTreeBtn: document.querySelector("#captureOrgTreeBtn"),
  toggleOrgTreePanelBtn: document.querySelector("#toggleOrgTreePanelBtn"),
  districtSection: document.querySelector("#districtSection"),
  districtSummary: document.querySelector("#districtSummary"),
  districtTableBody: document.querySelector("#districtTableBody"),
  bigFamilySection: document.querySelector("#bigFamilySection"),
  bigFamilySummary: document.querySelector("#bigFamilySummary"),
  bigFamilyTableBody: document.querySelector("#bigFamilyTableBody"),
  smallGroupSection: document.querySelector("#smallGroupSection"),
  smallGroupSummary: document.querySelector("#smallGroupSummary"),
  smallGroupTableBody: document.querySelector("#smallGroupTableBody"),
  orgEditorBackdrop: document.querySelector("#orgEditorBackdrop"),
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
  orgCreateBackdrop: document.querySelector("#orgCreateBackdrop"),
  invitesView: document.querySelector("#invitesView"),
  inviteForm: document.querySelector("#inviteForm"),
  inviteMemberSelect: document.querySelector("#inviteMemberSelect"),
  inviteExpiresInput: document.querySelector("#inviteExpiresInput"),
  inviteSortSelect: document.querySelector("#inviteSortSelect"),
  inviteSubmitBtn: document.querySelector("#inviteSubmitBtn"),
  inviteSummary: document.querySelector("#inviteSummary"),
  latestInviteBox: document.querySelector("#latestInviteBox"),
  latestInviteCode: document.querySelector("#latestInviteCode"),
  latestInviteExpires: document.querySelector("#latestInviteExpires"),
  latestInviteTarget: document.querySelector("#latestInviteTarget"),
  copyLatestInviteBtn: document.querySelector("#copyLatestInviteBtn"),
  inviteTableBody: document.querySelector("#inviteTableBody"),
  reminderSheet: document.querySelector("#reminderSheet"),
  reminderSheetBackdrop: document.querySelector("#reminderSheetBackdrop"),
  reminderSheetTitle: document.querySelector("#reminderSheetTitle"),
  reminderSheetBody: document.querySelector("#reminderSheetBody"),
  closeReminderSheetBtn: document.querySelector("#closeReminderSheetBtn"),
  toast: document.querySelector("#toast"),
};

const state = {
  config: {
    projectUrl: "",
  },
  appToken: null,
  pendingToken: null,
  authNotice: "",
  currentMember: null,
  currentMemberAccessSignature: "",
  pendingProfile: null,
  currentWeek: null,
  attendanceHasExistingRecords: false,
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
    overviewSearch: "",
    overviewHistoryRange: "month",
    settingsOpen: false,
    manageAll: false,
    layoutSize: "medium",
    editorMode: null,
    editingMemberId: null,
    orgEditorMode: null,
    editingOrgId: null,
    orgFocusTarget: null,
    orgTreeMode: "compact",
    orgTreeScale: 1,
    orgTreePanelCollapsed: false,
    orgTreeCollapsedKeys: new Set(),
    profileSearch: "",
    profileEditingMemberId: null,
    peopleSearch: "",
    peopleRole: "",
    peopleOpenGroups: new Set(),
    overviewOpenUnitKey: "",
    overviewOpenStatusKey: "",
    overviewOpenMemberKeys: new Set(),
    reminderSheetContext: "",
    inviteSort: "created_desc",
  },
  bulkMembers: [],
  dirty: false,
  toastTimer: null,
  saveFeedbackTimer: null,
  dashboardCache: new Map(),
  prefetchingWeeks: new Set(),
  reminderHydratingWeeks: new Set(),
};

const tabSwipe = {
  startX: 0,
  startY: 0,
  target: null,
};

const profileCopyState = {
  timer: null,
  copied: false,
};

const orgTreeDrag = {
  pointerId: null,
  startX: 0,
  startY: 0,
  scrollLeft: 0,
  scrollTop: 0,
  isDragging: false,
  suppressClick: false,
};

const orgTreePinch = {
  isActive: false,
  startDistance: 0,
  startScale: 1,
  centerX: 0,
  centerY: 0,
  contentX: 0,
  contentY: 0,
  scrollLeft: 0,
  scrollTop: 0,
};

const orgTreeViewState = {
  needsInitialPlacement: true,
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
  els.closeUiSettingsBtn?.addEventListener("click", closeUiSettings);
  els.uiSettingsBackdrop?.addEventListener("click", closeUiSettings);
  els.manageAllWrap?.addEventListener("click", handleManageAllToggleClick);
  els.layoutSizeInputs?.forEach((input) => {
    input.addEventListener("change", handleLayoutSizeChange);
  });
  els.orgTreeDefaultModeInputs?.forEach((input) => {
    input.addEventListener("change", handleOrgTreeDefaultModeChange);
  });
  els.signOutBtn.addEventListener("click", handleSignOut);
  els.bindForm.addEventListener("submit", handleBindInvite);

  els.tabAttendanceBtn.addEventListener("click", () => switchTab(TABS.attendance));
  els.tabOverviewBtn?.addEventListener("click", () => switchTab(TABS.overview));
  els.tabProfileBtn?.addEventListener("click", () => switchTab(TABS.profile));
  els.tabPeopleBtn.addEventListener("click", () => switchTab(TABS.people));
  els.tabOrgsBtn?.addEventListener("click", () => switchTab(TABS.orgs));
  els.tabInvitesBtn.addEventListener("click", () => switchTab(TABS.invites));
  els.pageShell?.addEventListener("touchstart", handleTabSwipeStart, { passive: true });
  els.pageShell?.addEventListener("touchend", handleTabSwipeEnd, { passive: true });

  els.prevWeekBtn.addEventListener("click", () => handleShiftWeek(-7));
  els.nextWeekBtn.addEventListener("click", () => handleShiftWeek(7));
  els.refreshBtn.addEventListener("click", handleRefreshDashboard);
  els.attendanceReminderBtn?.addEventListener("click", () => openReminderSheet("attendance"));
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
  els.overviewSearchInput?.addEventListener("input", handleOverviewFilters);
  els.overviewWeekScroller?.addEventListener("click", handleOverviewWeekClick);
  els.overviewWeekScroller?.addEventListener("change", handleOverviewDateChange);
  els.overviewUnitList?.addEventListener("click", handleOverviewHistoryRangeClick);
  els.overviewUnitList?.addEventListener("toggle", handleOverviewUnitToggle, true);

  els.profileSearchInput?.addEventListener("input", handleProfileFilters);
  els.profileTableBody?.addEventListener("click", handleProfileTableClick);
  els.profileTableBody?.addEventListener("pointerdown", handleProfileCopyPointerDown);
  els.profileTableBody?.addEventListener("pointerup", clearProfileCopyTimer);
  els.profileTableBody?.addEventListener("pointerleave", clearProfileCopyTimer);
  els.profileTableBody?.addEventListener("pointercancel", clearProfileCopyTimer);
  els.profileTableBody?.addEventListener("contextmenu", handleProfileCopyContextMenu);
  els.closeProfileEditorBtn?.addEventListener("click", closeProfileEditor);
  els.profileEditorBackdrop?.addEventListener("click", closeProfileEditor);
  els.profileForm?.addEventListener("submit", handleSaveMemberProfile);
  els.profileBirthdayInput?.addEventListener("blur", handleProfileBirthdayInputBlur);

  els.peopleSearchInput.addEventListener("input", handlePeopleFilters);
  els.peopleRoleFilter.addEventListener("change", handlePeopleFilters);
  els.bulkMemberBtn?.addEventListener("click", openBulkMemberEditor);
  els.newMemberBtn.addEventListener("click", () => openMemberEditor("create"));
  els.peopleTableBody.addEventListener("click", handlePeopleTableClick);
  els.peopleTableBody.addEventListener("toggle", handlePeopleGroupToggle, true);
  els.closeMemberEditorBtn.addEventListener("click", closeMemberEditor);
  els.memberEditorBackdrop?.addEventListener("click", closeMemberEditor);
  els.closeBulkMemberEditorBtn?.addEventListener("click", closeBulkMemberEditor);

  els.memberForm.addEventListener("submit", handleSaveMember);
  els.memberRoleSelect.addEventListener("change", () => {
    const editingMember = state.ui.editingMemberId
      ? state.adminData.members.find((member) => member.id === state.ui.editingMemberId)
      : null;
    if (state.ui.editorMode === "create") {
      els.memberCreateScopeModeSelect.value = getDefaultCreateScopeMode(els.memberRoleSelect.value);
    }
    populateDistrictOptions(editingMember);
    syncEditorBigFamilyOptions();
    syncEditorSmallGroupOptions();
    syncMemberFormScope();
  });
  els.memberCreateScopeModeSelect?.addEventListener("change", () => {
    els.memberBigFamilySelect.value = "";
    els.memberSmallGroupSelect.value = "";
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
  els.bulkRoleSelect?.addEventListener("change", () => {
    els.bulkCreateScopeModeSelect.value = getDefaultCreateScopeMode(els.bulkRoleSelect.value);
    syncBulkDefaultScope();
  });
  els.bulkCreateScopeModeSelect?.addEventListener("change", () => {
    els.bulkBigFamilySelect.value = "";
    els.bulkSmallGroupSelect.value = "";
    syncBulkDefaultScope();
  });
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
  [els.districtDetails, els.bigFamilyDetails, els.smallGroupDetails]
    .filter(Boolean)
    .forEach((details) => details.addEventListener("toggle", handleCreateOrgDetailsToggle));
  els.orgCreateBackdrop?.addEventListener("click", closeCreateOrgSheets);
  els.districtTableBody.addEventListener("click", handleOrgTableClick);
  els.bigFamilyTableBody.addEventListener("click", handleOrgTableClick);
  els.smallGroupTableBody.addEventListener("click", handleOrgTableClick);
  els.orgTreeZoomRange?.addEventListener("input", () => setOrganizationTreeScale(Number(els.orgTreeZoomRange.value) / 100));
  els.orgTreeFitBtn?.addEventListener("click", fitOrganizationTreeToView);
  els.orgTreeZoomResetBtn?.addEventListener("click", resetOrganizationTreeView);
  els.orgTreeBody?.addEventListener("click", handleOrganizationTreeClick);
  els.orgTreeBody?.addEventListener("keydown", handleOrganizationTreeKeydown);
  els.orgTreeBody?.addEventListener("pointerdown", handleOrganizationTreePointerDown);
  els.orgTreeBody?.addEventListener("pointermove", handleOrganizationTreePointerMove);
  els.orgTreeBody?.addEventListener("pointerup", handleOrganizationTreePointerUp);
  els.orgTreeBody?.addEventListener("pointercancel", handleOrganizationTreePointerUp);
  els.orgTreeBody?.addEventListener("touchstart", handleOrganizationTreeTouchStart, { passive: false });
  els.orgTreeBody?.addEventListener("touchmove", handleOrganizationTreeTouchMove, { passive: false });
  els.orgTreeBody?.addEventListener("touchend", handleOrganizationTreeTouchEnd);
  els.orgTreeBody?.addEventListener("touchcancel", handleOrganizationTreeTouchEnd);
  els.captureOrgTreeBtn?.addEventListener("click", handleCaptureOrganizationTree);
  els.closeOrgEditorBtn.addEventListener("click", closeOrgEditor);
  els.orgEditorBackdrop?.addEventListener("click", closeOrgEditor);
  els.orgEditorForm.addEventListener("submit", handleSaveOrganization);
  els.orgDistrictSelect.addEventListener("change", syncOrgEditorBigFamilyOptions);

  els.inviteForm.addEventListener("submit", handleCreateInvite);
  els.inviteSortSelect?.addEventListener("change", handleInviteSortChange);
  els.inviteTableBody.addEventListener("click", handleInviteTableClick);
  els.copyLatestInviteBtn.addEventListener("click", handleCopyLatestInvite);
  els.closeReminderSheetBtn?.addEventListener("click", closeReminderSheet);
  els.reminderSheetBackdrop?.addEventListener("click", closeReminderSheet);
  els.reminderSheetBody?.addEventListener("click", handleReminderSheetClick);
  window.addEventListener("resize", scheduleOrganizationTreeConnectorSync);

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
  const uiPreferences = loadUiPreferences();
  state.ui.layoutSize = uiPreferences.layoutSize;
  state.ui.overviewUnitType = uiPreferences.overviewUnitType;
  state.ui.inviteSort = uiPreferences.inviteSort;
  state.ui.orgTreeMode = uiPreferences.orgTreeMode;
  state.ui.orgTreeScale = uiPreferences.orgTreeScale;
  els.projectUrlInput.value = state.config.projectUrl || "";
  syncOrgTreeDefaultModeInputs();
  if (els.overviewUnitTypeSelect) {
    els.overviewUnitTypeSelect.value = state.ui.overviewUnitType;
  }
  if (els.inviteSortSelect) {
    els.inviteSortSelect.value = state.ui.inviteSort;
  }
  applyLayoutSize();
  syncWeekControls();
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
      overviewUnitType: ["", "district", "big_family", "small_group"].includes(value.overviewUnitType)
        ? value.overviewUnitType
        : "",
      inviteSort: INVITE_SORT_OPTIONS.includes(value.inviteSort)
        ? value.inviteSort
        : "created_desc",
      orgTreeMode: ORG_TREE_MODES.includes(value.orgTreeMode)
        ? value.orgTreeMode
        : "compact",
      orgTreeScale:
        typeof value.orgTreeScale === "number"
          ? Math.min(ORG_TREE_MAX_SCALE, Math.max(ORG_TREE_MIN_SCALE, value.orgTreeScale))
          : 1,
    };
  } catch (_error) {
    return {
      layoutSize: "medium",
      overviewUnitType: "",
      inviteSort: "created_desc",
      orgTreeMode: "compact",
      orgTreeScale: 1,
    };
  }
}

function saveUiPreferences() {
  window.localStorage.setItem(
    STORAGE_KEYS.uiPreferences,
    JSON.stringify({
      layoutSize: state.ui.layoutSize,
      overviewUnitType: state.ui.overviewUnitType,
      inviteSort: state.ui.inviteSort,
      orgTreeMode: state.ui.orgTreeMode,
      orgTreeScale: state.ui.orgTreeScale,
    }),
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

function syncOrgTreeDefaultModeInputs() {
  els.orgTreeDefaultModeInputs?.forEach((input) => {
    input.checked = input.value === state.ui.orgTreeMode;
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
    state.authNotice = "";
    saveStoredValue(STORAGE_KEYS.appToken, appToken);
    saveStoredValue(STORAGE_KEYS.pendingToken, "");
    needsCleanup = true;
  }

  const pendingToken = hashParams.get("pending_token");
  if (pendingToken) {
    state.pendingToken = pendingToken;
    state.appToken = null;
    state.authNotice =
      hashParams.get("auth_notice") ||
      "請輸入邀請碼完成 LINE 帳號綁定。若你正在使用 iPhone 桌面捷徑，也可以在此畫面重新按 LINE 登入刷新驗證。";
    saveStoredValue(STORAGE_KEYS.pendingToken, pendingToken);
    saveStoredValue(STORAGE_KEYS.appToken, "");
    showToast(state.authNotice, 7000);
    needsCleanup = true;
  }

  const authError =
    hashParams.get("auth_error") || searchParams.get("error_description");
  if (authError) {
    showToast(decodeURIComponent(authError.replaceAll("+", " ")), 7000);
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

function showToast(message, durationMs = 4200) {
  els.toast.textContent = message;
  setHidden(els.toast, false);

  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    setHidden(els.toast, true);
  }, durationMs);
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
  state.authNotice = "";
  state.currentMember = null;
  state.pendingProfile = null;
  state.currentWeek = null;
  state.attendanceHasExistingRecords = false;
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

function closeUiSettings() {
  state.ui.settingsOpen = false;
  renderLayout();
}

async function handleManageAllToggleClick() {
  await setManageAllMode(!state.ui.manageAll);
}

async function setManageAllMode(nextValue) {
  if (state.ui.manageAll === nextValue) {
    return;
  }

  if (!canUseManageAllToggle()) {
    state.ui.manageAll = false;
    syncManageAllToggle();
    return;
  }

  if (!canDiscardDirtyChanges()) {
    syncManageAllToggle();
    return;
  }

  state.ui.manageAll = nextValue;
  state.dashboardCache.clear();
  state.prefetchingWeeks.clear();
  state.adminData = emptyAdminData();
  state.overviewData = null;
  renderLayout();
  await loadDashboard({ skipDirtyCheck: true });
  await loadAdminPanel();
  if (state.ui.activeTab === TABS.overview && canUseOverview()) {
    await loadAttendanceOverview(state.ui.overviewWeekStart);
  }
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

function handleOrgTreeDefaultModeChange(event) {
  const mode = event.target.value;
  if (!ORG_TREE_MODES.includes(mode)) {
    return;
  }

  state.ui.orgTreeMode = mode;
  saveUiPreferences();
  syncOrgTreeDefaultModeInputs();
  syncOrganizationTreeControls();
  if (state.ui.activeTab === TABS.orgs && canUseOrganizationManagement()) {
    renderOrganizationTree();
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
  state.authNotice = "";
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
    state.attendanceHasExistingRecords = false;
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
      const accessChanged = applyCurrentMemberSnapshot(data.current_member);
      state.pendingProfile = null;
      state.authNotice = "";
      state.ui.activeTab = TABS.attendance;
      if (accessChanged) {
        state.ui.manageAll = false;
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
      state.attendanceHasExistingRecords = false;
      state.attendanceAnalytics = emptyAttendanceAnalytics();
      state.adminData = emptyAdminData();
      state.currentMemberAccessSignature = "";
      state.ui.manageAll = false;
      renderLayout();
      return;
    }
  } catch (error) {
    if (!isUnauthorizedApiError(error)) {
      console.error(error);
      showToast(error.message || "讀取登入狀態失敗。");
    }
  }

  state.appToken = null;
  state.pendingToken = null;
  state.authNotice = "";
  state.currentMember = null;
  state.currentMemberAccessSignature = "";
  state.pendingProfile = null;
  state.currentWeek = null;
  state.attendanceHasExistingRecords = false;
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
  setHidden(els.loginCard, isAuthenticated);
  setHidden(els.loginSettingsBtn, true);
  setHidden(els.bindCard, !isPending);
  setHidden(els.userBar, !isAuthenticated);
  setHidden(els.navCard, !isAuthenticated);
  setHidden(els.toggleSettingsBtn, !isAuthenticated);
  setHidden(els.uiSettingsCard, !isAuthenticated || !state.ui.settingsOpen);
  setHidden(els.uiSettingsBackdrop, !isAuthenticated || !state.ui.settingsOpen);
  document.body.classList.toggle("settings-sheet-open", isAuthenticated && state.ui.settingsOpen);

  if (!isAuthenticated) {
    setHidden(els.manageAllWrap, true);
    setHidden(els.uiSettingsCard, true);
    setHidden(els.uiSettingsBackdrop, true);
    document.body.classList.remove("settings-sheet-open");
    setHidden(els.attendanceView, true);
    setHidden(els.overviewView, true);
    setHidden(els.profileView, true);
    setHidden(els.peopleView, true);
    setHidden(els.orgsView, true);
    setHidden(els.invitesView, true);
    setBadge(els.sessionBadge, isPending ? "待綁定" : "尚未登入", isPending ? "warning" : "neutral");
    els.authSummary.textContent = isPending
      ? state.authNotice || "目前已有 LINE 驗證，請輸入邀請碼完成綁定；若此畫面停留太久或你換了瀏覽器，請重新按 LINE 登入。"
      : "請使用 LINE 登入。若這是第一次登入，系統會在下一步引導你輸入邀請碼。";
    syncSignInLink();
    renderPendingProfile();
    return;
  }

  syncManageAllToggle();
  renderTopBar();
  applyLayoutSize();
  renderTabs();
  renderActiveView();
  syncAttendanceFilterVisibility();
  renderAttendanceReminderEntry();
}

function renderTopBar() {
  const effectiveMember = getEffectiveCurrentMember();
  const scope = [
    state.currentMember.district_name,
    state.currentMember.big_family_name,
    state.currentMember.small_group_name,
  ]
    .filter(Boolean)
    .join(" / ");

  const roleLabel = getRoleLabel(state.currentMember.role);
  const nameRoleLabel = isAdminModeActive()
    ? `${roleLabel} / 管理員`
    : roleLabel;
  const viewLabel = state.currentMember.is_admin
    ? `目前視角：${isAdminModeActive() ? "管理員" : roleLabel}`
    : "";
  els.userNameText.textContent = `${state.currentMember.full_name} (${nameRoleLabel})`;
  els.userScopeText.textContent = [scope ? `所屬牧區：${scope}` : "尚未設定牧區", viewLabel]
    .filter(Boolean)
    .join("｜");
  els.userScopeText.title = effectiveMember?.is_admin ? "目前以管理員權限瀏覽" : "目前以原職分權限瀏覽";
  setBadge(
    els.sessionBadge,
    state.currentMember.is_admin ? (isAdminModeActive() ? "管理員" : "身分視角") : "已登入",
    state.currentMember.is_admin ? (isAdminModeActive() ? "success" : "neutral") : "success",
  );
  els.authSummary.textContent = `目前登入：${state.currentMember.full_name}`;
}

function getEffectiveCurrentMember() {
  if (!state.currentMember) {
    return null;
  }
  if (isAdminModeActive()) {
    return state.currentMember;
  }
  return {
    ...state.currentMember,
    is_admin: false,
  };
}

function getMemberAccessSignature(member) {
  if (!member) {
    return "";
  }
  return [
    member.id || "",
    member.role || "",
    member.is_admin ? "admin" : "role",
    member.district_id || "",
    member.big_family_id || "",
    member.small_group_id || "",
    getDistrictPastorDistrictIds(member).sort((a, b) => a - b).join(","),
  ].join("|");
}

function clearScopedDataCaches() {
  state.dashboardCache.clear();
  state.prefetchingWeeks.clear();
  state.adminData = emptyAdminData();
  state.overviewData = null;
}

function applyCurrentMemberSnapshot(member) {
  if (!member) {
    return false;
  }
  const previousMemberId = Number(state.currentMember?.id || 0);
  const previousAccessSignature = state.currentMemberAccessSignature;
  state.currentMember = {
    ...state.currentMember,
    ...member,
  };
  state.currentMemberAccessSignature = getMemberAccessSignature(state.currentMember);
  const accessChanged =
    previousMemberId !== Number(state.currentMember.id || 0) ||
    previousAccessSignature !== state.currentMemberAccessSignature;
  if (accessChanged) {
    state.ui.manageAll = false;
    clearScopedDataCaches();
  }
  if (!state.currentMember.is_admin) {
    state.ui.manageAll = false;
  }
  return accessChanged;
}

function syncCurrentMemberAccess(member) {
  if (!member || Number(member.id || 0) !== Number(state.currentMember?.id || 0)) {
    return false;
  }
  return applyCurrentMemberSnapshot(member);
}

function isAdminModeActive() {
  return Boolean(state.currentMember?.is_admin && state.ui.manageAll);
}

function getAdminModeQueryParam() {
  return isAdminModeActive() ? "true" : "false";
}

function getAdminModeRequestBody() {
  return {
    admin_mode: isAdminModeActive(),
  };
}

function getRealCurrentMember() {
  return state.currentMember;
}

function getPermissionCurrentMember() {
  return getEffectiveCurrentMember();
}

function getVisibleCurrentMemberLabel() {
  const member = getPermissionCurrentMember();
  if (!member) {
    return "未登入";
  }
  return member.is_admin ? "管理員視角" : "身分視角";
}

function getScopeTextForCurrentMember() {
  const scope = [
    state.currentMember?.district_name,
    state.currentMember?.big_family_name,
    state.currentMember?.small_group_name,
  ]
    .filter(Boolean)
    .join(" / ");
  return scope
    ? `所屬牧區：${scope}`
    : "尚未設定牧區";
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
  if (els.manageAllWrap) {
    const active = Boolean(canUse && state.ui.manageAll);
    els.manageAllWrap.textContent = "管理員";
    els.manageAllWrap.setAttribute("aria-pressed", active ? "true" : "false");
    els.manageAllWrap.setAttribute("aria-label", active ? "切換為身分視角" : "切換為管理員視角");
    els.manageAllWrap.title = active
      ? "目前使用管理員全域權限，點擊切換為身分視角"
      : "目前以自己的職分與轄區權限瀏覽，點擊切換為管理員視角";
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

function getCurrentWeekStart() {
  return getMondayIso(new Date());
}

function isFutureWeek(weekStart) {
  return parseIsoDate(getMondayIso(weekStart)).getTime() > parseIsoDate(getCurrentWeekStart()).getTime();
}

function isBeforeMinimumAttendanceWeek(weekStart) {
  return parseIsoDate(getMondayIso(weekStart)).getTime() < parseIsoDate(MIN_ATTENDANCE_WEEK_START).getTime();
}

function clampToAllowedAttendanceWeek(weekStart, options = {}) {
  const normalized = getMondayIso(weekStart || new Date());
  if (isBeforeMinimumAttendanceWeek(normalized)) {
    if (options.showToast) {
      showToast(`不能選擇早於 ${MIN_ATTENDANCE_DATE} 的日期。`);
    }
    return MIN_ATTENDANCE_WEEK_START;
  }
  if (!isFutureWeek(normalized)) {
    return normalized;
  }
  if (options.showToast) {
    showToast("點名頁不能檢視或切換到未來週次。");
  }
  return getCurrentWeekStart();
}

function syncWeekControls() {
  if (!els.weekInput) {
    return;
  }
  const currentWeekStart = getCurrentWeekStart();
  els.weekInput.min = MIN_ATTENDANCE_WEEK_START;
  els.weekInput.max = currentWeekStart;
  const selectedWeek = clampToAllowedAttendanceWeek(els.weekInput.value || currentWeekStart);
  els.weekInput.value = selectedWeek;
  if (els.prevWeekBtn) {
    els.prevWeekBtn.disabled = parseIsoDate(selectedWeek).getTime() <= parseIsoDate(MIN_ATTENDANCE_WEEK_START).getTime();
  }
  if (els.nextWeekBtn) {
    els.nextWeekBtn.disabled = parseIsoDate(selectedWeek).getTime() >= parseIsoDate(currentWeekStart).getTime();
  }
  syncWeekStatusChip();
}

function renderTabs() {
  const canViewOverview = canUseOverview();
  const canViewProfiles = canUseProfileDirectory();
  const canManagePeople = canUseManagement();
  const canManageOrgs = canUseOrganizationManagement();
  const canManageInvites = canUseInvites();
  setHidden(els.tabOverviewBtn, !canViewOverview);
  setHidden(els.tabProfileBtn, !canViewProfiles);
  setHidden(els.tabPeopleBtn, !canManagePeople);
  setHidden(els.tabOrgsBtn, !canManageOrgs);
  setHidden(els.tabInvitesBtn, !canManageInvites);

  if (
    (state.ui.activeTab === TABS.overview && !canViewOverview) ||
    (state.ui.activeTab === TABS.profile && !canViewProfiles) ||
    (state.ui.activeTab === TABS.people && !canManagePeople) ||
    (state.ui.activeTab === TABS.orgs && !canManageOrgs) ||
    (state.ui.activeTab === TABS.invites && !canManageInvites)
  ) {
    state.ui.activeTab = TABS.attendance;
  }

  setTabActive(els.tabAttendanceBtn, state.ui.activeTab === TABS.attendance);
  setTabActive(els.tabOverviewBtn, state.ui.activeTab === TABS.overview);
  setTabActive(els.tabProfileBtn, state.ui.activeTab === TABS.profile);
  setTabActive(els.tabPeopleBtn, state.ui.activeTab === TABS.people);
  setTabActive(els.tabOrgsBtn, state.ui.activeTab === TABS.orgs);
  setTabActive(els.tabInvitesBtn, state.ui.activeTab === TABS.invites);
}

function renderActiveView() {
  setHidden(els.attendanceView, state.ui.activeTab !== TABS.attendance);
  setHidden(els.overviewView, state.ui.activeTab !== TABS.overview || !canUseOverview());
  setHidden(els.profileView, state.ui.activeTab !== TABS.profile || !canUseProfileDirectory());
  setHidden(els.peopleView, state.ui.activeTab !== TABS.people || !canUseManagement());
  setHidden(els.orgsView, state.ui.activeTab !== TABS.orgs || !canUseOrganizationManagement());
  setHidden(els.invitesView, state.ui.activeTab !== TABS.invites || !canUseInvites());
  if (state.ui.activeTab === TABS.orgs && canUseOrganizationManagement()) {
    scheduleOrganizationTreeConnectorSync({
      placeTopCenter: orgTreeViewState.needsInitialPlacement,
    });
  }
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
  if (tabId === TABS.profile) {
    renderProfileDirectory();
  }
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
        ".org-tree-board",
        ".attendance-save-bar",
      ].join(","),
    ),
  );
}

function getVisibleMainTabs() {
  return [
    TABS.attendance,
    canUseOverview() ? TABS.overview : null,
    canUseProfileDirectory() ? TABS.profile : null,
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
    const weekStart = clampToAllowedAttendanceWeek(els.weekInput.value || new Date(), {
      showToast: true,
    });
    els.weekInput.value = weekStart;
    syncWeekControls();

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
  const params = new URLSearchParams({
    week_start: weekStart,
    admin_mode: getAdminModeQueryParam(),
  });
  if (isAdminModeActive()) {
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
  const accessChanged = applyCurrentMemberSnapshot(data.current_member);
  state.currentWeek = normalizeWeek(data.week, weekStart);
  els.weekInput.value = state.currentWeek?.week_start_date || weekStart;
  state.attendanceHasExistingRecords = Boolean(data.attendance_has_existing_records);
  state.attendanceAnalytics = normalizeAttendanceAnalytics(data.analytics);
  state.roster = sortMembers((data.roster || []).map(enrichRosterMember));
  if (accessChanged) {
    renderLayout();
  }
  captureAttendanceBaseline();
  populateAttendanceRoleFilter();
  renderAttendanceHeader();
  renderWeekSummary();
  syncAttendanceFilterVisibility();
  renderAttendanceRows();
  renderAttendanceReminderEntry();
  syncWeekControls();
  hydrateAttendanceReminderHistory(weekStart);
}

async function hydrateAttendanceReminderHistory(weekStart) {
  if (
    !canUseOverview() ||
    !state.roster.length ||
    state.roster.some(hasMemberReminderHistory) ||
    state.reminderHydratingWeeks.has(weekStart)
  ) {
    return;
  }

  state.reminderHydratingWeeks.add(weekStart);
  try {
    await loadAttendanceOverview(weekStart);
    renderAttendanceReminderEntry();
    refreshReminderSheetIfOpen();
  } catch (error) {
    console.warn("Unable to hydrate attendance reminders", error);
  } finally {
    state.reminderHydratingWeeks.delete(weekStart);
  }
}

function getDashboardCacheKey(weekStart) {
  return `${weekStart || ""}:${isAdminModeActive() ? "admin" : "role"}:${state.currentMemberAccessSignature || ""}`;
}

function prefetchAdjacentWeeks(weekStart) {
  for (const dayDelta of [-7, 7]) {
    const target = parseIsoDate(weekStart);
    target.setDate(target.getDate() + dayDelta);
    const targetWeek = getMondayIso(target);
    if (isFutureWeek(targetWeek) || isBeforeMinimumAttendanceWeek(targetWeek)) {
      continue;
    }
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
    note_carry_forward: member.note_carry_forward === true,
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
    note_carry_forward: member.note_carry_forward === true,
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
        <span class="info-value">${escapeHtml(getRoleLabel(state.currentMember.role))}${state.currentMember.is_admin ? ` / ${escapeHtml(getVisibleCurrentMemberLabel())}` : ""}</span>
      </div>
      <div class="info-item">
        <span class="info-label">管轄範圍</span>
        <span class="info-value">${escapeHtml(scope || "未設定")}</span>
      </div>
      <div class="info-item attendance-scope-mode-info">
        <span class="info-label">顯示範圍</span>
        <span class="info-value">${escapeHtml(getAttendanceScopeModeLabel())}</span>
      </div>
      <div class="info-item attendance-week-info">
        <span class="info-label">週次</span>
        <span class="info-value">${escapeHtml(getDisplayedWeekLabel())}</span>
      </div>
    </div>
  `;

  els.attendanceSaveWeek.textContent = getDisplayedWeekLabel();
  els.attendanceView?.classList.toggle("is-dirty", Boolean(state.dirty));
  syncWeekStatusChip();
}

function getAttendanceScopeModeLabel() {
  if (!canUseManageAllToggle()) {
    return "依職分權限";
  }
  return isAdminModeActive() ? "管理員全域" : `${getRoleLabel(state.currentMember.role)}視角`;
}

function renderWeekSummary() {
  const attendanceRateRoster = state.roster.filter(isAttendanceRateMember);
  const visibleCount = attendanceRateRoster.length;
  const pendingCount = attendanceRateRoster.filter(hasPendingAttendance).length;
  const completedCount = Math.max(visibleCount - pendingCount, 0);
  const completedRate = formatAttendanceSummaryRate(completedCount, visibleCount);
  const sundayPresentCount = countStatus("sunday_service", "present", attendanceRateRoster);
  const fellowshipPresentCount = countStatus(
    "small_group_fellowship",
    "present",
    attendanceRateRoster,
  );

  els.weekSummary.innerHTML = `
    <div class="summary-item">
      <span class="info-label">計算人數</span>
      <strong>${visibleCount}</strong>
    </div>
    <div class="summary-item attendance-completion-summary">
      <span class="info-label">完成率</span>
      <strong>${completedCount} / ${completedRate}</strong>
    </div>
    <div class="summary-item">
      <span class="info-label">主日</span>
      <strong>${sundayPresentCount} / ${formatAttendanceSummaryRate(sundayPresentCount, visibleCount)}</strong>
    </div>
    <div class="summary-item">
      <span class="info-label">小家</span>
      <strong>${fellowshipPresentCount} / ${formatAttendanceSummaryRate(fellowshipPresentCount, visibleCount)}</strong>
    </div>
  `;
}

function isAttendanceRateMember(member) {
  return member?.role !== "best";
}

function formatAttendanceSummaryRate(numerator, denominator) {
  return denominator ? formatPercent(numerator, denominator) : "不計";
}

function renderAttendanceReminderEntry() {
  if (!els.attendanceReminderBtn) {
    return;
  }

  const reminders = buildAttendanceReminders();
  const todayBirthdayCount = reminders.filter((item) => item.type === "birthday" && item.daysUntil === 0).length;
  const totalCount = reminders.length;
  const label = todayBirthdayCount
    ? `今日生日 ${todayBirthdayCount}`
    : totalCount
      ? `本週提醒 ${totalCount}`
      : "本週提醒";
  els.attendanceReminderBtn.textContent = label;
  els.attendanceReminderBtn.classList.toggle("has-reminders", false);
  els.attendanceReminderBtn.classList.toggle("is-empty", totalCount === 0);
  setHidden(els.attendanceReminderBtn, !state.roster.length);
}

function getTodayIso() {
  return formatDate(new Date());
}

function normalizeBirthday(value) {
  const birthday = String(value || "").trim();
  const match = birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  return { year, month, day };
}

function getBirthdayReminder(member, anchorIso = getTodayIso()) {
  const birthday = normalizeBirthday(member?.birthday);
  if (!birthday) {
    return null;
  }

  const anchor = parseIsoDate(anchorIso);
  const birthdayThisYear = new Date(anchor.getFullYear(), birthday.month - 1, birthday.day);
  const nextBirthday = birthdayThisYear.getTime() < stripTime(anchor).getTime()
    ? new Date(anchor.getFullYear() + 1, birthday.month - 1, birthday.day)
    : birthdayThisYear;
  const daysUntil = Math.round((stripTime(nextBirthday).getTime() - stripTime(anchor).getTime()) / 86400000);
  if (daysUntil < 0 || daysUntil > BIRTHDAY_REMINDER_DAYS) {
    return null;
  }

  const turnsAge = nextBirthday.getFullYear() - birthday.year;
  const dateLabel = `${birthday.month}/${birthday.day}`;
  const distanceLabel = daysUntil === 0 ? "今天" : `${daysUntil}天後`;
  return {
    type: "birthday",
    tone: daysUntil === 0 ? "birthday-today" : "birthday",
    label: daysUntil === 0 ? "今日生日" : `${daysUntil}天後生日`,
    detail: `生日｜${dateLabel}｜${distanceLabel}｜${turnsAge}歲`,
    panelDetail: `${dateLabel}｜${distanceLabel}`,
    dateLabel,
    daysUntil,
    age: turnsAge,
  };
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getHighPriorityNoteReminder(member) {
  if (!member?.note_priority_high || !String(member.note || "").trim()) {
    return null;
  }
  return {
    type: "note",
    tone: "danger",
    label: "高優先備註",
    detail: `高優先備註：${String(member.note || "").trim()}`,
    panelDetail: String(member.note || "").trim(),
  };
}

function buildAttendanceReminders() {
  return (state.roster || [])
    .flatMap((member) => buildMemberReminders(member, "attendance"))
    .sort(sortReminderItems);
}

function buildOverviewReminders() {
  if (!state.overviewData) {
    return [];
  }

  const eventType = state.ui.overviewEvent;
  const memberByKey = new Map();
  const units = getReminderOverviewUnits();
  for (const unit of units) {
    const detail = unit.detail?.[eventType] || {};
    for (const status of ["present", "absent", "unknown"]) {
      for (const member of detail[status] || []) {
        const key = getOverviewMemberKey(member);
        if (!memberByKey.has(key)) {
          const level = unit.level || unit.type;
          memberByKey.set(key, {
            ...member,
            reminderUnitName: unit.name,
            reminderUnitLevel: level,
            reminderParentName: unit.parent_name || "",
            reminderUnitKey: getOverviewUnitKey(unit),
            reminderStatus: status,
          });
        }
      }
    }
  }

  return Array.from(memberByKey.values())
    .flatMap((member) => buildMemberReminders(member, "overview"))
    .sort(sortReminderItems);
}

function buildMemberReminders(member, context = "overview") {
  const reminders = [
    getBirthdayReminder(member),
    context === "attendance" ? getDashboardAttendanceReminder(member) : getOverviewAttendanceReminder(member),
    getHighPriorityNoteReminder(member),
  ].filter(Boolean);

  return reminders.map((reminder) => ({
    ...reminder,
    memberId: member.id,
    memberKey: getOverviewMemberKey(member),
    unitKey: member.reminderUnitKey || "",
    statusKey: member.reminderStatus || "",
    fullName: member.full_name,
    role: member.role,
    gender: member.gender || "",
    equipmentProgress: normalizeEquipmentProgress(member.equipment_progress),
    unitLevel: member.reminderUnitLevel || "",
    parentName: member.reminderParentName || "",
    scope: member.reminderUnitName || getNearestMemberScopeLabel(member),
  }));
}

function getReminderOverviewUnits() {
  const units = getFilteredOverviewUnits(state.overviewData?.units || []);
  if (state.ui.overviewUnitType) {
    return units;
  }

  const levelPreference = { small_group: 1, big_family: 2, district: 3 };
  return [...units].sort((left, right) => {
    const leftLevel = left.level || left.type;
    const rightLevel = right.level || right.type;
    return (levelPreference[leftLevel] || 9) - (levelPreference[rightLevel] || 9);
  });
}

function sortReminderItems(left, right) {
  const typeOrder = { birthday: 1, attendance: 2, note: 3 };
  const leftType = typeOrder[left.type] || 9;
  const rightType = typeOrder[right.type] || 9;
  if (leftType !== rightType) {
    return leftType - rightType;
  }
  if (left.type === "birthday" && right.type === "birthday") {
    return Number(left.daysUntil || 0) - Number(right.daysUntil || 0);
  }
  return String(left.fullName || "").localeCompare(String(right.fullName || ""), "zh-Hant");
}

function openReminderSheet(context) {
  const reminders = context === "overview" ? buildOverviewReminders() : buildAttendanceReminders();
  state.ui.reminderSheetContext = context;
  renderReminderSheet(context, reminders);
  setHidden(els.reminderSheetBackdrop, false);
  setHidden(els.reminderSheet, false);
  document.body.classList.add("reminder-sheet-open");
}

function closeReminderSheet() {
  state.ui.reminderSheetContext = "";
  setHidden(els.reminderSheetBackdrop, true);
  setHidden(els.reminderSheet, true);
  document.body.classList.remove("reminder-sheet-open");
}

function refreshReminderSheetIfOpen() {
  if (!state.ui.reminderSheetContext || els.reminderSheet?.classList.contains("hidden")) {
    return;
  }
  const context = state.ui.reminderSheetContext;
  const reminders = context === "overview" ? buildOverviewReminders() : buildAttendanceReminders();
  renderReminderSheet(context, reminders);
}

function renderReminderSheet(context, reminders) {
  if (!els.reminderSheetBody || !els.reminderSheetTitle) {
    return;
  }

  els.reminderSheetTitle.textContent = context === "overview" ? "出席總覽提醒" : "本週提醒";
  if (!reminders.length) {
    els.reminderSheetBody.innerHTML = `
      <div class="reminder-empty-state">
        <span class="reminder-empty-icon">OK</span>
        <strong>目前沒有需要提醒的項目</strong>
        <span>生日可在個人資料分頁中填寫；高優先備註會在儲存點名後納入提醒。</span>
      </div>
    `;
    return;
  }

  const groups = [
    { key: "birthday", label: "生日" },
    { key: "attendance", label: "出席關注" },
    { key: "note", label: "高優先備註" },
  ];
  els.reminderSheetBody.innerHTML = groups
    .map((group) => {
      const items = reminders.filter((item) => item.type === group.key);
      if (!items.length) {
        return "";
      }
      return `
        <section class="reminder-group">
          <div class="reminder-group-title">
            <strong>${escapeHtml(group.label)}</strong>
            <span>${items.length}</span>
          </div>
          <div class="reminder-list">
            ${items.map((item) => renderReminderItem(context, item)).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderReminderItem(context, item) {
  const equipmentBadge = item.equipmentProgress && item.equipmentProgress !== "none"
    ? renderEquipmentProgressBadge(item.equipmentProgress)
    : "";
  return `
    <button
      type="button"
      class="reminder-item ${escapeHtml(item.tone)}"
      data-reminder-target="${escapeHtml(context)}"
      data-member-id="${escapeHtml(item.memberId || "")}"
      data-member-key="${escapeHtml(item.memberKey || "")}"
      data-unit-key="${escapeHtml(item.unitKey || "")}"
      data-status-key="${escapeHtml(item.statusKey || "")}"
    >
      <span class="reminder-item-main">
        <span class="reminder-member-line">
          <span class="name-card gender-${escapeHtml(item.gender || "unknown")}">${escapeHtml(item.fullName || "未命名")}</span>
          <span class="role-pill role-${escapeHtml(item.role)}">${escapeHtml(getRoleLabel(item.role))}</span>
          ${equipmentBadge}
        </span>
        <span class="reminder-scope-line">${escapeHtml(formatReminderItemScope(item))}</span>
      </span>
      <span class="reminder-item-meta">
        <span class="overview-alert-badge ${escapeHtml(item.tone)}">${escapeHtml(item.label)}</span>
        <span>${escapeHtml(item.panelDetail || item.detail || "")}</span>
      </span>
    </button>
  `;
}

function formatReminderItemScope(item) {
  if (!item.scope) {
    return "未設定轄區";
  }
  return item.scope;
}

function getNearestMemberScopeLabel(member) {
  if (member?.small_group_name) {
    return member.small_group_name;
  }
  if (member?.big_family_name) {
    return member.big_family_name;
  }
  if (member?.district_name) {
    return member.district_name;
  }
  return "";
}

function handleReminderSheetClick(event) {
  const item = event.target.closest("[data-reminder-target]");
  if (!item) {
    return;
  }

  const context = item.dataset.reminderTarget;
  closeReminderSheet();
  if (context === "overview") {
    window.requestAnimationFrame(() => focusOverviewReminderMember(
      item.dataset.memberKey || "",
      item.dataset.unitKey || "",
      item.dataset.statusKey || "",
    ));
  } else {
    window.requestAnimationFrame(() => focusAttendanceReminderMember(Number(item.dataset.memberId || 0)));
  }
}

function focusAttendanceReminderMember(memberId) {
  let card = els.rosterTableBody?.querySelector(`[data-attendance-member-id="${escapeCssIdentifier(memberId)}"]`);
  if (!card) {
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
    renderAttendanceRows();
    card = els.rosterTableBody?.querySelector(`[data-attendance-member-id="${escapeCssIdentifier(memberId)}"]`);
  }
  if (!card) {
    return;
  }
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.classList.add("is-reminder-focused");
  window.setTimeout(() => card.classList.remove("is-reminder-focused"), 1600);
}

function focusOverviewReminderMember(memberKey, unitKey = "", statusKey = "") {
  if (!memberKey) {
    return;
  }
  state.ui.overviewOpenMemberKeys = new Set([memberKey]);
  state.ui.overviewOpenUnitKey = unitKey || "";
  state.ui.overviewOpenStatusKey = unitKey && statusKey ? `${unitKey}:${statusKey}` : "";
  renderOverviewUnits();
  window.requestAnimationFrame(() => {
    const unitScope = unitKey
      ? els.overviewUnitList?.querySelector(`[data-overview-unit-key="${escapeCssIdentifier(unitKey)}"]`)
      : els.overviewUnitList;
    if (!unitScope) {
      return;
    }
    if (unitScope.matches?.(".overview-unit-details")) {
      unitScope.open = true;
    }

    const statusScope = statusKey
      ? unitScope.querySelector(`.overview-status-details[data-overview-status="${escapeCssIdentifier(statusKey)}"]`)
      : unitScope;
    if (!statusScope) {
      return;
    }
    if (statusScope.matches?.(".overview-status-details")) {
      statusScope.open = true;
    }

    const details = statusScope.querySelector(`[data-overview-member-key="${escapeCssIdentifier(memberKey)}"]`);
    if (!details) {
      return;
    }
    details.open = true;
    details.scrollIntoView({ behavior: "smooth", block: "center" });
    details.classList.add("is-reminder-focused");
    window.setTimeout(() => details.classList.remove("is-reminder-focused"), 1600);
  });
}

function renderAnalyticsSummaryCard(label, stats) {
  const breakdown = formatAnalyticsBreakdown(stats);
  return `
    <div class="summary-item">
      <span class="info-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(formatAnalyticsRate(stats))}</strong>
      ${breakdown ? `<span class="summary-subtext">${escapeHtml(breakdown)}</span>` : ""}
    </div>
  `;
}

function renderNonZeroSummaryItem(label, parts) {
  const visibleParts = parts.filter((part) => Number(part.value || 0) !== 0);
  return `
    <div class="summary-item">
      <span class="info-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(
        visibleParts.length
          ? visibleParts.map((part) => `${part.label} ${part.value}`).join(" / ")
          : "0",
      )}</strong>
    </div>
  `;
}

function formatAnalyticsRate(stats) {
  if (!stats?.confirmed_count) {
    return "尚無資料";
  }

  return formatPercent(stats.present_count || 0, stats.confirmed_count);
}

function formatCompletionRate(stats, expectedFallback = 0) {
  const expectedCount = Number(stats?.expected_count ?? expectedFallback);
  if (!expectedCount) {
    return "尚無資料";
  }

  return formatPercent(stats?.confirmed_count || 0, expectedCount);
}

function formatAnalyticsBreakdown(stats) {
  if (!stats) {
    return "尚無歷史資料";
  }

  if (stats.confirmed_count) {
    return formatNonZeroParts([
      { label: "出席", value: stats.present_count || 0 },
    ]);
  }

  if (stats.unknown_count) {
    return `待確認 ${stats.unknown_count}`;
  }

  return "尚無歷史資料";
}

function formatNonZeroParts(parts, suffix = "") {
  return parts
    .filter((part) => Number(part.value || 0) !== 0)
    .map((part) => `${part.label} ${part.value}${suffix}`)
    .join(" / ");
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
      const noteCarryChecked = member.note_carry_forward === true ? "checked" : "";
      const notePriorityChecked = member.note_priority_high ? "checked" : "";
      const notePriorityDisabled = member.note.trim() && member.can_edit_note ? "" : "disabled";
      const readonlyBadge = member.can_edit_attendance
        ? ""
        : '<span class="status-chip neutral">僅檢視</span>';
      const shouldOpenNote = window.matchMedia("(min-width: 961px)").matches;

      const equipmentClass = escapeHtml(getEquipmentProgressClass(member.equipment_progress));
      return `
        ${groupHeader}
        <article class="attendance-card equipment-surface ${equipmentClass}${member.can_edit_attendance ? "" : " is-readonly"}${member.note_priority_high ? " has-priority-note" : ""}${member.is_self ? " is-self" : ""}" data-attendance-member-id="${member.id}">
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

          <details class="attendance-note-details${member.note.trim() ? " is-filled" : ""}"${shouldOpenNote ? " open" : ""}>
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
  const viewer = getPermissionCurrentMember();
  if (!viewer || (canUseManageAllToggle() && !isAdminModeActive())) {
    return false;
  }

  return Boolean(
    viewer.is_admin ||
      ["preacher", "trainee_preacher", "district_pastor", "district_leader", "big_family_leader", "trainee_big_family_leader"].includes(
        viewer.role,
      ),
  );
}

function getAttendanceGroupLabel(member) {
  if (!shouldGroupAttendanceRows()) {
    return "";
  }

  const viewer = getPermissionCurrentMember();
  if (viewer?.is_admin || PREACHER_ROLES.includes(viewer?.role) || DISTRICT_PASTOR_ROLES.includes(viewer?.role)) {
    return member.district_name || (PREACHER_ROLES.includes(member.role) ? getRoleLabel(member.role) : "其他");
  }

  if (DISTRICT_LEADER_ROLES.includes(viewer?.role)) {
    return member.big_family_name || member.small_group_name || "未設定大家 / 小家";
  }

  if (BIG_FAMILY_LEADER_ROLES.includes(viewer?.role)) {
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

function countStatus(eventType, status, members = state.roster) {
  return members.filter(
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
  const weekStart = clampToAllowedAttendanceWeek(current, { showToast: dayDelta > 0 });
  els.weekInput.value = weekStart;
  syncWeekControls();
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

  const weekStart = clampToAllowedAttendanceWeek(els.weekInput.value || new Date(), {
    showToast: true,
  });
  els.weekInput.value = weekStart;
  syncWeekControls();
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
  renderAttendanceReminderEntry();
  refreshReminderSheetIfOpen();
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
      note_carry_forward: member.note_carry_forward === true,
      note_priority_high: Boolean(member.note.trim() && member.note_priority_high),
    }));

  if (!entries.length) {
    showToast("目前沒有可儲存的內容。");
    return;
  }

  if (shouldConfirmInitialSmallGroupAttendanceSave()) {
    const confirmed = window.confirm("本週仍有尚未確認出席狀態的人員。\n\n是否仍要送出？");
    if (!confirmed) {
      return;
    }
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
        ...getAdminModeRequestBody(),
        manage_all: isAdminModeActive(),
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

function shouldConfirmInitialSmallGroupAttendanceSave() {
  const viewer = getPermissionCurrentMember();
  if (
    !viewer ||
    !SMALL_GROUP_LEADER_ROLES.includes(viewer.role) ||
    state.attendanceHasExistingRecords
  ) {
    return false;
  }

  return state.roster.some(
    (member) =>
      isAttendanceRateMember(member) &&
      member.can_edit_attendance &&
      (
        getAttendanceStatus(member, "sunday_service") === "unknown" ||
        getAttendanceStatus(member, "small_group_fellowship") === "unknown"
      ),
  );
}

function formatMemberScopeSummary(member) {
  const viewer = getPermissionCurrentMember();
  if (!viewer) {
    return "";
  }

  if (viewer.is_admin || PREACHER_ROLES.includes(viewer.role) || DISTRICT_PASTOR_ROLES.includes(viewer.role)) {
    return [member.district_name, member.big_family_name, member.small_group_name]
      .filter(Boolean)
      .join(" / ");
  }

  if (DISTRICT_LEADER_ROLES.includes(viewer.role)) {
    return [member.big_family_name, member.small_group_name]
      .filter(Boolean)
      .join(" / ");
  }

  if (BIG_FAMILY_LEADER_ROLES.includes(viewer.role)) {
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

function normalizeBirthdayInputValue(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }

  const compactMatch = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
  const separatedMatch = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  const match = compactMatch || separatedMatch;
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    year < 1900 ||
    year > new Date().getFullYear() ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return formatDate(date);
}

function renderGenderBadge(gender) {
  if (!gender) {
    return "";
  }

  return `<span class="gender-badge ${gender}">${escapeHtml(
    getGenderLabel(gender),
  )}</span>`;
}

function renderProfileDirectory() {
  if (!els.profileView) {
    return;
  }

  if (!canUseProfileDirectory()) {
    setHidden(els.profileView, true);
    closeProfileEditor();
    return;
  }

  const members = getFilteredProfileMembers();
  const activeCount = members.filter((member) => member.is_active !== false).length;
  els.profileSummary.textContent = members.length
    ? `共 ${members.length} 人${activeCount !== members.length ? `，啟用 ${activeCount} 人` : ""}`
    : "目前沒有可檢視的個人資料";

  els.profileTableBody.innerHTML = members.length
    ? members.map(renderProfileCard).join("")
    : '<div class="empty-state-card">目前沒有符合條件的人員。</div>';

  if (
    state.ui.profileEditingMemberId &&
    !state.adminData.members.some((member) => member.id === state.ui.profileEditingMemberId)
  ) {
    closeProfileEditor();
  }
}

function getFilteredProfileMembers() {
  const query = state.ui.profileSearch.trim().toLowerCase();
  return state.adminData.members
    .filter((member) => canEditProfile(member))
    .filter((member) => !query || getProfileSearchText(member).includes(query));
}

function getProfileSearchText(member) {
  return [
    member.full_name,
    member.phone,
    member.address,
    member.profile_note,
    member.district_name,
    member.big_family_name,
    member.small_group_name,
    getRoleLabel(member.role),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function renderProfileCard(member) {
  const path = formatPeopleScopeSummary(member);
  const birthday = formatProfileBirthday(member.birthday);
  const phone = formatProfileValue(member.phone);
  const address = formatProfileValue(member.address);
  const profileNote = formatProfileValue(member.profile_note);
  return `
    <article class="profile-card${member.is_active ? "" : " is-inactive"}" data-profile-member-id="${member.id}">
      <div class="profile-card-head">
        <div>
          <div class="profile-member-line">
            <strong class="name-card gender-${escapeHtml(member.gender || "unknown")}">${escapeHtml(member.full_name)}</strong>
            <span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span>
          </div>
          ${path ? `<div class="muted small-text">${escapeHtml(path)}</div>` : ""}
        </div>
        <span class="status-chip ${member.is_active ? "success" : "neutral"}">${member.is_active ? "啟用" : "封存"}</span>
      </div>
      <div class="profile-field-grid">
        ${renderProfileField("生日", birthday, member.birthday)}
        ${renderProfileField("電話", phone, member.phone)}
        ${renderProfileField("住址", address, member.address)}
        <div class="profile-field profile-note-field">
          <span class="info-label">記錄</span>
          <strong>${escapeHtml(profileNote)}</strong>
        </div>
      </div>
    </article>
  `;
}

function renderProfileField(label, displayValue, rawValue) {
  const canCopy = Boolean(String(rawValue || "").trim());
  return `
    <button
      type="button"
      class="profile-field ${canCopy ? "is-copyable" : ""}"
      ${canCopy ? `data-profile-copy="${escapeHtml(String(rawValue).trim())}" data-copy-label="${escapeHtml(label)}"` : ""}
      aria-label="${escapeHtml(canCopy ? `長按複製${label}` : `${label}尚未填寫`)}"
    >
      <span class="info-label">${escapeHtml(label)}</span>
      <strong>${escapeHtml(displayValue)}</strong>
    </button>
  `;
}

function formatProfileValue(value) {
  return String(value || "").trim() || "未填寫";
}

function formatProfileBirthday(value) {
  const birthday = normalizeBirthday(value);
  return birthday ? `${birthday.month}/${birthday.day}` : "未填寫";
}

function handleProfileFilters() {
  state.ui.profileSearch = els.profileSearchInput?.value || "";
  renderProfileDirectory();
}

function handleProfileTableClick(event) {
  if (profileCopyState.copied) {
    event.preventDefault();
    profileCopyState.copied = false;
    return;
  }
  if (event.target.closest("[data-profile-copy]")) {
    return;
  }
  const card = event.target.closest("[data-profile-member-id]");
  if (!card) {
    return;
  }
  openProfileEditor(Number(card.dataset.profileMemberId || 0));
}

function handleProfileCopyPointerDown(event) {
  const copyTarget = event.target.closest("[data-profile-copy]");
  if (!copyTarget) {
    return;
  }
  clearProfileCopyTimer();
  profileCopyState.copied = false;
  profileCopyState.timer = window.setTimeout(async () => {
    const text = copyTarget.dataset.profileCopy || "";
    const label = copyTarget.dataset.copyLabel || "資料";
    const copied = await copyTextToClipboard(text);
    profileCopyState.copied = copied;
    showToast(copied ? `已複製${label}。` : `無法複製${label}。`);
  }, 600);
}

function clearProfileCopyTimer() {
  if (profileCopyState.timer) {
    window.clearTimeout(profileCopyState.timer);
    profileCopyState.timer = null;
  }
}

async function handleProfileCopyContextMenu(event) {
  const copyTarget = event.target.closest("[data-profile-copy]");
  if (!copyTarget) {
    return;
  }
  event.preventDefault();
  clearProfileCopyTimer();
  const copied = await copyTextToClipboard(copyTarget.dataset.profileCopy || "");
  profileCopyState.copied = copied;
  showToast(copied ? `已複製${copyTarget.dataset.copyLabel || "資料"}。` : "複製失敗。");
}

function openProfileEditor(memberId) {
  const member = state.adminData.members.find((item) => Number(item.id) === Number(memberId));
  if (!member || !canEditProfile(member)) {
    showToast("沒有權限編輯這位人員的個人資料。");
    return;
  }

  state.ui.profileEditingMemberId = member.id;
  els.profileEditorTitle.textContent = `編輯：${member.full_name}`;
  els.profileEditorHint.textContent = `${getRoleLabel(member.role)}${formatPeopleScopeSummary(member) ? ` / ${formatPeopleScopeSummary(member)}` : ""}`;
  els.profileBirthdayInput.value = member.birthday ? String(member.birthday).slice(0, 10) : "";
  els.profilePhoneInput.value = member.phone || "";
  els.profileAddressInput.value = member.address || "";
  els.profileNoteInput.value = member.profile_note || "";
  setHidden(els.profileEditorBackdrop, false);
  setHidden(els.profileEditorCard, false);
  requestAnimationFrame(() => {
    els.profileBirthdayInput.focus({ preventScroll: true });
  });
}

function closeProfileEditor() {
  state.ui.profileEditingMemberId = null;
  els.profileForm?.reset();
  setHidden(els.profileEditorBackdrop, true);
  setHidden(els.profileEditorCard, true);
}

function handleProfileBirthdayInputBlur() {
  const value = els.profileBirthdayInput.value.trim();
  if (!value) {
    return;
  }
  const normalized = normalizeBirthdayInputValue(value);
  if (normalized) {
    els.profileBirthdayInput.value = normalized;
  }
}

async function handleSaveMemberProfile(event) {
  event.preventDefault();
  const memberId = Number(state.ui.profileEditingMemberId || 0);
  const member = state.adminData.members.find((item) => Number(item.id) === memberId);
  if (!member || !canEditProfile(member)) {
    showToast("沒有權限儲存這位人員的個人資料。");
    return;
  }

  const birthdayInput = els.profileBirthdayInput.value.trim();
  const normalizedBirthday = normalizeBirthdayInputValue(birthdayInput);
  if (birthdayInput && !normalizedBirthday) {
    showToast("生日格式請輸入西元年月日，例如 19900524 或 1990-05-24。");
    return;
  }

  setButtonLoading(els.profileSubmitBtn, true, "儲存中...");
  try {
    await apiRequest("update-member-profile", {
      method: "POST",
      authMode: "app",
      body: {
        ...getAdminModeRequestBody(),
        member_id: memberId,
        birthday: normalizedBirthday,
        phone: els.profilePhoneInput.value.trim(),
        address: els.profileAddressInput.value.trim(),
        profile_note: els.profileNoteInput.value.trim(),
      },
    });
    closeProfileEditor();
    await Promise.all([loadAdminPanel(), loadDashboard({ skipDirtyCheck: true })]);
    showToast("個人資料已更新。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "儲存個人資料失敗。");
  } finally {
    setButtonLoading(els.profileSubmitBtn, false);
  }
}

async function loadAdminPanel() {
  if (!canUseManagement()) {
    state.adminData = emptyAdminData();
    closeMemberEditor();
    closeProfileEditor();
    renderProfileDirectory();
    renderManagement();
    renderInvites();
    return;
  }

  try {
    const params = new URLSearchParams({ admin_mode: getAdminModeQueryParam() });
    const data = await apiRequest(`admin-overview&${params.toString()}`, {
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
    renderProfileDirectory();
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
    const targetWeek = clampToAllowedAttendanceWeek(
      weekStart || state.ui.overviewWeekStart || els.weekInput.value || getMondayIso(new Date()),
      { showToast: Boolean(weekStart) },
    );
    const params = new URLSearchParams({
      week_start: targetWeek,
      admin_mode: getAdminModeQueryParam(),
    });
    const data = await apiRequest(
      `attendance-overview&${params.toString()}`,
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
    units: normalizeOverviewEquipmentProgress(data?.units || []),
  };
}

function normalizeOverviewEquipmentProgress(units) {
  const progressByMemberId = new Map();
  const progressByMemberName = new Map();
  [...(state.roster || []), ...(state.adminData?.members || [])].forEach((member) => {
    const progress = normalizeEquipmentProgress(member.equipment_progress);
    if (member.id) {
      progressByMemberId.set(Number(member.id), progress);
    }
    if (member.full_name) {
      progressByMemberName.set(member.full_name, progress);
    }
  });

  return units.map((unit) => ({
    ...unit,
    detail: Object.fromEntries(
      Object.entries(unit.detail || {}).map(([eventType, detail]) => [
        eventType,
        normalizeOverviewDetailEquipmentProgress(
          detail,
          progressByMemberId,
          progressByMemberName,
        ),
      ]),
    ),
  }));
}

function normalizeOverviewDetailEquipmentProgress(detail, progressByMemberId, progressByMemberName) {
  return Object.fromEntries(
    Object.entries(detail || {}).map(([status, members]) => [
      status,
      (members || []).map((member) => ({
        ...member,
        equipment_progress: normalizeEquipmentProgress(
          member.equipment_progress ||
            progressByMemberId.get(Number(member.id)) ||
            progressByMemberName.get(member.full_name),
        ),
      })),
    ]),
  );
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
  saveUiPreferences();
  renderAttendanceOverview();
}

function handleOverviewFilters() {
  state.ui.overviewSearch = els.overviewSearchInput?.value.trim() || "";
  renderOverviewWeeks();
  renderOverviewUnits();
}

function handleOverviewWeekClick(event) {
  const reminderButton = event.target.closest("[data-overview-reminders]");
  if (reminderButton) {
    event.preventDefault();
    openReminderSheet("overview");
    return;
  }

  const dateButton = event.target.closest("[data-overview-date-button]");
  if (dateButton) {
    const input = els.overviewWeekScroller?.querySelector("#overviewDateInput");
    if (event.target === input && !input?.showPicker) {
      return;
    }
    event.preventDefault();
    input?.focus({ preventScroll: true });
    if (input?.showPicker) {
      try {
        input.showPicker();
      } catch (_error) {
        input.click();
      }
    } else {
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

  const weekStart = clampToAllowedAttendanceWeek(input.value, { showToast: true });
  input.value = weekStart;
  loadAttendanceOverview(weekStart);
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

  if (details.matches?.(".overview-status-details")) {
    const unitDetails = details.closest(".overview-unit-details");
    const unitKey = unitDetails?.dataset.overviewUnitKey || "";
    const statusKey = details.dataset.overviewStatus || "";
    const openKey = unitKey && statusKey ? `${unitKey}:${statusKey}` : "";
    if (details.open) {
      state.ui.overviewOpenStatusKey = openKey;
    } else if (state.ui.overviewOpenStatusKey === openKey) {
      state.ui.overviewOpenStatusKey = "";
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
  event.preventDefault();
  event.stopPropagation();

  const rangeKey = button.dataset.overviewHistoryRange;
  if (!getOverviewHistoryRangeDefinitions().some((range) => range.key === rangeKey)) {
    return;
  }

  state.ui.overviewHistoryRange = rangeKey;
  refreshRenderedOverviewHistoryPanels();
}

function refreshRenderedOverviewHistoryPanels() {
  els.overviewUnitList
    ?.querySelectorAll(".overview-member-details")
    .forEach((details) => {
      const member = findOverviewMemberByKey(details.dataset.overviewMemberKey || "");
      const panel = details.querySelector(".overview-history-panel, .overview-history-grid");
      if (!member || !panel) {
        return;
      }
      panel.outerHTML = renderOverviewMemberHistory(member.history);
    });
}

function findOverviewMemberByKey(memberKey) {
  for (const unit of state.overviewData?.units || []) {
    const details = unit.detail?.[state.ui.overviewEvent] || {};
    for (const group of ["present", "absent", "unknown"]) {
      const member = (details[group] || []).find(
        (item) => getOverviewMemberKey(item) === memberKey,
      );
      if (member) {
        return member;
      }
    }
  }
  return null;
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
  if (els.overviewSearchInput && els.overviewSearchInput.value !== state.ui.overviewSearch) {
    els.overviewSearchInput.value = state.ui.overviewSearch;
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
        ? `正在更新，目前週次 ${buildWeekLabel(state.overviewData.selectedWeekStart)}`
        : `目前週次 ${buildWeekLabel(state.overviewData.selectedWeekStart)}`;
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
  const reminderCount = buildOverviewReminders().length;
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
    <label class="overview-date-button${isCustomWeek ? " is-active" : ""}" data-overview-date-button>
      選日期
      <input id="overviewDateInput" class="overview-date-input" type="date" min="${MIN_ATTENDANCE_WEEK_START}" max="${escapeHtml(currentWeekStart)}" value="${escapeHtml(state.overviewData.selectedWeekStart)}" />
    </label>
    <button type="button" class="overview-reminder-button reminder-trigger${reminderCount ? " has-reminders" : " is-empty"}" data-overview-reminders>
      ${reminderCount ? `提醒 ${reminderCount}` : "提醒"}
    </button>
  `;
}

function renderOverviewUnits() {
  if (!els.overviewUnitList) {
    return;
  }

  const allUnits = state.overviewData.units || [];
  const units = getFilteredOverviewUnits(allUnits);
  if (!units.length) {
    els.overviewUnitList.innerHTML =
      '<div class="empty-state-card">目前沒有符合篩選的出席單位。</div>';
    return;
  }

  if (state.ui.overviewUnitType) {
    els.overviewUnitList.innerHTML = units.map(renderOverviewUnitCard).join("");
    return;
  }

  els.overviewUnitList.innerHTML = OVERVIEW_LEVEL_ORDER
    .map((level) => {
      const sectionUnits = units.filter((unit) => (unit.level || unit.type) === level);
      if (!sectionUnits.length) {
        return "";
      }
      const sectionCount = sectionUnits.reduce((total, unit) => total + Number(unit.member_count || 0), 0);
      return `
        <section class="overview-level-section overview-level-section-${escapeHtml(level)}">
          <div class="overview-level-heading">
            <span class="overview-level-badge">${escapeHtml(getOverviewLevelLabel(level))}</span>
            <span class="overview-level-count">${sectionUnits.length} 個${escapeHtml(getOverviewLevelLabel(level))} / ${sectionCount} 人</span>
          </div>
          <div class="overview-level-cards">
            ${sectionUnits.map(renderOverviewUnitCard).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderOverviewUnitCard(unit) {
  const eventType = state.ui.overviewEvent;
  const stats = unit.stats?.[eventType] || createEmptyEventStats();
  const detail = unit.detail?.[eventType] || createEmptyOverviewDetail();
  const memberCount = Number(unit.member_count || 0);
  const presentCount = Number(stats.present_count || 0);
  const absentCount = Number(stats.absent_count || 0);
  const confirmedCount = Number(stats.confirmed_count || presentCount + absentCount);
  const expectedCount = Number(stats.expected_count ?? memberCount);
  const unknownCount = Math.max(0, Number(stats.unknown_count ?? (expectedCount - confirmedCount)));
  const completionState = getOverviewCompletionState(stats, memberCount);
  const breakdown = formatNonZeroParts([
    { label: "出席", value: presentCount },
    { label: "未出席", value: absentCount },
    { label: "待確認", value: unknownCount },
  ], " 人");
  const parentLabel = unit.parent_name || "";
  const unitKey = getOverviewUnitKey(unit);
  const level = unit.level || unit.type;
  const shouldOpen = state.ui.overviewOpenUnitKey === unitKey;

  return `
    <details
      class="overview-unit-details overview-level-${escapeHtml(level)}${completionState.isZero ? " is-zero-completion" : ""}"
      data-overview-unit-key="${escapeHtml(unitKey)}"
      ${shouldOpen ? "open" : ""}
    >
      <summary>
        <span class="overview-unit-main">
          <span class="overview-unit-title-row">
            <span class="overview-unit-title">${escapeHtml(unit.name)}</span>
          </span>
          ${parentLabel ? `<span class="muted small-text">${escapeHtml(parentLabel)}</span>` : ""}
        </span>
        <span class="overview-unit-stat">
          <strong>${escapeHtml(formatOverviewHeadline(stats, memberCount))}</strong>
          <span class="summary-subtext overview-completion-text ${escapeHtml(completionState.tone)}">
            ${escapeHtml(completionState.label)}
          </span>
          ${breakdown ? `<span class="summary-subtext overview-breakdown-text">${escapeHtml(breakdown)}</span>` : ""}
        </span>
      </summary>
      <div class="overview-detail-grid">
        ${renderOverviewUnitHistory(unit.history, stats, memberCount)}
        ${renderOverviewStatusGroup("出席", detail.present || [], unitKey, "present")}
        ${renderOverviewStatusGroup("未出席", detail.absent || [], unitKey, "absent")}
        ${renderOverviewStatusGroup("待確認", detail.unknown || [], unitKey, "unknown")}
      </div>
    </details>
  `;
}

function getFilteredOverviewUnits(allUnits) {
  const eventType = state.ui.overviewEvent;
  const searchTerm = state.ui.overviewSearch.trim().toLowerCase();
  const filteredUnits = allUnits.filter((unit) => {
    if (state.ui.overviewUnitType && unit.type !== state.ui.overviewUnitType) {
      return false;
    }
    if (!searchTerm) {
      return true;
    }
    return getOverviewSearchText(unit, eventType).includes(searchTerm);
  });

  return filteredUnits;
}

function getOverviewSearchText(unit, eventType) {
  const detail = unit.detail?.[eventType] || {};
  const memberNames = ["present", "absent", "unknown"]
    .flatMap((key) => detail[key] || [])
    .map((member) => `${member.full_name || ""} ${getRoleLabel(member.role)}`);
  return [
    unit.name,
    unit.parent_name,
    getOverviewLevelLabel(unit.level || unit.type),
    ...memberNames,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getOverviewCompletionMetrics(stats, memberCount = 0) {
  const expectedCount = Number(stats?.expected_count ?? memberCount);
  const confirmedCount = Number(stats?.confirmed_count || 0);
  const unknownCount = Math.max(0, Number(stats?.unknown_count ?? (expectedCount - confirmedCount)));
  return {
    expectedCount,
    confirmedCount,
    unknownCount,
    completionRatio: expectedCount ? confirmedCount / expectedCount : 0,
  };
}

function getOverviewCompletionState(stats, memberCount = 0) {
  const { expectedCount, confirmedCount } = getOverviewCompletionMetrics(stats, memberCount);
  if (!expectedCount) {
    return { label: "不計出席率", tone: "neutral", chipClass: "neutral", isZero: false };
  }
  if (!confirmedCount) {
    return { label: "填寫率 0%", tone: "danger", chipClass: "danger", isZero: true };
  }
  if (confirmedCount < expectedCount) {
    return { label: `填寫率 ${formatPercent(confirmedCount, expectedCount)}`, tone: "warning", chipClass: "warning", isZero: false };
  }
  return { label: "填寫完成", tone: "success", chipClass: "success", isZero: false };
}

function formatOverviewHeadline(stats, memberCount = 0) {
  const { expectedCount, confirmedCount } = getOverviewCompletionMetrics(stats, memberCount);
  if (!expectedCount) {
    return "不計出席率";
  }
  if (expectedCount && !confirmedCount) {
    return "尚未填寫";
  }
  return formatOverviewRate(stats, memberCount);
}

function getOverviewLevelLabel(level) {
  return ORG_SUFFIXES[level] || "單位";
}

function getOverviewUnitKey(unit) {
  return `${unit.type || "unit"}:${unit.id || unit.name || ""}`;
}

function renderOverviewStatusGroup(label, members, unitKey = "", statusKey = "") {
  const sortedMembers = sortMembers([...(members || [])]);
  if (!sortedMembers.length) {
    return "";
  }
  const shouldOpen = state.ui.overviewOpenStatusKey === `${unitKey}:${statusKey}`;
  return `
    <details class="overview-status-group overview-status-details" data-overview-status="${escapeHtml(statusKey)}"${shouldOpen ? " open" : ""}>
      <summary class="overview-status-head">
        <strong>${escapeHtml(label)}</strong>
        <span class="status-chip neutral">${sortedMembers.length}</span>
      </summary>
      <div class="overview-member-list">
        ${sortedMembers.map(renderOverviewMember).join("")}
      </div>
    </details>
  `;
}

function renderOverviewUnitHistory(history, currentStats, memberCount) {
  const ranges = getOverviewHistoryRangeDefinitions();
  const currentRate = formatOverviewRate(currentStats, memberCount);
  const completionState = getOverviewCompletionState(currentStats, memberCount);
  const shouldOpen = window.matchMedia("(min-width: 961px)").matches;
  return `
    <details class="overview-status-group overview-status-details overview-rate-group"${shouldOpen ? " open" : ""}>
      <summary class="overview-status-head overview-rate-hero">
        <strong>整體出席率</strong>
        <span class="overview-rate-value">${escapeHtml(currentRate)}</span>
        <span class="summary-subtext overview-rate-completion ${escapeHtml(completionState.tone)}">${escapeHtml(completionState.label)}</span>
      </summary>
      <div class="overview-unit-history-grid">
        ${ranges.map((range) => renderOverviewUnitHistoryCard(range, history?.[range.key])).join("")}
      </div>
    </details>
  `;
}

function renderOverviewUnitHistoryCard(range, data) {
  const eventType = state.ui.overviewEvent;
  const stats = data?.[eventType] || createEmptyEventStats();
  const missingCount = getMissingCount(stats);
  const completionText = `填寫率 ${formatCompletionRate(stats)}${missingCount ? ` (未填${missingCount}筆)` : ""}`;
  return `
    <div class="overview-history-event">
      <span class="info-label">${escapeHtml(range.label)}</span>
      <strong>${escapeHtml(formatAnalyticsRate(stats))}</strong>
      <span class="summary-subtext">${escapeHtml(completionText)}</span>
      <span class="summary-subtext">${escapeHtml(formatDetailedAnalyticsBreakdown(stats))}</span>
    </div>
  `;
}

function renderOverviewMember(member) {
  const alerts = getOverviewMemberAlerts(member);
  const hasRegularNote = Boolean(member.note && !member.note_priority_high);
  const memberKey = getOverviewMemberKey(member);
  const shouldOpen = state.ui.overviewOpenMemberKeys.has(memberKey);
  const birthdayReminder = getBirthdayReminder(member);
  return `
    <details
      class="overview-member-details equipment-surface ${escapeHtml(getEquipmentProgressClass(member.equipment_progress))}${alerts.length ? " has-alerts" : ""}"
      data-overview-member-key="${escapeHtml(memberKey)}"
      ${shouldOpen ? "open" : ""}
    >
      <summary class="overview-member-row">
        <span class="name-card gender-${escapeHtml(member.gender || "unknown")}">${escapeHtml(member.full_name)}</span>
        <span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span>
        ${alerts.map(renderOverviewAlertBadge).join("")}
        ${hasRegularNote ? '<span class="overview-note-badge">有備註</span>' : ""}
      </summary>
      ${birthdayReminder ? renderOverviewBirthdayDetail(birthdayReminder) : ""}
      ${renderOverviewAlertPanel(alerts.filter((alert) => alert.type !== "birthday"))}
      ${hasRegularNote ? renderOverviewNotePanel(member.note) : ""}
      ${renderOverviewMemberHistory(member.history)}
    </details>
  `;
}

function getOverviewMemberAlerts(member) {
  return [
    getBirthdayReminder(member),
    getOverviewAttendanceReminder(member),
    getHighPriorityNoteReminder(member),
  ].filter(Boolean);
}

function getOverviewAttendanceReminder(member) {
  if (!isAttendanceRateMember(member)) {
    return null;
  }
  return getAttendanceReminderForEvent(member, state.ui.overviewEvent);
}

function getDashboardAttendanceReminder(member) {
  if (!isAttendanceRateMember(member)) {
    return null;
  }
  const historySource = hasMemberReminderHistory(member)
    ? member
    : findLoadedOverviewMemberById(member?.id) || member;
  const reminders = ["sunday_service", "small_group_fellowship"]
    .map((eventType) => getAttendanceReminderForEvent(historySource, eventType))
    .filter(Boolean);
  if (!reminders.length) {
    return null;
  }

  return reminders.sort(compareAttendanceReminderSeverity)[0];
}

function hasMemberReminderHistory(member) {
  return Boolean(member?.history?.month || member?.history?.three_months);
}

function findLoadedOverviewMemberById(memberId) {
  if (!memberId || !state.overviewData) {
    return null;
  }

  for (const unit of state.overviewData.units || []) {
    for (const detail of Object.values(unit.detail || {})) {
      for (const status of ["present", "absent", "unknown"]) {
        const member = (detail?.[status] || []).find((item) => Number(item.id) === Number(memberId));
        if (member) {
          return member;
        }
      }
    }
  }

  return null;
}

function compareAttendanceReminderSeverity(left, right) {
  const severity = { danger: 1, warning: 2, caution: 3 };
  return (severity[left.tone] || 9) - (severity[right.tone] || 9);
}

function getAttendanceReminderForEvent(member, eventType) {
  const monthStats = member?.history?.month?.[eventType] || null;
  const threeMonthStats = member?.history?.three_months?.[eventType] || null;
  if (!monthStats && !threeMonthStats) {
    return null;
  }
  const eventLabel = eventType === "small_group_fellowship" ? "小家" : "主日";
  const monthPresent = Number(monthStats?.present_count || 0);
  const monthAbsent = Number(monthStats?.absent_count || 0);
  const monthConfirmed = Number(monthStats?.confirmed_count || monthPresent + monthAbsent);
  const threePresent = Number(threeMonthStats?.present_count || 0);
  const threeAbsent = Number(threeMonthStats?.absent_count || 0);
  const threeConfirmed = Number(threeMonthStats?.confirmed_count || threePresent + threeAbsent);
  const threeRate = threeConfirmed ? threePresent / threeConfirmed : null;

  if (monthConfirmed >= 2 && monthAbsent >= 2 && monthPresent === 0) {
    return {
      type: "attendance",
      tone: "danger",
      label: "需關注",
      detail: `${eventLabel}近一個月已填 ${monthConfirmed} 次，皆未出席。`,
      panelDetail: `${eventLabel}近一個月皆未出席`,
    };
  }

  if (threeConfirmed >= 8 && threeRate !== null && threeRate < 0.3) {
    return {
      type: "attendance",
      tone: "danger",
      label: "需關注",
      detail: `${eventLabel}近期出席率 ${formatPercent(threePresent, threeConfirmed)}（出席 ${threePresent} / 已填 ${threeConfirmed}）。`,
      panelDetail: `${eventLabel} ${formatPercent(threePresent, threeConfirmed)}`,
    };
  }

  if (monthAbsent >= 1 && monthPresent === 0 && monthConfirmed >= 1) {
    return {
      type: "attendance",
      tone: "warning",
      label: "關注",
      detail: `${eventLabel}近一個月已填 ${monthConfirmed} 次，尚無出席紀錄。`,
      panelDetail: `${eventLabel}近一個月尚無出席`,
    };
  }

  if (threeConfirmed >= 8 && threeRate !== null && threeRate < 0.5) {
    return {
      type: "attendance",
      tone: "warning",
      label: "關注",
      detail: `${eventLabel}近期出席率 ${formatPercent(threePresent, threeConfirmed)}（出席 ${threePresent} / 已填 ${threeConfirmed}）。`,
      panelDetail: `${eventLabel} ${formatPercent(threePresent, threeConfirmed)}`,
    };
  }

  if (threeConfirmed >= 4 && threeRate !== null && threeRate < 0.7) {
    return {
      type: "attendance",
      tone: "caution",
      label: "留意",
      detail: `${eventLabel}近期出席率 ${formatPercent(threePresent, threeConfirmed)}（出席 ${threePresent} / 已填 ${threeConfirmed}）。`,
      panelDetail: `${eventLabel} ${formatPercent(threePresent, threeConfirmed)}`,
    };
  }

  return null;
}

function renderOverviewAlertBadge(alert) {
  return `<span class="overview-alert-badge ${escapeHtml(alert.tone)}">${escapeHtml(alert.label)}</span>`;
}

function renderOverviewAlertPanel(alerts) {
  if (!alerts.length) {
    return "";
  }

  return `
    <div class="overview-alert-panel">
      ${alerts.map((alert) => `
        <span class="overview-alert-reason ${escapeHtml(alert.tone)}">${escapeHtml(alert.detail)}</span>
      `).join("")}
    </div>
  `;
}

function renderOverviewBirthdayDetail(reminder) {
  return `
    <div class="overview-birthday-detail ${escapeHtml(reminder.tone)}">
      ${escapeHtml(reminder.detail)}
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
  return formatNonZeroParts([
    { label: "出席", value: stats.present_count || 0 },
    { label: "缺席", value: stats.absent_count || 0 },
  ]) || "尚無資料";
}

function getMissingCount(stats) {
  const expectedCount = Number(stats?.expected_count || 0);
  const confirmedCount = Number(stats?.confirmed_count || 0);
  if (expectedCount) {
    return Math.max(0, expectedCount - confirmedCount);
  }
  return Number(stats?.unknown_count || 0);
}

function createEmptyEventStats() {
  return {
    present_count: 0,
    absent_count: 0,
    unknown_count: 0,
    confirmed_count: 0,
    expected_count: 0,
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
  const { expectedCount } = getOverviewCompletionMetrics(stats, memberCount);
  if (!expectedCount) {
    return "不計出席率";
  }
  const confirmedCount = Number(stats?.confirmed_count || 0);
  return confirmedCount
    ? formatPercent(stats?.present_count || 0, confirmedCount)
    : "尚無資料";
}

function renderManagement() {
  if (!canUseManagement()) {
    setHidden(els.peopleView, true);
    closeOrgEditor();
    return;
  }

  const canCreate = canCreateMembers();
  setHidden(els.newMemberBtn, !canCreate);
  setHidden(els.bulkMemberBtn, !canCreate);
  if (!canCreate) {
    closeBulkMemberEditor();
    if (state.ui.editorMode === "create") {
      closeMemberEditor();
    }
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
  const viewer = getPermissionCurrentMember();
  if (!viewer) {
    return [];
  }

  if (viewer.is_admin) {
    return state.adminData.members;
  }

  return state.adminData.members.filter(
    (member) =>
      canManageMemberScope(viewer, member) &&
      canManageRole(viewer.role, member.role),
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
  const activeRows = rows.filter((member) => member.is_active !== false);
  const archivedRows = rows.filter((member) => member.is_active === false);
  if (els.peopleSummary) {
    els.peopleSummary.textContent = editableMembers.length
      ? `目前 ${rows.length} 位（啟用 ${activeRows.length} 位 / 封存 ${archivedRows.length} 位），總數 ${editableMembers.length} 位`
      : "目前沒有可編輯的人員資料";
  }

  if (!rows.length) {
    els.peopleTableBody.innerHTML =
      '<div class="empty-state-card">目前沒有符合條件、且你可編輯的人員資料。</div>';
    return;
  }

  const shouldOpenGroups = Boolean(state.ui.peopleSearch || state.ui.peopleRole);
  const hierarchy = buildPeopleHierarchy(activeRows);
  const activeHtml = activeRows.length
    ? [
        hierarchy.rootLeaders.length
          ? renderPeopleLeaderGroup("跨區領袖", hierarchy.rootLeaders, "people:root-leaders", shouldOpenGroups)
          : "",
        ...hierarchy.districts.map((district) => renderPeopleDistrictGroup(district, shouldOpenGroups)),
      ].filter(Boolean).join("")
    : '<div class="empty-state-card">目前沒有符合篩選的啟用人員。</div>';
  els.peopleTableBody.innerHTML = `
    ${activeHtml}
    ${renderPeopleArchiveSection(archivedRows)}
  `;
}

function buildPeopleHierarchy(rows) {
  const rootLeaders = [];
  const districts = new Map();

  const ensureDistrict = (member, districtId = member.district_id, districtName = member.district_name) => {
    const districtRecord = state.adminData.districts.find((item) => item.id === districtId);
    const districtLabel = districtRecord?.name || districtName || "未設定區";
    const districtKey = districtId || `name:${districtLabel}`;
    if (!districts.has(districtKey)) {
      districts.set(districtKey, {
        key: `district:${districtKey}`,
        label: districtLabel,
        displayOrder: districtRecord?.display_order,
        isActive: districtRecord?.is_active !== false,
        count: 0,
        leaders: [],
        bigFamilies: new Map(),
        smallGroups: new Map(),
      });
    }
    return districts.get(districtKey);
  };

  const ensureBigFamily = (district, member) => {
    const bigFamilyRecord = state.adminData.bigFamilies.find((item) => item.id === member.big_family_id);
    const bigFamilyLabel = bigFamilyRecord?.name || member.big_family_name || "未設定大家";
    const bigFamilyKey = member.big_family_id || `name:${bigFamilyLabel}`;
    if (!district.bigFamilies.has(bigFamilyKey)) {
      district.bigFamilies.set(bigFamilyKey, {
        key: `${district.key}:big:${bigFamilyKey}`,
        label: bigFamilyLabel,
        displayOrder: bigFamilyRecord?.display_order,
        isActive: bigFamilyRecord?.is_active !== false,
        count: 0,
        leaders: [],
        smallGroups: new Map(),
      });
    }
    return district.bigFamilies.get(bigFamilyKey);
  };

  const ensureSmallGroup = (container, member, keyPrefix) => {
    const smallGroupRecord = state.adminData.smallGroups.find((item) => item.id === member.small_group_id);
    const smallGroupLabel = smallGroupRecord?.name || member.small_group_name || "直屬人員";
    const smallGroupKey = member.small_group_id || `name:${smallGroupLabel}`;
    if (!container.smallGroups.has(smallGroupKey)) {
      container.smallGroups.set(smallGroupKey, {
        key: `${keyPrefix}:small:${smallGroupKey}`,
        label: smallGroupLabel,
        displayOrder: smallGroupRecord?.display_order,
        isActive: smallGroupRecord?.is_active !== false,
        leaders: [],
        members: [],
      });
    }
    return container.smallGroups.get(smallGroupKey);
  };

  for (const member of rows) {
    if (isPastoralLeaderRole(member.role) && !member.big_family_id && !member.small_group_id) {
      const managedDistrictIds = getDistrictPastorDistrictIds(member);
      const singleDistrictId = managedDistrictIds.length === 1
        ? managedDistrictIds[0]
        : Number(member.district_id || 0);
      if (managedDistrictIds.length > 1 && !member.district_id) {
        rootLeaders.push(member);
      } else if (singleDistrictId) {
        const district = ensureDistrict(member, singleDistrictId, member.district_name);
        district.count += 1;
        district.leaders.push(member);
      } else {
        rootLeaders.push(member);
      }
      continue;
    }

    if (!member.district_id && !member.district_name && isPeopleLeaderRole(member.role)) {
      rootLeaders.push(member);
      continue;
    }
    const district = ensureDistrict(member);
    district.count += 1;

    if (member.role === "district_leader") {
      district.leaders.push(member);
      continue;
    }

    if (BIG_FAMILY_LEADER_ROLES.includes(member.role) && !member.big_family_id && !member.big_family_name) {
      district.leaders.push(member);
      continue;
    }

    if (!member.big_family_id && !member.big_family_name) {
      const smallGroup = ensureSmallGroup(district, member, district.key);
      if (SMALL_GROUP_LEADER_ROLES.includes(member.role) || isPastoralLeaderRole(member.role)) {
        smallGroup.leaders.push(member);
      } else {
        smallGroup.members.push(member);
      }
      continue;
    }

    const bigFamily = ensureBigFamily(district, member);
    bigFamily.count += 1;

    if (BIG_FAMILY_LEADER_ROLES.includes(member.role) || (isPastoralLeaderRole(member.role) && !member.small_group_id)) {
      bigFamily.leaders.push(member);
      continue;
    }

    if (!member.small_group_id && !member.small_group_name && SMALL_GROUP_LEADER_ROLES.includes(member.role)) {
      bigFamily.leaders.push(member);
      continue;
    }

    const smallGroup = ensureSmallGroup(bigFamily, member, bigFamily.key);
    if (SMALL_GROUP_LEADER_ROLES.includes(member.role) || isPastoralLeaderRole(member.role)) {
      smallGroup.leaders.push(member);
    } else {
      smallGroup.members.push(member);
    }
  }

  const districtList = Array.from(districts.values())
    .sort(compareHierarchyGroups)
    .map((district) => ({
      ...district,
      leaders: sortMembers(district.leaders),
      bigFamilies: Array.from(district.bigFamilies.values())
        .sort(compareHierarchyGroups)
        .map((bigFamily) => ({
          ...bigFamily,
          leaders: sortMembers(bigFamily.leaders),
          smallGroups: Array.from(bigFamily.smallGroups.values())
            .sort(compareHierarchyGroups)
            .map((smallGroup) => ({
              ...smallGroup,
              leaders: sortMembers(smallGroup.leaders),
              members: sortMembers(smallGroup.members),
            })),
        })),
      smallGroups: Array.from(district.smallGroups.values())
        .sort(compareHierarchyGroups)
        .map((smallGroup) => ({
          ...smallGroup,
          leaders: sortMembers(smallGroup.leaders),
          members: sortMembers(smallGroup.members),
        })),
    }));
  return {
    rootLeaders: sortMembers(rootLeaders),
    districts: districtList,
  };
}

function isPeopleLeaderRole(role) {
  return (
    isPastoralLeaderRole(role) ||
    role === "district_leader" ||
    BIG_FAMILY_LEADER_ROLES.includes(role) ||
    SMALL_GROUP_LEADER_ROLES.includes(role)
  );
}

function compareHierarchyGroups(left, right) {
  if (left.isActive !== right.isActive) {
    return left.isActive ? -1 : 1;
  }
  const leftOrder = Number(left.displayOrder);
  const rightOrder = Number(right.displayOrder);
  const hasLeftOrder = Number.isFinite(leftOrder);
  const hasRightOrder = Number.isFinite(rightOrder);
  if (hasLeftOrder || hasRightOrder) {
    if (hasLeftOrder !== hasRightOrder) {
      return hasLeftOrder ? -1 : 1;
    }
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
  }
  return compareOrganizationNames(left.label, right.label);
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
        ${renderPeopleLeaderGroup("領袖", district.leaders, `${groupKey}:leaders`, shouldOpen)}
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
        ${renderPeopleLeaderGroup("領袖", bigFamily.leaders, `${groupKey}:leaders`, shouldOpen)}
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
        <span class="status-chip neutral">${smallGroup.leaders.length + smallGroup.members.length}</span>
      </summary>
      <div class="people-scope-members">
        ${renderPeopleLeaderGroup("領袖", smallGroup.leaders, `${groupKey}:leaders`, shouldOpen)}
        ${smallGroup.members.map(renderPeopleMemberCard).join("")}
      </div>
    </details>
  `;
}

function renderPeopleLeaderGroup(label, members, groupKey, shouldOpen = false) {
  if (!members.length) {
    return "";
  }
  const isOpen = shouldOpen || state.ui.peopleOpenGroups.has(groupKey);
  return `
    <details class="people-scope-group people-level-leaders" data-people-group-key="${escapeHtml(groupKey)}" ${isOpen ? "open" : ""}>
      <summary>
        <span class="people-scope-title">${escapeHtml(label)}</span>
        <span class="status-chip neutral">${members.length}</span>
      </summary>
      <div class="people-scope-members">
        ${members.map(renderPeopleMemberCard).join("")}
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
      const canEdit = canEditProfile(member);
      const canDelete = canDeleteMember(member);
      const canRestore = canRestoreMember(member);
      const canPurge = canPurgeMember(member);
      const readonlyChip = canEdit
        ? ""
        : '<span class="status-chip neutral">僅檢視</span>';

      return `
        <article class="member-card${member.is_active ? "" : " is-inactive"}">
          <div class="member-card-head">
            <div class="row-meta">
              <div class="member-card-title">
                <strong>${escapeHtml(member.full_name)}</strong>
                ${renderGenderBadge(member.gender)}
                ${renderEquipmentProgressBadge(member.equipment_progress)}
              </div>
              <div class="member-card-chips">
                <span class="role-pill role-${escapeHtml(member.role)}">${escapeHtml(getRoleLabel(member.role))}</span>
                ${lineStatus}
                ${readonlyChip}
              </div>
              ${path ? `<div class="member-card-path muted small-text">${escapeHtml(path)}</div>` : ""}
            </div>
            <div class="row-actions">
              ${canEdit
                ? `<button type="button" class="secondary people-edit-btn" data-member-id="${member.id}">編輯</button>`
                : ""}
              ${canRestore
                ? `<button type="button" class="danger-button people-restore-btn" data-member-id="${member.id}" data-member-name="${escapeHtml(member.full_name)}">恢復啟用</button>`
                : ""}
              ${canDelete
                ? `<button type="button" class="secondary danger-button people-delete-btn" data-member-id="${member.id}" data-member-name="${escapeHtml(member.full_name)}">封存</button>`
                : ""}
              ${canPurge
                ? `<button type="button" class="secondary danger-button people-purge-btn" data-member-id="${member.id}" data-member-name="${escapeHtml(member.full_name)}">完全刪除</button>`
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

function renderPeopleArchiveSection(members) {
  const isOpen = members.length > 0 || state.ui.peopleOpenGroups.has("archive:members");
  return `
    <details class="people-scope-group people-archive-group" data-people-group-key="archive:members" ${isOpen ? "open" : ""}>
      <summary>
        <span>封存區</span>
        <span class="status-chip archived">${members.length}</span>
      </summary>
      <div class="people-scope-members">
        ${members.length
          ? members.map(renderPeopleMemberCard).join("")
          : '<div class="empty-state-card">目前沒有封存人員。</div>'}
      </div>
    </details>
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

  const purgeButton = event.target.closest(".people-purge-btn");
  if (purgeButton) {
    const memberId = Number(purgeButton.dataset.memberId);
    const memberName = purgeButton.dataset.memberName || "這位人員";
    if (!memberId) {
      return;
    }

    handlePurgeMember(purgeButton, memberId, memberName);
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
        ...getAdminModeRequestBody(),
        member_id: memberId,
        full_name: member.full_name,
        role: member.role,
        gender: member.gender || null,
        equipment_progress: normalizeEquipmentProgress(member.equipment_progress),
        note: member.note || "",
        district_id: member.district_id || null,
        big_family_id: member.big_family_id || null,
        small_group_id: member.small_group_id || null,
        is_admin: Boolean(member.is_admin),
        is_active: true,
        district_ids: getDistrictPastorDistrictIds(member),
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
  if (!member) {
    showToast("找不到這筆人員資料。");
    return;
  }

  setButtonLoading(button, true);
  try {
    const data = await apiRequest("update-member", {
      method: "POST",
      authMode: "app",
      body: {
        ...getAdminModeRequestBody(),
        member_id: memberId,
        full_name: member.full_name,
        role: member.role,
        gender: member.gender || null,
        equipment_progress: normalizeEquipmentProgress(member.equipment_progress),
        note: member.note || "",
        district_id: member.district_id || null,
        big_family_id: member.big_family_id || null,
        small_group_id: member.small_group_id || null,
        is_admin: Boolean(member.is_admin),
        is_active: false,
        district_ids: getDistrictPastorDistrictIds(member),
      },
    });

    if (state.ui.editingMemberId === memberId) {
      closeMemberEditor();
    }

    await Promise.all([loadAdminPanel(), loadDashboard({ skipDirtyCheck: true })]);
    showToast(data?.message || "人員已移入封存區。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "封存人員失敗。");
  } finally {
    setButtonLoading(button, false);
  }
}

async function handlePurgeMember(button, memberId, memberName) {
  if (
    !window.confirm(
      `確定要完全刪除「${memberName}」嗎？\n\n此操作會永久刪除人員資料，無法復原。`,
    )
  ) {
    showToast("已取消完全刪除。");
    return;
  }

  setButtonLoading(button, true);
  try {
    const data = await apiRequest("purge-member", {
      method: "POST",
      authMode: "app",
      body: { ...getAdminModeRequestBody(), member_id: memberId },
    }).catch((error) => {
      if (!isMissingActionError(error)) {
        throw error;
      }
      return apiRequest("purge-member", {
        method: "POST",
        authMode: "app",
        body: { ...getAdminModeRequestBody(), member_id: memberId },
        functionName: "app-api",
      });
    });
    if (state.ui.editingMemberId === memberId) {
      closeMemberEditor();
    }
    await Promise.all([loadAdminPanel(), loadDashboard({ skipDirtyCheck: true })]);
    showToast(data?.message || "人員已完全刪除。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "完全刪除人員失敗。");
  } finally {
    setButtonLoading(button, false);
  }
}

function renderMemberEditor() {
  if (!state.ui.editorMode) {
    setHidden(els.memberEditorBackdrop, true);
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
  if (mode === "create" && !canCreateMembers()) {
    showToast("新增人員請由區長或以上職分處理。");
    return;
  }
  const editableMember = memberId
    ? state.adminData.members.find((member) => member.id === memberId)
    : null;

  if (mode === "edit" && !editableMember) {
    showToast("找不到這筆人員資料。");
    return;
  }

  closeBulkMemberEditor();
  resetMemberEditorFormState();
  state.ui.editorMode = mode;
  state.ui.editingMemberId = memberId;

  populateRoleOptions(mode, editableMember);
  populateDistrictOptions(editableMember);
  fillMemberForm(mode, editableMember);
  syncEditorBigFamilyOptions(editableMember);
  syncEditorSmallGroupOptions(editableMember);
  syncMemberFormScope();
  setHidden(els.memberNoteLabel, true);
  setHidden(els.memberEditorCard, false);
  setHidden(els.memberEditorBackdrop, false);
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
  resetMemberEditorFormState();
  setHidden(els.memberEditorBackdrop, true);
  setHidden(els.memberEditorCard, true);
}

function resetMemberEditorFormState() {
  els.memberForm.reset();
  els.memberDistrictSelect.value = "";
  els.memberBigFamilySelect.value = "";
  els.memberSmallGroupSelect.value = "";
  els.memberDistrictSelect.innerHTML = "";
  els.memberBigFamilySelect.innerHTML = "";
  els.memberSmallGroupSelect.innerHTML = "";
  if (els.memberManagedDistrictList) {
    els.memberManagedDistrictList.innerHTML = "";
    delete els.memberManagedDistrictList.dataset.role;
    delete els.memberManagedDistrictList.dataset.memberKey;
  }
  els.memberManagedDistrictWrap.open = false;
  els.memberIsAdminWrap.open = false;
  setHidden(els.memberNoteLabel, true);
}

function openBulkMemberEditor() {
  if (!canCreateMembers()) {
    showToast("新增人員請由區長或以上職分處理。");
    return;
  }
  closeMemberEditor();
  state.bulkMembers = [];
  populateBulkRoleOptions();
  populateBulkDistrictOptions();
  els.bulkGenderSelect.value = "";
  els.bulkCreateScopeModeSelect.value = getDefaultCreateScopeMode(els.bulkRoleSelect.value);
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

  const roles = getCreateRoleOptions();
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

  const viewer = getPermissionCurrentMember();
  const districtOptions = getSelectableDistricts().filter(
    (district) => canManageMemberDistrict(viewer, district.id),
  ).map((district) => ({
    value: String(district.id),
    label: getOrganizationDisplayName(district.name, district.is_active),
  }));
  fillSelect(els.bulkDistrictSelect, districtOptions, {
    placeholder: districtOptions.length ? "可留空（無區）" : "尚無可選區",
  });

  if (viewer?.is_admin || PREACHER_ROLES.includes(viewer?.role) || DISTRICT_PASTOR_ROLES.includes(viewer?.role)) {
    els.bulkDistrictSelect.disabled = false;
  } else {
    els.bulkDistrictSelect.value = String(viewer?.district_id || "");
    els.bulkDistrictSelect.disabled = true;
  }
}

function syncBulkDefaultScope() {
  if (!els.bulkRoleSelect || !els.bulkDistrictSelect) {
    return;
  }

  const role = els.bulkRoleSelect.value;
  const createScopeMode = getBulkCreateScopeMode(role);
  const selectedBigFamilyId = Number(els.bulkBigFamilySelect.value || 0);
  const selectedSmallGroupId = Number(els.bulkSmallGroupSelect.value || 0);
  const districtId = Number(els.bulkDistrictSelect.value || 0);
  const availableBigFamilies = getSelectableBigFamilies(districtId, selectedBigFamilyId);
  fillSelect(
    els.bulkBigFamilySelect,
    availableBigFamilies.map((bigFamily) => ({
      value: String(bigFamily.id),
      label: getOrganizationDisplayName(bigFamily.name, bigFamily.is_active),
    })),
    { placeholder: availableBigFamilies.length ? "可留空（無大家）" : "可留空（無大家）" },
  );
  if (selectedBigFamilyId) {
    els.bulkBigFamilySelect.value = String(selectedBigFamilyId);
  }

  const bigFamilyId = Number(els.bulkBigFamilySelect.value || 0);
  const availableSmallGroups = getSelectableSmallGroups({
    role,
    districtId,
    bigFamilyId,
    includeSmallGroupId: selectedSmallGroupId,
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
  if (selectedSmallGroupId) {
    els.bulkSmallGroupSelect.value = String(selectedSmallGroupId);
  }

  const isManagedCreateRole = isManagedOrganizationCreateRole(role);
  const showDistrictField = !isManagedCreateRole || createScopeMode !== "empty";
  const showBigFamilyField = isManagedCreateRole
    ? (
        (BIG_FAMILY_LEADER_ROLES.includes(role) && createScopeMode === "existing") ||
        (SMALL_GROUP_LEADER_ROLES.includes(role) && createScopeMode !== "empty")
      )
    : true;
  const showSmallGroupField = isManagedCreateRole
    ? SMALL_GROUP_LEADER_ROLES.includes(role) && createScopeMode === "existing"
    : true;
  setHidden(els.bulkCreateScopeModeLabel, !isManagedCreateRole);
  setHidden(els.bulkDistrictLabel, !showDistrictField);
  setHidden(els.bulkBigFamilyLabel, !showBigFamilyField);
  setHidden(els.bulkSmallGroupLabel, !showSmallGroupField);
  els.bulkCreateScopeModeSelect.disabled = !isManagedCreateRole;
  if (isManagedCreateRole) {
    els.bulkCreateScopeModeSelect.innerHTML = getCreateScopeModeOptions(role, createScopeMode);
    els.bulkCreateScopeModeSelect.value = createScopeMode;
  }
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
  const role = els.bulkRoleSelect.value || "member";
  const createScopeMode = getBulkCreateScopeMode(role);

  return applyBulkCreateScopeMode({
    client_id: `bulk-${Date.now()}-${index}`,
    full_name: name,
    role,
    create_scope_mode: createScopeMode,
    gender: els.bulkGenderSelect.value || "",
    district_id: districtId,
    big_family_id: bigFamilyId,
    small_group_id: smallGroupId || null,
    is_active: els.bulkActiveSelect.value !== "false",
    error: "",
  });
}

function applyBulkCreateScopeMode(member) {
  member.create_scope_mode = getBulkCreateScopeMode(member.role, member.create_scope_mode);
  if (!isManagedOrganizationCreateRole(member.role)) {
    member.create_scope_mode = "existing";
    return member;
  }

  if (member.create_scope_mode === "empty" || member.create_scope_mode === "create") {
    member.small_group_id = null;
    if (member.role === "district_leader" || BIG_FAMILY_LEADER_ROLES.includes(member.role)) {
      member.big_family_id = null;
    }
    if (member.create_scope_mode === "empty" || member.role === "district_leader") {
      member.district_id = null;
      member.big_family_id = null;
    }
  }

  return member;
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
    member.create_scope_mode = getDefaultCreateScopeMode(member.role);
    member.district_id = null;
    member.big_family_id = null;
    member.small_group_id = null;
  } else if (field === "create_scope_mode") {
    member.create_scope_mode = getBulkCreateScopeMode(member.role, event.target.value);
    member.district_id = null;
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

  applyBulkCreateScopeMode(member);
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
  const viewer = getPermissionCurrentMember();
  if (!member.full_name) {
    return "姓名不可空白。";
  }
  if (!member.role) {
    return "請選擇職分。";
  }
  if (
    !viewer?.is_admin &&
    (!canManageRole(viewer?.role, member.role) ||
      (member.role === "district_leader" &&
        !DISTRICT_PASTOR_ROLES.includes(viewer?.role) &&
        !PREACHER_ROLES.includes(viewer?.role)))
  ) {
    return "沒有權限新增此職分。";
  }
  if (
    !viewer?.is_admin &&
    member.district_id &&
    !canManageMemberDistrict(viewer, member.district_id)
  ) {
    return "只能新增到自己的轄區。";
  }
  const createScopeMode = getBulkCreateScopeMode(member.role, member.create_scope_mode);
  const scopeError = getNonAdminScopeError(member.role, member, createScopeMode, "create");
  if (scopeError) {
    return scopeError;
  }
  if (!viewer?.is_admin && !canManageMemberScope(viewer, member)) {
    return "只能新增到自己管理範圍內。";
  }
  if (isManagedOrganizationCreateRole(member.role)) {
    if (createScopeMode === "create") {
      if (BIG_FAMILY_LEADER_ROLES.includes(member.role) && !member.district_id) {
        return "新建同名大家需要選擇所屬區。";
      }
      if (SMALL_GROUP_LEADER_ROLES.includes(member.role) && !member.district_id) {
        return "新建同名小家需要選擇所屬區。";
      }
    }
    if (createScopeMode === "existing") {
      if (member.role === "district_leader" && !member.district_id) {
        return "加入既有區需要選擇所屬區。";
      }
      if (BIG_FAMILY_LEADER_ROLES.includes(member.role) && !member.big_family_id) {
        return "加入既有大家需要選擇所屬大家。";
      }
      if (SMALL_GROUP_LEADER_ROLES.includes(member.role) && !member.small_group_id) {
        return "加入既有小家需要選擇所屬小家。";
      }
    }
  }
  if (MEMBER_ROLES.includes(member.role) && !member.small_group_id) {
    return "新增小家人或新朋友需要選擇小家。";
  }
  return "";
}

function getNonAdminScopeError(role, scope, createScopeMode, mode) {
  const viewer = getPermissionCurrentMember();
  if (viewer?.is_admin) {
    return "";
  }
  if (isManagedOrganizationCreateRole(role) && createScopeMode === "empty") {
    return "非管理員不能選擇留空歸屬。";
  }
  if (mode === "create" && isManagedOrganizationCreateRole(role) && createScopeMode === "create") {
    if (role === "district_leader") {
      return "非管理員不能新建同名區，請選擇既有區。";
    }
    return "";
  }
  if (role === "district_leader" && !scope.district_id) {
    return "非管理員不能選擇留空歸屬。";
  }
  if (BIG_FAMILY_LEADER_ROLES.includes(role) && !scope.big_family_id) {
    return "非管理員不能選擇留空歸屬。";
  }
  if ((SMALL_GROUP_LEADER_ROLES.includes(role) || MEMBER_ROLES.includes(role)) && !scope.small_group_id) {
    return "非管理員不能選擇留空歸屬。";
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
  const showCreateScopeMode = isManagedOrganizationCreateRole(member.role);
  const createScopeModeOptions = showCreateScopeMode
    ? getCreateScopeModeOptions(member.role, member.create_scope_mode)
    : "";
  const districtOptions = getBulkDistrictOptions(member.district_id);
  const bigFamilyOptions = getBulkBigFamilyOptions(member);
  const smallGroupOptions = getBulkSmallGroupOptions(member);
  const createScopeMode = getBulkCreateScopeMode(member.role, member.create_scope_mode);
  const showDistrictField = !showCreateScopeMode || createScopeMode !== "empty";
  const showBigFamilyField = showCreateScopeMode
    ? (
        (BIG_FAMILY_LEADER_ROLES.includes(member.role) && createScopeMode === "existing") ||
        (SMALL_GROUP_LEADER_ROLES.includes(member.role) && createScopeMode !== "empty")
      )
    : true;
  const showSmallGroupField = showCreateScopeMode
    ? SMALL_GROUP_LEADER_ROLES.includes(member.role) && createScopeMode === "existing"
    : true;
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
        ${showCreateScopeMode ? `
        <label>
          <span>歸屬方式</span>
          <select data-bulk-index="${index}" data-bulk-field="create_scope_mode">${createScopeModeOptions}</select>
        </label>
        ` : ""}
        <label>
          <span>性別</span>
          <select data-bulk-index="${index}" data-bulk-field="gender">${getGenderOptions(member.gender)}</select>
        </label>
      </div>
      <div class="bulk-member-scope-grid">
        ${showDistrictField ? `<label>
          <span>所屬區</span>
          <select data-bulk-index="${index}" data-bulk-field="district_id">${districtOptions}</select>
        </label>` : ""}
        ${showBigFamilyField ? `<label>
          <span>所屬大家</span>
          <select data-bulk-index="${index}" data-bulk-field="big_family_id">${bigFamilyOptions}</select>
        </label>` : ""}
        ${showSmallGroupField ? `<label>
          <span>所屬小家</span>
          <select data-bulk-index="${index}" data-bulk-field="small_group_id">${smallGroupOptions}</select>
        </label>` : ""}
      </div>
      ${member.error ? `<p class="bulk-row-error">${escapeHtml(member.error)}</p>` : ""}
    </article>
  `;
}

function getBulkRoleOptions(selectedValue) {
  const viewer = getPermissionCurrentMember();
  const roles = viewer?.is_admin ? ADMIN_CREATE_ROLES : MANAGEMENT_CREATE_ROLES;
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

function getCreateScopeModeOptions(role, selectedValue) {
  const targetLabel = role === "district_leader"
    ? "區"
    : BIG_FAMILY_LEADER_ROLES.includes(role)
      ? "大家"
      : "小家";
  const modes = getAllowedCreateScopeModes(role);
  return renderSelectOptions(
    modes.map((mode) => ({
      value: mode,
      label: mode === "empty"
        ? "留空"
        : mode === "create"
          ? `新建同名${targetLabel}`
          : `既有${targetLabel}`,
    })),
    getAllowedCreateScopeMode(role, selectedValue),
    "請選擇歸屬方式",
    { includePlaceholder: false },
  );
}

function getBulkDistrictOptions(selectedValue) {
  const viewer = getPermissionCurrentMember();
  const districts = viewer?.is_admin
    ? getSelectableDistricts()
    : getSelectableDistricts(viewer?.district_id || 0).filter(
        (district) => district.id === viewer?.district_id,
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
  const viewer = getPermissionCurrentMember();
  const options = getSelectableBigFamilies(Number(member.district_id || 0), Number(member.big_family_id || 0))
    .filter((bigFamily) =>
      viewer?.is_admin ||
      PREACHER_ROLES.includes(viewer?.role) ||
      DISTRICT_PASTOR_ROLES.includes(viewer?.role) ||
      DISTRICT_LEADER_ROLES.includes(viewer?.role) ||
      Number(viewer?.big_family_id || 0) === Number(bigFamily.id),
    )
    .map((bigFamily) => ({
      value: String(bigFamily.id),
      label: getOrganizationDisplayName(bigFamily.name, bigFamily.is_active),
    }));
  return renderSelectOptions(options, member.big_family_id ? String(member.big_family_id) : "", "可留空（無大家）");
}

function getBulkSmallGroupOptions(member) {
  const viewer = getPermissionCurrentMember();
  const options = getSelectableSmallGroups({
    role: member.role,
    districtId: Number(member.district_id || 0),
    bigFamilyId: Number(member.big_family_id || 0),
    includeSmallGroupId: Number(member.small_group_id || 0),
  }).filter((smallGroup) =>
    canManageMemberScope(viewer, {
      district_id: smallGroup.district_id,
      big_family_id: smallGroup.big_family_id,
      small_group_id: smallGroup.id,
    }),
  ).map((smallGroup) => ({
    value: String(smallGroup.id),
    label: [
      getOrganizationDisplayName(smallGroup.name, smallGroup.is_active),
      smallGroup.big_family_name,
      smallGroup.district_name,
    ].filter(Boolean).join(" / "),
  }));
  return renderSelectOptions(options, member.small_group_id ? String(member.small_group_id) : "", "請選擇小家");
}

function renderSelectOptions(items, selectedValue, placeholder, options = {}) {
  const selected = String(selectedValue || "");
  const renderedOptions = options.includePlaceholder === false
    ? []
    : [`<option value=""${selected ? "" : " selected"}>${escapeHtml(placeholder)}</option>`];
  for (const item of items) {
    const value = String(item.value);
    renderedOptions.push(
      `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(item.label)}</option>`,
    );
  }
  return renderedOptions.join("");
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
          ...getAdminModeRequestBody(),
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
    create_scope_mode: getBulkCreateScopeMode(member.role, member.create_scope_mode),
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
        body: {
          ...getAdminModeRequestBody(),
          ...member,
        },
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
  const viewer = getPermissionCurrentMember();
  let roles;
  if (mode === "create") {
    roles = getCreateRoleOptions();
  } else {
    roles = getCreateRoleOptions();
    if (member?.role && !roles.includes(member.role) && canManageRole(viewer?.role, member.role)) {
      roles = [member.role, ...roles];
    }
  }

  fillSelect(
    els.memberRoleSelect,
    roles.map((role) => ({ value: role, label: getRoleLabel(role) })),
    { placeholder: "請選擇身分" },
  );

  els.memberRoleSelect.disabled =
    mode === "edit" && roles.length <= 1;
}

function getCreateRoleOptions() {
  const viewer = getPermissionCurrentMember();
  if (viewer?.is_admin || PREACHER_ROLES.includes(viewer?.role)) {
    return viewer?.is_admin
      ? ADMIN_CREATE_ROLES
      : ADMIN_CREATE_ROLES.filter((role) => canManageRole(viewer.role, role));
  }
  return MANAGEMENT_CREATE_ROLES.filter((role) => canManageRole(viewer?.role, role));
}

function isManagedOrganizationCreateRole(role) {
  return (
    role === "district_leader" ||
    BIG_FAMILY_LEADER_ROLES.includes(role) ||
    SMALL_GROUP_LEADER_ROLES.includes(role)
  );
}

function normalizeCreateScopeMode(value) {
  const mode = String(value || "").trim();
  return CREATE_SCOPE_MODES.includes(mode) ? mode : "empty";
}

function canUseEmptyCreateScopeMode() {
  return Boolean(getPermissionCurrentMember()?.is_admin);
}

function getAllowedCreateScopeModes(role) {
  if (!isManagedOrganizationCreateRole(role)) {
    return ["existing"];
  }
  if (canUseEmptyCreateScopeMode()) {
    return ["empty", "create", "existing"];
  }
  if (role === "district_leader") {
    return ["existing"];
  }
  return ["create", "existing"];
}

function getDefaultCreateScopeMode(role) {
  return getAllowedCreateScopeModes(role)[0] || "existing";
}

function getAllowedCreateScopeMode(role, value) {
  const mode = normalizeCreateScopeMode(value);
  return getAllowedCreateScopeModes(role).includes(mode)
    ? mode
    : getDefaultCreateScopeMode(role);
}

function getMemberCreateScopeMode(role) {
  if (state.ui.editorMode !== "create" || !isManagedOrganizationCreateRole(role)) {
    return "existing";
  }
  return getAllowedCreateScopeMode(role, els.memberCreateScopeModeSelect?.value);
}

function getBulkCreateScopeMode(role, value = els.bulkCreateScopeModeSelect?.value) {
  return isManagedOrganizationCreateRole(role)
    ? getAllowedCreateScopeMode(role, value)
    : "existing";
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
  return state.adminData.districts
    .filter((district) => district.is_active || district.id === includeDistrictId)
    .sort(compareOrganizations);
}

function getSelectableBigFamilies(districtId, includeBigFamilyId = 0) {
  return state.adminData.bigFamilies
    .filter((bigFamily) => {
      const matchesDistrict = districtId
        ? bigFamily.district_id === districtId
        : bigFamily.id === includeBigFamilyId;
      return matchesDistrict && (bigFamily.is_active || bigFamily.id === includeBigFamilyId);
    })
    .sort(compareOrganizations);
}

function getSelectableSmallGroups({
  role,
  districtId,
  bigFamilyId,
  includeSmallGroupId = 0,
}) {
  return state.adminData.smallGroups
    .filter((smallGroup) => {
      if (!districtId && !bigFamilyId) {
        return smallGroup.id === includeSmallGroupId;
      }

      const matchesScope = bigFamilyId
        ? smallGroup.big_family_id === bigFamilyId
        : smallGroup.district_id === districtId && !smallGroup.big_family_id;
      return matchesScope && (smallGroup.is_active || smallGroup.id === includeSmallGroupId);
    })
    .sort(compareOrganizations);
}

function populateDistrictOptions(member) {
  const viewer = getPermissionCurrentMember();
  const includeDistrictId =
    state.ui.editorMode === "edit" ? Number(member?.district_id || 0) : 0;
  els.memberDistrictSelect.multiple = false;
  const districtOptions = getSelectableDistricts(includeDistrictId).map((district) => ({
    value: String(district.id),
    label: getOrganizationDisplayName(district.name, district.is_active),
  }));
  fillSelect(els.memberDistrictSelect, districtOptions, {
    placeholder: districtOptions.length ? "可留空（無區）" : "可留空（無區）",
    keepEmptyOption: true,
  });

  if (viewer?.is_admin) {
    els.memberDistrictSelect.disabled = false;
    if (member?.district_id) {
      els.memberDistrictSelect.value = String(member.district_id);
    }
  } else {
    els.memberDistrictSelect.disabled = DISTRICT_LEADER_ROLES.includes(viewer?.role);
    if (DISTRICT_PASTOR_ROLES.includes(viewer?.role)) {
      const allowedDistrictIds = getDistrictPastorDistrictIds(viewer);
      els.memberDistrictSelect.value = allowedDistrictIds[0] ? String(allowedDistrictIds[0]) : "";
    } else {
      const districtId = String(viewer?.district_id || "");
      els.memberDistrictSelect.value = districtId;
    }
  }
}

function isMultiDistrictRole(role) {
  return PREACHER_ROLES.includes(role) || DISTRICT_PASTOR_ROLES.includes(role);
}

function usesMultiDistrictSelect(role) {
  return isMultiDistrictRole(role);
}

function setSelectedDistrictIds(ids) {
  const selected = new Set((ids || []).map((id) => String(id)));
  els.memberManagedDistrictList
    ?.querySelectorAll('input[type="checkbox"][data-district-id]')
    .forEach((input) => {
      input.checked = selected.has(input.dataset.districtId);
    });
}

function getSelectedDistrictIds() {
  return Array.from(
    els.memberManagedDistrictList?.querySelectorAll('input[type="checkbox"][data-district-id]:checked') || [],
  )
    .map((input) => Number(input.dataset.districtId || 0))
    .filter((value) => Number.isInteger(value) && value > 0);
}

function renderManagedDistrictOptions(member = null) {
  if (!els.memberManagedDistrictList) {
    return;
  }

  const viewer = getPermissionCurrentMember();
  const role = els.memberRoleSelect.value || "";
  const memberKey = String(member?.id || "new");
  const shouldPreserveSelection =
    els.memberManagedDistrictList.dataset.role === role &&
    els.memberManagedDistrictList.dataset.memberKey === memberKey;
  const selectedIds = shouldPreserveSelection
    ? getSelectedDistrictIds()
    : member
      ? getDistrictPastorDistrictIds(member)
      : [];
  const districtOptions = getSelectableDistricts()
    .filter((district) => canManageMemberDistrict(viewer, district.id));
  els.memberManagedDistrictList.innerHTML = districtOptions.length
    ? districtOptions
      .map(
        (district) => `
          <label class="checkbox-row district-check-row">
            <input type="checkbox" data-district-id="${district.id}" />
            <span>${escapeHtml(getOrganizationDisplayName(district.name, district.is_active))}</span>
          </label>
        `,
      )
      .join("")
    : '<p class="muted">目前沒有可選區域。</p>';
  els.memberManagedDistrictList.dataset.role = role;
  els.memberManagedDistrictList.dataset.memberKey = memberKey;
  setSelectedDistrictIds(selectedIds);
}

function syncEditorBigFamilyOptions(member = null) {
  const viewer = getPermissionCurrentMember();
  const districtId = Number(els.memberDistrictSelect.value || 0);
  const includeBigFamilyId =
    Number(member?.big_family_id || els.memberBigFamilySelect.value || 0);
  const available = getSelectableBigFamilies(districtId, includeBigFamilyId)
    .filter((bigFamily) =>
      viewer?.is_admin ||
      PREACHER_ROLES.includes(viewer?.role) ||
      DISTRICT_PASTOR_ROLES.includes(viewer?.role) ||
      DISTRICT_LEADER_ROLES.includes(viewer?.role) ||
      Number(viewer?.big_family_id || 0) === Number(bigFamily.id),
    );

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
  } else if (member) {
    els.memberBigFamilySelect.value = "";
  }
}

function syncEditorSmallGroupOptions(member = null) {
  const viewer = getPermissionCurrentMember();
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
  }).filter((smallGroup) =>
    canManageMemberScope(viewer, {
      district_id: smallGroup.district_id,
      big_family_id: smallGroup.big_family_id,
      small_group_id: smallGroup.id,
    }),
  );

  fillSelect(
    els.memberSmallGroupSelect,
    available.map((smallGroup) => ({
      value: String(smallGroup.id),
      label:
        MEMBER_ROLES.includes(role) || PREACHER_ROLES.includes(role)
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
      keepEmptyOption: !available.length ||
        Boolean(viewer?.is_admin) ||
        !(SMALL_GROUP_LEADER_ROLES.includes(role) || MEMBER_ROLES.includes(role)),
    },
  );

  if (member?.small_group_id) {
    els.memberSmallGroupSelect.value = String(member.small_group_id);
  } else if (member) {
    els.memberSmallGroupSelect.value = "";
  }
}

function fillMemberForm(mode, member) {
  const viewer = getPermissionCurrentMember();
  if (mode === "create") {
    els.memberEditorTitle.textContent = "新增人員";
    els.memberEditorHint.textContent = viewer?.is_admin
      ? "管理員可建立所有職分；新增區長、大家長或小家長時可選留空、新建同名或加入既有組織。"
      : "可建立自己管理範圍內的人員；新增管理職時需選擇既有組織或在自己範圍內新建同名組織。";
    els.memberNameInput.value = "";
    els.memberGenderSelect.value = "";
    els.memberEquipmentProgressSelect.value = "none";
    els.memberCreateScopeModeSelect.value = getDefaultCreateScopeMode(els.memberRoleSelect.value);
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
    els.memberEditorHint.textContent = viewer?.is_admin
      ? "管理員可調整所有資料與職分。"
      : "可編輯自己管理範圍內的人員；儲存後仍需留在自己的管理範圍。";
    els.memberNameInput.value = member.full_name || "";
    els.memberRoleSelect.value = member.role;
    els.memberGenderSelect.value = member.gender || "";
    els.memberEquipmentProgressSelect.value = normalizeEquipmentProgress(member.equipment_progress);
    els.memberNoteInput.value = member.note || "";
    els.memberActiveSelect.value = member.is_active ? "true" : "false";
    els.memberIsAdminInput.checked = Boolean(member.is_admin);
    els.memberIsAdminWrap.open = false;
  }
}

function syncMemberFormScope() {
  const viewer = getPermissionCurrentMember();
  const role = els.memberRoleSelect.value;
  const isCreateMode = state.ui.editorMode === "create";
  const isEditMode = state.ui.editorMode === "edit";
  const isMemberRole = MEMBER_ROLES.includes(role);
  const editingMember = isEditMode
    ? state.adminData.members.find((member) => member.id === state.ui.editingMemberId)
    : null;
  const createScopeMode = getMemberCreateScopeMode(role);
  const isManagedCreateRole = isCreateMode && isManagedOrganizationCreateRole(role);
  const needsBigFamily =
    isManagedCreateRole
      ? (
          (BIG_FAMILY_LEADER_ROLES.includes(role) && createScopeMode === "existing") ||
          (SMALL_GROUP_LEADER_ROLES.includes(role) && createScopeMode !== "empty")
        )
      : isMemberRole
        ? true
        : PREACHER_ROLES.includes(role)
          ? true
          : BIG_FAMILY_LEADER_ROLES.includes(role)
            ? !isCreateMode
            : SMALL_GROUP_LEADER_ROLES.includes(role)
              ? true
              : false;
  const showSmallGroupField =
    isManagedCreateRole
      ? SMALL_GROUP_LEADER_ROLES.includes(role) && createScopeMode === "existing"
      : PREACHER_ROLES.includes(role) ||
        isMemberRole ||
        (SMALL_GROUP_LEADER_ROLES.includes(role) && !isCreateMode);
  const showDistrictField =
    isManagedCreateRole
      ? createScopeMode !== "empty"
      : isMemberRole ||
        (!DISTRICT_PASTOR_ROLES.includes(role) &&
          !(role === "district_leader" && isCreateMode));
  const showManagedDistricts = usesMultiDistrictSelect(role);
  const districtRequired =
    isManagedCreateRole
      ? (
          createScopeMode === "create" &&
          (BIG_FAMILY_LEADER_ROLES.includes(role) || SMALL_GROUP_LEADER_ROLES.includes(role))
        )
      : PREACHER_ROLES.includes(role)
      ? false
      : isCreateMode &&
        (isMemberRole || BIG_FAMILY_LEADER_ROLES.includes(role) || SMALL_GROUP_LEADER_ROLES.includes(role));

  setHidden(els.memberDistrictLabel, !showDistrictField);
  setHidden(els.memberCreateScopeModeLabel, !isManagedCreateRole);
  setHidden(els.memberBigFamilyLabel, !needsBigFamily);
  setHidden(els.memberSmallGroupLabel, !showSmallGroupField);
  setHidden(els.memberManagedDistrictWrap, !showManagedDistricts);
  const canEditAdminPermission = Boolean(isAdminModeActive() && isEditMode);
  setHidden(els.memberIsAdminWrap, !canEditAdminPermission);

  els.memberDistrictSelect.required = districtRequired;
  els.memberDistrictSelect.multiple = false;
  els.memberDistrictLabel.querySelector("span").textContent = PREACHER_ROLES.includes(role)
      ? "所屬區（可留空）"
      : "所屬區";
  renderManagedDistrictOptions(editingMember);
  els.memberBigFamilySelect.required = false;
  els.memberSmallGroupSelect.required =
    isMemberRole ||
    (isManagedCreateRole && SMALL_GROUP_LEADER_ROLES.includes(role) && createScopeMode === "existing");
  const canEditActiveStatus = canEditMemberActiveStatus(editingMember);
  setHidden(els.memberActiveLabel, !canEditActiveStatus);
  els.memberActiveSelect.disabled = !canEditActiveStatus;
  els.memberIsAdminInput.disabled = !canEditAdminPermission;
  els.memberCreateScopeModeSelect.disabled = !isManagedCreateRole;
  if (isManagedCreateRole) {
    els.memberCreateScopeModeSelect.innerHTML = getCreateScopeModeOptions(role, createScopeMode);
    els.memberCreateScopeModeSelect.value = createScopeMode;
  }

  if (!canEditAdminPermission) {
    els.memberIsAdminInput.checked = false;
    els.memberIsAdminWrap.open = false;
  }

  const hints = {
    preacher: isCreateMode
      ? "傳道人可指定管理區域；組織樹會優先依小家、大家、區的最低歸屬顯示，未設定單一歸屬且管理多區時才顯示於區牧位置。"
      : "傳道人可指定管理區域；組織樹會優先依小家、大家、區的最低歸屬顯示，未設定單一歸屬且管理多區時才顯示於區牧位置。",
    trainee_preacher: "實習傳道人與傳道人同權限；組織樹會優先依最低歸屬顯示，未設定單一歸屬且管理多區時才顯示於區牧位置。",
    district_pastor: "區牧可管理多個指定區；若暫時不指定，可保持空白不要選任何區。",
    district_leader: isCreateMode
      ? (viewer?.is_admin ? "新增區長可留空、選既有區，或新建「姓名區」。" : "新增區長需選擇既有區。")
      : (viewer?.is_admin ? "編輯區長時，可調整基本資料；所屬區也可留空。" : "編輯區長時需保留在可管理區內。"),
    big_family_leader: isCreateMode
      ? (viewer?.is_admin ? "新增大家長可留空、加入既有大家，或選區後新建「姓名大家」。" : "新增大家長需加入既有大家，或在可管理區內新建同名大家。")
      : (viewer?.is_admin ? "編輯大家長時，可調整基本資料；所屬區/大家可留空。" : "編輯大家長時需保留所屬大家。"),
    trainee_big_family_leader: isCreateMode
      ? (viewer?.is_admin ? "新增實習大家長可留空、加入既有大家，或選區後新建「姓名大家」。" : "新增實習大家長需加入既有大家，或在可管理區內新建同名大家。")
      : "實習大家長與大家長同權限；非管理員儲存時需保留所屬大家。",
    small_group_leader: isCreateMode
      ? (viewer?.is_admin ? "新增小家長可留空、加入既有小家，或選區後新建「姓名小家」。" : "新增小家長需加入既有小家，或在可管理範圍內新建同名小家。")
      : (viewer?.is_admin ? "編輯小家長時，可調整基本資料；區、大家與小家都可暫時留空。" : "編輯小家長時需保留所屬小家。"),
    trainee_small_group_leader: isCreateMode
      ? (viewer?.is_admin ? "新增實習小家長可留空、加入既有小家，或選區後新建「姓名小家」。" : "新增實習小家長需加入既有小家，或在可管理範圍內新建同名小家。")
      : "實習小家長與小家長同權限；非管理員儲存時需保留所屬小家。",
    member: isCreateMode
      ? "新增小家人時，只要選小家，系統會自動帶出上層歸屬。"
      : (viewer?.is_admin ? "編輯小家人時，可改派小家；若要暫時不歸屬任何小家，也可留空。" : "編輯小家人時需選擇自己可管理的小家。"),
    best: isCreateMode
      ? "新增新朋友時，只要選小家，系統會自動帶出上層歸屬。"
      : (viewer?.is_admin ? "編輯新朋友時，可改派小家；若要暫時不歸屬任何小家，也可留空。" : "編輯新朋友時需選擇自己可管理的小家。"),
  };
  els.memberScopeHint.textContent = hints[role] || "請選擇正確的職分與層級。";
}

async function handleSaveMember(event) {
  event.preventDefault();
  const mode = state.ui.editorMode;
  if (!mode) {
    return;
  }

  const role = els.memberRoleSelect.value;
  const usesManagedDistricts = usesMultiDistrictSelect(role);
  const shouldClearSingleDistrict = DISTRICT_PASTOR_ROLES.includes(role);
  const createScopeMode = getMemberCreateScopeMode(role);
  const body = {
    full_name: els.memberNameInput.value.trim(),
    role,
    create_scope_mode: mode === "create" ? createScopeMode : undefined,
    gender: els.memberGenderSelect.value || null,
    equipment_progress: normalizeEquipmentProgress(els.memberEquipmentProgressSelect.value),
    note: els.memberNoteInput.value.trim(),
    district_id: shouldClearSingleDistrict
      ? null
      : Number(els.memberDistrictSelect.value || 0) || null,
    district_ids: usesManagedDistricts
      ? getSelectedDistrictIds()
      : [],
    big_family_id: DISTRICT_PASTOR_ROLES.includes(role)
      ? null
      : Number(els.memberBigFamilySelect.value || 0) || null,
    small_group_id: DISTRICT_PASTOR_ROLES.includes(role)
      ? null
      : Number(els.memberSmallGroupSelect.value || 0) || null,
    is_admin: els.memberIsAdminInput.checked,
    is_active: els.memberActiveSelect.value === "true",
  };
  if (mode === "create" && isManagedOrganizationCreateRole(body.role)) {
    if (createScopeMode === "empty") {
      body.district_id = null;
      body.big_family_id = null;
      body.small_group_id = null;
    } else if (createScopeMode === "create") {
      body.small_group_id = null;
      if (body.role === "district_leader") {
        body.district_id = null;
        body.big_family_id = null;
      } else if (BIG_FAMILY_LEADER_ROLES.includes(body.role)) {
        body.big_family_id = null;
      }
    }
  }

  if (!body.full_name || !body.role) {
    showToast("請完整填寫姓名與身分。");
    return;
  }

  if (mode === "create" && !canCreateMembers()) {
    showToast("新增人員請由區長或以上職分處理。");
    return;
  }

  if (
    (BIG_FAMILY_LEADER_ROLES.includes(body.role) || SMALL_GROUP_LEADER_ROLES.includes(body.role)) &&
    !body.district_id &&
    state.ui.editorMode === "create" &&
    !isManagedOrganizationCreateRole(body.role)
  ) {
    showToast("此身分至少需要指定所屬區。");
    return;
  }

  if (mode === "create" && isManagedOrganizationCreateRole(body.role)) {
    if (
      createScopeMode === "create" &&
      (BIG_FAMILY_LEADER_ROLES.includes(body.role) || SMALL_GROUP_LEADER_ROLES.includes(body.role)) &&
      !body.district_id
    ) {
      showToast("新建同名大家或小家時，請先選擇所屬區。");
      return;
    }
    if (createScopeMode === "existing") {
      if (body.role === "district_leader" && !body.district_id) {
        showToast("加入既有區時，請選擇所屬區。");
        return;
      }
      if (BIG_FAMILY_LEADER_ROLES.includes(body.role) && !body.big_family_id) {
        showToast("加入既有大家時，請選擇所屬大家。");
        return;
      }
      if (SMALL_GROUP_LEADER_ROLES.includes(body.role) && !body.small_group_id) {
        showToast("加入既有小家時，請選擇所屬小家。");
        return;
      }
    }
  }

  if (MEMBER_ROLES.includes(body.role) && !body.small_group_id && mode === "create") {
    showToast("新增小家人或新朋友時，請先選擇所屬小家。");
    return;
  }

  const viewer = getPermissionCurrentMember();
  const scopeError = getNonAdminScopeError(body.role, body, createScopeMode, mode);
  if (scopeError) {
    showToast(scopeError);
    return;
  }
  if (!viewer?.is_admin && !canManageMemberScope(viewer, body)) {
    showToast("只能儲存到自己管理範圍內。");
    return;
  }

  if (mode === "create") {
    body.is_admin = false;
  } else {
    const originalMember = state.adminData.members.find(
      (member) => member.id === state.ui.editingMemberId,
    );
    if (originalMember && !canEditMemberActiveStatus(originalMember)) {
      body.is_active = Boolean(originalMember.is_active);
    }
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
    const data = await apiRequest(action, {
      method: "POST",
      authMode: "app",
      body: {
        ...getAdminModeRequestBody(),
        ...requestBody,
      },
    });
    const updatedMemberId = mode === "create"
      ? Number(data?.member?.id || 0)
      : Number(state.ui.editingMemberId || 0);
    if (updatedMemberId) {
      await apiRequest("update-equipment-progress", {
        method: "POST",
        authMode: "app",
        functionName: "member-equipment-progress",
        body: {
          ...getAdminModeRequestBody(),
          member_id: updatedMemberId,
          equipment_progress: body.equipment_progress,
        },
      });
    }
    const accessChanged = syncCurrentMemberAccess(data?.member);

    closeMemberEditor();
    if (accessChanged) {
      renderLayout();
    }
    await Promise.all([loadAdminPanel(), loadDashboard({ skipDirtyCheck: true })]);
    if (state.ui.activeTab === TABS.overview && canUseOverview()) {
      await loadAttendanceOverview(state.ui.overviewWeekStart);
    }
    showToast(mode === "create" ? "已建立新的人員資料。" : "人員資料已更新。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "儲存人員資料失敗。");
  } finally {
    setButtonLoading(els.memberSubmitBtn, false);
  }
}

function getManagedActiveDistricts() {
  const viewer = getPermissionCurrentMember();
  return state.adminData.districts.filter(
    (district) => district.is_active && canManageMemberDistrict(viewer, district.id),
  );
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
  const viewer = getPermissionCurrentMember();
  const activeDistricts = getManagedActiveDistricts();
  const canEditOrganizations = Boolean(
    viewer?.is_admin ||
      (
        activeDistricts.length > 0 &&
        (
          PREACHER_ROLES.includes(viewer?.role) ||
          DISTRICT_PASTOR_ROLES.includes(viewer?.role) ||
          DISTRICT_LEADER_ROLES.includes(viewer?.role)
        )
      ),
  );
  setHidden(els.orgManagementPanel, !canEditOrganizations);
  setHidden(els.orgCreatePanel, !canEditOrganizations);
  if (!canEditOrganizations) {
    closeOrgEditor();
    closeCreateOrgSheets();
    return;
  }
  setHidden(els.districtDetails, !viewer?.is_admin);

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

  if (!viewer?.is_admin) {
    const currentDistrict = activeDistricts.find(
      (district) => district.id === viewer?.district_id,
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
  const available = state.adminData.bigFamilies
    .filter((bigFamily) => {
      return bigFamily.is_active && (districtId ? bigFamily.district_id === districtId : true);
    })
    .sort(compareOrganizations);

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
  const available = state.adminData.bigFamilies
    .filter((bigFamily) => {
      return bigFamily.is_active && (districtId ? bigFamily.district_id === districtId : true);
    })
    .sort(compareOrganizations);

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

function getCreateOrgDetails() {
  return [els.districtDetails, els.bigFamilyDetails, els.smallGroupDetails].filter(Boolean);
}

function handleCreateOrgDetailsToggle(event) {
  const openedDetails = event.target;
  if (openedDetails.open) {
    closeOrgEditor();
    for (const details of getCreateOrgDetails()) {
      if (details !== openedDetails) {
        details.open = false;
      }
    }
  }
  syncCreateOrgSheetBackdrop();
}

function syncCreateOrgSheetBackdrop() {
  setHidden(
    els.orgCreateBackdrop,
    !getCreateOrgDetails().some((details) => details.open),
  );
}

function closeCreateOrgSheets() {
  for (const details of getCreateOrgDetails()) {
    details.open = false;
  }
  setHidden(els.orgCreateBackdrop, true);
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
    closeCreateOrgSheets();
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
    closeCreateOrgSheets();
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
    closeCreateOrgSheets();
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
  renderOrganizationTree();
  renderOrganizationDirectory();
  restoreOrganizationFocus();
}

function renderOrganizationTree() {
  if (!els.orgTreeBody) {
    return;
  }

  const canMeasureTree = isOrganizationTreeMeasurable();
  const viewportCenter = canMeasureTree ? getOrganizationTreeViewportCenter() : null;
  if (!canMeasureTree) {
    orgTreeViewState.needsInitialPlacement = true;
  }
  syncOrganizationTreeControls();
  syncOrganizationTreePanel();
  els.orgTreeBody.classList.toggle("is-compact-tree", state.ui.orgTreeMode !== "vertical");
  els.orgTreeBody.classList.toggle("is-vertical-tree", state.ui.orgTreeMode === "vertical");

  const districts = [...state.adminData.districts].sort(compareOrganizations);
  const districtGroups = buildOrganizationTreeDistrictGroups(districts);
  const unassignedMembers = sortMembers(
    state.adminData.members.filter(isOrganizationTreeUnassignedMember),
  );
  const rootItems = [
    unassignedMembers.length ? renderOrganizationTreeUnassignedMembers(unassignedMembers) : "",
    ...districtGroups.map((group) => renderOrganizationTreeDistrictGroup(group)),
  ].filter(Boolean);

  if (!rootItems.length) {
    els.orgTreeBody.innerHTML = '<div class="empty-state-card">尚未建立組織，建立後會在此顯示樹狀圖。</div>';
    applyOrganizationTreeScale(state.ui.orgTreeScale);
    return;
  }

  const districtColumns = getOrganizationTreeDistrictColumns(rootItems.length);
  els.orgTreeBody.innerHTML = `
    <div class="org-tree-scaled-shell">
      <div class="org-tree-canvas" style="--org-tree-district-columns: ${districtColumns}">
        ${rootItems.join("")}
      </div>
    </div>
  `;
  resetOrganizationTreeConnectors();
  applyOrganizationTreeScale(state.ui.orgTreeScale, { syncConnectors: false });
  if (viewportCenter && !orgTreeViewState.needsInitialPlacement) {
    restoreOrganizationTreeViewportCenter(viewportCenter);
  }
  scheduleOrganizationTreeConnectorSync({
    placeTopCenter: orgTreeViewState.needsInitialPlacement,
  });
}

function getOrganizationTreeDistrictColumns(districtCount) {
  if (districtCount <= 2) {
    return Math.max(1, districtCount);
  }
  return Math.min(4, Math.ceil(Math.sqrt(districtCount)));
}

function buildOrganizationTreeDistrictGroups(districts) {
  const districtById = new Map(districts.map((district, index) => [
    Number(district.id),
    { district, index },
  ]));
  const assignedDistrictIds = new Set();
  const groups = [];

  const districtPastors = sortMembers(
    state.adminData.members.filter(isOrganizationTreeDistrictPastor),
  );
  for (const pastor of districtPastors) {
    const managedDistrictIds = getDistrictPastorDistrictIds(pastor);
    const fallbackDistrictId = Number(pastor.district_id || 0);
    const districtIds = (managedDistrictIds.length ? managedDistrictIds : [fallbackDistrictId])
      .filter((districtId) => districtById.has(districtId) && !assignedDistrictIds.has(districtId));
    if (!districtIds.length) {
      continue;
    }

    const groupDistricts = districtIds
      .map((districtId) => districtById.get(districtId))
      .sort((left, right) => left.index - right.index);
    groupDistricts.forEach(({ district }) => assignedDistrictIds.add(Number(district.id)));
    groups.push({
      key: `pastor:${pastor.id}`,
      pastor,
      districts: groupDistricts.map(({ district }) => district),
      displayOrder: groupDistricts[0]?.index ?? districts.length,
    });
  }

  const unmanagedDistricts = districts.filter((district) => !assignedDistrictIds.has(Number(district.id)));
  if (unmanagedDistricts.length) {
    groups.push({
      key: "districts:unmanaged",
      pastor: null,
      districts: unmanagedDistricts,
      displayOrder: districts.findIndex((district) => Number(district.id) === Number(unmanagedDistricts[0].id)),
    });
  }

  return groups.sort((left, right) => left.displayOrder - right.displayOrder);
}

function renderOrganizationTreeUnassignedMembers(members) {
  const nodeKey = getOrganizationTreeKey("member_bucket", "direct");
  const isCollapsed = state.ui.orgTreeCollapsedKeys.has(nodeKey);
  const summary = buildOrganizationNodeSummary({ memberCount: members.length });
  return `
    <article class="org-flow-row org-flow-unassigned ${isCollapsed ? "is-collapsed" : ""}">
      <div class="org-flow-column org-flow-column-unassigned">
        ${renderOrganizationFlowNode("unassigned", "特殊職務", { nodeKey, isCollapsed, summary })}
      </div>
      <div class="org-flow-members org-flow-unassigned-members org-flow-children">
        ${members.map(renderOrganizationTreeMember).join("")}
      </div>
    </article>
  `;
}

function renderOrganizationTreeDistrictGroup(group) {
  const hasPastor = Boolean(group.pastor);
  const pastorLabel = hasPastor ? `${group.pastor.full_name} 管理區群` : "";
  const rowClass = group.districts.length > 1 ? "has-multiple-districts" : "has-single-district";
  return `
    <section class="org-flow-district-group ${hasPastor ? "has-pastor" : "has-no-pastor"}" data-district-group-key="${escapeHtml(group.key)}">
      <div class="org-flow-district-group-pastor" ${hasPastor ? `aria-label="${escapeHtml(pastorLabel)}"` : 'aria-hidden="true"'}>
        ${hasPastor ? renderOrganizationTreeMember(group.pastor) : ""}
      </div>
      <div class="org-flow-district-group-connector ${rowClass}" aria-hidden="true"></div>
      <div class="org-flow-district-group-rows ${rowClass}">
        ${group.districts.map((district) => `
          <div class="org-flow-district-group-item">
            ${renderOrganizationTreeDistrict(district)}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderOrganizationTreeDistrict(district) {
  const districtLeaders = sortMembers(
    state.adminData.members.filter((member) => isOrganizationTreeDistrictLeader(member, district.id)),
  );
  const bigFamilies = state.adminData.bigFamilies
    .filter((bigFamily) => bigFamily.district_id === district.id)
    .sort(compareOrganizations);
  const directSmallGroups = state.adminData.smallGroups
    .filter((smallGroup) => smallGroup.district_id === district.id && !smallGroup.big_family_id)
    .sort(compareOrganizations);
  const directMembers = sortMembers(
    state.adminData.members.filter(
      (member) =>
        member.is_active !== false &&
        !isOrganizationTreeDistrictPastor(member) &&
        member.district_id === district.id &&
        !member.big_family_id &&
        !member.small_group_id &&
        !isOrganizationTreeDistrictLeader(member, district.id),
    ),
  );
  const nodeKey = getOrganizationTreeKey("district", district.id);
  const isCollapsed = state.ui.orgTreeCollapsedKeys.has(nodeKey);
  const childCount = bigFamilies.length + directSmallGroups.length + (directMembers.length ? 1 : 0);
  const summary = buildOrganizationNodeSummary({
    bigFamilyCount: bigFamilies.length,
    smallGroupCount: countOrganizationTreeSmallGroupsByDistrict(district.id),
    memberCount: countOrganizationTreeMembersByScope({ districtId: district.id }),
  });
  const childClass = [
    getOrganizationTreeChildrenClass(childCount),
    directSmallGroups.length ? "has-direct-small-groups" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <article class="org-flow-row ${district.is_active ? "" : "is-archived"} ${isCollapsed ? "is-collapsed" : ""}">
      <div class="org-flow-column org-flow-column-district">
        ${renderOrganizationFlowNode("district", district.name, { isActive: district.is_active, nodeKey, isCollapsed, summary })}
        ${renderOrganizationTreeLeaderStrip("區領袖", districtLeaders)}
      </div>
      <div class="org-flow-branches org-flow-children ${childClass}">
        ${bigFamilies.map((bigFamily) => renderOrganizationTreeBigFamily(bigFamily)).join("")}
        ${directSmallGroups.map((smallGroup) => renderOrganizationTreeSmallGroup(smallGroup)).join("")}
        ${directMembers.length ? renderOrganizationTreeMemberBucket("待分類", directMembers, `district:${district.id}:pending`) : ""}
        ${bigFamilies.length || directSmallGroups.length || directMembers.length ? "" : '<div class="org-flow-empty">尚未建立大家或小家</div>'}
      </div>
    </article>
  `;
}

function renderOrganizationTreeBigFamily(bigFamily) {
  const bigFamilyLeaders = sortMembers(
    state.adminData.members.filter((member) => isOrganizationTreeBigFamilyLeader(member, bigFamily.id)),
  );
  const smallGroups = state.adminData.smallGroups
    .filter((smallGroup) => smallGroup.big_family_id === bigFamily.id)
    .sort(compareOrganizations);
  const directMembers = sortMembers(
    state.adminData.members.filter(
      (member) =>
        member.is_active !== false &&
        !isOrganizationTreeDistrictPastor(member) &&
        member.big_family_id === bigFamily.id &&
        !member.small_group_id &&
        !isOrganizationTreeBigFamilyLeader(member, bigFamily.id),
    ),
  );
  const nodeKey = getOrganizationTreeKey("big_family", bigFamily.id);
  const isCollapsed = state.ui.orgTreeCollapsedKeys.has(nodeKey);
  const childCount = smallGroups.length + (directMembers.length ? 1 : 0);
  const summary = buildOrganizationNodeSummary({
    smallGroupCount: smallGroups.length,
    memberCount: countOrganizationTreeMembersByScope({ bigFamilyId: bigFamily.id }),
  });

  return `
    <div class="org-flow-branch ${bigFamily.is_active ? "" : "is-archived"} ${isCollapsed ? "is-collapsed" : ""}">
      <div class="org-flow-column org-flow-column-big">
        ${renderOrganizationFlowNode("big_family", bigFamily.name, { isActive: bigFamily.is_active, nodeKey, isCollapsed, summary })}
        ${renderOrganizationTreeLeaderStrip("大家領袖", bigFamilyLeaders)}
      </div>
      <div class="org-flow-branches org-flow-small-branches org-flow-children ${getOrganizationTreeChildrenClass(childCount)}">
        ${smallGroups.map((smallGroup) => renderOrganizationTreeSmallGroup(smallGroup)).join("")}
        ${directMembers.length ? renderOrganizationTreeMemberBucket("待分類", directMembers, `big_family:${bigFamily.id}:pending`) : ""}
        ${smallGroups.length || directMembers.length ? "" : '<div class="org-flow-empty">尚未建立小家</div>'}
      </div>
    </div>
  `;
}

function renderOrganizationTreeMemberBucket(label, members, keyHint = label) {
  const nodeKey = getOrganizationTreeKey("member_bucket", keyHint);
  const isCollapsed = state.ui.orgTreeCollapsedKeys.has(nodeKey);
  const summary = buildOrganizationNodeSummary({ memberCount: members.length });
  return `
    <div class="org-flow-branch org-flow-small-branch ${isCollapsed ? "is-collapsed" : ""}">
      <div class="org-flow-column org-flow-column-small">
        ${renderOrganizationFlowNode("member_bucket", label, { nodeKey, isCollapsed, summary })}
      </div>
      <div class="org-flow-members org-flow-children">
        ${members.map(renderOrganizationTreeMember).join("")}
      </div>
    </div>
  `;
}

function renderOrganizationTreeSmallGroup(smallGroup) {
  const members = sortMembers(
    state.adminData.members.filter(
      (member) =>
        member.is_active !== false &&
        !isOrganizationTreeDistrictPastor(member) &&
        member.small_group_id === smallGroup.id &&
        !isOrganizationTreeDistrictLeader(member, smallGroup.district_id) &&
        !isOrganizationTreeBigFamilyLeader(member, smallGroup.big_family_id),
    ),
  );
  const nodeKey = getOrganizationTreeKey("small_group", smallGroup.id);
  const isCollapsed = state.ui.orgTreeCollapsedKeys.has(nodeKey);
  const summary = buildOrganizationNodeSummary({ memberCount: members.length });

  return `
    <div class="org-flow-branch org-flow-small-branch ${smallGroup.is_active ? "" : "is-archived"} ${isCollapsed ? "is-collapsed" : ""}">
      <div class="org-flow-column org-flow-column-small">
        ${renderOrganizationFlowNode("small_group", smallGroup.name, { isActive: smallGroup.is_active, nodeKey, isCollapsed, summary })}
      </div>
      <div class="org-flow-members org-flow-children">
        ${members.length
          ? members.map(renderOrganizationTreeMember).join("")
          : '<span class="org-flow-empty">尚無人員</span>'}
      </div>
    </div>
  `;
}

function renderOrganizationTreeLeaderStrip(label, members) {
  if (!members.length) {
    return "";
  }
  return `
    <div class="org-flow-leader-strip" aria-label="${escapeHtml(label)}">
      <div class="org-flow-leaders">
        ${members.map(renderOrganizationTreeMember).join("")}
      </div>
    </div>
  `;
}

function renderOrganizationTreeMember(member) {
  const genderClass = getOrganizationTreeGenderClass(member.gender);
  const roleClass = `role-${escapeHtml(member.role || "member")}`;
  return `
    <span class="org-member-pill equipment-surface ${escapeHtml(getEquipmentProgressClass(member.equipment_progress))} ${member.is_active ? "" : "is-inactive"}">
      <strong class="name-card ${genderClass}">${escapeHtml(member.full_name)}</strong>
      <span class="role-pill ${roleClass}">${escapeHtml(getRoleLabel(member.role))}</span>
    </span>
  `;
}

function getOrganizationTreeGenderClass(gender) {
  if (gender === "brother" || gender === "male") {
    return "gender-brother";
  }
  if (gender === "sister" || gender === "female") {
    return "gender-sister";
  }
  return "gender-unknown";
}

function isOrganizationTreeActiveMember(member) {
  return Boolean(member && member.is_active !== false);
}

function isOrganizationTreeUnassignedMember(member) {
  return (
    isOrganizationTreeActiveMember(member) &&
    !isOrganizationTreeDistrictPastor(member) &&
    !member.district_id &&
    !member.big_family_id &&
    !member.small_group_id &&
    !getDistrictPastorDistrictIds(member).length
  );
}

function isOrganizationTreeDistrictPastor(member) {
  return (
    isOrganizationTreeActiveMember(member) &&
    isPastoralLeaderRole(member.role) &&
    !member.big_family_id &&
    !member.small_group_id &&
    getDistrictPastorDistrictIds(member).length > 0
  );
}

function isOrganizationTreeDistrictLeader(member, districtId) {
  if (!isOrganizationTreeActiveMember(member) || !districtId) {
    return false;
  }
  if (member.role === "district_leader") {
    return Number(member.district_id || 0) === Number(districtId);
  }
  if (isPastoralLeaderRole(member.role) && !member.big_family_id && !member.small_group_id) {
    const managedDistrictIds = getDistrictPastorDistrictIds(member);
    if (managedDistrictIds.length) {
      return false;
    }
    const districtScopeId = Number(member.district_id || managedDistrictIds[0] || 0);
    return managedDistrictIds.length <= 1 && districtScopeId === Number(districtId);
  }
  return false;
}

function isOrganizationTreeBigFamilyLeader(member, bigFamilyId) {
  if (!bigFamilyId) {
    return false;
  }
  return (
    isOrganizationTreeActiveMember(member) &&
    (
      BIG_FAMILY_LEADER_ROLES.includes(member.role) ||
      (isPastoralLeaderRole(member.role) && !member.small_group_id)
    ) &&
    Number(member.big_family_id || 0) === Number(bigFamilyId || 0)
  );
}

function isPastoralLeaderRole(role) {
  return role === "district_pastor" || PREACHER_ROLES.includes(role);
}

function renderOrganizationFlowNode(type, name, { isActive = true, nodeKey = "", isCollapsed = false, summary = "" } = {}) {
  const canCollapse = Boolean(nodeKey);
  return `
    <div
      class="org-flow-node org-flow-node-${escapeHtml(type)} ${isActive ? "" : "is-archived"} ${isCollapsed ? "is-collapsed" : ""} ${canCollapse ? "is-clickable" : ""}"
      ${canCollapse ? `data-org-tree-key="${escapeHtml(nodeKey)}" title="點擊可${isCollapsed ? "展開" : "收合"}" role="button" tabindex="0" aria-expanded="${isCollapsed ? "false" : "true"}"` : ""}
    >
      <strong>${escapeHtml(name)}</strong>
      ${summary ? `<span class="org-flow-node-summary">${escapeHtml(summary)}</span>` : ""}
    </div>
  `;
}

function buildOrganizationNodeSummary({
  bigFamilyCount = 0,
  smallGroupCount = 0,
  memberCount = 0,
} = {}) {
  return [
    bigFamilyCount ? `${bigFamilyCount} 大家` : "",
    smallGroupCount ? `${smallGroupCount} 小家` : "",
    memberCount ? `${memberCount} 人` : "",
  ].filter(Boolean).join(" / ");
}

function countOrganizationTreeMembersByScope({ districtId = 0, bigFamilyId = 0, smallGroupId = 0 } = {}) {
  return countOrganizationTreePeople(
    state.adminData.members.filter((member) => {
      if (member.is_active === false) {
        return false;
      }
      if (smallGroupId) {
        return Number(member.small_group_id || 0) === Number(smallGroupId);
      }
      if (bigFamilyId) {
        return Number(member.big_family_id || 0) === Number(bigFamilyId);
      }
      if (districtId) {
        return Number(member.district_id || 0) === Number(districtId);
      }
      return false;
    }),
  );
}

function countOrganizationTreeSmallGroupsByDistrict(districtId) {
  return state.adminData.smallGroups.filter(
    (smallGroup) => Number(smallGroup.district_id || 0) === Number(districtId),
  ).length;
}

function countOrganizationTreePeople(members) {
  return new Set(
    (members || [])
      .filter((member) => member?.id && member.is_active !== false)
      .map((member) => member.id),
  ).size;
}

function getOrganizationTreeKey(type, id) {
  return `${type}:${id}`;
}

function getOrganizationTreeChildrenClass(childCount) {
  if (childCount <= 0) {
    return "has-no-children";
  }
  return childCount === 1 ? "has-single-child" : "has-multiple-children";
}

function syncOrganizationTreeConnectors() {
  if (
    !els.orgTreeBody ||
    els.orgTreeBody.offsetParent === null
  ) {
    resetOrganizationTreeConnectors();
    return;
  }
  const isExporting = els.orgTreeBody.classList.contains("is-exporting");

  if (state.ui.orgTreeMode === "vertical") {
    els.orgTreeBody.querySelectorAll(".org-flow-branches").forEach((branches) => {
      branches.classList.remove("has-measured-connector");
      branches.style.removeProperty("--connector-left");
      branches.style.removeProperty("--connector-right");
    });
  } else {
    els.orgTreeBody.querySelectorAll(".org-flow-branches").forEach((branches) => {
      const children = Array.from(branches.children).filter((child) =>
        child.classList.contains("org-flow-branch"),
      );
      branches.classList.toggle("has-single-child", children.length === 1);
      branches.classList.toggle("has-multiple-children", children.length > 1);
      branches.classList.remove("has-measured-connector");

      if (children.length <= 1) {
        branches.style.removeProperty("--connector-left");
        branches.style.removeProperty("--connector-right");
        return;
      }

      const containerRect = branches.getBoundingClientRect();
      const firstRect = children[0].getBoundingClientRect();
      const lastRect = children[children.length - 1].getBoundingClientRect();
      if (containerRect.width <= 0 || firstRect.width <= 0 || lastRect.width <= 0) {
        branches.style.removeProperty("--connector-left");
        branches.style.removeProperty("--connector-right");
        return;
      }
      const scale = isExporting ? 1 : state.ui.orgTreeScale;
      const minInset = 8 * scale;
      const maxInset = Math.max(minInset, containerRect.width - minInset);
      const left =
        Math.min(maxInset, Math.max(minInset, firstRect.left - containerRect.left + firstRect.width / 2)) / scale;
      const right = Math.min(
        maxInset,
        Math.max(minInset, containerRect.right - lastRect.left - lastRect.width / 2),
      ) / scale;
      branches.style.setProperty("--connector-left", `${left}px`);
      branches.style.setProperty("--connector-right", `${right}px`);
      branches.classList.add("has-measured-connector");
    });
  }

  els.orgTreeBody.querySelectorAll(".org-flow-district-group-rows").forEach((rows) => {
    const children = Array.from(rows.children).filter((child) =>
      child.classList.contains("org-flow-district-group-item"),
    );
    rows.classList.toggle("has-single-district", children.length === 1);
    rows.classList.toggle("has-multiple-districts", children.length > 1);
    rows.classList.remove("has-measured-pastor-connector");

    if (children.length <= 1) {
      rows.style.removeProperty("--pastor-connector-left");
      rows.style.removeProperty("--pastor-connector-right");
      return;
    }

    const containerRect = rows.getBoundingClientRect();
    const firstRect = children[0].getBoundingClientRect();
    const lastRect = children[children.length - 1].getBoundingClientRect();
    if (containerRect.width <= 0 || firstRect.width <= 0 || lastRect.width <= 0) {
      rows.style.removeProperty("--pastor-connector-left");
      rows.style.removeProperty("--pastor-connector-right");
      return;
    }
    const scale = isExporting ? 1 : state.ui.orgTreeScale;
    const minInset = 8 * scale;
    const maxInset = Math.max(minInset, containerRect.width - minInset);
    const left =
      Math.min(maxInset, Math.max(minInset, firstRect.left - containerRect.left + firstRect.width / 2)) / scale;
    const right = Math.min(
      maxInset,
      Math.max(minInset, containerRect.right - lastRect.left - lastRect.width / 2),
    ) / scale;
    rows.style.setProperty("--pastor-connector-left", `${left}px`);
    rows.style.setProperty("--pastor-connector-right", `${right}px`);
    rows.classList.add("has-measured-pastor-connector");
  });
}

function resetOrganizationTreeConnectors() {
  if (!els.orgTreeBody) {
    return;
  }
  els.orgTreeBody.querySelectorAll(".org-flow-branches").forEach((branches) => {
    branches.classList.remove("has-measured-connector");
    branches.style.removeProperty("--connector-left");
    branches.style.removeProperty("--connector-right");
  });
  els.orgTreeBody.querySelectorAll(".org-flow-district-group-rows").forEach((rows) => {
    rows.classList.remove("has-measured-pastor-connector");
    rows.style.removeProperty("--pastor-connector-left");
    rows.style.removeProperty("--pastor-connector-right");
  });
}

function getOrganizationTreeCanvas() {
  return els.orgTreeBody?.querySelector(".org-tree-canvas") || null;
}

function getOrganizationTreeScaledShell() {
  return els.orgTreeBody?.querySelector(".org-tree-scaled-shell") || null;
}

function updateOrganizationTreeScaledShellSize() {
  const shell = getOrganizationTreeScaledShell();
  const canvas = getOrganizationTreeCanvas();
  if (!shell || !canvas || !els.orgTreeBody) {
    return false;
  }
  if (!isOrganizationTreeMeasurable()) {
    return false;
  }
  const scale = state.ui.orgTreeScale;
  const contentWidth = canvas.scrollWidth;
  const contentHeight = canvas.scrollHeight;
  if (contentWidth <= 1 || contentHeight <= 1) {
    return false;
  }
  const viewportWidth = Math.max(1, els.orgTreeBody.clientWidth);
  const viewportHeight = Math.max(1, els.orgTreeBody.clientHeight);
  const horizontalGutter = Math.max(24, Math.round(viewportWidth * 0.5));
  const verticalGutter = Math.max(18, Math.round(viewportHeight * 0.18));
  const width = Math.ceil(contentWidth * scale);
  const height = Math.ceil(contentHeight * scale);
  shell.style.setProperty("--org-tree-view-gutter-x", `${horizontalGutter}px`);
  shell.style.setProperty("--org-tree-view-gutter-y", `${verticalGutter}px`);
  shell.style.width = `${Math.max(1, width)}px`;
  shell.style.height = `${Math.max(1, height)}px`;
  return true;
}

function isOrganizationTreeMeasurable() {
  if (!els.orgTreeBody || !els.orgsView || state.ui.activeTab !== TABS.orgs) {
    return false;
  }
  if (els.orgsView.classList.contains("hidden") || els.orgTreePanel?.classList.contains("is-tree-hidden")) {
    return false;
  }
  const bodyRect = els.orgTreeBody.getBoundingClientRect();
  return bodyRect.width > 1 && bodyRect.height > 1;
}

function fitOrganizationTreeToView() {
  if (!els.orgTreeBody) {
    return;
  }
  const canvas = getOrganizationTreeCanvas();
  if (!canvas) {
    return;
  }
  if (!isOrganizationTreeMeasurable() || canvas.scrollWidth <= 1) {
    scheduleOrganizationTreeConnectorSync();
    return;
  }
  const availableWidth = Math.max(1, els.orgTreeBody.clientWidth - 20);
  const contentWidth = Math.max(1, canvas.scrollWidth);
  const fitScale = availableWidth / contentWidth;
  const nextScale = Math.min(ORG_TREE_MAX_SCALE, Math.max(ORG_TREE_MIN_SCALE, fitScale));
  applyOrganizationTreeScale(nextScale);
  placeOrganizationTreeAtTopCenter();
  orgTreeViewState.needsInitialPlacement = false;
  saveUiPreferences();
}

function applyOrganizationTreeScale(scale, { syncConnectors = true } = {}) {
  const nextScale = Math.min(ORG_TREE_MAX_SCALE, Math.max(ORG_TREE_MIN_SCALE, Number(scale) || 1));
  state.ui.orgTreeScale = nextScale;
  const canvas = getOrganizationTreeCanvas();
  if (canvas) {
    canvas.style.setProperty("--org-tree-scale", nextScale.toFixed(3));
  }
  updateOrganizationTreeScaledShellSize();
  syncOrganizationTreeZoomControls();
  if (syncConnectors) {
    scheduleOrganizationTreeConnectorSync();
  }
}

function setOrganizationTreeScale(scale) {
  const viewportCenter = getOrganizationTreeViewportCenter();
  applyOrganizationTreeScale(scale);
  saveUiPreferences();
  if (viewportCenter) {
    restoreOrganizationTreeViewportCenter(viewportCenter);
  }
  orgTreeViewState.needsInitialPlacement = false;
}

function resetOrganizationTreeView() {
  applyOrganizationTreeScale(1);
  placeOrganizationTreeAtTopCenter();
  orgTreeViewState.needsInitialPlacement = false;
  saveUiPreferences();
}

function getOrganizationTreeViewGutters() {
  const shell = getOrganizationTreeScaledShell();
  if (!shell) {
    return { x: 0, y: 0 };
  }
  const styles = window.getComputedStyle(shell);
  return {
    x: Number.parseFloat(styles.getPropertyValue("--org-tree-view-gutter-x")) || 0,
    y: Number.parseFloat(styles.getPropertyValue("--org-tree-view-gutter-y")) || 0,
  };
}

function getOrganizationTreeViewportCenter() {
  if (!els.orgTreeBody || !getOrganizationTreeCanvas()) {
    return null;
  }
  const scale = state.ui.orgTreeScale || 1;
  const gutter = getOrganizationTreeViewGutters();
  return {
    x: (els.orgTreeBody.scrollLeft + els.orgTreeBody.clientWidth / 2 - gutter.x) / scale,
    y: (els.orgTreeBody.scrollTop + els.orgTreeBody.clientHeight / 2 - gutter.y) / scale,
  };
}

function restoreOrganizationTreeViewportCenter(center) {
  if (!els.orgTreeBody || !center) {
    return;
  }
  const scale = state.ui.orgTreeScale || 1;
  const gutter = getOrganizationTreeViewGutters();
  els.orgTreeBody.scrollLeft = Math.max(0, gutter.x + center.x * scale - els.orgTreeBody.clientWidth / 2);
  els.orgTreeBody.scrollTop = Math.max(0, gutter.y + center.y * scale - els.orgTreeBody.clientHeight / 2);
}

function placeOrganizationTreeAtTopCenter() {
  if (!els.orgTreeBody) {
    return;
  }
  updateOrganizationTreeScaledShellSize();
  const gutter = getOrganizationTreeViewGutters();
  const maxScrollLeft = Math.max(0, els.orgTreeBody.scrollWidth - els.orgTreeBody.clientWidth);
  const maxScrollTop = Math.max(0, els.orgTreeBody.scrollHeight - els.orgTreeBody.clientHeight);
  const preferredTopMargin = Math.min(28, Math.max(16, els.orgTreeBody.clientHeight * 0.06));
  els.orgTreeBody.scrollLeft = maxScrollLeft / 2;
  els.orgTreeBody.scrollTop = Math.min(maxScrollTop, Math.max(0, gutter.y - preferredTopMargin));
}

function syncOrganizationTreeZoomControls() {
  [els.orgTreeFitBtn, els.orgTreeZoomResetBtn].forEach((button) => {
    if (button) {
      button.disabled = false;
    }
  });
  if (els.orgTreeZoomRange) {
    els.orgTreeZoomRange.disabled = false;
    els.orgTreeZoomRange.value = String(Math.round(state.ui.orgTreeScale * 100));
    const rangeMin = Number(els.orgTreeZoomRange.min) || Math.round(ORG_TREE_MIN_SCALE * 100);
    const rangeMax = Number(els.orgTreeZoomRange.max) || Math.round(ORG_TREE_MAX_SCALE * 100);
    const rangeValue = Math.round(state.ui.orgTreeScale * 100);
    const fill = ((rangeValue - rangeMin) / Math.max(1, rangeMax - rangeMin)) * 100;
    els.orgTreeZoomRange.style.setProperty("--org-tree-range-fill", `${Math.min(100, Math.max(0, fill))}%`);
  }
  if (els.orgTreeZoomValue) {
    els.orgTreeZoomValue.textContent = `${Math.round(state.ui.orgTreeScale * 100)}%`;
  }
}

function scheduleOrganizationTreeConnectorSync({ placeTopCenter = false } = {}) {
  if (!els.orgTreeBody) {
    return;
  }
  const syncLayout = () => {
    const viewportCenter = getOrganizationTreeViewportCenter();
    updateOrganizationTreeScaledShellSize();
    if (placeTopCenter && isOrganizationTreeMeasurable()) {
      placeOrganizationTreeAtTopCenter();
      orgTreeViewState.needsInitialPlacement = false;
    } else if (viewportCenter) {
      restoreOrganizationTreeViewportCenter(viewportCenter);
    }
    if (state.ui.orgTreeMode !== "vertical") {
      syncOrganizationTreeConnectors();
    }
  };
  window.requestAnimationFrame(() => {
    syncLayout();
    window.requestAnimationFrame(() => {
      syncLayout();
    });
  });
  [80, 220, 500].forEach((delay) => {
    window.setTimeout(() => {
      syncLayout();
    }, delay);
  });
  document.fonts?.ready
    ?.then(() => {
      syncLayout();
    })
    .catch(() => {});
}

function getTouchDistance(touches) {
  const [first, second] = touches;
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

function getTouchCenter(touches) {
  const [first, second] = touches;
  return {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2,
  };
}

function handleOrganizationTreeTouchStart(event) {
  if (!els.orgTreeBody || event.touches.length !== 2) {
    return;
  }
  const rect = els.orgTreeBody.getBoundingClientRect();
  const center = getTouchCenter(event.touches);
  orgTreePinch.isActive = true;
  orgTreePinch.startDistance = getTouchDistance(event.touches);
  orgTreePinch.startScale = state.ui.orgTreeScale;
  orgTreePinch.centerX = center.x - rect.left;
  orgTreePinch.centerY = center.y - rect.top;
  orgTreePinch.scrollLeft = els.orgTreeBody.scrollLeft;
  orgTreePinch.scrollTop = els.orgTreeBody.scrollTop;
  const gutter = getOrganizationTreeViewGutters();
  orgTreePinch.contentX =
    (orgTreePinch.scrollLeft + orgTreePinch.centerX - gutter.x) /
    Math.max(ORG_TREE_MIN_SCALE, orgTreePinch.startScale);
  orgTreePinch.contentY =
    (orgTreePinch.scrollTop + orgTreePinch.centerY - gutter.y) /
    Math.max(ORG_TREE_MIN_SCALE, orgTreePinch.startScale);
  event.preventDefault();
}

function handleOrganizationTreeTouchMove(event) {
  if (!els.orgTreeBody || !orgTreePinch.isActive || event.touches.length !== 2) {
    return;
  }
  const distance = getTouchDistance(event.touches);
  if (!orgTreePinch.startDistance || !distance) {
    return;
  }
  const nextScale = Math.min(
    ORG_TREE_MAX_SCALE,
    Math.max(ORG_TREE_MIN_SCALE, orgTreePinch.startScale * (distance / orgTreePinch.startDistance)),
  );
  applyOrganizationTreeScale(nextScale);
  const gutter = getOrganizationTreeViewGutters();
  els.orgTreeBody.scrollLeft = Math.max(
    0,
    gutter.x + orgTreePinch.contentX * nextScale - orgTreePinch.centerX,
  );
  els.orgTreeBody.scrollTop = Math.max(
    0,
    gutter.y + orgTreePinch.contentY * nextScale - orgTreePinch.centerY,
  );
  orgTreeViewState.needsInitialPlacement = false;
  event.preventDefault();
}

function handleOrganizationTreeTouchEnd(event) {
  if (event.touches.length < 2) {
    orgTreePinch.isActive = false;
  }
}

function handleOrganizationTreeClick(event) {
  if (orgTreeDrag.suppressClick) {
    event.preventDefault();
    orgTreeDrag.suppressClick = false;
    return;
  }
  const node = event.target.closest(".org-flow-node[data-org-tree-key]");
  if (!node) {
    return;
  }
  toggleOrganizationTreeKey(node.dataset.orgTreeKey);
}

function handleOrganizationTreeKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  const node = event.target.closest(".org-flow-node[data-org-tree-key]");
  if (!node) {
    return;
  }
  event.preventDefault();
  toggleOrganizationTreeKey(node.dataset.orgTreeKey);
}

function toggleOrganizationTreeKey(key) {
  if (!key) {
    return;
  }
  if (state.ui.orgTreeCollapsedKeys.has(key)) {
    state.ui.orgTreeCollapsedKeys.delete(key);
  } else {
    state.ui.orgTreeCollapsedKeys.add(key);
  }
  renderOrganizationTree();
}

function handleOrganizationTreePointerDown(event) {
  if (
    !els.orgTreeBody ||
    event.button !== 0 ||
    event.pointerType === "touch" ||
    event.target.closest(".org-flow-node[data-org-tree-key]")
  ) {
    return;
  }

  orgTreeDrag.pointerId = event.pointerId;
  orgTreeDrag.startX = event.clientX;
  orgTreeDrag.startY = event.clientY;
  orgTreeDrag.scrollLeft = els.orgTreeBody.scrollLeft;
  orgTreeDrag.scrollTop = els.orgTreeBody.scrollTop;
  orgTreeDrag.isDragging = false;
  orgTreeDrag.suppressClick = false;
  els.orgTreeBody.setPointerCapture?.(event.pointerId);
}

function handleOrganizationTreePointerMove(event) {
  if (!els.orgTreeBody || orgTreeDrag.pointerId !== event.pointerId) {
    return;
  }

  const deltaX = event.clientX - orgTreeDrag.startX;
  const deltaY = event.clientY - orgTreeDrag.startY;
  if (!orgTreeDrag.isDragging && Math.hypot(deltaX, deltaY) < 6) {
    return;
  }

  orgTreeDrag.isDragging = true;
  orgTreeDrag.suppressClick = true;
  orgTreeViewState.needsInitialPlacement = false;
  els.orgTreeBody.classList.add("is-dragging");
  els.orgTreeBody.scrollLeft = orgTreeDrag.scrollLeft - deltaX;
  els.orgTreeBody.scrollTop = orgTreeDrag.scrollTop - deltaY;
  event.preventDefault();
}

function handleOrganizationTreePointerUp(event) {
  if (!els.orgTreeBody || orgTreeDrag.pointerId !== event.pointerId) {
    return;
  }

  els.orgTreeBody.releasePointerCapture?.(event.pointerId);
  els.orgTreeBody.classList.remove("is-dragging");
  orgTreeDrag.pointerId = null;
  orgTreeDrag.isDragging = false;
}

function syncOrganizationTreeControls() {
  syncOrgTreeDefaultModeInputs();
  syncOrganizationTreeZoomControls();
}

function toggleOrganizationTreePanel() {
  state.ui.orgTreePanelCollapsed = !state.ui.orgTreePanelCollapsed;
  syncOrganizationTreePanel();
}

function syncOrganizationTreePanel() {
  const isCollapsed = Boolean(state.ui.orgTreePanelCollapsed);
  els.orgTreePanel?.classList.toggle("is-tree-hidden", isCollapsed);
  if (els.toggleOrgTreePanelBtn) {
    els.toggleOrgTreePanelBtn.textContent = isCollapsed ? "顯示樹狀圖" : "隱藏樹狀圖";
    els.toggleOrgTreePanelBtn.setAttribute("aria-expanded", String(!isCollapsed));
  }
  if (!isCollapsed && state.ui.activeTab === TABS.orgs) {
    scheduleOrganizationTreeConnectorSync();
  }
}

async function handleCaptureOrganizationTree() {
  if (!els.orgTreeBody) {
    showToast("尚未載入組織樹。");
    return;
  }

  const htmlToImage = window.htmlToImage;
  if (!htmlToImage?.toPng) {
    showToast("截圖工具尚未載入，請稍後再試。");
    return;
  }

  const previousScrollLeft = els.orgTreeBody.scrollLeft;
  const previousScrollTop = els.orgTreeBody.scrollTop;
  const fileName = `topheart-organization-tree-${formatDate(new Date())}.png`;
  const useMobileExport = shouldUseMobileImageFallback();
  setButtonLoading(els.captureOrgTreeBtn, true, "產生中...");
  els.orgTreeBody.classList.add("is-exporting");
  els.orgTreeBody.scrollLeft = 0;
  els.orgTreeBody.scrollTop = 0;

  try {
    await withTimeout(document.fonts?.ready || Promise.resolve(), 5000, "字型載入逾時");
    await waitForNextFrame();
    syncOrganizationTreeConnectors();
    await waitForNextFrame();
    const canvas = getOrganizationTreeCanvas();
    const width = Math.max(
      els.orgTreeBody.scrollWidth,
      els.orgTreeBody.offsetWidth,
      canvas ? canvas.scrollWidth + 20 : 0,
    );
    const height = Math.max(
      els.orgTreeBody.scrollHeight,
      els.orgTreeBody.offsetHeight,
      canvas ? canvas.scrollHeight + 20 : 0,
    );
    const pixelRatio = getOrganizationTreeExportPixelRatio(width, height, useMobileExport);
    const dataUrl = await captureOrganizationTreePng(htmlToImage, els.orgTreeBody, {
      width,
      height,
      pixelRatio,
    });
    await saveOrganizationTreeImage(dataUrl, fileName);
    showToast("已產生組織樹截圖。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "產生截圖失敗，請稍後再試。");
  } finally {
    els.orgTreeBody.classList.remove("is-exporting");
    els.orgTreeBody.scrollLeft = previousScrollLeft;
    els.orgTreeBody.scrollTop = previousScrollTop;
    scheduleOrganizationTreeConnectorSync();
    setButtonLoading(els.captureOrgTreeBtn, false);
  }
}

async function captureOrganizationTreePng(htmlToImage, target, { width, height, pixelRatio }) {
  const attempts = [...new Set([pixelRatio, Math.min(pixelRatio, 2), Math.min(pixelRatio, 1.5), 1])]
    .filter((ratio) => ratio > 0)
    .sort((left, right) => right - left);
  let lastError = null;

  for (const ratio of attempts) {
    try {
      return await withTimeout(
        htmlToImage.toPng(target, {
          cacheBust: true,
          pixelRatio: ratio,
          skipAutoScale: true,
          width,
          height,
          style: {
            width: `${width}px`,
            height: `${height}px`,
            overflow: "visible",
            background: "#ffffff",
          },
        }),
        30000,
        `截圖產生逾時（${ratio.toFixed(2)}x）`,
      );
    } catch (error) {
      lastError = error;
      console.warn(`組織樹截圖以 ${ratio.toFixed(2)}x 產生失敗，改用較低解析度重試。`, error);
    }
  }

  throw lastError || new Error("截圖產生失敗。");
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

function getOrganizationTreeExportPixelRatio(width, height, useMobileExport) {
  const desiredRatio = useMobileExport ? 2 : 3;
  const maxPixels = useMobileExport ? 18000000 : 36000000;
  const area = Math.max(1, width * height);
  return Math.max(1, Math.min(desiredRatio, Math.sqrt(maxPixels / area)));
}

async function saveOrganizationTreeImage(dataUrl, fileName) {
  const blob = dataUrlToBlob(dataUrl);
  const file = new File([blob], fileName, { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "組織樹狀圖",
      text: "topheart 組織樹狀圖",
    });
    return;
  }

  const objectUrl = URL.createObjectURL(blob);
  if (shouldUseMobileImageFallback()) {
    showImageSavePanel(objectUrl, fileName);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 120000);
    return;
  }

  const link = document.createElement("a");
  link.download = fileName;
  link.href = objectUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

function showImageSavePanel(imageUrl, fileName) {
  const existing = document.querySelector(".image-save-panel");
  existing?.remove();
  const panel = document.createElement("div");
  panel.className = "image-save-panel";
  panel.innerHTML = `
    <div class="image-save-card" role="dialog" aria-modal="true" aria-label="組織樹截圖">
      <div class="image-save-head">
        <strong>組織樹截圖已產生</strong>
        <button type="button" class="secondary image-save-close">關閉</button>
      </div>
      <p>若 iPhone、LINE 或 Safari 沒有自動儲存，請長按圖片後選擇「加入照片」或「儲存影像」。</p>
      <a class="button-link image-save-download" href="${imageUrl}" download="${escapeHtml(fileName)}">下載圖片</a>
      <img src="${imageUrl}" alt="組織樹狀圖" />
    </div>
  `;
  panel.querySelector(".image-save-close")?.addEventListener("click", () => {
    panel.remove();
  });
  document.body.appendChild(panel);
}

function dataUrlToBlob(dataUrl) {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] || "image/png";
  const binary = window.atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

function shouldUseMobileImageFallback() {
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua) || /Line\//i.test(ua);
}

function waitForNextFrame() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
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

  const activeFirstDistricts = [...state.adminData.districts].sort(compareOrganizations);

  els.districtTableBody.innerHTML = activeFirstDistricts
    .map(renderOrganizationDistrictGroup)
    .join("");
}

function renderOrganizationDistrictGroup(district) {
  const bigFamilies = state.adminData.bigFamilies
    .filter((bigFamily) => bigFamily.district_id === district.id)
    .sort(compareOrganizations);
  const directSmallGroups = state.adminData.smallGroups
    .filter((smallGroup) => smallGroup.district_id === district.id && !smallGroup.big_family_id)
    .sort(compareOrganizations);
  const memberCount = state.adminData.members.filter((member) => member.district_id === district.id).length;
  const childCount = bigFamilies.length + directSmallGroups.length;

  return `
    <details class="org-scope-group org-edit-group org-level-district">
      <summary>
        <span class="people-scope-title">${escapeHtml(district.name)}</span>
        <span class="status-chip neutral">${memberCount} 人</span>
        <span class="status-chip neutral">${childCount} 個單位</span>
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
    .sort(compareOrganizations);
  const memberCount = state.adminData.members.filter((member) => member.big_family_id === bigFamily.id).length;

  return `
    <details class="org-scope-group org-edit-group org-level-big-family">
      <summary>
        <span class="people-scope-title">${escapeHtml(bigFamily.name)}</span>
        <span class="status-chip neutral">${memberCount} 人</span>
        <span class="status-chip neutral">${smallGroups.length} 個小家</span>
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
  const memberCount = state.adminData.members.filter((member) => member.small_group_id === smallGroup.id).length;
  return `
    <details class="org-scope-group org-edit-group org-level-small-group">
      <summary>
        <span class="people-scope-title">${escapeHtml(smallGroup.name)}</span>
        <span class="status-chip neutral">${memberCount} 人</span>
      </summary>
      <div class="org-scope-body">
        ${renderOrganizationCard("small_group", smallGroup)}
      </div>
    </details>
  `;
}

function compareOrganizations(left, right) {
  if (left.is_active !== right.is_active) {
    return left.is_active ? -1 : 1;
  }
  const leftOrder = Number(left.display_order);
  const rightOrder = Number(right.display_order);
  const hasLeftOrder = Number.isFinite(leftOrder);
  const hasRightOrder = Number.isFinite(rightOrder);
  if (hasLeftOrder || hasRightOrder) {
    if (hasLeftOrder !== hasRightOrder) {
      return hasLeftOrder ? -1 : 1;
    }
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
  }
  return compareOrganizationNames(left.name, right.name);
}

function compareOrganizationNames(leftName, rightName) {
  const leftOrder = getOrganizationNameOrdinal(leftName);
  const rightOrder = getOrganizationNameOrdinal(rightName);
  if (Number.isFinite(leftOrder) || Number.isFinite(rightOrder)) {
    if (Number.isFinite(leftOrder) !== Number.isFinite(rightOrder)) {
      return Number.isFinite(leftOrder) ? -1 : 1;
    }
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
  }
  return String(leftName || "").localeCompare(String(rightName || ""), "zh-Hant", { numeric: true });
}

function getOrganizationNameOrdinal(name) {
  const match = String(name || "").match(/第([一二三四五六七八九十百零〇兩\d]+)/);
  return match ? parseChineseOrdinalNumber(match[1]) : Number.NaN;
}

function parseChineseOrdinalNumber(value) {
  const text = String(value || "").trim();
  if (/^\d+$/.test(text)) {
    return Number(text);
  }

  const digits = {
    零: 0,
    〇: 0,
    一: 1,
    二: 2,
    兩: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  };

  if (Object.prototype.hasOwnProperty.call(digits, text)) {
    return digits[text];
  }

  const tenIndex = text.indexOf("十");
  if (tenIndex >= 0) {
    const beforeTen = text.slice(0, tenIndex);
    const afterTen = text.slice(tenIndex + 1);
    const tens = beforeTen ? digits[beforeTen] : 1;
    const ones = afterTen ? digits[afterTen] : 0;
    if (Number.isFinite(tens) && Number.isFinite(ones)) {
      return tens * 10 + ones;
    }
  }

  return Number.NaN;
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
  const parts = [`共 ${items.length} ${unitLabel}`];
  if (activeCount) {
    parts.push(`啟用 ${activeCount}`);
  }
  if (archivedCount) {
    parts.push(`封存 ${archivedCount}`);
  }
  element.textContent = parts.join("，");
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
    member_bucket: "人員",
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
  const viewer = getPermissionCurrentMember();
  if (orgType === "district") {
    return Boolean(viewer?.is_admin);
  }

  return Boolean(
    viewer?.is_admin ||
      PREACHER_ROLES.includes(viewer?.role) ||
      DISTRICT_PASTOR_ROLES.includes(viewer?.role) ||
      DISTRICT_LEADER_ROLES.includes(viewer?.role),
  );
}

function canReorderOrganization() {
  return Boolean(getPermissionCurrentMember()?.is_admin);
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

  if (canReorderOrganization()) {
    actionButtons.push(`
      <button
        type="button"
        class="secondary org-action-btn"
        data-org-action="move-up"
        data-org-type="${orgType}"
        data-org-id="${organization.id}"
        data-org-name="${escapeHtml(organization.name)}"
      >
        上移
      </button>
    `);
    actionButtons.push(`
      <button
        type="button"
        class="secondary org-action-btn"
        data-org-action="move-down"
        data-org-type="${orgType}"
        data-org-id="${organization.id}"
        data-org-name="${escapeHtml(organization.name)}"
      >
        下移
      </button>
    `);
  }

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

  if (getPermissionCurrentMember()?.is_admin) {
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
    .map(renderOrganizationFlowDistrict)
    .join("");
}

function renderOrganizationFlowDistrict(district) {
  const bigFamilies = state.adminData.bigFamilies.filter(
    (bigFamily) => bigFamily.district_id === district.id,
  );
  const directSmallGroups = state.adminData.smallGroups.filter(
    (smallGroup) => smallGroup.district_id === district.id && !smallGroup.big_family_id,
  );
  return `
    <details class="org-flow-district" open>
      <summary>${renderOrganizationCard("district", district)}</summary>
      <div class="org-flow-children">
        ${bigFamilies.map((bigFamily) => renderOrganizationFlowBigFamily(bigFamily)).join("")}
        ${directSmallGroups.map((smallGroup) => `
          <div class="org-flow-small">${renderOrganizationCard("small_group", smallGroup)}</div>
        `).join("")}
      </div>
    </details>
  `;
}

function renderOrganizationFlowBigFamily(bigFamily) {
  const smallGroups = state.adminData.smallGroups.filter(
    (smallGroup) => smallGroup.big_family_id === bigFamily.id,
  );
  return `
    <details class="org-flow-big-family" open>
      <summary>${renderOrganizationCard("big_family", bigFamily)}</summary>
      <div class="org-flow-children org-flow-small-list">
        ${smallGroups.length
          ? smallGroups.map((smallGroup) => `
              <div class="org-flow-small">${renderOrganizationCard("small_group", smallGroup)}</div>
            `).join("")
          : '<div class="empty-state-card">此大家底下尚無小家。</div>'}
      </div>
    </details>
  `;
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

  if (action === "move-up" || action === "move-down") {
    handleOrganizationMove(button, orgType, orgId, action === "move-up" ? -1 : 1);
    return;
  }

  if (action === "delete" && button.dataset.blockedReason) {
    showToast(button.dataset.blockedReason);
    return;
  }

  handleOrganizationAction(button, action, orgType, orgId, orgName);
}

async function handleOrganizationMove(button, orgType, orgId, direction) {
  setButtonLoading(button, true);
  try {
    await apiRequest("move-organization", {
      method: "POST",
      authMode: "app",
      body: {
        org_type: orgType,
        org_id: orgId,
        direction,
      },
    });
    queueOrganizationFocus({
      type: orgType,
      id: orgId,
      sectionId: getOrganizationSectionId(orgType),
    });
    await loadAdminPanel();
    await Promise.all([
      loadDashboard({ skipDirtyCheck: true }),
      canUseOverview() ? loadAttendanceOverview(state.ui.overviewWeekStart) : Promise.resolve(),
    ]);
    showToast("組織排序已更新。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "更新組織排序失敗，請確認資料庫已套用 display_order 欄位。");
  } finally {
    setButtonLoading(button, false);
  }
}

function openOrgEditor(type, id) {
  closeCreateOrgSheets();
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
    els.orgDistrictSelect.disabled = !getPermissionCurrentMember()?.is_admin;
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
  setHidden(els.orgEditorBackdrop, false);
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
  setHidden(els.orgEditorBackdrop, true);
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
  if (els.inviteSortSelect) {
    els.inviteSortSelect.value = state.ui.inviteSort;
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

  els.inviteTableBody.innerHTML = getSortedInvites()
    .map((invite) => {
      const targetMember = getInviteTargetMember(invite);
      const hasLineBinding = Boolean(invite.target_line_user_id || targetMember?.line_user_id);
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
            ${hasLineBinding
              ? `<button
                  type="button"
                  class="secondary danger-button invite-reset-binding-btn"
                  data-member-id="${escapeHtml(invite.target_member_id)}"
                  data-member-name="${escapeHtml(invite.target_name)}"
                >
                  解除綁定
                </button>`
              : !invite.used_at
                ? `<button
                    type="button"
                    class="secondary danger-button invite-delete-btn"
                    data-invite-id="${escapeHtml(invite.id)}"
                    data-invite-code="${escapeHtml(invite.invite_code)}"
                  >
                    刪除邀請碼
                  </button>`
                : '<span class="muted small-text">已使用的邀請碼不可刪除</span>'}
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

function getInviteTargetMember(invite) {
  return state.adminData.members.find((member) => member.id === Number(invite.target_member_id));
}

function getSortedInvites() {
  const now = Date.now();
  return [...state.adminData.invites].sort((left, right) => {
    if (state.ui.inviteSort === "unused") {
      const leftUnused = !left.used_at && new Date(left.expires_at).getTime() >= now;
      const rightUnused = !right.used_at && new Date(right.expires_at).getTime() >= now;
      if (leftUnused !== rightUnused) {
        return leftUnused ? -1 : 1;
      }
    }

    if (state.ui.inviteSort === "role") {
      const leftRole = ROLE_ORDER[left.target_role] || 99;
      const rightRole = ROLE_ORDER[right.target_role] || 99;
      if (leftRole !== rightRole) {
        return leftRole - rightRole;
      }
    }

    const leftTime = new Date(left.created_at || 0).getTime();
    const rightTime = new Date(right.created_at || 0).getTime();
    return state.ui.inviteSort === "created_asc"
      ? leftTime - rightTime
      : rightTime - leftTime;
  });
}

function handleInviteSortChange(event) {
  const sortValue = event.target.value;
  state.ui.inviteSort = INVITE_SORT_OPTIONS.includes(sortValue) ? sortValue : "created_desc";
  saveUiPreferences();
  renderInviteTable();
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
  const deleteButton = event.target.closest(".invite-delete-btn");
  if (deleteButton) {
    handleDeleteInvite(deleteButton);
    return;
  }

  const resetButton = event.target.closest(".invite-reset-binding-btn");
  if (resetButton) {
    handleResetMemberLineBinding(resetButton);
    return;
  }

  const copyButton = event.target.closest(".invite-copy-btn");
  if (!copyButton) {
    return;
  }

  copyInviteCode(copyButton.dataset.inviteCode || "");
}

async function handleDeleteInvite(button) {
  const inviteId = button.dataset.inviteId || "";
  const inviteCode = button.dataset.inviteCode || "";
  if (!inviteId) {
    return;
  }
  if (!window.confirm(`確定要刪除邀請碼「${inviteCode}」嗎？`)) {
    return;
  }

  setButtonLoading(button, true);
  try {
    await apiRequest("delete-invite", {
      method: "POST",
      authMode: "app",
      body: { invite_id: inviteId },
    });
    await loadAdminPanel();
    showToast("邀請碼已刪除。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "刪除邀請碼失敗。");
  } finally {
    setButtonLoading(button, false);
  }
}

async function handleResetMemberLineBinding(button) {
  const memberId = Number(button.dataset.memberId || 0);
  const memberName = button.dataset.memberName || "這位人員";
  if (!memberId) {
    return;
  }
  if (!window.confirm(`確定要解除「${memberName}」的 LINE 綁定嗎？解除後需重新產生邀請碼綁定。`)) {
    return;
  }

  setButtonLoading(button, true);
  try {
    await apiRequest("reset-member-line-binding", {
      method: "POST",
      authMode: "app",
      body: { member_id: memberId },
    });
    await loadAdminPanel();
    showToast("LINE 綁定已解除，可重新產生邀請碼。");
  } catch (error) {
    console.error(error);
    showToast(error.message || "解除 LINE 綁定失敗。");
  } finally {
    setButtonLoading(button, false);
  }
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
  const viewer = getPermissionCurrentMember();
  return Boolean(
    viewer &&
      (
        viewer.is_admin ||
        PREACHER_ROLES.includes(viewer.role) ||
        DISTRICT_PASTOR_ROLES.includes(viewer.role) ||
        DISTRICT_LEADER_ROLES.includes(viewer.role) ||
        BIG_FAMILY_LEADER_ROLES.includes(viewer.role) ||
        SMALL_GROUP_LEADER_ROLES.includes(viewer.role)
      ),
  );
}

function canCreateMembers() {
  const viewer = getPermissionCurrentMember();
  return canManageMemberLifecycle(viewer);
}

function canManageMemberLifecycle(viewer = getPermissionCurrentMember()) {
  if (viewer?.is_admin) {
    return true;
  }
  return Boolean(
    viewer &&
      canUseManagement() &&
      hasManagementScope(viewer) &&
      !BIG_FAMILY_LEADER_ROLES.includes(viewer.role) &&
      !SMALL_GROUP_LEADER_ROLES.includes(viewer.role),
  );
}

function hasManagementScope(viewer) {
  if (!viewer) {
    return false;
  }
  if (viewer.is_admin) {
    return true;
  }
  if (PREACHER_ROLES.includes(viewer.role) || DISTRICT_PASTOR_ROLES.includes(viewer.role)) {
    return getDistrictPastorDistrictIds(viewer).length > 0 || Number(viewer.district_id || 0) > 0;
  }
  if (DISTRICT_LEADER_ROLES.includes(viewer.role)) {
    return Number(viewer.district_id || 0) > 0;
  }
  if (BIG_FAMILY_LEADER_ROLES.includes(viewer.role)) {
    return Number(viewer.big_family_id || 0) > 0;
  }
  if (SMALL_GROUP_LEADER_ROLES.includes(viewer.role)) {
    return Number(viewer.small_group_id || 0) > 0;
  }
  return false;
}

function canEditMemberActiveStatus(member = null) {
  const viewer = getPermissionCurrentMember();
  if (!viewer) {
    return false;
  }
  if (viewer.is_admin) {
    return true;
  }
  if (!canManageMemberLifecycle(viewer)) {
    return false;
  }
  return !member || (
    canManageMemberScope(viewer, member) &&
    canManageRole(viewer.role, member.role)
  );
}

function canUseOrganizationManagement() {
  return canUseManagement();
}

function canUseProfileDirectory() {
  return canUseManagement();
}

function canUseOverview() {
  const viewer = getPermissionCurrentMember();
  return Boolean(
    viewer &&
      (viewer.is_admin || OVERVIEW_ROLES.includes(viewer.role)),
  );
}

function canUseManageAllToggle() {
  return Boolean(state.currentMember?.is_admin);
}

function canUseAttendanceFilters() {
  const viewer = getPermissionCurrentMember();
  if (!viewer) {
    return false;
  }

  if (canUseManageAllToggle() && !isAdminModeActive()) {
    return false;
  }

  return Boolean(
    viewer.is_admin ||
      ["preacher", "trainee_preacher", "district_pastor", "district_leader", "big_family_leader", "trainee_big_family_leader"].includes(
        viewer.role,
      ),
  );
}

function canUseInvites() {
  return Boolean(isAdminModeActive());
}

function canEditProfile(member) {
  const viewer = getPermissionCurrentMember();
  if (!viewer) {
    return false;
  }

  if (viewer.is_admin) {
    return true;
  }

  return (
    canManageMemberScope(viewer, member) &&
    canManageRole(viewer.role, member.role)
  );
}

function canDeleteMember(member) {
  const viewer = getPermissionCurrentMember();
  if (!viewer || member.id === getRealCurrentMember()?.id) {
    return false;
  }

  if (!member.is_active) {
    return false;
  }

  if (viewer.is_admin) {
    return true;
  }

  if (!canManageMemberLifecycle(viewer)) {
    return false;
  }

  return (
    member.is_active &&
    canManageMemberScope(viewer, member) &&
    canManageRole(viewer.role, member.role)
  );
}

function canRestoreMember(member) {
  const viewer = getPermissionCurrentMember();
  if (!viewer || member.is_active) {
    return false;
  }

  if (viewer.is_admin) {
    return true;
  }

  if (!canManageMemberLifecycle(viewer)) {
    return false;
  }

  return (
    canManageMemberScope(viewer, member) &&
    canManageRole(viewer.role, member.role)
  );
}

function canPurgeMember(member) {
  const viewer = getPermissionCurrentMember();
  return Boolean(
    viewer &&
      viewer.is_admin &&
      !member.is_active &&
      member.id !== getRealCurrentMember()?.id,
  );
}

function canManageMemberDistrict(viewer, districtId) {
  if (!viewer) {
    return false;
  }
  if (viewer.is_admin) {
    return true;
  }
  if (!districtId) {
    return false;
  }
  if (PREACHER_ROLES.includes(viewer.role)) {
    const districtIds = getDistrictPastorDistrictIds(viewer);
    return districtIds.length
      ? districtIds.includes(Number(districtId))
      : Number(viewer.district_id || 0) === Number(districtId);
  }
  if (DISTRICT_PASTOR_ROLES.includes(viewer.role)) {
    const districtIds = getDistrictPastorDistrictIds(viewer);
    return districtIds.length
      ? districtIds.includes(Number(districtId))
      : Number(viewer.district_id || 0) === Number(districtId);
  }
  return (
    DISTRICT_LEADER_ROLES.includes(viewer.role) ||
    BIG_FAMILY_LEADER_ROLES.includes(viewer.role) ||
    SMALL_GROUP_LEADER_ROLES.includes(viewer.role)
  ) && Number(viewer.district_id || 0) === Number(districtId);
}

function canManageMemberScope(viewer, target) {
  if (!viewer) {
    return false;
  }
  if (viewer.is_admin) {
    return true;
  }
  if (PREACHER_ROLES.includes(viewer.role)) {
    const districtIds = getDistrictPastorDistrictIds(viewer);
    if (districtIds.length) {
      return districtIds.includes(Number(target?.district_id || 0));
    }
    return Number(viewer.district_id || 0) > 0 &&
      Number(viewer.district_id || 0) === Number(target?.district_id || 0);
  }
  if (DISTRICT_PASTOR_ROLES.includes(viewer.role)) {
    return getDistrictPastorDistrictIds(viewer).includes(Number(target?.district_id || 0));
  }
  if (DISTRICT_LEADER_ROLES.includes(viewer.role)) {
    return Number(viewer.district_id || 0) > 0 &&
      Number(viewer.district_id || 0) === Number(target?.district_id || 0);
  }
  if (BIG_FAMILY_LEADER_ROLES.includes(viewer.role)) {
    return Number(viewer.big_family_id || 0) > 0 &&
      Number(viewer.big_family_id || 0) === Number(target?.big_family_id || 0);
  }
  if (SMALL_GROUP_LEADER_ROLES.includes(viewer.role)) {
    return Number(viewer.small_group_id || 0) > 0 &&
      Number(viewer.small_group_id || 0) === Number(target?.small_group_id || 0);
  }
  return false;
}

function canManageRole(viewerRole, targetRole) {
  const viewerTier = ROLE_PERMISSION_TIER[viewerRole] || 99;
  const targetTier = ROLE_PERMISSION_TIER[targetRole] || 99;
  return targetTier > viewerTier && targetTier < 99;
}

function getDistrictPastorDistrictIds(member) {
  return (member?.district_pastor_district_ids || [])
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);
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
  } else if (select.multiple) {
    Array.from(select.options).forEach((option) => {
      option.selected = false;
    });
  } else if (!keepEmptyOption && items[0]) {
    select.value = items[0].value;
  } else {
    select.value = "";
  }
}

function setDirty(isDirty) {
  state.dirty = isDirty;
  els.attendanceView?.classList.toggle("is-dirty", Boolean(isDirty));
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

function renderEquipmentProgressBadge(progress) {
  const normalized = normalizeEquipmentProgress(progress);
  if (normalized === "none") {
    return "";
  }
  return `<span class="equipment-badge ${escapeHtml(getEquipmentProgressClass(normalized))}">${escapeHtml(EQUIPMENT_PROGRESS_LABELS[normalized])}</span>`;
}

function normalizeEquipmentProgress(progress) {
  return Object.prototype.hasOwnProperty.call(
    EQUIPMENT_PROGRESS_LABELS,
    progress,
  )
    ? progress
    : "none";
}

function getEquipmentProgressClass(progress) {
  return `equipment-${normalizeEquipmentProgress(progress)}`;
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
    functionName: forcedFunctionName = "",
  } = options;

  const actionName = String(action).split("&")[0];
  const functionName = forcedFunctionName || (V2_API_ACTIONS.has(actionName) ? "app-api-v2" : "app-api");
  const url = `${state.config.projectUrl}/functions/v1/${functionName}?action=${action}`;
  const headers = {
    "Content-Type": "application/json",
  };

  if ((authMode === "app" || authMode === "auto") && state.appToken) {
    headers["X-App-Token"] = state.appToken;
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
    if (response.status === 401) {
      if (authMode === "app" || (authMode === "auto" && state.appToken)) {
        state.appToken = null;
        saveStoredValue(STORAGE_KEYS.appToken, "");
      }

      if (authMode === "pending" || (authMode === "auto" && state.pendingToken)) {
        state.pendingToken = null;
        saveStoredValue(STORAGE_KEYS.pendingToken, "");
      }
    }

    const errorMessage = data?.error || `Request failed with status ${response.status}.`;
    const error = new Error(getFriendlyApiErrorMessage(errorMessage));
    error.status = response.status;
    error.suppressed = suppressUnauthorizedToast;
    throw error;
  }

  return data;
}

function isMissingActionError(error) {
  const message = String(error?.message || "");
  return message.includes("Unknown action") || message.includes("404");
}

function isUnauthorizedApiError(error) {
  return error?.status === 401 || error?.status === 403;
}

function getFriendlyApiErrorMessage(message) {
  if (message === "Pending LINE login is missing or expired.") {
    return "LINE 登入驗證已逾時，或驗證結果停在另一個瀏覽器。請重新按「使用 LINE 登入」後再輸入邀請碼。";
  }

  if (message === "此邀請碼已被使用。") {
    return "此邀請碼已被使用。若你剛完成綁定但沒有進入系統，請重新按「使用 LINE 登入」取得新的登入狀態。";
  }

  if (message === "此人員角色不開放登入。") {
    return "此邀請碼對應的人員目前沒有登入權限，請確認邀請碼是否發給正確的領袖帳號。";
  }

  return message;
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
  const districtOrder = new Map(state.adminData.districts.map((item) => [item.id, Number(item.display_order)]));
  const bigFamilyOrder = new Map(state.adminData.bigFamilies.map((item) => [item.id, Number(item.display_order)]));
  const smallGroupOrder = new Map(state.adminData.smallGroups.map((item) => [item.id, Number(item.display_order)]));
  return [...members].sort((left, right) => {
    if (left.is_active !== right.is_active) {
      return left.is_active === false ? 1 : -1;
    }

    const leftRole = ROLE_ORDER[left.role] || 99;
    const rightRole = ROLE_ORDER[right.role] || 99;
    if (leftRole !== rightRole) {
      return leftRole - rightRole;
    }

    const leftProgress = EQUIPMENT_PROGRESS_ORDER[normalizeEquipmentProgress(left.equipment_progress)] || 99;
    const rightProgress = EQUIPMENT_PROGRESS_ORDER[normalizeEquipmentProgress(right.equipment_progress)] || 99;
    if (leftProgress !== rightProgress) {
      return leftProgress - rightProgress;
    }

    const districtCompare = compareMemberScopeOrder(
      left.district_id,
      right.district_id,
      left.district_name,
      right.district_name,
      districtOrder,
    );
    if (districtCompare) {
      return districtCompare;
    }

    const bigFamilyCompare = compareMemberScopeOrder(
      left.big_family_id,
      right.big_family_id,
      left.big_family_name,
      right.big_family_name,
      bigFamilyOrder,
    );
    if (bigFamilyCompare) {
      return bigFamilyCompare;
    }

    const smallGroupCompare = compareMemberScopeOrder(
      left.small_group_id,
      right.small_group_id,
      left.small_group_name,
      right.small_group_name,
      smallGroupOrder,
    );
    if (smallGroupCompare) {
      return smallGroupCompare;
    }

    return left.full_name.localeCompare(right.full_name, "zh-Hant");
  });
}

function compareMemberScopeOrder(leftId, rightId, leftName, rightName, orderMap) {
  const leftOrder = Number(orderMap.get(leftId));
  const rightOrder = Number(orderMap.get(rightId));
  const hasLeftOrder = Number.isFinite(leftOrder);
  const hasRightOrder = Number.isFinite(rightOrder);
  if (hasLeftOrder || hasRightOrder) {
    if (hasLeftOrder !== hasRightOrder) {
      return hasLeftOrder ? -1 : 1;
    }
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
  }
  const leftValue = leftName || "";
  const rightValue = rightName || "";
  return leftValue.localeCompare(rightValue, "zh-Hant");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeCssIdentifier(value) {
  const text = String(value ?? "");
  if (window.CSS?.escape) {
    return window.CSS.escape(text);
  }
  return text.replace(/["\\]/g, "\\$&");
}
