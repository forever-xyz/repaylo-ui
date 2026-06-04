const W = 375;
const R = (rpx) => rpx / 2;

const C = {
  orange: {
    primary: "#FF9F43",
    active: "#E8841E",
    soft: "#FFF6ED",
    soft2: "#FFE9D1",
    page: "#FFFBF6",
    border: "#F1E7DD"
  },
  pink: {
    primary: "#F7799B",
    active: "#E85F86",
    soft: "#FFF1F5",
    soft2: "#FFE0EA",
    page: "#FFF8FA",
    border: "#F4E3EA"
  },
  contract: {
    primary: "#5E6B78",
    active: "#44515F",
    soft: "#F7F8FA",
    soft2: "#EEF0F3",
    page: "#F7F8FA",
    border: "#EEF0F3"
  },
  dark: {
    page: "#101418",
    surface: "#171C21",
    surface2: "#1E252B",
    text: "#F2F5F7",
    sub: "#B7C0CA",
    border: "#2A323A"
  },
  text: "#1F2933",
  sub: "#5E6B78",
  muted: "#8A95A3",
  surface: "#FFFFFF",
  surface2: "#FAFAFA",
  success: "#22A65A",
  successSoft: "#ECFDF3",
  warning: "#F5A400",
  warningSoft: "#FFF8E6",
  error: "#E95555",
  errorSoft: "#FFF0F0",
  info: "#3B82F6",
  infoSoft: "#EEF6FF",
  voucher: "#8B6FE8"
};

const status = {
  WAIT_CONFIRM: ["待确认", C.infoSoft, "#1D4ED8"],
  WAIT_REPAY: ["待还款", C.warningSoft, "#A96400"],
  OVERDUE: ["已逾期", C.errorSoft, "#B72E2E"],
  APPLY_DELAY: ["申请延期", C.warningSoft, "#A96400"],
  WAIT_FINISH_CONFIRM: ["待确认完成", C.infoSoft, "#1D4ED8"],
  FINISHED: ["已完成", C.successSoft, "#0F7A3B"],
  REJECT: ["已拒绝", "#F2F4F7", C.sub],
  EXPIRED: ["已失效", "#F2F4F7", C.muted]
};

function rgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255
  };
}

function paint(hex, opacity = 1) {
  return [{ type: "SOLID", color: rgb(hex), opacity }];
}

function linearGradient(from, to, opacity = 1) {
  const fromRgb = rgb(from);
  const toRgb = rgb(to);
  return [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0.72, 0.7, -0.2], [-0.7, 0.72, 0.52]],
    gradientStops: [
      { position: 0, color: { r: fromRgb.r, g: fromRgb.g, b: fromRgb.b, a: opacity } },
      { position: 1, color: { r: toRgb.r, g: toRgb.g, b: toRgb.b, a: opacity } }
    ]
  }];
}

function shadow(opacity = 0.06) {
  return [{ type: "DROP_SHADOW", color: { r: 0.12, g: 0.16, b: 0.2, a: opacity }, offset: { x: 0, y: 4 }, radius: 16, visible: true, blendMode: "NORMAL" }];
}

function deepShadow(opacity = 0.16) {
  return [
    { type: "DROP_SHADOW", color: { r: 0.23, g: 0.14, b: 0.43, a: opacity }, offset: { x: 0, y: 18 }, radius: 42, visible: true, blendMode: "NORMAL" },
    { type: "DROP_SHADOW", color: { r: 1, g: 1, b: 1, a: 0.35 }, offset: { x: 0, y: -1 }, radius: 8, visible: true, blendMode: "NORMAL" }
  ];
}

function blurEffect(radius = 24) {
  return { type: "BACKGROUND_BLUR", radius, visible: true };
}

function freeFrame(name, width, height, fill) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(width, height);
  f.fills = fill ? paint(fill) : [];
  f.clipsContent = false;
  return f;
}

async function text(value, size = 14, weight = "Regular", color = C.text, width) {
  await figma.loadFontAsync({ family: "Inter", style: weight });
  const t = figma.createText();
  t.characters = value;
  t.fontName = { family: "Inter", style: weight };
  t.fontSize = size;
  t.lineHeight = { unit: "PIXELS", value: Math.round(size * 1.45) };
  t.fills = paint(color);
  if (width) {
    t.resize(width, t.height);
    t.textAutoResize = "HEIGHT";
  }
  return t;
}

function frame(name, width, height, fill, layout = "VERTICAL") {
  const f = figma.createFrame();
  f.name = name;
  f.resize(width, height);
  f.fills = paint(fill);
  f.layoutMode = layout;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "FIXED";
  f.itemSpacing = R(24);
  f.paddingLeft = R(32);
  f.paddingRight = R(32);
  f.paddingTop = R(32);
  f.paddingBottom = R(32);
  return f;
}

function card(name, theme, layout = "VERTICAL") {
  const f = frame(name, W - R(64), 100, C.surface, layout);
  f.cornerRadius = R(24);
  f.strokes = paint(theme.border);
  f.strokeWeight = 1;
  f.effects = shadow(0.04);
  f.itemSpacing = R(20);
  f.paddingLeft = R(32);
  f.paddingRight = R(32);
  f.paddingTop = R(32);
  f.paddingBottom = R(32);
  return f;
}

function componentBox(name, width, height, fill, layout = "VERTICAL") {
  const c = figma.createComponent();
  c.name = name;
  c.resize(width, height);
  c.fills = paint(fill);
  c.layoutMode = layout;
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "FIXED";
  c.itemSpacing = R(16);
  c.paddingLeft = R(24);
  c.paddingRight = R(24);
  c.paddingTop = R(16);
  c.paddingBottom = R(16);
  c.cornerRadius = R(20);
  return c;
}

async function buttonComponent(label, theme, type) {
  const isPrimary = type === "Primary";
  const isDanger = type === "Danger";
  const c = componentBox(`Type=${type}, State=Default`, 150, R(88), isDanger ? C.errorSoft : isPrimary ? theme.primary : theme.soft, "HORIZONTAL");
  c.primaryAxisAlignItems = "CENTER";
  c.counterAxisAlignItems = "CENTER";
  c.primaryAxisSizingMode = "FIXED";
  c.counterAxisSizingMode = "FIXED";
  c.appendChild(await text(label, 14, "Semi Bold", isDanger ? "#B72E2E" : isPrimary ? "#FFFFFF" : C.text));
  return c;
}

async function tagComponent(key) {
  const [label, bg, color] = status[key];
  const c = componentBox(`Status=${key}`, 120, 30, bg, "HORIZONTAL");
  c.primaryAxisAlignItems = "CENTER";
  c.counterAxisAlignItems = "CENTER";
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "AUTO";
  c.cornerRadius = 999;
  c.paddingLeft = 10;
  c.paddingRight = 10;
  c.paddingTop = 5;
  c.paddingBottom = 5;
  c.appendChild(await text(label, 12, "Medium", color));
  return c;
}

async function pill(label, bg, color) {
  const p = frame(`Tag / ${label}`, 68, 28, bg, "HORIZONTAL");
  p.primaryAxisSizingMode = "AUTO";
  p.counterAxisSizingMode = "AUTO";
  p.cornerRadius = 999;
  p.paddingLeft = 10;
  p.paddingRight = 10;
  p.paddingTop = 5;
  p.paddingBottom = 5;
  p.itemSpacing = 4;
  p.appendChild(await text(label, 12, "Medium", color));
  return p;
}

async function button(label, theme, type = "primary", width = 140) {
  const isPrimary = type === "primary";
  const isDanger = type === "danger";
  const b = frame(`Button / ${type} / ${label}`, width, R(96), isDanger ? C.errorSoft : isPrimary ? theme.primary : theme.soft, "HORIZONTAL");
  b.primaryAxisAlignItems = "CENTER";
  b.counterAxisAlignItems = "CENTER";
  b.primaryAxisSizingMode = "FIXED";
  b.counterAxisSizingMode = "FIXED";
  b.cornerRadius = R(24);
  b.paddingLeft = 0;
  b.paddingRight = 0;
  b.paddingTop = 0;
  b.paddingBottom = 0;
  b.appendChild(await text(label, 15, "Semi Bold", isDanger ? "#B72E2E" : isPrimary ? "#FFFFFF" : C.text));
  return b;
}

async function iconCircle(label, theme, fill) {
  const f = frame(`Icon / ${label}`, R(96), R(96), fill || theme.soft, "VERTICAL");
  f.primaryAxisAlignItems = "CENTER";
  f.counterAxisAlignItems = "CENTER";
  f.cornerRadius = R(28);
  f.paddingLeft = 0;
  f.paddingRight = 0;
  f.paddingTop = 0;
  f.paddingBottom = 0;
  f.appendChild(await text(label, 22, "Medium", theme.primary));
  return f;
}

async function nav(title, theme, back = false, dark = false) {
  const n = frame(`NavBar / ${title}`, W, R(88), dark ? C.dark.surface : theme.page, "HORIZONTAL");
  n.primaryAxisSizingMode = "FIXED";
  n.counterAxisSizingMode = "FIXED";
  n.primaryAxisAlignItems = "SPACE_BETWEEN";
  n.counterAxisAlignItems = "CENTER";
  n.paddingLeft = R(32);
  n.paddingRight = R(32);
  n.paddingTop = 0;
  n.paddingBottom = 0;
  n.appendChild(await text(back ? "‹" : " ", 28, "Regular", dark ? C.dark.text : C.text));
  n.appendChild(await text(title, 18, "Semi Bold", dark ? C.dark.text : C.text));
  n.appendChild(await text("•••", 18, "Medium", dark ? C.dark.sub : C.sub));
  return n;
}

async function tabBar(active, theme, dark = false) {
  const bar = frame("TabBar / 首页 消息 我的", W, R(112), dark ? C.dark.surface : C.surface, "HORIZONTAL");
  bar.primaryAxisSizingMode = "FIXED";
  bar.counterAxisSizingMode = "FIXED";
  bar.primaryAxisAlignItems = "SPACE_BETWEEN";
  bar.counterAxisAlignItems = "CENTER";
  bar.paddingLeft = R(72);
  bar.paddingRight = R(72);
  bar.paddingTop = R(12);
  bar.paddingBottom = R(12);
  for (const item of ["首页", "消息", "我的"]) {
    const it = frame(`Tab / ${item}`, 56, 46, "FFFFFF00", "VERTICAL");
    it.fills = [];
    it.primaryAxisAlignItems = "CENTER";
    it.counterAxisAlignItems = "CENTER";
    it.itemSpacing = 2;
    it.paddingLeft = 0;
    it.paddingRight = 0;
    it.paddingTop = 0;
    it.paddingBottom = 0;
    const color = item === active ? theme.primary : dark ? C.dark.sub : C.muted;
    it.appendChild(await text(item === "首页" ? "⌂" : item === "消息" ? "◌" : "◡", 18, "Medium", color));
    it.appendChild(await text(item, 11, "Medium", color));
    bar.appendChild(it);
  }
  return bar;
}

async function inputField(label, placeholder, theme, multiline = false) {
  const wrap = frame(`Field / ${label}`, W - R(128), multiline ? 126 : 72, "#FFFFFF00", "VERTICAL");
  wrap.fills = [];
  wrap.itemSpacing = R(12);
  wrap.paddingLeft = 0;
  wrap.paddingRight = 0;
  wrap.paddingTop = 0;
  wrap.paddingBottom = 0;
  wrap.appendChild(await text(label, 14, "Semi Bold", C.text));
  const box = frame(`Input / ${label}`, W - R(128), multiline ? R(176) : R(88), C.surface2, "HORIZONTAL");
  box.primaryAxisSizingMode = "FIXED";
  box.counterAxisSizingMode = "FIXED";
  box.cornerRadius = R(20);
  box.strokes = paint(theme.border);
  box.strokeWeight = 1;
  box.primaryAxisAlignItems = "CENTER";
  box.paddingLeft = R(24);
  box.paddingRight = R(24);
  box.paddingTop = multiline ? R(20) : 0;
  box.paddingBottom = multiline ? R(20) : 0;
  box.appendChild(await text(placeholder, 14, "Regular", C.muted, W - R(176)));
  wrap.appendChild(box);
  return wrap;
}

async function agreementCard(stateKey, theme, expanded = false) {
  const [label, bg, color] = status[stateKey];
  const c = card(`Card / Agreement / ${stateKey}${expanded ? " / Expanded" : ""}`, theme);
  const row = frame("Header", W - R(128), 30, "#FFFFFF00", "HORIZONTAL");
  row.fills = [];
  row.primaryAxisAlignItems = "SPACE_BETWEEN";
  row.counterAxisAlignItems = "CENTER";
  row.paddingLeft = 0;
  row.paddingRight = 0;
  row.paddingTop = 0;
  row.paddingBottom = 0;
  row.appendChild(await text(`${label} ｜ 李*`, 16, "Semi Bold", C.text));
  row.appendChild(await pill(label, bg, color));
  c.appendChild(row);
  c.appendChild(await text("¥2,000", expanded ? 28 : 20, "Bold", C.text));
  c.appendChild(await text(stateKey === "OVERDUE" ? "已逾期 2 天 · 医疗急用" : "约定归还日：2026-07-05 · 还有 3 天", 14, "Regular", C.sub));
  c.appendChild(await text("朋友创业项目急需周转，用于采购首批原材料，承诺回款后第一时间归还。", 14, "Regular", C.sub, W - R(128)));
  if (expanded) {
    c.appendChild(await text("延期记录：6/20 申请延期至 7/10，状态：已同意", 13, "Regular", C.sub, W - R(128)));
    c.appendChild(await text("提醒语：周转顺利就好，有需要随时说。", 13, "Regular", C.sub, W - R(128)));
    c.appendChild(await text("凭证：聊天记录 1 张，仅双方可见", 13, "Regular", C.voucher, W - R(128)));
  }
  const actions = frame("Actions", W - R(128), 44, "#FFFFFF00", "HORIZONTAL");
  actions.fills = [];
  actions.itemSpacing = R(16);
  actions.paddingLeft = 0;
  actions.paddingRight = 0;
  actions.paddingTop = 0;
  actions.paddingBottom = 0;
  actions.appendChild(await button(stateKey === "OVERDUE" ? "温馨提醒" : "查看详情", theme, "secondary", 98));
  if (stateKey === "WAIT_REPAY") actions.appendChild(await button("申请延期", theme, "secondary", 98));
  c.appendChild(actions);
  return c;
}

async function stateStrip(theme) {
  const s = frame("States / Loading Empty Error Success", W - R(64), 236, C.surface, "VERTICAL");
  s.cornerRadius = R(24);
  s.strokes = paint(theme.border);
  s.itemSpacing = R(16);
  s.appendChild(await text("页面状态", 16, "Semi Bold", C.text));
  s.appendChild(await text("Loading：正在整理你的温暖约定", 13, "Regular", C.sub));
  s.appendChild(await text("Empty：暂无内容，第一份温暖可以从这里开始", 13, "Regular", C.sub));
  s.appendChild(await text("Error：加载失败，请轻点重试", 13, "Regular", "#B72E2E"));
  s.appendChild(await text("Success：操作成功，信任记录已更新", 13, "Regular", "#0F7A3B"));
  return s;
}

async function darkPreview(title, theme) {
  const d = frame(`Dark Mode / ${title}`, W - R(64), 180, C.dark.surface, "VERTICAL");
  d.cornerRadius = R(24);
  d.strokes = paint(C.dark.border);
  d.itemSpacing = R(16);
  d.appendChild(await text("深色模式", 16, "Semi Bold", C.dark.text));
  d.appendChild(await text("背景 #101418 · 卡片 #171C21 · 文本保持 4.5:1 对比度", 13, "Regular", C.dark.sub, W - R(128)));
  d.appendChild(await pill("待还款", "#3B2D11", "#FFC857"));
  return d;
}

function ellipse(name, x, y, w, h, fill, opacity = 1, blur = 30) {
  const e = figma.createEllipse();
  e.name = name;
  e.resize(w, h);
  e.x = x;
  e.y = y;
  e.fills = paint(fill, opacity);
  e.effects = [{ type: "LAYER_BLUR", radius: blur, visible: true }];
  return e;
}

async function glassCard(name, width, height, fills, stroke = "#FFFFFF", layout = "VERTICAL") {
  const f = frame(name, width, height, "#FFFFFF", layout);
  f.fills = fills || linearGradient("#FFFFFF", "#FFF7ED", 0.72);
  const shadows = deepShadow(0.13);
  f.effects = [blurEffect(24)].concat(shadows);
  f.strokes = paint(stroke, 0.54);
  f.strokeWeight = 1;
  f.cornerRadius = R(56);
  f.paddingLeft = R(32);
  f.paddingRight = R(32);
  f.paddingTop = R(32);
  f.paddingBottom = R(32);
  f.itemSpacing = R(20);
  return f;
}

async function compactMetric(label, value, color = C.orange.primary) {
  const f = frame(`Metric / ${label}`, 92, 58, "#FFFFFF00", "VERTICAL");
  f.fills = [];
  f.primaryAxisAlignItems = "CENTER";
  f.counterAxisAlignItems = "CENTER";
  f.paddingLeft = 0;
  f.paddingRight = 0;
  f.paddingTop = 0;
  f.paddingBottom = 0;
  f.itemSpacing = 2;
  f.appendChild(await text(value, 17, "Bold", color));
  f.appendChild(await text(label, 11, "Regular", C.sub));
  return f;
}

async function progressBar(name, width, ratio, from, to) {
  const track = frame(name, width, 10, "#FFFFFF", "HORIZONTAL");
  track.primaryAxisSizingMode = "FIXED";
  track.counterAxisSizingMode = "FIXED";
  track.cornerRadius = 999;
  track.paddingLeft = 0;
  track.paddingRight = 0;
  track.paddingTop = 0;
  track.paddingBottom = 0;
  track.fills = paint("#FFFFFF", 0.48);
  const fill = figma.createRectangle();
  fill.name = "Animated Growth Fill / Variant=Default";
  fill.resize(Math.max(8, width * ratio), 10);
  fill.cornerRadius = 999;
  fill.fills = linearGradient(from, to, 1);
  track.appendChild(fill);
  return track;
}

async function functionTile(title, desc, icon, gradientFrom, gradientTo) {
  const tile = glassCard(`Home Function Tile / ${title} / Hover=Lift`, 157, 134, linearGradient(gradientFrom, gradientTo, 0.72), "#FFFFFF", "VERTICAL");
  tile.cornerRadius = R(40);
  tile.paddingLeft = R(24);
  tile.paddingRight = R(24);
  tile.paddingTop = R(24);
  tile.paddingBottom = R(24);
  tile.itemSpacing = R(10);
  tile.appendChild(await text(icon, 24, "Medium", "#FFFFFF"));
  tile.appendChild(await text(title, 16, "Bold", "#FFFFFF"));
  tile.appendChild(await text(desc, 11, "Regular", "#FFFFFF", 120));
  return tile;
}

async function miniSparkline(name, width, height, from, to) {
  const f = freeFrame(name, width, height);
  const pts = [[0, height * 0.65], [width * 0.18, height * 0.5], [width * 0.36, height * 0.58], [width * 0.56, height * 0.28], [width * 0.76, height * 0.36], [width, height * 0.16]];
  for (let i = 0; i < pts.length - 1; i++) {
    const line = figma.createLine();
    line.name = "Gradient Sparkline Segment";
    line.x = pts[i][0];
    line.y = pts[i][1];
    line.resize(Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]), 0);
    line.rotation = Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]) * 180 / Math.PI;
    line.strokes = linearGradient(from, to, 1);
    line.strokeWeight = 3;
    line.strokeCap = "ROUND";
    f.appendChild(line);
  }
  return f;
}

async function sectionTitle(title, action) {
  const row = frame(`Section Title / ${title}`, W - R(64), 28, "#FFFFFF00", "HORIZONTAL");
  row.fills = [];
  row.primaryAxisAlignItems = "SPACE_BETWEEN";
  row.counterAxisAlignItems = "CENTER";
  row.paddingLeft = 0;
  row.paddingRight = 0;
  row.paddingTop = 0;
  row.paddingBottom = 0;
  row.appendChild(await text(title, 18, "Bold", C.text));
  row.appendChild(await text(action || "", 13, "Semi Bold", C.orange.active));
  return row;
}

async function reminderItem(title, meta, stateKey) {
  const [label, bg, color] = status[stateKey];
  const item = glassCard(`Reminder Item / ${stateKey}`, W - R(96), 72, paint("#FFFFFF", 0.62), "#FFFFFF", "HORIZONTAL");
  item.cornerRadius = R(32);
  item.counterAxisAlignItems = "CENTER";
  item.primaryAxisAlignItems = "SPACE_BETWEEN";
  item.paddingTop = R(20);
  item.paddingBottom = R(20);
  item.appendChild(await text(title, 14, "Semi Bold", C.text));
  item.appendChild(await text(meta, 12, "Regular", C.sub));
  item.appendChild(await pill(label, bg, color));
  return item;
}

async function timelineItem(icon, title, sub, color) {
  const row = frame(`Timeline / ${title}`, W - R(96), 58, "#FFFFFF00", "HORIZONTAL");
  row.fills = [];
  row.counterAxisAlignItems = "CENTER";
  row.itemSpacing = R(20);
  row.paddingLeft = 0;
  row.paddingRight = 0;
  row.paddingTop = 0;
  row.paddingBottom = 0;
  row.appendChild(await iconCircle(icon, { primary: color, soft: "#FFFFFF" }, "#FFFFFF"));
  const copy = frame("Timeline Copy", 220, 50, "#FFFFFF00");
  copy.fills = [];
  copy.paddingLeft = 0;
  copy.paddingRight = 0;
  copy.paddingTop = 0;
  copy.paddingBottom = 0;
  copy.itemSpacing = 2;
  copy.appendChild(await text(title, 14, "Semi Bold", C.text));
  copy.appendChild(await text(sub, 12, "Regular", C.sub));
  row.appendChild(copy);
  return row;
}

async function pageFrame(name, theme, activeTab, back = false, height = 980) {
  const p = frame(`Frame / ${name} / Light`, W, height, theme.page);
  p.primaryAxisSizingMode = "FIXED";
  p.counterAxisSizingMode = "FIXED";
  p.paddingLeft = 0;
  p.paddingRight = 0;
  p.paddingTop = 0;
  p.paddingBottom = 0;
  p.itemSpacing = 0;
  p.appendChild(await nav(name, theme, back));
  const content = frame(`Content / ${name}`, W, height - 156, "#FFFFFF00");
  content.fills = [];
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.itemSpacing = R(32);
  p.appendChild(content);
  if (activeTab) p.appendChild(await tabBar(activeTab, theme));
  return { root: p, content };
}

async function buildHome(page, theme) {
  const { root, content } = await pageFrame("首页", theme, "首页", false, 1220);
  page.appendChild(root);
  const profile = card("Card / User Summary", theme, "HORIZONTAL");
  profile.counterAxisAlignItems = "CENTER";
  profile.itemSpacing = R(24);
  profile.appendChild(await iconCircle("小", theme, theme.soft2));
  const info = frame("User Info", 185, 90, "#FFFFFF00");
  info.fills = [];
  info.paddingLeft = 0;
  info.paddingRight = 0;
  info.paddingTop = 0;
  info.paddingBottom = 0;
  info.itemSpacing = R(10);
  info.appendChild(await text("小明", 18, "Semi Bold", C.text));
  info.appendChild(await text("信芽 88分 · Lv2 热心市民", 13, "Regular", C.sub));
  profile.appendChild(info);
  profile.appendChild(await button("已签到", theme, "secondary", 82));
  content.appendChild(profile);
  const quick = frame("Quick Actions", W - R(64), 100, "#FFFFFF00", "HORIZONTAL");
  quick.fills = [];
  quick.paddingLeft = 0;
  quick.paddingRight = 0;
  quick.paddingTop = 0;
  quick.paddingBottom = 0;
  quick.itemSpacing = R(24);
  for (const q of [["出手相助", "给朋友撑一把伞", theme, "✋"], ["江湖救急", "有困难坦诚开口", C.pink, "♡"]]) {
    const qc = card(`Entry / ${q[0]}`, q[2]);
    qc.resize(161, 92);
    qc.fills = paint(q[2].soft);
    qc.appendChild(await text(q[3], 22, "Medium", q[2].primary));
    qc.appendChild(await text(q[0], 16, "Semi Bold", C.text));
    qc.appendChild(await text(q[1], 12, "Regular", C.sub));
    quick.appendChild(qc);
  }
  content.appendChild(quick);
  content.appendChild(await text("我的温暖约定", 18, "Semi Bold", C.text));
  content.appendChild(await agreementCard("WAIT_REPAY", theme));
  content.appendChild(await agreementCard("OVERDUE", theme));
  content.appendChild(await agreementCard("FINISHED", theme));
  content.appendChild(await stateStrip(theme));
  content.appendChild(await darkPreview("首页", theme));
  content.appendChild(await text("本记录仅用于约定提醒与情谊守护，不提供借贷、担保或催收服务。", 12, "Regular", C.muted, W - R(64)));
  return root;
}

async function buildHomeV2(page, theme) {
  const { root, content } = await pageFrame("首页", theme, "首页", false, 2200);
  root.name = "Frame / 首页 / Glassmorphism Redesign / Light";
  root.fills = linearGradient("#FFF7ED", "#F3E8FF", 1);
  page.appendChild(root);

  const hero = freeFrame("Hero Glass Stack / User Growth Card", W, 340);
  hero.appendChild(ellipse("Ambient Blob / Peach / Parallax 01", -54, 8, 188, 188, "#FDBA74", 0.46, 42));
  hero.appendChild(ellipse("Ambient Blob / Violet / Parallax 02", 196, -34, 210, 210, "#A78BFA", 0.42, 50));
  hero.appendChild(ellipse("Ambient Blob / Pink / Parallax 03", 116, 162, 170, 170, "#F9A8D4", 0.34, 44));
  const user = await glassCard("Glass User Card / Gradient / Hover=Float", W - R(64), 264, linearGradient("#FFFFFF", "#FFF7ED", 0.74), "#FFFFFF", "VERTICAL");
  user.x = R(32);
  user.y = R(32);
  user.cornerRadius = R(64);
  const userTop = frame("User Row / Avatar Nickname Score", W - R(128), 76, "#FFFFFF00", "HORIZONTAL");
  userTop.fills = [];
  userTop.primaryAxisAlignItems = "SPACE_BETWEEN";
  userTop.counterAxisAlignItems = "CENTER";
  userTop.paddingLeft = 0;
  userTop.paddingRight = 0;
  userTop.paddingTop = 0;
  userTop.paddingBottom = 0;
  const avatar = freeFrame("Avatar / Liquid Glass Ring", 64, 64);
  avatar.appendChild(ellipse("Avatar Glow", -4, -4, 72, 72, "#FF9F43", 0.34, 14));
  const avCircle = figma.createEllipse();
  avCircle.name = "Avatar Image Placeholder";
  avCircle.resize(56, 56);
  avCircle.x = 4;
  avCircle.y = 4;
  avCircle.fills = linearGradient("#FFD7A8", "#F7799B", 1);
  avatar.appendChild(avCircle);
  userTop.appendChild(avatar);
  const copy = frame("User Identity Copy", 148, 64, "#FFFFFF00");
  copy.fills = [];
  copy.paddingLeft = 0;
  copy.paddingRight = 0;
  copy.paddingTop = 0;
  copy.paddingBottom = 0;
  copy.itemSpacing = 3;
  copy.appendChild(await text("小明", 20, "Bold", C.text));
  copy.appendChild(await text("愿每一次约定都被温柔守护", 12, "Regular", C.sub, 148));
  userTop.appendChild(copy);
  const score = await pill("信芽 88分", C.infoSoft, "#1D4ED8");
  userTop.appendChild(score);
  user.appendChild(userTop);
  user.appendChild(await progressBar("Growth Progress / Lv2 to Lv3 / Animated", W - R(128), 0.68, "#FFB56B", "#A78BFA"));
  const metricRow = frame("User Metrics / Streak Rate Growth", W - R(128), 62, "#FFFFFF00", "HORIZONTAL");
  metricRow.fills = [];
  metricRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  metricRow.counterAxisAlignItems = "CENTER";
  metricRow.paddingLeft = 0;
  metricRow.paddingRight = 0;
  metricRow.paddingTop = 0;
  metricRow.paddingBottom = 0;
  metricRow.appendChild(await compactMetric("连续签到", "12天", C.orange.active));
  metricRow.appendChild(await compactMetric("本月守约率", "96%", C.success));
  metricRow.appendChild(await compactMetric("本月成长值", "+128", "#8B5CF6"));
  user.appendChild(metricRow);
  user.appendChild(await text("Lv2 热心市民 · 距 Lv3 还差 320 成长值", 12, "Regular", C.sub));
  hero.appendChild(user);
  content.appendChild(hero);

  const sign = await glassCard("Daily Checkin Card / State=Unchecked Checked Makeup", W - R(64), 206, linearGradient("#FFFFFF", "#FFFBEB", 0.7), "#FFFFFF");
  const signHead = frame("Checkin Header", W - R(128), 40, "#FFFFFF00", "HORIZONTAL");
  signHead.fills = [];
  signHead.primaryAxisAlignItems = "SPACE_BETWEEN";
  signHead.counterAxisAlignItems = "CENTER";
  signHead.paddingLeft = 0;
  signHead.paddingRight = 0;
  signHead.paddingTop = 0;
  signHead.paddingBottom = 0;
  signHead.appendChild(await text("每日签到", 18, "Bold", C.text));
  signHead.appendChild(await pill("未签到", "#FFF8E6", "#A96400"));
  sign.appendChild(signHead);
  const signStats = frame("Checkin Stats", W - R(128), 58, "#FFFFFF00", "HORIZONTAL");
  signStats.fills = [];
  signStats.primaryAxisAlignItems = "SPACE_BETWEEN";
  signStats.counterAxisAlignItems = "CENTER";
  signStats.paddingLeft = 0;
  signStats.paddingRight = 0;
  signStats.paddingTop = 0;
  signStats.paddingBottom = 0;
  signStats.appendChild(await compactMetric("连续", "12天", C.orange.active));
  signStats.appendChild(await compactMetric("累计", "152次", C.info));
  signStats.appendChild(await compactMetric("成长值", "1280", "#8B5CF6"));
  sign.appendChild(signStats);
  sign.appendChild(await progressBar("Next Level Exp / Animated Number Roll", W - R(128), 0.72, "#FCD34D", "#F59E0B"));
  const signAction = frame("Checkin Interaction / Particle Coin Animation", W - R(128), 52, "#FFFFFF00", "HORIZONTAL");
  signAction.fills = [];
  signAction.primaryAxisAlignItems = "SPACE_BETWEEN";
  signAction.counterAxisAlignItems = "CENTER";
  signAction.paddingLeft = 0;
  signAction.paddingRight = 0;
  signAction.paddingTop = 0;
  signAction.paddingBottom = 0;
  signAction.appendChild(await text("下一级还需 320 EXP", 12, "Regular", C.sub));
  signAction.appendChild(await button("立即签到", theme, "primary", 118));
  sign.appendChild(signAction);
  content.appendChild(sign);

  content.appendChild(await sectionTitle("核心功能", "2×2 矩阵"));
  const matrix = frame("Function Matrix / 2x2 Gradient Cards", W - R(64), 292, "#FFFFFF00", "HORIZONTAL");
  matrix.fills = [];
  matrix.layoutWrap = "WRAP";
  matrix.itemSpacing = R(20);
  matrix.paddingLeft = 0;
  matrix.paddingRight = 0;
  matrix.paddingTop = 0;
  matrix.paddingBottom = 0;
  matrix.appendChild(await functionTile("出手相助", "给朋友撑一把伞", "✋", "#FDBA74", "#FB923C"));
  matrix.appendChild(await functionTile("江湖救急", "有困难坦诚开口", "♡", "#F9A8D4", "#F7799B"));
  matrix.appendChild(await functionTile("我的约定", "查看全部记录", "⌁", "#A78BFA", "#8B5CF6"));
  matrix.appendChild(await functionTile("信誉中心", "守护信芽成长", "◇", "#93C5FD", "#3B82F6"));
  content.appendChild(matrix);

  content.appendChild(await sectionTitle("今日待处理", "全部提醒"));
  const reminders = await glassCard("Today Reminder / Glass List", W - R(64), 232, paint("#FFFFFF", 0.68), "#FFFFFF");
  reminders.appendChild(await reminderItem("李* 的约定 3 天后到期", "¥2,000 · 待还款", "WAIT_REPAY"));
  reminders.appendChild(await reminderItem("王* 申请延期至 7/10", "需你确认 · 2小时前", "APPLY_DELAY"));
  content.appendChild(reminders);

  content.appendChild(await sectionTitle("我的约定", "查看更多"));
  const agreementStats = await glassCard("Agreement Dashboard / Stats + Collapsed List", W - R(64), 396, linearGradient("#FFFFFF", "#F5F3FF", 0.72), "#FFFFFF");
  const overview = frame("Agreement Overview / Count Amount Month", W - R(128), 78, "#FFFFFF00", "HORIZONTAL");
  overview.fills = [];
  overview.primaryAxisAlignItems = "SPACE_BETWEEN";
  overview.counterAxisAlignItems = "CENTER";
  overview.paddingLeft = 0;
  overview.paddingRight = 0;
  overview.paddingTop = 0;
  overview.paddingBottom = 0;
  overview.appendChild(await compactMetric("总数", "28", "#8B5CF6"));
  overview.appendChild(await compactMetric("总金额", "¥18.6k", C.orange.active));
  overview.appendChild(await compactMetric("本月新增", "+6", C.success));
  agreementStats.appendChild(overview);
  const statusRow = frame("Agreement Status Stats", W - R(128), 42, "#FFFFFF00", "HORIZONTAL");
  statusRow.fills = [];
  statusRow.itemSpacing = R(10);
  statusRow.paddingLeft = 0;
  statusRow.paddingRight = 0;
  statusRow.paddingTop = 0;
  statusRow.paddingBottom = 0;
  for (const key of ["WAIT_CONFIRM", "WAIT_REPAY", "FINISHED", "OVERDUE"]) {
    const [label, bg, color] = status[key];
    statusRow.appendChild(await pill(label, bg, color));
  }
  agreementStats.appendChild(statusRow);
  const search = await glassCard("Search + Filter / Time Status Amount Type Lend Borrow", W - R(128), 54, paint("#FFFFFF", 0.58), "#FFFFFF", "HORIZONTAL");
  search.cornerRadius = R(28);
  search.counterAxisAlignItems = "CENTER";
  search.paddingTop = R(12);
  search.paddingBottom = R(12);
  search.appendChild(await text("搜索约定、好友、金额", 13, "Regular", C.muted));
  search.appendChild(await text("筛选", 13, "Semi Bold", C.orange.active));
  agreementStats.appendChild(search);
  agreementStats.appendChild(await reminderItem("小李 · 项目周转", "¥2,000 · 3天后", "WAIT_REPAY"));
  agreementStats.appendChild(await reminderItem("小王 · 医疗急用", "¥1,000 · 逾期2天", "OVERDUE"));
  agreementStats.appendChild(await reminderItem("小钱 · 聚餐垫付", "¥268 · 已完成", "FINISHED"));
  content.appendChild(agreementStats);

  content.appendChild(await sectionTitle("成长足迹", "签到中心"));
  const growth = await glassCard("Growth Timeline / Recent Footprints", W - R(64), 242, paint("#FFFFFF", 0.68), "#FFFFFF");
  growth.appendChild(await timelineItem("+5", "完成与李*的约定", "信誉分增加，守约率保持 96%", C.success));
  growth.appendChild(await timelineItem("+1", "今日签到待完成", "点击签到可获得成长值与信誉分", C.orange.active));
  growth.appendChild(await timelineItem("Lv", "距离 Lv3 散财童子更近一步", "还差 320 成长值", "#8B5CF6"));
  content.appendChild(growth);

  content.appendChild(await sectionTitle("本月数据", "信誉中心"));
  const data = await glassCard("Data Visualization / Mini Trend Cards", W - R(64), 276, linearGradient("#FFFFFF", "#EFF6FF", 0.72), "#FFFFFF");
  const dataGrid = frame("Data Grid", W - R(128), 172, "#FFFFFF00", "HORIZONTAL");
  dataGrid.fills = [];
  dataGrid.layoutWrap = "WRAP";
  dataGrid.itemSpacing = R(16);
  dataGrid.paddingLeft = 0;
  dataGrid.paddingRight = 0;
  dataGrid.paddingTop = 0;
  dataGrid.paddingBottom = 0;
  for (const d of [["借出金额", "¥8,600", "#FF9F43"], ["借入金额", "¥3,200", "#F7799B"], ["守约率", "96%", "#22A65A"], ["成长值", "+128", "#8B5CF6"]]) {
    const dc = glassCard(`Data Card / ${d[0]}`, 157, 78, paint("#FFFFFF", 0.52), "#FFFFFF");
    dc.cornerRadius = R(32);
    dc.paddingTop = R(20);
    dc.paddingBottom = R(20);
    dc.appendChild(await text(d[1], 20, "Bold", d[2]));
    dc.appendChild(await text(d[0], 12, "Regular", C.sub));
    dataGrid.appendChild(dc);
  }
  data.appendChild(dataGrid);
  data.appendChild(await miniSparkline("Mini Trend / Monthly Amount Gradient", W - R(128), 56, "#FDBA74", "#8B5CF6"));
  content.appendChild(data);

  content.appendChild(await sectionTitle("最近动态", "更多"));
  const activity = await glassCard("Recent Activity / Friend Interactions", W - R(64), 224, paint("#FFFFFF", 0.68), "#FFFFFF");
  activity.appendChild(await timelineItem("✓", "小钱已确认完成", "聚餐垫付 ¥268 · 刚刚", C.success));
  activity.appendChild(await timelineItem("↗", "王* 留言：今天会处理", "约定提醒 · 1小时前", C.info));
  activity.appendChild(await timelineItem("★", "本月已守护 6 次约定", "比上月多 2 次", C.orange.active));
  content.appendChild(activity);

  content.appendChild(await stateStrip(theme));
  content.appendChild(await darkPreview("首页玻璃拟态重构", theme));
  content.appendChild(await text("Motion Tokens：页面进入 320ms stagger；卡片浮现 180ms；签到金币粒子 900ms；展开收起 220ms；数字滚动 600ms。", 12, "Regular", C.muted, W - R(64)));
  return root;
}

async function formPage(page, name, theme, fields, heroTitle, heroSub, primaryLabel) {
  const { root, content } = await pageFrame(name, theme, null, true, 1180);
  page.appendChild(root);
  const hero = card(`Hero / ${name}`, theme);
  hero.fills = paint(theme.soft);
  hero.appendChild(await text(heroTitle, 22, "Bold", C.text));
  hero.appendChild(await text(heroSub, 14, "Regular", C.sub, W - R(128)));
  content.appendChild(hero);
  const form = card(`Form / ${name}`, theme);
  for (const f of fields) form.appendChild(await inputField(f[0], f[1], theme, f[2]));
  form.appendChild(await text("还了么只记录约定和提醒，不提供资金、担保或催收服务。", 12, "Regular", C.muted, W - R(128)));
  content.appendChild(form);
  const bar = frame(`ActionBar / ${name}`, W - R(64), R(120), "#FFFFFF00", "HORIZONTAL");
  bar.fills = [];
  bar.itemSpacing = R(24);
  bar.paddingLeft = 0;
  bar.paddingRight = 0;
  bar.paddingTop = 0;
  bar.paddingBottom = 0;
  bar.appendChild(await button("取消", theme, "secondary", 110));
  bar.appendChild(await button(primaryLabel, theme, "primary", 209));
  content.appendChild(bar);
  content.appendChild(await stateStrip(theme));
  content.appendChild(await darkPreview(name, theme));
  return root;
}

async function buildDetail(page, theme) {
  const { root, content } = await pageFrame("约定详情", theme, null, true, 1260);
  page.appendChild(root);
  const summary = card("Detail / Status Summary", theme);
  summary.appendChild(await pill("待还款", C.warningSoft, "#A96400"));
  summary.appendChild(await text("¥2,000", 28, "Bold", C.text));
  summary.appendChild(await text("约定归还日：2026-07-05 · 还有 3 天", 14, "Regular", C.sub));
  content.appendChild(summary);
  const people = card("Detail / People Pair", theme, "HORIZONTAL");
  people.primaryAxisAlignItems = "SPACE_BETWEEN";
  people.counterAxisAlignItems = "CENTER";
  people.appendChild(await text("出借人\n我", 14, "Semi Bold", C.text));
  people.appendChild(await text("→", 22, "Regular", C.muted));
  people.appendChild(await text("借款人\n李*", 14, "Semi Bold", C.text));
  content.appendChild(people);
  content.appendChild(await agreementCard("WAIT_REPAY", theme, true));
  const buttons = frame("ActionBar / Status Actions", W - R(64), R(120), "#FFFFFF00", "HORIZONTAL");
  buttons.fills = [];
  buttons.itemSpacing = R(24);
  buttons.paddingLeft = 0;
  buttons.paddingRight = 0;
  buttons.paddingTop = 0;
  buttons.paddingBottom = 0;
  buttons.appendChild(await button("申请延期", theme, "secondary", 110));
  buttons.appendChild(await button("确认完成", theme, "primary", 209));
  content.appendChild(buttons);
  content.appendChild(await stateStrip(theme));
  content.appendChild(await darkPreview("约定详情", theme));
  return root;
}

async function buildDelay(page, theme) {
  return formPage(
    page,
    "延期申请",
    theme,
    [["新还款日期", "选择新的归还日期", false], ["延期原因", "说明需要延期的原因", true]],
    "说明情况，等待确认",
    "提交后将等待对方确认；对方同意后，新的还款日期才会生效。",
    "提交申请"
  );
}

async function buildMessages(page, theme) {
  const { root, content } = await pageFrame("消息中心", theme, "消息", false, 1120);
  page.appendChild(root);
  const stat = card("Message / Unread Summary", theme);
  stat.appendChild(await text("12 条未读", 22, "Bold", C.text));
  stat.appendChild(await text("新的约定提醒会出现在这里", 14, "Regular", C.sub));
  content.appendChild(stat);
  const tabs = frame("Message Tabs", W - R(64), 42, "#FFFFFF00", "HORIZONTAL");
  tabs.fills = [];
  tabs.itemSpacing = R(12);
  tabs.paddingLeft = 0;
  tabs.paddingRight = 0;
  tabs.paddingTop = 0;
  tabs.paddingBottom = 0;
  for (const t of ["全部", "系统通知", "约定提醒", "成长通知"]) tabs.appendChild(await pill(t, t === "全部" ? theme.soft2 : C.surface, t === "全部" ? theme.active : C.sub));
  content.appendChild(tabs);
  for (const m of [["约定提醒", "李* 的 ¥2,000 将在 3 天后到期", C.warning], ["成长通知", "完成约定，信誉分 +5", C.success], ["系统通知", "凭证仅约定双方可见", C.info]]) {
    const item = card(`MessageItem / ${m[0]}`, theme, "HORIZONTAL");
    item.counterAxisAlignItems = "CENTER";
    item.appendChild(await iconCircle("●", theme, m[2] === C.warning ? C.warningSoft : m[2] === C.success ? C.successSoft : C.infoSoft));
    const body = frame("Message Body", 220, 64, "#FFFFFF00");
    body.fills = [];
    body.paddingLeft = 0;
    body.paddingRight = 0;
    body.paddingTop = 0;
    body.paddingBottom = 0;
    body.itemSpacing = R(8);
    body.appendChild(await text(m[0], 15, "Semi Bold", C.text));
    body.appendChild(await text(m[1], 13, "Regular", C.sub, 220));
    item.appendChild(body);
    content.appendChild(item);
  }
  content.appendChild(await stateStrip(theme));
  content.appendChild(await darkPreview("消息中心", theme));
  return root;
}

async function buildProfile(page, theme) {
  const { root, content } = await pageFrame("个人中心", theme, "我的", false, 1220);
  page.appendChild(root);
  const profile = card("Profile / Header Card", theme);
  profile.appendChild(await text("小明", 22, "Bold", C.text));
  profile.appendChild(await text("信芽 88分 · Lv2 热心市民", 14, "Regular", C.sub));
  profile.appendChild(await text("每一次守约，都是对信任的温柔守护。", 13, "Regular", C.sub, W - R(128)));
  content.appendChild(profile);
  const grid = frame("Profile / Stats Grid", W - R(64), 180, "#FFFFFF00", "HORIZONTAL");
  grid.fills = [];
  grid.layoutWrap = "WRAP";
  grid.itemSpacing = R(16);
  grid.paddingLeft = 0;
  grid.paddingRight = 0;
  grid.paddingTop = 0;
  grid.paddingBottom = 0;
  for (const s of [["出借金额", "¥8,600"], ["借款金额", "¥3,200"], ["完成次数", "12"], ["守约率", "96%"]]) {
    const st = card(`Stat / ${s[0]}`, theme);
    st.resize(157, 78);
    st.paddingTop = R(20);
    st.paddingBottom = R(20);
    st.appendChild(await text(s[1], 20, "Bold", C.text));
    st.appendChild(await text(s[0], 12, "Regular", C.sub));
    grid.appendChild(st);
  }
  content.appendChild(grid);
  const growth = card("Profile / Growth Timeline", theme);
  growth.appendChild(await text("成长足迹", 16, "Semi Bold", C.text));
  growth.appendChild(await text("完成与李*的约定，信誉分 +5", 13, "Regular", C.sub));
  growth.appendChild(await text("连续签到 3 天，成长值 +3", 13, "Regular", C.sub));
  content.appendChild(growth);
  const menu = card("Profile / Menu List", theme);
  for (const i of ["我的凭证", "消息中心", "帮助中心", "隐私设置", "关于我们"]) menu.appendChild(await text(`${i}    ›`, 15, "Regular", C.text));
  content.appendChild(menu);
  content.appendChild(await stateStrip(theme));
  content.appendChild(await darkPreview("个人中心", theme));
  return root;
}

async function buildLibrary() {
  const page = figma.createPage();
  page.name = "00 Component Library";
  figma.currentPage = page;
  try {
    if (figma.variables && figma.variables.createVariableCollection) {
      const collection = figma.variables.createVariableCollection("HuanLeMe Theme Variables");
      const orangeMode = collection.modes[0];
      collection.renameMode(orangeMode.modeId, "Theme/Orange");
      const pinkMode = collection.addMode("Theme/Pink");
      const contractMode = collection.addMode("Theme/Contract");
      const vars = [
        ["Primary", C.orange.primary, C.pink.primary, C.contract.primary],
        ["SoftBg", C.orange.soft, C.pink.soft, C.contract.soft],
        ["PageBg", C.orange.page, C.pink.page, C.contract.page],
        ["BorderLight", C.orange.border, C.pink.border, C.contract.border],
        ["ButtonBg", C.orange.primary, C.pink.primary, "#1F2933"]
      ];
      for (const [name, orange, pink, contract] of vars) {
        const variable = figma.variables.createVariable(name, collection, "COLOR");
        variable.setValueForMode(orangeMode.modeId, rgb(orange));
        variable.setValueForMode(pinkMode.modeId, rgb(pink));
        variable.setValueForMode(contractMode.modeId, rgb(contract));
      }
    }
  } catch (e) {
    console.log("Variable creation skipped", e);
  }
  const cover = frame("Figma Component Library / HuanLeMe MVP", 1200, 900, "#FFFFFF");
  cover.layoutMode = "VERTICAL";
  cover.paddingLeft = 48;
  cover.paddingRight = 48;
  cover.paddingTop = 48;
  cover.paddingBottom = 48;
  cover.itemSpacing = 24;
  page.appendChild(cover);
  cover.appendChild(await text("HuanLeMe MVP Component Library", 32, "Bold", C.text));
  cover.appendChild(await text("Variables: Theme/Orange · Theme/Pink · Theme/Contract · Dark Mode · Status Tokens", 16, "Regular", C.sub));
  const themes = frame("Theme Variables", 1100, 170, "#FFFFFF00", "HORIZONTAL");
  themes.fills = [];
  themes.itemSpacing = 24;
  themes.paddingLeft = 0;
  themes.paddingRight = 0;
  themes.paddingTop = 0;
  themes.paddingBottom = 0;
  for (const [name, theme] of [["Theme/Orange", C.orange], ["Theme/Pink", C.pink], ["Theme/Contract", C.contract]]) {
    const sw = card(name, theme);
    sw.resize(340, 150);
    sw.fills = paint(theme.soft);
    sw.appendChild(await text(name, 18, "Bold", C.text));
    sw.appendChild(await text(`Primary ${theme.primary} · SoftBg ${theme.soft} · Page ${theme.page}`, 13, "Regular", C.sub, 280));
    sw.appendChild(await button("Primary", theme, "primary", 120));
    themes.appendChild(sw);
  }
  cover.appendChild(themes);
  const comps = frame("Components", 1100, 420, "#FFFFFF00", "HORIZONTAL");
  comps.fills = [];
  comps.itemSpacing = 24;
  comps.paddingLeft = 0;
  comps.paddingRight = 0;
  comps.paddingTop = 0;
  comps.paddingBottom = 0;
  comps.layoutWrap = "WRAP";
  comps.appendChild(await button("发送约定", C.orange, "primary", 140));
  comps.appendChild(await button("发送求助", C.pink, "primary", 140));
  comps.appendChild(await button("暂不确认", C.contract, "danger", 140));
  for (const key of Object.keys(status)) {
    const [label, bg, color] = status[key];
    comps.appendChild(await pill(`${key} ${label}`, bg, color));
  }
  comps.appendChild(await agreementCard("WAIT_REPAY", C.orange));
  comps.appendChild(await agreementCard("OVERDUE", C.contract));
  cover.appendChild(comps);
  const realComponents = frame("Real Figma Components + Variants", 1100, 260, "#FFFFFF00", "HORIZONTAL");
  realComponents.fills = [];
  realComponents.itemSpacing = 32;
  realComponents.paddingLeft = 0;
  realComponents.paddingRight = 0;
  realComponents.paddingTop = 0;
  realComponents.paddingBottom = 0;
  const b1 = await buttonComponent("发送约定", C.orange, "Primary");
  const b2 = await buttonComponent("取消", C.orange, "Secondary");
  const b3 = await buttonComponent("暂不确认", C.orange, "Danger");
  const buttonSet = figma.combineAsVariants([b1, b2, b3], page);
  buttonSet.name = "Component / Button";
  buttonSet.x = 48;
  buttonSet.y = 720;
  const tagNodes = [];
  for (const key of Object.keys(status)) tagNodes.push(await tagComponent(key));
  const tagSet = figma.combineAsVariants(tagNodes, page);
  tagSet.name = "Component / Tag / Status";
  tagSet.x = 360;
  tagSet.y = 720;
  realComponents.appendChild(await text("Button variants and Status Tag variants are generated as real Figma components.", 14, "Regular", C.sub, 700));
  cover.appendChild(realComponents);
  return page;
}

async function buildFlow(targets) {
  const page = figma.createPage();
  page.name = "08 Prototype Flow";
  figma.currentPage = page;
  const board = frame("Prototype Flow / MVP", 1600, 900, "#FFFFFF", "VERTICAL");
  board.paddingLeft = 48;
  board.paddingRight = 48;
  board.paddingTop = 48;
  board.paddingBottom = 48;
  board.itemSpacing = 28;
  page.appendChild(board);
  board.appendChild(await text("Prototype Flow", 32, "Bold", C.text));
  const flow = [
    "首页 → 出手相助 → 约定详情 WAIT_CONFIRM",
    "首页 → 江湖救急 → 约定详情 WAIT_CONFIRM",
    "首页/消息中心 → 约定详情 → 延期申请 → 约定详情 APPLY_DELAY",
    "约定详情 WAIT_REPAY → 确认完成 → FINISHED",
    "个人中心 → 消息中心 → 约定详情"
  ];
  for (const line of flow) board.appendChild(await text(line, 18, "Semi Bold", C.sub));
  board.appendChild(await text("Clickable prototype reactions are represented by frame names and flow labels; connect these frames in Figma Prototype mode after generation if plugin reaction permissions are unavailable.", 14, "Regular", C.muted, 900));
}

async function buildHomeRedesignDelivery() {
  const page = figma.createPage();
  page.name = "09 首页重构交付结构";
  figma.currentPage = page;
  const board = frame("首页完整高保真设计稿 / Delivery Board", 1600, 1200, "#F8F7FC", "HORIZONTAL");
  board.layoutWrap = "WRAP";
  board.itemSpacing = 32;
  board.paddingLeft = 48;
  board.paddingRight = 48;
  board.paddingTop = 48;
  board.paddingBottom = 48;
  page.appendChild(board);
  const blocks = [
    ["页面结构图", "用户卡 → 签到中心 → 2x2 功能矩阵 → 今日提醒 → 我的约定 → 成长足迹 → 数据统计 → 最近动态"],
    ["组件清单", "Glass/UserCard, Checkin/DailyCard, Function/GradientTile, Agreement/Dashboard, Reminder/List, Timeline/Growth, Data/MiniChart, Activity/Feed, State/LoadingEmptyErrorSuccess"],
    ["动效设计", "页面进入 stagger 320ms；卡片浮现 180ms；签到金币粒子 900ms；成长值数字滚动 600ms；约定卡展开收起 220ms；Tab 切换 liquid slide 240ms"],
    ["Prototype 跳转", "签到卡 → 签到中心；出手相助 → 创建约定；江湖救急 → 创建求助；我的约定 → 我的约定页；信誉中心 → 信誉中心；今日提醒 → 约定详情"],
    ["新增页面清单", "签到中心、我的约定、信誉中心、成长记录、好友互动详情；本次在首页原型中给出入口与跳转占位"],
    ["深色模式方案", "背景 #101418；玻璃卡 #171C21 / 72%；边框 #2A323A；主题光斑降低透明度；状态色提升亮度，保持 4.5:1 对比度"]
  ];
  for (const [title, body] of blocks) {
    const b = await glassCard(`Delivery / ${title}`, 480, 250, linearGradient("#FFFFFF", "#F5F3FF", 0.78), "#FFFFFF");
    b.appendChild(await text(title, 24, "Bold", C.text));
    b.appendChild(await text(body, 16, "Regular", C.sub, 400));
    board.appendChild(b);
  }
}

async function run() {
  await buildLibrary();
  const pages = [
    ["01 首页", buildHomeV2, C.orange],
    ["02 出手相助", (p, t) => formPage(p, "出手相助", t, [["借款人", "选择需要帮助的朋友", false], ["金额", "请输入金额", false], ["还款日期", "选择约定归还日期", false], ["借款缘由", "简单说明这笔周转的缘由", true], ["辅助凭证", "上传聊天记录、合同或说明材料，最多 3 张", false], ["提醒语", "写一句只有对方可见的温暖提醒", true]], "给朋友撑一把伞", "把金额、日期和约定说清楚，关系就少一点尴尬。", "发送约定"), C.orange],
    ["03 江湖救急", (p, t) => formPage(p, "江湖救急", t, [["出借人", "选择想请求帮助的朋友", false], ["金额", "请输入需要周转的金额", false], ["还款日期", "选择预计归还日期", false], ["借款缘由", "说明遇到的情况", true], ["辅助凭证", "上传病历、聊天记录或说明材料，最多 5 张", false], ["补充说明", "写下感谢和归还承诺", true]], "有困难，也可以坦诚开口", "把需求和归还计划说清楚，信任会更容易被看见。", "发送求助"), C.pink],
    ["04 约定详情", buildDetail, C.contract],
    ["05 延期申请", buildDelay, C.contract],
    ["06 消息中心", buildMessages, C.orange],
    ["07 个人中心", buildProfile, C.orange]
  ];
  const targets = {};
  let x = 0;
  for (const [name, builder, theme] of pages) {
    const page = figma.createPage();
    page.name = name;
    figma.currentPage = page;
    const root = await builder(page, theme);
    if (root) {
      root.x = x;
      root.y = 0;
      targets[name] = root;
    }
  }
  await buildFlow(targets);
  await buildHomeRedesignDelivery();
  figma.notify("还了么 MVP 高保真原型图已生成：Component Library + 7 Pages + Prototype Flow");
  figma.closePlugin();
}

run();
