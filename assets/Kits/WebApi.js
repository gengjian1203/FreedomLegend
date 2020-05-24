//////////////////////////////////////////////////
// mylog
// 测试打印
// param: str
// return: log
//////////////////////////////////////////////////
function mylog(str) {
  console.log('WebApi.mylog', str);
}

//////////////////////////////////////////////////
// initWXCloud
// 初始化微信云函数
//////////////////////////////////////////////////
function initWXCloud() {
  if (cc.sys.platform === cc.sys.WECHAT_GAME) {
    const env = g_production ? 'production-ojwyp' : 'develop-8ouxt';
    wx.cloud.init({
      env
    });
  }
}

//////////////////////////////////////////////////
// setUserCloudStorage
// param:
// memberInfo     角色信息
// return:
// 微信云端托管数据
//////////////////////////////////////////////////
function setUserCloudStorage(memberInfo) {
  let arrData = new Array();
  let objTmp = {};
  if (memberInfo.level) {
    objTmp = {
      'wxgame': {
        'level': memberInfo.level,
        'update_time': Date.parse(new Date())
      }
    }
    arrData.push({ key: 'level', value: JSON.stringify(objTmp) });
  }
  if (memberInfo.gold) {
    objTmp = {
      'wxgame': {
        'gold': memberInfo.gold,
        'update_time': Date.parse(new Date())
      }
    }
    arrData.push({ key: 'gold', value: JSON.stringify(objTmp) });
  }
  if (memberInfo.money) {
    objTmp = {
      'wxgame': {
        'money': memberInfo.money,
        'update_time': Date.parse(new Date())
      },
    }
    arrData.push({ key: 'money', value: JSON.stringify(objTmp) });
  }

  wx.setUserCloudStorage({
    KVDataList: arrData,
    success: (res) => {
        console.log('setUserCloudStorage 存储记录成功', res);
    },
    fail: (err) => {
        console.log(err);
    }
  });
}

//////////////////////////////////////////////////
// queryGameDetail
// 查询游戏的全局信息
// param:
// return: 
// result: Boolean, // 接口调用是否成功
// game: Object,    // 游戏概况信息
// member: Object,  // 该成员信息
//////////////////////////////////////////////////
function queryGameDetail() {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'queryGameDetail',
        success: (res) => {
          console.log('WebApi.queryGameDetail res', res);
          if (res.result) {
            console.log('WebApi.queryGameDetail Success', res.result);
            resolve(res.result);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.queryGameDetail Fail', err);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

//////////////////////////////////////////////////
// queryMemberInfo
// 查询玩家信息
// param: 
// openid,          // 成员openid 如果为空则查询自己信息
// return: 
// result: Boolean, // 接口调用是否成功
// member: Object,  // 该成员信息
//////////////////////////////////////////////////
function queryMemberInfo(openid) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'queryMemberInfo',
        data: {
          openid
        },
        success: (res) => {
          console.log('WebApi.queryMemberInfo res', res);
          if (res.result) {
            console.log('WebApi.queryMemberInfo Success', res.result);
            resolve(res.result);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.queryMemberInfo Fail', err);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

//////////////////////////////////////////////////
// updateMemberInfo
// 更新玩家信息
// param: 
// objMemberInfo : Object, // 待更新的成员信息
// isLogin : Boolean,      // 是否是登录
// return:
// result: Boolean      // 接口成功标识
// timeHook: Number     // 挂机时间(只有isLogin为true时，才为合法值)
// isNewMember: Boolean // 是否是新成员标识、决定跳转引导页还是主页面
//////////////////////////////////////////////////
function updateMemberInfo(memberInfo, isLogin) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'updateMemberInfo',
        data: {
          memberInfo,
          isLogin
        },
        success: (res) => {
          console.log('WebApi.updateMemberInfo', res, memberInfo, isLogin);
          if (res.result) {
            console.log('WebApi.updateMemberInfo Success', res.result, res.result.timeHook);
            if (isLogin) {
              // 是登录则记录挂机时间
              if (res.result.timeHook) {
                g_nTimeHook = res.result.timeHook;
              }
            }
            else {
              // 不是登录，则存储排行榜信息
              setUserCloudStorage(memberInfo);
            }
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.updateMemberInfo Fail', err);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

//////////////////////////////////////////////////
// queryPartsInfo
// 查询角色的附属数据信息
// param 
// openid: String       openid 如果传值则查询对应id的角色信息、如果不传值则查询自身的角色信息
// return
// result: Boolean      接口成功标识
// partsInfo: Array     ['equipment': {_id:'', id:'', total:5, time:0}, 'mail': {_id:'', id:'', total:5, time:0}] 物品UUID唯一标识 物品ID 物品数量 创建时间戳
//////////////////////////////////////////////////
function queryPartsInfo(param) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'queryPartsInfo',
        data: {
          openid: param.openid,
        },
        success: (res) => {
          console.log('WebApi.queryPartsInfo res', res, param);
          if (res.result) {
            console.log('WebApi.queryPartsInfo Success', res.result);
            resolve(res.result);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.queryPartsInfo Fail', err, param);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

//////////////////////////////////////////////////
// updatePartsInfo
// 更新/创建的配件信息
// param 
// openid: String       openid 如果传值则查询对应id的角色信息、如果不传值则查询自身的角色信息
// partsInfo: Array     物品信息
// partsType: String    配件列表名称
// return
// result: Boolean      接口成功标识
//////////////////////////////////////////////////
function updatePartsInfo(param) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'updatePartsInfo',
        data: {
          openid: param.openid,
          partsInfo: param.partsInfo,
          partsType: param.partsType
        },
        success: (res) => {
          console.log('WebApi.updatePartsInfo', res, param);
          if (res.result) {
            console.log('WebApi.updatePartsInfo Success', res.result);
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.updatePartsInfo Fail', err);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

//////////////////////////////////////////////////
// createRewards
// 获取奖励
// param 
// openid: String       openid 如果传值则查询对应id的角色信息、如果不传值则查询自身的角色信息
// type: String         'box' - 装备抽奖  'roll' - 轮盘抽奖 '' - 功法抽奖
// count: Number        抽奖次数
// return
// result: Boolean      接口成功标识
// prize: Array         [{_id:'', id:'', name:'', total:5, time:0}] 物品UUID唯一标识 物品ID 物品名称 物品数量 创建时间戳
//////////////////////////////////////////////////
function createRewards(param) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'createRewards',
        data: {
          openid: param.openid,
          type: param.type,
          count: param.count
        },
        success: (res) => {
          console.log('WebApi.createRewards', res, param);
          if (res.result) {
            console.log('WebApi.createRewards Success', res.result);
            resolve(res.result);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.createRewards Fail', err);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

//////////////////////////////////////////////////
// fetchBattleResult
// 获取战斗结果
// param 
// arrMemberInfoA: Array
// arrMemberInfoB: Array
// return
// arrListResult: Array      
//////////////////////////////////////////////////
function fetchBattleResult(param) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'fetchBattleResult',
        data: {
          arrMemberInfoA: param.arrMemberInfoA,
          arrMemberInfoB: param.arrMemberInfoB
        },
        success: (res) => {
          console.log('WebApi.fetchBattleResult', res, param);
          if (res.result) {
            console.log('WebApi.fetchBattleResult Success', res.result);
            resolve(res.result);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.fetchBattleResult Fail', err);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

//////////////////////////////////////////////////
// querySportsList
// 查询符合自身排名的演武场对手列表
// param 
// sportsNumber: Number     自身演武场排名
// return
// result: Boolean          接口成功标识
// arrSportsList: Object    演武场对手列表
//////////////////////////////////////////////////
function querySportsList(param) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'querySportsList',
        data: {
          sportsNumber: param.sportsNumber,
        },
        success: (res) => {
          console.log('WebApi.querySportsList res', res, param);
          if (res.result) {
            console.log('WebApi.querySportsList Success', res.result);
            resolve(res.result);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.querySportsList Fail', err, param);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

export default {
  mylog,
  initWXCloud,
  queryGameDetail,
  queryMemberInfo,
  updateMemberInfo,
  queryPartsInfo,
  updatePartsInfo,
  createRewards,
  fetchBattleResult,
  querySportsList,
}