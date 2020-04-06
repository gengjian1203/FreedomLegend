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
let GameApi = require("../Kits/GameApi");

cc.Class({
  extends: cc.Component,

  ctor() {
    // 气泡对话框
    this.m_dlgToast = null;
    // 购买结果
    this.m_dlgPrize = null;
  },

  properties: {
    // 预制体 - 气泡弹窗
    m_prefabToast: {
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
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
  },

  onEnable () {
    console.log('ShopDialog onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('ShopDialog onDisable.');
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
    console.log('ShopDialog onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-shop-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 免费获取铜钱
  onBtnFreeMoney: function() {
    console.log('ShopDialog onBtnFreeMoney');
    console.log('ShopDialog onBtnFreeGold');
    const arrMoney = [188, 988, 3888, 5888, 18888];
    const nRandom = Math.floor(Math.random() * 5);

    g_objMemberInfo.money += arrMoney[nRandom];
    const objMemberInfo = {
      money: g_objMemberInfo.money
    };
    WebApi.updateMemberInfo(objMemberInfo).then((res) => {
      this.node.dispatchEvent( new cc.Event.EventCustom('refresh-moneyandgold-dlg', true) );
      const arrPrize = [{
        id: '000000',
        name: '铜钱',
        total: arrMoney[nRandom]
      }];
      this.onShowPrizeDlg(arrPrize);
    }).catch((err) => {
      console.log('ShopDialog onBtnFreeMoney fail', err);
    });
  },

  // 免费获取元宝
  onBtnFreeGold: function() {
    console.log('ShopDialog onBtnFreeGold');
    const arrGold = [6, 98, 188, 348, 648];
    const nRandom = Math.floor(Math.random() * 5);

    g_objMemberInfo.gold += arrGold[nRandom];
    const objMemberInfo = {
      gold: g_objMemberInfo.gold
    };
    WebApi.updateMemberInfo(objMemberInfo).then((res) => {
      this.node.dispatchEvent( new cc.Event.EventCustom('refresh-moneyandgold-dlg', true) );
      const arrPrize = [{
        id: '000000',
        name: '元宝',
        total: arrGold[nRandom]
      }];
      this.onShowPrizeDlg(arrPrize);
    }).catch((err) => {
      console.log('ShopDialog onBtnFreeGold fail', err);
    });
  },

  // 抽取装备
  onBtnBuyEquipment: function(event, param) {
    console.log('ShopDialog onBtnBuyEquipment', param);
    const nCount = parseInt(param);
    const nNeedGold = nCount === 1 ? 300 : 2800;
    if (g_objMemberInfo.gold < nNeedGold) {
      this.showToastDlg('抱歉，您的元宝不足。');
    } else {
      // 抽取装备
      const param = {
        type: 'box',
        count: parseInt(nCount)
      };
      WebApi.createRewards(param).then((res) => {
        this.onShowPrizeDlg(res.prize);

        // 扣除元宝
        g_objMemberInfo.gold -= nNeedGold;
        const objMemberInfo = {
          gold: g_objMemberInfo.gold
        };
        WebApi.updateMemberInfo(objMemberInfo).then((res) => {
          this.node.dispatchEvent( new cc.Event.EventCustom('refresh-moneyandgold-dlg', true) );
        }).catch((err) => {
          console.log('ShopDialog updateMemberInfo fail', err);
        });
        
      }).catch((err) => {
        console.log('ShopDialog updateMemberInfo fail', err);
      });
      
    }
  },

  // 显示奖励弹窗
  onShowPrizeDlg: function(arrPrize) {
    this.m_dlgPrize = cc.instantiate(this.m_prefabPrize);
    this.m_dlgPrize.getComponent('PrizeDialog').setItemPrize(arrPrize);
    this.node.addChild(this.m_dlgPrize);
  },

  // // 隐藏介绍弹窗
  // onHideIntroduceDlg: function() {
  //   console.log('BagDialog onHideIntroduceDlg');
    
  // },
  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 显示气泡对话框 
  showToastDlg: function(strMsg) {
    this.m_dlgToast = cc.instantiate(this.m_prefabToast);
    this.m_dlgToast.getComponent('ToastDialog').setToastContent(strMsg);
    this.node.addChild(this.m_dlgToast);
  },
});
