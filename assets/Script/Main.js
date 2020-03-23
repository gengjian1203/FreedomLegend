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

cc.Class({
  extends: cc.Component,

  ctor() {
    // 个人信息
    this.memberInfo = {}
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
    
    this.run();

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
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Main registerEvent.');

    // 注销公告栏消失事件
    this.node.off('hide-toast-dlg', this.onHideToastDlg, this);
  },

  // 隐藏气泡弹窗
  onHideToastDlg: function() {
    console.log('Main onHideToastDlg');
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

  // 强化
  onBtnQianghuaClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnQianghuaClick');
    this.memberInfo.money += 100;
    const objMemberInfo = {
      money: this.memberInfo.money
    };
    WebApi.updateMemeber(objMemberInfo).then((res) => {
      const strMsg = '铜钱 +100';
      this.showToastDlg(strMsg);
      this.m_money.getComponent(cc.Label).string = this.memberInfo.money;
      console.log('Main onBtnQianghuaClick success', res);
    }).catch((err) => {
      console.log('Main onBtnQianghuaClick fail', err);
    });
  },

  // 金矿
  onBtnJinkuangClick: function() {
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    console.log('Main onBtnJinkuangClick');
    this.memberInfo.gold += 1;
    const objMemberInfo = {
      gold: this.memberInfo.gold
    };
    WebApi.updateMemeber(objMemberInfo).then((res) => {
      const strMsg = '元宝 +1';
      this.showToastDlg(strMsg);
      this.m_gold.getComponent(cc.Label).string = this.memberInfo.gold;
      console.log('Main onBtnJinkuangClick success', res);
    }).catch((err) => {
      console.log('Main onBtnJinkuangClick fail', err);
    });
  },

  //////////////////////////////////////////////////
  // 接口函数
  //////////////////////////////////////////////////
  // 查询成员信息
  queryMember: function(openid) {
    return new Promise((resolve, reject) => {
      WebApi.queryMember(openid).then((res) => {
        console.log('Main queryMember success', res);
        this.setMemberInfo(res);
        resolve(res);
      }).catch((err) => {
        console.log('Main queryMember fail', err);
        reject(err);
      });
    });
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 开始执行
  run: function() {
    this.queryMember();

  },

  // 渲染个人信息
  setMemberInfo: function(res) {
    if (res && res.member && res.member.data) {
      this.memberInfo = res.member.data;
      // 更新头像
      cc.loader.load({url: this.memberInfo.avatarUrl, type: 'png'}, (err, img) => {
        this.m_avatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
      });
      // 更新
      this.m_name.getComponent(cc.Label).string = this.memberInfo.nickName;
      this.m_level.getComponent(cc.Label).string = this.memberInfo.level;
      this.m_money.getComponent(cc.Label).string = this.memberInfo.money;
      this.m_gold.getComponent(cc.Label).string = this.memberInfo.gold;
    }
  },

  // 显示气泡对话框 
  showToastDlg: function(strMsg) {
    this.m_dlgToast = cc.instantiate(this.m_prefabToast);
    this.m_dlgToast.getComponent('ToastDialog').setToastContent(strMsg);
    this.node.addChild(this.m_dlgToast);
  },
});
