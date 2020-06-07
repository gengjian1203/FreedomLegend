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
let Common = require("../Kits/Common");

cc.Class({
  extends: cc.Component,

  ctor() {
    this.arrWorkData = [];
    this.nIndex = 0;
  },

  properties: {
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 对话文本
    m_labelTalk: {
      type: cc.Node,
      default: null
    },
    // 自己姓名
    m_labelFri: {
      type: cc.Node,
      default: null
    },
    // 敌方姓名
    m_labelOpp: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    // 初始化剧情对话
    this.nIndex = 0;
    this.arrWorkData = [];

    // 读取剧情数据
    this.arrWorkData = GameApi.getWorkInfo(String(g_nBattleStory)).work;
    console.log('start arrWorkData', this.arrWorkData);

    if (this.arrWorkData && this.arrWorkData.length) {
      this.setTalk();
    } else {
      this.closeWorkModule();
    }
  },

  onEnable () {
    console.log('WorkModule onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('WorkModule onDisable.');
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
      this.onNextTalk();
    });
  },

  // 注销事件
  CancelEvent: function() {
    this.m_mask.off('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_mask.off('touchend', (event) => {
      event.stopPropagation();
      this.onNextTalk();
    });
  },

  // 关闭剧情模式
  closeWorkModule: function() {
    console.log('WorkModule closeWorkModule.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-work-module', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 下一句剧情语句
  onNextTalk: function() {
    if (this.nIndex + 1 < this.arrWorkData.length) {
      this.nIndex++;
      this.setTalk();
    } else {
      this.closeWorkModule();
    }
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染剧情对话
  setTalk: function() {
    this.m_labelFri.getComponent(cc.Label).string = this.arrWorkData[this.nIndex].nameFri === 'myself' ? g_objUserInfo.nickName : this.arrWorkData[this.nIndex].nameFri;
    this.m_labelOpp.getComponent(cc.Label).string = this.arrWorkData[this.nIndex].nameOpp;
    this.m_labelTalk.getComponent(cc.Label).string = this.arrWorkData[this.nIndex].text;
  },
});
