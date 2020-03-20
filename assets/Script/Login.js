// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let webapi = require("../Kits/WebApi");

cc.Class({
    extends: cc.Component,

    ctor() {
        // 游戏概况信息
        this.objGameDetail = null;
    },

    properties: {
        // 测试按钮
        m_btnTest: {
            type: cc.Node,
            default: null
        },
        // 登录按钮
        m_btnLogin: {
            type: cc.Node,
            default: null
        },
        // 公告按钮
        m_btnNotice: {
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

    onLoad () {
        console.log('onLoad....');
    },

    start () {
        console.log('start');
        // 初始化微信云函数
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.cloud.init({env:'develop-8ouxt'});
        }

        // 自定义初始化函数
        this.init();
    
    },

    // update (dt) {},

    init: function() {
        // 获取游戏的公告等信息
        webapi.queryGameDetail().then((res) => {
            // 游戏概括信息转义
            console.log('init success.', res);
            if (res && res.result && res.result.result && res.result.result.data && res.result.result.data[0]) {
                this.objGameDetail = res.result.result.data[0]
            }
            console.log('queryGameDetail', this.objGameDetail);
            return new Promise((resolve, reject) => {
                resolve();
            });
        }).then((res)=> {
            // 通过转义后的信息，对页面进行渲染
            console.log('转义后的信息', this.objGameDetail);

            this.m_labelVersion.getComponent(cc.Label).string = this.objGameDetail.version;
        }).catch((err) => {
            console.log('init fail.', err);

        });
    },

    //////////////////////////////////////////////////
    // 交互事件
    //////////////////////////////////////////////////
    // 测试点击函数
    onBtnClick: function(e, param) {
        console.log('onBtnClick');
    },

    // 点击公告按钮消息事件
    onBtnNoticeClick: function(e, param) {
        // 获取用户信息
        console.log('onBtnNoticeClick');
    },    

    // 点击登录按钮消息事件
    onBtnLoginClick: function(e, param) {
        console.log('onBtnLoginClick');
        // 获取用户信息
        this.getUserInfo();    
    },

    //////////////////////////////////////////////////
    // 自定义函数
    //////////////////////////////////////////////////
    // 获取用户信息授权流程
    getUserInfo: function() {
        console.log('getUserInfo');
        wx.getSetting({
            success: (res) => {
                console.log('wx.getSetting', res);
                if (res.authSetting['scope.userInfo'] === true) {
                    // 之前授权过，直接读取用户信息
                    wx.getUserInfo({
                        success: (res) => {
                            console.log('wx.getUserInfo', res);
                            this.setMemberInfo(res);
                        },
                        fail: (err) => {
                            console.log('wx.getUserInfo', err);
                        }
                    });
                } else if (res.authSetting['scope.userInfo'] === false) {
                    // 之前拒绝过，引导用户快去授权
                    wx.openSetting({
                        success: (res) => {
                            console.log('wx.openSetting', res);
                        },
                        fail: (err) => {
                            console.log('wx.openSetting', err);
                        }
                    });
                } else {
                    // 第一次，提示用户开启授权
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success: (res) => {
                            console.log('wx.authorize', res);
                            this.setMemberInfo(res);
                        },
                        fail: (err) => {
                            console.log('wx.authorize', err);
                        }
                    })
                }
            },
            fail: (err) => {

            }
        });
    },

    // 渲染用户信息
    setMemberInfo: function(res) {
        console.log(res.userInfo);
        // 更新头像
        cc.loader.load({url: res.userInfo.avatarUrl, type: 'png'}, (err, img) => {
            console.log('getUserInfo', img);
            this.m_sprAvatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
        });
        // 更新昵称
        this.m_labelName.getComponent(cc.Label).string = `${res.userInfo.nickName}，欢迎你回来~`;
    },

});

