// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let GameApi = require("../Kits/GameApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    this.m_nSelectIndex = -1;
    // 这条数据的基本信息
    this.objGrowthListItemData = {};
  },

  properties: {
    // 强化物品名称
    m_labelContent: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    
  },

  onEnable () {
    console.log('GrowthListItem onEvable.');
  },

  onDisable () {
    console.log('GrowthListItem onDisable.');
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  onItemClick: function() {
    const event = new cc.Event.EventCustom('show-growth-content', true);
    event.setUserData(this.m_nSelectIndex);

    this.node.dispatchEvent(event);
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染邮件列表item颜色
  setGrowthListItemColor: function(isSelect) {
    const color = isSelect ? new cc.color(255, 0, 0) : new cc.color(255, 255, 255);
    this.m_labelContent.color = color;
  },

  // 渲染邮件列表item信息
  setGrowthListItemData: function(nIndex, objGrowth) {
    this.m_nSelectIndex = nIndex;
    this.objGrowthListItemData = objGrowth;
    const strName = GameApi.getPartsInfoComplete(objGrowth.id).name;
    const strContent = `${objGrowth.isEquip ? '★' : ''}` + 
                       `${strName && strName.length > 4 ? strName.slice(0, 3) + '...' : strName}` + 
                       `(Lv.` + 
                       `${objGrowth.level}` + 
                       `)`;
    this.m_labelContent.getComponent(cc.Label).string = strContent;
  }
});
