// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let Common = require("../Kits/Common");

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
    // 离线时间文字
    m_labelTime: {
      type: cc.Node,
      default: null
    },
    // 经验奖励文字
    m_labelExp: {
      type: cc.Node,
      default: null
    },
    // 铜钱奖励文字
    m_labelMoney: {
      type: cc.Node,
      default: null
    },
    // 元宝奖励文字
    m_labelGold: {
      type: cc.Node,
      default: null
    }
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
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-hook-dlg', true) );
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
  setHookAwardData(nMeasure, nExp, nMoney, nGold) {
    const strTime = `您本次离线了${Common.formatDate(nMeasure)}`;
    const strExp = `经验 + ${nExp}`;
    const strMoney = `铜钱 + ${nMoney}`;
    const strGold = `元宝 + ${nGold}`;

    this.m_labelTime.getComponent(cc.Label).string = strTime;
    this.m_labelExp.getComponent(cc.Label).string = strExp;
    this.m_labelMoney.getComponent(cc.Label).string = strMoney;
    this.m_labelGold.getComponent(cc.Label).string = strGold;
  }

});
