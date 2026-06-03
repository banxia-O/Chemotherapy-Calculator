// pages/chemo/chemo.js
Page({
  data: {
    height: '',
    weight: '',
    bsa: '--',
    cancerTypes: [
      { id: 'nasopharynx', name: '鼻咽癌', group: '头颈部' },
      { id: 'head_neck', name: '头颈部鳞癌', group: '头颈部' },
      { id: 'lung_adeno', name: '肺腺癌（非鳞）', group: '胸部' },
      { id: 'lung_squamous', name: '肺鳞癌', group: '胸部' },
      { id: 'sclc', name: '小细胞肺癌', group: '胸部' },
      { id: 'esophagus', name: '食管癌', group: '胸部' },
      { id: 'breast', name: '乳腺癌', group: '胸部' },
      { id: 'gastric', name: '胃癌', group: '腹部' },
      { id: 'liver', name: '肝细胞癌', group: '腹部' },
      { id: 'biliary', name: '胆道肿瘤', group: '腹部' },
      { id: 'pancreas', name: '胰腺癌', group: '腹部' },
      { id: 'colorectal', name: '结直肠癌', group: '腹部' },
      { id: 'bladder', name: '膀胱癌/尿路上皮癌', group: '盆腔/泌尿生殖' },
      { id: 'prostate', name: '前列腺癌(mCRPC)', group: '盆腔/泌尿生殖' },
      { id: 'cervix', name: '宫颈癌', group: '盆腔/泌尿生殖' },
      { id: 'ovary', name: '卵巢癌', group: '盆腔/泌尿生殖' },
      { id: 'endometrium', name: '子宫内膜癌', group: '盆腔/泌尿生殖' },
      { id: 'sarcoma', name: '软组织肉瘤', group: '其他' },
      { id: 'osteosarcoma', name: '骨肉瘤', group: '其他' }
    ],
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

  regimens: {
    nasopharynx: [
      {
        name: "GP方案（吉西他滨+顺铂）",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 80, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "复发转移性鼻咽癌一线首选GP+PD-1抑制剂"
      }
    ],
    head_neck: [
      {
        name: "TPF方案（诱导化疗）",
        cycle: "21天为一周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU", dose: 750, unit: "mg/m²/d", schedule: "持续静滴 第1-5天", totalDays: 5 }
        ],
        notes: "诱导化疗方案，骨髓抑制重，需G-CSF支持"
      }
    ],
    lung_adeno: [
      {
        name: "PP方案（培美曲塞+铂类）",
        cycle: "21天为一周期",
        drugs: [
          { name: "培美曲塞", dose: 500, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5-6" }
        ],
        notes: "需预处理：叶酸、维生素B12、地塞米松"
      },
      {
        name: "AP方案（白蛋白紫杉醇+铂类）",
        cycle: "21天为一周期",
        drugs: [
          { name: "白蛋白结合型紫杉醇", dose: 260, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "无需抗过敏预处理"
      }
    ],
    lung_squamous: [
      {
        name: "GP方案（吉西他滨+铂类）",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5-6" }
        ],
        notes: "注意骨髓抑制，d8需复查血常规"
      }
    ],
    sclc: [
      {
        name: "EP方案（依托泊苷+顺铂）",
        cycle: "21天为一周期",
        drugs: [
          { name: "依托泊苷", dose: 100, unit: "mg/m²", schedule: "第1-3天", totalDays: 3 },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "局限期同步放化疗首选；广泛期推荐EP+PD-L1抑制剂"
      },
      {
        name: "EC方案（依托泊苷+卡铂）",
        cycle: "21天为一周期",
        drugs: [
          { name: "依托泊苷", dose: 100, unit: "mg/m²", schedule: "第1-3天", totalDays: 3 },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "肾功能不全或老年患者可优选卡铂"
      }
    ],
    esophagus: [
      {
        name: "TP方案（紫杉醇+顺铂）",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "食管鳞癌一线可联合PD-1抑制剂"
      }
    ],
    breast: [
      {
        name: "AC方案（蒽环+环磷酰胺）",
        cycle: "21天为一周期 × 4周期",
        drugs: [
          { name: "多柔比星", dose: 60, unit: "mg/m²", schedule: "第1天" },
          { name: "环磷酰胺", dose: 600, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "AC后序贯T；注意蒽环累积剂量心脏毒性"
      },
      {
        name: "TC方案（多西他赛+环磷酰胺）",
        cycle: "21天为一周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "环磷酰胺", dose: 600, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "蒽环类禁忌者的替代方案"
      }
    ],
    gastric: [
      {
        name: "SOX方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "替吉奥（S-1）", dose: null, unit: "按BSA分档", schedule: "第1-14天口服 bid", isS1: true }
        ],
        notes: "中国人群常用方案"
      },
      {
        name: "XELOX方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "手足综合征常见"
      }
    ],
    liver: [
      {
        name: "FOLFOX4方案",
        cycle: "14天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 200, unit: "mg/m²", schedule: "第1、2天", totalDays: 2 },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1、2天", totalDays: 2 },
          { name: "5-FU 持续泵注", dose: 600, unit: "mg/m²", schedule: "22h静滴 第1、2天", totalDays: 2 }
        ],
        notes: "目前一线首选靶向+免疫，化疗作为后线选择"
      }
    ],
    biliary: [
      {
        name: "GC方案（吉西他滨+顺铂）",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 25, unit: "mg/m²", schedule: "第1、8天" }
        ],
        notes: "ABC-02研究确立的标准方案"
      }
    ],
    pancreas: [
      {
        name: "FOLFIRINOX方案",
        cycle: "14天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "伊立替康", dose: 180, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 2400, unit: "mg/m²", schedule: "持续静滴46h" }
        ],
        notes: "适用于PS 0-1、胆红素正常的患者；毒性大"
      },
      {
        name: "AG方案",
        cycle: "28天为一周期",
        drugs: [
          { name: "白蛋白结合型紫杉醇", dose: 125, unit: "mg/m²", schedule: "第1、8、15天" },
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8、15天" }
        ],
        notes: "耐受性优于FOLFIRINOX"
      }
    ],
    colorectal: [
      {
        name: "mFOLFOX6方案",
        cycle: "14天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 2400, unit: "mg/m²", schedule: "持续静滴46h" }
        ],
        notes: "注意奥沙利铂累积剂量外周神经毒性"
      },
      {
        name: "CapeOX方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "手足综合征常见"
      }
    ],
    bladder: [
      {
        name: "GC方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 70, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "顺铂适用条件：肌酐清除率≥60ml/min、PS 0-1"
      }
    ],
    prostate: [
      {
        name: "多西他赛方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "泼尼松", dose: 5, unit: "mg bid（固定剂量）", schedule: "持续口服", isFixed: true }
        ],
        notes: "mCRPC化疗标准方案"
      }
    ],
    cervix: [
      {
        name: "TP方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 50, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "晚期可联合贝伐珠单抗及PD-1抑制剂"
      },
      {
        name: "TC方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "同期放化疗用单药顺铂40mg/m² qw"
      }
    ],
    ovary: [
      {
        name: "TC方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "上皮性卵巢癌术后标准一线方案"
      }
    ],
    endometrium: [
      {
        name: "TC方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "可联合PD-1抑制剂（特别是dMMR/MSI-H患者）"
      }
    ],
    sarcoma: [
      {
        name: "AI方案",
        cycle: "21天为一周期",
        drugs: [
          { name: "多柔比星", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "异环磷酰胺", dose: 2000, unit: "mg/m²", schedule: "第1-4天", totalDays: 4 },
          { name: "美司钠", dose: 2000, unit: "mg/m²", schedule: "等量IFO分次给予", totalDays: 4 }
        ],
        notes: "骨髓抑制及出血性膀胱炎风险高；需G-CSF支持"
      }
    ],
    osteosarcoma: [
      {
        name: "MAP方案",
        cycle: "按具体疗程安排",
        drugs: [
          { name: "甲氨蝶呤（高剂量）", dose: 12000, unit: "mg/m²", schedule: "需亚叶酸钙解救", isHDMTX: true },
          { name: "多柔比星", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "单次或分次" }
        ],
        notes: "高剂量甲氨蝶呤需监测血药浓度、尿碱化、水化"
      }
    ]
  },

  onHeightInput: function(e) {
    this.setData({ height: e.detail.value });
    this.calculateBSA();
  },

  onWeightInput: function(e) {
    this.setData({ weight: e.detail.value });
    this.calculateBSA();
  },

  calculateBSA: function() {
    var h = parseFloat(this.data.height);
    var w = parseFloat(this.data.weight);
    if (h > 0 && w > 0) {
      var bsa = Math.sqrt((h * w) / 3600).toFixed(2);
      this.setData({ bsa: bsa });
    } else {
      this.setData({ bsa: '--' });
    }
  },

  onCancerChange: function(e) {
    var index = e.detail.value;
    var cancer = this.data.cancerTypes[index];
    var regimenList = this.regimens[cancer.id] || [];
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

    var bsaNum = parseFloat(bsa);
    var drugs = selectedRegimen.drugs.map(function(drug) {
      var calculatedDose = '';
      var standardDisplay = drug.range ? drug.range + drug.unit : drug.dose + drug.unit;

      if (drug.isAUC) {
        calculatedDose = '需根据肌酐清除率计算';
        standardDisplay = drug.unit;
      } else if (drug.isS1) {
        if (bsaNum < 1.25) {
          calculatedDose = '40mg bid';
        } else if (bsaNum <= 1.5) {
          calculatedDose = '50mg bid';
        } else {
          calculatedDose = '60mg bid';
        }
        standardDisplay = 'BSA ' + bsa + 'm²';
      } else if (drug.isFixed) {
        calculatedDose = drug.dose + drug.unit.replace('（固定剂量）', '');
        standardDisplay = '固定剂量';
      } else if (drug.isHDMTX) {
        calculatedDose = (drug.dose * bsaNum).toFixed(0) + ' mg';
      } else if (drug.totalDays) {
        calculatedDose = (drug.dose * bsaNum).toFixed(1) + ' mg/d × ' + drug.totalDays + '天';
      } else {
        calculatedDose = (drug.dose * bsaNum).toFixed(1) + ' mg';
      }

      return {
        name: drug.name,
        dose: drug.dose,
        unit: drug.unit,
        schedule: drug.schedule,
        alt: drug.alt,
        isAUC: drug.isAUC,
        standardDisplay: standardDisplay,
        calculatedDose: calculatedDose
      };
    });

    that.setData({
      showResult: true,
      resultData: {
        name: selectedRegimen.name,
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

    var ageNum = parseFloat(age);
    var weightNum = parseFloat(weight);
    var creatinineNum = parseFloat(creatinine);
    var auc = aucValues[targetAUC];

    var creatinineMgDl = creatinineNum / 88.4;
    var gfr = ((140 - ageNum) * weightNum) / (72 * creatinineMgDl);
    if (gender == 0) {
      gfr = gfr * 0.85;
    }
    gfr = Math.min(gfr, 125);

    var carboDose = auc * (gfr + 25);

    that.setData({
      carboResult: {
        dose: carboDose.toFixed(0),
        gfr: gfr.toFixed(1)
      }
    });
  }
});