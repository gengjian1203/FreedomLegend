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
    // 这件物品的类型
    this.m_objIntroduceType = {};
    // 气泡对话框
    this.m_dlgTip = null;
    // 按钮锁
    this.bLockButton = false;
  },

  properties: {
    // 预制体 - 气泡弹窗
    m_prefabTip: {
      type: cc.Prefab,
      default: null
    },
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
    // 物品名称
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 物品介绍
    m_labelIntroduce: {
      type: cc.Node,
      default: null
    },
    // 物品引言
    m_labelDescribe: {
      type: cc.Node,
      default: null
    },
    // 物品属性
    m_rootAttribute: {
      type: cc.Node,
      default: null
    },
    // 使用按钮
    m_labelUse: {
      type: cc.Node,
      default: null
    },
    // 丢弃按钮
    m_labelGiveup: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
  },

  onEnable () {
    console.log('IntroduceDialog onEvable.');
    this.node.on('hide-toast-dlg', this.onHideToastDlg, this);
    this.registerEvent();
  },

  onDisable () {
    console.log('IntroduceDialog onDisable.');
    this.node.off('hide-toast-dlg', this.onHideToastDlg, this);
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
      this.onHideIntroduceDialog();
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
      this.onHideIntroduceDialog();
    });
    this.m_dialog.on('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_dialog.on('touchend', (event) => {
      event.stopPropagation();
    });
  },

  // 关闭对话框
  onHideIntroduceDialog: function() {
    console.log('IntroduceDialog onHideIntroduceDialog.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-introduce-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 点击使用按钮
  onBtnUseClick: function(e, param) {
    console.log('IntroduceDialog onBtnUseClick');
    
    this.onHideIntroduceDialog();
  },

  // 点击丢弃按钮
  onBtnGiveupClick: function(e, param) {
    console.log('IntroduceDialog onBtnGiveupClick');
    
    this.onHideIntroduceDialog();
  },

  // 隐藏气泡弹窗
  onHideToastDlg: function() {
    console.log('IntroduceDialog onHideToastDlg');
    this.bLockButton = false;
  },

  // // 显示气泡对话框 
  // showToastDlg: function(strMsg) {
  //   this.m_dlgToast = cc.instantiate(this.m_prefabToast);
  //   this.m_dlgToast.getComponent('ToastDialog').setToastContent(strMsg);
  //   this.node.addChild(this.m_dlgToast);
  // },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 创建物品属性标签
  createAttributeLabel: function(strAttr, nCount) {
    const node = new cc.Node();
    node.x = 0;
    node.y = nCount === -1 ? 0 : -nCount * 40 - 10;
    const label = node.addComponent(cc.Label);
    label.fontSize = 30;
    label.string = strAttr;
    this.m_rootAttribute.addChild(node);
    this.m_dialog.height += 40;
  },

  // 渲染物品属性的内容（整件物品才会有属性）
  setItemAttribute: function(objBagListItemComplete) {
    let nCount = 0;
    if (this.m_objIntroduceType.nComplete === 0) {
      // 生命
      const nHp = objBagListItemComplete.hp + objBagListItemComplete.hp_up * (objBagListItemComplete.level - 1);
      if (nHp > 0) {
        nCount++;
        const strAttr = `生命 + ${nHp}`;
        this.createAttributeLabel(strAttr, nCount);
      }
      // 外功
      const nOuterAttack = objBagListItemComplete.outerAttack + objBagListItemComplete.outerAttack_up * (objBagListItemComplete.level - 1);
      if (nOuterAttack > 0) {
        nCount++;
        const strAttr = `外功 + ${nOuterAttack}`;
        this.createAttributeLabel(strAttr, nCount);
      }
      // 内功
      const nInnerAttack = objBagListItemComplete.innerAttack + objBagListItemComplete.innerAttack_up * (objBagListItemComplete.level - 1);
      if (nInnerAttack > 0) {
        nCount++;
        const strAttr = `内功 + ${nInnerAttack}`;
        this.createAttributeLabel(strAttr, nCount);
      }
      // 外防
      const nOuterDefense = objBagListItemComplete.outerDefense + objBagListItemComplete.outerDefense_up * (objBagListItemComplete.level - 1);
      if (nOuterDefense > 0) {
        nCount++;
        const strAttr = `外防 + ${nOuterDefense}`;
        this.createAttributeLabel(strAttr, nCount);
      }
      // 内防
      const nInnerDefense = objBagListItemComplete.innerDefense + objBagListItemComplete.innerDefense_up * (objBagListItemComplete.level - 1);
      if (nInnerDefense > 0) {
        nCount++;
        const strAttr = `外防 + ${nInnerDefense}`;
        this.createAttributeLabel(strAttr, nCount);
      }
      // 暴击
      const nCrit = objBagListItemComplete.crit + objBagListItemComplete.crit_up * (objBagListItemComplete.level - 1);
      if (nCrit > 0) {
        nCount++;
        const strAttr = `暴击 + ${nCrit}`;
        this.createAttributeLabel(strAttr, nCount);
      }
      // 闪避
      const nDodge = objBagListItemComplete.dodge + objBagListItemComplete.dodge_up * (objBagListItemComplete.level - 1);
      if (nDodge > 0) {
        nCount++;
        const strAttr = `闪避 + ${nDodge}`;
        this.createAttributeLabel(strAttr, nCount);
      }
      // 速度
      const nSpeed = objBagListItemComplete.speed + objBagListItemComplete.speed_up * (objBagListItemComplete.level - 1);
      if (nSpeed > 0) {
        nCount++;
        const strAttr = `速度 + ${nSpeed}`;
        this.createAttributeLabel(strAttr, nCount);
      }
      // 悟性
      const nUnderstand = objBagListItemComplete.understand + objBagListItemComplete.understand_up * (objBagListItemComplete.level - 1);
      if (nUnderstand > 0) {
        nCount++;
        const strAttr = `悟性 + ${nUnderstand}`;
        this.createAttributeLabel(strAttr, nCount);
      }

      // 是否显示属性
      if (nCount > 0) {
        const nNum = -1;
        const strAttr = `【属性】`;
        this.createAttributeLabel(strAttr, nNum);
      }
    }
  },

  // 渲染该介绍的物品类型
  setItemType: function(objBagListItemComplete) {
    this.m_objIntroduceType = GameApi.getPartsInfoType(objBagListItemComplete.id);
    console.log('IntroduceDialog setItemType m_objIntroduceType', this.m_objIntroduceType);
    switch(this.m_objIntroduceType.nType) {
      // 装备
      case 10: 
        if (this.m_objIntroduceType.nComplete === 0) {
          this.m_labelUse.getComponent(cc.Label).string = '装备';
        } else {
          this.m_labelUse.getComponent(cc.Label).string = '合成';
        }
        break;
      // 其他
      default:
        break;
    }
  },

  // 渲染物品基本信息的内容
  setItemIntroduce: function(objBagListItemComplete) {
    console.log('IntroduceDialog setItemIntroduce', objBagListItemComplete);
    // 解析该介绍的物品类型
    this.setItemType(objBagListItemComplete);

    const strLevel = (this.m_objIntroduceType.nComplete === 0) ? `(Lv.${objBagListItemComplete.level})` : ``;
    // 物品名称
    this.m_labelName.getComponent(cc.Label).string = `${objBagListItemComplete.name}${strLevel}`;
    this.m_labelName.color = GameApi.getPartsInfoColor(objBagListItemComplete.id);
    // 物品介绍
    this.m_labelIntroduce.getComponent(cc.Label).string = objBagListItemComplete.introduce ? objBagListItemComplete.introduce : '';
    // 物品引言
    this.m_labelDescribe.getComponent(cc.Label).string = objBagListItemComplete.describe ? objBagListItemComplete.describe: '';
    // 物品属性
    this.setItemAttribute(objBagListItemComplete);
  }
});
