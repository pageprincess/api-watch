# APIWatch A/B 测试想法

**作者**: Paul Graham (operations-pg)
**日期**: 2026-02-13
**阶段**: Pre-PMF, Week 3-8

---

## 核心原则: 快速假设验证

> "A/B testing is not about optimization. It's about learning what users actually want, not what you think they want."

A/B 测试不是微调按钮颜色。而是验证核心假设：
- 价值主张是否清晰？
- 用户是否愿意付费？
- 产品是否真正解决问题？

---

## 测试优先级

### Priority 1: 激活率 (Week 3-4)

#### 测试 1: Landing Page 标题

**假设**: "Before they break your app" 比 "Monitor API breaking changes" 更清晰传达价值。

**变体**:
- A (Control): "Monitor API breaking changes"
- B (Test): "Detect API breaking changes before they break your app"

**测量**: 注册转化率（访问 → 注册）

**样本**: 每变体 100 访问

**持续时间**: 3-5 天

---

#### 测试 2: 注册流程复杂度

**假设**: Magic Link（无密码）比密码注册更高激活率。

**变体**:
- A: 邮箱 + 密码
- B: 邮箱 + Magic Link（无密码）

**测量**: 激活率（注册 → 添加监控）

**样本**: 每变体 50 注册

**持续时间**: 7 天

---

#### 测试 3: 首次使用引导

**假设**: 强制选择模板比手动输入 URL 更高激活率。

**变体**:
- A: 显示"输入 OpenAPI URL"（模板可选）
- B: 显示"选择模板"（输入 URL 可选）

**测量**: Time to First Monitor（秒）

**样本**: 每变体 30 用户

**持续时间**: 3 天

---

### Priority 2: 留存率 (Week 5-6)

#### 测试 4: 摘要频率

**假设**: 每日健康报告比每周报告更高留存。

**变体**:
- A: 每周发送 API 健康报告
- B: 每日发送 API 健康报告

**测量**: Day 7 留存率

**样本**: 每变体 50 用户

**持续时间**: 14 天

**风险**: 如果 B 增加退订率，立即停止。

---

#### 测试 5: 告警后跟进时机

**假设**: 告警后 2 小时跟进比 24 小时更高反馈率。

**变体**:
- A: 告警后 24 小时发送"How did it go?"邮件
- B: 告警后 2 小时发送"How did it go?"邮件

**测量**: 反馈率（回复邮件比例）

**样本**: 每变体 20 个告警

**持续时间**: 直到收集 40 个告警事件

---

#### 测试 6: 价值展示方式

**假设**: Dashboard 显示"为您工作 X 天"比"上次检查 X 小时前"更高留存。

**变体**:
- A: 显示"Last check: 2 hours ago"
- B: 显示"Working for you for 7 days"

**测量**: DAU/WAU 比例

**样本**: 每变体 50 用户

**持续时间**: 7 天

---

### Priority 3: 付费转化 (Week 7-8)

#### 测试 7: 付费提示时机

**假设**: 达到限制时立即提示比延迟提示更高转化。

**变体**:
- A: 达到 1 API 限制时立即显示升级提示
- B: 达到限制时继续使用，下次登录再提示

**测量**: 付费转化率

**样本**: 每变体 30 用户

**持续时间**: 14 天

---

#### 测试 8: 付费计划展示

**假设**: 显示"节省金额"比显示"功能列表"更高转化。

**变体**:
- A: 列出 Starter 功能（5 APIs, Hourly checks, Slack alerts）
- B: 显示"Compared to competitors, you save $41/month"

**测量**: 点击"Upgrade"比例

**样本**: 每变体 50 访问

**持续时间**: 7 天

---

#### 测试 9: 免费试用长度

**假设**: 14 天试用比 7 天试用更高付费转化。

**变体**:
- A: Pro 计划 7 天免费试用
- B: Pro 计划 14 天免费试用

**测量**: 试用后付费转化率

**样本**: 每变体 20 用户

**持续时间**: 21 天

---

## 测试框架

### A/B 测试设置

```typescript
// src/lib/ab-test.ts
export interface ABTest {
  name: string;
  variants: ['A', 'B'];
  split: number; // 0-1, A 的概率
  targetMetric: string;
  startDate: Date;
  endDate?: Date;
}

export interface ABTestConfig {
  tests: ABTest[];
}

// 示例配置
const config: ABTestConfig = {
  tests: [
    {
      name: 'landing-headline',
      variants: ['A', 'B'],
      split: 0.5,
      targetMetric: 'signup_conversion',
      startDate: new Date('2026-02-20'),
    },
    // ...
  ],
};

// 用户分配到变体
export function assignVariant(userId: string, test: ABTest): 'A' | 'B' {
  const hash = hashCode(userId + test.name);
  return (hash % 100) < (test.split * 100) ? 'A' : 'B';
}

// 追踪测试事件
export function trackTestEvent(
  userId: string,
  test: ABTest,
  variant: 'A' | 'B',
  action: string,
  value?: number
) {
  // 发送到 PostHog
  posthog.capture({
    distinctId: userId,
    event: `ab_test_${test.name}`,
    properties: {
      variant,
      action,
      value,
      timestamp: new Date().toISOString(),
    },
  });
}
```

---

### 统计显著性检查

```typescript
// 计算转化率差异的显著性
export function isSignificant(
  conversionsA: number,
  totalA: number,
  conversionsB: number,
  totalB: number,
  confidence: number = 0.95
): boolean {
  const rateA = conversionsA / totalA;
  const rateB = conversionsB / totalB;

  const pooledRate = (conversionsA + conversionsB) / (totalA + totalB);
  const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / totalA + 1 / totalB));

  const z = Math.abs(rateA - rateB) / se;
  const criticalValue = 1.96; // 95% confidence

  return z > criticalValue;
}

// 示例使用
const significant = isSignificant(
  12, 100,  // A: 12 转化 / 100 总数
  18, 100,  // B: 18 转化 / 100 总数
  0.95      // 95% 置信度
);
// 如果 significant = true，B 显著更好
```

---

## 测试日历 (Week 3-8)

```
Week 3: 测试 1 (Landing Page 标题)
Week 3-4: 测试 2 (注册流程)
Week 4: 测试 3 (首次使用引导)

Week 5: 测试 4 (摘要频率)
Week 5: 测试 5 (告警跟进)
Week 6: 测试 6 (价值展示)

Week 7: 测试 7 (付费提示时机)
Week 7-8: 测试 8 (付费计划展示)
Week 8: 测试 9 (免费试用长度)
```

**原则**: 同一时间只运行 1-2 个测试，避免干扰。

---

## 测试结果模板

### 每个测试结束后填写

```markdown
## 测试结果: [测试名称]

**日期**: YYYY-MM-DD
**假设**: [原假设]

### 数据

| 变体 | 样本 | 转化 | 转化率 |
|------|------|------|--------|
| A (Control) | 100 | 12 | 12% |
| B (Test) | 100 | 18 | 18% |

### 统计显著性

- Z-score: 2.15
- P-value: 0.032
- 结论: ✅ 显著 (95% 置信度)

### 学习

- 变体 B 转化率高出 50%
- 假设得到验证

### 行动

- 全量上线变体 B
- 影响指标: 注册转化率预计从 12% → 18%

---

**下一步**: [下一个测试假设]
```

---

## 快速失败规则

每个测试有明确的停止条件：

| 测试 | 停止条件 | 原因 |
|------|----------|------|
| Landing Page 标题 | B 转化率 < A 的 80% | 立即恢复 A |
| 注册流程 | 退订率 > 5% | 影响用户健康 |
| 摘要频率 | 退订率 > 5% | 烦扰用户 |
| 付费时机 | 投诉 > 2 | 用户体验下降 |

---

## 不需要测试的事情（节省时间）

❌ **不要测试**:
- 按钮颜色（蓝色 vs 绿色）- 影响太小
- 图标样式（填充 vs 描边）- 不是核心问题
- 字体大小（14px vs 16px）- 太微小

✅ **应该测试**:
- 价值主张 - 产品是否清晰？
- 定价 - 用户是否愿意付费？
- 核心流程 - 用户能否完成目标？

---

## 测试与数据对齐

### 测试 → 指标映射

| 测试 | 主要指标 | 次要指标 |
|------|----------|----------|
| Landing Page 标题 | 注册转化率 | 激活率 |
| 注册流程 | 激活率 | 注册转化率 |
| 首次使用引导 | Time to First Monitor | 激活率 |
| 摘要频率 | Day 7 留存 | 退订率 |
| 告警跟进 | 反馈率 | Day 7 留存 |
| 价值展示 | DAU/WAU | Day 7 留存 |
| 付费提示 | 付费转化率 | 退订率 |
| 付费计划展示 | 点击升级率 | 付费转化率 |
| 试用长度 | 付费转化率 | Churn Rate |

---

## 最终原则

1. **一个假设一个测试** - 不要同时改多个变量
2. **统计显著性** - 小样本也要有信心
3. **快速迭代** - 测试 2 周，决策 1 天
4. **接受失败** - 负向结果也是学习
5. **记录一切** - 6 个月后你会感谢自己

---

**Paul Graham 留言**:

> "The best A/B test is the one that tells you your assumption is wrong. Because now you know what's actually true, not what you wish were true."

负向结果不是失败。是避免在错误方向上浪费更多时间。
