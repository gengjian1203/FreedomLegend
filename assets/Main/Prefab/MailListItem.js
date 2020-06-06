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
    this.m_nSelectIndex = -1;
    // 这条数据的基本信息
    this.objMailListItemData = {};
  },

  properties: {
    // 邮件内容
    m_labelContent: {
      type: cc.Node,
      default: null
    },
    // 邮件时间
    m_labelTime: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    
  },

  onEnable () {
    console.log('MailListItem onEvable.');
  },

  onDisable () {
    console.log('MailListItem onDisable.');
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  onItemClick: function() {
    const event = new cc.Event.EventCustom('show-mail-content', true);
    event.setUserData(this.m_nSelectIndex);

    this.node.dispatchEvent(event);
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染邮件列表item颜色
  setMailListItemColor: function(isSelect) {
    const color = isSelect ? new cc.color(255, 0, 0) : new cc.color(255, 255, 255);
    this.m_labelContent.color = color;
    this.m_labelTime.color = color;
  },

  // 渲染邮件列表item信息
  setMailListItemData: function(nIndex) {
    this.m_nSelectIndex = nIndex;
    this.objMailListItemData = g_arrMailInfo[nIndex];
    const strContent = this.objMailListItemData.strContent.length > 5 ? `${this.objMailListItemData.strContent.slice(0, 5)}...` : this.objMailListItemData.strContent;
    this.m_labelContent.getComponent(cc.Label).string = strContent;
    this.m_labelTime.getComponent(cc.Label).string = this.objMailListItemData.time;
  }
});
