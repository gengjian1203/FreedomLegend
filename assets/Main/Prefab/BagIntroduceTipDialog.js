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

  ctor() {
    // 按钮锁
    this.nCommand = -1;
    // 物品完整信息
    this.objBagListItemComplete = {};
  },

  properties: {
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 对话框节点
    m_dialog: {
      type: cc.Node,
      default: null
    },
    // 提示语信息
    m_labelMessage: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
  },

  onEnable () {
    console.log('BagIntroducetipDialog onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('BagIntroducetipDialog onDisable.');
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 注册事件
  registerEvent: function() {
    this.m_mask.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_mask.on('touchend', (event) => {
      event.stopPropagation();
    });
    this.m_dialog.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_dialog.on('touchend', (event) => {
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
    this.m_dialog.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_dialog.on('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 关闭对话框
  onHideIntroduceTipDialog: function() {
    console.log('BagIntroducetipDialog onHideIntroduceTipDialog.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-introduce-tip-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 点击确定按钮
  onBtnSubmitClick: function(e, param) {
    console.log('BagIntroducetipDialog onBtnSubmitClick');
    // 向装备列表发送消息
    const event = new cc.Event.EventCustom('submit-introduce-tip-dlg', true);
    const objParam = {
      nCommand: this.nCommand,
      objBagListItemComplete: this.objBagListItemComplete
    }
    event.setUserData(objParam);
    this.node.dispatchEvent(event);
    // 关闭对话框
    this.onHideIntroduceTipDialog();
  },

  // 点击取消按钮
  onBtnCancelClick: function(e, param) {
    console.log('BagIntroducetipDialog onBtnCancelClick');

    this.onHideIntroduceTipDialog();
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染提示信息的内容
  setTipDialogData: function(strMessage, nCommand, objBagListItemComplete) {
    console.log('BagIntroducetipDialog setTipMessage', strMessage);
    // 提示信息
    this.m_labelMessage.getComponent(cc.Label).string = strMessage;
    this.nCommand = nCommand;
    this.objBagListItemComplete = objBagListItemComplete;
  }
});
