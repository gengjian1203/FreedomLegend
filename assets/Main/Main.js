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
    // 邮件对话框
    this.m_dlgMail = null;
    // 黑市对话框
    this.m_dlgShop = null;
    // 演武场对话框
    this.m_dlgSport = null;
    // 属性对话框
    this.m_dlgMember = null;
    // 属性对话框
    this.m_dlgBagList = null;
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
    // 预制体 - 邮件弹窗
    m_prefabMail: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 教程模块
    m_prefabTeacherModule: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 黑市弹窗
    m_prefabShop: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 演武场弹窗
    m_prefabSport: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 属性弹窗
    m_prefabMember: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 背包弹窗
    m_prefabBagList: {
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
    // 邮件标记
    m_mailTip: {
      type: cc.Node,
      default: null
    },
    // 邮件数量
    m_mailCount: {
      type: cc.Node,
      default: null
    },
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
    this.node.on('hide-toast-dlg', this.onHideDialog, this);
    this.node.on('hide-hook-dlg', this.onHideDialog, this);
    this.node.on('hide-levelup-dlg', this.onHideDialog, this);
    this.node.on('hide-ranking-dlg', this.onHideDialog, this);
    this.node.on('hide-bag-dlg', this.onHideDialog, this);
    this.node.on('hide-member-dlg', this.onHideDialog, this);
    this.node.on('hide-sport-dlg', this.onHideDialog, this);
    this.node.on('hide-teacher-module', this.onHideDialog, this);
    // 刷新事件
    this.node.on('hide-shop-dlg', this.onHideDialog, this);
    this.node.on('hide-mail-dlg', this.onHideDialogAndQuery, this);
    this.node.on('refresh-moneyandgold-dlg', this.checkoutLevelup, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Main registerEvent.');
    // 注销公告栏消失事件
    this.node.off('hide-toast-dlg', this.onHideDialog, this);
    this.node.off('hide-hook-dlg', this.onHideDialog, this);
    this.node.off('hide-levelup-dlg', this.onHideDialog, this);
    this.node.off('hide-ranking-dlg', this.onHideDialog, this);
    this.node.off('hide-bag-dlg', this.onHideDialog, this);
    this.node.off('hide-member-dlg', this.onHideDialog, this);
    this.node.off('hide-sport-dlg', this.onHideDialog, this);
    this.node.off('hide-teacher-module', this.onHideDialog, this);
    // 刷新事件
    this.node.off('hide-shop-dlg', this.onHideDialog, this);
    this.node.off('hide-mail-dlg', this.onHideDialogAndQuery, this);
    this.node.off('refresh-moneyandgold-dlg', this.checkoutLevelup, this);
  },

  // 隐藏气泡弹窗
  onHideDialog: function() {
    console.log('Main onHideDialog');
    this.bLockButton = false;
  },

  // 隐藏并且重新查询配件信息，更新全局变量
  onHideDialogAndQuery: function() {
    console.log('Main onHideDialog');
    this.bLockButton = false;
    // 获取配件信息
    this.queryPartsInfo().then((res) => {
    }).catch((err) => {
      console.log('Main queryPartsInfo Fail.', err);
    });
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

  // 点击邮件
  onBtnMailClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    this.showMailDlg();
    console.log('Main onBtnMailClick');    
  },

  // 点击教程
  onBtnTeacherClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    this.showTeacherModule();
    console.log('Main onBtnTeacherClick');    
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

  // 黑市
  onBtnHeishiClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    this.showShopDlg();
    console.log('Main onBtnHeishiClick');    
  },

  // 黑市
  onBtnYanwuchangClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    this.showSportDlg();
    console.log('Main onBtnYanwuchangClick');    
  },

  // 征战
  onBtnZhengzhanClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnZhengzhanClick');
    this.gotoWorldScene();
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
    const objMemberInfo = GameApi.funComputedMemberInfo(g_objMemberInfo.level);
    
    const paramMemberInfo = {
      memberInfo: objMemberInfo
    };
    WebApi.updateMemberInfo(paramMemberInfo).then((res) => {
      this.showLevelupDlg();
      this.m_taste.getComponent(cc.Label).string = GameApi.getTasteString(g_objMemberInfo.level);
      this.m_taste.color = GameApi.getTasteColor(g_objMemberInfo.level);
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
    this.showBagListDlg();
    console.log('Main onBtnBeibaoClick');
  },

  // 金矿
  onBtnJinkuangClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnJinkuangClick');
    const strMsg = '抱歉，该功能尚未开放';
    this.showToastDlg(strMsg);
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
  // 获取配件信息
  queryPartsInfo: function() {
    return new Promise((resolve, reject) => {
      const param = {};
      WebApi.queryPartsInfo(param).then((res) => {
        g_arrMailInfo = res.arrPartsInfo.mail;               // 邮件信息
        g_arrTitle = res.arrPartsInfo.title;                 // 称号列表
        g_arrLog = res.arrPartsInfo.log;                     // 人物传记列表
        // 背包信息
        g_objBagInfo = {
          equipment: res.arrPartsInfo.equipment,             // 装备信息 - 背包纬度
          medicine: res.arrPartsInfo.medicine,               // 药品列表 - 背包纬度
          consumables: res.arrPartsInfo.consumables,         // 消耗品列表 - 背包纬度
          magic: res.arrPartsInfo.magic,                     // 功法列表 - 背包纬度
          pets: res.arrPartsInfo.pets,                       // 宠物蛋列表 - 背包纬度
        }
        // 渲染邮件
        this.setMailInfo();
        console.log('Main queryPartsInfo Success', g_arrMailInfo);
        resolve(res);
      }).catch((err) => {
        console.log('Main queryPartsInfo fail', err);
        reject(err);
      });
    });
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  preRun: function() {
    if (g_nTimeHook > 0) {
      // 计算挂机奖励
      this.funComputedHook();
      g_nTimeHook = 0;
    } else if(g_nTimeHook === -1) {
      // 渲染个人信息
      this.setMemberInfo();
      // 新玩家登录，开启新手教程
      this.showTeacherModule();
      g_nTimeHook = 0;
    }else {
      // 渲染个人信息
      this.setMemberInfo();
    }
  },
  
  // 正式开始执行
  Run: function() {
    // 获取配件信息
    this.queryPartsInfo().then((res) => {
    }).catch((err) => {
      console.log('Main queryPartsInfo Fail.', err);
    });
  },

  // 渲染个人信息
  setMemberInfo: function() {
    if (!Common.isObjectEmpty(g_objUserInfo) && !Common.isObjectEmpty(g_objMemberInfo)) {
      console.log('', g_objUserInfo, g_objMemberInfo);
      // 更新头像
      cc.loader.load({url: g_objUserInfo.avatarUrl, type: 'png'}, (err, img) => {
        this.m_avatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
      });
      
      // 更新Label信息
      this.m_name.getComponent(cc.Label).string = g_objUserInfo.nickName;
      this.m_level.getComponent(cc.Label).string = g_objMemberInfo.level;
      this.m_taste.getComponent(cc.Label).string = GameApi.getTasteString(g_objMemberInfo.level);
      this.m_taste.color = GameApi.getTasteColor(g_objMemberInfo.level);
      
      // 更新铜钱和元宝信息
      this.m_money.getComponent(cc.Label).string = GameApi.formatLargeNumber(g_objMemberInfo.money);
      this.m_gold.getComponent(cc.Label).string = GameApi.formatLargeNumber(g_objMemberInfo.gold);
      // 更新经验条信息
      this.setExpProgress(g_objMemberInfo.level, g_objMemberInfo.exp);
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

  // 渲染邮件提示信息
  setMailInfo: function() {
    // 判断是否有邮件
    if (Boolean(g_arrMailInfo.length)) {
      this.m_mailTip.active = true;
      // 邮件数量
      this.m_mailCount.getComponent(cc.Label).string = g_arrMailInfo.length > 99 ? '99+' : `${g_arrMailInfo.length}`;
    } else {
      this.m_mailTip.active = false;
    }
  },

  // 计算挂机奖励
  funComputedHook: function() {
    // g_nTimeHook = g_nTimeHook > 28800000 ? 28800000 : g_nTimeHook; // 最长挂机8小时
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

    const paramMemberInfo = {
      memberInfo: objMemberInfo
    };
    WebApi.updateMemberInfo(paramMemberInfo).then((res) => {
      // 弹出离线奖励弹窗
      this.showHookDlg(nMeasure, tmpExp, tmpMoney, tmpGold);  
      
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
      const objMemberInfo = GameApi.funComputedMemberInfo(g_objMemberInfo.level);
      objMemberInfo.exp = 0;
      g_objMemberInfo = Common.destructuringAssignment(g_objMemberInfo, objMemberInfo);

      console.log('Main checkoutLevelup', objMemberInfo);
      const paramMemberInfo = {
        memberInfo: objMemberInfo
      };
      WebApi.updateMemberInfo(paramMemberInfo).then((res) => {
        // 弹出升级弹窗
        this.showLevelupDlg();
        // 渲染游戏信息
        this.setMemberInfo();
      }).catch((err) => {
        console.log('Main checkoutLevelup fail', err);

      })
    } else {
      // 渲染个人信息
      this.setMemberInfo();
    }
  },

  // 跳转到征战页面
  gotoWorldScene: function() {
    g_nChapters = Math.floor(g_objMemberInfo.story / 10);
    // 跳转页
    cc.director.loadScene('World');
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
    const objMemberInfoOld = GameApi.funComputedMemberInfo(g_objMemberInfo.level - 1);
    const objMemberInfoNew = GameApi.funComputedMemberInfo(g_objMemberInfo.level);
    this.m_dlgLevelup = cc.instantiate(this.m_prefabLevelup);
    this.m_dlgLevelup.getComponent('LevelupDialog').setLevelupData(objMemberInfoOld, objMemberInfoNew);
    this.m_root.addChild(this.m_dlgLevelup);
  },

  // 显示排行对话框
  showRankingDlg: function() {
    this.m_dlgRanking = cc.instantiate(this.m_prefabRanking);
    this.m_root.addChild(this.m_dlgRanking);
  },

  // 显示邮件对话框
  showMailDlg: function() {
    this.m_dlgMail = cc.instantiate(this.m_prefabMail);
    this.m_root.addChild(this.m_dlgMail);
  },

  // 显示教程模块
  showTeacherModule: function() {
    const m_modTeacher = cc.instantiate(this.m_prefabTeacherModule);
    this.m_root.addChild(m_modTeacher);
  },

  // 显示黑市对话框
  showShopDlg: function() {
    this.m_dlgShop = cc.instantiate(this.m_prefabShop);
    this.m_root.addChild(this.m_dlgShop);
  },

  // 显示演武场对话框
  showSportDlg: function() {
    this.m_dlgSport = cc.instantiate(this.m_prefabSport);
    this.m_root.addChild(this.m_dlgSport);
  },

  // 显示属性对话框
  showMemberDlg: function() {
    this.m_dlgMember = cc.instantiate(this.m_prefabMember);
    this.m_root.addChild(this.m_dlgMember);
  },

  // 显示背包对话框
  showBagListDlg: function() {
    this.m_dlgBagList = cc.instantiate(this.m_prefabBagList);
    this.m_root.addChild(this.m_dlgBagList);
  }
});
