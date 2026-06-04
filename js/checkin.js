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

  function renderReward(icon, title, desc, action, stateClass) {
    return `
      <div class="reward-item">
        <span class="reward-icon">${icon}</span>
        <div>
          <strong>${title}</strong>
          <p>${desc}</p>
        </div>
        <button class="${stateClass || ""}">${action}</button>
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
          <div class="daily-head">
            <div class="daily-title">
              <span class="calendar-mark">📅</span>
              <strong>每日签到</strong>
            </div>
            <span class="streak-pill">${streakIcon} 连续 ${streak} 天</span>
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

          <div class="today-signed-pill">✓ 今日已签到 +10分</div>
        </section>

        ${renderCalendar(state)}

        <section class="glass credit-reward-card">
          <div class="reward-title">
            <h2>信誉成长与奖励</h2>
            <p>连续签到越久，信誉等级越高，后续可解锁借还权益</p>
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
            ${renderReward("🎁", "连续签到 7 天奖励", "已达成，额外获得 +30 信誉分", "已领取", "claimed")}
            ${renderReward("⚡", "本月累计签到 20 天", "还差 5 天，可获得一次补签卡", "去完成", "")}
            ${renderReward("🛡️", "信誉保护提醒", "断签会中断连续天数，但不扣除已有信誉分", "知道了", "soft")}
          </div>

          <p class="checkin-tip">签到可以提升信誉分，信誉分越高，后续可解锁更多借还权益。</p>
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
