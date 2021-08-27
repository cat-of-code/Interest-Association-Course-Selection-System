//app.js

App({
  // 打开小程序时连接云数据库的代码
  onLaunch: function () {
    var page = this
    if (wx.cloud) {
      // 1.获取用户openid
      wx.cloud.init({
        env: "cloud1-0gyu6anlffcd11a5",
        traceUser: true
      })
      wx.cloud.callFunction({
        name: "getOpenId"
      }).then(res => {
        // 2.获取成功就把openid添加到weapp全局变量
        page.globalData.openid = res.result.openid
        // 3.查询数据库，看用户是否注册，如果注册则自动登录
        var db = wx.cloud.database()
        var userCollection = db.collection("test_db_user")
        userCollection.where({
          _openid: res.result.openid
        }).get({
          success: function(res) {
            // console.log("登录成功")
            page.globalData.nickName = res.data[0].nickName,
            page.globalData.avatarUrl = res.data[0].avatarUrl,
            page.globalData.login = true
            // console.log(res.data[0].avatarUrl)
          }
        })
      })
    }
  },
  // 【可改】：全局变量
  globalData: {
    nickName: "",
    avatarUrl: "",
    openid: "",
    login: false,
    managerLogin: false
  }
})