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
  },

  properties: {
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 对话框节点
    m_dialog: {
      type: cc.Node,
      default: null
    },
    // 物品属性
    m_rootPrize: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
  },

  onEnable () {
    console.log('ShopResultDialog onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('ShopResultDialog onDisable.');
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
      this.onHideShopResultDialog();
    });
    this.m_dialog.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_dialog.on('touchend', (event) => {
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
      this.onHideShopResultDialog();
    });
    this.m_dialog.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_dialog.on('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 关闭对话框
  onHideShopResultDialog: function() {
    console.log('ShopResultDialog onHideShopResultDialog.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-shop-result-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 物品奖励的内容
  createPrizeLabel: function(objPrize, nCount) {
    const node = new cc.Node();
    node.x = 0;
    node.y = -nCount * 40 - 10;
    node.color = GameApi.getPartsInfoColor(objPrize.id);
    const label = node.addComponent(cc.Label);
    label.fontSize = 30;
    label.string = `${GameApi.getPartsInfoComplete(objPrize.id).name} ×${objPrize.total}`;
    this.m_rootPrize.addChild(node);
    this.m_dialog.height += 40;
  },

  // 渲染获得奖励的内容
  setItemPrize: function(arrPrize) {
    for ( let i = 0; i < arrPrize.length; i++) {
      this.createPrizeLabel(arrPrize[i], i);

      if (arrPrize[i].id === '000000') {
        // 铜钱
        g_objMemberInfo.money += arrPrize[i].total;

      } else if (arrPrize[i].id === '000001') {
        // 元宝
        g_objMemberInfo.gold += arrPrize[i].total;

      } else if (GameApi.getPartsInfoType(arrPrize[i].id).nType === 10) {
        // 装备
        const objEquipment = {
          _id: arrPrize[i]._id,
          id: arrPrize[i].id,
          time: arrPrize[i].time,
          level: arrPrize[i].level,
          total: arrPrize[i].total
        }
        g_objBagInfo.equipment.push(objEquipment);

      } else {
        // 其他

      }
    }
  },
});
