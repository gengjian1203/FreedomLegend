//////////////////////////////////////////////////
// LoadDatabasePartsinfo
// 加载物品资料库到缓存中
// param:
// return:
// Boolean
//////////////////////////////////////////////////
function LoadDatabasePartsinfo() {
  const strKeyPartsInfo = 'partsinfo';
  cc.loader.loadRes('database_partsinfo.json', (err, object) => {
    if (err) {
      console.log('LoadDatabasePartsinfo fail', err);
      return;
    }
    if (object && object.json) {
      console.log('LoadDatabasePartsinfo', object.json);
      object.json[strKeyPartsInfo].forEach((item) => {
        cc.sys.localStorage.setItem(`${strKeyPartsInfo}-${item._id}`, item);
      });
    }
  });
}

//////////////////////////////////////////////////
// LoadDatabaseStory
// 加载剧情数据数据到缓存中
// param:
// return:
// Boolean
//////////////////////////////////////////////////
function LoadDatabaseStory() {
  const strKeyStory = 'story';
  cc.loader.loadRes('database_story.json', (err, object) => {
    if (err) {
      console.log('LoadDatabaseStory fail', err);
      return;
    }
    if (object && object.json) {
      console.log('LoadDatabaseStory', object.json);
      object.json[strKeyStory].forEach((item) => {
        cc.sys.localStorage.setItem(`${strKeyStory}-${item.id}`, item);
      });
      cc.sys.localStorage.setItem(`${strKeyStory}-Length`, object.json[strKeyStory].length);
    }
  });
}

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
// funComputedMemberInfoForEquipment
// 计算玩家的装备属性
//////////////////////////////////////////////////
function funComputedMemberInfoForEquipment(objEquipment) {
  const objResult = {
    hp: objEquipment.hp ? objEquipment.hp + objEquipment.hp_up * (objEquipment.level - 1) : 0,
    outerAttack: objEquipment.outerAttack ? objEquipment.outerAttack + objEquipment.outerAttack_up * (objEquipment.level - 1) : 0,
    innerAttack: objEquipment.innerAttack ? objEquipment.innerAttack + objEquipment.innerAttack_up * (objEquipment.level - 1) : 0,
    outerDefense: objEquipment.outerDefense ? objEquipment.outerDefense + objEquipment.outerDefense_up * (objEquipment.level - 1) : 0,
    innerDefense: objEquipment.innerDefense ? objEquipment.innerDefense + objEquipment.innerDefense_up * (objEquipment.level - 1) : 0,
    crit: objEquipment.crit ? objEquipment.crit + objEquipment.crit_up * (objEquipment.level - 1) : 0,
    dodge: objEquipment.dodge ? objEquipment.dodge + objEquipment.dodge_up * (objEquipment.level - 1) : 0,
    speed: objEquipment.speed ? objEquipment.speed + objEquipment.speed_up * (objEquipment.level - 1) : 0,
    understand: objEquipment.understand ? objEquipment.understand + objEquipment.understand_up * (objEquipment.level - 1) : 0,
  };

  return objResult;
}

//////////////////////////////////////////////////
// funComputedMemberInfo
// 计算玩家的基础属性
//////////////////////////////////////////////////
function funComputedMemberInfo(level) {
  // 获取装备对象
  const objEquipmentHat = funComputedMemberInfoForEquipment(g_objMemberInfo.equipment_hat);
  const objEquipmentShoulder = funComputedMemberInfoForEquipment(g_objMemberInfo.equipment_shoulder);
  const objEquipmentJacket = funComputedMemberInfoForEquipment(g_objMemberInfo.equipment_jacket);
  const objEquipmentWeapon = funComputedMemberInfoForEquipment(g_objMemberInfo.equipment_weapon);
  const objEquipmentJewelry = funComputedMemberInfoForEquipment(g_objMemberInfo.equipment_jewelry);
  const objEquipmentShoes = funComputedMemberInfoForEquipment(g_objMemberInfo.equipment_shoes);

  // 基本属性临时存储器
  const objTempBase = {
    hp_base: level * 50 + 100,                        // 生命
    outerAttack_base: level * 10 + 20,                // 外功
    innerAttack_base: level * 10 + 10,                // 内功
    outerDefense_base: level * 1 + 10,               // 外防
    innerDefense_base: level * 1 + 0,                // 内防
    crit_base: g_objMemberInfo.crit_base,             // 暴击率
    dodge_base: g_objMemberInfo.dodge_base,           // 闪避率
    speed_base: g_objMemberInfo.speed_base,           // 速度
    understand_base: g_objMemberInfo.understand_base, // 悟性
  };
  // 装备属性临时存储器
  const objTempEquipment = {
    hp_equipment: objEquipmentHat.hp + objEquipmentShoulder.hp + objEquipmentJacket.hp + objEquipmentWeapon.hp + objEquipmentJewelry.hp + objEquipmentShoes.hp,
    outerAttack_equipment: objEquipmentHat.outerAttack + objEquipmentShoulder.outerAttack + objEquipmentJacket.outerAttack + objEquipmentWeapon.outerAttack + objEquipmentJewelry.outerAttack + objEquipmentShoes.outerAttack,
    innerAttack_equipment: objEquipmentHat.innerAttack + objEquipmentShoulder.innerAttack + objEquipmentJacket.innerAttack + objEquipmentWeapon.innerAttack + objEquipmentJewelry.innerAttack + objEquipmentShoes.innerAttack,
    outerDefense_equipment: objEquipmentHat.outerDefense + objEquipmentShoulder.outerDefense + objEquipmentJacket.outerDefense + objEquipmentWeapon.outerDefense + objEquipmentJewelry.outerDefense + objEquipmentShoes.outerDefense,
    innerDefense_equipment: objEquipmentHat.innerDefense + objEquipmentShoulder.innerDefense + objEquipmentJacket.innerDefense + objEquipmentWeapon.innerDefense + objEquipmentJewelry.innerDefense + objEquipmentShoes.innerDefense,
    crit_equipment: objEquipmentHat.crit + objEquipmentShoulder.crit + objEquipmentJacket.crit + objEquipmentWeapon.crit + objEquipmentJewelry.crit + objEquipmentShoes.crit,
    dodge_equipment: objEquipmentHat.dodge + objEquipmentShoulder.dodge + objEquipmentJacket.dodge + objEquipmentWeapon.dodge + objEquipmentJewelry.dodge + objEquipmentShoes.dodge,
    speed_equipment: objEquipmentHat.speed + objEquipmentShoulder.speed + objEquipmentJacket.speed + objEquipmentWeapon.speed + objEquipmentJewelry.speed + objEquipmentShoes.speed,
    understand_equipment: objEquipmentHat.understand + objEquipmentShoulder.understand + objEquipmentJacket.understand + objEquipmentWeapon.understand + objEquipmentJewelry.understand + objEquipmentShoes.understand,
  };
  // 丹药属性临时存储器
  const objTempMedicine = {
    hp_medicine: 0,
    outerAttack_medicine: 0,
    innerAttack_medicine: 0,
    outerDefense_medicine: 0,
    innerDefense_medicine: 0,
    crit_medicine: 0,
    dodge_medicine: 0,
    speed_medicine: 0,
    understand_medicine: 0,
  };

  const objMemberInfo = {
    level: level,
    // 基础属性
    hp_base: objTempBase.hp_base,                       // 生命
    outerAttack_base: objTempBase.outerAttack_base,     // 外功
    innerAttack_base: objTempBase.innerAttack_base,     // 内功
    outerDefense_base: objTempBase.outerDefense_base,   // 外防
    innerDefense_base: objTempBase.innerDefense_base,   // 内防
    crit_base: objTempBase.crit_base,                   // 暴击率
    dodge_base: objTempBase.dodge_base,                 // 闪避率
    speed_base: objTempBase.speed_base,                 // 速度
    understand_base: objTempBase.understand_base,       // 悟性
    // 装备属性
    hp_equipment: objTempEquipment.hp_equipment,
    outerAttack_equipment: objTempEquipment.outerAttack_equipment,
    innerAttack_equipment: objTempEquipment.innerAttack_equipment,
    outerDefense_equipment: objTempEquipment.outerDefense_equipment,
    innerDefense_equipment: objTempEquipment.innerDefense_equipment,
    crit_equipment: objTempEquipment.crit_equipment,
    dodge_equipment: objTempEquipment.dodge_equipment,
    speed_equipment: objTempEquipment.speed_equipment,
    understand_equipment: objTempEquipment.understand_equipment,
    // 丹药属性
    hp_medicine: objTempMedicine.hp_medicine,
    outerAttack_medicine: objTempMedicine.outerAttack_medicine,
    innerAttack_medicine: objTempMedicine.innerAttack_medicine,
    outerDefense_medicine: objTempMedicine.outerDefense_medicine,
    innerDefense_medicine: objTempMedicine.innerDefense_medicine,
    crit_medicine: objTempMedicine.crit_medicine,
    dodge_medicine: objTempMedicine.dodge_medicine,
    speed_medicine: objTempMedicine.speed_medicine,
    understand_medicine: objTempMedicine.understand_medicine,
    // 综合属性
    hp_total: objTempBase.hp_base + objTempEquipment.hp_equipment + objTempMedicine.hp_medicine, // 生命
    outerAttack_total: objTempBase.outerAttack_base + objTempEquipment.outerAttack_equipment + objTempMedicine.outerAttack_medicine, // 外功
    innerAttack_total: objTempBase.innerAttack_base + objTempEquipment.innerAttack_equipment + objTempMedicine.innerAttack_medicine, // 内功
    outerDefense_total: objTempBase.outerDefense_base + objTempEquipment.outerDefense_equipment + objTempMedicine.outerDefense_medicine, // 外防
    innerDefense_total: objTempBase.innerDefense_base + objTempEquipment.innerDefense_equipment + objTempMedicine.innerDefense_medicine, // 内防
    crit_total: objTempBase.crit_base + objTempEquipment.crit_equipment + objTempMedicine.crit_medicine, // 暴击率
    dodge_total: objTempBase.dodge_base + objTempEquipment.dodge_equipment + objTempMedicine.dodge_medicine, // 闪避率
    speed_total: objTempBase.speed_base + objTempEquipment.speed_equipment + objTempMedicine.speed_medicine, // 速度
    understand_total: objTempBase.understand_base + objTempEquipment.understand_equipment + objTempMedicine.understand_medicine, // 悟性
  };
  // 战力
  objMemberInfo.power = objMemberInfo.hp_total + 
                        objMemberInfo.outerAttack_total + 
                        objMemberInfo.innerAttack_total + 
                        objMemberInfo.outerDefense_total + 
                        objMemberInfo.innerDefense_total + 
                        objMemberInfo.crit_total + 
                        objMemberInfo.dodge_total + 
                        objMemberInfo.speed_total + 
                        objMemberInfo.understand_total;
                        
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
// 通过当前等级，计算当前的境界的展示颜色
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

//////////////////////////////////////////////////
// getPartsInfoComplete
// 通过物品ID，获取物品的完整信息
// param:
// id: String       物品资料库ID
// return:
// Object           物品完整信息
//////////////////////////////////////////////////
function getPartsInfoComplete(id) {
  const strKeyPartsInfo = 'partsinfo';
  const objResult = cc.sys.localStorage.getItem(`${strKeyPartsInfo}-${id}`);
  return objResult;
}

//////////////////////////////////////////////////
// getPartsInfoColor
// 通过物品ID，计算物品品级的颜色
// param:
// id: String       物品资料库ID
// return:
// cc.color         cc颜色对象
//////////////////////////////////////////////////
function getPartsInfoColor(id) {
  const grade = parseInt(id.slice(2, 4));
  const index = Math.floor(grade / 3);
  const arrPartsInfoColor = [[255, 255, 255],   // 白色 0品 
                             [50, 50, 50],      // 灰色 3品 常见
                             [0, 0, 255],       // 蓝色 6品 少见
                             [0, 255, 0],       // 绿色 9品 稀有
                             [255, 0, 255],     // 紫色 12品 传说
                             [255, 255, 0],     // 金色 15品 史诗
                             [255, 0, 0]];      // 红色 18品 神器
  return new cc.color(arrPartsInfoColor[index][0], arrPartsInfoColor[index][1], arrPartsInfoColor[index][2]);
}

//////////////////////////////////////////////////
// getPartsInfoType
// 通过物品ID，解构物品相关信息
// param:
// id: String       物品资料库ID
// return:
// Object           物品相关信息{ nType: 10 - 装备
//                              nGrade: 品级
//                              nPosition: 部位
//                              nComplete: 0 - 完整  1 - 碎片
//////////////////////////////////////////////////
function getPartsInfoType(id) {
  const objResult = {
    nType: parseInt(id.slice(0, 2)),
    nGrade: parseInt(id.slice(2, 4)),
    nPosition: parseInt(id.slice(4, 5)),
    nComplete: parseInt(id.slice(5, 6)),
  };
  return objResult;
}

//////////////////////////////////////////////////
// getPartsInfoFragment
// 通过碎片ID，合成物品需要多少碎片 / 通过物品ID，分解物品得到多少碎片。
// param:
// id: String       物品资料库ID
// return:
// Number           返回结果碎片数量
//////////////////////////////////////////////////
function getPartsInfoFragments(id) {
  const nType = parseInt(id.slice(0, 2));
  const nGrade = parseInt(id.slice(2, 4));
  const nComplete = parseInt(id.slice(5, 6));
  let nFragment = 0;

  switch (nType) {
    case 10:
      nFragment = (nGrade * 10) * (nComplete === 0 ? 0.8 : 1);
      break;
    default:
      nFragment = 1000;
      break;
  }
  return nFragment;
}

//////////////////////////////////////////////////
// getStoryLength
// 获取当前章节总数
// param:
// return:
// Number                  返回章节总数
//////////////////////////////////////////////////
function getStoryLength() {
  const strKeyStory = 'story';
  const nResult = cc.sys.localStorage.getItem(`${strKeyStory}-Length`);
  return nResult;
}

//////////////////////////////////////////////////
// getStoryInfo
// 通过章节号获取章节名字
// param:
// nChapters: Number       章节号
// return:
// Object                  返回该章节的具体信息
//////////////////////////////////////////////////
function getStoryInfo(nChapters) {
  const strKeyStory = 'story';
  const objResult = cc.sys.localStorage.getItem(`${strKeyStory}-${nChapters}`);
  return objResult;
}

export default {
  LoadDatabasePartsinfo,
  LoadDatabaseStory,
  formatLargeNumber,
  funComputedMemberInfo,
  getExpMaxString,
  getTasteString,
  getTasteColor,
  getDescribeString,
  getPartsInfoComplete,
  getPartsInfoColor,
  getPartsInfoType,
  getPartsInfoFragments,
  getStoryLength,
  getStoryInfo,
}