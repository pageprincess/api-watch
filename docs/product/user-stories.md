# APIWatch 用户故事

**作者**: Don Norman (product-norman)
**日期**: 2026-02-13

---

## 核心用户画像

### 用户 1: Alex - 独立开发者

**背景**:
- 自由职业全栈开发者
- 为 5-10 个小客户构建 SaaS 产品
- 依赖 Stripe、GitHub、Slack、SendGrid 等 API
- 一个人团队，没有 QA 流程

**痛点**:
> "去年我有 3 次因为 API 变更导致客户网站崩溃。
> 最糟的一次是 Stripe 静默移除了一个响应字段。
> 我花了整个周末调试。客户很生气，我没收到钱。"

**目标**:
- 在部署到生产前知道 API 变更
- 不想在凌晨 2 点被叫醒修 API 问题
- 愿意为"安心"付费

**使用模式**:
1. 添加 5 个关键 API（Stripe、GitHub、Slack、SendGrid、Twilio）
2. 设置邮件告警
3. 每周一早上检查"上周变更摘要"
4. 部署前看到告警 → 延迟部署，修复集成

**成功标准**:
- "上个月 Stripe 变更了，我提前 2 天知道。部署时没有问题。"

---

### 用户 2: Sarah - DevOps 工程师

**背景**:
- 15 人 SaaS 公司的 DevOps 工程师
- 管理生产部署和监控
- 团队依赖 20+ 个第三方 API
- 有 PagerDuty，但讨厌凌晨 3 点的警报

**痛点**:
> "我们的监控显示错误率飙升，但 root cause 分析
> 总是发现是上游 API 变更。如果我们早知道，
> 可以避免 2 小时的宕机。"

**目标**:
- 减少'神秘'生产事故
- 给团队部署前检查清单
- 团队可见的告警（Slack 集成）

**使用模式**:
1. 为所有 20 个 API 设置监控
2. 连接到团队 Slack 频道 #api-alerts
3. CI/CD pipeline 中添加"检查 API 变更"步骤
4. 每次部署前检查 Slack 频道

**成功标准**:
- "上周部署前看到 Stripe 告警。延迟了部署，
  在下班前修复了集成。没有 PagerDuty。"

---

### 用户 3: Mike - API 产品经理

**背景**:
- API First 公司的产品经理
- 产品依赖 10+ 个外部 API（AI、支付、通信）
- 需要提前知道上游变更影响路线图
- 向管理层报告"风险因素"

**痛点**:
> "AI 提供商上周悄无声息地废弃了一个模型参数。
> 我们的产品功能依赖于它。当我们发现时，
> 已经是紧急 hotfix 了。我想早点知道。"

**目标**:
- 追踪影响产品路线图的 API 变更
- 向管理层报告风险
- 与供应商谈判时（"你们变更太频繁了"）

**使用模式**:
1. 添加关键的 AI API（OpenAI、Anthropic、Cohere）
2. 每周导出"变更报告"给管理层
3. 用数据跟供应商谈判（"你们的 API 变更是竞品的 3 倍"）
4. 规划产品功能时检查"API 稳定性评分"

**成功标准**:
- "OpenAI 废弃参数时，我们提前 1 周知道。
  重新设计了功能以避免依赖它。"

---

## 使用场景

### 场景 1: 紧急部署前的检查

**情境**: 周五下午 4 点，客户要求紧急 hotfix

**用户行为**:
1. 打开 APIWatch dashboard
2. 检查 #api-alerts Slack 频道
3. 看到无新破坏性变更
4. 批准部署
5. 安心过周末

**价值**: 避免"修了一个 bug，引入了另一个 API 问题"

---

### 场景 2: AI API 快速演进

**情境**: OpenAI 每周更新 API，没有 changelog

**用户行为**:
1. 在 APIWatch 中添加 OpenAI 模板
2. 设置 15 分钟检查频率
3. 收到告警："gpt-4 API 移除了 temperature 参数"
4. 立即检查代码中使用情况
5. 在 prod 受影响前修复

**价值**: 在 AI 混沌中保持代码稳定

---

### 场景 3: 团队协作

**情境**: 5 人团队，每人负责不同的 API 集成

**用户行为**:
1. DevOps 设置 APIWatch，连接 Slack
2. 每个人监控自己的 API
3. 任何变更 → #api-alerts 频道
4. 每日 standup: "有任何 API 告警吗？"
5. 有告警 → 讨论影响，修复优先级

**价值**: 团队共享意识，减少重复工作

---

### 场景 4: 供应商管理

**情境**: 评估新的支付 API

**用户行为**:
1. 在 APIWatch 中添加候选 API
2. 监控 2 周
3. 导出"变更历史"报告
4. 看到"此 API 每 3 天变更一次"
5. 决定不使用（"太不稳定"）

**价值**: 数据驱动的 API 选择决策

---

## "顿悟"时刻设计

### 第一次使用体验

**目标**: 5 分钟内看到价值

1. **注册**（30 秒）
   - 简单表单：邮箱 + 密码
   - 无需信用卡

2. **欢迎**（10 秒）
   - "监控你的第一个 API"
   - 清晰 CTA: "选择一个 API"

3. **选择 API**（30 秒）
   - 10 个流行 API 模板
   - 一键添加 Stripe

4. **测试告警**（2 分钟）
   - 立即发送测试告警
   - "检查你的邮箱：这就是告警的样子"

5. **价值证明**（1 分钟）
   - "我们会每小时检查 Stripe API"
   - "如果任何东西破坏，你会在这里看到"

**结果**: 用户在 5 分钟内看到:
- 产品如何工作
- 告警看起来像什么
- 何时会收到通知

---

### 第一次真实告警

**目标**: 创造"它救了我"的感觉

**邮件内容**:
```
Subject: 🔴 Breaking Change Detected: Stripe API

Hi [Name],

Stripe API just had a breaking change:

❌ Removed: response.payment_intent.attributes (required)
📅 Changed: 2 hours ago
🔗 View details: [link to diff]

What this means for you:
If your code reads response.payment_intent.attributes,
it will break after this change goes live.

Recommended action:
1. Check your code for this field usage
2. Update to use the new structure
3. Test before deploying

You received this because you monitor Stripe API on APIWatch.
```

**结果**: 
- 用户感受到价值（"我刚被救了"）
- 社交分享材料（"看这个有用的工具"）
- 产品留存（"我需要继续使用这个"）

---

## 反功能模式（Anti-Patterns）

### ❌ 我们不会做

1. **复杂 onboarding**
   - 不要求信用卡
   - 不强制教程
   - 不强制添加 3 个 API

2. **噪音告警**
   - 不告警次要描述变更
   - 不每小时发"无变更"邮件
   - 不重复告警同一变更

3. **隐藏价值**
   - 不把关键信息藏在付费墙后
   - 不要求注册才能看示例
   - 不隐藏 API 变更历史

4. **过度复杂**
   - 不提供 100 种告警配置
   - 不要求用户理解 OpenAPI 规范
   - 不用技术术语（"schema validation"）vs 用户术语（"removed fields"）

---

## 可用性原则

1. **即时价值**: 5 分钟到第一个"aha!"
2. **清晰沟通**: 无技术术语，只有"什么坏了"
3. **行动导向**: 每个告警有"下一步"建议
4. **最小摩擦**: 一键添加 API，无需配置
5. **透明**: 显示我们在检查什么，为什么

---

**Don Norman 的备注**:

> 好的工具是透明的。用户不应该想"这个工具如何工作？"，
> 而应该是"它如何帮助我完成任务？"
>
> APIWatch 的成功不在于技术复杂度，
> 而在于让"监控 API"感觉像"检查邮箱"一样简单。
