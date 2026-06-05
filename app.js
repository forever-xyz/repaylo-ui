const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const tabs = document.querySelectorAll(".tabbar .tab");

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
  return `
    ${nav("账本")}
    <section class="glass form-card">
      <h2 style="margin:0 0 8px">今日账本</h2>
      <p style="margin:0 0 14px;color:var(--sub);font-size:13px">记录日常垫付与人情往来，后续可与约定联动。</p>
      ${activity("午", "午餐垫付", "¥128 · 12:30")}
      ${activity("车", "打车代付", "¥46 · 18:10")}
      ${activity("茶", "下午茶", "¥32 · 15:20")}
    </section>
  `;
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
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.route === state.route));
  if (state.route === "checkin" && window.CheckinFeature) {
    window.CheckinFeature.bindSwipe(delta => {
      state.checkinMonthOffset += delta;
      render();
    });
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

render();

