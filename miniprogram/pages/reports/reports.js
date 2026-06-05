const yearlyData = {
  2024: {
    overview: {
      lendAmount: "52,600",
      borrowAmount: "8,800",
      totalAmount: "61,400",
      promiseRate: "92%",
      completed: "23",
      pending: "5",
      overdue: "2",
      friends: "18"
    },
    lendLine: [6, 8, 12, 9, 18, 22, 26, 35, 42, 38, 46, 52],
    borrowLine: [1, 2, 1, 3, 2, 4, 5, 4, 6, 5, 7, 8]
  },
  2025: {
    overview: {
      lendAmount: "68,200",
      borrowAmount: "10,600",
      totalAmount: "78,800",
      promiseRate: "95%",
      completed: "31",
      pending: "7",
      overdue: "1",
      friends: "24"
    },
    lendLine: [8, 12, 16, 22, 20, 28, 34, 42, 51, 48, 56, 68],
    borrowLine: [2, 2, 3, 5, 4, 6, 7, 6, 8, 9, 8, 10]
  },
  2026: {
    overview: {
      lendAmount: "86,000",
      borrowAmount: "12,000",
      totalAmount: "98,000",
      promiseRate: "96%",
      completed: "42",
      pending: "9",
      overdue: "1",
      friends: "28"
    },
    lendLine: [10, 18, 24, 21, 32, 40, 46, 58, 66, 72, 80, 86],
    borrowLine: [2, 3, 5, 4, 6, 8, 7, 9, 10, 11, 9, 12]
  },
  2027: {
    overview: {
      lendAmount: "94,500",
      borrowAmount: "15,200",
      totalAmount: "109,700",
      promiseRate: "97%",
      completed: "48",
      pending: "8",
      overdue: "1",
      friends: "33"
    },
    lendLine: [14, 22, 28, 35, 42, 48, 60, 66, 74, 82, 88, 94],
    borrowLine: [3, 4, 6, 5, 8, 9, 11, 10, 12, 13, 14, 15]
  }
};

Page({
  data: {
    years: ["2024", "2025", "2026", "2027"],
    yearIndex: 2,
    currentYear: "2026",
    overviewExpanded: false,
    lineMode: "lend",
    overview: yearlyData[2026].overview,
    overviewMetrics: [],
    friends: [
      { rank: 1, medal: "🥇", avatar: "李", name: "小李同学", times: 12, rate: "100%", amount: "28,600" },
      { rank: 2, medal: "🥈", avatar: "周", name: "阿周同学", times: 9, rate: "98%", amount: "18,200" },
      { rank: 3, medal: "🥉", avatar: "陈", name: "小陈同学", times: 7, rate: "96%", amount: "12,800" }
    ],
    distribution: [
      { name: "借出", value: "86k", amount: 86000, color: "#8b5cf6" },
      { name: "借入", value: "12k", amount: 12000, color: "#f87171" },
      { name: "已完成", value: "42", amount: 42000, color: "#22c55e" },
      { name: "待完成", value: "9", amount: 9000, color: "#facc15" },
      { name: "逾期", value: "1", amount: 1000, color: "#ef4444" }
    ],
    barData: [
      { name: "出手相助", value: 48, colors: ["#c4b5fd", "#8b5cf6"] },
      { name: "江湖救急", value: 26, colors: ["#fecaca", "#f87171"] },
      { name: "已完成", value: 42, colors: ["#bbf7d0", "#22c55e"] },
      { name: "待完成", value: 9, colors: ["#fde68a", "#facc15"] },
      { name: "逾期", value: 1, colors: ["#fecaca", "#ef4444"] }
    ]
  },

  onLoad() {
    this.refreshOverview();
  },

  onReady() {
    this.drawAllCharts();
  },

  onYearChange(event) {
    const yearIndex = Number(event.detail.value);
    const currentYear = this.data.years[yearIndex];
    this.setData({ yearIndex, currentYear, overview: yearlyData[currentYear].overview }, () => {
      this.refreshOverview();
      this.drawAllCharts();
    });
  },

  toggleOverview() {
    this.setData({ overviewExpanded: !this.data.overviewExpanded });
  },

  switchLineMode(event) {
    const lineMode = event.currentTarget.dataset.mode;
    if (lineMode === this.data.lineMode) return;
    this.setData({ lineMode }, () => this.drawLineChart());
  },

  noop() {},

  refreshOverview() {
    const overview = this.data.overview;
    this.setData({
      overviewMetrics: [
        { label: "总流转金额", value: `¥${overview.totalAmount}` },
        { label: "守约率", value: overview.promiseRate },
        { label: "已完成约定", value: overview.completed },
        { label: "待完成约定", value: overview.pending },
        { label: "逾期次数", value: overview.overdue },
        { label: "好友数量", value: overview.friends }
      ]
    });
  },

  drawAllCharts() {
    this.drawLineChart();
    this.drawDonutChart();
    this.drawBarChart();
  },

  drawLineChart() {
    const ctx = wx.createCanvasContext("lineChart", this);
    const width = 313;
    const height = 130;
    const padding = { left: 18, right: 18, top: 18, bottom: 24 };
    const year = this.data.currentYear;
    const values = this.data.lineMode === "lend" ? yearlyData[year].lendLine : yearlyData[year].borrowLine;
    const max = Math.max(...values) * 1.12;
    const points = values.map((value, index) => {
      const x = padding.left + (index / (values.length - 1)) * (width - padding.left - padding.right);
      const y = height - padding.bottom - (value / max) * (height - padding.top - padding.bottom);
      return { x, y };
    });
    const main = this.data.lineMode === "lend" ? "#8b5cf6" : "#f87171";
    const soft = this.data.lineMode === "lend" ? "rgba(139,92,246,.12)" : "rgba(248,113,113,.12)";

    ctx.clearRect(0, 0, width, height);
    ctx.setStrokeStyle("rgba(139,92,246,.08)");
    ctx.setLineWidth(1);
    for (let i = 0; i < 4; i += 1) {
      const y = padding.top + i * 26;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    const area = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    area.addColorStop(0, soft);
    area.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.setFillStyle(area);
    ctx.fill();

    const line = ctx.createLinearGradient(padding.left, 0, width - padding.right, 0);
    line.addColorStop(0, "#c4b5fd");
    line.addColorStop(1, main);
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.setLineWidth(3);
    ctx.setLineCap("round");
    ctx.setLineJoin("round");
    ctx.setStrokeStyle(line);
    ctx.stroke();

    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
      ctx.setFillStyle("#fff");
      ctx.fill();
      ctx.setStrokeStyle(main);
      ctx.setLineWidth(2);
      ctx.stroke();
    });
    ctx.draw();
  },

  drawDonutChart() {
    const ctx = wx.createCanvasContext("donutChart", this);
    const data = this.data.distribution;
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    let start = -Math.PI / 2;
    ctx.clearRect(0, 0, 120, 120);
    data.forEach(item => {
      const angle = (item.amount / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(60, 60, 48, start, start + angle);
      ctx.setStrokeStyle(item.color);
      ctx.setLineWidth(16);
      ctx.setLineCap("round");
      ctx.stroke();
      start += angle + 0.035;
    });
    ctx.draw();
  },

  drawBarChart() {
    const ctx = wx.createCanvasContext("barChart", this);
    const width = 313;
    const height = 160;
    const baseY = 126;
    const gap = 14;
    const barWidth = 42;
    const max = Math.max(...this.data.barData.map(item => item.value));
    ctx.clearRect(0, 0, width, height);
    this.data.barData.forEach((item, index) => {
      const x = 18 + index * (barWidth + gap);
      const barHeight = (item.value / max) * 94;
      const y = baseY - barHeight;
      const gradient = ctx.createLinearGradient(0, y, 0, baseY);
      gradient.addColorStop(0, item.colors[0]);
      gradient.addColorStop(1, item.colors[1]);
      this.roundRect(ctx, x, y, barWidth, barHeight, 10);
      ctx.setFillStyle(gradient);
      ctx.fill();
      ctx.setFillStyle("#6b7280");
      ctx.setFontSize(9);
      ctx.setTextAlign("center");
      ctx.fillText(item.name, x + barWidth / 2, 148);
    });
    ctx.draw();
  },

  roundRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arc(x + width - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + width, y + height - r);
    ctx.arc(x + width - r, y + height - r, r, 0, Math.PI * .5);
    ctx.lineTo(x + r, y + height);
    ctx.arc(x + r, y + height - r, r, Math.PI * .5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.closePath();
  }
});
