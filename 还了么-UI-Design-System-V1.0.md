# 《还了么 UI Design System V1.0》

Version：V1.0  
适用端：微信小程序、UniApp、Taro、React、Vue、Figma Component Library  
依据：《还了么 PRD V1.0》《还了么产品结构图谱》  
设计目标：温暖、可信、治愈、有成长感  

---

## 0. 设计原则

### 0.1 产品气质

还了么不是金融产品，不是借贷平台，也不是催收工具。所有视觉语言需要传达“帮助维护关系”的感受，而不是“债务压力”或“风险控制”。

| 原则 | 说明 | 落地方式 |
| --- | --- | --- |
| 温暖 | 降低借还场景中的尴尬感 | 使用柔和暖色、圆角卡片、轻量提示文案 |
| 可信 | 让记录、状态、凭证清晰可靠 | 状态色统一、信息层级清楚、关键操作有确认 |
| 治愈 | 避免压迫和催收感 | 避免高饱和红黑、避免强金融图表风格 |
| 有成长感 | 让守约行为被正向反馈 | 信誉等级、成长等级、完成反馈、温暖文案 |

### 0.2 设计融合方向

| 来源 | 采用能力 | 避免事项 |
| --- | --- | --- |
| Apple Human Interface | 清晰层级、克制动效、充足留白 | 不做过重拟物或系统外观照搬 |
| 微信小程序设计规范 | 导航、表单、触控区域、安全区 | 不破坏微信用户习惯 |
| Notion 极简设计 | 中性结构、清晰排版、轻卡片 | 不做过度装饰 |
| 小红书卡片设计 | 温暖卡片、亲和内容容器 | 不做信息流娱乐化 |

### 0.3 全局组件状态要求

所有组件至少考虑以下状态：

| 状态 | 使用场景 | 设计要求 |
| --- | --- | --- |
| Default | 默认可用 | 清晰、安静、可识别 |
| Loading | 提交、加载、上传中 | 展示进度或旋转态，防止重复操作 |
| Empty | 无数据 | 使用温暖插画或轻提示，引导下一步 |
| Error | 校验失败、网络失败 | 使用柔和错误色，明确恢复动作 |
| Success | 保存成功、完成约定 | 使用正向绿色和成长反馈 |
| Disabled | 不可操作 | 降低对比度，不隐藏关键入口 |
| Dark Mode | 暗色环境 | 保持可读性和状态色语义 |

---

## 1. Color System

### 1.1 色彩策略

主色选择“信芽绿”，表达信任、成长、关系修复。辅助色选择“暖杏橙”和“樱桃粉”，提供情感温度。整体避免银行蓝、金融黑金、高饱和风险红。

### 1.2 Core Colors

| Token | HEX | RGB | 使用场景 | 示例 |
| --- | --- | --- | --- | --- |
| Primary 50 | `#EEF9F2` | `238,249,242` | 主色浅背景 | 首页用户信息卡背景 |
| Primary 100 | `#D8F1E2` | `216,241,226` | 选中浅底、标签底 | 已签到状态底色 |
| Primary 300 | `#8DD8AA` | `141,216,170` | 图标辅助、进度条 | 成长进度 |
| Primary 500 | `#35B86B` | `53,184,107` | 主按钮、选中 Tab | 发送约定按钮 |
| Primary 600 | `#249C56` | `36,156,86` | 主按钮按下态 | Primary Active |
| Primary 700 | `#167A42` | `22,122,66` | 深色主色、强调文字 | 深色模式主按钮 |
| Secondary 50 | `#FFF6ED` | `255,246,237` | 暖色浅背景 | 温暖提示区 |
| Secondary 100 | `#FFE9D1` | `255,233,209` | 卡片点缀 | 新手引导底色 |
| Secondary 400 | `#FFB56B` | `255,181,107` | 辅助按钮、暖提示 | 温馨提醒按钮 |
| Secondary 500 | `#FF9F43` | `255,159,67` | 次级强调 | 成长等级图标 |
| Pink 50 | `#FFF1F5` | `255,241,245` | 轻情感背景 | 江湖救急页顶部氛围 |
| Pink 400 | `#F7799B` | `247,121,155` | 情感点缀 | 关系提示、插画点缀 |
| Success 50 | `#ECFDF3` | `236,253,243` | 成功浅底 | 已完成标签底 |
| Success 500 | `#22A65A` | `34,166,90` | 成功状态 | 完成约定、守约率 |
| Success 700 | `#0F7A3B` | `15,122,59` | 成功深色文字 | 已完成强调 |
| Warning 50 | `#FFF8E6` | `255,248,230` | 警告浅底 | 到期提醒背景 |
| Warning 500 | `#F5A400` | `245,164,0` | 警告状态 | 待还款、申请延期 |
| Warning 700 | `#A96400` | `169,100,0` | 警告深色文字 | 提醒标题 |
| Error 50 | `#FFF0F0` | `255,240,240` | 错误浅底 | 表单错误背景 |
| Error 500 | `#E95555` | `233,85,85` | 错误状态 | 已逾期、删除 |
| Error 700 | `#B72E2E` | `183,46,46` | 错误深色文字 | 重要错误说明 |
| Info 50 | `#EEF6FF` | `238,246,255` | 信息浅底 | 系统消息背景 |
| Info 500 | `#3B82F6` | `59,130,246` | 信息状态 | 系统通知、链接 |
| Info 700 | `#1D4ED8` | `29,78,216` | 信息深色文字 | 说明标题 |

### 1.3 Neutral Colors

| Token | HEX | RGB | 使用场景 | 示例 |
| --- | --- | --- | --- | --- |
| Background Base | `#F7F8FA` | `247,248,250` | 页面背景 | 首页、我的 |
| Background Warm | `#FFFBF6` | `255,251,246` | 暖感页面背景 | 创建约定页 |
| Surface 1 | `#FFFFFF` | `255,255,255` | 一级卡片、表单面 | 约定卡片 |
| Surface 2 | `#FAFAFA` | `250,250,250` | 二级卡片、输入区 | 消息卡片 |
| Surface 3 | `#F2F4F7` | `242,244,247` | 禁用底、骨架屏 | Disabled 输入框 |
| Border Light | `#EEF0F3` | `238,240,243` | 卡片边框 | 首页卡片 |
| Border Default | `#DDE2E8` | `221,226,232` | 输入框边框 | 表单输入框 |
| Border Strong | `#B8C0CC` | `184,192,204` | 选中边框、分割线 | 上传组件 |
| Text Primary | `#1F2933` | `31,41,51` | 主要文本 | 标题、金额 |
| Text Secondary | `#5E6B78` | `94,107,120` | 次要文本 | 描述、摘要 |
| Text Tertiary | `#8A95A3` | `138,149,163` | 辅助文本 | 时间、占位符 |
| Text Disabled | `#B8C0CC` | `184,192,204` | 禁用文本 | Disabled 按钮 |
| Text Inverse | `#FFFFFF` | `255,255,255` | 深色底文字 | 主按钮文字 |

### 1.4 Semantic Colors

| 语义 | HEX | RGB | 使用场景 | 示例 |
| --- | --- | --- | --- | --- |
| Loan Help | `#35B86B` | `53,184,107` | 出手相助 | “出手相助”入口、业务图标 |
| Emergency Help | `#F7799B` | `247,121,155` | 江湖救急 | “江湖救急”入口、求助氛围 |
| Trust Score | `#3B82F6` | `59,130,246` | 信誉等级 | 信誉分徽标 |
| Growth Level | `#FF9F43` | `255,159,67` | 成长等级 | 成长等级徽标 |
| Reminder | `#F5A400` | `245,164,0` | 到期提醒 | 温馨提醒按钮 |
| Voucher | `#8B6FE8` | `139,111,232` | 凭证 | 上传凭证、凭证预览 |
| Message | `#35B86B` | `53,184,107` | 消息 | 消息 Tab 选中态 |

### 1.5 Dark Mode Colors

| Token | Light HEX | Dark HEX | Dark RGB | 使用场景 |
| --- | --- | --- | --- | --- |
| Background Base | `#F7F8FA` | `#101418` | `16,20,24` | 页面背景 |
| Background Warm | `#FFFBF6` | `#171411` | `23,20,17` | 暖色页面背景 |
| Surface 1 | `#FFFFFF` | `#171C21` | `23,28,33` | 一级卡片 |
| Surface 2 | `#FAFAFA` | `#1E252B` | `30,37,43` | 二级卡片 |
| Border Light | `#EEF0F3` | `#2A323A` | `42,50,58` | 轻边框 |
| Border Default | `#DDE2E8` | `#3A444F` | `58,68,79` | 输入框边框 |
| Text Primary | `#1F2933` | `#F2F5F7` | `242,245,247` | 主要文本 |
| Text Secondary | `#5E6B78` | `#B7C0CA` | `183,192,202` | 次要文本 |
| Text Tertiary | `#8A95A3` | `#7D8996` | `125,137,150` | 辅助文本 |
| Primary 500 | `#35B86B` | `#5ED68D` | `94,214,141` | 暗色主按钮 |
| Error 500 | `#E95555` | `#FF7A7A` | `255,122,122` | 暗色错误状态 |
| Warning 500 | `#F5A400` | `#FFC857` | `255,200,87` | 暗色警告状态 |

---

## 2. Typography System

### 2.1 字体原则

微信小程序优先使用系统字体。中文采用 `PingFang SC`、`Microsoft YaHei`、`HarmonyOS Sans SC` 回退。数字金额建议使用系统等宽数字特性或 `font-variant-numeric: tabular-nums`，保证金额列表对齐。

### 2.2 Type Scale

| 类型 | 字号 px | 字重 | 行高 px | 字间距 | 适用场景 |
| --- | ---: | ---: | ---: | ---: | --- |
| Display | 28 | 700 | 36 | 0 | 年度报告封面、核心金额展示 |
| Heading | 24 | 700 | 32 | 0 | 页面级标题、数据总览标题 |
| Title L | 20 | 600 | 28 | 0 | 卡片组标题、详情页主标题 |
| Title M | 18 | 600 | 26 | 0 | 区块标题、弹窗标题 |
| Title S | 16 | 600 | 24 | 0 | 卡片标题、表单分组标题 |
| Body L | 16 | 400 | 24 | 0 | 正文、表单内容、详情描述 |
| Body M | 15 | 400 | 22 | 0 | 列表摘要、消息正文 |
| Body S | 14 | 400 | 20 | 0 | 辅助说明、卡片次要信息 |
| Caption | 12 | 400 | 18 | 0 | 时间、标签补充、输入提示 |
| Button L | 16 | 600 | 22 | 0 | 大按钮 |
| Button M | 14 | 600 | 20 | 0 | 中小按钮、卡片操作 |
| Amount L | 28 | 700 | 36 | 0 | 大金额 |
| Amount M | 20 | 700 | 28 | 0 | 卡片金额 |

### 2.3 排版规范

| 场景 | 规范 |
| --- | --- |
| 页面标题 | 18 到 20px，居中或左对齐，微信顶部导航优先居中 |
| 卡片标题 | 16px，字重 600，最多一行，超出省略 |
| 金额 | 使用 Amount 样式，金额符号小一号或同号但降低权重 |
| 长文本 | 行高不少于字号的 1.45 倍，避免压迫 |
| 按钮文字 | 不超过 6 个中文字符，必要时使用动宾结构 |
| 表单标签 | 14px 或 15px，字重 500 到 600，必填项使用柔和错误色标记 |

---

## 3. Icon System

### 3.1 图标风格规范

| 项目 | 规范 |
| --- | --- |
| 风格 | 线性为主，少量双色填充用于业务核心入口 |
| 线宽 | 1.75px 到 2px |
| 圆角 | 端点圆角，转角圆润 |
| 视觉气质 | 轻、暖、可信，避免尖锐金融符号 |
| 填充使用 | 仅用于选中态、等级图标、空状态插画 |
| 一致性 | 同一页面内不混用多套图标风格 |

### 3.2 尺寸规范

| 尺寸 | 使用场景 | 点击热区 |
| ---: | --- | --- |
| 16px | 文本内小图标、标签图标 | 不独立点击 |
| 20px | 表单辅助图标、消息类型图标 | 40px 以上 |
| 24px | 常规按钮图标、Tab 图标 | 44px 以上 |
| 32px | 首页业务入口图标、空状态小图标 | 48px 以上 |
| 48px | 空状态插画核心、成长等级大图标 | 64px 以上 |

### 3.3 推荐图标库

| 场景 | 推荐 |
| --- | --- |
| 前端实现 | Lucide Icons、WeUI Icons、TDesign MiniProgram Icons |
| Figma 建库 | Lucide、SF Symbols 参考形态、Material Symbols 参考语义 |
| 业务定制 | 使用统一 24px 网格重新绘制，保持 2px 线宽 |

### 3.4 业务图标定义

| 业务图标 | 语义 | 建议造型 | 主色 |
| --- | --- | --- | --- |
| 出手相助 | 借给好友、主动帮助 | 手掌、伞、叶芽组合 | `#35B86B` |
| 江湖救急 | 发起求助、开口请求 | 对话气泡、星光、救助标记 | `#F7799B` |
| 信誉等级 | 信用、可信记录 | 盾牌、对勾、信芽 | `#3B82F6` |
| 成长等级 | 成长、守约次数 | 幼芽、阶梯、奖章 | `#FF9F43` |
| 提醒 | 到期提醒、温暖提示 | 铃铛、时钟、轻声波纹 | `#F5A400` |
| 凭证 | 图片、证明材料 | 文件、回形针、图片框 | `#8B6FE8` |
| 消息 | 通知、动态 | 气泡、信封、通知点 | `#35B86B` |

---

## 4. Grid System

### 4.1 微信小程序适配方案

| 项目 | 规范 |
| --- | --- |
| 设计稿基准 | 375px 宽，等价微信小程序 750rpx |
| 单位转换 | 1px 约等于 2rpx |
| 最小触控热区 | 44px，等价 88rpx |
| 页面横向边距 | 16px，等价 32rpx |
| 卡片内边距 | 16px 常规，24px 强展示 |
| 列表密度 | 信息型列表 12px 间距，卡片流 16px 间距 |

### 4.2 8pt Grid

系统以 8pt 为主栅格，4pt 作为微调单位。所有间距、圆角、组件高度优先从 spacing token 取值。

| 规则 | 说明 |
| --- | --- |
| 页面边距 | 16px |
| 卡片间距 | 12px 或 16px |
| 区块间距 | 24px |
| 页面大分区 | 32px |
| 按钮高度 | 40px、44px、48px |
| 输入框高度 | 44px、48px |

### 4.3 列系统

| 宽度 | 列数 | 边距 | 槽宽 | 使用场景 |
| --- | ---: | ---: | ---: | --- |
| 320 到 375px | 4 列 | 16px | 8px | 小屏手机 |
| 376 到 430px | 4 列 | 16px | 12px | 主流手机 |
| 431px 以上 | 6 列 | 20px | 12px | 大屏手机、平板小窗 |

### 4.4 布局规范

| 模块 | 规范 |
| --- | --- |
| 首页卡片 | 单列流式布局，卡片宽度撑满内容区 |
| 快捷入口 | 两列布局，出手相助和江湖救急等宽 |
| 统计卡片 | 两列或三列网格，小屏优先两列 |
| 表单页面 | 单列表单，底部固定主操作 |
| 详情页面 | 信息区块纵向排列，状态操作吸底或跟随区块 |

### 4.5 安全区域

| 区域 | 规范 |
| --- | --- |
| 顶部安全区 | 使用微信胶囊按钮适配，标题不与胶囊重叠 |
| 底部安全区 | Tab Bar 和吸底按钮需增加 safe-area inset bottom |
| 滚动区域 | 底部固定操作时，内容区增加 80px 以上底部 padding |
| 弹窗 | 避开底部手势区，底部弹窗圆角 16px 到 20px |

---

## 5. Spacing System

| Token | px | rpx | 使用场景 |
| --- | ---: | ---: | --- |
| Space 4 | 4 | 8 | 图标与文字、小标签内部间距 |
| Space 8 | 8 | 16 | 表单标签与输入框、列表内部小间距 |
| Space 12 | 12 | 24 | 卡片内元素间距、列表项间距 |
| Space 16 | 16 | 32 | 页面边距、卡片内边距、按钮组间距 |
| Space 24 | 24 | 48 | 区块之间、表单分组间距 |
| Space 32 | 32 | 64 | 页面大分区、空状态图文间距 |
| Space 40 | 40 | 80 | 页面顶部氛围区、弹窗内容留白 |
| Space 48 | 48 | 96 | 空状态大留白、年度报告视觉间距 |

---

## 6. Button System

### 6.1 按钮类型

| 类型 | 使用场景 | 高度 | 圆角 | 默认样式 |
| --- | --- | ---: | ---: | --- |
| Primary | 主要提交、发送约定、确认完成 | 48px | 12px | 绿底白字 |
| Secondary | 次级操作、温馨提醒、查看详情 | 44px | 12px | 暖色浅底深字 |
| Ghost | 卡片内轻操作、筛选 | 40px | 10px | 透明底描边 |
| Danger | 删除、拒绝、注销 | 44px | 12px | 红色浅底或红底 |
| Text Button | 链接、辅助动作 | 32px | 8px | 无底色文字 |
| Icon Button | 返回、设置、更多、删除 | 40px | 10px 或圆形 | 图标居中 |

### 6.2 状态规范

| 类型 | Default | Hover | Active | Disabled | Loading |
| --- | --- | --- | --- | --- | --- |
| Primary | `#35B86B` 白字 | `#43C978` | `#249C56` | `#DDE2E8` 灰字 | 左侧 loading，禁重复点击 |
| Secondary | `#FFF6ED` 暖橙字 | `#FFE9D1` | `#FFD9AD` | `#F2F4F7` 灰字 | loading 使用暖橙 |
| Ghost | 透明底灰边 | `#F7F8FA` | `#EEF0F3` | 灰边灰字 | loading 使用当前文字色 |
| Danger | `#FFF0F0` 红字 | `#FFE0E0` | `#FFD0D0` | 灰底灰字 | loading 使用红色 |
| Text Button | 绿色或信息蓝文字 | 浅色底 | 更深文字 | 灰字 | 文案变为“处理中” |
| Icon Button | 透明底深色图标 | 浅灰底 | 较深灰底 | 图标灰 | 图标替换 loading |

### 6.3 按钮文案规范

| 场景 | 推荐文案 | 避免文案 |
| --- | --- | --- |
| 创建出借 | 发送约定 | 放款、借贷提交 |
| 创建求助 | 发送求助 | 申请贷款 |
| 到期提醒 | 温馨提醒 | 催款、催收 |
| 完成 | 确认完成 | 结清债务 |
| 拒绝 | 暂不确认 | 拒贷 |

---

## 7. Card System

### 7.1 通用卡片规范

| 项目 | 规范 |
| --- | --- |
| 背景 | `Surface 1`，暗色模式为 `#171C21` |
| 圆角 | 12px，列表卡片 10px，强情感卡片 16px |
| 边框 | 1px `Border Light` |
| 阴影 | 轻阴影 `0 4px 16px rgba(31, 41, 51, 0.04)` |
| 内边距 | 16px 常规，统计卡片 12px |
| 间距 | 卡片之间 12px 到 16px |

### 7.2 首页卡片

| 模块 | 规范 |
| --- | --- |
| 用户信息卡 | 左侧头像昵称，右侧信誉分与签到状态 |
| 快捷入口卡 | 两列等宽，使用业务色浅底和 32px 图标 |
| 新手引导卡 | 暖色浅底，主按钮引导创建约定 |
| 页面提示 | 底部展示“仅用于约定提醒与情谊守护” |

### 7.3 约定卡片

| 元素 | 规范 |
| --- | --- |
| 标题 | “与某某的约定”或“某某向您求助” |
| 状态标签 | 放在标题行右侧，使用 Tag System |
| 金额 | Amount M，突出但不制造金融压迫 |
| 日期 | 展示约定日、倒计时或逾期天数 |
| 摘要 | 缘由最多 2 行，详情页完整展示 |
| 操作 | 卡片底部最多 2 个主操作，更多进详情 |

### 7.4 消息卡片

| 元素 | 规范 |
| --- | --- |
| 类型图标 | 20px，系统、约定、成长分别使用语义色 |
| 标题 | 14 到 15px，字重 600 |
| 内容 | 最多 2 行，超出省略 |
| 时间 | Caption，右上或底部 |
| 未读 | 左侧小点或标题加粗 |

### 7.5 统计卡片

| 元素 | 规范 |
| --- | --- |
| 数据 | Amount M 或 Title L |
| 标签 | Caption 或 Body S |
| 解读 | 使用温暖提示，避免排名压迫 |
| 布局 | 两列优先，小屏不超过三列 |

### 7.6 成长卡片

| 元素 | 规范 |
| --- | --- |
| 等级图标 | 32px 到 48px |
| 进度 | 绿色进度条或阶梯 |
| 文案 | 强调完成、守约、成长 |
| 色彩 | Primary、Secondary、Growth Level 色 |

---

## 8. Form System

### 8.1 表单布局规范

| 项目 | 规范 |
| --- | --- |
| 页面结构 | 单列纵向，底部固定主按钮 |
| 分组 | 基础信息、凭证信息、补充说明 |
| 标签位置 | 顶部标签优先，复杂表单不使用左侧标签 |
| 必填标识 | 标签后加 `*`，颜色使用 `Error 500` |
| 帮助文本 | 输入框下方，Caption，Text Tertiary |
| 表单间距 | 字段之间 16px，分组之间 24px |

### 8.2 标签规范

| 字段 | 标签示例 | 说明 |
| --- | --- | --- |
| 借款人 | 借款人 | 出手相助页面 |
| 出借人 | 出借人 | 江湖救急页面 |
| 金额 | 金额 | 必填，数字键盘 |
| 还款日期 | 约定还款日 | 必填，日期选择 |
| 缘由 | 借款缘由 | 必填，200 字内 |
| 凭证 | 辅助凭证 | 可选，说明可见范围 |
| 提醒语 | 温馨提醒语 | 出借人填写 |
| 补充说明 | 补充说明 | 借款人填写 |

### 8.3 校验规范

| 字段 | 校验 | 错误文案 |
| --- | --- | --- |
| 借款人或出借人 | 必填 | 请选择好友 |
| 金额 | 必填，大于 0，最多 2 位小数 | 请输入有效金额 |
| 还款日期 | 必填，不早于今天 | 请选择有效还款日期 |
| 借款缘由 | 必填，最多 200 字 | 请填写借款缘由 |
| 辅助凭证 | 文件大小和数量限制 | 凭证上传失败，请重试 |
| 延期原因 | 必填，最多 200 字 | 请填写延期原因 |

### 8.4 错误提示规范

| 层级 | 使用场景 | 形式 |
| --- | --- | --- |
| 字段级 | 单个字段校验失败 | 输入框红边，下方错误文案 |
| 页面级 | 多字段缺失 | Toast 提示“请完善必填信息” |
| 操作级 | 发送失败、网络失败 | Modal 或 Toast，提供重试 |
| 危险操作 | 删除凭证、注销账号 | 二次确认弹窗 |

---

## 9. Input System

### 9.1 金额输入框

| 项目 | 规范 |
| --- | --- |
| 高度 | 48px |
| 键盘 | 数字键盘，支持小数点 |
| 前缀 | `¥`，使用 Text Secondary |
| 字号 | 20px，字重 600 |
| 占位符 | “请输入金额” |
| 校验 | 大于 0，最多两位小数 |

### 9.2 日期选择器

| 项目 | 规范 |
| --- | --- |
| 触发 | 输入框样式加日历图标 |
| 默认值 | 创建时为空，延期时默认原还款日之后 |
| 禁用日期 | 早于今天的日期不可选 |
| 展示格式 | `YYYY-MM-DD`，卡片可展示 `MM-DD` |
| 错误 | 日期无效时显示字段级错误 |

### 9.3 文本输入框

| 项目 | 规范 |
| --- | --- |
| 高度 | 44px 或 48px |
| 圆角 | 10px |
| 边框 | Default 为 `Border Default`，Focus 为 `Primary 500` |
| 占位符 | Text Tertiary |
| 禁用 | Surface 3 背景，Text Disabled |

### 9.4 备注输入框

| 项目 | 规范 |
| --- | --- |
| 高度 | 最小 96px |
| 字数 | 右下角显示计数，如 `0/200` |
| 适用 | 借款缘由、延期原因、补充说明 |
| 输入体验 | 支持换行，超过上限禁止继续输入 |

### 9.5 上传组件

| 项目 | 规范 |
| --- | --- |
| 样式 | 虚线边框上传框，内部使用凭证图标 |
| 尺寸 | 缩略图 72px 到 88px |
| 状态 | 待上传、上传中、上传成功、上传失败 |
| 数量 | 出手相助建议最多 3 张，江湖救急建议最多 5 张 |
| 安全提示 | “凭证仅约定双方可见” |
| 删除 | 删除需二次确认 |

---

## 10. Tag System

### 10.1 状态标签规范

| 状态 | 文案 | 前景色 | 背景色 | 边框色 | 样式 |
| --- | --- | --- | --- | --- | --- |
| WAIT_CONFIRM | 待确认 | `#A96400` | `#FFF8E6` | `#FFE1A3` | 圆角胶囊，时钟图标 |
| WAIT_REPAY | 待还款 | `#1D4ED8` | `#EEF6FF` | `#CFE4FF` | 圆角胶囊，日历图标 |
| APPLY_DELAY | 申请延期 | `#A96400` | `#FFF8E6` | `#FFE1A3` | 圆角胶囊，沙漏图标 |
| OVERDUE | 已逾期 | `#B72E2E` | `#FFF0F0` | `#FFD0D0` | 圆角胶囊，提醒图标 |
| WAIT_FINISH_CONFIRM | 待确认完成 | `#6D4CCF` | `#F4F0FF` | `#DDD2FF` | 圆角胶囊，对勾圆圈图标 |
| FINISHED | 已完成 | `#0F7A3B` | `#ECFDF3` | `#BDEFD0` | 圆角胶囊，对勾图标 |
| REJECT | 已拒绝 | `#5E6B78` | `#F2F4F7` | `#DDE2E8` | 圆角胶囊，减号图标 |
| EXPIRED | 已失效 | `#5E6B78` | `#F2F4F7` | `#DDE2E8` | 圆角胶囊，关闭图标 |

### 10.2 标签尺寸

| 尺寸 | 高度 | 字号 | 内边距 |
| --- | ---: | ---: | --- |
| Small | 22px | 12px | 6px 8px |
| Medium | 26px | 13px | 8px 10px |
| Large | 30px | 14px | 10px 12px |

---

## 11. Badge System

| 类型 | 使用场景 | 规范 |
| --- | --- | --- |
| 数字 Badge | 未读消息数、待处理数量 | 红色或主色圆角，最小 18px，最多显示 `99+` |
| Dot Badge | Tab 未读、卡片未读 | 8px 圆点，使用 Error 500 或 Primary 500 |
| 消息 Badge | 消息分类数量 | 胶囊样式，浅底深字，放在分类标题右侧 |

### 11.1 Badge 状态

| 状态 | 规则 |
| --- | --- |
| 0 | 不展示 |
| 1 到 99 | 展示具体数字 |
| 大于 99 | 展示 `99+` |
| Disabled | 降低透明度到 40% |
| Dark Mode | 使用暗色语义色，保持 4.5:1 对比度 |

---

## 12. Toast System

| 类型 | 图标 | 背景 | 文字 | 使用场景 | 示例文案 |
| --- | --- | --- | --- | --- | --- |
| 成功 | Check | `#1F2933` 90% | 白色 | 保存、发送、完成 | 已发送约定 |
| 失败 | X | `#1F2933` 90% | 白色 | 网络失败、上传失败 | 发送失败，请重试 |
| 警告 | Alert | `#1F2933` 90% | 白色 | 表单缺失、到期提醒 | 请完善必填信息 |
| 信息 | Info | `#1F2933` 90% | 白色 | 普通提示 | 凭证仅双方可见 |

### 12.1 Toast 规范

| 项目 | 规范 |
| --- | --- |
| 位置 | 屏幕中下方，避开 Tab Bar |
| 时长 | 1500ms 到 2200ms |
| 圆角 | 12px |
| 最大宽度 | 页面宽度减 64px |
| 多行 | 最多 2 行 |

---

## 13. Modal System

### 13.1 弹窗类型

| 类型 | 使用场景 | 标题 | 主按钮 | 次按钮 |
| --- | --- | --- | --- | --- |
| 确认弹窗 | 发送约定、提交延期 | 明确动作结果 | 确认发送、提交申请 | 再看看 |
| 删除弹窗 | 删除凭证、清空消息 | 强提醒不可逆 | 确认删除 | 取消 |
| 提示弹窗 | 规则说明、状态解释 | 简短说明 | 我知道了 | 无 |
| 协议弹窗 | 授权、用户协议、隐私政策 | 协议确认 | 同意并继续 | 暂不同意 |

### 13.2 弹窗规范

| 项目 | 规范 |
| --- | --- |
| 宽度 | 屏幕宽度减 64px，最大 320px |
| 圆角 | 16px |
| 内边距 | 24px |
| 标题 | Title M，居中或左对齐 |
| 正文 | Body S 或 Body M，最多 5 行 |
| 按钮布局 | 双按钮横排，危险操作主按钮靠右 |
| 遮罩 | `rgba(0,0,0,0.45)`，暗色模式 `rgba(0,0,0,0.65)` |

---

## 14. Empty State System

| 空状态 | 插画建议 | 文案建议 | 按钮建议 |
| --- | --- | --- | --- |
| 首页空状态 | 叶芽、两张轻卡片、温暖对话气泡 | 暂无约定，第一份温暖可以从这里开始 | 立即出手、发起求助 |
| 消息空状态 | 安静铃铛、信封、浅色圆形背景 | 暂无消息，有新的约定提醒会出现在这里 | 返回首页 |
| 凭证空状态 | 文件夹、回形针、图片框 | 暂无凭证，创建约定时可上传辅助凭证 | 去看约定 |
| 搜索空状态 | 放大镜、纸条、微笑线条 | 没找到相关内容，换个关键词试试 | 清空搜索 |

### 14.1 空状态规范

| 项目 | 规范 |
| --- | --- |
| 插画尺寸 | 120px 到 160px |
| 标题 | 16px，字重 600 |
| 描述 | 14px，Text Secondary |
| 主按钮 | 有明确下一步时展示 |
| 页面位置 | 垂直居中略偏上，避免被 Tab Bar 压住 |

---

## 15. Loading System

| 类型 | 使用场景 | 规范 |
| --- | --- | --- |
| 页面 Loading | 首次进入、核心页面加载 | 居中 loading，加短文案“正在加载” |
| 列表 Loading | 约定列表、消息列表分页 | 列表底部小 loading |
| 按钮 Loading | 提交表单、上传凭证 | 按钮内 loading，禁用重复点击 |

### 15.1 Loading 文案

| 场景 | 文案 |
| --- | --- |
| 首页加载 | 正在整理你的温暖约定 |
| 发送约定 | 正在发送约定 |
| 上传凭证 | 凭证上传中 |
| 生成报告 | 正在生成温暖报告 |

---

## 16. Skeleton System

### 16.1 首页骨架屏

| 区块 | 骨架内容 |
| --- | --- |
| 用户信息 | 圆形头像块、两行文本块、签到按钮块 |
| 快捷入口 | 两个圆角矩形块 |
| 约定列表 | 3 个卡片骨架，每个包含标题、金额、日期、操作块 |

### 16.2 列表骨架屏

| 区块 | 骨架内容 |
| --- | --- |
| 消息列表 | 图标圆块、标题条、摘要条、时间短条 |
| 凭证列表 | 缩略图块、标题条、说明条 |
| 报表列表 | 统计块、图表块、说明条 |

### 16.3 详情页骨架屏

| 区块 | 骨架内容 |
| --- | --- |
| 顶部状态 | 标题条、状态标签块 |
| 金额信息 | 大数字条、日期条 |
| 信息区块 | 多行文本条 |
| 操作区 | 底部按钮块 |

### 16.4 骨架样式

| 项目 | 规范 |
| --- | --- |
| 背景 | `#F2F4F7`，暗色为 `#2A323A` |
| 高光 | 线性渐变扫光 |
| 圆角 | 与真实组件一致 |
| 动画 | 1200ms 循环，低对比度 |

---

## 17. Navigation Bar

### 17.1 顶部导航规范

| 页面类型 | 标题 | 返回 | 右侧操作 |
| --- | --- | --- | --- |
| Tab 页面 | 首页、消息、我的 | 无返回 | 设置或更多可选 |
| 二级页面 | 出手相助、江湖救急、约定详情 | 显示返回 | 可放帮助、更多 |
| 表单页面 | 明确动作标题 | 显示返回 | 不放复杂操作 |
| 详情页面 | 约定详情 | 显示返回 | 更多操作可折叠 |

### 17.2 标题规范

| 项目 | 规范 |
| --- | --- |
| 字号 | 17px 到 18px |
| 字重 | 600 |
| 对齐 | 微信小程序优先居中 |
| 长标题 | 超出省略，不换行 |
| 背景 | 默认白色或页面同色，滚动后可加轻边框 |

---

## 18. Tab Bar

### 18.1 Tab 定义

| Tab | 图标 | 选中态 | 未选中态 | Badge |
| --- | --- | --- | --- | --- |
| 首页 | Home 或 Sprout Home | 图标和文字 `Primary 500` | `Text Tertiary` | 待处理约定可显示 Dot |
| 消息 | Message Circle | 图标和文字 `Primary 500` | `Text Tertiary` | 未读数数字 Badge |
| 我的 | User Circle | 图标和文字 `Primary 500` | `Text Tertiary` | 重要设置提醒 Dot |

### 18.2 Tab Bar 规范

| 项目 | 规范 |
| --- | --- |
| 高度 | 56px 加底部安全区 |
| 图标 | 24px |
| 文案 | 11px 到 12px |
| 背景 | Light 为白色，Dark 为 `Surface 1` |
| 顶部分割线 | `Border Light` |
| 点击反馈 | 轻微缩放 0.98，100ms |

---

## 19. Motion System

### 19.1 动效原则

动效服务于确认感和层级变化，不做娱乐化干扰。关键操作需要有反馈，但不能制造焦虑。

### 19.2 动效规范

| 场景 | 动画 | 时长 | 缓动曲线 |
| --- | --- | ---: | --- |
| 页面切换 | 轻微横向位移加淡入 | 220ms | `cubic-bezier(0.2, 0, 0, 1)` |
| 按钮反馈 | 缩放到 0.98 后恢复 | 100ms | `ease-out` |
| 弹窗出现 | 遮罩淡入，弹窗缩放 0.96 到 1 | 240ms | `cubic-bezier(0.2, 0, 0, 1)` |
| 底部弹层 | 从底部上滑 | 260ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Toast | 淡入加上移 4px | 180ms | `ease-out` |
| 列表刷新 | 骨架到内容淡入 | 180ms | `ease-in-out` |
| 完成反馈 | 对勾轻弹 | 360ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### 19.3 动效限制

| 限制 | 说明 |
| --- | --- |
| 减弱动态 | 跟随系统减少动态设置 |
| 高频操作 | 列表滚动、输入时不使用复杂动画 |
| 错误反馈 | 不使用剧烈抖动，改用字段提示和轻微色彩变化 |

---

## 20. Dark Mode

### 20.1 颜色映射表

| 语义 | Light | Dark |
| --- | --- | --- |
| 页面背景 | `#F7F8FA` | `#101418` |
| 暖页面背景 | `#FFFBF6` | `#171411` |
| 一级卡片 | `#FFFFFF` | `#171C21` |
| 二级卡片 | `#FAFAFA` | `#1E252B` |
| 主文本 | `#1F2933` | `#F2F5F7` |
| 次文本 | `#5E6B78` | `#B7C0CA` |
| 辅助文本 | `#8A95A3` | `#7D8996` |
| 边框 | `#DDE2E8` | `#3A444F` |
| 主色 | `#35B86B` | `#5ED68D` |
| 成功 | `#22A65A` | `#5ED68D` |
| 警告 | `#F5A400` | `#FFC857` |
| 错误 | `#E95555` | `#FF7A7A` |
| 信息 | `#3B82F6` | `#7CB2FF` |

### 20.2 组件适配规则

| 组件 | Dark Mode 规则 |
| --- | --- |
| 页面 | 背景使用 Dark Background，避免纯黑 |
| 卡片 | 使用 Dark Surface，边框降低亮度 |
| 按钮 | 主按钮提高亮度，禁用态保持低对比 |
| 输入框 | 背景使用 Surface 2，Focus 边框用暗色主色 |
| 标签 | 背景降低透明度，文字使用对应亮色 |
| 弹窗 | 遮罩加深，弹窗使用 Surface 1 |
| Toast | 背景可使用 `#F2F5F7` 90%，文字改深色，或沿用深底白字 |
| 图标 | 普通图标使用 Text Secondary，业务图标使用语义亮色 |

---

## 21. Design Token

### 21.1 Token 命名规范

| 层级 | 示例 | 说明 |
| --- | --- | --- |
| Primitive | `color.green.500` | 基础色值，不直接绑定业务 |
| Semantic | `color.primary.default` | 语义化色值，用于组件 |
| Component | `button.primary.bg.default` | 组件级 token |
| Mode | `light.color.bg.page` | 按主题模式区分 |

### 21.2 JSON 结构

```json
{
  "color": {
    "primitive": {
      "green": {
        "50": "#EEF9F2",
        "100": "#D8F1E2",
        "300": "#8DD8AA",
        "500": "#35B86B",
        "600": "#249C56",
        "700": "#167A42"
      },
      "orange": {
        "50": "#FFF6ED",
        "100": "#FFE9D1",
        "400": "#FFB56B",
        "500": "#FF9F43"
      },
      "pink": {
        "50": "#FFF1F5",
        "400": "#F7799B"
      },
      "red": {
        "50": "#FFF0F0",
        "500": "#E95555",
        "700": "#B72E2E"
      },
      "blue": {
        "50": "#EEF6FF",
        "500": "#3B82F6",
        "700": "#1D4ED8"
      },
      "gray": {
        "50": "#F7F8FA",
        "100": "#F2F4F7",
        "200": "#EEF0F3",
        "300": "#DDE2E8",
        "500": "#8A95A3",
        "700": "#5E6B78",
        "900": "#1F2933"
      }
    },
    "semantic": {
      "primary": {
        "default": "#35B86B",
        "hover": "#43C978",
        "active": "#249C56",
        "soft": "#EEF9F2"
      },
      "success": {
        "default": "#22A65A",
        "soft": "#ECFDF3",
        "strong": "#0F7A3B"
      },
      "warning": {
        "default": "#F5A400",
        "soft": "#FFF8E6",
        "strong": "#A96400"
      },
      "error": {
        "default": "#E95555",
        "soft": "#FFF0F0",
        "strong": "#B72E2E"
      },
      "info": {
        "default": "#3B82F6",
        "soft": "#EEF6FF",
        "strong": "#1D4ED8"
      },
      "bg": {
        "page": "#F7F8FA",
        "warm": "#FFFBF6",
        "surface": "#FFFFFF",
        "surfaceMuted": "#FAFAFA"
      },
      "text": {
        "primary": "#1F2933",
        "secondary": "#5E6B78",
        "tertiary": "#8A95A3",
        "disabled": "#B8C0CC",
        "inverse": "#FFFFFF"
      },
      "border": {
        "light": "#EEF0F3",
        "default": "#DDE2E8",
        "strong": "#B8C0CC"
      }
    }
  },
  "typography": {
    "display": { "fontSize": 28, "fontWeight": 700, "lineHeight": 36, "letterSpacing": 0 },
    "heading": { "fontSize": 24, "fontWeight": 700, "lineHeight": 32, "letterSpacing": 0 },
    "titleL": { "fontSize": 20, "fontWeight": 600, "lineHeight": 28, "letterSpacing": 0 },
    "titleM": { "fontSize": 18, "fontWeight": 600, "lineHeight": 26, "letterSpacing": 0 },
    "titleS": { "fontSize": 16, "fontWeight": 600, "lineHeight": 24, "letterSpacing": 0 },
    "bodyM": { "fontSize": 15, "fontWeight": 400, "lineHeight": 22, "letterSpacing": 0 },
    "caption": { "fontSize": 12, "fontWeight": 400, "lineHeight": 18, "letterSpacing": 0 },
    "buttonM": { "fontSize": 14, "fontWeight": 600, "lineHeight": 20, "letterSpacing": 0 }
  },
  "spacing": {
    "4": 4,
    "8": 8,
    "12": 12,
    "16": 16,
    "24": 24,
    "32": 32,
    "40": 40,
    "48": 48
  },
  "radius": {
    "sm": 8,
    "md": 10,
    "lg": 12,
    "xl": 16,
    "round": 999
  },
  "shadow": {
    "card": "0 4px 16px rgba(31, 41, 51, 0.04)",
    "modal": "0 16px 48px rgba(31, 41, 51, 0.16)"
  },
  "motion": {
    "durationFast": 100,
    "durationBase": 180,
    "durationSlow": 260,
    "easeStandard": "cubic-bezier(0.2, 0, 0, 1)",
    "easeSpring": "cubic-bezier(0.34, 1.56, 0.64, 1)"
  }
}
```

### 21.3 Figma Variables 结构

```text
HuanLeMe Variables
├─ Color
│  ├─ Primitive
│  │  ├─ Green / 50 100 300 500 600 700
│  │  ├─ Orange / 50 100 400 500
│  │  ├─ Pink / 50 400
│  │  ├─ Red / 50 500 700
│  │  ├─ Blue / 50 500 700
│  │  └─ Gray / 50 100 200 300 500 700 900
│  ├─ Semantic
│  │  ├─ Primary / Default Hover Active Soft
│  │  ├─ Success / Default Soft Strong
│  │  ├─ Warning / Default Soft Strong
│  │  ├─ Error / Default Soft Strong
│  │  ├─ Info / Default Soft Strong
│  │  ├─ Background / Page Warm Surface SurfaceMuted
│  │  ├─ Text / Primary Secondary Tertiary Disabled Inverse
│  │  └─ Border / Light Default Strong
│  └─ Component
│     ├─ Button / Primary Secondary Ghost Danger Text
│     ├─ Tag / WaitConfirm WaitRepay ApplyDelay Overdue WaitFinish Finished Reject Expired
│     ├─ Card / Background Border Shadow
│     └─ Input / Background Border Focus Error Disabled
├─ Typography
│  ├─ Display
│  ├─ Heading
│  ├─ Title / L M S
│  ├─ Body / L M S
│  ├─ Caption
│  └─ Button / L M
├─ Number
│  ├─ Spacing / 4 8 12 16 24 32 40 48
│  ├─ Radius / sm md lg xl round
│  └─ Size / icon16 icon20 icon24 icon32 icon48
└─ Mode
   ├─ Light
   └─ Dark
```

### 21.4 CSS Variables 结构

```css
:root {
  --hlm-color-primary: #35b86b;
  --hlm-color-primary-hover: #43c978;
  --hlm-color-primary-active: #249c56;
  --hlm-color-primary-soft: #eef9f2;

  --hlm-color-success: #22a65a;
  --hlm-color-success-soft: #ecfdf3;
  --hlm-color-warning: #f5a400;
  --hlm-color-warning-soft: #fff8e6;
  --hlm-color-error: #e95555;
  --hlm-color-error-soft: #fff0f0;
  --hlm-color-info: #3b82f6;
  --hlm-color-info-soft: #eef6ff;

  --hlm-bg-page: #f7f8fa;
  --hlm-bg-warm: #fffbf6;
  --hlm-bg-surface: #ffffff;
  --hlm-bg-surface-muted: #fafafa;

  --hlm-text-primary: #1f2933;
  --hlm-text-secondary: #5e6b78;
  --hlm-text-tertiary: #8a95a3;
  --hlm-text-disabled: #b8c0cc;
  --hlm-text-inverse: #ffffff;

  --hlm-border-light: #eef0f3;
  --hlm-border-default: #dde2e8;
  --hlm-border-strong: #b8c0cc;

  --hlm-space-4: 4px;
  --hlm-space-8: 8px;
  --hlm-space-12: 12px;
  --hlm-space-16: 16px;
  --hlm-space-24: 24px;
  --hlm-space-32: 32px;
  --hlm-space-40: 40px;
  --hlm-space-48: 48px;

  --hlm-radius-sm: 8px;
  --hlm-radius-md: 10px;
  --hlm-radius-lg: 12px;
  --hlm-radius-xl: 16px;
  --hlm-radius-round: 999px;

  --hlm-shadow-card: 0 4px 16px rgba(31, 41, 51, 0.04);
  --hlm-shadow-modal: 0 16px 48px rgba(31, 41, 51, 0.16);

  --hlm-motion-fast: 100ms;
  --hlm-motion-base: 180ms;
  --hlm-motion-slow: 260ms;
  --hlm-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --hlm-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

[data-theme="dark"] {
  --hlm-bg-page: #101418;
  --hlm-bg-warm: #171411;
  --hlm-bg-surface: #171c21;
  --hlm-bg-surface-muted: #1e252b;

  --hlm-text-primary: #f2f5f7;
  --hlm-text-secondary: #b7c0ca;
  --hlm-text-tertiary: #7d8996;
  --hlm-border-light: #2a323a;
  --hlm-border-default: #3a444f;

  --hlm-color-primary: #5ed68d;
  --hlm-color-success: #5ed68d;
  --hlm-color-warning: #ffc857;
  --hlm-color-error: #ff7a7a;
  --hlm-color-info: #7cb2ff;
}
```

### 21.5 小程序 Token 使用建议

| 平台 | 建议 |
| --- | --- |
| 微信小程序原生 | 使用 `app.wxss` 定义 CSS 变量，组件内通过 `var()` 引用 |
| UniApp | 在 `uni.scss` 中同步 token，生成主题变量 |
| Taro | 使用 CSS Variables 或 JS theme object 双轨 |
| React | 使用 token JSON 生成 CSS Variables 和 TypeScript 类型 |
| Vue | 使用 token JSON 生成 SCSS map 或 CSS Variables |
| Figma | 使用 Variables 建立 Light 和 Dark 两套 mode |

---

## 22. 组件落地检查表

| 组件 | Loading | Empty | Error | Success | Disabled | Dark Mode |
| --- | --- | --- | --- | --- | --- | --- |
| Button | 是 | 不适用 | 是 | 是 | 是 | 是 |
| Card | 是 | 是 | 是 | 是 | 是 | 是 |
| Form | 是 | 不适用 | 是 | 是 | 是 | 是 |
| Input | 是 | 不适用 | 是 | 是 | 是 | 是 |
| Tag | 不适用 | 不适用 | 是 | 是 | 是 | 是 |
| Badge | 不适用 | 数量 0 隐藏 | 不适用 | 不适用 | 是 | 是 |
| Toast | 不适用 | 不适用 | 是 | 是 | 不适用 | 是 |
| Modal | 是 | 不适用 | 是 | 是 | 是 | 是 |
| Empty State | 不适用 | 是 | 可恢复错误 | 可引导成功动作 | 不适用 | 是 |
| Navigation | 是 | 不适用 | 不适用 | 不适用 | 是 | 是 |
| Tab Bar | 不适用 | 不适用 | 不适用 | 不适用 | 是 | 是 |

---

## 23. 版本边界

| 项目 | V1.0 是否包含 | 说明 |
| --- | --- | --- |
| MVP 页面组件 | 包含 | 首页、消息、我的、创建页、详情页、延期页 |
| 扩展页面组件 | 规范包含 | 账本、报表、年度报告作为后续规划复用系统 |
| API 规范 | 不包含 | 后续由接口文档承接 |
| 数据库 ER | 不包含 | 后续由技术方案承接 |
| 高保真页面 | 不包含 | 本文档用于搭建 Figma 组件库和页面原型前置规范 |
