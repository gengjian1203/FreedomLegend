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
          if (res.result.result) {
            console.log('WebApi.queryGameDetail', res);
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.queryGameDetail', err);
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
          if (res.result.result) {
            console.log('WebApi.updateMemeber', res);
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          console.log('WebApi.updateMemeber', err);
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
  updateMemeber,
}