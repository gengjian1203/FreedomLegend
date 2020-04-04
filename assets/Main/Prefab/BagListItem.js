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
let GameApi = require("../Kits/GameApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    // 信息弹窗
    this.m_dlgIntroduce = null;
    // 该条数据的完整信息
    this.objBagListItemComplete = {};
  },

  properties: {
    // 预制体 - 信息弹窗
    m_prefabIntroduce: {
      type: cc.Prefab,
      default: null
    },
    // 物品名称
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 物品数量
    m_labelTotal: {
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
    const event = new cc.Event.EventCustom('show-introduce-dlg', true);
    event.setUserData(this.objBagListItemComplete);

    this.node.dispatchEvent(event);
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 通过物品ID获取物品详细信息
  getBagListItemComplete: function(objBagListItemBase) {
    this.objBagListItemComplete = objBagListItemBase;
  },

  // 渲染背包物品item信息
  setBagListItemData: function(objBagListItemBase) {
    this.getBagListItemComplete(objBagListItemBase);

    this.m_labelName.getComponent(cc.Label).string = this.objBagListItemComplete.name;
    this.m_labelTotal.getComponent(cc.Label).string = `×${this.objBagListItemComplete.total}`;
  }
});
