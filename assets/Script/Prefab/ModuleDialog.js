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
      m_self: {
        type: cc.Node,
        default: null
      },
      m_mask: {
        type: cc.Node,
        default: null
      },
      m_content: {
        type: cc.Node,
        default: null
      }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable () {
      console.log('ModuleDialog onEvable.');
      this.registerEvent();
    },

    onDisable () {
      console.log('ModuleDialog onDisable.');
      this.CancelEvent();
    },

    // update (dt) {},

    //////////////////////////////////////////////////
    // 交互事件绑定函数
    //////////////////////////////////////////////////
    onBtnOKClick: function() {
      console.log('ModuleDialog onBtnOKClick.');
      this.m_self.active = false;
      this.m_self.removeFromParent();
    },

    //////////////////////////////////////////////////
    // 自定义函数
    //////////////////////////////////////////////////
    // 注册事件
    registerEvent: function() {
      this.m_mask.on('touchstart', (event) => {
        event.stopPropagation();
      });
      this.m_mask.on('touchend', (event) => {
        event.stopPropagation();
      });
    },

    // 注销事件
    CancelEvent: function() {
      this.m_mask.off('touchstart', (event) => {
        event.stopPropagation();
      });
      this.m_mask.off('touchend', (event) => {
        event.stopPropagation();
      });
    },

    // 设置公告内容
    setNoticeContent: function(strNotice) {
      console.log('ModuleDialog setNoticeContent.', strNotice);
      this.m_content.getComponent(cc.Label).string = strNotice;
    }
});
