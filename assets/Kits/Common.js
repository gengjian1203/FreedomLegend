//////////////////////////////////////////////////
// AdapterScreen
// 适配iphoneX的刘海屏
//////////////////////////////////////////////////
function AdapterScreen(node) {
  const isNotFit = (cc.winSize.width / cc.winSize.height) <= 1.65;
  if (isNotFit) {
    console.log('Common.AdapterScreen', isNotFit);
    const cvs = node.getComponent(cc.Canvas);
    cvs.fitHeight = true;
    cvs.fitWidth = true;
  }
}

export default {
  AdapterScreen,
}