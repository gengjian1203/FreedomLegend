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
let WebApi = require("../Kits/WebApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    // 当前选中的邮件序号
    this.m_nSelectIndex = -1;
    // 
    this.arrMailListObject = [];
    // 该邮件是否携带礼物
    this.isHaveGift = false;
    // 奖励结果
    this.m_dlgPrize = null;
  },

  properties: {
    // 预制体 - List项Item
    m_prefabMailListItem: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - 购买结果
    m_prefabPrize: {
      type: cc.Prefab,
      default: null
    },
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 邮件列表
    m_mailList: {
      type: cc.Node,
      default: null
    },
    // 邮件内容
    m_mailContent: {
      type: cc.Node,
      default: null
    },
    // 邮寄人
    m_labelFrom: {
      type: cc.Node,
      default: null
    },
    // 邮件内容
    m_labelContentString: {
      type: cc.Node,
      default: null
    },
    // 礼物列表
    m_rootGift: {
      type: cc.Node,
      default: null
    },
    // 按钮名称
    m_labelBtnSure: {
      type: cc.Node,
      default: null
    },
    // 空内容提示标识
    m_sprEmptyTip: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    this.setMailList();
    this.setMailContent(0);
  },

  onEnable () {
    console.log('MailDialog onEvable.');
    this.node.on('show-mail-content', this.onShowMailContent, this);
    this.registerEvent();
  },

  onDisable () {
    console.log('MailDialog onDisable.');
    this.node.off('show-mail-content', this.onShowMailContent, this);
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 关闭对话框
  onBtnOKClick: function() {
    console.log('MailDialog onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-mail-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 点击收下/删除按钮
  onBtnSureClick: function() {
    if (this.isHaveGift) {
      // 收下礼物
      const arrGifts = g_arrMailInfo[this.m_nSelectIndex].arrGifts;
      arrGifts.forEach((item) => {
        item._id = Common.getUUID();
        item.time = new Date().getTime();
      });
      this.onShowPrizeDlg(arrGifts);
      g_arrMailInfo[this.m_nSelectIndex].arrGifts = {};
      this.setMailContent(this.m_nSelectIndex);
      
    } else {
      // 删除邮件
      g_arrMailInfo.splice(this.m_nSelectIndex, 1);
      // 刷新列表
      this.setMailList();
      this.setMailContent(0);
    }

    // 服务器更新邮件列表
    const param = {
      partsInfo: g_arrMailInfo,
      partsType: 'mail'
    };
    WebApi.updatePartsInfo(param).then((res) => {
    }).catch((err) => {
      console.log('MailDialog updatePartsInfo Fail.', err);
    });
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

  // 展示对应邮件内容
  onShowMailContent: function(event) {
    this.m_nSelectIndex = event.getUserData();
    this.setMailContent(this.m_nSelectIndex);
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 显示奖励弹窗
  onShowPrizeDlg: function(arrPrize) {
    this.m_dlgPrize = cc.instantiate(this.m_prefabPrize);
    this.m_dlgPrize.getComponent('PrizeDialog').setItemPrize(arrPrize);
    this.node.addChild(this.m_dlgPrize);
  },

  // 创建一个邮件item
  createMailListItem: function(index) {
    let item = null;
    item = cc.instantiate(this.m_prefabMailListItem);
    item.getComponent('MailListItem').setMailListItemData(index);
    item.x = 0;
    item.y = -(index + 1) * 90;

    this.arrMailListObject.push(item);
    this.m_mailList.height += 80;
    this.m_mailList.addChild(item);
  },

  // 渲染邮件列表
  setMailList: function() {
    console.log('MailDialog queryMailListInfo');
    // 请空邮件列表
    this.arrMailListObject = [];
    this.m_mailList.height = 0;
    this.m_mailList.removeAllChildren();
    // 渲染列表
    for(let i = 0; i < g_arrMailInfo.length; i++) {
      this.createMailListItem(i);
    }
  },

  // 创建一个礼物item
  createGiftItem: function(objGift, nIndex) {
    console.log('createGiftItem', objGift);
    const node = new cc.Node();
    node.x = 0;
    node.y = -nIndex * 40;
    node.color = GameApi.getPartsInfoColor(objGift.id);
    const label = node.addComponent(cc.Label);
    label.fontSize = 30;
    label.string = `${GameApi.getPartsInfoComplete(objGift.id).name} ×${objGift.total}`;
    this.m_rootGift.addChild(node);
    this.m_rootGift.height += 40;
  },

  // 渲染邮件内容
  setMailContent: function(nIndex) {
    console.log('MailDialog setMailContent', nIndex);
    // 判断参数是否合法
    if (nIndex >= g_arrMailInfo.length) {
      console.log('MailDialog Empty.');
      this.m_mailContent.active = false;
      this.m_sprEmptyTip.active = true;
      return ;
    }
    this.m_mailContent.active = true;
    this.m_sprEmptyTip.active = false;
    // 
    this.m_nSelectIndex = nIndex;
    // 清空礼物列表
    this.m_rootGift.height = 0;
    this.m_rootGift.removeAllChildren();
    // 开始渲染
    const objMailSelectData = g_arrMailInfo[this.m_nSelectIndex];
    this.isHaveGift = Boolean(objMailSelectData.arrGifts.length);
    this.m_labelFrom.getComponent(cc.Label).string = objMailSelectData.strFrom;
    this.m_labelContentString.getComponent(cc.Label).string = objMailSelectData.strContent;
    for (let i = 0; i < objMailSelectData.arrGifts.length; i++) {
      this.createGiftItem(objMailSelectData.arrGifts[i], i);
    }
    this.m_labelBtnSure.getComponent(cc.Label).string = this.isHaveGift ? '收下': '删除';
  }
});
