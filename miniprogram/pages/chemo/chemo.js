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
        setting: "诱导化疗",
        cycle: "21天为一周期 × 2-3周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 80, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐（1A类）。基于Zhang et al. NEJM 2019 (PMID: 31150573)，GP诱导→同期放化疗较单纯同期放化疗显著改善PFS和OS。📌 顺铂需充分水化，吉西他滨d8需查血常规，中性粒<1.0×10⁹/L或PLT<75×10⁹/L时考虑延迟或减量。 ｜ 给药：充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "TPF方案（多西他赛+顺铂+5-FU）",
        setting: "诱导化疗",
        cycle: "21天为一周期 × 3周期",
        drugs: [
          { name: "多西他赛", dose: 60, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 60, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU", dose: 600, unit: "mg/m²/d", schedule: "持续静滴 第1-5天", totalDays: 5 }
        ],
        notes: "CSCO II级推荐。📌 NPC的TPF剂量低于头颈鳞癌TPF标准剂量（75/75/750），注意区分。毒性主要为骨髓抑制和黏膜炎，需预防性G-CSF。 ｜ 给药：地塞米松预处理、充分水化、预防呕吐、G-CSF支持、深静脉置管，避光；地塞米松8mg bid d-1至d1预处理；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "单药顺铂",
        setting: "根治性同期放化疗",
        cycle: "21天为一周期（d1、22、43）",
        drugs: [
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "放疗第1、22、43天", alt: "或40mg/m² 每周方案" }
        ],
        notes: "CSCO I级推荐。📌 若耐受差可改为40 mg/m² qw方案（II级推荐），但循证强度略低。需关注肾毒性（水化+监测eGFR）、耳毒性、恶心呕吐（需三联止吐）。 ｜ 给药：充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "GP方案 + PD-1抑制剂",
        setting: "复发/转移一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 80, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐（1A类）。PD-1抑制剂选择：卡瑞利珠单抗200mg q3w（CAPTAIN-1st, PMID: 37075753）或特瑞普利单抗240mg q3w（JUPITER-02, PMID: 34302779），均为NMPA获批适应症。📌 CSCO 2026版维持GP+PD-1为一线首选地位不变。 ｜ 给药：充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代"
      }
    ],
    head_neck: [
      {
        name: "TPF方案（多西他赛+顺铂+5-FU）",
        setting: "诱导化疗",
        cycle: "21天为一周期 × 3周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU", dose: 750, unit: "mg/m²/d", schedule: "持续静滴 第1-5天", totalDays: 5 }
        ],
        notes: "基于TAX323/TAX324研究。📌 头颈鳞癌TPF剂量（75/75/750）高于NPC-TPF（60/60/600），勿混淆。3-4级中性粒减少发生率高（>70%），建议预防性G-CSF或PEG-G-CSF。 ｜ 给药：地塞米松预处理、充分水化、预防呕吐、G-CSF支持；地塞米松8mg bid d-1至d1预处理；CrCl<60mL/min考虑卡铂替代；深静脉置管，避光输注"
      },
      {
        name: "单药顺铂",
        setting: "根治性/术后同期放化疗",
        cycle: "21天为一周期（d1、22、43）",
        drugs: [
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "放疗第1、22、43天", alt: "或40mg/m² 每周方案" }
        ],
        notes: "CSCO I级推荐。📌 术后辅助放化疗指征：切缘阳性（R1）和/或淋巴结外侵犯（ENE+）。单周方案（40 mg/m² qw）循证等级稍低但耐受性更好，适合老年或肾功能边界患者。 ｜ 给药：充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "EXTREME方案（顺铂/卡铂+5-FU+西妥昔单抗）",
        setting: "复发/转移一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" },
          { name: "5-FU", dose: 1000, unit: "mg/m²/d", schedule: "持续静滴 第1-4天", totalDays: 4 }
        ],
        notes: "西妥昔单抗首剂400 mg/m²（2h），后续250 mg/m² qw（1h）。📌 可用卡铂AUC 5替代顺铂（顺铂不耐受时）。CSCO II级推荐（KEYNOTE-048后地位有所下降）。 ｜ 给药：西妥昔单抗首次400mg/m²，后续250mg/m²每周；充分水化、预防呕吐；卡铂时溶媒用5% GS；CrCl<60mL/min考虑卡铂替代；血小板<50×10⁹/L时IL-11/TPO支持；深静脉置管，避光输注"
      },
      {
        name: "帕博利珠单抗 + 顺铂 + 5-FU",
        setting: "复发/转移一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "帕博利珠单抗", dose: 200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" },
          { name: "5-FU", dose: 1000, unit: "mg/m²/d", schedule: "持续静滴 第1-4天", totalDays: 4 }
        ],
        notes: "CSCO I级推荐（1A类），基于KEYNOTE-048。📌 CPS≥1即可获益；CPS≥20时帕博利珠单抗单药也是I级推荐选项。可用卡铂AUC 5替代顺铂。 ｜ 给药：充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代；深静脉置管，避光输注"
      }
    ],
    lung_adeno: [
      {
        name: "PP方案（培美曲塞+铂类）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "培美曲塞", dose: 500, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" }
        ],
        notes: "CSCO II级推荐（驱动基因阴性、PD-L1低表达、不适合免疫治疗时）。📌 培美曲塞需提前7天开始补充叶酸（400μg/d口服）和维生素B12（1000μg肌注q9w），减少骨髓抑制和黏膜毒性。可用卡铂AUC 5替代顺铂。 ｜ 给药：地塞米松预处理、补充叶酸和维生素B12、预防呕吐、充分水化；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "培美曲塞 + 卡铂 + 帕博利珠单抗",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "帕博利珠单抗", dose: 200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "培美曲塞", dose: 500, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类），基于KEYNOTE-189。📌 无论PD-L1表达水平均适用；驱动基因阳性者不选此方案。 ｜ 给药：地塞米松预处理、补充叶酸和维生素B12；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "AP方案（白蛋白紫杉醇+卡铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "白蛋白结合型紫杉醇", dose: 260, unit: "mg/m²", schedule: "第1天", alt: "或100mg/m² d1,8,15" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "📌 另有周剂量方案：白蛋白紫杉醇100 mg/m² d1,d8,d15 + 卡铂AUC 6 d1 q3w（CSCO同时收录，周方案血液学毒性可能更低但需多次输注）。CSCO II级推荐。 ｜ 给药：禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "PP方案（培美曲塞+顺铂）",
        setting: "术后辅助",
        cycle: "21天为一周期 × 4周期",
        drugs: [
          { name: "培美曲塞", dose: 500, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐（II-IIIA期非鳞NSCLC，术后辅助化疗）。📌 CSCO 2026新增：EGFR敏感突变阳性者术后辅助化疗后序贯奥希替尼/阿美替尼辅助治疗（I级推荐）。 ｜ 给药：地塞米松预处理、补充叶酸和维生素B12、预防呕吐、充分水化；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "NP方案（长春瑞滨+顺铂）",
        setting: "术后辅助",
        cycle: "21天为一周期 × 4周期",
        drugs: [
          { name: "长春瑞滨", dose: 25, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐。📌 长春瑞滨为发疱剂，必须经中心静脉给药（PICC/PORT），外渗可致组织坏死。 ｜ 给药：预防呕吐、充分水化、G-CSF支持；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "含铂双药 + 纳武利尤单抗（新辅助）",
        setting: "新辅助",
        cycle: "21天为一周期 × 3周期",
        drugs: [
          { name: "纳武利尤单抗", dose: 360, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "培美曲塞", dose: 500, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" }
        ],
        notes: "CSCO I级推荐（1A类），基于CheckMate 816。📌 化疗方案需根据组织学选择：非鳞选培美曲塞+铂类，鳞癌选紫杉醇/白蛋白紫杉醇+卡铂。CSCO 2026版同时推荐帕博利珠单抗/替雷利珠单抗/度伐利尤单抗联合含铂化疗的围手术期方案（I级推荐）。 ｜ 给药：地塞米松预处理、补充叶酸和维生素B12、充分水化；CrCl<60mL/min考虑卡铂替代"
      }
    ],
    lung_squamous: [
      {
        name: "TC方案（白蛋白紫杉醇+卡铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "白蛋白结合型紫杉醇", dose: 100, unit: "mg/m²", schedule: "第1、8、15天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "📌 周剂量方案同样可选：白蛋白紫杉醇100 mg/m² d1,d8,d15 + 卡铂AUC 6 d1 q3w。CSCO II级推荐。 ｜ 给药：禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "GP方案（吉西他滨+顺铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1250, unit: "mg/m²", schedule: "第1、8天", range: "1000-1250" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" }
        ],
        notes: "CSCO II级推荐。📌 吉西他滨也可用1000 mg/m²（临床常用），二者均被认可。 ｜ 给药：预防呕吐、充分水化；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "TP方案（紫杉醇+顺铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" }
        ],
        notes: "CSCO II级推荐。📌 经典含铂双药方案，紫杉醇175 mg/m² + 顺铂75 mg/m² q3w。顺铂不耐受者可用卡铂AUC 5替代。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "紫杉醇 + 卡铂 + 帕博利珠单抗",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "帕博利珠单抗", dose: 200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天", alt: "或白蛋白紫杉醇100 d1,8,15" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类），基于KEYNOTE-407。📌 也可用白蛋白紫杉醇100 mg/m² d1,d8,d15替代溶剂型紫杉醇（原研中两种紫杉醇均纳入）。CSCO 2026版同时推荐卡瑞利珠单抗/替雷利珠单抗/信迪利单抗/舒格利单抗等国产PD-1/PD-L1联合化疗为I级推荐。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "NP方案（长春瑞滨+顺铂）",
        setting: "术后辅助",
        cycle: "21天为一周期 × 4周期",
        drugs: [
          { name: "长春瑞滨", dose: 25, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐。同肺腺癌NP辅助方案。 ｜ 给药：预防呕吐、充分水化、G-CSF支持；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "紫杉醇 + 卡铂 + 纳武利尤单抗（新辅助）",
        setting: "新辅助",
        cycle: "21天为一周期 × 3周期",
        drugs: [
          { name: "纳武利尤单抗", dose: 360, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类），基于CheckMate 816。📌 鳞癌不可用培美曲塞。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      }
    ],
    sclc: [
      {
        name: "EP方案（依托泊苷+顺铂）",
        setting: "局限期同期放化疗",
        cycle: "21天为一周期 × 4周期",
        drugs: [
          { name: "依托泊苷", dose: 100, unit: "mg/m²", schedule: "第1-3天", totalDays: 3 },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或分d1-3给药，25mg/m²/d" }
        ],
        notes: "CSCO I级推荐（1A类）。📌 顺铂也可分次给药25 mg/m² d1-3。放疗推荐：45Gy/30f bid或60-70Gy qd。CSCO 2026版新增：同步放化疗后斯鲁利单抗巩固治疗纳入推荐（基于ASTRUM-LC01，II期）。PCI：完全缓解者推荐预防性全脑照射（25Gy/10f）。 ｜ 给药：预防呕吐、充分水化；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "EC + 阿替利珠单抗",
        setting: "广泛期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "阿替利珠单抗", dose: 1200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "依托泊苷", dose: 100, unit: "mg/m²", schedule: "第1-3天", totalDays: 3 },
          { name: "卡铂", dose: null, unit: "AUC 5", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类，优选），基于IMpower133。📌 CSCO 2026版新增：阿替利珠单抗维持阶段可联合芦比替定（lurbinectedin）维持（II级推荐，基于IMforte研究）。 ｜ 给药：预防呕吐；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "EP/EC + 度伐利尤单抗",
        setting: "广泛期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "度伐利尤单抗", dose: 1500, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "依托泊苷", dose: 100, unit: "mg/m²", schedule: "第1-3天", totalDays: 3 },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" }
        ],
        notes: "CSCO I级推荐（1A类，优选），基于CASPIAN。📌 也可联合卡铂（AUC 5 d1）替代顺铂。CSCO 2026版新增索卡佐利单抗+EC为I级推荐（基于ASTRUM-019）。 ｜ 给药：预防呕吐、充分水化；卡铂时溶媒用5% GS；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "EC方案（依托泊苷+卡铂）",
        setting: "广泛期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "依托泊苷", dose: 100, unit: "mg/m²", schedule: "第1-3天", totalDays: 3 },
          { name: "卡铂", dose: null, unit: "AUC 5", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO II级推荐（不联合免疫时）。📌 CSCO 2026版明确：化疗+免疫已作为ES-SCLC一线'优选'推荐，单纯化疗地位下降，仅在免疫禁忌时选用。 ｜ 给药：预防呕吐；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      }
    ],
    esophagus: [
      {
        name: "CROSS方案（紫杉醇+卡铂+放疗）",
        setting: "新辅助同期放化疗",
        cycle: "每周方案 × 5周",
        drugs: [
          { name: "紫杉醇", dose: 50, unit: "mg/m²", schedule: "每周第1天 × 5" },
          { name: "卡铂", dose: null, unit: "AUC 2", schedule: "每周第1天 × 5", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类）。📌 CROSS方案的化疗剂量远低于全身治疗剂量（放疗增敏目的），注意不要与晚期化疗剂量混淆。适用于可切除食管癌（cT1N1-3M0或cT2-4aNanyM0）。 ｜ 给药：同步放疗；地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "TP方案（紫杉醇+顺铂）",
        setting: "新辅助化疗",
        cycle: "21天为一周期 × 2-4周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天", alt: "或135mg/m²；或多西他赛75mg/m²" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或奈达铂" }
        ],
        notes: "CSCO II级推荐。📌 新辅助化疗（不含放疗）循证等级低于CROSS方案（新辅助放化疗），主要用于不适合放疗或拒绝放疗者。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；充分水化；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "PF方案（顺铂+5-FU）",
        setting: "根治性同期放化疗",
        cycle: "28天为一周期",
        drugs: [
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", range: "75-100" },
          { name: "5-FU", dose: 1000, unit: "mg/m²/d", schedule: "持续静滴 第1-4天", totalDays: 4 }
        ],
        notes: "CSCO I级推荐（不可切除食管癌根治性放化疗）。📌 也可用卡培他滨或替吉奥替代5-FU静脉方案（CSCO II级推荐），口服方便且毒性谱不同。放疗剂量：50-50.4Gy/25-28f（鳞癌可至60Gy）。 ｜ 给药：预防呕吐、充分水化；CrCl<60mL/min考虑卡铂替代；深静脉置管，避光输注"
      },
      {
        name: "TP方案 + PD-1抑制剂",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐（1A类）。📌 PD-1选择：卡瑞利珠单抗（ESCORT-1st）、帕博利珠单抗（KEYNOTE-590）、替雷利珠单抗（RATIONALE-306）、特瑞普利单抗（JUPITER-06）等均为获批适应症。化疗也可选用5-FU+顺铂（PF方案）。鳞癌为主要适用人群。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；充分水化；CrCl<60mL/min考虑卡铂替代"
      }
    ],
    breast: [
      {
        name: "AC→T 序贯（剂量密集）",
        setting: "新辅助/术后辅助(HER2-)",
        cycle: "AC q2w×4 → 紫杉醇 q2w×4",
        drugs: [
          { name: "多柔比星", dose: 60, unit: "mg/m²", schedule: "AC阶段 第1天" },
          { name: "环磷酰胺", dose: 600, unit: "mg/m²", schedule: "AC阶段 第1天" },
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "序贯阶段 第1天" }
        ],
        notes: "CSCO I级推荐。📌 剂量密集方案（ddAC→T）必须联合G-CSF支持（PEG-G-CSF次日给药或常规G-CSF d3-10）。若用多西他赛替代紫杉醇则为100 mg/m² q3w × 4。常规q3w方案：AC q3w × 4 → T q3w × 4也可选用（非剂量密集）。蒽环累积剂量需关注心脏毒性（多柔比星终身上限450-550 mg/m²）。 ｜ 给药：G-CSF支持；多柔比星注意累积剂量上限；紫杉醇地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；右丙亚胺(DZE)可预防心脏毒性；大剂量需美司钠预防出血性膀胱炎"
      },
      {
        name: "TC方案（多西他赛+环磷酰胺）",
        setting: "术后辅助(HER2-)",
        cycle: "21天为一周期 × 4-6周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "环磷酰胺", dose: 600, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO II级推荐。📌 适用于不宜蒽环（心功能风险）或低危患者。US Oncology 9735研究为支持证据。 ｜ 给药：地塞米松预处理、预防呕吐；地塞米松8mg bid d-1至d1预处理；大剂量需美司钠预防出血性膀胱炎"
      },
      {
        name: "TCbHP（多西他赛+卡铂+曲妥珠+帕妥珠）",
        setting: "新辅助/术后辅助(HER2+)",
        cycle: "21天为一周期 × 6周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类）。曲妥珠单抗首剂8 mg/kg，后续6 mg/kg q3w；帕妥珠单抗首剂840 mg，后续420 mg q3w。📌 靶向治疗持续至术后满1年。新辅助未达pCR者术后可换T-DM1辅助（KATHERINE研究，CSCO I级推荐）。 ｜ 给药：曲妥珠单抗首次8mg/kg→6mg/kg Q3W，帕妥珠单抗首次840mg→420mg Q3W；地塞米松预处理；卡铂溶媒用5% GS；地塞米松8mg bid d-1至d1预处理；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "白蛋白紫杉醇 + 帕博利珠单抗",
        setting: "晚期一线(三阴PD-L1+)",
        cycle: "28天为一周期",
        drugs: [
          { name: "帕博利珠单抗", dose: 200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "白蛋白结合型紫杉醇", dose: 100, unit: "mg/m²", schedule: "第1、8、15天" }
        ],
        notes: "CSCO I级推荐（CPS≥10），基于KEYNOTE-355。📌 注意：IMpassion130（阿替利珠+白蛋白紫杉醇）已于2024年撤回适应症，帕博利珠单抗联合方案为当前标准。CPS<10者免疫获益不确定。 ｜ 给药：禁用PVC输液器"
      },
      {
        name: "单药紫杉类",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或白蛋白紫杉醇/紫杉醇" }
        ],
        notes: "CSCO II级推荐。📌 另可选紫杉醇175 mg/m² q3w或白蛋白紫杉醇260 mg/m² q3w / 125 mg/m² d1,d8,d15 q4w。单药方案适用于不耐受联合化疗或蒽环预处理后患者。 ｜ 给药：地塞米松预处理；地塞米松8mg bid d-1至d1预处理"
      }
    ],
    gastric: [
      {
        name: "FLOT方案（多西他赛+奥沙利铂+5-FU/LV）",
        setting: "围手术期",
        cycle: "14天为一周期（术前4+术后4）",
        drugs: [
          { name: "多西他赛", dose: 50, unit: "mg/m²", schedule: "第1天" },
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 200, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU", dose: 2600, unit: "mg/m²", schedule: "持续静滴24h 第1天" }
        ],
        notes: "CSCO I级推荐（1A类），基于FLOT4-AIO研究（PMID: 30982686）。📌 FLOT已取代ECF/ECX成为胃癌围手术期首选。CSCO 2026版新增：HER2高表达LAGC新辅助可考虑XELOX+曲妥珠+阿替利珠（III级推荐）。 ｜ 给药：G-CSF支持、预防呕吐；地塞米松预处理；奥沙利铂溶媒用5% GS；深静脉置管，避光；地塞米松8mg bid d-1至d1预处理"
      },
      {
        name: "SOX方案（奥沙利铂+替吉奥）",
        setting: "术后辅助",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "替吉奥（S-1）", dose: null, unit: "按BSA分档", schedule: "第1-14天口服 bid", isS1: true }
        ],
        notes: "CSCO I级推荐（1A类），基于CLASSIC类似设计的东亚研究。📌 S-1分档必须严格按BSA计算，中国患者常见BSA 1.5-1.7 m²，多数用60 mg bid。 ｜ 给药：预防呕吐；奥沙利铂溶媒用5% GS"
      },
      {
        name: "XELOX方案（奥沙利铂+卡培他滨）",
        setting: "术后辅助",
        cycle: "21天为一周期 × 8周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "CSCO I级推荐（1A类），基于CLASSIC研究（PMID: 22529255）。📌 卡培他滨需嘱患者餐后30分钟内口服，足量饮水；手足综合征为特征性不良反应。 ｜ 给药：预防呕吐；奥沙利铂溶媒用5% GS"
      },
      {
        name: "SOX/FOLFOX + 纳武利尤单抗",
        setting: "晚期一线",
        cycle: "SOX 21天 / FOLFOX 14天",
        drugs: [
          { name: "纳武利尤单抗", dose: 360, unit: "mg（21天）/240mg（14天）", schedule: "第1天", isFixed: true },
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "SOX第1天（FOLFOX 85）" },
          { name: "替吉奥（S-1）", dose: null, unit: "按BSA分档", schedule: "第1-14天口服 bid", isS1: true }
        ],
        notes: "CSCO I级推荐（1A类），基于CheckMate 649 / ATTRACTION-4。📌 CSCO 2026版更新：PD-L1检测升级为I级推荐（CPS≥5获益更显著）。HER2阳性者不选此方案，需加靶向抗HER2治疗。FOLFOX方案：奥沙利铂85 mg/m² d1 + LV 400 mg/m² d1 + 5-FU 400 mg/m² d1推注 + 5-FU 2400 mg/m² 46h泵注，q2w。 ｜ 给药：奥沙利铂溶媒用5% GS"
      },
      {
        name: "XELOX方案（奥沙利铂+卡培他滨）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "CSCO II级推荐（不联合免疫时）。📌 同术后辅助XELOX剂量。免疫禁忌时可单用此方案。 ｜ 给药：预防呕吐；奥沙利铂溶媒用5% GS"
      }
    ],
    liver: [
      {
        name: "FOLFOX4方案",
        setting: "晚期一线（化疗）",
        cycle: "14天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 200, unit: "mg/m²", schedule: "第1、2天", totalDays: 2 },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1、2天", totalDays: 2 },
          { name: "5-FU 持续泵注", dose: 600, unit: "mg/m²", schedule: "22h静滴 第1、2天", totalDays: 2 }
        ],
        notes: "CSCO II级推荐，基于EACH研究（PMID: 23091558）。📌 HCC一线治疗现以靶免联合（阿替利珠+贝伐/信迪利+贝伐等）为I级推荐，FOLFOX4定位为不适合靶免治疗时的化疗选项。注意肝功能Child-Pugh需≤B7分。 ｜ 给药：充分水化；奥沙利铂溶媒用5% GS；深静脉置管，避光"
      }
    ],
    biliary: [
      {
        name: "GC + 度伐利尤单抗",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "度伐利尤单抗", dose: 1500, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 25, unit: "mg/m²", schedule: "第1、8天" }
        ],
        notes: "CSCO I级推荐（1A类），基于TOPAZ-1研究（PMID: 35662584）。📌 胆道肿瘤GC方案中顺铂为25 mg/m² d1,d8（分次低剂量），区别于其他瘤种的单次大剂量用法。 ｜ 给药：预防呕吐、充分水化；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "GC方案（吉西他滨+顺铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 25, unit: "mg/m²", schedule: "第1、8天" }
        ],
        notes: "CSCO II级推荐（不联合免疫时），基于ABC-02研究（PMID: 20304025）。📌 同上，顺铂25 mg/m² d1,d8。 ｜ 给药：预防呕吐、充分水化；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "GS方案（吉西他滨+替吉奥）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "替吉奥（S-1）", dose: null, unit: "按BSA分档", schedule: "第1-14天口服 bid", isS1: true }
        ],
        notes: "CSCO II级推荐，基于FUGA-BT研究（日本数据非劣效于GC）。📌 适用于顺铂不耐受或拒绝静脉化疗者。 ｜ 给药：常规预处理"
      },
      {
        name: "卡培他滨单药",
        setting: "术后辅助",
        cycle: "21天为一周期 × 8周期",
        drugs: [
          { name: "卡培他滨", dose: 1250, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "CSCO I级推荐（1A类），基于BILCAP研究（PMID: 30922733）。📌 注意胆道辅助卡培他滨剂量为1250 mg/m² bid，高于胃癌辅助的1000 mg/m² bid。 ｜ 给药：规律监测"
      }
    ],
    pancreas: [
      {
        name: "mFOLFIRINOX方案",
        setting: "术后辅助",
        cycle: "14天为一周期 × 12周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "伊立替康", dose: 150, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 2400, unit: "mg/m²", schedule: "持续静滴46h" }
        ],
        notes: "CSCO I级推荐（1A类），基于PRODIGE 24/CCTG PA6（PMID: 29860886）。📌 mFOLFIRINOX去掉了5-FU推注（减少骨髓抑制），且伊立替康剂量从180降至150 mg/m²。适用于ECOG 0-1、术后充分恢复的患者。 ｜ 给药：G-CSF支持、预防呕吐；奥沙利铂溶媒用5% GS；UGT1A1检测；关注胆碱能综合征及迟发性腹泻；深静脉置管，避光"
      },
      {
        name: "吉西他滨 + 卡培他滨",
        setting: "术后辅助",
        cycle: "28天为一周期 × 6周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8、15天" },
          { name: "卡培他滨", dose: 830, unit: "mg/m² bid", schedule: "第1-21天口服", isOral: true }
        ],
        notes: "CSCO I级推荐（1A类），基于ESPAC-4（PMID: 28135191）。📌 卡培他滨剂量830 mg/m² bid（即总日剂量1660 mg/m²），略低于其他瘤种常用的1000-1250 mg/m² bid。 ｜ 给药：常规监测"
      },
      {
        name: "吉西他滨单药",
        setting: "术后辅助",
        cycle: "28天为一周期 × 6周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8、15天" }
        ],
        notes: "CSCO II级推荐，基于CONKO-001（PMID: 17538161）。📌 体力状态较差（ECOG 2）或老年患者的选择。 ｜ 给药：常规监测"
      },
      {
        name: "FOLFIRINOX方案",
        setting: "晚期一线",
        cycle: "14天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "伊立替康", dose: 180, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 2400, unit: "mg/m²", schedule: "持续静滴46h" }
        ],
        notes: "CSCO I级推荐（1A类），基于PRODIGE 4/ACCORD 11（PMID: 21753153）。📌 全量FOLFIRINOX（含5-FU推注+伊立替康180）毒性大，实际临床多用mFOLFIRINOX（去5-FU推注+伊立替康150），CSCO亦认可。仅限ECOG 0-1。 ｜ 给药：G-CSF支持、预防呕吐；奥沙利铂溶媒用5% GS；UGT1A1检测；关注胆碱能综合征及迟发性腹泻；深静脉置管，避光"
      },
      {
        name: "AG方案（白蛋白紫杉醇+吉西他滨）",
        setting: "晚期一线",
        cycle: "28天为一周期",
        drugs: [
          { name: "白蛋白结合型紫杉醇", dose: 125, unit: "mg/m²", schedule: "第1、8、15天" },
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8、15天" }
        ],
        notes: "CSCO I级推荐（1A类），基于MPACT研究（PMID: 24131140）。📌 d15常因骨髓抑制跳过（临床实际完成率约60%），CSCO认可根据耐受性调整。 ｜ 给药：禁用PVC输液器"
      }
    ],
    colorectal: [
      {
        name: "mFOLFOX6方案",
        setting: "术后辅助",
        cycle: "14天为一周期（III期共6个月，低危可3个月）",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 2400, unit: "mg/m²", schedule: "持续静滴46h" }
        ],
        notes: "CSCO I级推荐（1A类）。📌 IDEA研究：T1-3N1（低危III期）可考虑3个月辅助化疗（CapeOX优于mFOLFOX6在缩短疗程中的数据）；T4和/或N2（高危III期）仍推荐6个月。 ｜ 给药：预防呕吐；奥沙利铂溶媒用5% GS；深静脉置管，避光"
      },
      {
        name: "CapeOX方案（奥沙利铂+卡培他滨）",
        setting: "术后辅助",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "CSCO I级推荐（1A类）。📌 低危III期CapeOX 3个月非劣效于6个月（IDEA研究）；CapeOX在3个月方案中数据优于mFOLFOX6。 ｜ 给药：预防呕吐；奥沙利铂溶媒用5% GS"
      },
      {
        name: "mFOLFOX6方案",
        setting: "晚期一线",
        cycle: "14天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 2400, unit: "mg/m²", schedule: "持续静滴46h" }
        ],
        notes: "CSCO I级推荐。📌 CSCO 2026版更新：RAS野生型+BRAF V600E突变者，FOLFOX+恩考芬尼+抗EGFR单抗上调为I级推荐（1A类）。常联合靶向药物：RAS/BRAF野生型左半结肠→+西妥昔单抗；右半或RAS突变→+贝伐珠单抗。 ｜ 给药：预防呕吐；奥沙利铂溶媒用5% GS；深静脉置管，避光"
      },
      {
        name: "FOLFIRI方案",
        setting: "晚期一线",
        cycle: "14天为一周期",
        drugs: [
          { name: "伊立替康", dose: 180, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 2400, unit: "mg/m²", schedule: "持续静滴46h" }
        ],
        notes: "CSCO I级推荐。📌 伊立替康与UGT1A1基因多态性相关：UGT1A1*28 7/7纯合或*6 G/A杂合者需减量（起始减至150 mg/m²或更低）。迟发性腹泻（>24h后）需洛哌丁胺处理。 ｜ 给药：预防呕吐；UGT1A1检测；关注胆碱能综合征及迟发性腹泻；深静脉置管，避光"
      },
      {
        name: "FOLFOXIRI方案",
        setting: "晚期一线",
        cycle: "14天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "伊立替康", dose: 165, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 3200, unit: "mg/m²", schedule: "持续静滴48h" }
        ],
        notes: "CSCO II级推荐。📌 FOLFOXIRI无5-FU推注。毒性显著高于双药方案（3-4级中性粒减少>50%），仅限ECOG 0-1、年龄<70岁、适合强烈治疗者。多联合贝伐珠单抗。 ｜ 给药：G-CSF支持、预防呕吐；奥沙利铂溶媒用5% GS；UGT1A1检测；关注胆碱能综合征及迟发性腹泻；深静脉置管，避光"
      },
      {
        name: "CapeOX方案（奥沙利铂+卡培他滨）",
        setting: "新辅助(直肠)",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "CSCO II级推荐（TNT全程新辅助）。📌 TNT（total neoadjuvant therapy）策略：新辅助化疗+新辅助放化疗（或反序），pCR率可达30%以上。同期放化疗部分：卡培他滨825 mg/m² bid同步放疗。 ｜ 给药：预防呕吐；奥沙利铂溶媒用5% GS"
      },
      {
        name: "mFOLFOX6方案",
        setting: "新辅助(直肠)",
        cycle: "14天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 85, unit: "mg/m²", schedule: "第1天" },
          { name: "亚叶酸钙", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 静推", dose: 400, unit: "mg/m²", schedule: "第1天" },
          { name: "5-FU 持续泵注", dose: 2400, unit: "mg/m²", schedule: "持续静滴46h" }
        ],
        notes: "CSCO II级推荐（TNT全程新辅助）。📌 TNT策略中mFOLFOX6与CapeOX均可选。同期放化疗部分：5-FU持续泵注同步放疗。 ｜ 给药：预防呕吐；奥沙利铂溶媒用5% GS；深静脉置管，避光"
      }
    ],
    bladder: [
      {
        name: "GC方案（吉西他滨+顺铂）",
        setting: "新辅助/围手术期",
        cycle: "21天为一周期 × 3-4周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 70, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐（1A类）。📌 GC非劣效于MVAC但毒性更低（von der Maase, JCO 2000）。经典方案为q4w（Gem d1,8,15 + Cis d2），现多用简化q3w（Gem d1,8 + Cis d1/d2）。 ｜ 给药：充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "ddMVAC方案",
        setting: "新辅助(剂量密集)",
        cycle: "14天为一周期 × 3-4周期",
        drugs: [
          { name: "甲氨蝶呤", dose: 30, unit: "mg/m²", schedule: "第1天" },
          { name: "长春碱", dose: 3, unit: "mg/m²", schedule: "第2天" },
          { name: "多柔比星", dose: 30, unit: "mg/m²", schedule: "第2天" },
          { name: "顺铂", dose: 70, unit: "mg/m²", schedule: "第2天" }
        ],
        notes: "CSCO II级推荐。📌 必须联合G-CSF支持。ddMVAC疗效可能优于GC（缺乏头对头RCT直接比较），但毒性管理要求更高。 ｜ 给药：G-CSF支持、充分水化；多柔比星注意累积剂量上限；CrCl<60mL/min考虑卡铂替代；右丙亚胺(DZE)可预防心脏毒性；需亚叶酸钙解救+充分水化+碱化尿液"
      },
      {
        name: "GC方案（吉西他滨+顺铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 70, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐（1A类）。📌 顺铂适合标准：GFR≥60 mL/min、ECOG 0-1、无严重听力损害、无2级以上神经病变、无心功能不全（NYHA III-IV）。 ｜ 给药：充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "GCarbo方案（吉西他滨+卡铂）",
        setting: "晚期一线(顺铂不耐受)",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "卡铂", dose: null, unit: "AUC 5", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO II级推荐。📌 疗效不及GC（ORR和OS均略低），仅限顺铂不适合患者。维持治疗：JAVELIN Bladder 100方案——化疗无进展后阿维鲁单抗维持（CSCO I级推荐）。 ｜ 给药：预防呕吐；卡铂溶媒用5% GS；充分水化；CrCl<60mL/min考虑卡铂替代；血小板<50×10⁹/L时IL-11/TPO支持"
      }
    ],
    prostate: [
      {
        name: "多西他赛 + ADT",
        setting: "转移性激素敏感(mHSPC)",
        cycle: "21天为一周期 × 6周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐（1A类），基于CHAARTED（PMID: 25384002）和STAMPEDE。📌 适用于高肿瘤负荷mHSPC（CHAARTED标准：内脏转移或≥4处骨转移含≥1处中轴骨外）。ADT必须全程持续。预处理：地塞米松8mg口服（化疗前12h、3h、1h各1次）。 ｜ 给药：地塞米松预处理、联合ADT；地塞米松8mg bid d-1至d1预处理"
      },
      {
        name: "多西他赛 + 泼尼松",
        setting: "mCRPC一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "泼尼松", dose: 5, unit: "mg bid（固定剂量）", schedule: "持续口服", isFixed: true }
        ],
        notes: "CSCO I级推荐（1A类），基于TAX327（PMID: 15470214）。📌 mCRPC化疗前需确认去势水平（睾酮<50 ng/dL）。泼尼松为持续给药，不随化疗周期中断。 ｜ 给药：地塞米松预处理；地塞米松8mg bid d-1至d1预处理"
      },
      {
        name: "卡巴他赛 + 泼尼松",
        setting: "mCRPC二线",
        cycle: "21天为一周期",
        drugs: [
          { name: "卡巴他赛", dose: 25, unit: "mg/m²", schedule: "第1天", range: "20-25" },
          { name: "泼尼松", dose: 5, unit: "mg bid（固定剂量）", schedule: "持续口服", isFixed: true }
        ],
        notes: "CSCO I级推荐（1A类），基于TROPIC（PMID: 20888992）和CARD（PMID: 31405800）。📌 PROSELICA研究证实20 mg/m²非劣效于25 mg/m²且毒性更低（PMID: 28728370），中国临床实际中20 mg/m²更常用。CARD研究：多西他赛后序贯ARPI再进展者，卡巴他赛优于换另一种ARPI。需预防性G-CSF（25 mg/m²时）。 ｜ 给药：G-CSF支持、预防过敏反应"
      }
    ],
    cervix: [
      {
        name: "单药顺铂",
        setting: "根治性同期放化疗",
        cycle: "每周方案 × 5-6周",
        drugs: [
          { name: "顺铂", dose: 40, unit: "mg/m²", schedule: "每周第1天（单次≤70mg）" }
        ],
        notes: "CSCO I级推荐（1A类）。📌 宫颈癌同期化疗为每周低剂量顺铂（40 mg/m²），与头颈/NPC的三周大剂量（100 mg/m²）不同。至少完成5周期同期化疗与预后相关。CSCO 2026版延续此标准。 ｜ 给药：充分水化、预防呕吐；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "TP方案 + 贝伐 ± 帕博利珠单抗",
        setting: "晚期/复发一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "帕博利珠单抗", dose: 200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 50, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" }
        ],
        notes: "CSCO I级推荐（1A类），基于KEYNOTE-826（PMID: 34534429）+ GOG-240（贝伐珠单抗15 mg/kg q3w）。📌 可用卡铂AUC 5替代顺铂。贝伐珠单抗显著改善OS（GOG-240）。KEYNOTE-826：CPS≥1加帕博利珠单抗，CPS≥10获益更大。帕博利珠+化疗±贝伐为当前标准。 ｜ 给药：贝伐珠单抗15mg/kg d1；紫杉醇地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；顺铂需充分水化；卡铂时溶媒用5% GS；贝伐珠单抗需监测血压，距手术≥28天；CrCl<60mL/min考虑卡铂替代"
      },
      {
        name: "TC方案（紫杉醇+卡铂）",
        setting: "晚期/复发一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐。📌 顺铂不耐受时的标准替代。JCOG0505研究：TC非劣效于TP（紫杉醇+顺铂）。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      }
    ],
    ovary: [
      {
        name: "TC方案（紫杉醇+卡铂）",
        setting: "一线/术后辅助",
        cycle: "21天为一周期 × 6周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类）。📌 标准一线方案不变。BRCA突变者化疗后序贯奥拉帕利维持（I级推荐）；HRD+者可用尼拉帕利/奥拉帕利维持。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "剂量密集TC方案",
        setting: "一线(剂量密集)",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 80, unit: "mg/m²", schedule: "第1、8、15天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO II级推荐，基于JGOG 3016（PMID: 23106106）。📌 日本研究显示dd-TC改善PFS和OS，但西方GOG-262和ICON8未能重复。东亚人群可能获益更多。神经毒性和血液学毒性需密切监测。 ｜ 给药：G-CSF支持；地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "TC方案（紫杉醇+卡铂）",
        setting: "新辅助",
        cycle: "21天为一周期 × 3-4周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（IIIC-IV期无法达到满意减瘤时）。📌 新辅助3-4周期→间隔减瘤术（IDS）→术后补足至总共6周期。CHORUS/EORTC 55971研究支持。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      }
    ],
    endometrium: [
      {
        name: "TC方案（紫杉醇+卡铂）",
        setting: "一线/术后辅助",
        cycle: "21天为一周期 × 6周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类）。📌 适用于III-IV期术后辅助或复发晚期一线。GOG-209证实TC非劣效于TAP（多柔比星+顺铂+紫杉醇）且毒性更低。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      },
      {
        name: "TC + 度伐利尤/帕博利珠单抗",
        setting: "晚期一线(联合免疫)",
        cycle: "21天为一周期",
        drugs: [
          { name: "帕博利珠单抗", dose: 200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5", schedule: "第1天", isAUC: true }
        ],
        notes: "CSCO I级推荐（1A类）。📌 基于NRG-GY018（帕博利珠单抗，PMID: 37379154）和RUBY part 1（度伐利尤单抗，PMID: 37379158）。dMMR/MSI-H患者获益尤为显著（HR<0.30）；pMMR/MSS患者也有PFS获益。度伐利尤单抗1500mg q3w（联合期）→ q4w（维持期）。 ｜ 给药：地塞米松预处理+胃黏膜保护剂，禁用PVC输液器；卡铂溶媒用5% GS；血小板<50×10⁹/L时IL-11/TPO支持"
      }
    ],
    sarcoma: [
      {
        name: "单药多柔比星",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "多柔比星", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "CSCO I级推荐（1A类）。📌 蒽环单药仍为STS一线标准（EORTC 62012：联合异环磷酰胺未改善OS）。累积剂量上限450-550 mg/m²（心脏毒性），需基线和治疗中监测LVEF。脂质体多柔比星可降低心脏毒性但CSCO证据等级略低。 ｜ 给药：心脏毒性监测；注意累积剂量上限；右丙亚胺(DZE)可预防心脏毒性"
      },
      {
        name: "AI方案（多柔比星+异环磷酰胺）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "多柔比星", dose: 75, unit: "mg/m²", schedule: "第1天（或25mg/m² d1-3）" },
          { name: "异环磷酰胺", dose: 7000, unit: "mg/m²", schedule: "分次给药（常分3-4天）" }
        ],
        notes: "CSCO II级推荐（需要高ORR时选用）。📌 AI方案ORR高于单药（约25-30% vs 15-20%），但OS无差异。适用于需要快速缩瘤（如肿瘤可能转化为可切除）的场景。出血性膀胱炎预防：美司钠必须足量+大量水化（尿量>100 mL/h）。 ｜ 给药：充分水化、G-CSF支持、预防出血性膀胱炎（美司钠剂量为异环磷酰胺的60%，分3次静脉注射：化疗同时、4h后、8h后）；多柔比星注意累积剂量上限；右丙亚胺(DZE)可预防心脏毒性"
      },
      {
        name: "AI方案（多柔比星+异环磷酰胺）",
        setting: "新辅助/辅助",
        cycle: "21天为一周期",
        drugs: [
          { name: "多柔比星", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "异环磷酰胺", dose: 7000, unit: "mg/m²", schedule: "分次给药（常分3-4天）" }
        ],
        notes: "CSCO II级推荐。📌 ISG-STS 1001研究（PMID: 28257659）支持表观标准化方案（epirubicin+ifosfamide）新辅助用于高危肢体STS。辅助化疗争议较大（SARCULATOR评分可辅助决策）。 ｜ 给药：充分水化、G-CSF支持、预防出血性膀胱炎（美司钠剂量为异环磷酰胺的60%，分3次静脉注射：化疗同时、4h后、8h后）；多柔比星注意累积剂量上限；右丙亚胺(DZE)可预防心脏毒性"
      }
    ],
    osteosarcoma: [
      {
        name: "MAP方案（大剂量MTX+多柔比星+顺铂）",
        setting: "新辅助/辅助",
        cycle: "按MAP具体疗程安排",
        drugs: [
          { name: "甲氨蝶呤（高剂量）", dose: 12000, unit: "mg/m²", schedule: "需亚叶酸钙解救", range: "8000-12000", isHDMTX: true },
          { name: "多柔比星", dose: 75, unit: "mg/m²", schedule: "第1天（或25mg/m² d1-3）" },
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "单次或分次", range: "100-120" }
        ],
        notes: "CSCO I级推荐。📌 MAP方案为多药交替的复杂方案，非简单的'q3w'重复。HD-MTX需严格甲氨蝶呤血药浓度监测+亚叶酸钙解救（MTX后24h开始，15 mg/m² q6h至血浆MTX<0.05 μmol/L）。大量碱化水化（尿pH≥7.0）。EURAMOS-1研究（PMID: 27569441）：术后病理反应差（坏死率<90%）者加用异环磷酰胺+依托泊苷未改善OS。 ｜ 给药：充分水化、碱化尿液、亚叶酸钙解救、G-CSF支持；CrCl<60mL/min考虑卡铂替代；注意累积剂量上限；右丙亚胺(DZE)可预防心脏毒性"
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