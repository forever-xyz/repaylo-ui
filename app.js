const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const tabs = document.querySelectorAll(".tabbar .tab");
const ledgerFab = document.querySelector("#ledgerFab");
const ledgerSheet = document.querySelector("#ledgerSheet");

const state = {
  route: "home",
  history: [],
  checkedIn: false,
  checkinCelebrating: false,
  checkinMonthOffset: 0,
  dateFilterOpen: false,
  agreementYear: 2026,
  homeStatus: "全部",
  messageTab: "全部",
  reportYear: "全部数据",
  reportLineMode: "lend",
  reportOverviewOpen: false,
  friendRankOpen: false,
  friendRankOrder: "desc",
  ledgerDateOffset: 0,
  ledgerBudgetOpen: false,
  ledgerDistributionOpen: false,
  ledgerDatePickerOpen: false,
  ledgerMonthPickerOpen: false,
  ledgerDistributionMode: "day",
  ledgerDistributionPickerOpen: false,
  ledgerAddSheetOpen: false,
  ledgerAddType: "expense",
  ledgerAddCategory: "other",
  ledgerExpandedExpenseId: null,
  ledgerSwipedExpenseId: null,
  ledgerDeletedExpenseIds: [],
  score: 520,
  growth: 1280,
  expandedId: null,
  filters: { time: "全部", type: "全部", status: "全部", amount: "全部" }
};

const agreements = [
  { id: 1, avatar: "🐼", name: "小李同学", type: "出借", title: "项目周转", amount: 2000, status: "进行中", badge: "b-progress", date: "07-25", reason: "朋友创业项目急需周转，用于采购首批原材料。", remind: "周转顺利就好，有需要随时说。" },
  { id: 2, avatar: "🐰", name: "小王同学", type: "借入", title: "医疗急用", amount: 1000, status: "已逾期", badge: "b-overdue", date: "逾期2天", reason: "临时医疗检查支出，希望延期处理。", remind: "情况说清楚，我们一起把约定守好。" },
  { id: 3, avatar: "🐨", name: "小钱同学", type: "出借", title: "聚餐垫付", amount: 268, status: "已完成", badge: "b-completed", date: "刚刚完成", reason: "周末聚餐垫付费用。", remind: "已完成，感谢及时确认。" },
  { id: 4, avatar: "🦊", name: "阿周同学", type: "借入", title: "房租周转", amount: 1800, status: "待确认", badge: "b-pending", date: "等待确认", reason: "房租临时周转，预计下周归还。", remind: "确认后会按时归还。" },
  { id: 5, avatar: "🐻", name: "小陈同学", type: "出借", title: "课程代付", amount: 699, status: "延期中", badge: "b-extended", date: "2小时前", reason: "课程费用代付，对方申请延期到 7/10。", remind: "等待你确认新的归还日期。" },
  { id: 6, avatar: "📝", name: "草稿约定", type: "出借", title: "备用记录", amount: 500, status: "草稿", badge: "b-draft", date: "未发送", reason: "暂存一份还没发出的约定。", remind: "确认信息后再发送给对方。" }
];

const pages = {
  home: renderHome,
  lend: renderLend,
  emergency: renderEmergency,
  detail: renderDetail,
  delay: renderDelay,
  messages: renderMessages,
  reports: renderReports,
  friendRank: renderFriendRankPage,
  ledger: renderLedger,
  ledgerBudget: renderLedgerBudgetDetail,
  ledgerDistribution: renderLedgerDistributionDetail,
  profile: renderProfile,
  checkin: renderCheckinCenter,
  agreements: renderAgreementList,
  credit: renderCreditCenter
};

function money(n) {
  return `¥${n.toLocaleString("zh-CN")}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function go(route, params = {}) {
  if (state.route !== route) {
    state.history.push({ route: state.route, params: state.params || {} });
  }
  state.route = route;
  state.params = params;
  render();
}

function goBack() {
  const last = state.history.pop();
  if (last) {
    state.route = last.route;
    state.params = last.params || {};
  } else {
    state.route = "home";
    state.params = {};
  }
  render();
}

function switchTab(route) {
  state.history = [];
  state.route = route;
  state.params = {};
  render();
}

function nav(title, right = "") {
  const rootTabs = ["home", "reports", "ledger", "profile"];
  if (rootTabs.includes(state.route)) return "";
  return `<div class="nav nav-quiet" aria-label="${title}">
    <button class="back-button" onclick="goBack()" aria-label="返回上一级">‹</button>
    <span></span>
    ${right || "<span></span>"}
  </div>`;
}

function section(title, action, route) {
  return `<div class="section-head"><h2>${title}</h2>${action ? `<button onclick="go('${route}')">${action}</button>` : ""}</div>`;
}

function metric(label, value) {
  return `<div class="metric"><b>${value}</b><span>${label}</span></div>`;
}

function agreementCard(item) {
  const expanded = state.expandedId === item.id;
  const actionMap = { "草稿": "编辑", "进行中": "查看", "待确认": "去确认", "已完成": "详情", "已逾期": "去处理", "延期中": "查看延期" };
  const action = actionMap[item.status] || "查看详情";
  const agreementNo = agreementNumber(item.id);
  return `
    <article class="agreement-card ${expanded ? "expanded" : ""}" data-agreement-id="${item.id}" onclick="toggleAgreement(${item.id})">
      <div class="agreement-card-header">
        <div class="agreement-user">
          <div class="card-avatar">${item.avatar}</div>
          <div>
            <div class="card-name">${item.name}</div>
            <div class="card-type">${agreementNo}</div>
          </div>
        </div>
        <span class="status-capsule ${item.badge}">${statusIcon(item.status)} ${item.status}</span>
      </div>
      <div class="agreement-card-body">
        <div>
          <span class="card-money">${money(item.amount)}</span>
          <span class="card-date">📅 ${item.date}</span>
        </div>
        <button class="card-action" onclick="event.stopPropagation(); go('detail',{id:${item.id}})">${action}</button>
      </div>
      <div class="agreement-extra">
        <p><b>📝 缘由</b>${item.reason}</p>
        <p><b>💬 提醒语</b>${item.remind}</p>
        <p><b>📎 凭证</b>聊天记录 1 张，仅双方可见。</p>
      </div>
    </article>
  `;
}

function statusIcon(status) {
  return {
    "草稿": "📝",
    "进行中": "⏳",
    "待确认": "🤔",
    "已完成": "✅",
    "已逾期": "⚠️",
    "延期中": "📅"
  }[status] || "•";
}

function toggleAgreement(id) {
  state.expandedId = state.expandedId === id ? null : id;
  const cards = document.querySelectorAll(".agreement-card");
  if (!cards.length) {
    render();
    return;
  }
  cards.forEach(card => {
    const isTarget = card.getAttribute("data-agreement-id") === String(id);
    card.classList.toggle("expanded", isTarget && state.expandedId === id);
  });
}

function statePanel() {
  return `
    ${section("状态展示", "", "")}
    <section class="glass state-panel">
      <div class="state-grid">
        <div class="state-box"><strong>Loading</strong><span>正在整理你的温暖约定</span><div class="skeleton"></div></div>
        <div class="state-box"><strong>Empty</strong><span>暂无内容，第一份温暖从这里开始</span></div>
        <div class="state-box"><strong>Error</strong><span>加载失败，请轻点重试</span></div>
        <div class="state-box"><strong>Success</strong><span>操作成功，信任记录已更新</span></div>
      </div>
    </section>
  `;
}

function renderHome() {
  const checkedClass = state.checkedIn ? "checked" : "";
  const celebrateClass = state.checkinCelebrating ? "celebrating" : "";
  const checkText = state.checkedIn ? "已签到" : "签到";
  const homeAgreements = state.homeStatus === "全部"
    ? agreements.slice(0, 3)
    : agreements.filter(item => item.status === state.homeStatus).slice(0, 3);
  return `
    <section class="glass home-profile-card ${checkedClass} ${celebrateClass}">
      <span class="coin-particle"></span><span class="coin-particle"></span><span class="coin-particle"></span>
      <div class="profile-topline">
        <div class="avatar-wrap"><div class="avatar">明</div></div>
        <div class="identity">
          <strong>小明</strong>
          <p>愿每一次约定，都被温柔守护</p>
          <div class="level-row">
            <span class="score-pill">信芽 ${state.score}分</span>
            <span class="level-pill">Lv2 热心市民</span>
          </div>
        </div>
        <div class="profile-side">
          <button class="icon-action has-dot" onclick="go('messages')" aria-label="消息通知">◌</button>
          <button class="checkin-capsule" onclick="event.stopPropagation(); handleCheckinClick()">
            <span>${state.checkedIn ? "✓" : "✦"}</span>
            <strong>${checkText}</strong>
            <div class="score-pop">+10</div>
          </button>
        </div>
      </div>
    </section>

    <section class="home-action-zone">
      <button class="assist-pill lend-pill" onclick="go('lend')">
        <span class="assist-icon">🤝</span>
        <strong>出手相助</strong>
      </button>
      <button class="assist-pill help-pill" onclick="go('emergency')">
        <span class="assist-icon">🏃</span>
        <strong>江湖救急</strong>
      </button>
    </section>

    <section class="glass home-agreements-panel">
      <div class="home-section-title">
        <div>
          <h2>📋 我的约定 <span class="section-count-dot">${homeAgreements.length}</span></h2>
        </div>
        <button onclick="go('agreements')">查看全部</button>
      </div>
      <div class="agreement-count-grid">
        ${statusMini("草稿", "2", "b-draft")}${statusMini("进行中", "8", "b-progress")}${statusMini("待确认", "4", "b-pending")}${statusMini("已完成", "12", "b-completed")}${statusMini("已逾期", "1", "b-overdue")}${statusMini("延期中", "1", "b-extended")}
      </div>
      ${homeAgreements.length ? homeAgreements.map(agreementCard).join("") : homeEmptyState()}
    </section>
  `;
}
function handleCheckinClick() {
  if (!state.checkedIn) {
    state.checkedIn = true;
    state.checkinCelebrating = true;
    state.score += 10;
    state.growth += 10;
    render();
    showToast("签到成功 +10");
    window.clearTimeout(handleCheckinClick.timer);
    handleCheckinClick.timer = window.setTimeout(() => {
      state.checkinCelebrating = false;
      if (state.route === "home") render();
    }, 1100);
    return;
  }
  go("checkin");
}

function mini(label, value) {
  return `<div class="mini"><b>${value}</b><span>${label}</span></div>`;
}

function statusMini(label, value, badge) {
  const active = state.homeStatus === label ? "active" : "";
  return `<button class="mini status-mini ${badge} ${active}" onclick="setHomeStatus('${label}')"><span class="mini-icon">${statusIcon(label)}</span><b>${value}</b><span>${label}</span></button>`;
}

function setHomeStatus(status) {
  state.homeStatus = state.homeStatus === status ? "全部" : status;
  state.expandedId = null;
  render();
}

function homeEmptyState() {
  return `
    <div class="home-agreement-empty">
      <strong>暂无${state.homeStatus}约定</strong>
      <span>换个状态看看，或进入全部约定</span>
    </div>
  `;
}

function reminder(title, sub, badgeClass, badgeText) {
  return `<div class="reminder-item" onclick="go('detail')"><div class="icon-bubble">!</div><div class="item-main"><strong>${title}</strong><span>${sub}</span></div><span class="badge ${badgeClass}">${badgeText}</span></div>`;
}

function timeline(icon, title, sub) {
  return `<div class="timeline-item"><div class="icon-bubble">${icon}</div><div class="item-main"><strong>${title}</strong><span>${sub}</span></div></div>`;
}

function activity(icon, title, sub) {
  return `<div class="activity-item"><div class="icon-bubble">${icon}</div><div class="item-main"><strong>${title}</strong><span>${sub}</span></div></div>`;
}

function dataCard(label, value) {
  return `<div class="data-card"><b>${value}</b><span>${label}</span><div class="spark"></div></div>`;
}

function renderLend() {
  return formPage("出手相助", "给朋友撑一把伞", "把金额、日期和约定说清楚，关系就少一点尴尬。", [
    ["👤", "借款人", "选择需要帮助的朋友", "input"],
    ["¥", "金额", "请输入金额", "input"],
    ["📅", "还款日期", "选择约定归还日期", "input"],
    ["📝", "借款缘由", "简单说明这笔周转的缘由", "textarea", ["临时周转", "项目采购", "生活应急", "医疗支出"]],
    ["📎", "辅助凭证", "上传聊天记录、合同或说明材料", "input"],
    ["💬", "提醒语", "写一句只有对方可见的温暖提醒", "textarea", ["周转顺利就好", "有需要随时说", "按约定来就好", "记得提前沟通"]]
  ], "发送约定", "lend");
}

function renderEmergency() {
  return formPage("江湖救急", "有困难，也可以坦诚开口", "把需求和归还计划说清楚，信任会更容易被看见。", [
    ["👤", "出借人", "选择想请求帮助的朋友", "input"],
    ["¥", "金额", "请输入需要周转的金额", "input"],
    ["📅", "还款日期", "选择预计归还日期", "input"],
    ["📝", "借款缘由", "说明遇到的情况", "textarea", ["临时周转", "医疗急用", "房租应急", "学习费用"]],
    ["📎", "辅助凭证", "上传病历、聊天记录或说明材料", "input"],
    ["💗", "补充说明", "写下感谢和归还承诺", "textarea", ["谢谢你愿意帮我", "我会按时归还", "情况稳定后第一时间处理", "需要我补充说明可以告诉我"]]
  ], "发送求助", "help");
}

function formPage(title, hero, desc, fields, submit, theme = "lend") {
  return `
    ${nav(title)}
    <section class="glass form-hero form-hero-${theme}">
      <span>${theme === "lend" ? "🤝" : "💗"}</span>
      <div>
        <h2>${hero}</h2>
        <p>${desc}</p>
      </div>
    </section>
    <section class="glass form-card agreement-form-card form-theme-${theme}">
      <div class="form-section-title"><h3>填写约定信息</h3><span>清楚一点，关系轻一点</span></div>
      ${fields.map(([icon, label, placeholder, type, options]) => formField(icon, label, placeholder, type, options)).join("")}
      <div class="form-note-card">
        <b>温馨提示</b>
        <p>还了么只记录约定和提醒，不提供资金、担保或催收服务。</p>
      </div>
      <div class="action-row form-action-row">
        <button class="secondary-btn" onclick="goBack()">取消</button>
        <button class="primary-btn ${theme === "help" ? "help-submit" : "lend-submit"}" onclick="showToast('已提交，等待对方确认'); go('detail')">${submit}</button>
      </div>
    </section>
  `;
}

function formField(icon, label, placeholder, type, options = []) {
  const control = type === "textarea"
    ? `<textarea placeholder="${placeholder}"></textarea>`
    : `<input placeholder="${placeholder}" />`;
  const optionChips = options.length
    ? `<div class="field-options">${options.map(option => `<button type="button" onclick="fillFieldOption(this, '${escapeAttr(option)}')">${option}</button>`).join("")}</div>`
    : "";
  return `
    <div class="field form-field-card">
      <span class="form-field-icon">${icon}</span>
      <div>
        <label>${label}</label>
        ${optionChips}
        ${control}
      </div>
    </div>
  `;
}

function escapeAttr(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function fillFieldOption(button, value) {
  const field = button.closest(".form-field-card");
  const control = field && field.querySelector("textarea, input");
  if (!control) return;
  control.value = value;
  field.querySelectorAll(".field-options button").forEach(item => item.classList.toggle("active", item === button));
}

function renderDetail() {
  const item = agreements.find(x => x.id === (state.params && state.params.id)) || agreements[0];
  const agreementNo = agreementNumber(item.id);
  return `
    ${nav("约定详情")}
    <section class="glass hero-card detail-hero">
      <div class="detail-hero-top">
        <span class="badge ${item.badge}">${item.status}</span>
        <span class="detail-no">借条编号 ${agreementNo}</span>
      </div>
      <h2>${money(item.amount)}</h2>
      <p>约定归还日：2026-07-05 · ${item.date}</p>
      <div class="detail-hero-strip">
        <span>发起人</span>
        <b>${item.name}</b>
      </div>
    </section>

    <section class="glass detail-section">
      <div class="detail-section-title"><h3>约定信息</h3></div>
      <div class="detail-info-stack">
        ${detailInfo("👤", "出借人", "我")}
        ${detailInfo("🙂", "借款人", item.name)}
        ${detailInfo("📅", "归还日期", "2026-07-05")}
        ${detailInfo("📝", "借款缘由", item.reason)}
      </div>
      <div class="quote-card">
        <span>“</span>
        <p>${item.remind}</p>
      </div>
    </section>

    <section class="glass detail-section">
      <div class="detail-section-title"><h3>辅助凭证</h3><span>3 张占位</span></div>
      <div class="voucher-grid">
        ${voucherTile("聊天记录", "1")}
        ${voucherTile("转账说明", "2")}
        ${voucherTile("补充材料", "3")}
      </div>
    </section>

    <section class="glass detail-section">
      <div class="detail-section-title"><h3>约定动态</h3><span>实时记录</span></div>
      <div class="detail-timeline">
        ${detailTimeline("今天", "查看约定详情", "你正在确认这份约定的当前状态。")}
        ${detailTimeline("6/21", "延期状态更新", "双方已确认新的归还计划。")}
        ${detailTimeline("6/05", "好友确认约定", `${item.name} 已确认这份约定。`)}
        ${detailTimeline("6/04", "约定已创建", "借条信息、提醒语和凭证已保存。")}
      </div>
    </section>

    <section class="glass detail-section">
      <div class="detail-section-title"><h3>延期记录</h3><span>原因说明</span></div>
      <div class="detail-timeline compact">
        ${detailTimeline("6/20", "延期原因", "临时资金安排延后，希望归还日期调整至 2026-07-10。")}
        ${detailTimeline("6/21", "双方确认", "对方已理解原因，新的归还日期已同步到约定。")}
      </div>
    </section>

    <section class="glass credit-file-card">
      <div class="detail-section-title"><h3>约定时信誉快照</h3><span>双方信息</span></div>
      <div class="credit-snapshot-grid">
        ${creditSnapshot("我", state.score, "Lv2 热心市民", "守约率 96%")}
        ${creditSnapshot(item.name, 486, "Lv2 稳定记录", "完成约定 8 次")}
      </div>
    </section>

    <section class="detail-action-dock">
      <button class="secondary-btn" onclick="go('delay')">申请延期</button>
      <button class="secondary-btn contact-btn" onclick="showToast('已打开联系入口')">联系对方</button>
      <button class="primary-btn" onclick="showToast('确认完成，信誉记录已更新')">确认完成</button>
    </section>
  `;
}

function agreementNumber(id) {
  return `HLM-20260705-${String(id).padStart(4, "0")}`;
}

function detailInfo(icon, label, value) {
  return `<div class="detail-info-card"><span>${icon}</span><div><em>${label}</em><strong>${value}</strong></div></div>`;
}

function voucherTile(title, index) {
  return `<div class="voucher-tile"><span>📎</span><strong>${title}</strong><em>#${index}</em></div>`;
}

function detailTimeline(time, title, desc) {
  return `<div class="detail-timeline-item"><i></i><time>${time}</time><div><strong>${title}</strong><p>${desc}</p></div></div>`;
}

function creditSnapshot(name, score, level, sub) {
  return `
    <div class="credit-snapshot-card">
      <div class="credit-snapshot-score"><b>${score}</b><span>信芽分</span></div>
      <strong>${name}</strong>
      <p>${level}</p>
      <em>${sub}</em>
    </div>
  `;
}

function renderDelay() {
  return formPage("延期申请", "说明情况，等待确认", "提交后将等待对方确认；对方同意后，新的还款日期才会生效。", [
    ["新还款日期", "选择新的归还日期", "input"],
    ["延期原因", "说明需要延期的原因", "textarea"]
  ], "提交申请");
}

function renderMessages() {
  const messages = getMessages();
  const filtered = state.messageTab === "全部" ? messages : messages.filter(item => item.type === state.messageTab);
  const groups = ["今天", "昨天", "更早"];
  return `
    ${nav("消息")}
    <section class="glass message-center-page">
      <div class="message-stats-card">
        <button class="mark-read-btn" onclick="markAllMessagesRead()">全部已读</button>
        ${messageStat("未读", "12", "✦")}
        ${messageStat("约定提醒", countMessages(messages, "约定"), "📌")}
        ${messageStat("成长通知", countMessages(messages, "成长"), "🌱")}
        ${messageStat("系统通知", countMessages(messages, "系统"), "◌")}
      </div>

      <div class="message-tabs">
        ${["全部", "约定", "成长", "系统"].map(tab => `<button class="${state.messageTab === tab ? "active" : ""}" onclick="setMessageTab('${tab}')">${tab}</button>`).join("")}
      </div>

      <div class="message-list">
        ${groups.map(group => renderMessageGroup(group, filtered.filter(item => item.group === group))).join("")}
      </div>
    </section>
  `;
}

function getMessages() {
  return [
    { type: "约定", group: "今天", unread: true, icon: "📌", title: "小李同学的约定即将到期", time: "10:24", summary: "¥2,000 将在 3 天后到期，记得提前沟通。", action: "查看约定", route: "detail" },
    { type: "成长", group: "今天", unread: true, icon: "🌱", title: "信誉分更新", time: "09:12", summary: "今日签到完成，信芽分 +10，连续记录保持中。", action: "查看成长记录", route: "credit" },
    { type: "系统", group: "今天", unread: true, icon: "◌", title: "凭证隐私提醒", time: "08:40", summary: "上传凭证仅约定双方可见，请放心保存记录。", action: "查看详情", route: "messages" },
    { type: "约定", group: "昨天", unread: true, icon: "📅", title: "延期申请已同步", time: "18:30", summary: "小陈同学申请延期至 7/10，等待你查看确认。", action: "查看约定", route: "detail" },
    { type: "成长", group: "昨天", unread: false, icon: "⭐", title: "完成约定获得成长值", time: "14:06", summary: "你完成一笔聚餐垫付约定，信誉记录更稳定。", action: "查看成长记录", route: "credit" },
    { type: "系统", group: "更早", unread: false, icon: "🔒", title: "数据安全说明", time: "6/02", summary: "还了么只记录约定与提醒，不提供资金、担保或催收服务。", action: "查看详情", route: "messages" },
    { type: "约定", group: "更早", unread: false, icon: "📝", title: "草稿约定待完善", time: "5/30", summary: "你有一份备用记录还未发送，可以继续补充信息。", action: "查看约定", route: "agreements" }
  ];
}

function countMessages(messages, type) {
  return messages.filter(item => item.type === type).length;
}

function messageStat(label, value, icon) {
  return `<div class="message-stat"><span>${icon}</span><b>${value}</b><em>${label}</em></div>`;
}

function renderMessageGroup(group, messages) {
  if (!messages.length) return "";
  return `
    <section class="message-group">
      <h3>${group}</h3>
      ${messages.map(renderMessageItem).join("")}
    </section>
  `;
}

function renderMessageItem(item) {
  return `
    <article class="message-card ${item.unread ? "unread" : ""}">
      <div class="message-icon ${messageTypeClass(item.type)}">${item.icon}</div>
      <div class="message-content">
        <div class="message-title-row"><strong>${item.title}</strong><time>${item.time}</time></div>
        <p>${item.summary}</p>
        <button onclick="go('${item.route}')">${item.action}</button>
      </div>
    </article>
  `;
}

function messageTypeClass(type) {
  return { "约定": "contract", "成长": "growth", "系统": "system" }[type] || "system";
}

function setMessageTab(tab) {
  state.messageTab = tab;
  render();
}

function markAllMessagesRead() {
  showToast("已全部标为已读");
}

function getFriendRanks() {
  return [
    [1, "李", "小李同学", "12", "100%", "¥28,600", "gold"],
    [2, "周", "阿周同学", "9", "98%", "¥18,200", "silver"],
    [3, "陈", "小陈同学", "7", "96%", "¥12,800", "bronze"],
    [4, "钱", "小钱同学", "6", "95%", "¥8,600", "normal"],
    [5, "林", "林同学", "5", "93%", "¥6,200", "normal"],
    [6, "王", "小王同学", "5", "92%", "¥5,900", "normal"],
    [7, "赵", "赵同学", "4", "90%", "¥4,800", "normal"],
    [8, "许", "许同学", "4", "88%", "¥4,200", "normal"],
    [9, "沈", "沈同学", "3", "86%", "¥3,600", "normal"],
    [10, "何", "何同学", "3", "85%", "¥2,900", "normal"]
  ];
}

function renderReports() {
  const yearOptions = [2024, 2025, 2026];
  const visibleFriends = getFriendRanks().slice(0, 3);
  return `
    ${nav("报表")}
    <section class="reports-page">
      <section class="glass report-overview ${state.reportOverviewOpen ? "expanded" : ""}" onclick="toggleReportOverview()">
        <div class="report-section-head">
          <div>
            <h2>借条总览</h2>
            <span>年度数据</span>
          </div>
          <span class="year-current" aria-hidden="true"><i></i></span>
        </div>
        <div class="report-year-filter" onclick="event.stopPropagation()">
          <button class="year-all ${state.reportYear === "全部数据" ? "active" : ""}" onclick="setReportYear('全部数据')">全部</button>
          <span class="year-divider"></span>
          <div class="report-year-scroll">
          ${yearOptions.map(option => {
            const active = state.reportYear === option ? "active" : "";
            return `<button class="${active}" onclick="setReportYear('${option}')">${option}</button>`;
          }).join("")}
          </div>
        </div>
        <div class="report-money-row">
          <div class="report-money-card lend"><span>借出金额</span><strong>¥86,000</strong></div>
          <div class="report-money-card borrow"><span>借入金额</span><strong>¥12,000</strong></div>
        </div>
        <div class="report-overview-grid">
          ${reportMetric("↔", "总流转金额", "¥98,000")}
          ${reportMetric("✓", "守约率", "96%")}
          ${reportMetric("★", "已完成约定", "42")}
          ${reportMetric("⌛", "待完成约定", "9")}
          ${reportMetric("!", "逾期次数", "1")}
          ${reportMetric("👥", "好友数量", "28")}
        </div>
      </section>

      <section class="glass friend-rank-card">
        <div class="report-section-head compact">
          <h2>好友梯度榜</h2>
          <button onclick="go('friendRank')">查看全部 ></button>
        </div>
        <div class="friend-rank-list">
          ${visibleFriends.map(item => friendRank(...item)).join("")}
        </div>
      </section>

      <section class="glass report-chart-card">
        <div class="report-chart-switch">
          <button class="lend-mode ${state.reportLineMode !== "borrow" ? "active" : ""}" onclick="setReportLineMode('lend')">借出</button>
          <button class="borrow-mode ${state.reportLineMode === "borrow" ? "active" : ""}" onclick="setReportLineMode('borrow')">借入</button>
        </div>
        ${lineChart(state.reportLineMode === "borrow" ? "borrow" : "lend")}
      </section>

      <section class="glass report-donut-card">
        <div class="donut-visual">
          <div class="donut-ring"></div>
          <div class="donut-core"><span>总金额</span><strong>¥98,000</strong></div>
        </div>
        <div class="donut-legend">
          ${donutLegend("借出", "86k", "#8b5cf6")}
          ${donutLegend("借入", "12k", "#f87171")}
          ${donutLegend("已完成", "42", "#22c55e")}
          ${donutLegend("待完成", "9", "#facc15")}
          ${donutLegend("逾期", "1", "#ef4444")}
        </div>
      </section>

      <section class="glass report-bar-card">
        <div class="bar-chart">
          ${barItem("出手相助", 28, 28, "violet")}
          ${barItem("江湖救急", 10, 28, "pink")}
          ${barItem("已完成", 24, 28, "green")}
          ${barItem("待完成", 5, 28, "yellow")}
          ${barItem("逾期", 1, 28, "red")}
        </div>
      </section>
    </section>
  `;
}

function reportMetric(icon, label, value) {
  return `<div class="report-metric"><i class="metric-icon">${icon}</i><em>${label}</em><strong>${value}</strong></div>`;
}

function friendRank(rank, avatar, name, times, rate, amount, tone) {
  return `
    <div class="friend-rank-row ${tone}">
      <span class="rank-medal">${rank}</span>
      <span class="rank-avatar">${avatar}</span>
      <div class="rank-info"><strong>${name}</strong><span>${times} 次 · 守约率 ${rate}</span></div>
      <b>${amount}</b>
    </div>
  `;
}

function lineChart(mode) {
  const lend = [18, 28, 34, 30, 42, 50, 56, 68, 74, 82, 90, 96];
  const borrow = [16, 22, 18, 28, 25, 34, 30, 42, 38, 48, 44, 54];
  const data = mode === "borrow" ? borrow : lend;
  const points = data.map((value, index) => `${index * 28},${120 - value}`).join(" ");
  const labels = data.map((value, index) => {
    const x = Math.max(16, Math.min(292, index * 28));
    const y = Math.max(14, 110 - value);
    return `<text x="${x}" y="${y}" class="chart-amount-label">${formatChartAmount(value)}</text>`;
  }).join("");
  return `
    <div class="line-chart ${mode}">
      <div class="line-grid"></div>
      <svg viewBox="0 0 308 132" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="lineGradient-${mode}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${mode === "borrow" ? "#fecaca" : "#c4b5fd"}"></stop>
            <stop offset="100%" stop-color="${mode === "borrow" ? "#f87171" : "#8b5cf6"}"></stop>
          </linearGradient>
          <linearGradient id="areaGradient-${mode}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${mode === "borrow" ? "#f87171" : "#8b5cf6"}" stop-opacity=".22"></stop>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <polygon points="0,132 ${points} 308,132" fill="url(#areaGradient-${mode})"></polygon>
        <polyline points="${points}" fill="none" stroke="url(#lineGradient-${mode})" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></polyline>
        ${data.map((value, index) => `<circle cx="${index * 28}" cy="${120 - value}" r="4" class="node"></circle>`).join("")}
        ${labels}
      </svg>
    </div>
  `;
}

function formatChartAmount(value) {
  return `${(value / 10).toFixed(2)}万`;
}

function donutLegend(label, value, color) {
  return `<div class="donut-legend-row"><i style="background:${color}"></i><span>${label}</span><b>${value}</b></div>`;
}

function barItem(label, value, max, tone) {
  const width = Math.max(8, Math.round((value / max) * 100));
  return `<div class="bar-item ${tone}"><span>${label}</span><div class="bar-track"><i style="width:${width}%"></i></div><b>${value}</b></div>`;
}

function setReportYear(year) {
  const parsed = Number(year);
  state.reportYear = Number.isNaN(parsed) ? year : parsed;
  render();
}

function toggleReportOverview() {
  state.reportOverviewOpen = !state.reportOverviewOpen;
  const overview = document.querySelector(".report-overview");
  if (!overview) {
    render();
    return;
  }
  overview.classList.toggle("expanded", state.reportOverviewOpen);
}

function toggleFriendRank(event) {
  if (event) event.stopPropagation();
  go("friendRank");
}

function setReportLineMode(mode) {
  state.reportLineMode = mode;
  render();
}

function renderFriendRankPage() {
  const yearText = state.reportYear === "全部数据" ? "全部" : `${state.reportYear}年`;
  const sortedRanks = state.friendRankOrder === "asc"
    ? [...getFriendRanks()].reverse()
    : getFriendRanks();
  return `
    ${nav("好友排行")}
    <section class="reports-page friend-rank-page">
      <section class="glass rank-summary-card">
        <div class="rank-summary-head">
          <div class="rank-summary-title">
            <span>🏅</span>
            <strong>好友梯度榜</strong>
          </div>
          <span class="rank-year-badge">${yearText}</span>
        </div>
        <div class="rank-summary-grid">
          ${reportMetric("👥", "上榜好友", "10")}
          ${reportMetric("✓", "平均守约率", "92%")}
          ${reportMetric("↔", "累计金额", "¥86k")}
        </div>
      </section>
      <section class="glass friend-rank-card full">
        <div class="report-section-head compact">
          <h2>英雄榜</h2>
          <button onclick="toggleFriendRankOrder()">${state.friendRankOrder === "desc" ? "正序排序" : "倒序排序"}</button>
        </div>
        <div class="friend-rank-list all">
          ${sortedRanks.map(item => friendRank(...item)).join("")}
        </div>
      </section>
    </section>
  `;
}

function toggleFriendRankOrder() {
  state.friendRankOrder = state.friendRankOrder === "desc" ? "asc" : "desc";
  render();
}

function renderLedger() {
  const dateInfo = ledgerDateInfo(state.ledgerDateOffset);
  const finance = ledgerFinanceSummary();
  const expenses = ledgerExpenses().filter(item => !state.ledgerDeletedExpenseIds.includes(item.id));
  const totalSpent = expenses.filter(item => item.kind !== "income").reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = expenses.filter(item => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const todayPercent = Math.min(100, Math.round((totalSpent / finance.dailyBudget) * 100));
  return `
    <section class="ledger-page">
      <section class="ledger-date-card" aria-label="账本日期">
        <button onclick="changeLedgerDate(-1)" aria-label="前一天">‹</button>
        <div>
          <strong>${dateInfo.full}</strong>
          <span>▦ ${dateInfo.weekday}${dateInfo.isToday ? "<em>今天</em>" : ""}</span>
        </div>
        <button onclick="changeLedgerDate(1)" aria-label="后一天">›</button>
      </section>

      <section class="glass ledger-budget-card ${state.ledgerBudgetOpen ? "expanded" : ""}" onclick="toggleLedgerBudget()">
        <div class="ledger-card-head">
          <strong><span>¥</span> 收支</strong>
          <button class="ledger-arrow-btn" onclick="event.stopPropagation(); go('ledgerBudget')" aria-label="查看预算设置">›</button>
        </div>
        <div class="ledger-budget-brief">
          <div><span>已用 ¥${totalSpent} / ¥${finance.dailyBudget}</span><b>${todayPercent}%</b></div>
          <div class="ledger-progress"><i style="width:${todayPercent}%"></i></div>
          <p>今日剩余 ¥${Math.max(0, finance.dailyBudget - totalSpent)}</p>
        </div>
        <div class="ledger-budget-expand">
          <div class="ledger-flow-grid">
            ${ledgerFlowMetric("消费", `-¥${totalSpent}`, "expense")}
            ${ledgerFlowMetric("预算", `¥${finance.dailyBudget}`, "budget")}
            ${ledgerFlowMetric("收入", `+¥${totalIncome}`, "income")}
          </div>
          <div class="ledger-budget-detail">
            <div class="ledger-ring" style="--p:${todayPercent * 3.6}deg"><b>${todayPercent}%</b><span>已用</span></div>
            <div class="ledger-budget-lines">
              ${ledgerBudgetLine("预算", `¥${finance.dailyBudget}`, "")}
              ${ledgerBudgetLine("消费", `-¥${totalSpent}`, "spent")}
              ${ledgerBudgetLine("剩余", `¥${Math.max(0, finance.dailyBudget - totalSpent)}`, "remain")}
            </div>
          </div>
        </div>
      </section>

      <section class="glass ledger-distribution-card ${state.ledgerDistributionOpen ? "expanded" : ""}" onclick="toggleLedgerDistribution()">
        <div class="ledger-distribution-head">
          <strong><span>◫</span> 消费分布</strong>
          <button class="ledger-arrow-btn amber" onclick="event.stopPropagation(); go('ledgerDistribution')" aria-label="查看消费分布">›</button>
        </div>
        <div class="ledger-distribution-body">
          ${ledgerDistributionItem("餐饮", 30, 60, "food")}
          ${ledgerDistributionItem("超市", 18, 60, "shop")}
          ${ledgerDistributionItem("通勤", 5, 60, "traffic")}
        </div>
      </section>

      <section class="glass ledger-list-card">
        <div class="ledger-list-head"><strong>▤ 收支</strong><b><span>-¥${totalSpent}</span><em>+¥${totalIncome}</em></b></div>
        <div class="ledger-expense-list">
          ${expenses.map(ledgerExpenseItem).join("")}
        </div>
      </section>
    </section>
  `;
}

function ledgerDateInfo(offset) {
  const date = new Date(2026, 5, 6);
  date.setDate(date.getDate() + offset);
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return {
    full: `${year}年${month}月${day}日`,
    short: `${month}/${day}`,
    day,
    weekday: weekdays[date.getDay()],
    isToday: offset === 0
  };
}

function ledgerBudgetData() {
  return {
    today: { total: 200, spent: 60 },
    week: { total: 1400, spent: 420 },
    month: { total: 6000, spent: 1680 }
  };
}

function ledgerFinanceSummary() {
  const monthBudget = 6000;
  return {
    monthBudget,
    dailyBudget: Math.round(monthBudget / 30),
    monthSpent: 1680,
    monthIncome: 8200
  };
}

function ledgerFlowMetric(label, value, tone) {
  return `<div class="ledger-flow-metric ${tone}"><span>${label}</span><strong>${value}</strong></div>`;
}

function ledgerBudgetLine(label, value, tone) {
  return `<div class="ledger-budget-line ${tone}"><span>${label}</span><b>${value}</b></div>`;
}

function ledgerDistributionItem(label, value, max, tone) {
  const width = Math.max(9, Math.round((value / max) * 100));
  return `<div class="ledger-dist-item ${tone}"><span>${label}</span><div><i style="width:${width}%"></i></div><b>¥${value}</b></div>`;
}

function ledgerExpenses() {
  return [
    { id: 5, title: "兼职收入", time: "10:00", amount: 280, tone: "income", kind: "income", note: "周末设计稿尾款入账，记为收入。" },
    { id: 1, title: "午餐", time: "12:30", amount: 30, tone: "food", note: "公司楼下简餐，今天偏清淡。" },
    { id: 2, title: "超市", time: "18:40", amount: 18, tone: "shop", note: "买了牛奶和纸巾，属于日常补给。" },
    { id: 3, title: "地铁", time: "08:15", amount: 5, tone: "traffic", note: "上班通勤，固定交通支出。" },
    { id: 4, title: "咖啡", time: "15:20", amount: 7, tone: "coffee", note: "下午开会前买了一杯小杯咖啡。" }
  ];
}

function ledgerExpenseItem(item) {
  const { id, title, time, amount, tone, note, kind } = item;
  const iconMap = { food: "餐", shop: "购", traffic: "行", coffee: "啡", income: "收" };
  const expanded = state.ledgerExpandedExpenseId === id ? "expanded" : "";
  const swiped = state.ledgerSwipedExpenseId === id ? "swiped" : "";
  const isIncome = kind === "income";
  return `
    <article class="ledger-expense-item ${tone} ${isIncome ? "income" : ""} ${expanded} ${swiped}" data-ledger-expense-id="${id}" onclick="toggleLedgerExpense(${id})">
      <div class="ledger-expense-main">
        <span>${iconMap[tone] || "记"}</span>
        <div><strong>${title}</strong><em>${time}</em></div>
        <b>${isIncome ? "+" : "-"}¥${amount}</b>
      </div>
      <div class="ledger-expense-note" onclick="event.stopPropagation(); editLedgerNote(${id})"><span>${note}</span><button>修改</button></div>
      <button class="ledger-delete-btn" onclick="event.stopPropagation(); deleteLedgerExpense(${id})">×</button>
    </article>
  `;
}

function changeLedgerDate(delta, absolute = false) {
  state.ledgerDateOffset = absolute ? delta : state.ledgerDateOffset + delta;
  state.ledgerDatePickerOpen = false;
  render();
}

function toggleLedgerBudget() {
  state.ledgerBudgetOpen = !state.ledgerBudgetOpen;
  const card = document.querySelector(".ledger-budget-card");
  if (!card) {
    render();
    return;
  }
  card.classList.toggle("expanded", state.ledgerBudgetOpen);
  const label = card.querySelector(".ledger-card-head em");
  if (label) label.textContent = "";
}

function toggleLedgerDistribution() {
  state.ledgerDistributionOpen = !state.ledgerDistributionOpen;
  const card = document.querySelector(".ledger-distribution-card");
  if (!card) {
    render();
    return;
  }
  card.classList.toggle("expanded", state.ledgerDistributionOpen);
  const label = card.querySelector(".ledger-distribution-head em");
  if (label) label.textContent = "";
}

function toggleLedgerExpense(id) {
  state.ledgerSwipedExpenseId = state.ledgerSwipedExpenseId === id ? null : state.ledgerSwipedExpenseId;
  state.ledgerExpandedExpenseId = state.ledgerExpandedExpenseId === id ? null : id;
  const items = document.querySelectorAll(".ledger-expense-item");
  if (!items.length) {
    render();
    return;
  }
  items.forEach(item => {
    const isTarget = item.getAttribute("data-ledger-expense-id") === String(id);
    item.classList.toggle("expanded", isTarget && state.ledgerExpandedExpenseId === id);
    if (isTarget) item.classList.remove("swiped");
  });
}

function deleteLedgerExpense(id) {
  state.ledgerDeletedExpenseIds.push(id);
  state.ledgerExpandedExpenseId = null;
  state.ledgerSwipedExpenseId = null;
  showToast("已删除这笔消费");
  render();
}

function editLedgerNote(id) {
  showToast(`修改第 ${id} 笔备注`);
}

function addLedgerExpense() {
  state.ledgerAddSheetOpen = true;
  renderLedgerSheet();
}

function closeLedgerAddSheet() {
  state.ledgerAddSheetOpen = false;
  renderLedgerSheet();
}

function setLedgerAddType(type) {
  state.ledgerAddType = type;
  state.ledgerAddCategory = type === "income" ? "salary" : "other";
  renderLedgerSheet(true);
}

function setLedgerAddCategory(category) {
  state.ledgerAddCategory = category;
  renderLedgerSheet(true);
}

function submitLedgerEntry() {
  state.ledgerAddSheetOpen = false;
  renderLedgerSheet();
  showToast(state.ledgerAddType === "income" ? "收入已记录" : "支出已记录");
}

function renderLedgerSheet(quiet = false) {
  if (!ledgerSheet) return;
  ledgerSheet.innerHTML = state.ledgerAddSheetOpen ? ledgerAddSheetTemplate(quiet) : "";
}

function ledgerAddSheetTemplate(quiet = false) {
  const isIncome = state.ledgerAddType === "income";
  const categories = isIncome
    ? [
        ["salary", "💰", "工资"],
        ["bonus", "🎁", "红包"],
        ["parttime", "💼", "兼职"],
        ["finance", "📈", "理财"],
        ["reward", "🏆", "奖励"],
        ["otherIncome", "💵", "其它收入"]
      ]
    : [
        ["other", "✨", "其他"],
        ["food", "🍱", "餐饮"],
        ["traffic", "🚇", "交通"],
        ["shop", "🛒", "购物"],
        ["game", "🎮", "娱乐"],
        ["study", "📚", "学习"],
        ["medical", "🏥", "医疗"],
        ["home", "🏠", "住房"],
        ["gift", "🎁", "礼物"],
        ["beauty", "💄", "美妆"],
        ["pet", "🐱", "宠物"],
        ["travel", "✈️", "旅行"]
      ];
  return `
    <div class="ledger-sheet-mask ${quiet ? "no-animate" : ""}" onclick="closeLedgerAddSheet()"></div>
    <section class="ledger-add-sheet ${quiet ? "no-animate" : ""}" role="dialog" aria-label="添加收支">
      <div class="ledger-sheet-grabber"></div>
      <div class="ledger-add-type-tabs">
        <button class="${!isIncome ? "active expense" : ""}" onclick="setLedgerAddType('expense')">支出</button>
        <button class="${isIncome ? "active income" : ""}" onclick="setLedgerAddType('income')">收入</button>
      </div>
      <div class="ledger-add-form">
        <div class="ledger-category-line">
          <span>分类</span>
          <div class="ledger-category-row">
          ${categories.map(([key, icon, label]) => `
            <button class="${state.ledgerAddCategory === key ? "active" : ""}" onclick="setLedgerAddCategory('${key}')">
              <i>${icon}</i><span>${label}</span>
            </button>
          `).join("")}
            <button class="ledger-category-add" onclick="showToast('添加分类待接入')"><i>+</i><span>新增</span></button>
          </div>
        </div>
        <label class="ledger-quick-field amount ${isIncome ? "income" : ""}">
          <span>金额</span>
          <input value="${isIncome ? "¥280" : "¥30"}" inputmode="decimal" aria-label="金额" />
          <div>
            <button>¥30</button><button>¥100</button><button>¥500</button>
          </div>
        </label>
        <label class="ledger-quick-field note">
          <span>备注</span>
          <input placeholder="写点什么..." value="${isIncome ? "兼职" : "午餐"}" aria-label="备注" />
        </label>
      </div>
      <div class="ledger-add-action-row">
        <span class="ledger-added-count">3</span>
        <button class="ledger-add-to-list" onclick="showToast('已加入待保存列表')" aria-label="加入待保存">+</button>
      </div>
      <div class="ledger-pending-list">
        ${ledgerPendingItem("🍱", "午餐", "支出 · 餐饮", "-¥30", "expense")}
        ${ledgerPendingItem("🛒", "超市", "支出 · 购物", "-¥18", "expense")}
        ${ledgerPendingItem("💰", "兼职", "收入 · 其他", "+¥280", "income")}
      </div>
      <div class="ledger-sheet-actions">
        <button onclick="closeLedgerAddSheet()">取消</button>
        <button class="save" onclick="submitLedgerEntry()">保存</button>
      </div>
    </section>
  `;
}

function ledgerPendingItem(icon, title, meta, amount, tone) {
  return `
    <article class="ledger-pending-item ${tone}">
      <i>${icon}</i>
      <div><strong>${title}</strong><span>${meta}</span></div>
      <b>${amount}</b>
      <button onclick="showToast('已删除这条待保存')">×</button>
    </article>
  `;
}

function bindLedgerSwipe() {
  const target = document.querySelector(".ledger-date-card");
  if (!target) return;
  let startX = 0;
  target.addEventListener("touchstart", event => {
    startX = event.touches[0].clientX;
  }, { passive: true });
  target.addEventListener("touchend", event => {
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 42) changeLedgerDate(delta > 0 ? -1 : 1);
  }, { passive: true });
  bindLedgerExpenseSwipe();
}

function bindLedgerExpenseSwipe() {
  document.querySelectorAll(".ledger-expense-item").forEach(item => {
    let startX = 0;
    item.addEventListener("touchstart", event => {
      startX = event.touches[0].clientX;
    }, { passive: true });
    item.addEventListener("touchend", event => {
      const delta = event.changedTouches[0].clientX - startX;
      const id = Number(item.getAttribute("data-ledger-expense-id"));
      if (delta < -36) {
        state.ledgerSwipedExpenseId = id;
        state.ledgerExpandedExpenseId = null;
        document.querySelectorAll(".ledger-expense-item").forEach(row => {
          row.classList.toggle("swiped", row === item);
          row.classList.remove("expanded");
        });
      } else if (delta > 36 && state.ledgerSwipedExpenseId === id) {
        state.ledgerSwipedExpenseId = null;
        item.classList.remove("swiped");
      }
    }, { passive: true });
  });
}

function renderLedgerBudgetDetail() {
  const finance = ledgerFinanceSummary();
  const percent = Math.min(100, Math.round((finance.monthSpent / finance.monthBudget) * 100));
  const remain = Math.max(0, finance.monthBudget - finance.monthSpent);
  return `
    ${nav("预算设置")}
    <section class="ledger-page ledger-detail-page">
      <section class="glass ledger-budget-editor redesigned month-only">
        <div class="ledger-detail-head">
          <strong>预算设置</strong>
        </div>

        <div class="ledger-month-form">
          <button class="ledger-month-field main compact ${state.ledgerMonthPickerOpen ? "open" : ""}" onclick="toggleLedgerMonthPicker()" aria-label="选择月份">
            <strong>2026年06月</strong>
          </button>
          <div class="ledger-month-picker ${state.ledgerMonthPickerOpen ? "show" : ""}">
            <div class="ledger-month-picker-head">
              <button>‹</button>
              <strong>2026年</strong>
              <button>›</button>
            </div>
            <div class="ledger-month-grid">
              ${ledgerMonthOptions().map(ledgerMonthOption).join("")}
            </div>
          </div>
          <div class="ledger-month-pair">
            <div class="ledger-month-field">
              <span>月预算</span>
              <strong>¥${finance.monthBudget.toLocaleString("zh-CN")}</strong>
            </div>
            <div class="ledger-month-field soft">
              <span>日均</span>
              <strong>¥${finance.dailyBudget}</strong>
            </div>
          </div>
        </div>

        <div class="ledger-budget-detail">
          <div class="ledger-ring" style="--p:${percent * 3.6}deg"><b>${percent}%</b><span>本月</span></div>
          <div class="ledger-budget-lines">
            ${ledgerBudgetLine("本月已花", `-¥${finance.monthSpent}`, "spent")}
            ${ledgerBudgetLine("本月收入", `+¥${finance.monthIncome}`, "income")}
            ${ledgerBudgetLine("预算剩余", `¥${remain}`, "remain")}
          </div>
        </div>

        <div class="ledger-amount-presets">
          <button class="custom" onclick="showToast('自定义金额输入待接入')">自定义金额</button>
          ${[4500, 6000, 8000].map(value => `<button class="${value === finance.monthBudget ? "active" : ""}" onclick="showToast('已选择 ¥${value}')">¥${value}</button>`).join("")}
        </div>

        <button class="ledger-save-btn" onclick="showToast('预算已保存')">保存</button>
      </section>

      <section class="glass ledger-month-list-card">
        <div class="ledger-list-head"><strong>月度收支</strong></div>
        <div class="ledger-month-list">
          ${ledgerMonthlyRows().map(ledgerMonthRow).join("")}
        </div>
      </section>
    </section>
  `;
}

function ledgerMonthlyRows() {
  return [
    { month: "2026年06月", budget: 6000, spent: 1680, income: 8200, active: true },
    { month: "2026年05月", budget: 5200, spent: 4380, income: 7600 },
    { month: "2026年04月", budget: 4800, spent: 3920, income: 7200 },
    { month: "2026年03月", budget: 5000, spent: 4660, income: 6900 }
  ];
}

function ledgerMonthOptions() {
  return [
    { month: 1, budget: 4800, spent: 5200, disabled: true },
    { month: 2, budget: 5000, spent: 3980, disabled: true },
    { month: 3, budget: 5000, spent: 4660, disabled: true },
    { month: 4, budget: 4800, spent: 3920, disabled: true },
    { month: 5, budget: 5200, spent: 4380, disabled: true },
    { month: 6, budget: 6000, spent: 1680, active: true },
    { month: 7, budget: 6000, spent: 0 },
    { month: 8, budget: 6500, spent: 0 },
    { month: 9 },
    { month: 10 },
    { month: 11 },
    { month: 12 }
  ];
}

function ledgerMonthOption(item) {
  const over = typeof item.spent === "number" && typeof item.budget === "number" && item.spent > item.budget;
  const hasBudget = typeof item.budget === "number";
  const classes = [
    item.active ? "active" : "",
    item.disabled ? "disabled" : "",
    hasBudget ? (over ? "over" : "ok") : ""
  ].filter(Boolean).join(" ");
  const amount = hasBudget ? `<small>¥${item.budget}</small>` : "";
  const click = item.disabled ? "" : ` onclick="showToast('已选择 ${item.month}月')"`;
  return `<button class="${classes}"${item.disabled ? " disabled" : click}><span>${item.month}月</span>${amount}</button>`;
}

function ledgerMonthRow(item) {
  const remain = Math.max(0, item.budget - item.spent);
  return `
    <article class="ledger-month-row ${item.active ? "active" : ""}">
      <div><strong>${item.month}</strong><span>${item.active ? "当前设置" : "历史记录"}</span></div>
      <ul>
        <li><span>预算</span><b>¥${item.budget}</b></li>
        <li><span>消费</span><b class="spent">-¥${item.spent}</b></li>
        <li><span>收入</span><b class="income">+¥${item.income}</b></li>
        <li><span>剩余</span><b class="remain">¥${remain}</b></li>
      </ul>
    </article>
  `;
}

function toggleLedgerMonthPicker() {
  state.ledgerMonthPickerOpen = !state.ledgerMonthPickerOpen;
  const field = document.querySelector(".ledger-month-field.main.compact");
  const picker = document.querySelector(".ledger-month-picker");
  if (!field || !picker) {
    render();
    return;
  }
  field.classList.toggle("open", state.ledgerMonthPickerOpen);
  picker.classList.toggle("show", state.ledgerMonthPickerOpen);
}

function renderLedgerDistributionDetail() {
  const isMonth = state.ledgerDistributionMode === "month";
  return `
    ${nav("消费分布")}
    <section class="ledger-page ledger-detail-page">
      <section class="glass ledger-distribution-filter">
        <div class="ledger-distribution-selector-row">
          <button class="ledger-month-field main compact distribution ${state.ledgerDistributionPickerOpen ? "open" : ""}" onclick="toggleLedgerDistributionPicker()" aria-label="选择统计周期">
            <strong>${isMonth ? "2026年06月" : "2026年06月06日"}</strong>
          </button>
          <div class="ledger-mode-tabs">
            <button class="${!isMonth ? "active" : ""}" onclick="setLedgerDistributionMode('day')">日</button>
            <button class="${isMonth ? "active" : ""}" onclick="setLedgerDistributionMode('month')">月</button>
          </div>
        </div>
        <div class="ledger-period-picker ${state.ledgerDistributionPickerOpen ? "show" : ""}">
          <div class="ledger-month-picker-head">
            <button>‹</button>
            <strong>${isMonth ? "2026年" : "2026年06月"}</strong>
            <button>›</button>
          </div>
          <div class="${isMonth ? "ledger-month-grid" : "ledger-day-grid"}">
            ${isMonth ? ledgerMonthOptions().map(ledgerDistributionMonthOption).join("") : `${ledgerWeekHeader()}${ledgerDayOptions().map(ledgerDistributionDayOption).join("")}`}
          </div>
        </div>
      </section>

      <section class="glass ledger-distribution-detail">
        <div class="ledger-detail-head">
          <strong>消费</strong>
          <span>${isMonth ? "本月 -¥1,680" : "今日 -¥60"}</span>
        </div>
        <div class="ledger-dist-summary">
          <div class="ledger-dist-donut expense"></div>
          <div>
            <strong>${isMonth ? "餐饮 ¥820" : "餐饮 ¥37"}</strong>
            <span>${isMonth ? "本月餐饮占消费 49%，日常开销比较稳定" : "午餐与咖啡合计 ¥37，占今日支出的 62%"}</span>
          </div>
        </div>
        <div class="ledger-distribution-preview detail">
          ${isMonth ? ledgerDistributionItem("餐饮", 820, 1680, "food") : ledgerDistributionItem("餐饮", 37, 60, "food")}
          ${isMonth ? ledgerDistributionItem("购物", 520, 1680, "shop") : ledgerDistributionItem("超市", 18, 60, "shop")}
          ${isMonth ? ledgerDistributionItem("通勤", 340, 1680, "traffic") : ledgerDistributionItem("通勤", 5, 60, "traffic")}
        </div>
      </section>

      <section class="glass ledger-distribution-detail income">
        <div class="ledger-detail-head">
          <strong>收入</strong>
          <span>${isMonth ? "本月 +¥8,200" : "今日 +¥280"}</span>
        </div>
        <div class="ledger-dist-summary">
          <div class="ledger-dist-donut income"></div>
          <div>
            <strong>${isMonth ? "工资收入 ¥7,200" : "兼职收入 ¥280"}</strong>
            <span>${isMonth ? "工资与兼职构成本月主要收入，整体结余充足" : "今天有一笔兼职尾款入账，已计入收入"}</span>
          </div>
        </div>
        <div class="ledger-distribution-preview detail income">
          ${isMonth ? ledgerIncomeDistributionItem("工资", 7200, 8200, "salary") : ledgerIncomeDistributionItem("兼职", 280, 280, "parttime")}
          ${isMonth ? ledgerIncomeDistributionItem("兼职", 800, 8200, "parttime") : ""}
          ${isMonth ? ledgerIncomeDistributionItem("红包", 200, 8200, "gift") : ""}
        </div>
      </section>

      <section class="glass ledger-list-card">
        <div class="ledger-list-head"><strong>消费明细</strong><b>按金额</b></div>
        <div class="ledger-expense-list">
          ${ledgerExpenses().filter(item => item.kind !== "income").map(item => ledgerExpenseItem({ ...item, time: `${categoryName(item.tone)} · ${item.time}` })).join("")}
        </div>
      </section>

      <section class="glass ledger-list-card">
        <div class="ledger-list-head"><strong>收入明细</strong><b>${isMonth ? "+¥8,200" : "+¥280"}</b></div>
        <div class="ledger-expense-list">
          ${ledgerIncomeDetails(isMonth).map(ledgerExpenseItem).join("")}
        </div>
      </section>
    </section>
  `;
}

function categoryName(tone) {
  return { food: "餐饮", shop: "购物", traffic: "通勤", coffee: "餐饮" }[tone] || "其他";
}

function ledgerIncomeDistributionItem(label, value, max, tone) {
  const width = Math.max(9, Math.round((value / max) * 100));
  return `<div class="ledger-dist-item income ${tone}"><span>${label}</span><div><i style="width:${width}%"></i></div><b>¥${value}</b></div>`;
}

function ledgerDayOptions() {
  return Array.from({ length: 30 }, (_, index) => ({
    day: index + 1,
    active: index === 5
  }));
}

function ledgerWeekHeader() {
  return ["一", "二", "三", "四", "五", "六", "日"].map(day => `<b class="ledger-weekday">${day}</b>`).join("");
}

function ledgerDistributionDayOption(item) {
  const classes = [item.active ? "active" : ""].filter(Boolean).join(" ");
  return `<button class="${classes}" onclick="showToast('已选择 ${item.day}日')"><span>${item.day}</span></button>`;
}

function ledgerDistributionMonthOption(item) {
  const disabled = item.disabled;
  const classes = [
    item.active ? "active" : "",
    disabled ? "disabled" : ""
  ].filter(Boolean).join(" ");
  const click = disabled ? "" : ` onclick="showToast('已选择 ${item.month}月')"`;
  return `<button class="${classes}"${disabled ? " disabled" : click}><span>${item.month}月</span></button>`;
}

function ledgerIncomeDetails(isMonth) {
  if (isMonth) {
    return [
      { id: 21, title: "工资收入", time: "收入 · 06月01日", amount: 7200, tone: "income", kind: "income", note: "本月固定工资入账。" },
      { id: 22, title: "兼职收入", time: "收入 · 06月06日", amount: 800, tone: "income", kind: "income", note: "设计稿尾款与零散项目收入。" },
      { id: 23, title: "红包收入", time: "收入 · 06月03日", amount: 200, tone: "income", kind: "income", note: "朋友转入红包，已记入收入。" }
    ];
  }
  return [
    { id: 24, title: "兼职收入", time: "收入 · 10:00", amount: 280, tone: "income", kind: "income", note: "周末设计稿尾款入账，记为收入。" }
  ];
}

function setLedgerDistributionMode(mode) {
  state.ledgerDistributionMode = mode;
  state.ledgerDistributionPickerOpen = false;
  render();
}

function toggleLedgerDistributionPicker() {
  state.ledgerDistributionPickerOpen = !state.ledgerDistributionPickerOpen;
  const field = document.querySelector(".ledger-month-field.main.distribution");
  const picker = document.querySelector(".ledger-period-picker");
  if (!field || !picker) {
    render();
    return;
  }
  field.classList.toggle("open", state.ledgerDistributionPickerOpen);
  picker.classList.toggle("show", state.ledgerDistributionPickerOpen);
}

function renderProfile() {
  return `
    ${nav("我的")}
    <section class="glass hero-card">
      <div class="hero-top"><div class="avatar">明</div><div class="identity"><strong>小明</strong><p>信芽 ${state.score}分 · Lv2 热心市民</p></div></div>
      <div class="metric-row" style="margin-top:14px">${metric("出借金额","¥8.6k")}${metric("完成次数","15")}${metric("守约率","96%")}</div>
    </section>
    <section class="glass form-card" style="margin-top:14px">
      ${menu("我的凭证", "查看所有上传凭证")}
      ${menu("消息中心", "12 条未读", "messages")}
      ${menu("帮助中心", "常见问题与流程说明")}
      ${menu("隐私设置", "控制数据可见范围")}
      ${menu("关于我们", "版本与协议")}
    </section>
    ${statePanel()}
  `;
}

function menu(title, sub, route) {
  return `<div class="menu-item" onclick="${route ? `go('${route}')` : "showToast('扩展页面占位')" }"><div class="icon-bubble">›</div><div class="item-main"><strong>${title}</strong><span>${sub}</span></div></div>`;
}

function renderCheckinCenter() {
  if (!window.CheckinFeature) {
    return `${nav("签到中心")}<section class="glass form-card"><strong>签到详情加载中</strong></section>`;
  }
  return `${nav("签到中心")}${window.CheckinFeature.render(state)}`;
}

function changeCheckinMonth(delta) {
  state.checkinMonthOffset += delta;
  render();
}

function renderAgreementList() {
  const filtered = agreements.filter(item => {
    if (state.filters.time !== "全部" && state.filters.time !== "2026-06" && state.filters.time !== "2026-07") return false;
    return true;
  });
  return `
    ${nav("我的约定")}
    <section class="glass list-page-card agreement-list-page">
      <div class="searchbar"><span>搜索约定、好友、金额</span><b>搜索</b></div>
      <div class="date-filter-panel">
        <button class="date-filter-head" onclick="toggleDateFilter()">
          <span>📅 年月筛选</span>
          <b>${state.filters.time === "全部" ? "全部时间" : state.filters.time}</b>
          <em>${state.dateFilterOpen ? "收起" : "展开"}</em>
        </button>
        <div class="date-filter-body ${state.dateFilterOpen ? "open" : ""}">
          <div class="month-picker-head">
            <button onclick="changeAgreementYear(-1)" aria-label="上一年">‹</button>
            <strong>${state.agreementYear}年</strong>
            <button onclick="changeAgreementYear(1)" aria-label="下一年">›</button>
          </div>
          <div class="month-grid">
            ${Array.from({ length: 12 }, (_, index) => {
              const month = String(index + 1).padStart(2, "0");
              return filterChip("time", `${state.agreementYear}-${month}`, `${index + 1}月`);
            }).join("")}
          </div>
          <button class="clear-month-filter" onclick="setFilter('time', '全部')">查看全部时间</button>
        </div>
      </div>
      ${filtered.length ? filtered.map(agreementCard).join("") : `<div class="state-box"><strong>Empty</strong><span>没有符合条件的约定</span></div>`}
    </section>
  `;
}

function filterChip(key, value, label) {
  const active = state.filters[key] === value;
  return `<button class="filter-chip ${active ? "active" : ""}" onclick="setFilter('${key}', '${value}')">${label}</button>`;
}

function setFilter(key, value) {
  state.filters[key] = value;
  render();
}

function toggleDateFilter() {
  state.dateFilterOpen = !state.dateFilterOpen;
  render();
}

function changeAgreementYear(delta) {
  state.agreementYear += delta;
  state.filters.time = "全部";
  render();
}

function renderCreditCenter() {
  return `
    ${nav("信誉中心")}
    <section class="glass hero-card">
      <h2 style="font-size:34px;margin:0">${state.score}</h2>
      <p style="color:var(--sub)">诚信伙伴 · 守约率 96%</p>
      <div class="progress-track"><div class="progress-fill" style="--p:88%"></div></div>
      <div class="metric-row">${metric("完成约定","15")}${metric("逾期处理","1")}${metric("成长值",state.growth)}</div>
    </section>
    <section class="glass data-grid" style="margin-top:14px">${dataCard("本月借出","¥8,600")}${dataCard("本月借入","¥3,200")}${dataCard("信誉变化","+12")}${dataCard("好友互动","9次")}</section>
    <section class="glass timeline" style="margin-top:14px">${timeline("+5","完成与李*的约定","信誉分增加")}${timeline("-1","逾期后已处理","信誉修复中")}${timeline("+3","收到好友确认","关系记录更清晰")}</section>
    ${statePanel()}
  `;
}

function render() {
  app.innerHTML = pages[state.route]();
  if (ledgerFab) ledgerFab.classList.toggle("hidden", state.route !== "ledger");
  if (state.route !== "ledger") state.ledgerAddSheetOpen = false;
  renderLedgerSheet();
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.route === state.route));
  if (state.route === "checkin" && window.CheckinFeature) {
    window.CheckinFeature.bindSwipe(delta => {
      state.checkinMonthOffset += delta;
      render();
    });
  }
  if (state.route === "ledger") {
    bindLedgerSwipe();
  }
}

tabs.forEach(tab => tab.addEventListener("click", () => switchTab(tab.dataset.route)));
window.go = go;
window.goBack = goBack;
window.toggleAgreement = toggleAgreement;
window.handleCheckinClick = handleCheckinClick;
window.showToast = showToast;
window.setFilter = setFilter;
window.setHomeStatus = setHomeStatus;
window.toggleDateFilter = toggleDateFilter;
window.changeAgreementYear = changeAgreementYear;
window.changeCheckinMonth = changeCheckinMonth;
window.fillFieldOption = fillFieldOption;
window.setMessageTab = setMessageTab;
window.markAllMessagesRead = markAllMessagesRead;
window.setReportYear = setReportYear;
window.toggleReportOverview = toggleReportOverview;
window.setReportLineMode = setReportLineMode;
window.toggleFriendRank = toggleFriendRank;
window.toggleFriendRankOrder = toggleFriendRankOrder;
window.changeLedgerDate = changeLedgerDate;
window.toggleLedgerBudget = toggleLedgerBudget;
window.toggleLedgerDistribution = toggleLedgerDistribution;
window.toggleLedgerExpense = toggleLedgerExpense;
window.deleteLedgerExpense = deleteLedgerExpense;
window.editLedgerNote = editLedgerNote;
window.toggleLedgerMonthPicker = toggleLedgerMonthPicker;
window.setLedgerDistributionMode = setLedgerDistributionMode;
window.toggleLedgerDistributionPicker = toggleLedgerDistributionPicker;
window.addLedgerExpense = addLedgerExpense;
window.closeLedgerAddSheet = closeLedgerAddSheet;
window.setLedgerAddType = setLedgerAddType;
window.setLedgerAddCategory = setLedgerAddCategory;
window.submitLedgerEntry = submitLedgerEntry;

render();

