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
    // 该条章节的基本信息
    this.objStoryInfo = {};
    this.index = -1;
  },

  properties: {
    // 章节名称
    m_labelName: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    
  },

  onEnable () {
    console.log('BagListItem onEvable.');
  },

  onDisable () {
    console.log('BagListItem onDisable.');
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  onShowIntroduceDlg: function() {
    const event = new cc.Event.EventCustom('select-story-introduce', true);
    event.setUserData(this.index);

    this.node.dispatchEvent(event);
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染章节的子项item信息
  setStoryItemData: function(objStoryInfo, index) {
    this.objStoryInfo = objStoryInfo;
    this.index = index;

    this.m_labelName.getComponent(cc.Label).string = `${this.objStoryInfo.title}`;
  }
});
