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
let GameApi = require("../Kits/GameApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    // 气泡对话框
    this.m_dlgToast = null;
  },

  properties: {
    // 预制体 - 气泡弹窗
    m_prefabToast: {
      type: cc.Prefab,
      default: null
    },
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    //////////////////////////////////////////////////
    // 装备栏
    //////////////////////////////////////////////////
    // 
    //////////////////////////////////////////////////
    // 状态栏
    //////////////////////////////////////////////////
    // 昵称
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 称号
    m_labelTitle: {
      type: cc.Node,
      default: null
    },
    // 等级
    m_labelTaste: {
      type: cc.Node,
      default: null
    },
    // 经验
    m_labelExp: {
      type: cc.Node,
      default: null
    },
    // 描述
    m_labelDescribe: {
      type: cc.Node,
      default: null
    },
    // 生命
    m_labelHP: {
      type: cc.Node,
      default: null
    },
    // 外功
    m_labelOuterAttack: {
      type: cc.Node,
      default: null
    },
    // 内功
    m_labelinnerAttack: {
      type: cc.Node,
      default: null
    },
    // 外防
    m_labelOuterDefense: {
      type: cc.Node,
      default: null
    },
    // 内防
    m_labelInnerDefense: {
      type: cc.Node,
      default: null
    },
    // 暴击
    m_labelCrit: {
      type: cc.Node,
      default: null
    },
    // 闪避
    m_labelDodge: {
      type: cc.Node,
      default: null
    },
    // 格挡
    m_labelBlock: {
      type: cc.Node,
      default: null
    },
    // 幸运
    m_labelLucky: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    this.setMemberInfo();
  },

  onEnable () {
    console.log('MemberDialog onEvable.');
    this.node.on('hide-toast-dlg', this.onHideToastDlg, this);
    this.registerEvent();
  },

  onDisable () {
    console.log('MemberDialog onDisable.');
    this.node.off('hide-toast-dlg', this.onHideToastDlg, this);
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 关闭对话框
  onBtnOKClick: function() {
    console.log('MemberDialog onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-member-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 人物传记按钮
  onBtnLogClick: function() {
    console.log('MemberDialog onBtnOKClick.');
    const strMsg = '抱歉，该功能尚未开放';
    this.showToastDlg(strMsg);
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

  // 隐藏气泡弹窗
  onHideToastDlg: function() {
    console.log('MemberDialog onHideToastDlg');
    this.bLockButton = false;
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染玩家属性值
  setMemberInfo: function() {
    if (!Common.isObjectEmpty(g_objUserInfo) && !Common.isObjectEmpty(g_objMemberInfo)) {
      console.log('', g_objUserInfo, g_objMemberInfo);
      
      // 昵称
      this.m_labelName.getComponent(cc.Label).string = g_objUserInfo.nickName;
      // 称号
      this.m_labelTitle.getComponent(cc.Label).string = g_objMemberInfo.title;
      // 等级
      this.m_labelTaste.getComponent(cc.Label).string = GameApi.getTasteString(g_objMemberInfo.level);
      // 经验
      this.m_labelExp.getComponent(cc.Label).string = `${g_objMemberInfo.exp} / ${GameApi.getExpMaxString(g_objMemberInfo.level)}`;
      // 描述
      this.m_labelDescribe.getComponent(cc.Label).string = GameApi.getDescribeString(g_objMemberInfo.describe);
      // 生命
      this.m_labelHP.getComponent(cc.Label).string = g_objMemberInfo.hp_total;
      // 外功
      this.m_labelOuterAttack.getComponent(cc.Label).string = g_objMemberInfo.outerAttack_total;
      // 内功
      this.m_labelinnerAttack.getComponent(cc.Label).string = g_objMemberInfo.innerAttack_total;
      // 外防
      this.m_labelOuterDefense.getComponent(cc.Label).string = g_objMemberInfo.outerDefense_total;
      // 内防
      this.m_labelInnerDefense.getComponent(cc.Label).string = g_objMemberInfo.innerDefense_total;
      // 暴击
      this.m_labelCrit.getComponent(cc.Label).string = g_objMemberInfo.crit_total;
      // 闪避
      this.m_labelDodge.getComponent(cc.Label).string = g_objMemberInfo.dodge_total;
      // 格挡
      this.m_labelBlock.getComponent(cc.Label).string = g_objMemberInfo.block_total;
      // 幸运
      this.m_labelLucky.getComponent(cc.Label).string = g_objMemberInfo.lucky_total;
      
    }
  },

  // 显示气泡对话框 
  showToastDlg: function(strMsg) {
    this.m_dlgToast = cc.instantiate(this.m_prefabToast);
    this.m_dlgToast.getComponent('ToastDialog').setToastContent(strMsg);
    this.node.addChild(this.m_dlgToast);
  },
});
