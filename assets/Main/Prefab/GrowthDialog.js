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
    this.m_nSelectGrowthIndex = 0;
    // 所属种类的数组列表
    this.arrGrowthListObject = [];
    // 所属种类的数组列表承装节点的
    this.arrGrowthListChild = [];
  },

  properties: {
    // 预制体 - List项Item
    m_prefabGrowthListItem: {
      type: cc.Prefab,
      default: null
    },
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
    this.cleanGrowthList();
    this.setGrowthType();
    this.renderGrowthList();
    this.renderGrowthContent();
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
    this.cleanGrowthList();
    this.m_nSelectTypeIndex = parseInt(param);
    this.setGrowthType();
    this.renderGrowthList();
    this.renderGrowthContent();
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
    //   this.renderGrowthList();
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
    this.renderGrowthListItemColor();
    this.renderGrowthContent();
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 清空渲染列表
  cleanGrowthList: function() {
    // 当前选中的类型序号
    this.m_nSelectTypeIndex = 0;
    // 当前选中的物品序号
    this.m_nSelectGrowthIndex = 0;
    // 请空渲染列表
    this.arrGrowthListObject = [];
    this.arrGrowthListChild = [];
    // 
    this.m_growthList.height = 0;
    this.m_growthList.removeAllChildren();
  },
  
  // 渲染强化种类按钮的颜色
  setGrowthTypeButtonColor: function() {
    // 按钮置为红色
    this.m_arrGrowthTypeLabelList.forEach((item, index) => {
      if (this.m_nSelectTypeIndex === index) {
        item.color = cc.color(255, 0, 0);
      } else {
        item.color = cc.color(255, 255, 255);
      }
    });
  },

  // 渲染强化种类 
  setGrowthType: function() {
    console.log('GrowthDialog setGrowthType', this.m_nSelectTypeIndex);
    this.setGrowthTypeButtonColor();
    const arrTypeName = ['equipment_hat', 'equipment_shoulder', 'equipment_jacket', 'equipment_weapon', 'equipment_jewelry', 'equipment_shoes', 'null', 'null'];
    // 先获取身上穿着的装备
    const objEquiped = g_objMemberInfo[arrTypeName[this.m_nSelectTypeIndex]];
    if (objEquiped && !Common.isObjectEmpty(objEquiped)) {
      objEquiped.isEquip = true;
      this.arrGrowthListObject.push(objEquiped);
    }
    // 再获取背包中的物品(同样位置的装备且为完整的)
    for (let item of g_objBagInfo.equipment) {
      const objInfo = GameApi.getPartsInfoType(item.id);
      if (objInfo.nPosition === this.m_nSelectTypeIndex && objInfo.nComplete === 0) {
        this.arrGrowthListObject.push(item);
      }
    }
    // 输出该类型的装备
    console.log('GrowthDialog setGrowthType', this.arrGrowthListObject);
  },

  // 创建一个强化装备item
  createGrowthListItem: function(objGrowth, index) {
    console.log('createGrowthListItem', objGrowth, index);
    let item = null;
    item = cc.instantiate(this.m_prefabGrowthListItem);
    item.getComponent('GrowthListItem').setGrowthListItemData(index, objGrowth);
    item.x = 0;
    item.y = -(index + 1) * 84;

    this.arrGrowthListChild.push(item);
    this.m_growthList.height += 84;
    this.m_growthList.addChild(item);
  },

  // 渲染强化装备item的颜色 
  renderGrowthListItemColor: function() {
    this.arrGrowthListChild.forEach((item, index) => {
      item.getComponent('GrowthListItem').setGrowthListItemColor(index === this.m_nSelectGrowthIndex);
    });
  },

  // 渲染强化物品列表
  renderGrowthList: function() {
    console.log('GrowthDialog renderGrowthList');
    // 渲染列表
    this.arrGrowthListObject.forEach((item, index) => {
      this.createGrowthListItem(item, index);
    });
    // 渲染颜色
    this.renderGrowthListItemColor();
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
  renderGrowthContent: function() {
    console.log('GrowthDialog setGrowthContent', this.m_nSelectGrowthIndex);
    // 判断参数是否合法
    if (this.m_nSelectGrowthIndex >= this.arrGrowthListObject.length) {
      console.log('GrowthDialog Empty.');
      this.m_growthContent.active = false;
      this.m_sprEmptyTip.active = true;
      return ;
    }
    this.m_growthContent.active = true;
    this.m_sprEmptyTip.active = false;
    
    // 清空材料列表
    this.m_rootMaterial.height = 0;
    this.m_rootMaterial.removeAllChildren();

    // 渲染物品名称
    const objGrowth = this.arrGrowthListObject[this.m_nSelectGrowthIndex];
    const objGrowthData = GameApi.getPartsInfoComplete(objGrowth.id);
    this.m_labelName.getComponent(cc.Label).string = `${objGrowthData.name}(Lv.${objGrowth.level})`;
    // 渲染物品介绍
    this.m_labelContentString.getComponent(cc.Label).string = objGrowthData.introduce;
    // 渲染物品引言
    // this.m_labelName.getComponent(cc.Label).string = objGrowthData.name;
    // this.m_labelContentString.getComponent(cc.Label).string = objGrowthData.introduce;
    // if (objGrowthData.describe) {
    //   this.m_labelContentString.getComponent(cc.Label).string += `\n${objGrowthData.describe}`
    // }
    // this.isHaveGift = Boolean(objMailSelectData.arrGifts.length);
    // this.m_labelFrom.getComponent(cc.Label).string = objMailSelectData.strFrom;
    // this.m_labelContentString.getComponent(cc.Label).string = objMailSelectData.strContent;
    // for (let i = 0; i < objMailSelectData.arrGifts.length; i++) {
    //   this.createGiftItem(objMailSelectData.arrGifts[i], i);
    // }
  }
});
