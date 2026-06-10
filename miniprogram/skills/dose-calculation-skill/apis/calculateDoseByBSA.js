const { calculateDoseByBSAValue, round } = require('../utils/calc.js')

async function calculateDoseByBSA({ drugName, bsa, dosePerM2, totalDays } = {}) {
  try {
    const doseMg = calculateDoseByBSAValue(bsa, dosePerM2)
    const days = totalDays ? Number(totalDays) : null
    const totalDoseMg = days && days > 1 ? round(doseMg * days, 1) : null
    return {
      isError: false,
      content: [{ type: 'text', text: `已完成 ${drugName || '药物'} 的 mg/m² 剂量换算。请展示单次/每日剂量；如为连续多日给药，同时展示总量，并提醒需按医院取整规则和患者器官功能调整。` }],
      structuredContent: { drugName: drugName || '', bsa: Number(bsa), dosePerM2: Number(dosePerM2), doseMg, totalDays: days, totalDoseMg, formula: 'dose_mg = BSA × dose_mg_per_m2' }
    }
  } catch (err) {
    return { isError: true, content: [{ type: 'text', text: `剂量换算失败：${err.message}。请补充或核对 BSA 和 mg/m² 标准剂量。` }] }
  }
}

module.exports = calculateDoseByBSA
