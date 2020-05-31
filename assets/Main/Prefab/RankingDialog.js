// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let AuthApi = require("../../Kits/AuthApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    // 当前选中的按钮序号
    this.m_nSelectType = -1;
  },

  properties: {
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 子域排行榜视图
    m_subContextView: {
      type: cc.Node,
      default: null
    },
    // 等级榜文字
    m_labelLevel: {
      type: cc.Node,
      default: null
    },
    // 战力榜文字
    m_labelPower: {
      type: cc.Node,
      default: null
    },
    // 演武榜文字
    m_labelSportsNumber: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    setTimeout(() => {
      this.m_subContextView.getComponent(cc.WXSubContextView).enabled = true;
    }, 1000);
    this.switchRanking(parseInt(0));
  },

  onEnable () {
    console.log('RankingDlg onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('RankingDlg onDisable.');
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 关闭对话框
  onBtnOKClick: function() {
    console.log('RankingDlg onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-ranking-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 切换排行榜
  onBtnSwitchRanking: function(e, param) {
    console.log('RankingDlg onBtnSwitchRanking', param);
    this.switchRanking(parseInt(param));
  },
  
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

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 切换排行榜数据信息
  switchRanking: function(type) {
    if (this.m_nSelectType === type) {
      return ;
    }
    this.m_nSelectType = type;
    // 改变按钮颜色
    this.switchButtonColor(type);
    // 向子域发消息获取数据
    AuthApi.postMessageRanking(type, g_objMemberInfo._openid);
    // 刷新子域页面
    setTimeout(() => {
      this.m_subContextView.getComponent(cc.WXSubContextView).update();
    }, 500);
    setTimeout(() => {
      this.m_subContextView.getComponent(cc.WXSubContextView).update();
    }, 1000);
    setTimeout(() => {
      this.m_subContextView.getComponent(cc.WXSubContextView).update();
    }, 1500);
    setTimeout(() => {
      this.m_subContextView.getComponent(cc.WXSubContextView).update();
    }, 2000);
  },

  // 切换按钮颜色
  switchButtonColor: function(type) {
    const colorMain = new cc.color(255, 0, 0, 255);
    const colorDesc = new cc.color(255, 255, 255, 255);
    
    this.m_labelLevel.color = type === 0 ? colorMain : colorDesc;
    this.m_labelPower.color = type === 1 ? colorMain : colorDesc;
    this.m_labelSportsNumber.color = type === 2 ? colorMain : colorDesc;
  }
});
