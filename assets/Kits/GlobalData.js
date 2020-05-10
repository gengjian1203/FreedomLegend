// 全局变量
window.g_production = false;      // 生产环境
window.g_nTimeHook = 0;           // 挂机时间
window.g_objUserInfo = {};        // 用户信息 - 微信纬度
window.g_objMemberInfo = {};      // 玩家信息 - 游戏纬度
window.g_arrMailInfo = [];        // 邮件信息
window.g_arrTitle = [];           // 称号列表
window.g_arrLog = [];             // 人物传记列表
window.g_objBagInfo = {
  equipment: [],                  // 装备信息 - 背包纬度
  medicine: [],                   // 药品列表 - 背包纬度
  consumables: [],                // 消耗品列表 - 背包纬度
  magic: [],                      // 功法列表 - 背包纬度
  pets: [],                       // 宠物蛋列表 - 背包纬度
}

// 战斗传值
window.g_objPrize = [{
  id: "000000", 
  total: 100
}, {
  id: "000002", 
  total: 50
}];
// 友军mock数据
window.g_arrMemberInfoA = [{
  avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83er6JJibWSWCgr0Gh9aNEoArt77vjb875bkIfEkAic8UroEW8lgp7vfvZB7a9DW8OwoIB5oicngaNf7icg/132",
  city: "",
  country: "Albania",
  crit_base: 0,
  crit_equipment: 0,
  crit_medicine: 0,
  crit_total: 0,
  describe: 3,
  dodge_base: 0,
  dodge_equipment: 0,
  dodge_medicine: 0,
  dodge_total: 0,
  equipment_hat: {},
  equipment_jacket: {},
  equipment_jewelry: {},
  equipment_shoes: {
    crit: 0,
    crit_up: 0,
    describe: "",
    dodge: 0,
    dodge_up: 0,
    hp: 0,
    hp_up: 0,
    id: "100950",
    innerAttack: 0,
    innerAttack_up: 0,
    innerDefense: 0,
    innerDefense_up: 0,
    introduce: "大陆上稀有的黄金战靴",
    level: 1,
    name: "黄金战靴",
    outerAttack: 0,
    outerAttack_up: 0,
    outerDefense: 0,
    outerDefense_up: 0,
    speed: 4,
    speed_up: 2,
    time: 1586876101465,
    total: 1,
    understand: 0,
    understand_up: 0,
    _id: "277de2f0-6340-4a32-871c-7166db0201ad"
  },
  equipment_shoulder: {},
  equipment_weapon: {},
  exp: 143,
  gender: 1,
  gold: 7197,
  hp_base: 500,
  hp_equipment: 0,
  hp_medicine: 0,
  hp_total: 500,
  innerAttack_base: 90,
  innerAttack_equipment: 0,
  innerAttack_medicine: 0,
  innerAttack_total: 90,
  innerDefense_base: 80,
  innerDefense_equipment: 0,
  innerDefense_medicine: 0,
  innerDefense_total: 80,
  language: "zh_CN",
  level: 8,
  money: 28752,
  nickName: "以堪",
  outerAttack_base: 100,
  outerAttack_equipment: 0,
  outerAttack_medicine: 0,
  outerAttack_total: 100,
  outerDefense_base: 90,
  outerDefense_equipment: 0,
  outerDefense_medicine: 0,
  outerDefense_total: 90,
  province: "",
  speed_base: 0,
  speed_equipment: 4,
  speed_medicine: 0,
  speed_total: 4,
  timeLogin: 1588947948599,
  title: "",
  understand_base: 63,
  understand_equipment: 0,
  understand_medicine: 0,
  understand_total: 63,
  _createTime: "2020-04-14T05:16:22.534Z",
  _id: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  _loginTime: "2020-05-08T14:25:48.633Z",
  _openid: "oxeKH5LuhzyrivQIJI54h9it3MA4",
  _partsid: "parts-oxeKH5LuhzyrivQIJI54h9it3MA4",
  _updateTime: "2020-05-08T14:25:48.633Z"
}]; 
// 敌军mock数据  
window.g_arrMemberInfoB = [{
  crit_total: 0,
  dodge_total: 0,
  hp_total: 400,
  innerAttack_total: 20,
  innerDefense_total: 10,
  level: 20,
  nickName: "强盗",
  outerAttack_total: 20,
  outerDefense_total: 20,
  speed_total: 5,
  understand_total: 0,
  _id: "mem-0003-00"
}, {
  crit_total: 0,
  dodge_total: 0,
  hp_total: 400,
  innerAttack_total: 30,
  innerDefense_total: 5,
  level: 20,
  nickName: "土匪",
  outerAttack_total: 30,
  outerDefense_total: 20,
  speed_total: 3,
  understand_total: 0,
  _id: "mem-0003-01"
}];
// 战斗情况
window.g_arrBattleResult = [{
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 400,
  nHPDefense: 500,
  nRound: 0,
  strIDAttack: "mem-0003-00",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4"
}, {
  nEffectAttack: 0,
  nEffectDefense: -80,
  nHPAttack: 500,
  nHPDefense: 320,
  nRound: 0,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-00",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 400,
  nHPDefense: 500,
  nRound: 0,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 320,
  nHPDefense: 500,
  nRound: 1,
  strIDAttack: "mem-0003-00",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -80,
  nHPAttack: 500,
  nHPDefense: 240,
  nRound: 1,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-00",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 400,
  nHPDefense: 500,
  nRound: 1,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 240,
  nHPDefense: 500,
  nRound: 2,
  strIDAttack: "mem-0003-00",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -80,
  nHPAttack: 500,
  nHPDefense: 160,
  nRound: 2,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-00",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 400,
  nHPDefense: 500,
  nRound: 2,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 160,
  nHPDefense: 500,
  nRound: 3,
  strIDAttack: "mem-0003-00",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -80,
  nHPAttack: 500,
  nHPDefense: 80,
  nRound: 3,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-00",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 400,
  nHPDefense: 500,
  nRound: 3,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 80,
  nHPDefense: 500,
  nRound: 4,
  strIDAttack: "mem-0003-00",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -80,
  nHPAttack: 500,
  nHPDefense: 0,
  nRound: 4,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-00",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 400,
  nHPDefense: 500,
  nRound: 4,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -85,
  nHPAttack: 500,
  nHPDefense: 315,
  nRound: 5,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-01",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 315,
  nHPDefense: 500,
  nRound: 5,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -80,
  nHPAttack: 500,
  nHPDefense: 235,
  nRound: 6,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-01",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 235,
  nHPDefense: 500,
  nRound: 6,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -85,
  nHPAttack: 500,
  nHPDefense: 150,
  nRound: 7,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-01",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 150,
  nHPDefense: 500,
  nRound: 7,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -80,
  nHPAttack: 500,
  nHPDefense: 70,
  nRound: 8,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-01",
}, {
  nEffectAttack: 0,
  nEffectDefense: 0,
  nHPAttack: 70,
  nHPDefense: 500,
  nRound: 8,
  strIDAttack: "mem-0003-01",
  strIDDefense: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
}, {
  nEffectAttack: 0,
  nEffectDefense: -85,
  nHPAttack: 500,
  nHPDefense: -15,
  nRound: 9,
  strIDAttack: "mem-oxeKH5LuhzyrivQIJI54h9it3MA4",
  strIDDefense: "mem-0003-01",
}];


cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
