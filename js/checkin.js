(function () {
  const levels = [
    { icon: "🌱", score: 0, name: "初识守约" },
    { icon: "🍃", score: 100, name: "稳定记录" },
    { icon: "⭐", score: 200, name: "良好信誉" },
    { icon: "💎", score: 350, name: "优质伙伴" },
    { icon: "🏆", score: 500, name: "优秀信誉" },
    { icon: "👑", score: 700, name: "王者信誉" }
  ];

  const signedPattern = [1, 2, 3, 4, 5, 8, 10, 12, 14, 16, 18, 21, 23, 26, 29];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function addMonths(base, offset) {
    return new Date(base.getFullYear(), base.getMonth() + offset, 1);
  }

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function currentLevel(score) {
    return levels.reduce((picked, level, index) => (
      score >= level.score ? { ...level, index } : picked
    ), { ...levels[0], index: 0 });
  }

  function creditIcon(score) {
    return currentLevel(score).icon;
  }

  function renderCalendar(state) {
    const today = new Date();
    const viewDate = addMonths(today, state.checkinMonthOffset || 0);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const total = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const leading = firstDay === 0 ? 6 : firstDay - 1;
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    const signedDays = new Set(signedPattern.filter(day => day <= total));

    if (state.checkedIn && isCurrentMonth) signedDays.add(today.getDate());

    const cells = [];
    for (let i = 0; i < leading; i += 1) {
      cells.push(`<div class="checkin-day muted"></div>`);
    }
    for (let day = 1; day <= total; day += 1) {
      const signed = signedDays.has(day);
      const todayClass = isCurrentMonth && day === today.getDate() ? "today" : "";
      cells.push(`
        <div class="checkin-day ${signed ? "signed" : ""} ${todayClass}">
          <span>${day}</span>
          ${signed ? `<i></i>` : ""}
        </div>
      `);
    }

    return `
      <section class="glass checkin-calendar-card">
        <div class="calendar-toolbar">
          <button onclick="changeCheckinMonth(-1)" aria-label="上个月">‹</button>
          <strong>${year}年${pad(month + 1)}月</strong>
          <button onclick="changeCheckinMonth(1)" aria-label="下个月">›</button>
        </div>
        <div class="weekday-row">
          ${["一", "二", "三", "四", "五", "六", "日"].map(day => `<span>${day}</span>`).join("")}
        </div>
        <div class="checkin-days">${cells.join("")}</div>
      </section>
    `;
  }

  function renderLevelStrip(score) {
    const active = currentLevel(score);
    return `
      <div class="credit-level-strip">
        ${levels.map((level, index) => `
          <div class="credit-level ${index === active.index ? "active" : ""}">
            <b>${level.icon}</b>
            <span>${level.score}+</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderReward(icon, title, desc, label, stateClass) {
    return `
      <div class="reward-item">
        <span class="reward-icon">${icon}</span>
        <div>
          <strong>${title}</strong>
          <p>${desc}</p>
        </div>
        <span class="reward-tag ${stateClass || ""}">${label}</span>
      </div>
    `;
  }

  function render(state) {
    const score = state.score;
    const streak = 35;
    const monthCount = 15;
    const level = currentLevel(score);
    const nextTarget = 600;
    const remaining = Math.max(nextTarget - score, 0);
    const progress = Math.min(Math.round((score / nextTarget) * 100), 100);
    const streakIcon = streak >= 7 ? "🔥" : "▫";

    return `
      <div class="checkin-page">
        <section class="glass daily-checkin-card">
          <div class="today-summary">
            <div class="today-summary-main">
              <span class="calendar-mark">📅</span>
              <div>
                <strong>今日已签到</strong>
                <p>温柔记录已更新，信誉分持续成长</p>
              </div>
            </div>
            <span class="today-score-pill">+10 信誉分</span>
          </div>

          <div class="daily-metrics">
            <div>
              <b>${monthCount}天</b>
              <span>本月签到</span>
            </div>
            <div>
              <b>${streak}</b>
              <span>连续天数</span>
            </div>
            <div>
              <b>${creditIcon(score)} ${score}</b>
              <span>信誉分</span>
            </div>
          </div>

          <div class="daily-footnote">
            <span>${streakIcon} 连续 ${streak} 天</span>
            <b>明天继续签到，连续天数会保留</b>
          </div>
        </section>

        ${renderCalendar(state)}

        <section class="glass credit-reward-card">
          <div class="reward-title">
            <h2>信誉成长与奖励</h2>
            <p>这里展示签到带来的成长记录，不涉及真实领取或兑换。</p>
          </div>

          <div class="credit-progress-panel">
            <div class="credit-progress-head">
              <span>当前：${level.name}</span>
              <b>${score} / ${nextTarget}</b>
            </div>
            <div class="credit-track"><div style="width:${progress}%"></div></div>
            <div class="next-score">距下档 +${remaining}分</div>
          </div>

          ${renderLevelStrip(score)}

          <div class="reward-list">
            ${renderReward("🎁", "连续签到 7 天", "展示额外 +30 信誉分的成长记录", "已记录", "claimed")}
            ${renderReward("⚡", "本月累计签到 20 天", "还差 5 天，仅作成长目标展示", "展示中", "")}
            ${renderReward("🛡️", "信誉保护提醒", "断签只影响连续天数，不扣除已有信誉分", "说明", "soft")}
          </div>

          <p class="checkin-tip">签到用于展示信誉成长趋势，帮助用户感知守约和持续记录带来的正向反馈。</p>
        </section>
      </div>
    `;
  }

  function bindSwipe(onChange) {
    const card = document.querySelector(".checkin-calendar-card");
    if (!card || !onChange) return;
    let startX = 0;
    card.addEventListener("touchstart", event => {
      startX = event.touches[0].clientX;
    }, { passive: true });
    card.addEventListener("touchend", event => {
      const endX = event.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) < 46) return;
      onChange(diff < 0 ? 1 : -1);
    }, { passive: true });
  }

  window.CheckinFeature = {
    render,
    bindSwipe,
    creditIcon
  };
})();
