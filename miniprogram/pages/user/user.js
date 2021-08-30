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
      },
      {
        icon: "label-o",
        text: "我的活动记录",
        navigateUrl: "/pages/myActivities/myActivities"
      },
      {
        icon: "orders-o",
        text: "我的报名记录",
        navigateUrl: "/pages/myActivities/myActivities"
      }
    ],
    manages: [
      {
        icon: "todo-list-o",
        text: "已发布的活动",
        navigateUrl: "pages/myActivities/myActivities"
      },
      {
        icon: "label-o",
        text: "协会的学员",
        navigateUrl: "pages/myActivities/myActivities"
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
   * 李天红写的
   * 功能：协会管理员登录页面跳转
   */

  managerLogin: function (e) {
    // wx.redirectTo({
    //   url: '../manager/manager',
    // })
    this.setData({
      managerLogin: true
    })
  },

  /**
   * 李天红写的
   * 功能：退出协会管理员
   */
  managerLogout: function (e) {
    // TODO: 退出后要把数据清除
    this.setData({
      managerLogin: false
    })
  },

  /**
   * 李天红写的
   * 功能：获取用户信息
   */
  getUserInfo: function (e) {
    var page = this
    var userInfo = e.detail.userInfo
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
      }
    })
    // console.log(userInfo.nickName)
    // console.log(userInfo.avatarUrl)
  },
  

})