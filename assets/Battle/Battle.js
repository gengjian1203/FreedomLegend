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
    // 所有角色信息
    this.arrMemberInfoAll = [];
    this.arrPrefabPlayerAll = [];
    // 友方位置信息
    this.arrFriendsPosition = [cc.v2(-220, -310), cc.v2(-110, -205), cc.v2(-110, -430), cc.v2(-275, -140), cc.v2(-275, -500)];
    // 敌方位置信息
    this.arrOpponentPosition = [cc.v2(220, -310), cc.v2(110, -205), cc.v2(110, -430), cc.v2(275, -140), cc.v2(275, -500)];
    this.arrRoundName = ['阳之阵', '阴之阵'];
    this.arrRoundColor = [cc.color(255, 0, 0), cc.color(0, 0, 255)];
    this.arrAttackAdj = ['张牙舞爪', '手舞足蹈', '眼疾手快', '动如脱兔', '全力以赴', '偷偷摸摸', '兔起鹘落', '轻手轻脚', '步罡踏斗', '楞手楞脚', '进退有度', '神出鬼没', '左右开弓'];
    this.arrAttackString = ['外功', '内功'];
    this.nKillCount = 0;
    // 定时器集合
    this.arrTimer = [];
  },

  properties: {
    // 根节点
    m_root: {
      type: cc.Node,
      default: null
    },
    // 预制体 - 角色
    m_prefabPlayer: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 退出弹窗
    m_prefabBackWorldDlg: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 战斗结果弹窗 
    m_prefabResultDlg: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 升级弹窗
    m_prefabLevelup: {
      type: cc.Prefab,
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
    },
    // 跳过战斗
    m_btnPass: {
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
    this.clearAllTime();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 注册事件
  registerEvent: function() {
    console.log('Battle registerEvent');
    // 注册公告栏消失事件
    this.node.on('hide-prize-dlg', this.onJumpWorldPage, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Battle CancelEvent');
    // 注销公告栏消失事件
    this.node.off('hide-prize-dlg', this.onJumpWorldPage, this);
  },

  // 退出战斗，返回征战页面
  onJumpWorldPage: function() {
    console.log('Battle onHideDlg');
    cc.director.loadScene('World');
  },

  // 点击退出战斗
  onBtnBackClick: function() {
    console.log('Battle onBtnBackClick');
    const m_dlgBackWorld = cc.instantiate(this.m_prefabBackWorldDlg);
    this.m_root.addChild(m_dlgBackWorld);
  },

  // 点击跳过战斗
  onBtnPassClick: function() {
    console.log('Battle onBtnPassClick');
    this.clearAllTime();
    this.showResultDlg();
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 初始化
  init: function() {
    console.log('Battle init');
    // 预处理数据数据
    this.computedMemberInfoData();
    console.log('Battle g_objPrize', g_objPrize);
    console.log('Battle g_arrMemberInfoA', g_arrMemberInfoA);
    console.log('Battle g_arrMemberInfoB', g_arrMemberInfoB);
    console.log('Battle arrMemberInfoAll', this.arrMemberInfoAll);
    console.log('Battle g_arrBattleResult', g_arrBattleResult)

    // 战斗前的准备
    // 渲染战场角色信息
    g_arrMemberInfoA.forEach((item, index) => {
      this.createFriendsPlayers(item,index);
    });
    g_arrMemberInfoB.forEach((item, index) => {
      this.createOpponentPlayers(item,index);
    });

    // 开始战斗
    g_arrBattleResult.forEach((item, index) => {
      const timeRound = setTimeout(() => {
        this.updateBattleRoundData(item, index);
      }, 2000 * (index + 1));
      this.arrTimer.push(timeRound);
    });
    // 展示奖励
    const timePrize = setTimeout(() => {
      this.showResultDlg();
    }, 2000 * (g_arrBattleResult.length + 1));
    this.arrTimer.push(timePrize);

    // 5秒后可以跳过战斗
    const timePass = setTimeout(() => {
      this.m_btnPass.active = true;
    }, 5000);
    this.arrTimer.push(timePass);
  },

  // 预处理数据数据
  computedMemberInfoData: function() {
    // 数据保护，最多只支持5v5
    g_arrMemberInfoA.splice(5);
    g_arrMemberInfoB.splice(5);
    g_arrMemberInfoA = g_arrMemberInfoA.map((item, index) => {
      item.isFriend = true;
      item.nIndex = index;
      return item;
    });
    g_arrMemberInfoB = g_arrMemberInfoB.map((item, index) => {
      item.isFriend = false;
      item.nIndex = index;
      return item;
    });
    this.arrMemberInfoAll = g_arrMemberInfoA.concat(g_arrMemberInfoB);
  },

  // 清理所有定时器
  clearAllTime: function() {
    this.arrTimer.forEach((item) => {
      clearInterval(item);
    });
    this.arrTimer = [];
  },

  // 通过ID获取角色索引值
  getMemberIndex: function(strID) {
    return this.arrMemberInfoAll.findIndex((item) => {
      return item._id === strID;
    });
  },

  // 通过ID获取角色姓名
  getMemberName: function(strID) {
    return this.arrMemberInfoAll[this.getMemberIndex(strID)].nickName;
  },

  // 创建战场上的友军角色信息
  createFriendsPlayers: function(objMemberInfo, nIndex) {
    const m_player = cc.instantiate(this.m_prefabPlayer);
    m_player.setPosition(this.arrFriendsPosition[nIndex]);
    m_player.getComponent('Player').initPlayerData(objMemberInfo);
    this.arrPrefabPlayerAll.push(m_player);
    this.m_root.addChild(m_player);
  },

  // 创建战场上的敌军角色信息
  createOpponentPlayers: function(objMemberInfo, nIndex) {
    const m_player = cc.instantiate(this.m_prefabPlayer);
    m_player.setPosition(this.arrOpponentPosition[nIndex]);
    m_player.getComponent('Player').initPlayerData(objMemberInfo);
    this.arrPrefabPlayerAll.push(m_player);
    this.m_root.addChild(m_player);
  },

  // 更新回合信息
  updateBattleRoundData: function(objBattleResultItem, nCount) {
    // 更新回合标题
    this.setRoundTitle(objBattleResultItem, nCount);
    // 更新战场上的角色攻击动画
    this.animationPlayer(objBattleResultItem, nCount);
    const timeShowLog = setTimeout(() => {
      this.updateBattleAttackRender(objBattleResultItem, nCount);
    }, 1000);
    this.arrTimer.push(timeShowLog);
    
  },

  // 更新回合标题
  setRoundTitle: function(objBattleResultItem, nCount) {
    const strRoundTitle =  `第${Math.floor(objBattleResultItem.nRound / 2) + 1}回合` + 
                           `◆` + 
                           `${this.arrRoundName[objBattleResultItem.nRound % 2]}`;
    this.m_labelRound.color = this.arrRoundColor[objBattleResultItem.nRound % 2];
    this.m_labelRound.getComponent(cc.Label).string = strRoundTitle;
  },

  // 创建战斗日志的内容
  createBattleLogLabel: function(objBattleResultItem, nCount) {
    console.log('createBattleLogLabel', this.m_logContent);
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
      label.string = `“${this.getMemberName(objBattleResultItem.strIDAttack)}”` + 
                     `${this.arrAttackAdj[Math.floor(Math.random() * nLengthAdj)]}` +
                     `发动${this.arrAttackString[objBattleResultItem.nRound % 2]}，结果被` + 
                     `“${this.getMemberName(objBattleResultItem.strIDDefense)}”` + 
                     `轻松的躲开了`;
    } else {
      label.string = `“${this.getMemberName(objBattleResultItem.strIDAttack)}”` + 
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

  // 创建战斗日志的击杀情况
  createKillLogLabel: function(objBattleResultItem, nCount) {
    console.log('createKillLogLabel');
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
  },

  // 更新战场上的角色血量
  updatePlayerHP: function(target, objBattleResultItem, nCount) {
    const nAttackIndex = this.getMemberIndex(objBattleResultItem.strIDAttack);
    const nDefenseIndex = this.getMemberIndex(objBattleResultItem.strIDDefense);
    this.arrPrefabPlayerAll[nAttackIndex].getComponent('Player').updatePlayerData(objBattleResultItem, true);
    this.arrPrefabPlayerAll[nDefenseIndex].getComponent('Player').updatePlayerData(objBattleResultItem, false);
  }, 

  // 打击之后的渲染
  updateBattleAttackRender: function(objBattleResultItem, nCount) {
    // 更新战斗日志的内容
    this.createBattleLogLabel(objBattleResultItem, nCount);
    // 更新战斗日志的击杀情况
    if (objBattleResultItem.nHPDefense <= 0) {
      this.createKillLogLabel(objBattleResultItem, nCount);
    }
  },

  // 更新战场上的角色攻击动画
  animationPlayer: function(objBattleResultItem, nCount) {
    const nAttackIndex = this.getMemberIndex(objBattleResultItem.strIDAttack);
    const nDefenseIndex = this.getMemberIndex(objBattleResultItem.strIDDefense);
    const member = this.arrMemberInfoAll[nAttackIndex];
    const player = this.arrPrefabPlayerAll[nAttackIndex];
    const isFriend = member.isFriend;
    
    let positionAttack = cc.v2(0, 0);
    let positionDefense = cc.v2(0, 0);
    if (isFriend) {
      positionAttack = this.arrFriendsPosition[this.arrMemberInfoAll[nAttackIndex].nIndex];
      positionDefense = this.arrOpponentPosition[this.arrMemberInfoAll[nDefenseIndex].nIndex];
    } else {
      positionAttack = this.arrOpponentPosition[this.arrMemberInfoAll[nAttackIndex].nIndex];
      positionDefense = this.arrFriendsPosition[this.arrMemberInfoAll[nDefenseIndex].nIndex];
    }
    
    const actAttackGo = cc.moveTo(0.9, positionDefense);
    const actAttackWait = cc.sequence(cc.moveBy(0.1, cc.v2(0, 20)), 
                                      cc.callFunc(this.updatePlayerHP, this, objBattleResultItem, nCount),
                                      cc.moveBy(0.1, cc.v2(0, -20)));
    const actAttackBack = cc.moveTo(0.9, positionAttack);
    const actAttackSeq = cc.sequence(actAttackGo, actAttackWait, actAttackBack);

    player.runAction(actAttackSeq);
  },

  // 展示战斗结果
  showResultDlg: function() {
    const dlgResult = cc.instantiate(this.m_prefabResultDlg);
    dlgResult.getComponent('BattleResultDialog').setItemPrize(g_objPrize);
    this.m_root.addChild(dlgResult);

    this.checkoutLevelup();
  },

  // 检验升级情况
  checkoutLevelup: function() {
    const nExpMax = parseInt(GameApi.getExpMaxString(g_objMemberInfo.level));
    if (g_objMemberInfo.exp >= nExpMax) {
      // 制造参数
      g_objMemberInfo.level++;
      const objMemberInfo = GameApi.funComputedMemberInfo(g_objMemberInfo.level);
      objMemberInfo.exp = 0;
      g_objMemberInfo = Common.destructuringAssignment(g_objMemberInfo, objMemberInfo);

      console.log('Battle checkoutLevelup', objMemberInfo);
      WebApi.updateMemberInfo(objMemberInfo).then((res) => {
        // 弹出升级弹窗
        this.showLevelupDlg();
      }).catch((err) => {
        console.log('Battle checkoutLevelup fail', err);
      })
    }
  },

  // 显示升级奖励对话框
  showLevelupDlg: function() {
    console.log('Battle showLevelupDlg');
    const objMemberInfoOld = GameApi.funComputedMemberInfo(g_objMemberInfo.level - 1);
    const objMemberInfoNew = GameApi.funComputedMemberInfo(g_objMemberInfo.level);
    const dlgLevelup = cc.instantiate(this.m_prefabLevelup);
    dlgLevelup.getComponent('LevelupDialog').setLevelupData(objMemberInfoOld, objMemberInfoNew);
    this.m_root.addChild(dlgLevelup);
    console.log('Battle showLevelupDlg', dlgLevelup, this.m_root);
  },
});
