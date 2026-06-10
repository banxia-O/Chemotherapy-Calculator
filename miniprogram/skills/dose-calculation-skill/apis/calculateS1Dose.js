const { calculateS1DoseValue } = require('../utils/calc.js')

async function calculateS1Dose({ bsa } = {}) {
  try {
    const result = calculateS1DoseValue(bsa)
    return {
      isError: false,
      content: [{ type: 'text', text: `已按 BSA 计算替吉奥（S-1）常用分档。请展示分档和 bid 剂量，并提醒需结合具体方案、肾功能、说明书和医院规范。` }],
      structuredContent: { bsa: Number(bsa), ...result }
    }
  } catch (err) {
    return { isError: true, content: [{ type: 'text', text: `S-1 分档失败：${err.message}。请先提供 BSA，或提供身高体重用于计算 BSA。` }] }
  }
}

module.exports = calculateS1Dose
