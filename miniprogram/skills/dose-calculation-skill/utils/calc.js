// AI skill 专用剂量计算工具（独立分包，不可跨包 require 主包代码）。
//
// ⚠️ 同源副本提醒：本文件的 BSA / S-1 分档 / 卡铂公式与主包
// miniprogram/utils/calc.js 是同一套医学公式的两份实现。
// 二者刻意分开：本文件供微信 AI skill 调用，需抛错+参数校验；
// 主包那份供页面调用，缺参返回 null。公式本身必须保持一致。
// 修改任一剂量边界/公式时，务必同步修改另一份，否则两端结果会漂移。

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
  if (!h || !w || h <= 0 || w <= 0) throw new Error('身高和体重必须为正数')
  if (h < 50 || h > 250) throw new Error('身高超出常见成人/儿童范围，请核对单位是否为 cm')
  if (w < 2 || w > 300) throw new Error('体重超出常见范围，请核对单位是否为 kg')
  return round(Math.sqrt((h * w) / 3600), 2)
}

function calculateDoseByBSAValue(bsa, dosePerM2) {
  const b = toNumber(bsa)
  const d = toNumber(dosePerM2)
  if (!b || !d || b <= 0 || d <= 0) throw new Error('BSA 和 mg/m² 剂量必须为正数')
  if (b < 0.2 || b > 3.0) throw new Error('BSA 超出常见范围，请核对输入')
  return round(b * d, 1)
}

function calculateCarboplatinDoseValue({ age, sex, weightKg, creatinineUmolL, targetAUC }) {
  const a = toNumber(age)
  const w = toNumber(weightKg)
  const scr = toNumber(creatinineUmolL)
  const auc = toNumber(targetAUC)
  if (!a || !w || !scr || !auc || a <= 0 || w <= 0 || scr <= 0 || auc <= 0) {
    throw new Error('年龄、体重、血肌酐和 AUC 必须为正数')
  }
  if (a < 1 || a > 120) throw new Error('年龄超出常见范围，请核对')
  if (w < 2 || w > 300) throw new Error('体重超出常见范围，请核对单位是否为 kg')
  if (scr < 10 || scr > 2000) throw new Error('血肌酐超出常见 μmol/L 范围，请核对单位')
  if (auc < 1 || auc > 10) throw new Error('AUC 超出常见化疗计算范围，请核对')

  const normalizedSex = String(sex || '').toLowerCase()
  const female = ['female', 'f', 'woman', '女', '女性'].includes(normalizedSex)
  const male = ['male', 'm', 'man', '男', '男性'].includes(normalizedSex)
  if (!female && !male) throw new Error('性别需为 male/female 或 男/女')

  const creatinineMgDl = scr / 88.4
  let gfr = ((140 - a) * w) / (72 * creatinineMgDl)
  if (female) gfr *= 0.85
  const rawGfr = gfr
  gfr = Math.min(gfr, 125)
  const dose = auc * (gfr + 25)
  return {
    rawGfr: round(rawGfr, 1),
    cappedGfr: round(gfr, 1),
    gfrCapped: rawGfr > 125,
    doseMg: Math.round(dose)
  }
}

function calculateS1DoseValue(bsa) {
  const b = toNumber(bsa)
  if (!b || b <= 0) throw new Error('BSA 必须为正数')
  if (b < 0.2 || b > 3.0) throw new Error('BSA 超出常见范围，请核对输入')
  // S-1 分档边界按说明书：BSA<1.25→40；1.25≤BSA<1.5→50；BSA≥1.5→60
  if (b < 1.25) return { dose: '40mg bid', band: 'BSA < 1.25 m²' }
  if (b < 1.5) return { dose: '50mg bid', band: '1.25 ≤ BSA < 1.50 m²' }
  return { dose: '60mg bid', band: 'BSA ≥ 1.50 m²' }
}

module.exports = {
  calculateBSAValue,
  calculateDoseByBSAValue,
  calculateCarboplatinDoseValue,
  calculateS1DoseValue,
  round
}
