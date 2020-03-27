// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      m_line: {
        type: cc.Node,
        default: null
      },
      m_runner: {
        type: cc.Node,
        default: null
      }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      // 开始runner的动画
      this.m_runner.getComponent(cc.Animation).play('Run');
    },

    // update (dt) {},

    //////////////////////////////////////////////////
    // 交互事件
    //////////////////////////////////////////////////

    //////////////////////////////////////////////////
    // 自定义函数
    //////////////////////////////////////////////////
    setProgressPer: function(nPer) {
      const windowSize = cc.winSize;
      console.log('setProgressPer', windowSize);
      // 设置进度条长度
      this.m_line.width = windowSize.width * (nPer / 100);
      this.m_line.x = -375;
      // 设置runner位置
      this.m_runner.x = -360 + windowSize.width * (nPer / 100);
    }
});
