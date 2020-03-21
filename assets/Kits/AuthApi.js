//////////////////////////////////////////////////
// authUserInfo
// 授权用户信息
// param:
//////////////////////////////////////////////////
function authUserInfo() {
  console.log('AuthApi.authUserInfo');
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.getSetting({
        success: (res) => {
          console.log('AuthApi wx.getSetting', res);
          if (res.authSetting['scope.userInfo'] === true) {
            // 之前授权过，直接读取用户信息
            wx.getUserInfo({
              success: (res) => {
                console.log('AuthApi wx.getUserInfo', res);
                resolve(res);
              },
              fail: (err) => {
                console.log('AuthApi wx.getUserInfo', err);
                reject(err);
              }
            });
          } else if (res.authSetting['scope.userInfo'] === false) {
            // 之前拒绝过，引导用户快去授权
            wx.openSetting({
              success: (res) => {
                console.log('AuthApi wx.openSetting', res);
                reject(res);
              },
              fail: (err) => {
                console.log('AuthApi wx.openSetting', err);
                reject(err);
              }
            });
          } else {
            // 第一次，提示用户开启授权
            wx.authorize({
              scope: 'scope.userInfo',
              success: (res) => {
                console.log('AuthApi wx.authorize', res);
                // 授权后直接读取用户信息
                wx.getUserInfo({
                  success: (res) => {
                    console.log('AuthApi wx.getUserInfo', res);
                    resolve(res);
                  },
                  fail: (err) => {
                    console.log('AuthApi wx.getUserInfo', err);
                    reject(err);
                  }
                });
              },
              fail: (err) => {
                console.log('AuthApi wx.authorize', err);
                reject(err);
              }
            })
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
}

export default {
  authUserInfo,
}