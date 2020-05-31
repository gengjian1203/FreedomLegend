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
    // 当前选中的类型序号
    this.m_nSelectTypeIndex = 0;
    // 当前选中的物品序号
    this.m_nSelectGrowthIndex = -1;
    // 所属种类的数组列表
    this.arrGrowthListObject = [];
  },

  properties: {
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 强化类型列表
    m_arrGrowthTypeLabelList: {
      type: [cc.Node],
      default: []
    },
    // 强化内容节点
    m_growthContent: {
      type: cc.Node,
      default: null
    },
    // 待强化的物品列表
    m_growthList: {
      type: cc.Node,
      default: null
    },
    // 物品名称
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 物品介绍
    m_labelContentString: {
      type: cc.Node,
      default: null
    },
    // 物品属性根节点
    m_rootAttribute: {
      type: cc.Node,
      default: null
    },
    // 需要的材料列表
    m_rootMaterial: {
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
    this.setGrowthType();
    // this.setGrowthList();
    // this.setGrowthContent(0);
  },

  onEnable () {
    console.log('GrowthDialog onEvable.');
    this.node.on('show-growth-content', this.onShowGrowthContent, this);
    this.registerEvent();
  },

  onDisable () {
    console.log('GrowthDialog onDisable.');
    this.node.off('show-growth-content', this.onShowGrowthContent, this);
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 关闭对话框
  onBtnOKClick: function() {
    console.log('GrowthDialog onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-growth-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 切换强化种类
  onBtnSwitchTypeClick: function(e, param) {
    console.log('GrowthDialog onBtnSwitchTypeClick', param);
    this.m_nSelectTypeIndex = parseInt(param);
    this.setGrowthType();
  },

  // 点击收下/删除按钮
  onBtnSureClick: function() {
    // if (this.isHaveGift) {
    //   // 收下礼物
    //   const arrGifts = g_arrMailInfo[this.m_nSelectGrowthIndex].arrGifts;
    //   arrGifts.forEach((item) => {
    //     item._id = Common.getUUID();
    //     item.time = new Date().getTime();
    //   });
    //   this.onShowPrizeDlg(arrGifts);
    //   g_arrMailInfo[this.m_nSelectGrowthIndex].arrGifts = {};
    //   this.setGrowthContent(this.m_nSelectGrowthIndex);
      
    // } else {
    //   // 删除邮件
    //   g_arrMailInfo.splice(this.m_nSelectGrowthIndex, 1);
    //   // 刷新列表
    //   this.setGrowthList();
    //   this.setGrowthContent(0);
    // }

    // // 服务器更新邮件列表
    // const param = {
    //   partsInfo: g_arrMailInfo,
    //   partsType: 'mail'
    // };
    // WebApi.updatePartsInfo(param).then((res) => {
    // }).catch((err) => {
    //   console.log('MailDialog updatePartsInfo Fail.', err);
    // });
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
  onShowGrowthContent: function(event) {
    this.m_nSelectGrowthIndex = event.getUserData();
    this.setGrowthContent(this.m_nSelectGrowthIndex);
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 显示奖励弹窗
  onShowPrizeDlg: function(arrPrize) {
    // this.m_dlgPrize = cc.instantiate(this.m_prefabPrize);
    // this.m_dlgPrize.getComponent('PrizeDialog').setItemPrize(arrPrize);
    // this.node.addChild(this.m_dlgPrize);
  },

  // 创建一个邮件item
  createGrowthListItem: function(index) {
    let item = null;
    item = cc.instantiate(this.m_prefabMailListItem);
    item.getComponent('GrowthListItem').setGrowthListItemData(index, {});
    item.x = 0;
    item.y = -(index + 1) * 60;

    this.arrGrowthListObject.push(item);
    this.m_growthList.height += 60;
    this.m_growthList.addChild(item);
  },

  // 渲染强化种类 
  setGrowthType: function() {
    console.log('GrowthDialog setGrowthType', this.m_nSelectTypeIndex);
  },

  // 渲染强化物品列表
  setGrowthList: function() {
    console.log('GrowthDialog setGrowthList');
    // 请空邮件列表
    this.arrGrowthListObject = [];
    this.m_growthList.height = 0;
    this.m_growthList.removeAllChildren();
    // 渲染列表
    for(let i = 0; i < g_arrMailInfo.length; i++) {
      this.createGrowthListItem(i);
    }
  },

  // 创建一个材料item
  createMaterialItem: function(objMaterial, nIndex) {
    console.log('GrowthDialog createMaterialItem', objMaterial);
    // const node = new cc.Node();
    // node.x = 0;
    // node.y = -nIndex * 40;
    // node.color = GameApi.getPartsInfoColor(objMaterial.id);
    // const label = node.addComponent(cc.Label);
    // label.fontSize = 30;
    // label.string = `${GameApi.getPartsInfoComplete(objMaterial.id).name} ×${objMaterial.total}`;
    // this.m_rootMaterial.addChild(node);
    // this.m_rootMaterial.height += 40;
  },

  // 渲染邮件内容
  setGrowthContent: function(nIndex) {
    console.log('GrowthDialog setGrowthContent', nIndex);
    // 判断参数是否合法
    if (nIndex >= g_arrMailInfo.length) {
      console.log('GrowthDialog Empty.');
      this.m_growthContent.active = false;
      this.m_sprEmptyTip.active = true;
      return ;
    }
    this.m_growthContent.active = true;
    this.m_sprEmptyTip.active = false;
    // 
    this.m_nSelectGrowthIndex = nIndex;
    // 清空礼物列表
    this.m_rootMaterial.height = 0;
    this.m_rootMaterial.removeAllChildren();
    // 开始渲染
    const objMailSelectData = g_arrMailInfo[this.m_nSelectGrowthIndex];
    this.isHaveGift = Boolean(objMailSelectData.arrGifts.length);
    this.m_labelFrom.getComponent(cc.Label).string = objMailSelectData.strFrom;
    this.m_labelContentString.getComponent(cc.Label).string = objMailSelectData.strContent;
    for (let i = 0; i < objMailSelectData.arrGifts.length; i++) {
      this.createGiftItem(objMailSelectData.arrGifts[i], i);
    }
  }
});
