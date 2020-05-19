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
    this.arrSportListData = [
      {_id: "mem-0108-00", sportsNumber: 1, nickName: "豺狼首领", level: 100, hp_total: 1500, outerAttack_total: 360, innerAttack_total: 300, outerDefense_total: 20, innerDefense_total: 25, crit_total: 0, dodge_total: 0, speed_total: 10, understand_total: 0},
      {_id: "mem-0108-01", sportsNumber: 2, nickName: "虎豹首领", level: 82, hp_total: 1800, outerAttack_total: 350, innerAttack_total: 310, outerDefense_total: 35, innerDefense_total: 5, crit_total: 0, dodge_total: 0, speed_total: 12, understand_total: 0},
      {_id: "mem-0108-02", sportsNumber: 3, nickName: "虎豹首领", level: 32, hp_total: 1800, outerAttack_total: 350, innerAttack_total: 310, outerDefense_total: 35, innerDefense_total: 5, crit_total: 0, dodge_total: 0, speed_total: 12, understand_total: 0},
      {_id: "mem-0108-03", sportsNumber: 23, nickName: "成年虎豹", level: 32, hp_total: 1200, outerAttack_total: 310, innerAttack_total: 210, outerDefense_total: 35, innerDefense_total: 5, crit_total: 0, dodge_total: 0, speed_total: 12, understand_total: 0},
      {_id: "mem-0108-04", sportsNumber: 84, nickName: "成年虎豹", level: 23, hp_total: 1200, outerAttack_total: 310, innerAttack_total: 210, outerDefense_total: 35, innerDefense_total: 5, crit_total: 0, dodge_total: 0, speed_total: 12, understand_total: 0},
      {_id: "mem-0005-00", sportsNumber: 234, nickName: "强盗精英", level: 30, hp_total: 600, outerAttack_total: 90, innerAttack_total: 40, outerDefense_total: 20, innerDefense_total: 25, crit_total: 0, dodge_total: 0, speed_total: 10, understand_total: 0},
      {_id: "mem-0005-01", sportsNumber: 483, nickName: "土匪精英", level: 30, hp_total: 600, outerAttack_total: 100, innerAttack_total: 20, outerDefense_total: 35, innerDefense_total: 5, crit_total: 0, dodge_total: 0, speed_total: 12, understand_total: 0},
      {_id: "mem-0005-02", sportsNumber: 1339, nickName: "强盗", level: 20, hp_total: 400, outerAttack_total: 20, innerAttack_total: 20, outerDefense_total: 20, innerDefense_total: 10, crit_total: 0, dodge_total: 0, speed_total: 5, understand_total: 0}, 
      {_id: "mem-0005-03", sportsNumber: 5738, nickName: "土匪", level: 20, hp_total: 400, outerAttack_total: 30, innerAttack_total: 30, outerDefense_total: 20, innerDefense_total: 5, crit_total: 0, dodge_total: 0, speed_total: 3, understand_total: 0},
      {_id: "mem-0001-01", sportsNumber: 8281, nickName: "小喽啰", level: 5, hp_total: 50, outerAttack_total: 30, innerAttack_total: 15, outerDefense_total: 0, innerDefense_total: 0, crit_total: 0, dodge_total: 0, speed_total: 0, understand_total: 0}
    ];
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
    this.m_labelSportNumber.getComponent(cc.Label).string = '9999+';
  },

  // 渲染列表数据
  renderList: function() {
    this.arrSportListObject.forEach((item, index) => {
      item.getComponent('SportListItem').setSportListItemData(this.arrSportListData[index]);
    });
  },

  // 初始化函数
  init: function() {
    // 接口获取数据
    // 创建演武场列表
    this.arrSportListData.forEach((item, index) => {
      this.createSportListItem(index);
    });
    // 渲染自身数据
    this.renderSportNumber();
    // 渲染列表数据
    this.renderList();

    
  }
});
