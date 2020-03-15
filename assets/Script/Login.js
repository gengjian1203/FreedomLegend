// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor() {
        // 数据库
        this.db = null;
    },

    properties: {
        // 测试按钮
        m_btnTest: {
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
        // 分数文字
        m_labelScore: {
            type: cc.Node,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

        // 初始化微信云函数
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.cloud.init({env:'develop-8ouxt'});
            this.db = wx.cloud.database()
        }


        this.init();
    },

    // update (dt) {},

    init: function() {

    },

    onBtnClick: function(e, param) {
        const urlTmp = 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoMozqsT4wlY5mr2UdVia9dS7SWwy8uawQVPdphqAF8ybLg7FKaTZsrCpn8I6AunCAbgCeygO18ticg/132';
        // 更新头像
        cc.loader.load({url: urlTmp, type: 'png'}, (err, img) => {
            console.log('getUserInfo', img);
            this.testConsole('111');
            this.m_sprAvatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
        });
    },

    // 点击测试按钮消息事件
    onBtnTestClick: function(e, param) {
        let self = this;
        console.log('console. onBtnTestClick', e, param);
        // console.log('onBtnTestClick', self, this);
        this.testConsole('11111');
        // 下面为微信API的操作
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // console.log('onBtnTestClick', self, this);
            this.testConsole('22222');
            // 获取用户信息
            wx.getSetting({
                success: (res) => {
                    console.log(res);
                    // console.log('onBtnTestClick', self, this);
                    if (res.authSetting['scope.userInfo'] === false) {
                        // 拒绝授权，引导进入设置页码
                        wx.openSetting({
                            success: (res2) => {
                              console.log(res2.authSetting);
                            }
                        });
                    } else if (res.authSetting['scope.userInfo'] === true) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        // console.log('onBtnTestClick', self, this);
                        this.getUserInfo();
                    } else {
                        // 从未操作过，询问是否授权。
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success: (res2) => {
                                // 刚授权，可以直接调用 getUserInfo 获取头像昵称
                                this.getUserInfo();
                            }
                        });
                    }
                },
                fail: (err) => {
                    console.error('wx.getSetting err', err);
                }
            });

            // 获取后台信息
            this.getDatabase();
        }
    },

    testConsole: function (str) {
        console.log('testConsole', str);
    },

    // 获取用户信息
    getUserInfo: function() {

        console.log('getUserInfo');
        wx.getUserInfo({
            success: (res) => {
                console.log(res.userInfo);
                const urlTmp = 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoMozqsT4wlY5mr2UdVia9dS7SWwy8uawQVPdphqAF8ybLg7FKaTZsrCpn8I6AunCAbgCeygO18ticg/132';
                // 更新头像
                cc.loader.load({url: urlTmp, type: 'png'}, (err, img) => {
                    console.log('getUserInfo', img);
                    this.testConsole('111');
                    this.m_sprAvatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
                });
                // 更新昵称
                this.m_labelName.getComponent(cc.Label).string = res.userInfo.nickName;
            }
        });
    },

    // 从云函数获取数据库数据
    getDatabase: function() {
        console.log('getDatabase');
        // 获取 openid
        wx.cloud.callFunction({
            name: 'login',
            success: (res) => {
                const openid = res.result.openid
                this.getDatabaseScore(openid);
            },
            fail: (err) => {
                console.error('get openid failed with error', err)
            }
        });
    },

    // 从云数据库取历史最高分
    getDatabaseScore: function(openid) {
        if (this.db) {
            console.log('getDatabaseScore2');
            this.db.collection('score').doc(`${openid}-score`).get()
            .then(res => {
                console.log('getDatabaseScore3', res);
                this.m_labelScore.getComponent(cc.Label).string = res.data.max;
            })
            .catch(err => {
                console.error('db get score catch error', err);
            })
        }
    }
});
