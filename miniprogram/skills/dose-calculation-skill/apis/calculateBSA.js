const { calculateBSAValue } = require('../utils/calc.js')

async function calculateBSA({ heightCm, weightKg } = {}) {
  try {
    const bsa = calculateBSAValue(heightCm, weightKg)
    return {
      isError: false,
      content: [{ type: 'text', text: `已按 Mosteller 公式计算 BSA。接下来请展示结果，并提醒结果仅供医护人员剂量核对参考。` }],
      structuredContent: { heightCm: Number(heightCm), weightKg: Number(weightKg), formula: 'sqrt(height_cm × weight_kg / 3600)', bsa }
    }
  } catch (err) {
    return { isError: true, content: [{ type: 'text', text: `BSA 计算失败：${err.message}。请让用户核对身高 cm 和体重 kg。` }] }
  }
}

module.exports = calculateBSA
