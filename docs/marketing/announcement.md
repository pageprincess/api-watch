# APIWatch 发布公告

**作者**: Seth Godin (marketing-godin)
**日期**: 2026-02-13

---

## 标题

**APIWatch: 监控 API 破坏性变更（而非仅仅是可用性）**

---

## 一句话描述

自动检测 API 变更——在生产崩溃前捕获破坏性修改。

---

## 完整描述

### 问题

你的应用依赖第三方 API。你监控可用性、响应时间、错误率。但有一件事你**没有**监控：

**API 契约变更。**

上个月，Stripe 移除了一个必填字段。GitHub 废弃了一个端点。Slack 修改了响应码。你的应用崩溃了，用户看到错误，你花了几小时调试。

**这每天都在发生。但没人谈论它。**

### 解决方案

**APIWatch** 自动监控 OpenAPI/Swagger 规范并检测破坏性变更。

- **严重**: 移除的端点、删除的必填参数
- **主要**: 移除的响应码、删除的必填 schema 属性
- **次要**: 可选字段变更、描述更新

在生产应用崩溃前收到告警。

### 如何工作

1. **添加 API** — 从 10+ 模板选择（Stripe、GitHub、Slack、OpenAI...）或添加自定义 spec URL
2. **我们监控** — Cron 任务每小时检查 spec 变更
3. **我们告警** — 破坏性变更的邮件 + Slack 通知

### APIWatch 有何不同

| 功能 | APIWatch | 可用性监控 |
|------|----------|------------|
| 检测 spec 变更 | ✅ | ❌ |
| 破坏性变更分析 | ✅ | ❌ |
| 主动告警 | ✅ | ❌（仅响应） |
| 零设置模板 | ✅ | ❌ |

---

## 使用场景

- **DevOps/SRE**: 在 API 变更破坏部署前收到通知
- **产品经理**: 追踪影响路线图的上游 API 变更
- **API 提供商**: 为用户提供监控作为增值服务
- **开发者**: 停止调试"神秘"的生产故障

---

## 定价

- **Free**: 3 个 API，每小时检查
- **Pro**: $9/月，无限 API，15 分钟检查
- **Team**: $29/月，团队告警，Slack 集成

---

## 发布优惠

前 100 名用户：**Pro 层免费 6 个月**（无需信用卡）

---

**试用免费**: [api-watch.pages.dev](https://api-watch.pages.dev)（即将部署）

**GitHub**: [github.com/pageprincess/api-watch](https://github.com/pageprincess/api-watch)

---

## HackerNews 帖子模板

```
标题: Show HN: APIWatch – 监控 API 破坏性变更（而非仅仅是可用性）

我们都监控 API 可用性。但没人监控 API 契约变更。

上周，Stripe 移除了一个必填字段。GitHub 废弃了一个端点。
你的应用崩溃了，你花了几小时调试。

我构建 APIWatch 来解决这个问题：

- 监控 OpenAPI/Swagger spec 的变更
- 检测破坏性变更（严重/主要/次要）
- 在生产崩溃前通过邮件/Slack 告警你
- 10+ 一键模板（Stripe、GitHub、Slack、OpenAI...）

Free 层：3 个 API，每小时检查

希望获得 HN 社区的反馈——特别是：
1. 这是你遇到过的问题吗？
2. 你目前的"解决方案"是什么？（手动检查 changelog？）

演示 + 代码: github.com/pageprincess/api-watch
部署到: api-watch.pages.dev
```

---

## Reddit r/devops 帖子模板

```
标题: 构建了一个工具来检测 API 破坏性变更——想要反馈

嘿 r/devops，

我反复遇到同样的问题：第三方 API 会修改他们的 spec，
破坏我们的生产环境，而我只在错误率飙升时才发现。

可用性监控没帮助——它们只捕获宕机，不捕获契约变更。

所以我构建了 APIWatch：

1. 监控 OpenAPI/Swagger spec
2. 比较版本以检测破坏性变更
3. 在部署前发送告警（邮件/Slack）

推出了一个 free 层（3 个 API，每小时检查）

寻求反馈：
- 这是你的团队面临的问题吗？
- 你目前如何处理 API 变更？
- 什么功能会让这工具有用？

github.com/pageprincess/api-watch
```

---

## Product Hunt 描述

```
APIWatch 在 API 破坏你的应用前监控 API 破坏性变更。

🔍 检测：移除的端点、删除的参数、修改的响应码
🚨 告警：邮件 + Slack 通知
⚡ 设置：10+ 一键模板（Stripe、GitHub、Slack、OpenAI...）

使用场景：
• DevOps：在 API 变更破坏部署前收到告警
• 产品：追踪影响你路线图的上游 API 变更
• 开发者：停止调试"神秘"的生产故障

定价：
• Free：3 个 API，每小时检查
• Pro：$9/月，无限 API
• Team：$29/月，Slack 集成

发布特别优惠：前 100 名用户获得 Pro 层免费 6 个月。
```

---

## 发布日清单

- [ ] HN 帖子提交（8-11 AM PT，周二到周四）
- [ ] Reddit 帖子提交（r/devops、r/programming）
- [ ] Product Hunt 发布排期
- [ ] Twitter 线程发布
- [ ] 直接触达邮件发送（5-10 个目标）
- [ ] 1 小时内回应每条评论
- [ ] 追踪指标（访客、注册、社交互动）

---

*准备好发布。等待部署。🚀*
