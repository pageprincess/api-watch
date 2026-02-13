# APIWatch 产品规格说明书

**版本**: 1.0
**日期**: 2026-02-13
**作者**: Don Norman (product-norman)
**状态**: MVP 定义

---

## 1. 产品概述

### 1.1 产品定义

**APIWatch 是 API 破坏性变更的 Canary 部署**——在第三方 API 变更破坏你的应用前，主动检测并告警你。

就像 Canary 部署在代码变更前检测问题，APIWatch 在 API 变更影响用户前检测破坏性修改。

### 1.2 目标用户画像

#### 主要用户：Alex，SaaS 后端工程师

**基本信息**
- 年龄：28-35 岁
- 角色：后端工程师 / Tech Lead
- 团队规模：5-20 人
- 公司类型：B2B SaaS 创业公司

**典型一天**
- 上午：Code Review + 处理 Jira 工单
- 下午：功能开发 + 第三方 API 集成
- 晚上：On-call 轮值（每 2 周一次）

**痛点场景**
> "凌晨 3 点 PagerDuty 响了。Stripe API 悄悄废弃了一个字段，我们的支付流程中断了 4 小时。客户投诉邮件堆满了收件箱。我和团队花了整晚修复。如果有人提前告诉我们 API 要改，这一切都不会发生。"

**核心需求**
- 监控 5-15 个第三方 API（Stripe、GitHub、Slack、OpenAI 等）
- 需要在 API 变更影响生产前知道
- 团队协作（至少 3 人需要看到告警）
- 不想花时间配置复杂工具

**预算权限**
- 可以自主决策 $100/月以内的工具
- 超过 $100 需要简单向 CEO 说明

**技术背景**
- 熟悉 OpenAPI/Swagger 规范
- 使用 Slack 和邮件作为主要沟通工具
- 讨厌复杂的企业级工具配置

---

#### 次要用户：Sarah，AI/ML 工程师

**基本信息**
- 年龄：26-33 岁
- 角色：ML 工程师
- 团队规模：2-8 人
- 公司类型：AI 应用公司 / LLM 应用开发者

**典型一天**
- 集成多个 AI API（OpenAI、Anthropic、Cohere）
- 实验新模型和端点
- 优化 Prompt 和响应质量

**痛点场景**
> "OpenAI 推出新模型，但 API 端点参数变了。我们的生产应用开始返回错误。因为没有 changelog 订阅，我们是从用户投诉中发现的。"

**核心需求**
- 监控 AI API 变更（模型参数、响应格式）
- 快速实验新端点
- 社区驱动（分享监控配置）

**预算权限**
- 个人项目或小团队，预算 $0-50/月
- 优先免费工具，付费需明显价值

**技术背景**
- 高度技术敏感度
- 活跃在 Reddit/r/LocalLLaMA、Hacker News
- 早期技术采用者

---

#### 早期采用者：Jason，独立开发者

**基本信息**
- 年龄：24-30 岁
- 角色：全栈独立开发者
- 项目数量：3-5 个 Side Projects

**痛点场景**
> "我的小工具依赖 GitHub API。他们悄悄改了 rate limit 响应头，我的应用开始崩。我只有一个人，没时间手动检查所有依赖的 API。"

**核心需求**
- 免费/低价工具（$0-20/月）
- 监控 1-3 个关键 API
- 社区可见性（Twitter、Product Hunt）

**价值**
- 种子用户，帮助产品验证
- 口碑传播，在开发者社区有影响力
- 部分会成长为付费团队用户

---

### 1.3 核心价值主张

| 对比维度 | 传统监控工具 | APIWatch |
|----------|--------------|----------|
| **监控时机** | 宕机后告警（被动） | 变更前告警（主动） |
| **检测内容** | 可用性（200 vs 500） | 契约变更（结构差异） |
| **告警噪音** | 高（阈值误报） | 低（只报破坏性变更） |
| **设置成本** | 高（配置规则） | 低（输入 URL 即可） |
| **定价模型** | 按主机/调用（不可预测） | 按 API 数量（可预测） |
| **目标用户** | 运维团队 | 后端工程师 |

**一句话价值**：
> "在 API 变更让你的用户报警之前，APIWatch 先通知你。"

---

## 2. 功能规格（MVP）

### 2.1 MVP 功能列表

基于 CEO 决策，MVP 包含 5 个核心功能。每个功能以下列格式描述：

```
### 功能 X: [名称]

**用户故事**: 作为[用户角色]，我想要[行为]，以便[目标]

**验收标准**:
- Given [前置条件]
- When [触发条件]
- Then [预期结果]

**心智模型检查**: [用户对该功能的认知模型]
**可用性风险**: [潜在可用性问题及缓解方案]
```

---

### 功能 1: 破坏性变更检测引擎

**用户故事**: 作为 Alex，我想要系统自动区分破坏性变更和非破坏性变更，以便我只在真正需要修复时收到告警。

**核心能力**：
- 监控 OpenAPI 规范（Swagger/JSON/YAML）
- 比较新旧版本的差异
- 智能分类变更类型：
  - **破坏性**（Breaking）→ 必须告警
  - **兼容性**（Non-breaking）→ 记录但不告警
  - **不确定**（Unknown）→ 默认不告警，用户可配置

**破坏性变更规则**（基于 oasdiff 标准）：

| 变更类型 | 示例 | 破坏性？ |
|----------|------|----------|
| 删除端点 | `DELETE /users/{id}` | ✅ 破坏性 |
| 删除必填参数 | 移除 `required: true` 的参数 | ✅ 破坏性 |
| 删除响应字段 | 响应 JSON 移除字段 | ✅ 破坏性 |
| 修改参数类型 | `integer` → `string` | ✅ 破坏性 |
| 添加必填参数 | 新增 `required: true` 的参数 | ✅ 破坏性 |
| 新增端点 | `POST /webhooks` | ❌ 非破坏性 |
| 新增可选参数 | 添加非必填参数 | ❌ 非破坏性 |
| 新增响应字段 | 响应 JSON 添加字段 | ❌ 非破坏性 |
| 添加描述 | 更新 `description` | ❌ 非破坏性 |

**验收标准**：
- Given 已配置 Stripe API 监控
- When Stripe OpenAPI 规范变更
  - 删除了 `v1/charges/:id` 端点
  - 新增了 `v2/charges` 端点
- Then 系统检测到 1 个破坏性变更（删除端点）
- And 告警发送到用户邮箱
- And 新端点变更被记录但不触发告警

**心智模型检查**：
- 用户期望："系统能像 Code Review 那样识别危险变更"
- 用户不理解："什么算破坏性？" → 需要在 UI 中明确展示检测规则
- 设计策略：在首次设置时显示"我们会检测什么"的示例

**可用性风险**：
- **风险**：用户不理解为何某变更被标记为"破坏性"
- **缓解**：在告警邮件中显示变更对照视图（Before vs After）
- **风险**：误报导致用户忽略告警
- **缓解**：允许用户"标记为非破坏性"，系统学习（未来版本）

---

### 功能 2: REST API 监控（OpenAPI/Swagger）

**用户故事**: 作为 Alex，我想要提供一个 OpenAPI URL，系统就能开始监控，以便我不需要手动配置每个端点。

**支持的输入格式**：
1. **OpenAPI URL**（最简单）
   - 示例：`https://stripe.com/openapi.yaml`
   - 系统定期拉取最新版本

2. **OpenAPI JSON/YAML 粘贴**
   - 用户粘贴规范内容
   - 用于无公开 URL 的内部 API

3. **GitHub/GitLab 仓库集成**（未来版本）
   - 自动追踪仓库中的 `openapi.yaml` 变更

**监控频率**（按计划）：

| 计划 | 检查频率 |
|------|----------|
| Free | 每日 1 次 |
| Starter | 每小时 1 次 |
| Pro | 每 15 分钟 1 次 |
| Enterprise | 自定义 |

**验收标准**：
- Given 用户是 Starter 计划
- When 用户添加 Stripe API（输入 URL：`https://stripe.com/openapi.yaml`）
- Then 系统验证 URL 可访问（HTTP 200）
- And 系统立即执行首次检查
- And 系统记录当前 OpenAPI 规范为基准版本
- And 系统显示"监控已启动，下次检查：1 小时后"

**心智模型检查**：
- 用户期望："我给 URL，你负责拉取"
- 用户担心："你们会频繁请求我的 API 吗？" → 明确说明只拉取规范，不调用业务端点
- 设计策略：在添加 API 时显示"我们做什么"说明

**可用性风险**：
- **风险**：用户提供的 URL 返回 404/403，但不知道原因
- **缓解**：实时验证 URL，失败时显示具体错误（404 → "文件不存在"，403 → "需要身份验证"）
- **风险**：用户混淆"监控 OpenAPI"和"调用 API 端点"
- **缓解**：在 UI 中明确说明"我们读取 API 文档，不调用 API"

---

### 功能 3: 告警系统（邮件 + Slack）

**用户故事**: 作为 Alex，我想要在 Slack 和邮箱收到告警，以便我不需要额外登录另一个系统。

**告警渠道**：

#### 邮件告警（所有计划）

**邮件内容**：
```
Subject: ⚠️ [APIWatch] Stripe API 检测到破坏性变更

Hi Alex,

Stripe API 在 2026-02-13 14:30 UTC 发生了破坏性变更。

变更摘要：
- 破坏性变更：1 个
- 非破坏性变更：3 个

破坏性详情：
[❌ BREAKING] 端点已删除: DELETE /v1/charges/:id
影响：你的代码中若有调用此端点，将在生产环境中失败

查看完整变更报告：https://apiwatch.com/monitors/stripe/changes/123

---
你收到此邮件是因为你订阅了 Stripe API 监控。
不想收到？[退订此监控](https://apiwatch.com/unsubscribe/xxx)
```

**设计原则**：
- 标题清晰（工具名 + API 名 + 变更类型）
- 摘要先（最关键信息）
- 详细信息可展开查看
- 一键退订（尊重用户）

#### Slack 告警（Starter 及以上）

**Slack 消息格式**：
```
⚠️ Stripe API 检测到破坏性变更

破坏性变更：1 个
查看详情：https://apiwatch.com/monitors/stripe/changes/123

❌ BREAKING: 端点已删除
DELETE /v1/charges/:id
影响：你的代码中若有调用此端点，将在生产环境中失败

---
监控项目：Production - Stripe
检测时间：2026-02-13 14:30 UTC
```

**Slack 集成设置**：
1. 用户点击"添加 Slack"
2. OAuth 授权（APIWatch 请求 `chat:write` 权限）
3. 用户选择目标频道（如 `#api-alerts`）
4. 系统发送测试消息验证

**验收标准**：
- Given Stripe API 检测到破坏性变更
- And 用户配置了邮件和 Slack 告警
- When 告警触发
- Then 邮件在 5 分钟内送达
- And Slack 消息在 2 分钟内发送
- And 邮件和 Slack 内容一致
- And Slack 消息可点击查看详细变更

**心智模型检查**：
- 用户期望："告警应该像 PagerDuty 一样，但少一点噪音"
- 用户担心："我会被邮件淹没吗？" → 承诺"只告警破坏性变更"
- 设计策略：首次告警后询问"此告警是否有用？"（反馈循环）

**可用性风险**：
- **风险**：Slack OAuth 权限请求吓退用户
- **缓解**：明确说明"我们只需要发送消息权限，不会读取你的频道"
- **风险**：用户收不到邮件（垃圾邮件过滤）
- **缓解**：发送后立即显示"请检查垃圾邮件文件夹"提示
- **风险**：Slack 消息被忽略（频道太吵）
- **缓解**：推荐用户创建专门的 `#api-alerts` 频道

---

### 功能 4: 单一端点监控模板

**用户故事**: 作为 Alex，我想要从预设模板选择常见 API，以便我不需要手动查找和输入 OpenAPI URL。

**预置模板**（MVP 版本）：

| API 名称 | OpenAPI URL | 典型用户 |
|----------|-------------|----------|
| Stripe | `https://stripe.com/openapi.yaml` | 支付集成 |
| GitHub REST API | `https://api.github.com/openapi.yaml` | DevOps 工具 |
| Slack API | `https://api.slack.com/openapi.yaml` | 通信集成 |
| OpenAI API | `https://openai.com/openapi.yaml` | AI/ML 工程师 |
| Twilio API | `https://twilio.com/openapi.yaml` | 通信服务 |

**用户流程**：
1. 用户点击"添加监控"
2. 显示"从模板选择"选项
3. 用户选择"Stripe"
4. 系统预填充名称和 URL
5. 用户点击"开始监控"

**验收标准**：
- Given 用户点击"添加监控"
- When 用户看到模板列表
- Then 显示至少 5 个常见 API 模板
- And 每个模板显示 API 名称和图标
- And 用户点击模板后，名称和 URL 自动填充
- And 用户可以修改 URL（应对自定义端点）

**心智模型检查**：
- 用户期望："像选择编程语言那样简单"
- 用户不期望："我要手动找每个 API 的文档 URL"
- 设计策略：模板列表用搜索框，用户可快速找到（如输入"pay" → 显示 Stripe）

**可用性风险**：
- **风险**：用户找不到模板入口
- **缓解**：在"添加监控"页面，模板是默认选项，而非隐藏在"高级"选项下
- **风险**：模板 URL 过期
- **缓解**：定期验证模板 URL，失败时标记为"暂时不可用"

---

### 功能 5: 免费层 + 单一付费计划

**用户故事**: 作为 Jason（独立开发者），我想要免费监控 1 个 API，以便验证产品价值后再付费。

**计划对比**（CEO 决策版本）：

| 功能 | Free | Starter | Pro | Enterprise |
|------|-------|---------|-----|------------|
| **价格** | $0 | $29/月 | $99/月 | $299+/月 |
| API 监控数量 | 1 | 5 | 25 | 无限 |
| 检查频率 | 每日 | 每小时 | 每 15 分钟 | 自定义 |
| 邮件告警 | ✅ | ✅ | ✅ | ✅ |
| Slack 告警 | ❌ | ✅ | ✅ | ✅ |
| Webhook 告警 | ❌ | ❌ | ✅ | ✅ |
| 变更历史 | 30 天 | 无限 | 无限 | 无限 |
| 团队用户 | 1 | 3 | 10 | 无限 |
| 模板访问 | ✅ | ✅ | ✅ | ✅ |
| 自定义规则 | ❌ | ❌ | ✅ | ✅ |

**升级触发设计**（渐进式披露）：

用户在 Free 层达到限制时，系统显示升级提示：

```
You've reached the 1 API limit.

Upgrade to Starter ($29/month):
✓ Monitor up to 5 APIs
✓ Hourly checks (vs daily)
✓ Slack alerts included

[Upgrade Now]  [Maybe Later]
```

**设计原则**：
- 不在用户注册时立即推销付费
- 等用户感受到价值后再提示升级
- 透明定价（无隐藏费用）

**验收标准**：
- Given Free 用户已添加 1 个 API
- When 用户尝试添加第 2 个 API
- Then 系统显示升级提示（显示 Starter 的优势）
- And 用户可以选择"升级"或"取消"
- And 升级后立即解锁功能（无需等待）

**心智模型检查**：
- 用户期望："我能先用，满意再付费"
- 用户讨厌："注册 5 分钟后就催我付费"
- 设计策略：Free 层用户首次登录后，只显示"欢迎使用"，不显示升级按钮

**可用性风险**：
- **风险**：用户不知道 Free 层有 1 API 限制
- **缓解**：在添加第 1 个 API 时显示"这是 Free 层的 1/1 API"
- **风险**：升级流程复杂（需要重新输入信用卡）
- **缓解**：使用 Stripe Billing，支持"一键升级"

---

## 3. 用户体验设计

### 3.1 注册流程（最多 3 步）

#### 设计原则：渐进式披露

不在注册时要求过多信息。先让用户体验价值，再补充信息。

---

**Step 1: 输入邮箱（必须）**

```
┌─────────────────────────────────────┐
│  APIWatch                           │
│  ────────────────────────           │
│                                     │
│  Monitor your APIs,                 │
│  before they break your app.        │
│                                     │
│  [Email Input Box]                  │
│                                     │
│  [Get Started Free →]               │
│                                     │
│  No credit card required.           │
└─────────────────────────────────────┘
```

**行为**：
- 用户输入邮箱
- 点击"Get Started Free"
- 系统发送验证邮件

**为什么这么简单**：
- 降低试用门槛
- 邮箱作为唯一身份标识（不需要密码，用 Magic Link 登录）

---

**Step 2: 验证邮箱（自动跳转）**

用户点击邮件中的"Verify Email"链接，自动登录到 Dashboard。

**为什么用 Magic Link**：
- 不需要设置密码（减少认知负担）
- 不需要记住凭证（用邮箱登录即可）
- 安全性高（链接 1 小时过期）

---

**Step 3: 添加第一个 API（看到价值）**

用户登录后立即看到"添加 API"界面：

```
┌─────────────────────────────────────┐
│  Welcome to APIWatch! 🎉            │
│                                     │
│  Let's add your first API monitor.  │
│                                     │
│  Option 1: Choose a template        │
│  [Stripe]  [GitHub]  [Slack]        │
│  [OpenAI]  [Twilio]  [More →]       │
│                                     │
│  Option 2: Enter OpenAPI URL        │
│  [https://api.example.com/openapi...]│
│                                     │
│  [Start Monitoring →]               │
└─────────────────────────────────────┘
```

**行为**：
- 用户选择"Stripe"模板
- 点击"Start Monitoring"
- 系统显示"Monitoring started! Check back in 1 hour."

---

#### 整体注册流程时间：**< 2 分钟**

| 步骤 | 时间 |
|------|------|
| 输入邮箱 | 10 秒 |
| 验证邮箱 | 30 秒（检查邮件） |
| 添加 API | 60 秒（选择模板） |
| **总计** | **< 2 分钟** |

---

### 3.2 首次使用流程（5 分钟看到价值）

#### "Time to First Aha!": **5 分钟**

用户从注册到看到产品价值的全程设计：

---

**Minute 0-1: 注册**
- 输入邮箱 → 验证 → 登录

---

**Minute 1-3: 添加第一个 API**
- 选择"Stripe"模板
- 点击"Start Monitoring"
- 系统立即执行首次检查（不等待计划周期）

---

**Minute 3-5: 看到 Dashboard**

```
┌─────────────────────────────────────┐
│  Dashboard                          │
│                                     │
│  Your Monitors (1)                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Stripe API                  │   │
│  │ ✅ Healthy                  │   │
│  │ Last check: Just now        │   │
│  │ Breaking changes: 0         │   │
│  │ [View Details]              │   │
│  └─────────────────────────────┘   │
│                                     │
│  [+ Add another monitor]            │
└─────────────────────────────────────┘
```

**用户感受到的价值**：
- "我设置了一个监控，它正在运行"
- "UI 很干净，我知道我在监控什么"
- "下次有变更时我会收到邮件"

---

**Minute 5+: 首次告警（如果有）**

如果用户添加的 API 刚好有变更（演示模式可模拟）：

```
┌─────────────────────────────────────┐
│  ⚠️ Stripe API Breaking Change      │
│                                     │
│  Detected 5 minutes ago             │
│                                     │
│  [View Change Details →]            │
└─────────────────────────────────────┘
```

**用户感受到的价值**：
- "哇，它真的检测到了变更！"
- "告警很清晰，我知道发生了什么"
- "我现在愿意付费了"

---

### 3.3 告警体验：不被打扰但及时收到

#### 告警哲学：**Signal, Not Noise**

基于 Don Norman 的"反馈与映射"原则：
- 每个告警必须有明确的行动指引
- 告警必须是可操作的
- 告警必须是可抑制的（用户可以标记"非破坏性"）

---

#### 告警分级（MVP 只有 1 级）

| 级别 | 描述 | 示例 | 告警方式 |
|------|------|------|----------|
| **CRITICAL** | 破坏性变更 | 端点删除、必填参数删除 | 邮件 + Slack |
| INFO | 非破坏性变更 | 新增端点、新增参数 | Dashboard 显示，不发告警 |

未来版本可扩展：
- WARNING（可能破坏性，需人工确认）
- DEBUG（调试信息）

---

#### 告警抑制机制（防止疲劳）

**场景 1：重复告警**
- API 提供商回滚了变更，然后又应用回来
- 系统在 24 小时内对相同变更只告警一次

**场景 2：维护窗口**
- 用户可设置"暂停告警"（如部署期间）
- 时间段：1 小时、6 小时、24 小时

**场景 3：用户标记**
- 用户可标记某个变更类型为"非破坏性"
- 未来检测到相同变更时不再告警

---

#### 告警反馈循环

每次告警后，系统询问用户：

```
Was this alert helpful?
[Yes, it helped me catch a breaking change]
[No, this wasn't actually breaking]

Your feedback helps us improve.
```

**用途**：
- 训练破坏性检测模型
- 识别误报
- 优化告警规则

---

## 4. 信息架构

### 4.1 核心页面

#### Page 1: Dashboard（首页）

**目标**：用户登录后立即看到所有监控的状态

**信息层级**：
```
Dashboard
├── Summary Cards
│   ├── Total Monitors: 5
│   ├── Healthy: 4
│   ├── Breaking Changes: 1
│   └── Next Check: in 15 minutes
├── Monitor List (卡片视图)
│   ├── [Stripe API - ⚠️ Breaking]
│   ├── [GitHub API - ✅ Healthy]
│   └── [Slack API - ✅ Healthy]
└── Recent Activity (时间线)
    ├── Stripe: Breaking change detected (2 hours ago)
    └── GitHub: Non-breaking change logged (1 day ago)
```

**交互原则**：
- 最重要信息在最上方（Summary Cards）
- 监控列表用卡片（易扫视）
- 状态用颜色编码（✅ 绿色 = 健康，⚠️ 黄色 = 有变更）

---

#### Page 2: Monitor Details（单个监控详情）

**目标**：用户查看某个 API 的详细信息和变更历史

**URL**: `/monitors/:id`

**信息层级**：
```
Stripe API - Monitor Details
├── Status Card
│   ├── Status: ⚠️ Breaking Change Detected
│   ├── Last Check: 2 hours ago
│   ├── Next Check: in 58 minutes
│   └── [Edit] [Pause] [Delete]
├── Configuration
│   ├── OpenAPI URL: https://stripe.com/openapi.yaml
│   ├── Check Frequency: Hourly
│   └── Alert Channels: Email, Slack (#api-alerts)
├── Latest Changes (Accordion)
│   ├── [❌ BREAKING] Endpoint deleted: DELETE /v1/charges/:id
│   ├── [✅ Non-breaking] New endpoint: POST /v2/charges
│   └── [✅ Non-breaking] Added parameter: `metadata`
└── Change History (时间线)
    ├── Feb 13: Breaking change detected
    ├── Feb 10: Non-breaking changes (3)
    └── Feb 5: Monitor created
```

**交互原则**：
- Latest Changes 默认展开（用户最关心）
- Change History 默认折叠（渐进式披露）
- 每个变更可点击查看详细 diff

---

#### Page 3: Settings（账户设置）

**目标**：用户管理账户、计费、团队

**信息层级**：
```
Settings
├── Profile
│   ├── Email: alex@company.com
│   ├── Password: [Change]
│   └── Timezone: UTC-8 (PST)
├── Plan & Billing
│   ├── Current Plan: Starter ($29/month)
│   ├── APIs Used: 3/5
│   ├── [Upgrade to Pro]
│   └── Payment Method: Visa ****4242
├── Team (Pro plan)
│   ├── Members: 3/10
│   ├── [Invite Member]
│   └── [Remove]
└── Notifications
    ├── Email alerts: ✅ Enabled
    ├── Slack alerts: ✅ Enabled (#api-alerts)
    └── Alert frequency: Immediately
```

---

### 4.2 导航结构

#### 顶部导航（Sticky）

```
[APIWatch Logo] [Dashboard] [Monitors] [Settings] [Avatar ▼]
```

**移动端**（响应式）：
```
☰  [APIWatch Logo]        [Avatar]
```

点击 ☰ 显示侧边栏菜单。

---

#### 底部导航（移动端专用）

```
[Dashboard] [Monitors] [Settings]
```

遵循用户对移动应用的期望（底部导航更易触摸）。

---

### 4.3 数据模型

#### 核心 Entity

```
User
├── id: UUID
├── email: string
├── plan: enum (free, starter, pro, enterprise)
├── createdAt: timestamp
└── settings: JSON

Monitor (API 监控项目)
├── id: UUID
├── userId: UUID (外键)
├── name: string (用户自定义，如 "Production - Stripe")
├── openApiUrl: string
├── checkFrequency: enum (daily, hourly, 15min)
├── isActive: boolean
├── lastCheckAt: timestamp
├── nextCheckAt: timestamp
└── createdAt: timestamp

CheckResult (每次检查结果)
├── id: UUID
├── monitorId: UUID (外键)
├── checkedAt: timestamp
├── openApiVersion: string (commit hash)
├── hasBreakingChanges: boolean
├── breakingChangeCount: integer
└── nonBreakingChangeCount: integer

Change (单个变更记录)
├── id: UUID
├── checkResultId: UUID (外键)
├── type: enum (breaking, non_breaking)
├── category: enum (endpoint_deleted, parameter_removed, ...)
├── description: string (人类可读)
├── path: string (如 "/v1/charges/:id")
└── diff: JSON (详细 diff 内容)

AlertChannel (告警渠道)
├── id: UUID
├── userId: UUID (外键)
├── type: enum (email, slack, webhook)
├── config: JSON (如 Slack OAuth token)
└── isActive: boolean

Team (团队，Pro 计划)
├── id: UUID
├── ownerId: UUID
├── name: string
├── memberCount: integer
└── createdAt: timestamp

TeamMember (团队成员)
├── id: UUID
├── teamId: UUID
├── userId: UUID
├── role: enum (owner, member)
└── joinedAt: timestamp
```

---

## 5. 可用性要求

### 5.1 响应时间

| 操作 | 目标 | 最大可接受 |
|------|------|------------|
| 页面加载 | < 1 秒 | < 2 秒 |
| 添加监控（验证 URL） | < 2 秒 | < 5 秒 |
| 执行 OpenAPI 检查 | < 10 秒 | < 30 秒 |
| 发送告警（邮件） | < 5 分钟 | < 15 分钟 |
| 发送告警（Slack） | < 2 分钟 | < 5 分钟 |

**为什么这些数字**：
- 页面加载 < 2 秒是用户感知"流畅"的阈值
- 邮件 5 分钟是"及时通知"vs"迟到通知"的分界线
- Slack 2 分钟符合实时沟通的期望

---

### 5.2 可用性（SLA）

| 计划 | Uptime 承诺 |
|------|-------------|
| Free / Starter / Pro | 99.5% (每月最多停机 3.6 小时) |
| Enterprise | 99.9% (每月最多停机 43 分钟) |

**为什么 99.5%**：
- MVP 阶段，成本优先
- 99.5% 是小型 SaaS 的标准
- 可在后续版本提升到 99.9%

---

### 5.3 错误处理

#### 原则：**Never Show Stack Traces to Users**

所有错误都转化为用户可理解的语言。

---

#### 错误类型与处理

**类型 1: OpenAPI URL 不可访问**

```
Error: 无法访问 OpenAPI URL

可能的原因：
- URL 返回 404（文件不存在）
- URL 需要 API 密钥
- 服务器返回 500 错误

建议操作：
1. 检查 URL 是否正确
2. 在浏览器中打开 URL 验证
3. 联系 API 提供商

[重试] [修改 URL]
```

**类型 2: OpenAPI 格式无效**

```
Error: OpenAPI 格式无效

详情：
- 文件不是有效的 JSON/YAML
- 缺少必需字段: "info.title"

建议操作：
1. 在 [OpenAPI Lint](https://lint.openapi.io/) 验证格式
2. 联系 API 提供商更新文档

[使用其他格式] [跳过此 API]
```

**类型 3: 告警发送失败**

```
Warning: 告警发送失败

详情：
- Slack 告警失败（token 已过期）
- 邮件告警已发送

建议操作：
1. 重新连接 Slack 账户
2. 检查 Slack 应用权限

[重新连接 Slack]
```

---

#### 全局错误页

当系统级错误发生时（如数据库宕机）：

```
┌─────────────────────────────────────┐
│  😅 出错了                           │
│                                     │
│  我们正在努力修复问题。              │
│  预计恢复时间：15 分钟              │
│                                     │
│  [刷新页面]  [查看状态页]           │
│                                     │
│  抱歉给您带来不便！                  │
└─────────────────────────────────────┘
```

**链接到状态页**：`status.apiwatch.com`（独立托管）

---

## 6. 成功指标

### 6.1 Week 1 目标（软启动）

| 指标 | 目标 | 为什么重要 |
|------|------|------------|
| **注册用户** | 50 | 验证社区兴趣 |
| **添加监控的用户** | 30 (60%) | 验证产品价值 |
| **收到首次告警的用户** | 10 (20%) | 验证检测引擎工作 |
| **首次告警后返回的用户** | 8 (80%) | 验证告警有用 |

**不要过度优化**：Week 1 是验证市场，不是追求增长。

---

### 6.2 Month 1 目标（PMF 验证）

| 指标 | 目标 | 为什么重要 |
|------|------|------------|
| **注册用户** | 500 | 社区牵引力 |
| **活跃用户** | 150 (30%) | 用户留存 |
| **付费用户** | 15 (3%) | 变现验证 |
| **用户推荐率 (NPS)** | > 40 | 产品-市场匹配 |

**PMF 信号**：
- 3% 付费转化率（SaaS 标准是 2-5%）
- NPS > 40（正向口碑）
- 用户主动推荐（Twitter/Reddit）

---

### 6.3 核心指标定义

#### Activation Rate（激活率）

**定义**：注册后添加第一个监控的用户比例

**公式**：
```
Activation Rate = (用户添加了监控数) / (总注册用户数)
```

**目标**：> 60%

**为何重要**：
- 如果用户连监控都不添加，说明产品价值不清晰
- 高激活率 = 注册流程清晰 + 产品价值明确

---

#### Retention Rate（留存率）

**定义**：Week 1 仍活跃的用户比例

**公式**：
```
Week 1 Retention = (Day 7 活跃用户) / (Day 1 注册用户)
```

**目标**：> 40%

**为何重要**：
- 留存 > 40% 是 PMF 的信号
- 如果 < 20%，说明产品是"用一次就扔"的工具

---

#### Conversion Rate（付费转化率）

**定义**：Free → Starter/Pro 转化率

**公式**：
```
Conversion Rate = (付费用户数) / (总注册用户数)
```

**目标**：> 3%（行业标准）

**为何重要**：
- 验证用户愿意付费
- 证明产品有真实价值

---

#### Alert Satisfaction（告警满意度）

**定义**：用户对告警"有帮助"的反馈比例

**公式**：
```
Alert Satisfaction = ("有帮助"反馈数) / (总反馈数)
```

**目标**：> 70%

**为何重要**：
- 验证告警质量
- 识别误报问题

---

### 6.4 反馈收集机制

#### 方式 1: 告警后反馈

每次告警后显示：
```
Was this alert helpful?
[Yes 👍]  [No 👎]
```

#### 方式 2: 取消账户时询问

用户删除账户时：
```
Sorry to see you go! 😢

What could we improve?
[ ] Too expensive
[ ] Not enough features
[ ] Too complicated
[ ] Didn't catch breaking changes
[Other: ____________]

[Submit]  [Skip]
```

#### 方式 3: 季度调查（付费用户）

邮件调查（每 3 个月）：
```
Hi Alex,

We'd love to hear your feedback on APIWatch.

[5-minute survey]

Your input helps us prioritize features.
```

---

## 7. 产品原则总结

### 原则 1: 简单优于复杂 — **5 分钟看到价值**

用户不应该需要阅读文档才能开始使用。

**体现**：
- 注册只需邮箱（无密码）
- 添加监控只需选择模板或输入 URL
- 告警内容清晰，不需要解释

**反例（避免）**：
- 需要配置复杂的告警规则
- 需要理解 OpenAPI 规范语法
- 需要邀请团队成员才能使用

---

### 原则 2: 告警不扰民 — **只告警真正的破坏性变更**

用户已经被 PagerDuty 和 Datadog 的噪音淹没。我们不一样。

**体现**：
- 默认只告警破坏性变更
- 非破坏性变更只记录，不通知
- 用户可以抑制重复告警

**反例（避免）**：
- 每次非破坏性变更都发邮件
- 告警没有明确的行动建议
- 用户需要手动过滤告警

---

### 原则 3: 透明度 — **让用户知道我们在检测什么**

用户不应该问"这个告警是什么意思？"

**体现**：
- 在首次设置时显示"我们会检测什么"示例
- 告警邮件中显示详细变更对照（Before vs After）
- 在 UI 中明确说明监控逻辑（如"我们读取 OpenAPI，不调用 API"）

**反例（避免）**：
- 告警只说"检测到变更"，不说是什么变更
- 用户不知道系统的行为边界
- 隐藏监控逻辑

---

### 原则 4: 渐进式披露 — **免费用户能看到升级后的价值**

不要把付费功能"藏起来"。让 Free 用户看到他们能获得什么。

**体现**：
- Free 用户可以看到 Pro 功能（灰色显示）
- 达到限制时显示升级提示（说明优势）
- 定期邮件展示"付费用户功能"

**反例（避免）**：
- Free 用户完全不知道 Pro 有什么功能
- 升级按钮藏在设置深处
- 不告诉用户升级的好处

---

## 8. 后续版本规划

### Phase 2（Week 2-4）

#### 功能 A: 变更历史时间线

**用户故事**：作为 Alex，我想要查看 API 变更历史，以便了解 API 提供商的变更节奏。

**界面**：
```
Stripe API - Change History

Feb 13: Breaking change detected
  - Endpoint deleted: DELETE /v1/charges/:id

Feb 10: Non-breaking changes (3)
  - New endpoint: POST /v2/charges
  - Added parameter: `metadata`
  - Updated description

Feb 5: Monitor created
```

---

#### 功能 B: 团队仪表板（Pro 计划）

**用户故事**：作为 Alex（团队 Leader），我想要团队成员也能看到告警，以便共享监控信息。

**功能**：
- 邀请成员（最多 10 人）
- 团队共享监控列表
- 成员可添加监控（计入团队配额）

---

### Phase 3（Month 2+）

#### 功能 C: GraphQL Schema 监控

**用户故事**：作为 Sarah，我想要监控 GraphQL API 的 schema 变更，以便我的 query 不破坏。

**挑战**：
- GraphQL schema diff 比 REST 复杂（类型系统、字段、接口）
- 需要监控 introspection query 结果

---

#### 功能 D: 自定义告警规则引擎

**用户故事**：作为 Alex，我想要定义自己的破坏性规则，以便检测特定于我们业务的变更。

**示例规则**：
- "如果端点响应时间增加 50%，告警我"
- "如果某个字段的类型从 `string` 变为 `integer`，这是破坏性的"

---

#### 功能 E: Webhook 告警

**用户故事**：作为 Alex，我想要告警发送到我们自定义系统，以便集成到现有工作流。

**配置**：
```
Webhook URL: https://mycompany.com/api/alerts
Method: POST
Headers:
  Authorization: Bearer xxx
Payload: JSON
```

---

## 附录 A: 术语表

| 术语 | 定义 |
|------|------|
| **OpenAPI** | API 规范标准（原名 Swagger），定义 API 端点、参数、响应结构 |
| **破坏性变更** | API 变更导致现有代码无法正常工作（如端点删除、必填参数删除） |
| **非破坏性变更** | API 变更不影响现有代码（如新增端点、新增可选参数） |
| **Canary 部署** | 软件部署策略，先向小部分用户发布变更，验证后全面发布 |
| **心智模型** | 用户对系统如何工作的理解（可能与实际不同） |
| **可供性** | 产品属性暗示用户如何操作（如按钮看起来可按） |
| **渐进式披露** | 设计策略，先显示核心功能，按需展开高级功能 |

---

## 附录 B: 参考资料

### 设计原则

- Don Norman, *The Design of Everyday Things*
- Jakob Nielsen, *10 Usability Heuristics*
- Kelly Goto, *Web ReDesign 2.0*

### 竞品分析

- Postman Pricing: https://www.postman.com/pricing
- Bump.sh: https://bump.sh/
- oasdiff: https://github.com/oasdiff/oasdiff

### 技术标准

- OpenAPI Specification: https://spec.openapis.org/oas/latest.html
- Breaking Change Rules: https://github.com/oasdiff/oasdiff/docs/breaking-changes.md

---

**文档结束**

下一步：由 `interaction-cooper` 审查用户流程，由 `ui-duarte` 设计视觉界面，由 `fullstack-dhh` 评估技术实现。
