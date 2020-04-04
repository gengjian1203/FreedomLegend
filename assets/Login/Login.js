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
    // 登录锁
    this.bLockLogin = false;
    // 登录按钮
    this.btnLogin = null;
    // 公告对话框
    this.dlgNotice = null;
    // 登录进度条
    this.lineLoading = null;
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
    // 预制体-读取进度条
    m_prefabLoading: {
      type: cc.Prefab,
      default: null
    },
    // 公告按钮
    m_btnNotice: {
      type: cc.Node,
      default: null
    },
    // 用户信息组件
    m_UserInfo: {
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
    this.bLockLogin = false;

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
    WebApi.initWXCloud();

    // 生成登录授权按钮
    this.btnLogin = AuthApi.createUserInfoButton();
    if (this.btnLogin) {
      this.btnLogin.show();
      this.btnLogin.onTap((res) => {
        this.onBtnLoginClick(res);
      });
    }

    // 注册公告栏消失事件
    this.node.on('hide-notice-dlg', this.onHideNoticeDlg, this);
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
    this.node.off('hide-notice-dlg', this.onHideNoticeDlg, this);
  },

  // 隐藏公告对话框
  onHideNoticeDlg: function() {
    console.log('Login onHideNoticeDlg');
    if (this.btnLogin) {
      this.btnLogin.show();
    }
  },
  
  // 测试点击函数
  onBtnClick: function(e, param) {
    console.log('Login onBtnClick', param);
  },

  // 点击公告按钮消息事件
  onBtnNoticeClick: function(e, param) {
    // 获取用户信息
    console.log('Login onBtnNoticeClick');
    this.showNocticeDlg();
  },

  // 点击登录按钮消息事件
  onBtnLoginClick: function(res) {
    let isNewMember = false; // 是否是新玩家

    if (this.bLockLogin) {
      return;
    }
    console.log('Login onBtnLoginClick', this.bLockLogin, res);
    this.bLockLogin = true;
    this.showLineLoading();
    // 获取用户信息
    this.getUserInfoNew(res).then((res) => {
      this.setLineLoading(25);
      // 更新/创建玩家信息
      this.updateMemberInfo().then((res) => {
        isNewMember = res.isNewMember;
        this.setLineLoading(50);
        cc.loader.downloader.loadSubpackage('Main', (err) => {
          if (err) {
            console.log('loadSubpackage Error', err);
            this.hideLineLoading();
            this.bLockLogin = false;
          } else {
            this.setLineLoading(75);
            // 查询玩家信息
            this.queryMemberInfo().then((res) => {
              this.setLineLoading(100);
              if (isNewMember) {
                // 跳转新手引导页
                cc.director.loadScene('Preface');
              } else {
                // 跳转正常游戏
                cc.director.loadScene('Main');
              }
              console.log('Login GlobalData', g_objUserInfo, g_objMemberInfo);
            }).catch((err) => {
              console.log('Login queryMemberInfo Fail.', err);
              this.hideLineLoading();
              this.bLockLogin = false;
            });
          }
        });
      }).catch((err) => {
        console.log('Login updateMemberInfo Fail.', err);
        this.hideLineLoading();
        this.bLockLogin = false;
      });
    }).catch((err) => {
      console.log('Login getUserInfo Fail.', err);
      this.hideLineLoading();
      this.bLockLogin = false;
    });
  },

  //////////////////////////////////////////////////
  // 接口函数
  //////////////////////////////////////////////////
  // 获取用户信息授权流程(旧方法，备用做兼容)
  getUserInfo: function() {
    return new Promise((resolve, reject) => {
      console.log('Login getUserInfo');
      AuthApi.authUserInfo().then((res) => {
        // 渲染用户信息
        if (res) {
          this.setUserInfo(res);
          this.m_UserInfo.active = true;
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
        this.setUserInfo(res).then((res) => {
          this.m_UserInfo.active = true;
          resolve();
        }).catch((err) => {
          reject();
        });
      } else {
        reject();
      }
    });
  },

  // 获取玩家信息
  queryMemberInfo: function() {
    return new Promise((resolve, reject) => {
      WebApi.queryMemberInfo().then((res) => {
        g_objMemberInfo = res.member.data;
        console.log('Login queryMemberInfo Success', g_objMemberInfo);
        resolve(res);
      }).catch((err) => {
        console.log('Login queryMemberInfo fail', err);
        reject(err);
      });
    });
  },

  // 创建玩家角色信息
  updateMemberInfo: function() {
    return new Promise((resolve, reject) => {
      const isLogin = true;
      WebApi.updateMemberInfo(g_objUserInfo, isLogin).then((res) => {
        console.log('Login updateMemberInfo.success.', res);
        resolve(res.result);
      }).catch((err) => {
        console.log('Login updateMemberInfo.fail.', err);
        reject();
      });
    });
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  init: function() {
    // 获取游戏的公告等信息
    WebApi.queryGameDetail().then((res) => {
      return new Promise((resolve, reject) => {
        // 1.接口读取到的信息转义
        if (res.result) {
          console.log('Login queryGameDetail', res);
          // 一定要获取到游戏信息
          if (res && res.game) {
            this.objGameDetail = res.game.data[0];
            this.objGameDetail.strNotice = this.objGameDetail.notice.join('\n');
          }
          resolve();
        } else {
          // 接口返回失败（弹出弹窗交互重新获取游戏信息）

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

  // 渲染用户信息
  setUserInfo: function(res) {
    if (res) {
      return new Promise((resolve, reject) => {
        // 用户信息存全局变量中
        g_objUserInfo = res.userInfo;
        // 更新昵称
        this.m_labelName.getComponent(cc.Label).string = `${res.userInfo.nickName}，欢迎你回来~`;
        // 更新头像
        cc.loader.load({url: res.userInfo.avatarUrl, type: 'png'}, (err, img) => {
          if (err) {
            reject();
          }
          console.log('Login setUserInfo', img);
          this.m_sprAvatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
          resolve();
        });
      });
    }
  },

  // 显示公告对话框 
  showNocticeDlg: function() {
    if (this.btnLogin) {
      this.btnLogin.hide();
    }
    this.dlgNotice = cc.instantiate(this.m_prefabDlg);
    this.dlgNotice.getComponent('ModuleDialog').setNoticeContent(this.objGameDetail.strNotice);
    this.m_canvas.addChild(this.dlgNotice);
  },

  // 显示登录进度条
  showLineLoading: function() {
    this.lineLoading = cc.instantiate(this.m_prefabLoading);
    this.lineLoading.getComponent('LineLoading').setProgressPer(0);
    this.m_canvas.addChild(this.lineLoading);
  },

  // 设置登录进度条
  setLineLoading: function(nPer) {
    if (this.lineLoading) {
      this.lineLoading.getComponent('LineLoading').setProgressPer(nPer);
    }
  },

  // 隐藏登录进度条
  hideLineLoading: function() {
    this.lineLoading.destroy();
  },
});

