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
// fillZero
// 个位数的十位用零补位
//////////////////////////////////////////////////
function fillZero(number) {
  var realNum;
  if (number < 10) {
      realNum = `0${number}`;
  } else {
      realNum = number;
  }
  return realNum;
}

//////////////////////////////////////////////////
// formatDate
// 秒数格式化时间
//////////////////////////////////////////////////
function formatDate(seconds) {
  let nSeconds = new Number(seconds);
  const ss = Math.floor(nSeconds % 60);
  nSeconds = Math.floor(nSeconds / 60);
  const mm = Math.floor(nSeconds % 60);
  const hh = Math.floor(nSeconds / 60);
  let strResult = '';
  if (hh) {
    strResult += `${fillZero(hh)}时`;
  }
  if (mm) {
    strResult += `${fillZero(mm)}分`;
  }
  strResult += `${fillZero(ss)}秒`;
  
  return strResult;
}

// 生成UUID
function getUUID () {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
 
  let uuid = s.join("");
  return uuid;
}

export default {
  AdapterScreen,
  isObjectEmpty,
  destructuringAssignment,
  formatDate,
  getUUID,
}