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
let Common = require("../Kits/Common");

cc.Class({
  extends: cc.Component,

  ctor() {
    this.nIndex = 0;
    this.arrTeacherData = [{
      position: cc.v2(-200, -200),
      text: '欢迎你来到《醉梦坛说》的世界，我是你的个人助理梦梦~'
    }, {
      position: cc.v2(-200, -200),
      text: '那么接下来，让我们来熟悉一下这个世界吧~'
    }, {
      position: cc.v2(-200, -200),
      text: '屏幕上方是角色信息栏。'
    }, {
      position: cc.v2(240, 1300),
      text: '这里能显示你的等级哦~每个人都是从【筑基】开始，每个阶段有十个小等级，【筑基】之后是【开光】、【融合】、【心动】、【金丹】……，再往后的话，容梦梦卖个关子嘛，需要大家自己努力去探索呢~~~'
    }, {
      position: cc.v2(620, 1250),
      text: '游戏中的【铜钱】可以用来强化装备~'
    }, {
      position: cc.v2(620, 1170),
      text: '游戏中的【元宝】可以去【黑市】抽取装备~那里属于欧皇的“十连抽”哦~'
    }, {
      position: cc.v2(56, 1060),
      text: '这里是【邮件】，如果我们收到了小礼物，就会在这里显示呢~'
    }, {
      position: cc.v2(-200, -200),
      text: '屏幕的中间区域是我们在城市里能看到的事物。'
    }, {
      position: cc.v2(320, 740),
      text: '【聚义堂】能够看到自身好友的相关数据，以及自身在他们之中的排名。'
    }, {
      position: cc.v2(482, 490),
      text: '【演武场】是一个可以让小伙伴相互比武的场合，让我们看看谁更厉害呢。'
    }, {
      position: cc.v2(596, 666),
      text: '【黑市】是一个神秘的地方，在这里可以免费领取到铜钱和元宝哦？另外可以通过元宝抽取装备，至于能得到什么装备，就要看自己的手气啦~'
    }, {
      position: cc.v2(-200, -200),
      text: '屏幕的下面区域是功能区。'
    }, {
      position: cc.v2(190, 70),
      text: '点击【征战】，我们可以来到大地图，来开启我们的主线剧情。'
    }, {
      position: cc.v2(290, 70),
      text: '点击【武将】，可以查看自身的属性，以及身穿的装备。'
    }, {
      position: cc.v2(390, 70),
      text: '点击【强化】，可以强化自身装备的等级，以增强自身的属性。提前说一句哦，如果装备等级过高的话，不仅要用到铜钱，还要用到对应的装备碎片呢~'
    }, {
      position: cc.v2(490, 70),
      text: '点击【背包】，可以查看到自己身上拥有的所有物品。根据物品的种类，来决定装备、分解、合成、使用、还是丢弃等等~'
    }, {
      position: cc.v2(590, 70),
      text: '点击【金矿】，可以通过挖掘金矿来得到意外的小奖励哈~'
    }, {
      position: cc.v2(-200, -200),
      text: '梦梦说了好多，就先讲到这里好了，如果有什么需要我帮助的，可以随时叫我哦。我们江湖再会~白白~'
    }];
  },

  properties: {
    // 模态对话框蒙板
    m_mask: {
      type: cc.Node,
      default: null
    },
    // 对话文本
    m_labelTalk: {
      type: cc.Node,
      default: null
    },
    // 提示圈
    m_circle: {
      type: cc.Node,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    this.nIndex = 0;
    this.setTalk();
  },

  onEnable () {
    console.log('TeacherModule onEvable.');
    this.registerEvent();
  },

  onDisable () {
    console.log('TeacherModule onDisable.');
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
      this.onNextTalk();
    });
  },

  // 注销事件
  CancelEvent: function() {
    this.m_mask.off('touchstart', (event) => {
      event.stopPropagation();
    });
    this.m_mask.off('touchend', (event) => {
      event.stopPropagation();
      this.onNextTalk();
    });
  },

  // 关闭教学模式
  closeTeacherModule: function() {
    console.log('TeacherModule closeTeacherModule.');
    this.node.dispatchEvent( new cc.Event.EventCustom('hide-teacher-module', true) );
    this.node.active = false;
    this.node.removeFromParent();
  },

  // 下一句教程语句
  onNextTalk: function() {
    if (this.nIndex + 1 < this.arrTeacherData.length) {
      this.nIndex++;
      this.setTalk();
    } else {
      this.closeTeacherModule();
    }
  },

  //////////////////////////////////////////////////
  // 自定义函数
  //////////////////////////////////////////////////
  // 渲染教学对话
  setTalk: function() {
    this.m_labelTalk.getComponent(cc.Label).string = this.arrTeacherData[this.nIndex].text;
    this.m_circle.setPosition(this.arrTeacherData[this.nIndex].position);
  },
});
