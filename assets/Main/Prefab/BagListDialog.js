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
    // 背包tab类型
    this.arrType = ['all', 'equip', 'medicine', 'other'];
    // 介绍对话框
    this.m_dlgIntroduce = null;
    // 按钮锁
    this.bLockButton = false;
    // 当前选中的按钮序号
    this.m_nSelectIndex = -1;
  },

  properties: {
    // 预制体 - List项Item
    m_prefabBagListItem: {
      type: cc.Prefab,
      default: null
    },
    // 预制体 - List项Item的介绍对话框
    m_prefabIntroduce: {
      type: cc.Prefab,
      default: null
    },
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    }, 
    // 全部按钮文字
    m_labelTabAll: {
      type: cc.Node,
      default: null
    },
    // 全部按钮装备
    m_labelTabEquipment: {
      type: cc.Node,
      default: null
    },
    // 全部按钮丹药
    m_labelTabMedicine: {
      type: cc.Node,
      default: null
    },
    // 全部按钮其他
    m_labelTabOther: {
      type: cc.Node,
      default: null
    },
    // 背包列表节点
    m_bagList: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    this.queryBagListInfo(0);
  },

  onEnable () {
    console.log('BagDialog onEvable.');
    this.node.on('show-introduce-dlg', this.onShowIntroduceDlg, this);
    this.node.on('hide-introduce-dlg', this.onHideIntroduceDlg, this);
    this.registerEvent();
  },

  onDisable () {
    console.log('BagDialog onDisable.');
    this.node.off('show-introduce-dlg', this.onShowIntroduceDlg, this);
    this.node.off('hide-introduce-dlg', this.onHideIntroduceDlg, this);
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

  // 关闭对话框
  onBtnOKClick: function() {
    console.log('BagDialog onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-bag-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 筛选背包-全部按钮
  onBtnTabSwitchClick: function(e, param) {
    console.log('BagDialog onBtnTabSwitchClick');
    this.queryBagListInfo(parseInt(param));
  },

  // 显示介绍弹窗
  onShowIntroduceDlg: function(event) {
    console.log('BagDialog onShowIntroduceDlg', event, event.getUserData());
    const objBagListItemComplete = event.getUserData();
    this.m_dlgIntroduce = cc.instantiate(this.m_prefabIntroduce);
    this.m_dlgIntroduce.getComponent('BagIntroduceDialog').setItemIntroduce(objBagListItemComplete);
    this.node.addChild(this.m_dlgIntroduce);
  },

  // 隐藏介绍弹窗
  onHideIntroduceDlg: function() {
    console.log('BagDialog onHideIntroduceDlg');
    this.bLockButton = false;
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 改变按钮颜色
  switchButtonColor: function(index) {
    const colorMain = new cc.color(255, 0, 0, 255);
    const colorDesc = new cc.color(255, 255, 255, 255);
    
    this.m_labelTabAll.color = index === 0 ? colorMain : colorDesc;
    this.m_labelTabEquipment.color = index === 1 ? colorMain : colorDesc;
    this.m_labelTabMedicine.color = index === 2 ? colorMain : colorDesc;
    this.m_labelTabOther.color = index === 3 ? colorMain : colorDesc;
    
  },

  // 创建一个预制体item
  createBagListItem: function(objItem, index) {
    let item = null;
    item = cc.instantiate(this.m_prefabBagListItem);
    item.getComponent('BagListItem').setBagListItemData(objItem);
    item.x = 0;
    item.y = -(index + 1) * 80;
    this.m_bagList.addChild(item);
  },

  // 背包排序
  sortBagListInfo: function(arrPartInfo) {
    arrPartInfo.sort((infoA, infoB) => {
      return infoB.id - infoA.id;
    })
  },

  // 查询背包列表内容
  queryBagListInfo: function(index) {
    if (this.m_nSelectIndex === index) {
      return ;
    }
    this.m_nSelectIndex = index;
    // 改变按钮颜色
    this.switchButtonColor(index);

    console.log('BagDialog queryBagListInfo', index);
    const param = {
      type: this.arrType[parseInt(index)]
    }
    // 清空列表
    this.m_bagList.removeAllChildren();
    // 查询背包并且渲染
    WebApi.queryPartsInfo(param).then((res) => {
      console.log('BagDialog queryPartsInfo Success.', res);
      // 排序
      this.sortBagListInfo(res.partsInfo);
      // 渲染
      res.partsInfo.forEach((item, index) => {
        this.createBagListItem(item, index);
      });
      this.m_bagList.height = 80 * res.partsInfo.length;
    }).catch((err) => {
      console.log('BagDialog queryPartsInfo Fail.', err);
    });
  },

});
