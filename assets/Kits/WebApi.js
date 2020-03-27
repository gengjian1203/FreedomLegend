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
// queryGameDetail
// 查询游戏的全局信息
// param:
// return: game: Object,    // 游戏概况信息
//         member: Object,  // 该成员信息
// 
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
// param: openid,           // 成员openid 如果为空则查询自己信息
// return: member: Object,  // 该成员信息
// 
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

// 微信云端托管数据
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
// updateMemberInfo
// 更新玩家信息
// param: objMemberInfo : Object, // 待更新的成员信息
//        isLogin : Boolean,      // 是否是登录
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

export default {
  mylog,
  queryGameDetail,
  queryMemberInfo,
  updateMemberInfo,
}