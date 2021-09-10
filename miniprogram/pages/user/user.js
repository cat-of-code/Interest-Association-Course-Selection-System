var app = getApp()
var db = wx.cloud.database()
var userCollection = db.collection("test_db_user")

Page({
  /**
   * 显示天气
   */
  data: {
    login: false,
    managerLogin: false,
    userInfo: {},
    color: "#8CA6FD",
    projets:[ 
      {
        icon: "todo-list-o",
        text: "我的预约记录",
        navigateUrl: "/pages/myActivities/myActivities"
      }, {
        icon: "medal-o",
        text: "我的签到认证",
        navigateUrl: "/pages/myCertification/myCertification"
      }
    ],
    manages: [
      {
        icon: "edit",
        text: "我要发布活动",
        redirectUrl: "/pages/createActivity/createActivity"
      },
      {
        icon: "records",
        text: "已发布的活动",
        redirectUrl: "/pages/myCreatedActivity/myCreatedActivity"
      }
    ]
  },

  /**
   * 李天红写的
   * 功能：生命周期onShow，获取全局变量
   */
  onShow: function () {
    // console.log("进入pages/user/user")
    var page = this
    if (app.globalData.login) {
      page.setData({
        login: app.globalData.login,
        userInfo: {
          nickName: app.globalData.nickName,
          avatarUrl: app.globalData.avatarUrl
        }
      })
      page.setData({
        managerLogin: app.globalData.managerLogin
      })
    }
  },
  
  /**
   * 郭心德写的
   * 功能：管理员点击icon进入对应页面
   */
  enter: function (e) {
    var url = e.target.id
    wx.navigateTo({
      url: url,
    })
  },


  /**
   * 李天红写的
   * 功能：协会管理员登录页面跳转
   */

  managerLogin: function (e) {
    wx.navigateTo({
      url: '../manager/manager',
    })
  },

  /**
   * 李天红写的
   * 功能：退出协会管理员
   */
  managerLogout: function (e) {
    // 退出后要把数据清除
    this.setData({
      managerLogin: false
    })
    app.globalData.managerLogin = false
    app.globalData.association_name = ""
  },

  /**
   * 李天红写的
   * 功能：获取用户信息
   */
  getUserInfo: function (e) {
    var page = this
    var userInfo = {}
    var p1 = new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '获取您的昵称和头像',
        success(res) {
          // console.log(res.rawData)
          resolve(res.rawData)
        }
      })
    })
    Promise.all([p1]).then(function (res) {
      // console.log(res)
      userInfo = JSON.parse(res[0])
      // console.log(userInfo)
      // 把登录数据添加到数据库
      
      userCollection.add({
        data: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        },
        // 如果成功了
        success: function (res) {
          // 1.把用户名和头像保存到本页全局变量，login设置为true
          page.setData({
            login: true,
            userInfo: userInfo
          })
          // 2.把用户名和头像保存到整个weapp的全局变量
          app.globalData.nickName = userInfo.nickName
          app.globalData.avatarUrl = userInfo.avatarUrl
          app.globalData.login = true
        }
      })
    })
    // console.log(userInfo.nickName)
    // console.log(userInfo.avatarUrl)
  },
})