const calculateBSA = require('./apis/calculateBSA.js')
const calculateDoseByBSA = require('./apis/calculateDoseByBSA.js')
const calculateCarboplatinDose = require('./apis/calculateCarboplatinDose.js')
const calculateS1Dose = require('./apis/calculateS1Dose.js')

const skill = wx.modelContext.createSkill('skills/dose-calculation-skill')

skill.registerAPI('calculateBSA', calculateBSA)
skill.registerAPI('calculateDoseByBSA', calculateDoseByBSA)
skill.registerAPI('calculateCarboplatinDose', calculateCarboplatinDose)
skill.registerAPI('calculateS1Dose', calculateS1Dose)

console.log('[dose-calculation-skill] APIs registered')
