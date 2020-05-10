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
    // 被选中的章节子项详情索引
    this.nSelectIndex = -1;
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
    // ===== 预制体 =====
    // 预制体 - 章节的子项
    m_prefabStoryItem: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 章节的子项详情
    m_prefabStoryItemIntroduce: {
      type: cc.Prefab,
      default: null
    },
    // ===== 展示 =====
    // 章节标题标签
    m_labelTitle: {
      type: cc.Node,
      default: null
    },
    // 展示章节区域
    m_contentStory: {
      type: cc.Node,
      default: null
    }
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
    this.node.on('select-story-introduce', this.onSelectStoryIntroduce, this);
  },

  // 注销事件
  CancelEvent: function() {
    console.log('World CancelEvent');
    // 注销公告栏消失事件
    this.node.off('hide-notice-dlg', this.onHideDlg, this);
    this.node.off('select-story-introduce', this.onSelectStoryIntroduce, this);
  },

  // 隐藏对话框
  onHideDlg: function() {
    console.log('World onHideDlg');
    
  },

  // 选中指定章节子项
  onSelectStoryIntroduce: function(event) {
    const index = event.getUserData();
    if (this.nSelectIndex === index) {
      this.nSelectIndex = -1;
    } else {
      this.nSelectIndex = index;
    }    
    this.renderStoryInfo();
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
    if (this.nChapters < Math.floor(g_objMemberInfo.story / 10)) {
      console.log('World onBtnRightClick', param);
      if (this.nChapters >= GameApi.getStoryLength() - 1) {
        return;
      }
      this.nChapters++;
      this.setStoryInfo(this.nChapters);
    } else {
      console.log('剧情进度不足');
    }
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

  // 创建一个预制体StoryItem
  createStoryItem: function(objItem, index) {
    let item = null;
    item = cc.instantiate(this.m_prefabStoryItem);
    item.getComponent('StoryItem').setStoryItemData(objItem, index);
    item.x = 0;
    item.y = -(index) * 80;
    if ((this.nSelectIndex >=0) && (index > this.nSelectIndex)) {
      item.y -= 500;
    }
    this.m_contentStory.addChild(item);
  },

  // 创建一个预制体StoryItemIntroduce
  createStoryItemIntroduce: function(objItem, index) {
    let item = null;
    item = cc.instantiate(this.m_prefabStoryItemIntroduce);
    item.getComponent('StoryItemIntroduce').setBagListItemIntroduceData(objItem);
    item.x = 0;
    item.y = -(index + 1) * 80;
    this.m_contentStory.addChild(item);
  },

  // 渲染数据
  renderStoryInfo: function() {
    this.m_labelTitle.getComponent(cc.Label).string = this.objStoryInfo.title;
    this.m_contentStory.removeAllChildren();
    // 渲染章节子项目
    this.objStoryInfo.level.forEach((item, index) => {
      if (index <= (g_objMemberInfo.story % 10)) {
        if ((this.nChapters === Math.floor(g_objMemberInfo.story / 10)) && index === (g_objMemberInfo.story % 10)) {
          item.title = `${this.objStoryInfo.title}${index+1}【未通关】`;
        } else {
          item.title = `${this.objStoryInfo.title}${index+1}【已通关】`;
        }
        this.createStoryItem(item, index);
        if (this.nSelectIndex === index) {
          this.createStoryItemIntroduce(item, index);
          // 记录章节情况
          g_nBattleStory = this.nChapters * 10 + index;
        }
      } else {
        console.log('剧情进度不足');
      }
    });
    // 撑起内容高度
    this.m_contentStory.height = 80 * this.objStoryInfo.level.length;
    this.m_contentStory.height += 500;
  },

  // 从头渲染章节数据
  setStoryInfo: function(nChapters) {
    this.nSelectIndex = -1;
    // 获取数据
    this.getStoryInfo(nChapters);

    // 渲染该章节的子项数据
    this.renderStoryInfo();
  }

});

