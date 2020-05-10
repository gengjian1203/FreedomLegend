// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  ctor() {
    // 当前角色信息
    this.objMemberInfo = {};
  },

  properties: {
    // 血量上限值
    m_HPMax: {
      type: cc.Node,
      default: null
    },
    // 当前血量值
    m_HP: {
      type: cc.Node,
      default: null
    },
    // 角色昵称
    m_labelName: {
      type: cc.Node,
      default: null
    },
    // 收到影响数值
    m_labelEffect: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {

  },

  onEnable () {
    console.log('Player onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('Player onDisable.');
    this.CancelEvent();
  },

  // update (dt) {},

  //////////////////////////////////////////////////
  // 交互事件
  //////////////////////////////////////////////////  
  // 注册事件
  registerEvent: function() {
    
  },

  // 注销事件
  CancelEvent: function() {
    
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 初始渲染角色状态
  initPlayerData(objMemberInfo) {
    console.log('Player initPlayerData', objMemberInfo);
    this.objMemberInfo = objMemberInfo;
    this.m_labelName.getComponent(cc.Label).string = objMemberInfo.nickName;
  },

  // 更新角色状态
  updatePlayerData(objBattleInfo, isAttack) {
    let nHP = 0;
    let nEffect = 0;
    // 设置血量长度
    if (isAttack) {
      nHP = objBattleInfo.nHPAttack;
      nEffect = objBattleInfo.nEffectAttack;
    } else {
      nHP = objBattleInfo.nHPDefense;
      nEffect = objBattleInfo.nEffectDefense;
    }
    let fPer = nHP / this.objMemberInfo.hp_total;
    fPer = fPer > 0 ? fPer : 0;
    console.log('updatePlayerData', nHP, this.objMemberInfo.hp_total, fPer);
    this.m_HP.width = Math.floor(this.m_HPMax.width * fPer);

    // 设置名字阵亡状态
    if (fPer === 0) {
      this.m_labelName.color = cc.color(50, 50, 50);
    }

    // 更新影响数值
    if (nEffect !== 0) {
      this.m_labelEffect.getComponent(cc.Label).string = String(nEffect);
      this.m_labelEffect.color = cc.color(255, 0, 0);
      this.m_labelEffect.y = 80;
      this.m_labelEffect.opacity = 255;
      
      this.m_labelEffect.getComponent(cc.Animation).play('FadeOut');
    }
    
  }

});
