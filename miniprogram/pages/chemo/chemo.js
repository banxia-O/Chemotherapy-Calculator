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
        notes: "局部晚期鼻咽癌诱导化疗首选；诱导后序贯根治性同期放化疗"
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
        notes: "诱导化疗采用减量TPF；骨髓抑制重，需G-CSF支持"
      },
      {
        name: "单药顺铂",
        setting: "根治性同期放化疗",
        cycle: "21天为一周期（d1、22、43）",
        drugs: [
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "放疗第1、22、43天", alt: "或40mg/m² 每周方案" }
        ],
        notes: "根治性放疗同期化疗标准；不耐受大剂量者用顺铂40mg/m² 每周（单次≤70mg）"
      },
      {
        name: "GP方案 + PD-1抑制剂",
        setting: "复发/转移一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 80, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "复发转移性鼻咽癌一线首选；联合卡瑞利珠/特瑞普利单抗（固定剂量，详见说明书）"
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
        notes: "局部晚期降期/器官保留；骨髓抑制重，需G-CSF支持"
      },
      {
        name: "单药顺铂",
        setting: "根治性/术后同期放化疗",
        cycle: "21天为一周期（d1、22、43）",
        drugs: [
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "放疗第1、22、43天", alt: "或40mg/m² 每周方案" }
        ],
        notes: "根治性或高危术后（切缘阳性/结外侵犯）同期放化疗标准方案"
      },
      {
        name: "EXTREME方案（顺铂/卡铂+5-FU+西妥昔单抗）",
        setting: "复发/转移一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "顺铂", dose: 100, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5" },
          { name: "5-FU", dose: 1000, unit: "mg/m²/d", schedule: "持续静滴 第1-4天", totalDays: 4 }
        ],
        notes: "联合西妥昔单抗（首次400mg/m²，之后250mg/m² 每周）；最多6周期后西妥昔单抗维持"
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
        notes: "KEYNOTE-048；CPS≥1者获益，化疗后帕博利珠单抗维持"
      }
    ],
    lung_adeno: [
      {
        name: "PP方案（培美曲塞+铂类）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "培美曲塞", dose: 500, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5-6" }
        ],
        notes: "驱动基因阴性首选之一；需预处理：叶酸（化疗前7天起口服）、维生素B12（前1周肌注，每3周期1次）、地塞米松（前1天、当天、后1天）；化疗后培美曲塞维持"
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
        notes: "KEYNOTE-189；驱动基因阴性非鳞NSCLC一线标准；4周期后培美曲塞+帕博利珠单抗维持"
      },
      {
        name: "AP方案（白蛋白紫杉醇+卡铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "白蛋白结合型紫杉醇", dose: 260, unit: "mg/m²", schedule: "第1天", alt: "或100mg/m² d1,8,15" },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "无需抗过敏预处理；适合培美曲塞不可及或不适用者"
      },
      {
        name: "PP方案（培美曲塞+顺铂）",
        setting: "术后辅助",
        cycle: "21天为一周期 × 4周期",
        drugs: [
          { name: "培美曲塞", dose: 500, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "II-IIIA期非鳞NSCLC完全切除术后辅助；同样需要叶酸/B12预处理"
      },
      {
        name: "NP方案（长春瑞滨+顺铂）",
        setting: "术后辅助",
        cycle: "21天为一周期 × 4周期",
        drugs: [
          { name: "长春瑞滨", dose: 25, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "经典术后辅助方案（LACE荟萃分析）；适用于鳞/非鳞"
      },
      {
        name: "含铂双药 + 纳武利尤单抗（新辅助）",
        setting: "新辅助",
        cycle: "21天为一周期 × 3周期",
        drugs: [
          { name: "纳武利尤单抗", dose: 360, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "培美曲塞", dose: 500, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5-6" }
        ],
        notes: "CheckMate-816；可切除IB-IIIA期，术前3周期；鳞癌backbone改为紫杉醇+卡铂"
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
        notes: "鳞癌一线常用；亦可用紫杉醇200mg/m² d1（需抗过敏预处理）"
      },
      {
        name: "GP方案（吉西他滨+顺铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1250, unit: "mg/m²", schedule: "第1、8天", range: "1000-1250" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5-6" }
        ],
        notes: "注意骨髓抑制，d8需复查血常规决定是否给药"
      },
      {
        name: "紫杉醇 + 卡铂 + 帕博利珠单抗",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "帕博利珠单抗", dose: 200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "紫杉醇", dose: 200, unit: "mg/m²", schedule: "第1天", alt: "或白蛋白紫杉醇100 d1,8,15" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "KEYNOTE-407；鳞癌一线标准；4周期后帕博利珠单抗维持"
      },
      {
        name: "NP方案（长春瑞滨+顺铂）",
        setting: "术后辅助",
        cycle: "21天为一周期 × 4周期",
        drugs: [
          { name: "长春瑞滨", dose: 25, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "完全切除后辅助化疗经典方案"
      },
      {
        name: "紫杉醇 + 卡铂 + 纳武利尤单抗（新辅助）",
        setting: "新辅助",
        cycle: "21天为一周期 × 3周期",
        drugs: [
          { name: "纳武利尤单抗", dose: 360, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "紫杉醇", dose: 200, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "CheckMate-816；可切除鳞癌术前3周期"
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
        notes: "局限期首选，同步胸部放疗；建议尽早（第1-2周期）介入放疗"
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
        notes: "IMpower133；广泛期一线标准；4周期后阿替利珠单抗维持"
      },
      {
        name: "EP/EC + 度伐利尤单抗",
        setting: "广泛期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "度伐利尤单抗", dose: 1500, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "依托泊苷", dose: 100, unit: "mg/m²", schedule: "第1-3天", totalDays: 3 },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或卡铂 AUC 5-6" }
        ],
        notes: "CASPIAN；广泛期一线标准；4周期后度伐利尤单抗维持"
      },
      {
        name: "EC方案（依托泊苷+卡铂）",
        setting: "广泛期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "依托泊苷", dose: 100, unit: "mg/m²", schedule: "第1-3天", totalDays: 3 },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "肾功能不全或老年患者可优选卡铂；无免疫治疗条件时的化疗骨架"
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
        notes: "可切除食管癌术前新辅助同步放化疗（41.4Gy/23F）；鳞癌/腺癌均适用"
      },
      {
        name: "TP方案（紫杉醇+顺铂）",
        setting: "新辅助化疗",
        cycle: "21天为一周期 × 2-4周期",
        drugs: [
          { name: "紫杉醇", dose: 150, unit: "mg/m²", schedule: "第1天", alt: "或多西他赛75mg/m²" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或奈达铂" }
        ],
        notes: "局部晚期食管鳞癌新辅助化疗±免疫；术前评估降期"
      },
      {
        name: "PF方案（顺铂+5-FU）",
        setting: "根治性同期放化疗",
        cycle: "28天为一周期",
        drugs: [
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天", range: "75-100" },
          { name: "5-FU", dose: 1000, unit: "mg/m²/d", schedule: "持续静滴 第1-4天", totalDays: 4 }
        ],
        notes: "不可手术者根治性同期放化疗经典方案"
      },
      {
        name: "TP方案 + PD-1抑制剂",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "顺铂", dose: 75, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "晚期食管鳞癌一线联合帕博利珠/卡瑞利珠/特瑞普利单抗（固定剂量）"
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
        notes: "高危HER2-乳腺癌首选；剂量密集需G-CSF支持；蒽环终身累积剂量多柔比星<450-550mg/m²"
      },
      {
        name: "TC方案（多西他赛+环磷酰胺）",
        setting: "术后辅助(HER2-)",
        cycle: "21天为一周期 × 4-6周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "环磷酰胺", dose: 600, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "中低危或蒽环禁忌者的辅助方案"
      },
      {
        name: "TCbHP（多西他赛+卡铂+曲妥珠+帕妥珠）",
        setting: "新辅助/术后辅助(HER2+)",
        cycle: "21天为一周期 × 6周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "HER2+新辅助首选；联合曲妥珠单抗（首剂8mg/kg→6mg/kg）+帕妥珠单抗（首剂840mg→420mg）；术后双靶满1年"
      },
      {
        name: "白蛋白紫杉醇 + 帕博利珠单抗",
        setting: "晚期一线(三阴PD-L1+)",
        cycle: "28天为一周期",
        drugs: [
          { name: "帕博利珠单抗", dose: 200, unit: "mg（固定剂量）", schedule: "第1天", isFixed: true },
          { name: "白蛋白结合型紫杉醇", dose: 100, unit: "mg/m²", schedule: "第1、8、15天" }
        ],
        notes: "KEYNOTE-355；晚期三阴乳腺癌一线；PD-L1 CPS≥10获益更明显"
      },
      {
        name: "单药紫杉类",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天", alt: "或白蛋白紫杉醇/紫杉醇" }
        ],
        notes: "HER2-、非内脏危象的晚期乳腺癌可序贯单药化疗"
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
        notes: "FLOT4研究；可切除胃/胃食管结合部腺癌围手术期首选；体力佳者优于ECF"
      },
      {
        name: "SOX方案（奥沙利铂+替吉奥）",
        setting: "术后辅助",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "替吉奥（S-1）", dose: null, unit: "按BSA分档", schedule: "第1-14天口服 bid", isS1: true }
        ],
        notes: "D2根治术后辅助；中国人群常用，替吉奥口服依从性好"
      },
      {
        name: "XELOX方案（奥沙利铂+卡培他滨）",
        setting: "术后辅助",
        cycle: "21天为一周期 × 8周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "CLASSIC研究；III期胃癌D2术后辅助标准方案之一"
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
        notes: "CheckMate-649；晚期一线（PD-L1 CPS≥5获益明确）；HER2+者改用曲妥珠单抗+化疗"
      },
      {
        name: "XELOX方案（奥沙利铂+卡培他滨）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "晚期胃癌一线常用；卡培他滨肌酐清除率<50需减量；手足综合征常见"
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
        notes: "中国EACH研究证据；晚期HCC一线首选靶向+免疫（阿替利珠+贝伐、双免/TKI），系统化疗多作为后线或不耐受免疫者选择"
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
        notes: "TOPAZ-1；晚期胆道癌一线标准；8周期后度伐利尤单抗维持"
      },
      {
        name: "GC方案（吉西他滨+顺铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 25, unit: "mg/m²", schedule: "第1、8天" }
        ],
        notes: "ABC-02研究确立的经典骨架方案"
      },
      {
        name: "GS方案（吉西他滨+替吉奥）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "替吉奥（S-1）", dose: null, unit: "按BSA分档", schedule: "第1-14天口服 bid", isS1: true }
        ],
        notes: "顺铂不耐受者的替代方案（JCOG/亚洲常用）"
      },
      {
        name: "卡培他滨单药",
        setting: "术后辅助",
        cycle: "21天为一周期 × 8周期",
        drugs: [
          { name: "卡培他滨", dose: 1250, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "BILCAP研究；胆道癌根治术后辅助标准方案"
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
        notes: "PRODIGE-24；体力佳者术后辅助首选（改良版去5-FU推注、伊立替康减量）"
      },
      {
        name: "吉西他滨 + 卡培他滨",
        setting: "术后辅助",
        cycle: "28天为一周期 × 6周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8、15天" },
          { name: "卡培他滨", dose: 830, unit: "mg/m² bid", schedule: "第1-21天口服", isOral: true }
        ],
        notes: "ESPAC-4；体力欠佳不耐受FOLFIRINOX者的辅助方案"
      },
      {
        name: "吉西他滨单药",
        setting: "术后辅助",
        cycle: "28天为一周期 × 6周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8、15天" }
        ],
        notes: "CONKO-001；耐受性好，适合高龄/体力较差者"
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
        notes: "适用于PS 0-1、胆红素正常者；毒性大，可用改良版mFOLFIRINOX（伊立替康150、去推注）"
      },
      {
        name: "AG方案（白蛋白紫杉醇+吉西他滨）",
        setting: "晚期一线",
        cycle: "28天为一周期",
        drugs: [
          { name: "白蛋白结合型紫杉醇", dose: 125, unit: "mg/m²", schedule: "第1、8、15天" },
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8、15天" }
        ],
        notes: "MPACT；耐受性优于FOLFIRINOX，适用于PS稍差的患者"
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
        notes: "III期结肠癌术后辅助标准；IDEA研究示低危T1-3N1可缩短至3个月"
      },
      {
        name: "CapeOX方案（奥沙利铂+卡培他滨）",
        setting: "术后辅助",
        cycle: "21天为一周期",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "第1天" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "III期结肠癌术后辅助；手足综合征常见"
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
        notes: "晚期一线骨架；按RAS/BRAF及左右半结合贝伐珠单抗或西妥昔单抗（RAS野生型左半）"
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
        notes: "与FOLFOX等效的一线骨架；UGT1A1*28纯合者伊立替康需减量"
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
        notes: "三药强烈方案，适合体力佳、肿瘤负荷大或潜在可转化者；常联合贝伐珠单抗"
      },
      {
        name: "CapeOX / FOLFOX",
        setting: "新辅助(直肠)",
        cycle: "CapeOX 21天 / FOLFOX 14天",
        drugs: [
          { name: "奥沙利铂", dose: 130, unit: "mg/m²", schedule: "CapeOX第1天（FOLFOX 85）" },
          { name: "卡培他滨", dose: 1000, unit: "mg/m² bid", schedule: "第1-14天口服", isOral: true }
        ],
        notes: "局部进展期直肠癌全程新辅助治疗（TNT）；常与放疗序贯/同期"
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
        notes: "肌层浸润性膀胱癌根治术前新辅助首选；要求肌酐清除率≥60、PS 0-1"
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
        notes: "剂量密集MVAC，必须G-CSF支持；新辅助高强度方案"
      },
      {
        name: "GC方案（吉西他滨+顺铂）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "顺铂", dose: 70, unit: "mg/m²", schedule: "第1天" }
        ],
        notes: "晚期尿路上皮癌一线；化疗后可序贯avelumab维持"
      },
      {
        name: "GCarbo方案（吉西他滨+卡铂）",
        setting: "晚期一线(顺铂不耐受)",
        cycle: "21天为一周期",
        drugs: [
          { name: "吉西他滨", dose: 1000, unit: "mg/m²", schedule: "第1、8天" },
          { name: "卡铂", dose: null, unit: "AUC 5", schedule: "第1天", isAUC: true }
        ],
        notes: "顺铂不适合者（CrCl<60或PS 2）替代方案；化疗后avelumab维持"
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
        notes: "CHAARTED/STAMPEDE；高瘤负荷mHSPC在ADT基础上联合多西他赛6周期，可±新型内分泌药物"
      },
      {
        name: "多西他赛 + 泼尼松",
        setting: "mCRPC一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "多西他赛", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "泼尼松", dose: 5, unit: "mg bid（固定剂量）", schedule: "持续口服", isFixed: true }
        ],
        notes: "mCRPC化疗一线标准方案"
      },
      {
        name: "卡巴他赛 + 泼尼松",
        setting: "mCRPC二线",
        cycle: "21天为一周期",
        drugs: [
          { name: "卡巴他赛", dose: 25, unit: "mg/m²", schedule: "第1天", range: "20-25" },
          { name: "泼尼松", dose: 5, unit: "mg bid（固定剂量）", schedule: "持续口服", isFixed: true }
        ],
        notes: "多西他赛失败后二线（TROPIC/CARD）；需G-CSF支持，20mg/m²耐受性更佳"
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
        notes: "局部晚期宫颈癌根治性同步放化疗标准；与外照射同期"
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
        notes: "KEYNOTE-826；晚期/复发一线，联合贝伐珠单抗15mg/kg；PD-L1 CPS≥1加帕博利珠单抗"
      },
      {
        name: "TC方案（紫杉醇+卡铂）",
        setting: "晚期/复发一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5", schedule: "第1天", isAUC: true }
        ],
        notes: "肾功能不全或顺铂不耐受者的一线方案；可联合贝伐珠单抗"
      }
    ],
    ovary: [
      {
        name: "TC方案（紫杉醇+卡铂）",
        setting: "一线/术后辅助",
        cycle: "21天为一周期 × 6周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "上皮性卵巢癌术后一线标准；可联合贝伐珠单抗；BRCA突变/HRD阳性维持加PARP抑制剂"
      },
      {
        name: "剂量密集TC方案",
        setting: "一线(剂量密集)",
        cycle: "21天为一周期",
        drugs: [
          { name: "紫杉醇", dose: 80, unit: "mg/m²", schedule: "第1、8、15天" },
          { name: "卡铂", dose: null, unit: "AUC 6", schedule: "第1天", isAUC: true }
        ],
        notes: "JGOG3016示亚洲人群可能获益，但毒性增加"
      },
      {
        name: "TC方案（紫杉醇+卡铂）",
        setting: "新辅助",
        cycle: "21天为一周期 × 3-4周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "初始不可满意减瘤者行新辅助化疗，3-4周期后行间歇性减瘤术（IDS）"
      }
    ],
    endometrium: [
      {
        name: "TC方案（紫杉醇+卡铂）",
        setting: "一线/术后辅助",
        cycle: "21天为一周期 × 6周期",
        drugs: [
          { name: "紫杉醇", dose: 175, unit: "mg/m²", schedule: "第1天" },
          { name: "卡铂", dose: null, unit: "AUC 5-6", schedule: "第1天", isAUC: true }
        ],
        notes: "晚期/复发及高危术后辅助一线标准方案"
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
        notes: "NRG-GY018/DUO-E；晚期或复发一线，化疗后免疫维持；dMMR/MSI-H获益尤其显著"
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
        notes: "晚期软组织肉瘤一线标准；老年/PS稍差者优选单药；注意累积心脏毒性"
      },
      {
        name: "AI方案（多柔比星+异环磷酰胺）",
        setting: "晚期一线",
        cycle: "21天为一周期",
        drugs: [
          { name: "多柔比星", dose: 75, unit: "mg/m²", schedule: "第1天（或25mg/m² d1-3）" },
          { name: "异环磷酰胺", dose: 2500, unit: "mg/m²", schedule: "第1-4天", totalDays: 4 },
          { name: "美司钠", dose: 2500, unit: "mg/m²", schedule: "等量IFO分次给予", totalDays: 4 }
        ],
        notes: "需快速缩瘤或体力佳者；骨髓抑制及出血性膀胱炎风险高，需G-CSF支持"
      },
      {
        name: "AI方案（多柔比星+异环磷酰胺）",
        setting: "新辅助/辅助",
        cycle: "21天为一周期",
        drugs: [
          { name: "多柔比星", dose: 75, unit: "mg/m²", schedule: "第1天" },
          { name: "异环磷酰胺", dose: 2500, unit: "mg/m²", schedule: "第1-4天", totalDays: 4 },
          { name: "美司钠", dose: 2500, unit: "mg/m²", schedule: "等量IFO分次给予", totalDays: 4 }
        ],
        notes: "高危（高级别、深部、>5cm）肢体/躯干肉瘤的围手术期化疗，证据尚有争议"
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
        notes: "经典骨肉瘤新辅助/辅助方案；HD-MTX需监测血药浓度、尿碱化、充分水化；多见于青少年需MDT"
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