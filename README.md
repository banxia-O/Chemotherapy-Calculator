# Chemotherapy-Calculator

化疗剂量计算器 | Chemotherapy Dose Calculator

基于 BSA（体表面积）和 Calvert 公式的化疗药物剂量计算微信小程序。

覆盖 **19 个癌种、35 个常用化疗方案**，支持卡铂 AUC 计算、S-1（替吉奥）分档给药、高剂量 MTX 警示。

> ⚠️ 住院医自用，仅供参考。实际用药请以最新版指南及主管医师意见为准。

## 功能

- **BSA 计算**：Mosteller 公式 `√(身高×体重/3600)`
- **方案剂量计算**：按癌种 → 方案选择，自动按 BSA 计算各药剂量
- **卡铂剂量计算**：Calvert 公式 `剂量(mg) = AUC × (GFR + 25)`，GFR 采用 Cockcroft-Gault 估算（女性 ×0.85）
- **特殊给药支持**：替吉奥（S-1）按 BSA 分档、口服药、固定剂量药、高剂量甲氨蝶呤警示

## 技术栈

微信小程序（云开发模板）。核心页面位于 `miniprogram/pages/chemo/`，所有化疗方案数据集中在 `chemo.js` 的 `regimens` 对象中，以癌种 `id` 为 key，便于扩展。

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
