// 通用剂量计算工具：供普通小程序页面使用。
//
// ⚠️ 同源副本提醒：BSA / S-1 分档 / 卡铂(Cockcroft-Gault+Calvert) 等公式
// 在 skills/dose-calculation-skill/utils/calc.js 另有一份。
// 微信 AI skill 是独立分包，不能跨包 require 主包代码，故刻意保留两份，
// 而非为了「优雅」强行合一（合一会触发独立分包运行时限制）。
// 修改任一公式（尤其剂量边界）时，必须同步修改另一份，否则两端结果会漂移。

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function round(value, digits) {
  const p = Math.pow(10, digits || 0)
  return Math.round(value * p) / p
}

function calculateBSAValue(heightCm, weightKg) {
  const h = toNumber(heightCm)
  const w = toNumber(weightKg)
  if (!h || !w || h <= 0 || w <= 0) return null
  return round(Math.sqrt((h * w) / 3600), 2)
}

function calculateS1DoseByBSA(bsa) {
  const b = toNumber(bsa)
  if (!b || b <= 0) return null
  // S-1 分档边界按说明书：BSA<1.25→40；1.25≤BSA<1.5→50；BSA≥1.5→60
  if (b < 1.25) return '40mg bid'
  if (b < 1.5) return '50mg bid'
  return '60mg bid'
}

function calculateDrugDose(drug, bsa) {
  const bsaNum = toNumber(bsa)
  if (!drug || !bsaNum) return ''

  if (drug.isAUC) {
    return '需根据肌酐清除率计算'
  }
  if (drug.isS1) {
    return calculateS1DoseByBSA(bsaNum)
  }
  if (drug.isFixed) {
    return drug.dose + drug.unit.replace('（固定剂量）', '')
  }
  if (drug.isHDMTX) {
    return (drug.dose * bsaNum).toFixed(0) + ' mg'
  }
  if (drug.totalDays) {
    return (drug.dose * bsaNum).toFixed(1) + ' mg/d × ' + drug.totalDays + '天'
  }
  return (drug.dose * bsaNum).toFixed(1) + ' mg'
}

function buildStandardDisplay(drug, bsa) {
  if (drug.isAUC) return drug.unit
  if (drug.isS1) return 'BSA ' + bsa + 'm²'
  if (drug.isFixed) return '固定剂量'
  return drug.range ? drug.range + drug.unit : drug.dose + drug.unit
}

function calculateRegimenDoses(regimen, bsa) {
  if (!regimen || !Array.isArray(regimen.drugs)) return []
  return regimen.drugs.map(function(drug) {
    return {
      name: drug.name,
      dose: drug.dose,
      unit: drug.unit,
      schedule: drug.schedule,
      alt: drug.alt,
      isAUC: drug.isAUC,
      standardDisplay: buildStandardDisplay(drug, bsa),
      calculatedDose: calculateDrugDose(drug, bsa)
    }
  })
}

function calculateCarboplatinDoseValue(age, weightKg, gender, creatinineUmolL, targetAUC) {
  const ageNum = toNumber(age)
  const weightNum = toNumber(weightKg)
  const creatinineNum = toNumber(creatinineUmolL)
  const auc = toNumber(targetAUC)
  if (!ageNum || !weightNum || !creatinineNum || !auc) return null

  const creatinineMgDl = creatinineNum / 88.4
  let gfr = ((140 - ageNum) * weightNum) / (72 * creatinineMgDl)
  if (gender == 0) {
    gfr = gfr * 0.85
  }
  gfr = Math.min(gfr, 125)

  return {
    dose: (auc * (gfr + 25)).toFixed(0),
    gfr: gfr.toFixed(1)
  }
}

module.exports = {
  calculateBSAValue,
  calculateS1DoseByBSA,
  calculateDrugDose,
  calculateRegimenDoses,
  calculateCarboplatinDoseValue
}
