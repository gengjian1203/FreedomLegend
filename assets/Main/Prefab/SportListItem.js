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
    m_sprSign: {
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
    },
    // 是否存在挑战按钮
    m_btnBattle: {
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
    if (g_bBattleBtnLock) {
      return ;
    }
    g_bBattleBtnLock = true;

    const param = {
      arrMemberInfoA: [],
      arrMemberInfoB: []
    };
    // 保存奖励
    g_objPrize = [{
      id: '000003', 
      valueFriend: g_objMemberInfo.sportsNumber,
      valueOpponent: this.objSportListItemData.sportsNumber,
      _idOpponent: this.objSportListItemData._id,
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
      g_bBattleBtnLock = false;
    }).catch((err) => {
      console.log('onBtnBattleClick Fail.', err);
      g_bBattleBtnLock = false;
    });
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染比武者的item信息
  setSportListItemData: function(objSportListItemData) {
    console.log('setSportListItemData', objSportListItemData);
    this.objSportListItemData = objSportListItemData;
    
    // 不显示战斗标签逻辑：自己不能战斗自己、如果自己排名超过500不能战斗前5选手
    this.m_btnBattle.active = !(objSportListItemData.sportsNumber === g_objMemberInfo.sportsNumber);
    if (g_objMemberInfo.sportsNumber > 500 && objSportListItemData.sportsNumber <= 5) {
      this.m_btnBattle.active = false;
    }
    this.m_labelNumber.getComponent(cc.Label).string = `${this.objSportListItemData.sportsNumber}`;
    if (objSportListItemData.sportsNumber <= 5) {
      this.m_sprSign.active = true;
      this.m_labelNumber.color = cc.color(236, 177, 172);
    }
    this.m_labelName.getComponent(cc.Label).string = `${this.objSportListItemData.nickName}`;
    this.m_labelTaste.getComponent(cc.Label).string = `${GameApi.getTasteString(this.objSportListItemData.level)}`;
    this.m_labelTaste.color = GameApi.getTasteColor(this.objSportListItemData.level);
  }
});
