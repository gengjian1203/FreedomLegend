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

  },

  properties: {
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 等级 - 旧
    m_labelTaste_Old: {
      type: cc.Node,
      default: null
    },
    // 等级 - 新
    m_labelTaste_New: {
      type: cc.Node,
      default: null
    },
    // 生命 - 旧
    m_labelHP_Old: {
      type: cc.Node,
      default: null
    },
    // 生命 - 新
    m_labelHP_New: {
      type: cc.Node,
      default: null
    },
    // 外功 - 旧
    m_labelOuterAttack_Old: {
      type: cc.Node,
      default: null
    },
    // 外功 - 新
    m_labelOuterAttack_New: {
      type: cc.Node,
      default: null
    },
    // 内功 - 旧
    m_labelInnerAttack_Old: {
      type: cc.Node,
      default: null
    },
    // 内功 - 新
    m_labelInnerAttack_New: {
      type: cc.Node,
      default: null
    },
    // 外防 - 旧
    m_labelOuterDefense_Old: {
      type: cc.Node,
      default: null
    },
    // 外防 - 新
    m_labelOuterDefense_New: {
      type: cc.Node,
      default: null
    },
    // 内防 - 旧
    m_labelInnerDefense_Old: {
      type: cc.Node,
      default: null
    },
    // 内防 - 新
    m_labelInnerDefense_New: {
      type: cc.Node,
      default: null
    },
    // 暴击 - 旧
    m_labelCrit_Old: {
      type: cc.Node,
      default: null
    },
    // 暴击 - 新
    m_labelCrit_New: {
      type: cc.Node,
      default: null
    },
    // 闪避 - 旧
    m_labelDodge_Old: {
      type: cc.Node,
      default: null
    },
    // 闪避 - 新
    m_labelDodge_New: {
      type: cc.Node,
      default: null
    },
    // 格挡 - 旧
    m_labelBlock_Old: {
      type: cc.Node,
      default: null
    },
    // 格挡 - 新
    m_labelBlock_New: {
      type: cc.Node,
      default: null
    },
    // 幸运 - 旧
    m_labelLucky_Old: {
      type: cc.Node,
      default: null
    },
    // 幸运 - 新
    m_labelLucky_New: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {

  },

  onEnable () {
    console.log('HookDlg onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('HookDlg onDisable.');
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 关闭对话框
  onBtnOKClick: function() {
    console.log('HookDlg onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-levelup-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },
  
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

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染奖励信息
  setLevelupData(objOld, objNew) {
    this.m_labelTaste_Old.getComponent(cc.Label).string = GameApi.getTasteString(objOld.level);
    this.m_labelTaste_New.getComponent(cc.Label).string = GameApi.getTasteString(objNew.level);
    this.m_labelHP_Old.getComponent(cc.Label).string = objOld.hp;
    this.m_labelHP_New.getComponent(cc.Label).string = objNew.hp;
    this.m_labelOuterAttack_Old.getComponent(cc.Label).string = objOld.outerAttack;
    this.m_labelOuterAttack_New.getComponent(cc.Label).string = objNew.outerAttack;
    this.m_labelInnerAttack_Old.getComponent(cc.Label).string = objOld.innerAttack;
    this.m_labelInnerAttack_New.getComponent(cc.Label).string = objNew.innerAttack;
    this.m_labelOuterDefense_Old.getComponent(cc.Label).string = objOld.outerDefense;
    this.m_labelOuterDefense_New.getComponent(cc.Label).string = objNew.outerDefense;
    this.m_labelInnerDefense_Old.getComponent(cc.Label).string = objOld.innerDefense;
    this.m_labelInnerDefense_New.getComponent(cc.Label).string = objNew.innerDefense;
    this.m_labelCrit_Old.getComponent(cc.Label).string = objOld.crit;
    this.m_labelCrit_New.getComponent(cc.Label).string = objNew.crit;
    this.m_labelDodge_Old.getComponent(cc.Label).string = objOld.dodge;
    this.m_labelDodge_New.getComponent(cc.Label).string = objNew.dodge;
    this.m_labelBlock_Old.getComponent(cc.Label).string = objOld.block;
    this.m_labelBlock_New.getComponent(cc.Label).string = objNew.block;
    this.m_labelLucky_Old.getComponent(cc.Label).string = objOld.lucky;
    this.m_labelLucky_New.getComponent(cc.Label).string = objNew.lucky;
  }

});
