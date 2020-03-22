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

  },

  properties: {
    // 根节点
    m_root: {
      type: cc.Node,
      default: null
    },
    m_avatar: {
      type: cc.Node,
      default: null
    },
    m_name: {
      type: cc.Node,
      default: null
    },
    // 测试文字标签
    m_label: {
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
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Main registerEvent.');
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 开始执行
  run: function() {
    // 更新头像
    cc.loader.load({url: g_objUserInfo.avatarUrl, type: 'png'}, (err, img) => {
      this.m_avatar.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
    });
    this.m_label.getComponent(cc.Label).string = `${g_objUserInfo.nickName}，欢迎来到《醉梦坛说》`;
    this.m_name.getComponent(cc.Label).string = g_objUserInfo.nickName;
  },

});
