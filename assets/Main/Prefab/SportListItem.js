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
let WebApi = require("../Kits/WebApi");

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
    console.log('SportListItem onBtnBattleClick');

    const param = {
      arrMemberInfoA: [],
      arrMemberInfoB: []
    };
    // 保存奖励
    g_objPrize = [{
      id: '000003', 
      value: this.objSportListItemData.sportsNumber < g_objMemberInfo.sportsNumber ? this.objSportListItemData.sportsNumber : g_objMemberInfo.sportsNumber
    }];
    // 友军压入数组
    param.arrMemberInfoA.push(g_objMemberInfo);
    // 对手压入数组
    param.arrMemberInfoB.push(this.objSportListItemData);
    
    console.log('SportListItem onBtnBattleClick param', param);
    g_arrMemberInfoA = param.arrMemberInfoA;
    g_arrMemberInfoB = param.arrMemberInfoB;
    
    WebApi.fetchBattleResult(param).then((res) => {
      console.log('SportListItem onBtnBattleClick Success.', res);
      g_bBattleWin = res.bWin;
      g_arrBattleResult = res.arrListResult;
      g_strSceneBack = 'Main';
      
      // 跳转页
      cc.director.loadScene('Battle');
    }).catch((err) => {
      console.log('onBtnBattleClick Fail.', err);
    });
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
