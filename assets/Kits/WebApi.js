// 测试打印
function mylog(str) {
    console.log('mylog', str);
}

//////////////////////////////////////////////////
// login
// param:
//////////////////////////////////////////////////
function login() {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        // 获取 openid
        return new Promise((resolve, reject) => {
            wx.cloud.callFunction({
                name: 'login',
                success: (res) => {
                    console.log('WebApi login', res);
                    // this.openid = res.result.openid;
                    resolve(res);
                },
                fail: (err) => {
                    // console.error('get openid failed with error', err);
                    console.log('WebApi login', err);
                    reject(err);
                }
            });
        });
    }
}


//////////////////////////////////////////////////
// queryDataBase
// param: openid : string
//////////////////////////////////////////////////
function queryDataBase(openid) {
    let db = wx.cloud.database();
    if (db) {
        db.collection('score')
        .doc(`${openid}-score`)
        .get()
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
    }
}


export default {
    mylog,
    login,
    queryDataBase,
}