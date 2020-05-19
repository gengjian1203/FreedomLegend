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
    // 该挑战者的基本信息
    this.objSportListItemData = {};
  },

  properties: {
    // 该挑战者的排名
    m_labelNumber: {
      type: cc.Node,
      default: null
    },
    // 该挑战者的姓名
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 该挑战者的境界
    m_labelTaste: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    
  },

  onEnable () {
    console.log('SportListItem onEvable.');
  },

  onDisable () {
    console.log('SportListItem onDisable.');
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  onBtnBattleClick: function() {

  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染背包物品item信息
  setSportListItemData: function(objSportListItemData) {
    console.log('setSportListItemData', objSportListItemData);
    this.objSportListItemData = objSportListItemData;

    this.m_labelNumber.getComponent(cc.Label).string = `${this.objSportListItemData.sportsNumber}`;
    this.m_labelName.getComponent(cc.Label).string = `${this.objSportListItemData.nickName}`;
    this.m_labelTaste.getComponent(cc.Label).string = `${GameApi.getTasteString(this.objSportListItemData.level)}`;
    this.m_labelTaste.color = GameApi.getTasteColor(this.objSportListItemData.level);
  }
});
