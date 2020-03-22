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
  console.log('Common.AdapterScreen', root.width, root.height);

  if(root.height / root.width > fHW) {
    root.height = parseInt(root.width * fHW);
  } else {
    root.width = parseInt(root.height / fHW);
  }
  
  console.log('Common.AdapterScreen', root.width, root.height);

}

export default {
  AdapterScreen,
}