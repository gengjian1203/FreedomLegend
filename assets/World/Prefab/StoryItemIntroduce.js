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
    // 该条章节的基本信息
    this.objStoryInfo = {};
  },

  properties: {
    // 章节名称
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 对手内容节点
    m_rootOpponent: {
      type: cc.Node,
      default: null
    },
    // 奖励内容节点
    m_rootPrize: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    
  },

  onEnable () {
    console.log('BagListItemIntroduce onEvable.');
  },

  onDisable () {
    console.log('BagListItemIntroduce onDisable.');
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  onBtnBattleClick: function() {
    console.log('onBtnBattleClick');

    const param = {
      arrMemberInfoA: [],
      arrMemberInfoB: []
    };
    // 保存奖励
    g_objPrize = this.objStoryInfo.prize;
    // 友军压入数组
    param.arrMemberInfoA.push(g_objMemberInfo);
    // 对手压入数组
    this.objStoryInfo.opponent.forEach((item) => {
      param.arrMemberInfoB.push(item);
    });
    console.log('onBtnBattleClick param', param);
    g_arrMemberInfoA = param.arrMemberInfoA;
    g_arrMemberInfoB = param.arrMemberInfoB;
    
    WebApi.fetchBattleResult(param).then((res) => {
      console.log('onBtnBattleClick Success.', res);
      g_bBattleWin = res.bWin;
      g_arrBattleResult = res.arrListResult;
      
      // 跳转页
      cc.director.loadScene('Battle');
    }).catch((err) => {
      console.log('onBtnBattleClick Fail.', err);
    });
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染对手的信息
  createOpponentLabel: function(objOpponent, nCount) {
    // 对手姓名
    const node1 = new cc.Node();
    node1.x = -60;
    node1.y = -(nCount + 1) * 40;
    node1.width = 120;
    node1.color = cc.color(255, 255, 255);
    const label1 = node1.addComponent(cc.Label);
    label1.fontSize = 24;
    label1.string = `${objOpponent.nickName}`;
    label1.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    this.m_rootOpponent.addChild(node1);
    // 对手境界
    const node2 = new cc.Node();
    node2.x = 65;
    node2.y = -(nCount + 1) * 40;
    node2.width = 120;
    node2.color = GameApi.getTasteColor(objOpponent.level);
    const label2 = node2.addComponent(cc.Label);
    label2.fontSize = 24;
    label2.string = `【${GameApi.getTasteString(objOpponent.level)}】`;
    label2.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    this.m_rootOpponent.addChild(node2);
    // 
    this.m_rootOpponent.height += 40;
  },

  // 渲染奖励的内容
  createPrizeLabel: function(objPrize, nCount) {
    const node = new cc.Node();
    node.x = 0;
    node.y = -(nCount + 1) * 40;
    node.color = GameApi.getPartsInfoColor(objPrize.id);
    const label = node.addComponent(cc.Label);
    label.fontSize = 24;
    label.string = `${GameApi.getPartsInfoComplete(objPrize.id).name} ×${objPrize.total}`;
    this.m_rootPrize.addChild(node);
    this.m_rootPrize.height += 40;
  },

  // 渲染背包物品item信息
  setBagListItemIntroduceData: function(objStoryInfo) {
    this.objStoryInfo = objStoryInfo;

    this.m_labelName.getComponent(cc.Label).string = `${this.objStoryInfo.title}`;
    // 渲染对手信息
    this.objStoryInfo.opponent.forEach((item, index) => {
      this.createOpponentLabel(item, index);
    });
    // 渲染奖励信息
    this.objStoryInfo.prize.forEach((item, index) => {
      this.createPrizeLabel(item, index);
    })
  }
});
