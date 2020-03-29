//////////////////////////////////////////////////
// AdapterScreen
// 适配iphoneX的刘海屏，
// 前置条件让屏幕展示出来全部的canvas，root进行缩放，漏出部分以底色背景填充
// fitHeight = false;
// fitWidth = true;
//////////////////////////////////////////////////
function AdapterScreen(root) {  
  // iphone标准宽高比
  const fHW = 667 / 375;
  // 移除widget
  var widget = root.getComponent(cc.Widget);
  root.removeComponent(widget);

  // 重新计算根节点的宽高
  console.log('Common.AdapterScreen before', root.width, root.height);

  if(root.height / root.width > fHW) {
    root.height = parseInt(root.width * fHW);
  } else {
    root.width = parseInt(root.height / fHW);
  }
  
  console.log('Common.AdapterScreen after', root.width, root.height);
}

//////////////////////////////////////////////////
// isObjectEmpty
// 判断对象是否为空
//////////////////////////////////////////////////
function isObjectEmpty(obj) {
  return (JSON.stringify(obj) === '{}');
}

//////////////////////////////////////////////////
// destructuringAssignment
// 解构赋值
//////////////////////////////////////////////////
function destructuringAssignment(objBase, objAdd) {
  let objResult = objBase;
  for (let key in objAdd){
    objResult[key] = objAdd[key];
  };
  return objResult;
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


export default {
  AdapterScreen,
  isObjectEmpty,
  destructuringAssignment,
  formatLargeNumber,
  funComputedMemberInfoAD,
  formatDate,
  getExpMaxString,
}