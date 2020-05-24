// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let AuthApi = require("../Kits/AuthApi");
let Common = require("../Kits/Common");
let WebApi = require("../Kits/WebApi");
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
    //////////////////////////////////////////////////
    // 状态栏
    //////////////////////////////////////////////////
    // 昵称
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // ID
    m_labelID: {
      type: cc.Node,
      default: null
    },
    // 称号
    m_labelTitle: {
      type: cc.Node,
      default: null
    },
    // 等级
    m_labelTaste: {
      type: cc.Node,
      default: null
    },
    // 经验
    m_labelExp: {
      type: cc.Node,
      default: null
    },
    // 描述
    m_labelDescribe: {
      type: cc.Node,
      default: null
    },
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
    m_labelinnerAttack: {
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
    // 幸运
    m_labelUnderstand: {
      type: cc.Node,
      default: null
    },
    //////////////////////////////////////////////////
    // 装备栏
    //////////////////////////////////////////////////
    // 头戴
    m_labelHat: {
      type: cc.Node,
      default: null
    },
    // 卸下帽子按钮
    m_btnHatTakeoff: {
      type: cc.Node,
      default: null
    },
    // 肩披
    m_labelShoulder: {
      type: cc.Node,
      default: null
    },
    // 卸下肩甲按钮
    m_btnShoulderTakeoff: {
      type: cc.Node,
      default: null
    },
    // 身穿
    m_labelJacket: {
      type: cc.Node,
      default: null
    },
    // 卸下上衣按钮
    m_btnJacketTakeoff: {
      type: cc.Node,
      default: null
    },
    // 手持
    m_labelWeapon: {
      type: cc.Node,
      default: null
    },
    // 卸下武器按钮
    m_btnWeaponTakeoff: {
      type: cc.Node,
      default: null
    },
    // 腰悬
    m_labelJewelry: {
      type: cc.Node,
      default: null
    },
    // 卸下腰饰按钮
    m_btnJewelryTakeoff: {
      type: cc.Node,
      default: null
    },
    // 足踏
    m_labelShoes: {
      type: cc.Node,
      default: null
    },
    // 卸下鞋子按钮
    m_btnShoesTakeoff: {
      type: cc.Node,
      default: null
    },
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    this.setMemberInfo();
  },

  onEnable () {
    console.log('MemberDialog onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('MemberDialog onDisable.');
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////
  // 关闭对话框
  onBtnOKClick: function() {
    console.log('MemberDialog onBtnOKClick.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-member-dlg', true) );
    this.node.active = false;
    this.node.removeFromParent();
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

  // 点击复制按钮，复制自身ID
  onBtnCopyClick: function() {
    AuthApi.setClipboardData(g_objMemberInfo._id);
  },

  // 点击卸下按钮，卸下装备
  onBtnTakeOffClick: function(e, param) {
    console.log('MemberDialog onBtnTakeOffClick', param);
    const objEquipment = this.takeOffPositionEquipment(parseInt(param));
    // 将装备放入背包中
    if (!Common.isObjectEmpty(objEquipment)) {
      const objEquipmentBase = {
        _id: objEquipment._id,
        id: objEquipment.id,
        level: objEquipment.level,
        time: objEquipment.time,
        total: objEquipment.total
      };
      g_objBagInfo.equipment.push(objEquipmentBase);
    }

    // 先反馈，刷新角色属性
    this.setMemberInfo();

    const paramMemberInfo = {
      memberInfo: g_objMemberInfo
    };
    // 服务器更新人物属性      
    WebApi.updateMemberInfo(paramMemberInfo).then((res) => {
      console.log('MemberDialog updateMemberInfo.success.', res);
    }).catch((err) => {
      console.log('MemberDialog updateMemberInfo.fail.', err);
    });

    // 配置参数：更新背包列表
    const paramPartsInfo = {
      partsInfo: g_objBagInfo.equipment,
      partsType: 'equipment'
    };
    // 服务器更新背包列表
    WebApi.updatePartsInfo(paramPartsInfo).then((res) => {
    }).catch((err) => {
      console.log('MemberDialog updatePartsInfo Fail.', err);
    });
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 卸下，并获取指定位置的装备
  takeOffPositionEquipment: function(nPosition) {
    let objTmp = {};
    switch (nPosition) {
      case 0:
        objTmp = g_objMemberInfo.equipment_hat;
        g_objMemberInfo.equipment_hat = {};
        break;
      case 1:
        objTmp = g_objMemberInfo.equipment_shoulder;
        g_objMemberInfo.equipment_shoulder = {};
        break;
      case 2:
        objTmp = g_objMemberInfo.equipment_jacket;
        g_objMemberInfo.equipment_jacket = {};
        break;
      case 3:
        objTmp = g_objMemberInfo.equipment_weapon;
        g_objMemberInfo.equipment_weapon = {};
        break;
      case 4:
        objTmp = g_objMemberInfo.equipment_jewelry;
        g_objMemberInfo.equipment_jewelry = {};
        break;
      case 5:
        objTmp = g_objMemberInfo.equipment_shoes;
        g_objMemberInfo.equipment_shoes = {};
        break;
      default:
        objTmp = {};
        break;
    }
    return objTmp;
  },

  // 渲染玩家属性值
  setMemberInfo: function() {
    if (!Common.isObjectEmpty(g_objUserInfo) && !Common.isObjectEmpty(g_objMemberInfo)) {
      // 配置参数：更新人物属性全局变量
      const newMemberInfo = GameApi.funComputedMemberInfo(g_objMemberInfo.level);
      g_objMemberInfo = Common.destructuringAssignment(g_objMemberInfo, newMemberInfo);
      console.log('', g_objUserInfo, g_objMemberInfo);
      // 昵称
      this.m_labelName.getComponent(cc.Label).string = g_objUserInfo.nickName;
      // ID
      this.m_labelID.getComponent(cc.Label).string = g_objMemberInfo._id;
      // 称号
      this.m_labelTitle.getComponent(cc.Label).string = g_objMemberInfo.title ? g_objMemberInfo.title : '无';
      // 等级
      this.m_labelTaste.getComponent(cc.Label).string = GameApi.getTasteString(g_objMemberInfo.level);
      // 经验
      this.m_labelExp.getComponent(cc.Label).string = `${g_objMemberInfo.exp} / ${GameApi.getExpMaxString(g_objMemberInfo.level)}`;
      // 描述
      this.m_labelDescribe.getComponent(cc.Label).string = GameApi.getDescribeString(g_objMemberInfo.describe);
      //////////////////////////////////////////////////
      // 状态栏
      // 生命
      this.m_labelHP.getComponent(cc.Label).string = g_objMemberInfo.hp_total;
      // 外功
      this.m_labelOuterAttack.getComponent(cc.Label).string = g_objMemberInfo.outerAttack_total;
      // 内功
      this.m_labelinnerAttack.getComponent(cc.Label).string = g_objMemberInfo.innerAttack_total;
      // 外防
      this.m_labelOuterDefense.getComponent(cc.Label).string = g_objMemberInfo.outerDefense_total;
      // 内防
      this.m_labelInnerDefense.getComponent(cc.Label).string = g_objMemberInfo.innerDefense_total;
      // 暴击
      this.m_labelCrit.getComponent(cc.Label).string = g_objMemberInfo.crit_total;
      // 闪避
      this.m_labelDodge.getComponent(cc.Label).string = g_objMemberInfo.dodge_total;
      // 格挡
      this.m_labelSpeed.getComponent(cc.Label).string = g_objMemberInfo.speed_total;
      // 幸运
      this.m_labelUnderstand.getComponent(cc.Label).string = g_objMemberInfo.understand_total;
      //////////////////////////////////////////////////
      // 装备栏
      // 头戴
      this.m_labelHat.getComponent(cc.Label).string = g_objMemberInfo.equipment_hat.name ? `${g_objMemberInfo.equipment_hat.name}(Lv.${g_objMemberInfo.equipment_hat.level})` : '无';
      this.m_labelHat.color = g_objMemberInfo.equipment_hat.id ? GameApi.getPartsInfoColor(g_objMemberInfo.equipment_hat.id): new cc.color(255, 255, 255);
      this.m_btnHatTakeoff.active = Boolean(g_objMemberInfo.equipment_hat.id);
      // 肩披
      this.m_labelShoulder.getComponent(cc.Label).string = g_objMemberInfo.equipment_shoulder.name ? `${g_objMemberInfo.equipment_shoulder.name}(Lv.${g_objMemberInfo.equipment_shoulder.level})` : '无';
      this.m_labelShoulder.color = g_objMemberInfo.equipment_shoulder.id ? GameApi.getPartsInfoColor(g_objMemberInfo.equipment_shoulder.id): new cc.color(255, 255, 255);
      this.m_btnShoulderTakeoff.active = Boolean(g_objMemberInfo.equipment_shoulder.id);
      // 身穿
      this.m_labelJacket.getComponent(cc.Label).string = g_objMemberInfo.equipment_jacket.name ? `${g_objMemberInfo.equipment_jacket.name}(Lv.${g_objMemberInfo.equipment_jacket.level})` : '无';
      this.m_labelJacket.color = g_objMemberInfo.equipment_jacket.id ? GameApi.getPartsInfoColor(g_objMemberInfo.equipment_jacket.id): new cc.color(255, 255, 255);
      this.m_btnJacketTakeoff.active = Boolean(g_objMemberInfo.equipment_jacket.id);
      // 手持
      this.m_labelWeapon.getComponent(cc.Label).string = g_objMemberInfo.equipment_weapon.name ? `${g_objMemberInfo.equipment_weapon.name}(Lv.${g_objMemberInfo.equipment_weapon.level})` : '无';
      this.m_labelWeapon.color = g_objMemberInfo.equipment_weapon.id ? GameApi.getPartsInfoColor(g_objMemberInfo.equipment_weapon.id): new cc.color(255, 255, 255);
      this.m_btnWeaponTakeoff.active = Boolean(g_objMemberInfo.equipment_weapon.id);
      // 腰悬
      this.m_labelJewelry.getComponent(cc.Label).string = g_objMemberInfo.equipment_jewelry.name ? `${g_objMemberInfo.equipment_jewelry.name}(Lv.${g_objMemberInfo.equipment_jewelry.level})` : '无';
      this.m_labelJewelry.color = g_objMemberInfo.equipment_jewelry.id ? GameApi.getPartsInfoColor(g_objMemberInfo.equipment_jewelry.id): new cc.color(255, 255, 255);
      this.m_btnJewelryTakeoff.active = Boolean(g_objMemberInfo.equipment_jewelry.id);
      // 足踏
      this.m_labelShoes.getComponent(cc.Label).string = g_objMemberInfo.equipment_shoes.name ? `${g_objMemberInfo.equipment_shoes.name}(Lv.${g_objMemberInfo.equipment_shoes.level})` : '无';
      this.m_labelShoes.color = g_objMemberInfo.equipment_shoes.id ? GameApi.getPartsInfoColor(g_objMemberInfo.equipment_shoes.id): new cc.color(255, 255, 255);
      this.m_btnShoesTakeoff.active = Boolean(g_objMemberInfo.equipment_shoes.id);
    }
  }
});
