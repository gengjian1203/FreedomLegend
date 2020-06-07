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
    // 是否满足可以强化的条件
    this.isGrowthOK = false;
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
    m_labelInnerAttack: {
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
    // 速度
    m_labelSpeed: {
      type: cc.Node,
      default: null
    },
    // 悟性
    m_labelUnderstand: {
      type: cc.Node,
      default: null
    },
    // 需要的材料列表
    // 铜钱节点
    m_rootMoney: {
      type: cc.Node,
      default: null
    },
    // 铜钱
    m_labelMoney: {
      type: cc.Node,
      default: null
    },
    // 碎片节点
    m_rootPart: {
      type: cc.Node,
      default: null
    },
    // 碎片
    m_labelPart: {
      type: cc.Node,
      default: null
    },
    // 器灵节点
    m_rootSoul: {
      type: cc.Node,
      default: null
    },
    // 器灵
    m_labelSoul: {
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

  // 点击强化按钮
  onBtnGrowthClick: function() {
    if (!this.isGrowthOK) {
      console.log('onBtnGrowthClick.');
      return ;
    }

    // 查找到对应装备，并升级
    const objGrowth = this.arrGrowthListObject[this.m_nSelectGrowthIndex];
    const nLevel = objGrowth.level;
    console.log('onBtnGrowthClick', objGrowth, objGrowth._id);
    if (objGrowth.isEquip) {
      // 去身上调整装备等级
      const arrTypeName = ['equipment_hat', 'equipment_shoulder', 'equipment_jacket', 'equipment_weapon', 'equipment_jewelry', 'equipment_shoes', 'null', 'null'];
      // 先获取身上穿着的装备
      const objEquiped = g_objMemberInfo[arrTypeName[GameApi.getPartsInfoType(objGrowth.id).nPosition]];
      if (objEquiped._id === objGrowth._id) {
        g_objMemberInfo[arrTypeName[GameApi.getPartsInfoType(objGrowth.id).nPosition]].level++;
      }
    } else {
      // 去背包调整装备等级
      const nIndex = g_objBagInfo.equipment.findIndex((item) => {
        return item._id === objGrowth._id;
      });
      if (nIndex > -1) {
        g_objBagInfo.equipment[nIndex].level++;
      }
    }

    // 扣除所需的材料
    if (nLevel > 0) {
      const nMoneyNeed = nLevel * 2000;
      g_objMemberInfo.money -= nMoneyNeed;
    } 
    if (nLevel > 10) {
      const nPartNeed = (nLevel - 10) * 2;
      const nIndexSelectPart = g_objBagInfo.equipment.findIndex((item) => {
        return item.id === String(parseInt(objGrowth.id) + 1);
      });
      g_objBagInfo.equipment[nIndexSelectPart].total -= nPartNeed;
      if (g_objBagInfo.equipment[nIndexSelectPart].total <= 0) {
        g_objBagInfo.equipment.splice(nIndexSelectPart, 1);
      }
    }
    // if (nLevel > 20) {
    //   const nSoulNeed = (nLevel - 20) * 2;
    //   const nIndexSelectSoul = g_objBagInfo.consumables.findIndex((item) => {
    //     return item.id === '400000';
    //   });
    //   g_objBagInfo.consumables[nIndexSelectSoul].total -= nPartNeed;
    //   if (g_objBagInfo.consumables[nIndexSelectSoul].total <= 0) {
    //     g_objBagInfo.consumables.splice(nIndexSelectSoul, 1);
    //   }

    //   const paramConsumables = {
    //     partsInfo: g_objBagInfo.consumables,
    //     partsType: 'consumables'
    //   };
    //   // 服务器更新背包列表
    //   WebApi.updatePartsInfo(paramConsumables).then((res) => {
    //   }).catch((err) => {
    //     console.log('onBtnGrowthClick updatePartsInfo Fail.', err);
    //   });
    // }

    // 刷新页面
    // 请空渲染列表
    const tmpSelectGrowthIndex = this.m_nSelectGrowthIndex;
    const tmpSelectTypeIndex = this.m_nSelectTypeIndex;
    this.cleanGrowthList();
    this.m_nSelectGrowthIndex = tmpSelectGrowthIndex;
    this.m_nSelectTypeIndex = tmpSelectTypeIndex;
    this.setGrowthType();
    this.renderGrowthList();
    this.renderGrowthContent();

    // 本地发消息刷新铜钱元宝
    this.node.dispatchEvent( new cc.Event.EventCustom('refresh-moneyandgold-dlg', true) );

    // 服务器通讯
    // 配置参数：更新背包列表
    const paramEquipment = {
      partsInfo: g_objBagInfo.equipment,
      partsType: 'equipment'
    };
    WebApi.updatePartsInfo(paramEquipment).then((res) => {
    }).catch((err) => {
      console.log('onBtnGrowthClick updatePartsInfo Fail.', err);
    });
    // 配置参数：更新人物信息
    const objMemberInfo = GameApi.funComputedMemberInfo(g_objMemberInfo.level);
    g_objMemberInfo = Common.destructuringAssignment(g_objMemberInfo, objMemberInfo);
    const paramMemberInfo = {
      memberInfo: g_objMemberInfo
    };
    WebApi.updateMemberInfo(paramMemberInfo).then((res) => {
      console.log('onBtnGrowthClick updateMemberInfo.success.', res);
    }).catch((err) => {
      console.log('onBtnGrowthClick updateMemberInfo.fail.', err);
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
        item.isEquip = false;
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

    // 渲染物品名称
    const objGrowth = this.arrGrowthListObject[this.m_nSelectGrowthIndex];
    const objGrowthData = GameApi.getPartsInfoComplete(objGrowth.id);
    this.m_labelName.getComponent(cc.Label).string = `${objGrowthData.name}(Lv.${objGrowth.level})` + 
                                                     `${objGrowth.isEquip ? '【已装备】' : ''}`;
    // 渲染物品介绍
    const strContent = `${objGrowthData.introduce}`;
                      //  `${objGrowthData.describe ? ('\n——' + objGrowthData.describe) : ''}`;
    this.m_labelContentString.getComponent(cc.Label).string = strContent;
    // 渲染物品属性变化
    objGrowthData
    // 生命
    this.m_labelHP.getComponent(cc.Label).string = `${objGrowthData.hp + (objGrowth.level - 1) * objGrowthData.hp_up}` + 
                                                   ` => ` + 
                                                   `${objGrowthData.hp + objGrowth.level * objGrowthData.hp_up}`;
    this.m_labelHP.color = objGrowthData.hp_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    // 外功
    this.m_labelOuterAttack.getComponent(cc.Label).string = `${objGrowthData.outerAttack + (objGrowth.level - 1) * objGrowthData.outerAttack_up}` + 
                                                            ` => ` + 
                                                            `${objGrowthData.outerAttack + objGrowth.level * objGrowthData.outerAttack_up}`;
    this.m_labelOuterAttack.color = objGrowthData.outerAttack_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    // 内功
    this.m_labelInnerAttack.getComponent(cc.Label).string = `${objGrowthData.innerAttack + (objGrowth.level - 1) * objGrowthData.innerAttack_up}` + 
                                                            ` => ` + 
                                                            `${objGrowthData.innerAttack + objGrowth.level * objGrowthData.innerAttack_up}`;
    this.m_labelInnerAttack.color = objGrowthData.innerAttack_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    // 外防
    this.m_labelOuterDefense.getComponent(cc.Label).string = `${objGrowthData.outerDefense + (objGrowth.level - 1) * objGrowthData.outerDefense_up}` + 
                                                             ` => ` + 
                                                             `${objGrowthData.outerDefense + objGrowth.level * objGrowthData.outerDefense_up}`;
    this.m_labelOuterDefense.color = objGrowthData.outerDefense_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    // 内防
    this.m_labelInnerDefense.getComponent(cc.Label).string = `${objGrowthData.innerDefense + (objGrowth.level - 1) * objGrowthData.innerDefense_up}` + 
                                                             ` => ` + 
                                                             `${objGrowthData.innerDefense + objGrowth.level * objGrowthData.innerDefense_up}`;
    this.m_labelInnerDefense.color = objGrowthData.innerDefense_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    // 暴击
    this.m_labelCrit.getComponent(cc.Label).string = `${objGrowthData.crit + (objGrowth.level - 1) * objGrowthData.crit_up}` + 
                                                     ` => ` + 
                                                     `${objGrowthData.crit + objGrowth.level * objGrowthData.crit_up}`;
    this.m_labelCrit.color = objGrowthData.crit_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    // 闪避
    this.m_labelDodge.getComponent(cc.Label).string = `${objGrowthData.dodge + (objGrowth.level - 1) * objGrowthData.dodge_up}` + 
                                                      ` => ` + 
                                                      `${objGrowthData.dodge + objGrowth.level * objGrowthData.dodge_up}`;
    this.m_labelDodge.color = objGrowthData.dodge_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    // 速度
    this.m_labelSpeed.getComponent(cc.Label).string = `${objGrowthData.speed + (objGrowth.level - 1) * objGrowthData.speed_up}` + 
                                                      ` => ` + 
                                                      `${objGrowthData.speed + objGrowth.level * objGrowthData.speed_up}`;
    this.m_labelSpeed.color = objGrowthData.speed_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    // 悟性
    this.m_labelUnderstand.getComponent(cc.Label).string = `${objGrowthData.understand + (objGrowth.level - 1) * objGrowthData.understand_up}` + 
                                                           ` => ` + 
                                                           `${objGrowthData.understand + objGrowth.level * objGrowthData.understand_up}`;
    this.m_labelUnderstand.color = objGrowthData.understand_up > 0 ? cc.color(0, 255, 0) : cc.color(255, 255, 255);
    
    // 渲染物品升级需要材料
    let bMoneyOK = false;
    let bPartOK = false;
    let bSoulOK = true;
    // 铜钱校验
    if (objGrowth.level > 0) {
      this.m_rootMoney.active = true;
      const nMoneyNeed = objGrowth.level * 2000;
      this.m_labelMoney.getComponent(cc.Label).string = `${GameApi.formatLargeNumber(g_objMemberInfo.money)}/${GameApi.formatLargeNumber(nMoneyNeed)}`;
      if (g_objMemberInfo.money >= nMoneyNeed) {
        this.m_labelMoney.color = cc.color(255, 255, 255);
        bMoneyOK = true;
      } else {
        this.m_labelMoney.color = cc.color(255, 0, 0);
        bMoneyOK = false;
      }
    } else {
      this.m_rootMoney.active = false;
      bMoneyOK = true;
    }
    // 碎片校验
    if (objGrowth.level > 10) {
      this.m_rootPart.active = true;
      const nIndexSelectPart = g_objBagInfo.equipment.findIndex((item) => {
        return item.id === String(parseInt(objGrowth.id) + 1);
      });
      const nPartTotal = nIndexSelectPart > -1 ? g_objBagInfo.equipment[nIndexSelectPart].total : 0;
      const nPartNeed = (objGrowth.level - 10) * 2;
      this.m_labelPart.getComponent(cc.Label).string = `${GameApi.formatLargeNumber(nPartTotal)}/${GameApi.formatLargeNumber(nPartNeed)}`;  
      if (nPartTotal >= nPartNeed) {
        this.m_labelPart.color = cc.color(255, 255, 255);
        bPartOK = true;
      } else {
        this.m_labelPart.color = cc.color(255, 0, 0);
        bPartOK = false;
      }
    } else {
      this.m_rootPart.active = false;
      bPartOK = true;
    }
    // 器灵校验
    this.m_rootSoul.active = false;
    // if (objGrowth.level > 20) {
    //   this.m_rootSoul.active = true;
    //   const nSoulNeed = (objGrowth.level - 20) * 2;
    //   this.m_labelSoul.getComponent(cc.Label).string = `${GameApi.formatLargeNumber(0)}/${GameApi.formatLargeNumber(nSoulNeed)}`;
    //   if (0 >= nSoulNeed) {
    //     this.m_labelSoul.color = cc.color(255, 255, 255);
    //     bSoulOK = true;
    //   } else {
    //     this.m_labelSoul.color = cc.color(255, 0, 0);
    //     bSoulOK = false;
    //   }
    // } else {
    //   this.m_rootSoul.active = false;
    //   bSoulOK = true;
    // }

    // 最后决定是否可以强化
    this.isGrowthOK = bMoneyOK && bPartOK && bSoulOK;  
  }
});
