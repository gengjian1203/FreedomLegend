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
    // 存储放置挑战者列表项预制体的数组
    this.arrSportListObject = [];
    // 挑战者列表mock数据
    this.arrSportListData = [];
  },

  properties: {
    // ===== 预制体 =====
    // 预制体 - 气泡弹窗
    m_prefabSportListItem: {
      type: cc.Prefab,
      default: null
    },
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 比武列表选择区域 
    m_content: {
      type: cc.Node,
      default: null
    },
    // 自身演武场排名
    m_labelSportNumber: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    this.init();
  },

  onEnable () {
    console.log('SportDialog onEvable.');

    // 注册事件
    this.registerEvent();
  },

  onDisable () {
    console.log('SportDialog onDisable.');

    // 注销事件
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////  
  // 注册事件
  registerEvent: function() {
    this.m_mask.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_mask.on('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 注销事件
  CancelEvent: function() {
    this.m_mask.off('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_mask.off('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 点击换一批按钮
  onBtnBtnChangeClick: function() {
    console.log('SportDialog onBtnBtnChangeClick.');
    this.queryData();
  },

  // 关闭对话框
  onBtnOKClick: function() {
    console.log('SportDialog onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-sport-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 清空比武场对手数据
  clearSportList: function() {
    this.arrSportListData = [];
    this.arrSportListObject = [];
    this.m_content.height = 0;
    this.m_content.removeAllChildren();
  },

  // 创建竞技场对手预制体
  createSportListItem: function(index) {
    let item = null;
    item = cc.instantiate(this.m_prefabSportListItem);
    
    item.x = 0;
    item.y = -(index + 1) * 160;

    this.arrSportListObject.push(item);
    console.log('createSportListItem: ', this.m_content.height);
    this.m_content.height += 160;
    this.m_content.addChild(item);
  },

  // 渲染自身数据
  renderSportNumber: function() {
    this.m_labelSportNumber.getComponent(cc.Label).string = String(g_objMemberInfo.sportsNumber < 10000 ? g_objMemberInfo.sportsNumber : '9999+');
  },

  // 渲染列表数据
  renderList: function() {
    this.arrSportListObject.forEach((item, index) => {
      item.getComponent('SportListItem').setSportListItemData(this.arrSportListData[index]);
    });
  },

  // 初始化函数
  init: function() {
    this.queryData();
  },

  queryData: function() {
    this.clearSportList();
    const param = {
      sportsNumber: g_objMemberInfo.sportsNumber
    }
    // 接口获取数据
    WebApi.querySportsList(param).then((res) => {
      this.arrSportListData = res.arrSportsList;
      // 创建演武场列表
      this.arrSportListData.forEach((item, index) => {
        this.createSportListItem(index);
      });
      // 渲染自身数据
      this.renderSportNumber();
      // 渲染列表数据
      this.renderList();

    }).catch((err) => {
      console.log('SportDialog querySportsList fail', err);
    });    
  }
});
