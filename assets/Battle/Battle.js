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
let WebApi = require("../Kits/WebApi");
let AuthApi = require("../Kits/AuthApi");
let GameApi = require("../Kits/GameApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    this.arrRoundName = ['阳之阵', '阴之阵'];
    this.arrAttackAdj = ['张牙舞爪', '手舞足蹈', '眼疾手快', '动如脱兔', '全力以赴', '偷偷摸摸', '兔起鹘落', '轻手轻脚', '步罡踏斗', '楞手楞脚', '进退有度', '神出鬼没', '左右开弓'];
    this.arrAttackString = ['外功', '内功'];
    this.nKillCount = 0;
  },

  properties: {
    // 根节点
    m_root: {
      type: cc.Node,
      default: null
    },
    // 回合标题
    m_labelRound: {
      type: cc.Node,
      default: null
    },
    // 日志滚动式图
    m_logScrollView: {
      type: cc.Node,
      default: null
    },
    // 日志内容
    m_logContent: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    console.log('Battle start');
    Common.AdapterScreen(this.m_root);

    // 自定义初始化函数
    this.init();
  },

  onEnable () {
    console.log('Battle onEnable');
    this.registerEvent();
  },

  onDisable () {
    console.log('Battle onDisable');
    this.CancelEvent();
  },

  onDestroy() {
    console.log('Battle onDestroy');
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 注册事件
  registerEvent: function() {
    console.log('Battle registerEvent');
    // 注册公告栏消失事件
    this.node.on('hide-dlg', this.onHideDlg, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Battle CancelEvent');
    // 注销公告栏消失事件
    this.node.off('hide-dlg', this.onHideDlg, this);
  },

  // 隐藏对话框
  onHideDlg: function() {
    console.log('Battle onHideDlg');
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 初始化
  init: function() {
    console.log('Battle init');
    console.log('Battle g_arrMemberInfoA', g_arrMemberInfoA);
    console.log('Battle g_arrMemberInfoB', g_arrMemberInfoB);
    console.log('Battle g_arrBattleResult', g_arrBattleResult);

    g_arrBattleResult.forEach((item, index) => {
      setTimeout(() => {
        this.updateBattleRoundData(item, index);
      }, 2000 * index);
    });
  },

  // 通过ID获取角色姓名
  getMemberName: function(strID) {
    const arrMemberInfo = g_arrMemberInfoA.concat(g_arrMemberInfoB);
    const index = arrMemberInfo.findIndex((item) => {
      return item._id === strID;
    });
    return arrMemberInfo[index].nickName;
  },

  // 更新回合信息
  updateBattleRoundData: function(objBattleResultItem, nCount) {
    // 更新回合标题
    this.setRoundTitle(objBattleResultItem, nCount);
    // 更新战斗日志的内容
    this.createBattleLogLabel(objBattleResultItem, nCount);
    // 更新战斗日志的击杀情况
    if (objBattleResultItem.nHPDefense <= 0) {
      this.createKillLogLabel(objBattleResultItem, nCount);
    }
  },

  // 更新回合标题
  setRoundTitle: function(objBattleResultItem, nCount) {
    const strRoundTitle =  `第${Math.floor(objBattleResultItem.nRound / 2) + 1}回合` + 
                           `◆` + 
                           `${this.arrRoundName[objBattleResultItem.nRound % 2]}`;
    this.m_labelRound.getComponent(cc.Label).string = strRoundTitle;
  },

  // 更新战斗日志的内容
  createBattleLogLabel: function(objBattleResultItem, nCount) {
    const nLengthAdj = this.arrAttackAdj.length;
    const node = new cc.Node();
    node.x = 0;
    node.y = -(nCount + this.nKillCount) * 40;
    node.setAnchorPoint(cc.v2(0, 1))
    // node.color = GameApi.getPartsInfoColor(objPrize.id);
    const label = node.addComponent(cc.Label);
    label.fontSize = 24;
    label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
    if (objBattleResultItem.nEffectDefense === 0) {
      label.string = `【回合${Math.floor(objBattleResultItem.nRound / 2) + 1}】` + 
      `“${this.getMemberName(objBattleResultItem.strIDAttack)}”` + 
      `${this.arrAttackAdj[Math.floor(Math.random() * nLengthAdj)]}` +
      `发动${this.arrAttackString[objBattleResultItem.nRound % 2]}，结果被` + 
      `“${this.getMemberName(objBattleResultItem.strIDDefense)}”` + 
      `轻松的躲开了`;
    } else {
      label.string = `【回合${Math.floor(objBattleResultItem.nRound / 2) + 1}】` + 
      `“${this.getMemberName(objBattleResultItem.strIDAttack)}”` + 
      `${this.arrAttackAdj[Math.floor(Math.random() * nLengthAdj)]}` +
      `发动${this.arrAttackString[objBattleResultItem.nRound % 2]}对` + 
      `“${this.getMemberName(objBattleResultItem.strIDDefense)}”` + 
      `造成了` + 
      `${-objBattleResultItem.nEffectDefense}` + 
      `点伤害`;
    }
    this.m_logContent.addChild(node);
    this.m_logContent.height += 40;
    // 滚动到最下方
    this.m_logScrollView.getComponent(cc.ScrollView).scrollToBottom(0.5);
  },

  // 更新战斗日志的击杀情况
  createKillLogLabel: function(objBattleResultItem, nCount) {
    this.nKillCount++;
    const node = new cc.Node();
    node.x = 0;
    node.y = -(nCount + this.nKillCount) * 40;
    node.setAnchorPoint(cc.v2(0, 1))
    // node.color = GameApi.getPartsInfoColor(objPrize.id);
    const label = node.addComponent(cc.Label);
    label.fontSize = 24;
    label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
    label.string = `“${this.getMemberName(objBattleResultItem.strIDDefense)}”` + 
                   `体力不支，重伤之下已经无法战斗`;
      
    this.m_logContent.addChild(node);
    this.m_logContent.height += 40;
    // 滚动到最下方
    this.m_logScrollView.getComponent(cc.ScrollView).scrollToBottom(0.5);
  }
});
