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
    // 气泡对话框
    this.m_dlgToast = null;
    // 购买结果
    this.m_dlgPrize = null;
    // 按钮锁
    this.bLockButton = false;

    // 免费铜钱/元宝 剩余时间计时基数
    this.m_nLimitTimeTotal = 300; //   300s  5分钟
    this.m_timeLimitMoney = 999999;
    this.m_timeLimitGold = 999999;
    // 刷新计时器
    this.m_handleTimerLimitMoneyAndGold = null;
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
    // 免费铜钱提示标签
    m_labelFreeMoney: {
      type: cc.Node,
      default: null
    },
    // 免费元宝提示标签
    m_labelFreeGold: {
      type: cc.Node,
      default: null
    },
    // 装备单独的图片精灵
    m_sprEquipOnceBK: {
      type: cc.Node,
      default: null
    },
    // 装备十连的图片精灵
    m_sprEquipTenBK: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
  },

  onEnable () {
    console.log('ShopDialog onEvable.');
    // 计算免费收益的冷却时间
    this.funComputedLimitTime();

    // 注册事件
    this.node.on('hide-prize-dlg', this.onHidePrizeDlg, this);
    this.registerEvent();
  },

  onDisable () {
    console.log('ShopDialog onDisable.');
    // 注销定时器
    if (this.m_handleTimerLimitMoneyAndGold) {
      clearInterval(this.m_handleTimerLimitMoneyAndGold);
      this.m_handleTimerLimitMoneyAndGold = null;
    }

    // 注销事件
    this.node.off('hide-prize-dlg', this.onHidePrizeDlg, this);
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////  
  // 注册事件
  registerEvent: function() {
    // 切后台
    cc.game.on(cc.game.EVENT_HIDE, () => {  
      console.log('ShopDialog registerEvent EVENT_HIDE');
    });  
    // 切前台
    cc.game.on(cc.game.EVENT_SHOW, () => {
      console.log('ShopDialog registerEvent EVENT_SHOW');
      this.funComputedLimitTime()
    });
    this.m_mask.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_mask.on('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 注销事件
  CancelEvent: function() {
    // 切后台
    cc.game.off(cc.game.EVENT_HIDE, () => {  
      console.log('ShopDialog registerEvent EVENT_HIDE');
    });  
    // 切前台
    cc.game.off(cc.game.EVENT_SHOW, () => {
      console.log('ShopDialog registerEvent EVENT_SHOW');
      this.funComputedLimitTime()
    });
    this.m_mask.off('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_mask.off('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 奖励弹窗
  onHidePrizeDlg: function() {
    console.log('ShopDialog onHidePrizeDlg.');
    this.bLockButton = false;
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
    if (this.bLockButton || (this.m_timeLimitMoney < this.m_nLimitTimeTotal)) {
      return;
    }
    this.bLockButton = true;
    const arrMoney = [188, 988, 3888, 5888, 18888];
    const nRandom = Math.floor(Math.random() * 5);

    const arrPrize = [{
      id: '000002',
      total: arrMoney[nRandom]
    }];
    this.onShowPrizeDlg(arrPrize);

    cc.sys.localStorage.setItem('time-limit-money', new Date().getTime());
    this.funComputedLimitTime();
  },

  // 免费获取元宝
  onBtnFreeGold: function() {
    console.log('ShopDialog onBtnFreeGold');
    if (this.bLockButton || (this.m_timeLimitGold < this.m_nLimitTimeTotal)) {
      return;
    }
    this.bLockButton = true;
    const arrGold = [6, 98, 188, 348, 648];
    const nRandom = Math.floor(Math.random() * 5);

    const arrPrize = [{
      id: '000001',
      total: arrGold[nRandom]
    }];
    this.onShowPrizeDlg(arrPrize);

    cc.sys.localStorage.setItem('time-limit-gold', new Date().getTime());
    this.funComputedLimitTime();
  },

  // 抽取装备
  onBtnBuyEquipment: function(event, param) {
    console.log('ShopDialog onBtnBuyEquipment', param);
    if (this.bLockButton) {
      return;
    }
    this.bLockButton = true;
    const nCount = parseInt(param);
    let nNeedGold = 0;
    if (nCount === 1) {
      // 单抽
      nNeedGold = 300;
      this.m_sprEquipOnceBK.getComponent(cc.Animation).play('shaking');
    } else if (nCount === 10) {
      // 十连
      nNeedGold = 2800;
      this.m_sprEquipTenBK.getComponent(cc.Animation).play('shaking');
    } else {
      nNeedGold = 99999999999;
    }

    if (g_objMemberInfo.gold < nNeedGold) {
      this.showToastDlg('抱歉，您的元宝不足。');
      this.bLockButton = false;
    } else {
      // 抽取装备
      const param = {
        type: 'box',
        count: parseInt(nCount)
      };
      WebApi.createRewards(param).then((res) => {
        // 扣除元宝
        g_objMemberInfo.gold -= nNeedGold;
        this.onShowPrizeDlg(res.prize);
        // 停止动画，回归原位
        setTimeout(() => {
          this.m_sprEquipOnceBK.getComponent(cc.Animation).stop('shaking');
          this.m_sprEquipTenBK.getComponent(cc.Animation).stop('shaking');
          this.m_sprEquipOnceBK.setRotation(0);
          this.m_sprEquipTenBK.setRotation(0);
        }, 500);
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

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 检验限制时间
  checkLimitTime: function() {
    // 减少铜钱冷却时间
    if (this.m_timeLimitMoney < this.m_nLimitTimeTotal) {
      this.m_timeLimitMoney++;
      this.m_labelFreeMoney.getComponent(cc.Label).string = `剩余${Common.formatDate(this.m_nLimitTimeTotal - this.m_timeLimitMoney)}`;
    } else {
      this.m_labelFreeMoney.getComponent(cc.Label).string = `免费铜钱`;
    }
    // 减少元宝冷却时间
    if (this.m_timeLimitGold < this.m_nLimitTimeTotal) {
      this.m_timeLimitGold++;
      this.m_labelFreeGold.getComponent(cc.Label).string = `剩余${Common.formatDate(this.m_nLimitTimeTotal - this.m_timeLimitGold)}`;
    } else {
      this.m_labelFreeGold.getComponent(cc.Label).string = `免费元宝`;
    }
    // 关闭定时器
    if ((this.m_timeLimitMoney >= this.m_nLimitTimeTotal) && (this.m_timeLimitGold >= this.m_nLimitTimeTotal)) {
      clearInterval(this.m_handleTimerLimitMoneyAndGold);
      this.m_handleTimerLimitMoneyAndGold = null;
    }
  },

  // 计算免费收益的冷却时间
  funComputedLimitTime: function() {
    // 获取操作的时间戳
    const nNowTime = new Date().getTime();
    const limitMoney = cc.sys.localStorage.getItem('time-limit-money');
    if (limitMoney) {
      this.m_timeLimitMoney = Math.floor((nNowTime - limitMoney) / 1000);
    }
    const limitGold = cc.sys.localStorage.getItem('time-limit-gold');
    if (limitGold) {
      this.m_timeLimitGold = Math.floor((nNowTime - limitGold) / 1000);
    }
    console.log('ShopDialog funComputedLimitTime', this.m_timeLimitMoney, this.m_timeLimitGold);

    // 启动定时器
    if ((this.m_timeLimitMoney < this.m_nLimitTimeTotal) || (this.m_timeLimitGold < this.m_nLimitTimeTotal)) {
      if (this.m_handleTimerLimitMoneyAndGold) {
        clearInterval(this.m_handleTimerLimitMoneyAndGold);
        this.m_handleTimerLimitMoneyAndGold = null;
      }
      this.checkLimitTime();
      this.m_handleTimerLimitMoneyAndGold = setInterval(() => {
        this.checkLimitTime();
      }, 1000);
    }
  },

  // 显示气泡对话框 
  showToastDlg: function(strMsg) {
    this.m_dlgToast = cc.instantiate(this.m_prefabToast);
    this.m_dlgToast.getComponent('ToastDialog').setToastContent(strMsg);
    this.node.addChild(this.m_dlgToast);
  },
});
