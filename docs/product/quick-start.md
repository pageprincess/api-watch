# APIWatch 快速开始

**目标**: 5 分钟内监控你的第一个 API

---

## 第 1 步：注册（30 秒）

1. 访问 https://api-watch.pages.dev
2. 点击 "Start Monitoring Free"
3. 输入邮箱和密码
4. 确认你的邮箱

**无需信用卡**。Free 层永久免费，最多 3 个 API。

---

## 第 2 步：添加你的第一个 API（1 分钟）

### 选项 A：使用模板（推荐）

我们为 10+ 个流行 API 提供一键模板：

| API | 用途 | 添加时间 |
|-----|------|----------|
| 💳 Stripe | 支付集成 | 1 点击 |
| 🐙 GitHub | 开发者工具 | 1 点击 |
| 💼 Slack | 团队沟通 | 1 点击 |
| 🤖 OpenAI | AI/ML 集成 | 1 点击 |
| 📞 Twilio | SMS/语音 | 1 点击 |

**如何添加**:
1. 在 dashboard 点击 "Add API"
2. 选择 "Stripe"（或任何其他）
3. 点击 "Add Monitor"
4. 完成！

### 选项 B：自定义 API

如果你的 API 不在我们的模板中：

1. 点击 "Add Custom API"
2. 输入 API 名称（例如 "My Internal API"）
3. 粘贴 OpenAPI/Swagger spec URL
4. 点击 "Add Monitor"

**要求**: API 必须有公开的 OpenAPI/Swagger spec

---

## 第 3 步：验证监控工作（2 分钟）

添加 API 后，你会看到：

```
✅ Stripe API added
🔄 Next check: in 45 minutes
📊 Last check: Just now
```

**第一次检查需要 1-2 分钟**。你会收到一封邮件：

```
Subject: ✅ APIWatch: Stripe API monitoring active

Hi [Name],

Your Stripe API monitor is now active.

We'll check for breaking changes every hour.
If we detect any, you'll get an alert like this:

🔴 Breaking Change: [field name] removed
Recommended: [what to do]

This is just a test message. You'll only receive
alerts when actual breaking changes are detected.

- The APIWatch Team
```

**为什么发送测试邮件？**
- 确认告警到达你的邮箱
- 展示真实告警的样子
- 验证我们的监控引擎在工作

---

## 第 4 步：添加更多 API（可选）

Free 层支持最多 3 个 API。常见组合：

**SaaS 堆栈**:
- Stripe（支付）
- SendGrid（邮件）
- Slack（通知）

**开发者工具**:
- GitHub（代码仓库）
- Linear（项目管理）
- Notion（文档）

**AI/ML 堆栈**:
- OpenAI（LLM）
- Anthropic（Claude）
- Cohere（嵌入）

---

## 你会收到什么样的告警？

### 示例 1：字段移除

```
🔴 Breaking Change Detected: Stripe API

❌ Removed: customer.default_source (required)
📅 Detected: 2 hours ago
⚠️ Impact: HIGH

What breaks:
If your code reads customer.default_source, it will return null.

Recommended action:
1. Search your code for "default_source"
2. Update to use invoice_settings.default_payment_method
3. Test before deploying

[View full diff →]
```

### 示例 2：端点废弃

```
🔴 Breaking Change Detected: GitHub API

❌ Deprecated: POST /repos/:owner/:repo/releases (old version)
📅 Detected: 6 hours ago
⚠️ Impact: MEDIUM

What breaks:
Old release creation endpoint will stop working on 2025-03-01.

Recommended action:
Migrate to POST /repos/:owner/:repo/releases

[Migration guide →]
```

### 示例 3：非破坏性变更

```
📝 API Update: Stripe API

✅ Non-breaking change detected

What changed:
- Added: new field "payment_method.preferences"
- Updated: description for "customer.created" webhook

No action needed. Just a heads-up!

[View full changelog →]
```

---

## 常见问题

### Q: 如果我的 API 没有 OpenAPI spec 怎么办？

**A**: 目前，APIWatch 只支持有 OpenAPI/Swagger spec 的 API。
你可以：
1. 询问 API 提供商是否有 spec
2. 自己托管 OpenAPI spec 并提供 URL
3. 投票我们支持更多 API 格式

### Q: 你们能访问我的 API 数据吗？

**A**: 不。我们只读取公开的 API spec（文档），
不访问任何实际 API 调用或你的数据。

### Q: 检查频率如何？

**A**: 
- Free 层：每小时
- Pro 层：每 15 分钟
- Team 层：每 5 分钟

### Q: 如果我收到假阳性告警怎么办？

**A**: 点击告警邮件中的 "Report Issue" 按钮。
我们会在 24 小时内调查并修复。

### Q: 可以添加内部 API 吗？

**A**: 可以，只要 OpenAPI spec 可以从 URL 访问。
如果需要在防火墙内，考虑 Team 层的自托管选项。

---

## 下一步

### 1. 设置 Slack 集成（Pro/Team）

在 Slack 中创建通知频道：
1. 访问 Settings → Integrations
2. 点击 "Add to Slack"
3. 选择频道（例如 #api-alerts）
4. 授权 APIWatch

现在所有告警也会出现在 Slack！

### 2. 邀请团队成员（Team）

1. 访问 Settings → Team
2. 输入队友邮箱
3. 选择角色（Viewer 或 Admin）
4. 发送邀请

### 3. 导出监控报告

每周或每月导出报告给团队：
1. 访问 Dashboard → Reports
2. 选择时间范围
3. 点击 "Export PDF"

---

## 需要帮助？

- 📧 Email: support@api-watch.pages.dev
- 💬 Twitter: @apiwatchhq
- 📖 Docs: docs.api-watch.pages.dev
- 🐛 Bug 报告: github.com/pageprincess/api-watch/issues

---

**准备好了？开始监控你的第一个 API 🚀**
