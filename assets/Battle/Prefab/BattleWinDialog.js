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
let WebApi = require("../Kits/WebApi");

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
    console.log('BattleResultDialog onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('BattleResultDialog onDisable.');
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
      this.onHidePrizeDialog();
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
      this.onHidePrizeDialog();
    });
    this.m_dialog.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_dialog.on('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 关闭对话框
  onHidePrizeDialog: function() {
    console.log('BattleResultDialog onHidePrizeDialog.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-prize-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 物品奖励的内容
  createPrizeLabel: function(objPrize, nCount) {
    console.log('createPrizeLabel', objPrize);
    const node = new cc.Node();
    node.x = 0;
    node.y = -nCount * 40 - 10;
    node.color = GameApi.getPartsInfoColor(objPrize.id);
    const label = node.addComponent(cc.Label);
    label.fontSize = 30;
    if (objPrize.id === '000003') {
      if (objPrize.value < g_objMemberInfo.sportsNumber) {
        label.string = `您的比武排名提升至${objPrize.value}名`;
      } else {
        label.string = `您的比武排名没有变化`;
      }
    } else {
      label.string = `${GameApi.getPartsInfoComplete(objPrize.id).name} ×${objPrize.total}`;
    }
    this.m_rootPrize.addChild(node);
    this.m_dialog.height += 40;
  },
  // 渲染获得奖励的内容
  setItemPrize: function(arrPrize) {
    console.log('setItemPrize', arrPrize);
    for ( let i = 0; i < arrPrize.length; i++) {
      this.createPrizeLabel(arrPrize[i], i);

      // 存入本地结构
      if (arrPrize[i].id === '000000') {
        // 经验
        g_objMemberInfo.exp += arrPrize[i].total;
      } else if (arrPrize[i].id === '000001') {
        // 元宝
        g_objMemberInfo.gold += arrPrize[i].total;
      } else if (arrPrize[i].id === '000002') {
        // 铜钱
        g_objMemberInfo.money += arrPrize[i].total;
      } else if (arrPrize[i].id === '000003') {
        // 比武排名
        g_objMemberInfo.sportsNumber = arrPrize[i].value;
      } else if (GameApi.getPartsInfoType(arrPrize[i].id).nType === 10) {
        // 装备
        const objEquipment = {
          _id: arrPrize[i]._id,
          id: arrPrize[i].id,
          time: arrPrize[i].time,
          level: arrPrize[i].level,
          total: arrPrize[i].total
        }

        // 判断数量 加量还是加项，碎片加量，整件加项。
        let nFind = 0;
        if (parseInt(objEquipment.id) % 10 === 0) {
          nFind = -1;
        } else {
          nFind = g_objBagInfo.equipment.findIndex((item) => { 
            return objEquipment.id === item.id;
          });
        }
        if (nFind !== -1) {
          g_objBagInfo.equipment[nFind].total = g_objBagInfo.equipment[nFind].total + objEquipment.total;
        } else {
          g_objBagInfo.equipment.push(objEquipment);
        }
      } else {
        // 其他

      }
    }

    // 关卡进度
    if (g_nBattleStory === g_objMemberInfo.story) {
      g_objMemberInfo.story++;
    }

    // 刷新关卡进度、经验、铜钱、元宝。
    WebApi.updateMemberInfo(g_objMemberInfo).then((res) => {
      // 本地发消息刷新铜钱元宝
      this.node.dispatchEvent( new cc.Event.EventCustom('refresh-moneyandgold-dlg', true) );
    }).catch((err) => {
      console.log('BattleResultDialog updateMemberInfo fail', err);
    });
    // 配置参数：更新背包列表
    const param = {
      partsInfo: g_objBagInfo.equipment,
      partsType: 'equipment'
    };
    // 服务器更新背包列表
    WebApi.updatePartsInfo(param).then((res) => {
    }).catch((err) => {
      console.log('BattleResultDialog updatePartsInfo Fail.', err);
    });    
  },
});
