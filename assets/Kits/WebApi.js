//////////////////////////////////////////////////
// mylog
// 测试打印
// param:
//////////////////////////////////////////////////
function mylog(str) {
    console.log('mylog', str);
}

//////////////////////////////////////////////////
// queryGameDetail
// 查询游戏的全局信息
// param:
//////////////////////////////////////////////////
function queryGameDetail() {
    
    // 获取 openid
    return new Promise((resolve, reject) => {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.cloud.callFunction({
                name: 'queryGameDetail',
                success: (res) => {
                    console.log('WebApi.queryGameDetail', res);
                    // this.openid = res.result.openid;
                    resolve(res);
                },
                fail: (err) => {
                    // console.error('get openid failed with error', err);
                    console.log('WebApi.queryGameDetail', err);
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
    queryGameDetail
}