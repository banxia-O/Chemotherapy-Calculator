const { calculateCarboplatinDoseValue } = require('../utils/calc.js')

async function calculateCarboplatinDose(args = {}) {
  try {
    const result = calculateCarboplatinDoseValue(args)
    return {
      isError: false,
      content: [{ type: 'text', text: `已按 Cockcroft-Gault + Calvert 公式计算卡铂剂量。请展示 GFR/CrCl、是否封顶、卡铂剂量，并提醒血肌酐单位默认为 μmol/L，需结合肾功能和骨髓储备复核。` }],
      structuredContent: {
        age: Number(args.age),
        sex: args.sex,
        weightKg: Number(args.weightKg),
        creatinineUmolL: Number(args.creatinineUmolL),
        targetAUC: Number(args.targetAUC),
        formula: 'Calvert: dose = AUC × (GFR + 25); GFR by Cockcroft-Gault; GFR capped at 125 mL/min',
        ...result
      }
    }
  } catch (err) {
    return { isError: true, content: [{ type: 'text', text: `卡铂计算失败：${err.message}。请确认年龄、性别、体重 kg、血肌酐 μmol/L 和目标 AUC。` }] }
  }
}

module.exports = calculateCarboplatinDose
