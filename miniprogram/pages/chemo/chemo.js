// pages/chemo/chemo.js
const chemoData = require('../../utils/chemoData.js')
const doseCalc = require('../../utils/calc.js')
Page({
  data: {
    height: '',
    weight: '',
    bsa: '--',
    cancerTypes: chemoData.cancerTypes,
    selectedCancerIndex: null,
    selectedCancer: null,
    regimenList: [],
    selectedRegimenIndex: null,
    selectedRegimen: null,
    age: '',
    gender: 0,
    genderOptions: ['女', '男'],
    creatinine: '',
    targetAUC: 1,
    aucOptions: ['AUC 5', 'AUC 6', 'AUC 5.5'],
    aucValues: [5, 6, 5.5],
    carboResult: null,
    showResult: false,
    resultData: null
  },

  regimens: chemoData.regimens,

  onHeightInput: function(e) {
    this.setData({ height: e.detail.value });
    this.calculateBSA();
  },

  onWeightInput: function(e) {
    this.setData({ weight: e.detail.value });
    this.calculateBSA();
  },

  calculateBSA: function() {
    var bsa = doseCalc.calculateBSAValue(this.data.height, this.data.weight);
    this.setData({ bsa: bsa ? bsa.toFixed(2) : '--' });
  },

  onCancerChange: function(e) {
    var index = e.detail.value;
    var cancer = this.data.cancerTypes[index];
    var rawList = this.regimens[cancer.id] || [];
    // 给下拉框生成带治疗场景的标签，便于区分新辅助/辅助/根治性/晚期等
    var regimenList = rawList.map(function(r) {
      return Object.assign({}, r, {
        pickerLabel: r.setting ? '【' + r.setting + '】' + r.name : r.name
      });
    });
    this.setData({
      selectedCancerIndex: index,
      selectedCancer: cancer,
      regimenList: regimenList,
      selectedRegimenIndex: null,
      selectedRegimen: null,
      showResult: false
    });
  },

  onRegimenChange: function(e) {
    var index = e.detail.value;
    var regimen = this.data.regimenList[index];
    this.setData({
      selectedRegimenIndex: index,
      selectedRegimen: regimen
    });
  },

  calculate: function() {
    var that = this;
    var height = that.data.height;
    var weight = that.data.weight;
    var bsa = that.data.bsa;
    var selectedRegimen = that.data.selectedRegimen;

    if (!height || !weight) {
      wx.showToast({ title: '请输入身高和体重', icon: 'none' });
      return;
    }
    if (!selectedRegimen) {
      wx.showToast({ title: '请选择化疗方案', icon: 'none' });
      return;
    }

    var drugs = doseCalc.calculateRegimenDoses(selectedRegimen, bsa);

    that.setData({
      showResult: true,
      resultData: {
        name: selectedRegimen.name,
        setting: selectedRegimen.setting || '',
        cycle: selectedRegimen.cycle,
        drugs: drugs,
        notes: selectedRegimen.notes
      }
    });

    wx.pageScrollTo({ selector: '#result', duration: 300 });
  },

  onAgeInput: function(e) {
    this.setData({ age: e.detail.value });
  },

  onGenderChange: function(e) {
    this.setData({ gender: e.detail.value });
  },

  onCreatinineInput: function(e) {
    this.setData({ creatinine: e.detail.value });
  },

  onAUCChange: function(e) {
    this.setData({ targetAUC: e.detail.value });
  },

  calculateCarboplatin: function() {
    var that = this;
    var age = that.data.age;
    var weight = that.data.weight;
    var gender = that.data.gender;
    var creatinine = that.data.creatinine;
    var targetAUC = that.data.targetAUC;
    var aucValues = that.data.aucValues;

    if (!age || !weight || !creatinine) {
      wx.showToast({ title: '请填写年龄、体重和血肌酐', icon: 'none' });
      return;
    }

    var result = doseCalc.calculateCarboplatinDoseValue(age, weight, gender, creatinine, aucValues[targetAUC]);

    that.setData({
      carboResult: result
    });
  }
});