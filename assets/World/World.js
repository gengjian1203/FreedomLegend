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
let GameApi = require("../Kits/GameApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    // 当前章节号
    this.nChapters = 0;
    // 需要展示的章节信息
    this.objStoryInfo = null;
  },

  properties: {
    // 根节点
    m_root: {
      type: cc.Node,
      default: null
    },
    // 章节标题标签
    m_labelTitle: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    console.log('World start');
    Common.AdapterScreen(this.m_root);

    // 自定义初始化函数
    this.init();
  },

  onEnable () {
    console.log('World onEnable');
    this.registerEvent();
  },

  onDisable () {
    console.log('World onDisable');
    this.CancelEvent();
  },

  onDestroy() {
    console.log('World onDestroy');
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 注册事件
  registerEvent: function() {
    console.log('World registerEvent');
    // 注册公告栏消失事件
    this.node.on('hide-notice-dlg', this.onHideDlg, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('World CancelEvent');

    // 注销公告栏消失事件
    this.node.off('hide-notice-dlg', this.onHideDlg, this);
  },

  // 隐藏对话框
  onHideDlg: function() {
    console.log('World onHideDlg');
    
  },
  
  // 测试点击函数
  onBtnClick: function(e, param) {
    console.log('World onBtnClick', param);
  },

  // 返回游戏主页面
  onBtnReturnClick: function(e, param) {
    console.log('World onBtnReturnClick', param);
    cc.director.loadScene('Main');
  },

  // 向左切换章节
  onBtnLeftClick: function(e, param) {
    console.log('World onBtnLeftClick', param);
    if (this.nChapters <= 0) {
      return;
    }
    this.nChapters--;
    this.setStoryInfo(this.nChapters);
  },

  // 向右切换章节
  onBtnRightClick: function(e, param) {
    console.log('World onBtnRightClick', param);
    if (this.nChapters >= GameApi.getStoryLength() - 1) {
      return;
    }
    this.nChapters++;
    this.setStoryInfo(this.nChapters);
  },

  //////////////////////////////////////////////////
  // 接口函数
  //////////////////////////////////////////////////
  // 获取章节信息
  getStoryInfo: function(nChapters) {
    this.objStoryInfo = GameApi.getStoryInfo(nChapters);
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 初始化
  init: function() {
    // 获取数据
    this.nChapters = 0;

    // 进行渲染
    this.setStoryInfo(this.nChapters);
  },

  // 渲染章节数据
  setStoryInfo: function(nChapters) {
    // 获取数据
    this.getStoryInfo(nChapters);

    // 渲染
    this.m_labelTitle.getComponent(cc.Label).string = this.objStoryInfo.title;
  }

});

