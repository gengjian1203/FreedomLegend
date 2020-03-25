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
    // 游戏引语信息
    this.strIndex = 0;
    this.bFinish = false;
    this.strContent = `这一天你打开了手机，\n` + 
                      `忽然手机出现了一个漩涡，\n` + 
                      `将你吸入其中，\n` + 
                      `...\n` + 
                      `等你醒过来的时候，\n` + 
                      `你发现来到了一个陌生的世界，\n` + 
                      `看了看周围的人，\n` + 
                      `似熟悉又陌生，\n` + 
                      `...\n` + 
                      `如今的你，\n` + 
                      `只好随遇而安，\n` + 
                      `而这个神奇的世界，\n` + 
                      `将会给你带来一段奇秒的旅程。\n`;
  },

  properties: {
    // 根节点
    m_root: {
      type: cc.Node,
      default: null
    },
    // 引言文字
    m_content: {
      type: cc.Node,
      default: null
    },
    // 提示文字
    m_tip: {
      type: cc.Node,
      default: null
    },
    // 蒙板触碰
    m_mask: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    console.log('Preface start');
    Common.AdapterScreen(this.m_root);
    
    // 文字引导
    this.run();

    // 注册账号
    // this.createMember();

  },

  onEnable () {
    console.log('Preface onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('Preface onDisable.');
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 注册事件
  registerEvent: function() {
    console.log('Preface registerEvent');
    this.m_mask.on(cc.Node.EventType.TOUCH_START, this.onMaskClick, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('Preface CancelEvent');
    this.m_mask.off(cc.Node.EventType.TOUCH_START, this.onMaskClick, this);
  },

  // 蒙板点击事件
  onMaskClick: function(e, param) {
    console.log('Preface onMaskClick');
    if (this.bFinish) {
      // 文字加载完毕，跳转页面
      cc.director.loadScene('Main');
    } else {
      // 使文字加载完毕
      this.unschedule(this.showContent);
      this.m_content.getComponent(cc.Label).string = this.strContent;
      this.bFinish = true;
      this.m_tip.active = true;
    }
  },

  //////////////////////////////////////////////////
  // 接口函数
  //////////////////////////////////////////////////
  // 创建角色信息
  createMember: function() {
    WebApi.updateMemeber(g_objUserInfo).then((res) => {
      console.log('Preface createMember.success.', res);
    }).catch((err) => {
      console.log('Preface createMember.fail.', err);
    });
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 打字机模式显示文字
  showContent: function() {
    if (this.strIndex < this.strContent.length) {
      this.m_content.getComponent(cc.Label).string += this.strContent[this.strIndex];
      this.strIndex++;
    } else {
      this.unschedule(this.showContent);
      this.bFinish = true;
      this.m_tip.active = true;
    }
  },

  // 开始执行
  run: function() {
    this.m_content.getComponent(cc.Label).string = '';
    this.schedule(this.showContent, 0.2);
  }

});
