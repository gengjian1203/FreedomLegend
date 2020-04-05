// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let GameApi = require("../Kits/GameApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    // 气泡对话框
    this.m_dlgTip = null;
    // 按钮锁
    this.bLockButton = false;
  },

  properties: {
    // 预制体 - 气泡弹窗
    m_prefabTip: {
      type: cc.Prefab,
      default: null
    },
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    m_dialog: {
      type: cc.Node,
      default: null
    },
    // 物品名称
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 物品介绍
    m_labelIntroduce: {
      type: cc.Node,
      default: null
    },
    // 物品引言
    m_labelDescribe: {
      type: cc.Node,
      default: null
    },
    // 物品属性
    m_rootAttribute: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
  },

  onEnable () {
    console.log('IntroduceDialog onEvable.');
    this.node.on('hide-toast-dlg', this.onHideToastDlg, this);
    this.registerEvent();
  },

  onDisable () {
    console.log('IntroduceDialog onDisable.');
    this.node.off('hide-toast-dlg', this.onHideToastDlg, this);
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
      this.onHideIntroduceDialog();
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
      this.onHideIntroduceDialog();
    });
    this.m_dialog.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_dialog.on('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 关闭对话框
  onHideIntroduceDialog: function() {
    console.log('IntroduceDialog onHideIntroduceDialog.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-introduce-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 点击使用按钮
  onBtnUseClick: function(e, param) {
    console.log('IntroduceDialog onBtnUseClick');
    
    this.onHideIntroduceDialog();
  },

  // 点击丢弃按钮
  onBtnGiveupClick: function(e, param) {
    console.log('IntroduceDialog onBtnGiveupClick');
    
    this.onHideIntroduceDialog();
  },

  // 隐藏气泡弹窗
  onHideToastDlg: function() {
    console.log('IntroduceDialog onHideToastDlg');
    this.bLockButton = false;
  },

  // // 显示气泡对话框 
  // showToastDlg: function(strMsg) {
  //   this.m_dlgToast = cc.instantiate(this.m_prefabToast);
  //   this.m_dlgToast.getComponent('ToastDialog').setToastContent(strMsg);
  //   this.node.addChild(this.m_dlgToast);
  // },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染物品信息的内容
  setItemIntroduce: function(objBagListItemComplete) {
    console.log('IntroduceDialog setItemIntroduce', objBagListItemComplete);

    const strLevel = (parseInt(objBagListItemComplete.id) % 10 === 0) ? `(Lv.${objBagListItemComplete.level})` : ``;
    // 物品名称
    this.m_labelName.getComponent(cc.Label).string = `${objBagListItemComplete.name}${strLevel}`;
    this.m_labelName.color = GameApi.getPartsInfoColor(objBagListItemComplete.id);
    // 物品介绍
    this.m_labelIntroduce.getComponent(cc.Label).string = objBagListItemComplete.introduce ? objBagListItemComplete.introduce : '';
    // 物品引言
    this.m_labelDescribe.getComponent(cc.Label).string = objBagListItemComplete.describe ? objBagListItemComplete.describe: '';
  }

});
