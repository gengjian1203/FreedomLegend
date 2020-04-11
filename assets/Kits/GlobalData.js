// 全局变量
window.g_production = true;      // 生产环境
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
