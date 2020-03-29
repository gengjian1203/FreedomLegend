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
// funComputedMemberInfoAD
// 计算玩家的基础属性
//////////////////////////////////////////////////
function funComputedMemberInfoAD(level) {
  const objMemberInfo = {
    level: level,
    hp: level * 20 + 100,
    outerAttack: level * 10 + 20, // 外功
    innerAttack: level * 10 + 10, // 内功
    outerDefense: level * 10 + 10, // 外防
    innerDefense: level * 10 + 0, // 内防
    crit: 0, // 暴击率
    dodge: 0, // 闪避率
    block: 0, // 格挡率
    lucky: 0, // 幸运值
  };
  return objMemberInfo;
}

//////////////////////////////////////////////////
// formatDate
// 秒数格式化日期
//////////////////////////////////////////////////
function formatDate(seconds) {
  let nSeconds = new Number(seconds);
  const ss = Math.floor(nSeconds % 60);
  nSeconds = Math.floor(nSeconds / 60);
  const mm = Math.floor(nSeconds % 60);
  const hh = Math.floor(nSeconds / 60);
  let strResult = `${hh}时${mm}分${ss}秒`

  return strResult;
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

export default {
  formatLargeNumber,
  funComputedMemberInfoAD,
  formatDate,
  getExpMaxString,
  getTasteString,
  getTasteColor,
}