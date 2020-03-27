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

cc.Class({
  extends: cc.Component,

  ctor() {
    // 公告对话框
    this.m_dlgToast = null;
    // 按钮锁
    this.bLockButton = false;
  },

  properties: {
    // 根节点
    m_root: {
      type: cc.Node,
      default: null
    },
    m_prefabToast: {
      type: cc.Prefab,
      default: null
    },
    m_prefabRanking: {
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
    // 强化
    m_pannelTabber: {
      type: cc.Node,
      default: null
    },
    // 切换
    m_btnSwitch: {
      type: cc.Node,
      default: null
    }
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
    this.node.on('hide-ranking-dlg', this.onHideRankingDlg, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Main registerEvent.');

    // 注销公告栏消失事件
    this.node.off('hide-toast-dlg', this.onHideToastDlg, this);
    this.node.off('hide-ranking-dlg', this.onHideRankingDlg, this);
  },

  // 隐藏气泡弹窗
  onHideToastDlg: function() {
    console.log('Main onHideToastDlg');
    this.bLockButton = false;
  },

  // 隐藏排行榜
  onHideRankingDlg: function() {
    console.log('Main onHideRankingDlg');
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

  // 强化
  onBtnQianghuaClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnQianghuaClick');
    g_objMemberInfo.level += 1;
    const objMemberInfo = {
      level: g_objMemberInfo.level
    }
    WebApi.updateMemberInfo(objMemberInfo).then((res) => {
      const strMsg = '等级 +1';
      this.showToastDlg(strMsg);
      this.m_level.getComponent(cc.Label).string = g_objMemberInfo.level;
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
      this.m_money.getComponent(cc.Label).string = g_objMemberInfo.money;
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
      this.m_gold.getComponent(cc.Label).string = g_objMemberInfo.gold;
      console.log('Main onBtnJinkuangClick success', res);
    }).catch((err) => {
      console.log('Main onBtnJinkuangClick fail', err);
      this.bLockButton = false;
    });
  },

  //////////////////////////////////////////////////
  // 接口函数
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  preRun: function() {
    // 计算挂机奖励
    if (g_nTimeHook > 0) {
      this.funComputedHook();
      g_nTimeHook = 0;
    }
    // 渲染个人信息
    this.setMemberInfo();
  },
  
  // 正式开始执行
  Run: function() {
    
  },

  // 渲染个人信息
  setMemberInfo: function() {
    if (g_objUserInfo && g_objMemberInfo) {
      console.log('', g_objUserInfo, g_objMemberInfo);
      // 更新头像
      cc.loader.load({url: g_objUserInfo.avatarUrl, type: 'png'}, (err, img) => {
        this.m_avatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
      });
      // 更新
      this.m_name.getComponent(cc.Label).string = g_objUserInfo.nickName;
      this.m_level.getComponent(cc.Label).string = g_objMemberInfo.level;
      this.m_money.getComponent(cc.Label).string = g_objMemberInfo.money;
      this.m_gold.getComponent(cc.Label).string = g_objMemberInfo.gold;
    }
  },

  // 计算挂机奖励
  funComputedHook: function() {
    const fRand = 1 + (Math.random() / 10);
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
      console.log('Main funComputedHook Success.', res);
      const strMsg = `经验+${tmpExp} 铜钱+${tmpMoney} 元宝+${tmpGold}`;
      this.showToastDlg(strMsg);
      this.m_money.getComponent(cc.Label).string = g_objMemberInfo.money;
      this.m_gold.getComponent(cc.Label).string = g_objMemberInfo.gold;
      console.log('Main onBtnJinkuangClick success', res);
    }).catch((err) => {
      console.log('Main funComputedHook fail', err);
      this.bLockButton = false;
    });
  },

  // 显示气泡对话框 
  showToastDlg: function(strMsg) {
    this.m_dlgToast = cc.instantiate(this.m_prefabToast);
    this.m_dlgToast.getComponent('ToastDialog').setToastContent(strMsg);
    this.node.addChild(this.m_dlgToast);
  },

  // 显示分享对话框
  showRankingDlg: function() {
    this.m_dlgRanking = cc.instantiate(this.m_prefabRanking);
    this.node.addChild(this.m_dlgRanking);
  }
});
