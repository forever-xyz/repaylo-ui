const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const tabs = document.querySelectorAll(".tabbar .tab");

const state = {
  route: "home",
  checkedIn: false,
  checkinCelebrating: false,
  checkinMonthOffset: 0,
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
  state.route = route;
  state.params = params;
  render();
}

function nav(title, right = "") {
  const rootTabs = ["home", "reports", "ledger", "profile"];
  if (rootTabs.includes(state.route)) return "";
  return `<div class="nav nav-quiet"><button onclick="go('home')" aria-label="返回首页">‹</button><span></span>${right || "<span></span>"}</div>`;
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
  const typeIcon = item.type === "出借" ? "🤝 与你的约定" : "💬 向你求助";
  return `
    <article class="agreement-card ${expanded ? "expanded" : ""}" onclick="toggleAgreement(${item.id})">
      <div class="agreement-card-header">
        <div class="agreement-user">
          <div class="card-avatar">${item.avatar}</div>
          <div>
            <div class="card-name">${item.name}</div>
            <div class="card-type">${typeIcon} · ${item.title}</div>
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
  render();
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
          <h2>📋 我的约定 <span class="section-count-dot">3</span></h2>
        </div>
        <button onclick="go('agreements')">查看全部</button>
      </div>
      <div class="agreement-count-grid">
        ${statusMini("草稿", "2", "b-draft")}${statusMini("进行中", "8", "b-progress")}${statusMini("待确认", "4", "b-pending")}${statusMini("已完成", "12", "b-completed")}${statusMini("已逾期", "1", "b-overdue")}${statusMini("延期中", "1", "b-extended")}
      </div>
      ${agreements.slice(0, 3).map(agreementCard).join("")}
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
  return `<div class="mini status-mini ${badge}"><span class="mini-icon">${statusIcon(label)}</span><b>${value}</b><span>${label}</span></div>`;
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
    ["借款人", "选择需要帮助的朋友", "input"],
    ["金额", "请输入金额", "input"],
    ["还款日期", "选择约定归还日期", "input"],
    ["借款缘由", "简单说明这笔周转的缘由", "textarea"],
    ["辅助凭证", "上传聊天记录、合同或说明材料", "input"],
    ["提醒语", "写一句只有对方可见的温暖提醒", "textarea"]
  ], "发送约定");
}

function renderEmergency() {
  return formPage("江湖救急", "有困难，也可以坦诚开口", "把需求和归还计划说清楚，信任会更容易被看见。", [
    ["出借人", "选择想请求帮助的朋友", "input"],
    ["金额", "请输入需要周转的金额", "input"],
    ["还款日期", "选择预计归还日期", "input"],
    ["借款缘由", "说明遇到的情况", "textarea"],
    ["辅助凭证", "上传病历、聊天记录或说明材料", "input"],
    ["补充说明", "写下感谢和归还承诺", "textarea"]
  ], "发送求助");
}

function formPage(title, hero, desc, fields, submit) {
  return `
    ${nav(title)}
    <section class="glass hero-card" style="min-height:auto;padding:18px;margin-bottom:14px">
      <h2 style="margin:0 0 6px">${hero}</h2>
      <p style="margin:0;color:var(--sub);font-size:13px;line-height:1.55">${desc}</p>
    </section>
    <section class="glass form-card">
      ${fields.map(([label, placeholder, type]) => `<div class="field"><label>${label}</label>${type === "textarea" ? `<textarea placeholder="${placeholder}"></textarea>` : `<input placeholder="${placeholder}" />`}</div>`).join("")}
      <p style="font-size:12px;color:var(--muted);line-height:1.5">还了么只记录约定和提醒，不提供资金、担保或催收服务。</p>
      <div class="action-row"><button class="secondary-btn" onclick="go('home')">取消</button><button class="primary-btn" onclick="showToast('已提交，等待对方确认'); go('detail')">${submit}</button></div>
    </section>
    ${statePanel()}
  `;
}

function renderDetail() {
  const item = agreements.find(x => x.id === (state.params && state.params.id)) || agreements[0];
  return `
    ${nav("约定详情")}
    <section class="glass hero-card" style="min-height:auto;padding:18px">
      <span class="badge ${item.badge}">${item.status}</span>
      <h2 style="font-size:32px;margin:12px 0 4px">${money(item.amount)}</h2>
      <p style="margin:0;color:var(--sub)">约定归还日：2026-07-05 · ${item.date}</p>
    </section>
    <section class="glass form-card" style="margin-top:14px">
      <div class="row-between"><strong>出借人：我</strong><strong>借款人：${item.name}</strong></div>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,.55);margin:14px 0">
      <p><b>借款缘由：</b>${item.reason}</p>
      <p><b>提醒语：</b>${item.remind}</p>
      <p><b>凭证：</b>聊天记录 1 张，仅双方可见。</p>
      <p><b>延期记录：</b>6/20 申请延期至 7/10，状态：已同意。</p>
      <div class="action-row"><button class="secondary-btn" onclick="go('delay')">申请延期</button><button class="primary-btn" onclick="showToast('确认完成，信誉记录已更新')">确认完成</button></div>
    </section>
    ${statePanel()}
  `;
}

function renderDelay() {
  return formPage("延期申请", "说明情况，等待确认", "提交后将等待对方确认；对方同意后，新的还款日期才会生效。", [
    ["新还款日期", "选择新的归还日期", "input"],
    ["延期原因", "说明需要延期的原因", "textarea"]
  ], "提交申请");
}

function renderMessages() {
  return `
    ${nav("消息", `<button onclick="showToast('已全部标为已读')">已读</button>`)}
    <section class="glass form-card">
      <h2 style="margin:0">12 条未读</h2>
      <p style="color:var(--sub);font-size:13px">新的约定提醒会出现在这里</p>
      ${message("约定提醒", "李* 的 ¥2,000 将在 3 天后到期", "b-progress")}
      ${message("成长通知", "完成约定，信誉分 +5", "b-completed")}
      ${message("系统通知", "凭证仅约定双方可见", "b-pending")}
    </section>
    ${statePanel()}
  `;
}

function message(title, sub, badge) {
  return `<div class="message-item" onclick="go('detail')"><div class="icon-bubble">◌</div><div class="item-main"><strong>${title}</strong><span>${sub}</span></div><span class="badge ${badge}">未读</span></div>`;
}

function renderReports() {
  return `
    ${nav("报表")}
    <section class="glass hero-card" style="min-height:auto;padding:18px">
      <h2 style="margin:0 0 6px">本月温暖总览</h2>
      <p style="margin:0;color:var(--sub);font-size:13px">借出 ¥8,600 · 借入 ¥3,200 · 守约率 96%</p>
    </section>
    <section class="glass data-grid" style="margin-top:14px">${dataCard("借出金额","¥8,600")}${dataCard("借入金额","¥3,200")}${dataCard("守约率","96%")}${dataCard("成长值","+128")}</section>
  `;
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
    if (state.filters.type !== "全部" && item.type !== state.filters.type) return false;
    if (state.filters.status !== "全部" && item.status !== state.filters.status) return false;
    if (state.filters.amount === "1000以上" && item.amount < 1000) return false;
    return true;
  });
  return `
    ${nav("我的约定")}
    <section class="glass list-page-card">
      <div class="filters">
        ${filterSelect("time", ["全部","本月","今年"])}
        ${filterSelect("type", ["全部","出借","借入"])}
        ${filterSelect("status", ["全部","草稿","进行中","待确认","已完成","已逾期","延期中"])}
        ${filterSelect("amount", ["全部","1000以上"])}
      </div>
      <div class="searchbar"><span>搜索约定、好友、金额</span><b>搜索</b></div>
      ${filtered.length ? filtered.map(agreementCard).join("") : `<div class="state-box"><strong>Empty</strong><span>没有符合条件的约定</span></div>`}
    </section>
    ${statePanel()}
  `;
}

function filterSelect(key, options) {
  return `<select onchange="setFilter('${key}', this.value)">${options.map(x=>`<option ${state.filters[key]===x?"selected":""}>${x}</option>`).join("")}</select>`;
}

function setFilter(key, value) {
  state.filters[key] = value;
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

tabs.forEach(tab => tab.addEventListener("click", () => go(tab.dataset.route)));
window.go = go;
window.toggleAgreement = toggleAgreement;
window.handleCheckinClick = handleCheckinClick;
window.showToast = showToast;
window.setFilter = setFilter;
window.changeCheckinMonth = changeCheckinMonth;

render();

