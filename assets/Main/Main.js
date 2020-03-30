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
let GameApi = require("../Kits/GameApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    // 气泡对话框
    this.m_dlgToast = null;
    // 离线奖励对话框
    this.m_dlgHook = null;
    // 升级对话框
    this.m_dlgLevelup = null;
    // 排行榜对话框
    this.m_dlgRanking = null;
    // 属性对话框
    this.m_dlgMember = null;
    // 按钮锁
    this.bLockButton = false;
  },

  properties: {
    // 根节点
    m_root: {
      type: cc.Node,
      default: null
    },
    // ===== 预制体 =====
    // 预制体 - 气泡弹窗
    m_prefabToast: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 离线奖励弹窗
    m_prefabHook: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 升级奖励弹窗
    m_prefabLevelup: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 排行榜弹窗
    m_prefabRanking: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 属性弹窗
    m_prefabMember: {
      type: cc.Prefab,
      default: null
    },
    // ===== 展示 =====
    // 头像
    m_avatar: {
      type: cc.Node,
      default: null
    },
    // 昵称
    m_name: {
      type: cc.Node,
      default: null
    },
    // 等级
    m_level: {
      type: cc.Node,
      default: null
    },
    // 称号
    m_taste: {
      type: cc.Node,
      default: null
    },
    // 经验进度条根部
    m_sprExpRoot: {
      type: cc.Node,
      default: null
    },
    // 经验进度条
    m_sprExp: {
      type: cc.Node,
      default: null
    },
    // 经验百分比
    m_labelExp: {
      type: cc.Node,
      default: null
    },
    // 铜钱
    m_money: {
      type: cc.Node,
      default: null
    },
    // 元宝
    m_gold: {
      type: cc.Node,
      default: null
    },
    // ===== 交互 =====
    // 底部按钮根节点
    m_pannelTabber: {
      type: cc.Node,
      default: null
    },
    // 切换
    m_sprSwitch: {
      type: cc.Node,
      default: null
    },
    // 切换按钮纹理数组
    m_arrSwitchFrame :{
      type:[cc.SpriteFrame],
      default:[]
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    console.log('Main start');
    Common.AdapterScreen(this.m_root);
    
    this.preRun();
    this.Run();

  },

  onEnable () {
    console.log('Main onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('Main onDisable.');
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 注册事件
  registerEvent: function() {
    console.log('Main registerEvent.');

    // 注册公告栏消失事件
    this.node.on('hide-toast-dlg', this.onHideToastDlg, this);
    this.node.on('hide-hook-dlg', this.onHideHookDlg, this);
    this.node.on('hide-levelup-dlg', this.onHideLevelupDlg, this);
    this.node.on('hide-ranking-dlg', this.onHideRankingDlg, this);
    this.node.on('hide-member-dlg', this.onHideRankingDlg, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Main registerEvent.');

    // 注销公告栏消失事件
    this.node.off('hide-toast-dlg', this.onHideToastDlg, this);
    this.node.off('hide-hook-dlg', this.onHideHookDlg, this);
    this.node.off('hide-levelup-dlg', this.onHideLevelupDlg, this);
    this.node.off('hide-ranking-dlg', this.onHideRankingDlg, this);
    this.node.off('hide-member-dlg', this.onHideMemberDlg, this);
  },

  // 隐藏气泡弹窗
  onHideToastDlg: function() {
    console.log('Main onHideToastDlg');
    this.bLockButton = false;
  },

  // 隐藏离线奖励弹窗
  onHideHookDlg: function() {
    console.log('Main onHideHookDlg');
    this.bLockButton = false;
  },

  // 隐藏升级弹窗
  onHideLevelupDlg: function() {
    console.log('Main onHideLevelupDlg');
    this.bLockButton = false;
  },

  // 隐藏排行榜
  onHideRankingDlg: function() {
    console.log('Main onHideRankingDlg');
    this.bLockButton = false;
  },

  // 隐藏属性对话框
  onHideMemberDlg: function() {
    console.log('Main onHideMemberDlg');
    this.bLockButton = false;
  },

  // 点击测试功能
  onBtnTestClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnTestClick');
    const strMsg = '抱歉，该功能尚未开放';
    this.showToastDlg(strMsg);
  },

  // 聚义堂
  onBtnJuyitangClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    this.showRankingDlg();
    console.log('Main onBtnJuyitangClick');    
  },

  // 武将
  onBtnWujiangClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    this.showMemberDlg();
    console.log('Main onBtnWujiangClick');  
  },

  // 强化
  onBtnQianghuaClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnQianghuaClick');
    g_objMemberInfo.level++;
    const objMemberInfo = GameApi.funComputedMemberInfoAD(g_objMemberInfo.level);
    
    WebApi.updateMemberInfo(objMemberInfo).then((res) => {
      this.showLevelupDlg();
      this.m_taste.getComponent(cc.Label).string = GameApi.getTasteString(g_objMemberInfo.level);
      console.log('Main onBtnQianghuaClick success', res);
    }).catch((err) => {
      console.log('Main onBtnQianghuaClick fail', err);
      this.bLockButton = false;
    });
  },

  // 背包
  onBtnBeibaoClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnBeibaoClick');
    g_objMemberInfo.money += 100;
    const objMemberInfo = {
      money: g_objMemberInfo.money
    }
    WebApi.updateMemberInfo(objMemberInfo).then((res) => {
      const strMsg = '铜钱 +100';
      this.showToastDlg(strMsg);
      this.m_money.getComponent(cc.Label).string = GameApi.formatLargeNumber(g_objMemberInfo.money);
      console.log('Main onBtnBeibaoClick success', res);
    }).catch((err) => {
      console.log('Main onBtnBeibaoClick fail', err);
      this.bLockButton = false;
    });
  },

  // 金矿
  onBtnJinkuangClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnJinkuangClick');
    g_objMemberInfo.gold += 50;
    const objMemberInfo = {
      gold: g_objMemberInfo.gold
    };
    WebApi.updateMemberInfo(objMemberInfo).then((res) => {
      const strMsg = '元宝 +50';
      this.showToastDlg(strMsg);
      this.m_gold.getComponent(cc.Label).string = GameApi.formatLargeNumber(g_objMemberInfo.gold);
      console.log('Main onBtnJinkuangClick success', res);
    }).catch((err) => {
      console.log('Main onBtnJinkuangClick fail', err);
      this.bLockButton = false;
    });
  },

  // 切换iconbar按钮
  onBtnSwitchClick: function() {
    if (this.m_pannelTabber.active) {
      // 隐藏iconbar
      this.m_pannelTabber.active = false;
      this.m_sprSwitch.getComponent(cc.Sprite).spriteFrame = this.m_arrSwitchFrame[0];
    } else {
      //  显示iconbar
      this.m_pannelTabber.active = true;
      this.m_sprSwitch.getComponent(cc.Sprite).spriteFrame = this.m_arrSwitchFrame[1];
    }
  },

  //////////////////////////////////////////////////
  // 接口函数
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  preRun: function() {
    // 渲染个人信息
    this.setMemberInfo();
    // 计算挂机奖励
    if (g_nTimeHook > 0) {
      this.funComputedHook();
      g_nTimeHook = 0;
    }
  },
  
  // 正式开始执行
  Run: function() {
    
  },

  // 渲染个人信息
  setMemberInfo: function() {
    if (!Common.isObjectEmpty(g_objUserInfo) && !Common.isObjectEmpty(g_objMemberInfo)) {
      console.log('', g_objUserInfo, g_objMemberInfo);
      // 更新头像
      cc.loader.load({url: g_objUserInfo.avatarUrl, type: 'png'}, (err, img) => {
        this.m_avatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
      });
      // 更新经验条信息
      this.setExpProgress(g_objMemberInfo.level, g_objMemberInfo.exp);
      // 更新Label信息
      this.m_name.getComponent(cc.Label).string = g_objUserInfo.nickName;
      this.m_level.getComponent(cc.Label).string = g_objMemberInfo.level;
      this.m_taste.getComponent(cc.Label).string = GameApi.getTasteString(g_objMemberInfo.level);
      this.m_taste.color = GameApi.getTasteColor(g_objMemberInfo.level);
      this.m_money.getComponent(cc.Label).string = GameApi.formatLargeNumber(g_objMemberInfo.money);
      this.m_gold.getComponent(cc.Label).string = GameApi.formatLargeNumber(g_objMemberInfo.gold);
    }
  },

  // 渲染经验值信息
  setExpProgress: function(level, exp) {
    const rootWidth = this.m_sprExpRoot.width;
    let fPer = exp / GameApi.getExpMaxString(level);  // 
    fPer = fPer > 1 ? 1 : fPer;
    const fPerResult = (fPer * 100).toFixed(2); // 百分比制
    const nWidth = 5 + fPer * rootWidth;
    // 
    this.m_sprExp.width = nWidth;
    this.m_labelExp.getComponent(cc.Label).string = `${fPerResult}%`;
    console.log('setExpProgress', rootWidth, nWidth, fPer, fPerResult);
  },

  // 计算挂机奖励
  funComputedHook: function() {
    const fRand = 0.8 + (Math.random() / 2.5);
    const nMeasure = g_nTimeHook / 1000;
    const tmpExp = parseInt(nMeasure * fRand);
    const tmpMoney = parseInt(nMeasure * fRand / 10);
    const tmpGold = parseInt(nMeasure * fRand / 100)
    
    g_objMemberInfo.exp += tmpExp;
    g_objMemberInfo.money += tmpMoney;
    g_objMemberInfo.gold += tmpGold;

    const objMemberInfo = {
      exp: g_objMemberInfo.exp,
      money: g_objMemberInfo.money,
      gold: g_objMemberInfo.gold
    };

    console.log('Main funComputedHook', g_nTimeHook, nMeasure, objMemberInfo);

    WebApi.updateMemberInfo(objMemberInfo).then((res) => {
      // 弹出离线奖励弹窗
      this.showHookDlg(nMeasure, tmpExp, tmpMoney, tmpGold);  
      // 渲染个人信息
      this.setMemberInfo();
      console.log('Main onBtnJinkuangClick success', res);

      // 检验是否可以升级
      this.checkoutLevelup();
    }).catch((err) => {
      console.log('Main funComputedHook fail', err);
      this.bLockButton = false;
    });
  },

  // 检验升级情况
  checkoutLevelup: function() {
    const nExpMax = parseInt(GameApi.getExpMaxString(g_objMemberInfo.level));
    if (g_objMemberInfo.exp >= nExpMax) {
      // 制造参数
      g_objMemberInfo.level++;
      const objMemberInfo = GameApi.funComputedMemberInfoAD(g_objMemberInfo.level);
      objMemberInfo.exp = 0;
      g_objMemberInfo = Common.destructuringAssignment(g_objMemberInfo, objMemberInfo);

      console.log('Main checkoutLevelup', objMemberInfo);
      WebApi.updateMemberInfo(objMemberInfo).then((res) => {
        // 弹出升级弹窗
        this.showLevelupDlg();
        // 渲染游戏信息
        this.setMemberInfo();
      }).catch((err) => {
        console.log('Main checkoutLevelup fail', err);

      })
    }
  },

  // 显示气泡对话框 
  showToastDlg: function(strMsg) {
    this.m_dlgToast = cc.instantiate(this.m_prefabToast);
    this.m_dlgToast.getComponent('ToastDialog').setToastContent(strMsg);
    this.m_root.addChild(this.m_dlgToast);
  },

  // 显示离线奖励对话框
  showHookDlg: function(nMeasure, tmpExp, tmpMoney, tmpGold) {
    this.m_dlgHook = cc.instantiate(this.m_prefabHook);
    this.m_dlgHook.getComponent('HookDialog').setHookAwardData(nMeasure, tmpExp, tmpMoney, tmpGold);
    this.m_root.addChild(this.m_dlgHook);
  },

  // 显示升级奖励对话框
  showLevelupDlg: function() {
    const objMemberInfoOld = GameApi.funComputedMemberInfoAD(g_objMemberInfo.level - 1);
    const objMemberInfoNew = GameApi.funComputedMemberInfoAD(g_objMemberInfo.level);
    this.m_dlgLevelup = cc.instantiate(this.m_prefabLevelup);
    this.m_dlgLevelup.getComponent('LevelupDialog').setLevelupData(objMemberInfoOld, objMemberInfoNew);
    this.m_root.addChild(this.m_dlgLevelup);
  },

  // 显示排行对话框
  showRankingDlg: function() {
    this.m_dlgRanking = cc.instantiate(this.m_prefabRanking);
    this.m_root.addChild(this.m_dlgRanking);
  },

  // 显示属性对话框
  showMemberDlg: function() {
    this.m_dlgMember = cc.instantiate(this.m_prefabMember);
    this.m_root.addChild(this.m_dlgMember);
  }
});
