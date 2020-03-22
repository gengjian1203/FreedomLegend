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
    // 游戏概况信息
    this.objGameDetail = {
      name: '',
      notice: '',
      strNotice: '',
      version: '',
    };
    // 账号信息
    this.objMember = undefined,
    // 登录锁
    this.bLockLogin = false;
    // 登录按钮
    this.btnLogin = null;
  },

  properties: {
    // 画布对象
    m_canvas: {
      type: cc.Node,
      default: null
    },
    // 根节点
    m_root: {
      type: cc.Node,
      default: null
    },
    // 预制体-对话框
    m_prefabDlg: {
      type: cc.Prefab,
      default: null
    },
    // 公告按钮
    m_btnNotice: {
      type: cc.Node,
      default: null
    },
    // 用户信息组件
    m_memberInfo: {
      type: cc.Node,
      default: null
    },
    // 头像精灵
    m_sprAvatar: {
      type: cc.Node,
      default: null
    },
    // 昵称文字
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 版本号
    m_labelVersion: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    console.log('Login start');

    Common.AdapterScreen(this.m_root);

    // 自定义初始化函数
    this.init();
  },

  onEnable () {
    console.log('Login onEnable');
    this.registerEvent();
  },

  onDisable () {
    console.log('Login onDisEnable');
    this.CancelEvent();
  },

  onDestroy() {
    console.log('Login onDestroy');
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 注册事件
  registerEvent: function() {
    console.log('Login registerEvent');
    // 初始化微信云函数
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.init({env:'develop-8ouxt'});
    }

    // 生成登录授权按钮
    this.btnLogin = AuthApi.createUserInfoButton();
    if (this.btnLogin) {
      this.btnLogin.show();
      this.btnLogin.onTap((res) => {
        this.onBtnLoginClick(res);
      });
    }

    // 注册公告栏消失事件
    this.node.on('hide-noctice-dlg', this.hideNoticeDlg, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Login CancelEvent');
    if (this.btnLogin) {
      this.btnLogin.offTap((res) => {
        this.onBtnLoginClick(res);
      });
      this.btnLogin.destroy();
    }

    // 注销公告栏消失事件
    this.node.off('hide-noctice-dlg', this.hideNoticeDlg, this);
  },
  
  // 测试点击函数
  onBtnClick: function(e, param) {
    console.log('Login onBtnClick');
  },

  // 点击公告按钮消息事件
  onBtnNoticeClick: function(e, param) {
    // 获取用户信息
    console.log('Login onBtnNoticeClick');
    this.showNocticeDlg();
  },

  // 点击登录按钮消息事件
  onBtnLoginClick: function(res) {
    console.log('Login onBtnLoginClick', this.bLockLogin, res);
    if (!this.bLockLogin) {
      this.bLockLogin = true;
      // 获取用户信息
      this.getUserInfoNew(res).then((res) => {
        // 更新/创建用户信息
        this.updateMember();

        setTimeout(() => {
          console.log('Login onBtnLoginClick', this.objMember);
          if (this.objMember) {
            // 跳转正常游戏
            cc.director.loadScene('Main');
          } else {
            // 跳转新手引导页
            cc.director.loadScene('Preface');
          }
          console.log('Login setTimeout', this.bLockLogin);
          this.bLockLogin = false;
        }, 1000);
      }).catch((err) => {
        console.log('Login getUserInfo', this.bLockLogin, err);
        this.bLockLogin = false;
      });
    }
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  init: function() {
    // 获取游戏的公告等信息
    WebApi.queryGameDetail().then((res) => {
      return new Promise((resolve, reject) => {
        // 1.接口读取到的信息转义
        if (res) {
          console.log('Login queryGameDetail', res);
          // 一定要获取到游戏信息
          if (res && res.result && res.result.game && res.result.game.data && res.result.game.data[0]) {
            this.objGameDetail = res.result.game.data[0];
            this.objGameDetail.strNotice = this.objGameDetail.notice.join('\n');
          }
          // 有可能查不到用户信息
          if (res && res.result && res.result.member && res.result.member.data) {
            this.objMember = res.result.member.data[0];
          }
          resolve();
        } else {
          reject();
        }
      });
    }).then((res)=> {
      // 2.通过转义后的信息，对页面进行渲染
      console.log('Login 转义后的信息', this.objGameDetail);
      // 渲染版本号
      this.m_labelVersion.getComponent(cc.Label).string = this.objGameDetail.version;
      
    }).catch((err) => {
      // 报错
      console.log('Login init fail.', err);
    });
  },

  // 获取用户信息授权流程(旧方法，备用做兼容)
  getUserInfo: function() {
    return new Promise((resolve, reject) => {
      console.log('Login getUserInfo');
      AuthApi.authUserInfo().then((res) => {
        // 渲染用户信息
        if (res) {
          this.setMemberInfo(res);
          this.m_memberInfo.active = true;
        }
        resolve();
      }).catch((err) => {
        // 报错
        console.log('Login init fail.', err);
        reject();
      });
    });
  },

  // 获取用户信息授权流程（新方法：createUserInfoButton）
  getUserInfoNew: function(res) {
    return new Promise((resolve, reject) => {
      console.log('Login getUserInfoNew', res);
      // 渲染用户信息
      if (res && res.userInfo) {
        this.setMemberInfo(res);
        this.m_memberInfo.active = true;
        resolve();
      } else {
        reject();
      }
    });
  },

  // 渲染用户信息
  setMemberInfo: function(res) {
    if (res) {
      // 用户信息存全局变量中
      g_objUserInfo = res.userInfo;
      // 更新头像
      cc.loader.load({url: res.userInfo.avatarUrl, type: 'png'}, (err, img) => {
        console.log('Login getUserInfo', img);
        this.m_sprAvatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
      });
      // 更新昵称
      this.m_labelName.getComponent(cc.Label).string = `${res.userInfo.nickName}，欢迎你回来~`;
    }
  },

  // 显示公告对话框 
  showNocticeDlg: function() {
    if (this.btnLogin) {
      this.btnLogin.hide();
    }
    this.m_dlgNotice = cc.instantiate(this.m_prefabDlg);
    this.m_dlgNotice.getComponent('ModuleDialog').setNoticeContent(this.objGameDetail.strNotice);
    this.m_canvas.addChild(this.m_dlgNotice);
  },

  // 隐藏公告对话框
  hideNoticeDlg: function() {
    console.log('Login hideNoticeDlg');
    if (this.btnLogin) {
      this.btnLogin.show();
    }
  },

  // 创建角色信息
  updateMember: function() {
    const isLogin = true;
    WebApi.updateMemeber(g_objUserInfo, isLogin).then((res) => {
      console.log('Login updateMember.success.', res);
    }).catch((err) => {
      console.log('Login updateMember.fail.', err);
    });
  }

});

