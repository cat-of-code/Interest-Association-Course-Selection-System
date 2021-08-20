//app.js
App({
  // 【可忽略】：打开小程序时连接云数据库的代码
  onLaunch: function () {
    if(wx.cloud){
      wx.cloud.init({
        env:"cloud1-0gyu6anlffcd11a5",
        traceUser:true
      })
      wx.cloud.callFunction({
        name:"getOpenId"
      }).then(res=>{
        this.globalData.openid = res.result.openid
      })
    }
  },
  // 【可改】：全局变量
  globalData:{
    id:0,
    username: "",
    uid:"",
    password:"",
    identity:"",
    courses:[],
    courseName:"",
    openid:""
  }
})