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
// queryMember
// 查询成员信息
// param: openid,  // 成员openid 如果为空则查询自己信息
// return: member: Object,  // 该成员信息
// 
//////////////////////////////////////////////////
function queryMember(openid) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'queryMember',
        data: {
          openid
        },
        success: (res) => {
          console.log('WebApi.queryMember res', res);
          if (res.result) {
            console.log('WebApi.queryMember Success', res.result);
            resolve(res.result);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.queryMember Fail', err);
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

//////////////////////////////////////////////////
// updateMemeber
// 更新的成员信息
// param: objMemberInfo : Object, // 待更新的成员信息
//        isLogin : Boolean,      // 是否是登录
//////////////////////////////////////////////////
function updateMemeber(memberInfo, isLogin) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.callFunction({
        name: 'updateMemeber',
        data: {
          memberInfo,
          isLogin
        },
        success: (res) => {
          console.log('WebApi.updateMemeber', res);
          if (res.result) {
            console.log('WebApi.updateMemeber Success', res.result);
            // 结算
            // wx.postMessage({level : memberInfo.level, type : 'level'});

            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.updateMemeber Fail', err);
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
  queryMember,
  updateMemeber,
}