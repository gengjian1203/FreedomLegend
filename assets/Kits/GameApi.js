//////////////////////////////////////////////////
// formatLargeNumber
// 格式化数字，超过万则显示w为单位
//////////////////////////////////////////////////
function formatLargeNumber(num) {
  let number = parseInt(num);
  let result = '';

  if (number >= 10000) {
    number = number / 10000;
    result = `${number.toFixed(1)}w`;
  } else {
    result = `${number}`;
  }
  return result;
}

//////////////////////////////////////////////////
// funComputedMemberInfoForBase
// 计算玩家的基础属性
//////////////////////////////////////////////////
function funComputedMemberInfoForBase(level) {
  const objMemberInfo = {
    level: level,
    // 基础属性
    hp_base: level * 50 + 100,
    outerAttack_base: level * 10 + 20, // 外功
    innerAttack_base: level * 10 + 10, // 内功
    outerDefense_base: level * 10 + 10, // 外防
    innerDefense_base: level * 10 + 0, // 内防
    crit_base: g_objMemberInfo.crit_base,       // 暴击率
    dodge_base: g_objMemberInfo.dodge_base,     // 闪避率
    speed_base: g_objMemberInfo.speed_base,     // 速度
    understand_base: g_objMemberInfo.understand_base, // 悟性
    // 综合属性
    hp_total: (level * 50 + 100) + g_objMemberInfo.hp_suit + g_objMemberInfo.hp_medicine, // 生命
    outerAttack_total: (level * 10 + 20) + g_objMemberInfo.outerAttack_suit + g_objMemberInfo.outerAttack_medicine, // 外功
    innerAttack_total: (level * 10 + 10) + g_objMemberInfo.innerAttack_suit + g_objMemberInfo.innerAttack_medicine, // 内功
    outerDefense_total: (level * 10 + 10) + g_objMemberInfo.outerDefense_suit + g_objMemberInfo.outerDefense_medicine, // 外防
    innerDefense_total: (level * 10 + 0) + g_objMemberInfo.innerDefense_suit + g_objMemberInfo.innerDefense_medicine, // 内防
    crit_total: g_objMemberInfo.crit_base + g_objMemberInfo.crit_suit + g_objMemberInfo.crit_medicine, // 暴击率
    dodge_total: g_objMemberInfo.dodge_base + g_objMemberInfo.dodge_suit + g_objMemberInfo.dodge_medicine, // 闪避率
    speed_total: g_objMemberInfo.speed_base + g_objMemberInfo.speed_suit + g_objMemberInfo.speed_medicine, // 速度
    understand_total: g_objMemberInfo.understand_base + g_objMemberInfo.understand_suit + g_objMemberInfo.understand_medicine, // 悟性
  };
  return objMemberInfo;
}

//////////////////////////////////////////////////
// getExpMaxString
// 通过当前等级，计算升级所需的经验值
//////////////////////////////////////////////////
function getExpMaxString(level) {
  const nExpMax = parseInt(Math.pow(level, 3) + 0.1 * Math.pow((level - 1), 3) + 100);
  return String(nExpMax);
}

//////////////////////////////////////////////////
// getTasteString
// 通过当前等级，计算当前的境界
//////////////////////////////////////////////////
function getTasteString(level) {
  if (level > 199) {
    level = 199;
  }
  let strResult = '';
  const arrTasteHeader = ['筑基', '开光', '融合', '心动', '金丹', '元婴', '出窍', '分神', '合体', '洞虚', '大乘', '渡劫', '散仙', '灵仙', '真仙', '玄仙', '金仙', '准圣', '圣人', '鸿蒙'];
  const arrTasteTail = ['一重', '二重', '三重', '四重', '五重', '六重', '七重', '八重', '九重', '十重'];
  strResult = `${arrTasteHeader[Math.floor(level / 10)]}${arrTasteTail[level % 10]}`
  return strResult;
}

//////////////////////////////////////////////////
// getTasteColor
// 通过当前等级，计算当前的境界
//////////////////////////////////////////////////
function getTasteColor(level) {
  if (level > 199) {
    level = 199;
  }
  const index = Math.floor(level / 10);
  const arrTasteColor = [[100, 100, 100],   // 筑基 灰色
                         [50, 50, 50],      // 开光
                         [150, 150, 255],   // 融合 蓝色
                         [100, 100, 255],   // 心动
                         [0, 0, 255],       // 金丹 
                         [150, 255, 150],   // 元婴 绿色
                         [100, 255, 100],   // 出窍 
                         [50, 255, 50],     // 分神
                         [0, 255, 0],       // 合体 
                         [255, 150, 255],   // 洞虚 紫色
                         [255, 100, 255],   // 大乘 
                         [255, 50, 255],    // 渡劫
                         [255, 0, 255],     // 散仙 
                         [255, 255, 150],   // 灵仙 金色
                         [255, 255, 100],   // 真仙
                         [255, 255, 50],    // 玄仙
                         [255, 255, 0],     // 金仙 
                         [255, 150, 150],   // 准圣 红色
                         [255, 100, 100],   // 圣人
                         [255, 0, 0]];     // 鸿蒙
  return new cc.color(arrTasteColor[index][0], arrTasteColor[index][1], arrTasteColor[index][2]);
}

//////////////////////////////////////////////////
// getDescribeString
// 通过容貌值，获取该角色的人物描述
//////////////////////////////////////////////////
function getDescribeString(describe) {
  const arrCall = ['侠士', '侠女'];
  const arrWord = [[
                    '相貌狰狞，天怒人怨', 
                    '一塌糊涂，不是人样',
                    '尖嘴猴腮，面有菜色',
                    '贼眉贼眼，神情狡滑',
                    '相貌平平，其貌不扬',
                    '五官端正，身材均称',
                    '相貌英俊，双眼有神',
                    '风流俊雅，仪表堂堂',
                    '气宇轩昂，骨骼清奇',
                    '星辉环绕，谪仙降世',
                  ], [
                    '鬼哭神嚎，惨不忍睹',
                    '眼大嘴小，貌若无盐',
                    '骨瘦如柴，面黄肌瘦',
                    '灰容土貌，不堪入目',
                    '相貌平平，还过得去',
                    '身材娇好，尚有姿色',
                    '婷婷玉立，眉清目秀',
                    '沉鱼落雁，闭月羞花',
                    '冰肌玉骨，翩若惊鸿',
                    '美央绝伦，人间仙子',
                  ]];
  // 性别
  const nGender = parseInt(g_objMemberInfo.gender / 2);
  // 相貌档次 (0 ~ 100)
  let nDescribe = parseInt(describe / 10);
  nDescribe = nDescribe < 0 ? 0 : nDescribe;
  nDescribe = nDescribe > 9 ? 9 : nDescribe;
  
  const result = `这位${arrCall[nGender]}生的是${arrWord[nGender][nDescribe]}。`;
  return result;
}

export default {
  formatLargeNumber,
  funComputedMemberInfoForBase,
  getExpMaxString,
  getTasteString,
  getTasteColor,
  getDescribeString,
}