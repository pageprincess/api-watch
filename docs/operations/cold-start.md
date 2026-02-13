# APIWatch 冷启动计划

**作者**: Paul Graham (operations-pg)
**日期**: 2026-02-13
**阶段**: Pre-PMF, Week 1-2

---

## 核心哲学: Do Things That Don't Scale

> "The wrong way to think about startup ideas is to think you need a brilliant idea. The right way is to do things that don't scale, manually recruit users, and make them so happy they tell their friends."

APIWatch 的冷启动不是买广告、不是 SEO 优化、不是网红营销。而是一个一个地争取用户，给每个用户超乎预期的关注。

---

## 目标

| 指标 | Week 1 | Week 2 |
|------|--------|--------|
| 注册用户 | 20 | 50 |
| 激活用户（添加监控） | 15 (75%) | 35 (70%) |
| 付费转化 | 0 | 3 (6%) |

**Kill Switch**: Week 2 结束时如果注册用户 < 30，立即停止项目。

---

## Week 1: 手动招募 20 个用户

### Day 1-2: 识别目标用户

#### 1. Reddit/r/devops 和 r/SaaS
**原因**: 工程师在这里讨论工具选择，真实痛点讨论多。

**行动**:
- 搜索 "API breaking change" 相关帖子
- 找到最近 6 个月抱怨 API 变更的帖子
- 记录用户名和痛点

**不要**: 创建新帖子推销产品（会被封号，而且转化低）

**示例搜索词**:
- "Stripe API change"
- "GitHub API breaking"
- "API update broke production"
- "Postman alternative"

---

#### 2. Hacker News "Show HN" 准备
**原因**: HN 是工程师的核心社区，一个有效推荐可以带来 50+ 用户。

**行动**:
- 准备 "Show HN: APIWatch" 帖子
- 写一个真实的故事（不是营销话术）
- 准备评论区回复

**Show HN 草稿**:
```
Title: Show HN: APIWatch - I built a tool after Stripe API silently broke my production

Body:
Last year at 3 AM, PagerDuty woke me up. Stripe had quietly deprecated a field we depended on. Our payment flow broke for 4 hours before we figured out what happened.

I couldn't find a tool that monitors API breaking changes BEFORE they break you. Postman checks uptime, not contract changes. Bump.sh compares docs but doesn't tell you what's breaking.

So I built APIWatch. It:
- Monitors OpenAPI/Swagger specs
- Detects breaking changes (deleted endpoints, required params removed)
- Alerts you via email/Slack before your users notice

It's free for 1 API. Would love your feedback.

GitHub: github.com/pageprincess/api-watch
```

**时间**: Week 1, Day 3 早上 8-10 AM PST（HN 流量高峰）

---

#### 3. GitHub Issues 挖掘
**原因**: 依赖第三方 API 的开源项目维护者是我们完美用户。

**行动**:
- 搜索依赖 Stripe、GitHub、Slack API 的热门项目
- 找到最近讨论 API 变更的 Issue
- 留下有帮助的评论（不是直接推销）

**示例**:
```markdown
Hi! I faced this exact issue with Stripe API last year.
Ended up building a tool to catch these changes before they hit production.
If you're interested, it's at api-watch.pages.dev.
Hope this helps!
```

**目标项目**:
- Shopify apps (依赖 Shopify API)
- Slack bots (依赖 Slack API)
- GitHub integrations (依赖 GitHub API)

---

### Day 3-4: 一对一招募

#### 手动发送 50 封个性化邮件

**列表来源**:
- Indie Hackers "Who's building" 列表
- Product Hunt 评论者
- Reddit 帖子中抱怨过的用户
- Twitter 上搜索 "API breaking"

**邮件模板（必须个性化）**:
```
Subject: Quick question about your Stripe integration

Hi [Name],

Saw your tweet about Stripe API breaking your production last month. Ouch.

I built a small tool that monitors OpenAPI specs and alerts you before breaking changes hit production. It caught a Stripe deprecation for us last week.

If you want to try it, it's free for 1 API: api-watch.pages.dev

No sales pitch, just thought it might help.

Best,
[Your Name]
```

**关键**:
- 第一句必须证明你认真看了他们的内容
- 不要抄送/群发
- 不要立即推销，先提供价值
- 邮件签名用真名

**回复每一封邮件**:
- 问"这是什么？" → 解释 2 句话
- 说"太贵了" → 给他们永久免费 1 API
- 说"不需要" → 问"为什么不需要？"（学习）

---

### Day 5-7: 给前 20 个用户提供 VIP 服务

#### 新用户 Onboarding 流程

每个新注册用户都会收到：

1. **欢迎邮件（2 分钟内）**:
```
Subject: Welcome to APIWatch! 🎉

Hi [Name],

Thanks for trying APIWatch. I'm the founder, and I want to make sure you get value.

Quick question: What API are you most worried about breaking?

I can help you set up your first monitor.

- [Your Name]
P.S. I personally read every reply.
```

2. **24 小时跟进邮件**:
```
Subject: How's it going?

Hi [Name],

Just checking in — did you get a chance to add your first API monitor?

If you're stuck, reply to this email. I'm happy to hop on a 10-min call and help you set it up.

- [Your Name]
```

3. **72 小时价值检查**:
```
Subject: One question

Hi [Name],

Have you received any alerts yet? I want to make sure the detection engine is working for your APIs.

If not, it might mean your APIs haven't had breaking changes (which is good!) but I want to confirm.

Best,
[Your Name]
```

---

#### 给每个前 20 用户打电话（15 分钟）

**原因**: 真正理解痛点，比任何调研都有效。

**通话问题**:
1. 你依赖哪些第三方 API？
2. 你怎么知道 API 变更了？
3. 上次 API 变更导致问题是什么时候？
4. 如果 APIWatch 明天消失，你会怀念什么？
5. 你愿意为这个工具付多少钱？

**不要推销**。只听和提问。

**目标**: 3-5 个深度用户访谈 = 产品方向验证

---

## Week 2: 从 20 到 50 用户

### Day 8-10: 社区发布

#### 1. Hacker News "Show HN" 发布

**时间**: 美西时间 8:00 AM 周三

**发布后**:
- 每 15 分钟检查一次
- 回复每一条评论（即使是批评）
- 保持谦逊，承认产品的不足
- 对"太贵"的评论 → 解释这是独立开发者项目

**预期结果**:
- 首页停留 4-6 小时 = 50-100 访问
- 10-20 注册用户
- 3-5 深度反馈

---

#### 2. Reddit/r/devops 发布

**标题**: "Built a tool after Stripe API silently broke production. Now it monitors breaking changes."

**内容**:
```
Story: Last year Stripe API silently deprecated a field we used. Production broke at 3 AM. We spent 4 hours debugging.

I built APIWatch to prevent this. It:
- Monitors OpenAPI specs hourly
- Detects breaking changes (deleted endpoints, required params removed)
- Alerts via email/Slack

Free for 1 API. Would love feedback from this community.

GitHub: github.com/pageprincess/api-watch
Demo: api-watch.pages.dev

What do you think? Is this a problem you face?
```

**发布后**:
- 回复每条评论
- 不要自我辩护
- 对批评保持开放态度
- 问"你会怎么解决这个问题？"

---

#### 3. Product Hunt 准备（Week 3 计划）

Week 2 结束时评估是否 PH 发布:
- 如果 Week 2 激活率 < 50% → 先改进产品，推迟 PH
- 如果 Week 2 付费转化 = 0 → 先验证价值，推迟 PH

**PH 不应该是 Day 1 策略**。PH 是放大器，不是点火器。

---

### Day 11-14: 用户推荐循环

#### 让前 20 个用户帮你找下 20 个用户

**邮件模板**:
```
Subject: Can I ask a favor?

Hi [Name],

Thanks for trying APIWatch. I'm glad it's been useful for you.

Quick favor: I'm looking for 10 more people to test the tool. Do you know anyone who'd benefit from API monitoring?

If so, feel free to forward this email. I'll give them a free Pro month.

Thanks for being an early user!

- [Your Name]

---
Forward this to a friend:
Hey, I've been using APIWatch to monitor [API]. It's pretty useful. The founder is looking for early users — you can try it at api-watch.pages.dev
```

**激励**:
- 每推荐 1 个付费用户 → 给推荐人 1 个月免费 Pro
- Top 3 推荐者 → 永久免费 Pro

---

## 零预算营销渠道清单

| 渠道 | 行动 | 预期用户 | 时间 |
|------|------|----------|------|
| **Hacker News** | Show HN 帖子 | 20-50 | 4 小时 |
| **Reddit** | r/devops, r/SaaS | 10-20 | 2 小时 |
| **GitHub Issues** | 有帮助的评论 | 5-10 | 3 小时 |
| **Indie Hackers** |评论区互动 | 5-10 | 2 小时 |
| **Product Hunt** | 发布（Week 3+） | 50-100 | 8 小时 |
| **Twitter/X** | Build in public | 10-20 | 30 分钟/天 |
| **LinkedIn** | SaaS 创始人群体 | 5-10 | 2 小时 |

**总计**: 约 20-24 小时人工工作 = 100+ 用户

---

## 每日运营节奏

### 早上（30 分钟）
- 检查昨夜新注册用户
- 发送欢迎邮件（手动！）
- 回复未读邮件

### 下午（30 分钟）
- Reddit/HN 搜索相关讨论
- 留下有帮助的评论（非推销）
- Twitter 互动（转发相关内容）

### 晚上（30 分钟）
- 分析当日数据（注册/激活/付费）
- 给活跃用户发跟进邮件
- 更新用户访谈笔记

---

## 警告信号（立即转向）

| 信号 | 行动 |
|------|------|
| **注册率 < 5/天** | 检查 Landing Page 转化，A/B 测试标题 |
| **激活率 < 50%** | Onboarding 太复杂，简化流程 |
| **Week 2 无付费** | 定价错误或价值不足，访谈用户调整 |
| **用户说"不需要"** | 痛点不够强烈，考虑 pivot |

---

## 保罗格拉汉姆的冷启动检查清单

- [ ] 前 10 个用户是否手动招募？（是 ✅）
- [ ] 是否给每个新用户发了欢迎邮件？（是 ✅）
- [ ] 是否和至少 5 个用户通过话？（是 ✅）
- [ ] 是否给每个注册用户回复了邮件？（是 ✅）
- [ ] 是否在社区提供了有价值的内容？（是 ✅）
- [ ] 是否测量了激活率？（是 ✅）
- [ ] 是否询问了用户"这有用吗？"？（是 ✅）
- [ ] 是否保持了谦逊和学习的态度？（是 ✅）

---

## 下一步

完成 Week 1-2 冷启动后:
1. 评估 PMF 信号（激活率 > 60%？留存 > 40%？）
2. 如果是 → 规划 Week 3-4 增长策略
3. 如果否 → Pivot 或停止项目

**记住**: 增长率是最诚实的指标。周增长率 5-7% 就是优秀。如果前 2 周没有增长，承认失败，继续前进。

---

"做不可规模化的事"不是低效。这是唯一有效的方式。
