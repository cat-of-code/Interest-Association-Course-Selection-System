// pages/login/login.js
var app = getApp()
var db = wx.cloud.database()
var userCollection = db.collection("test_db_user")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: "#8CA6FD",
  },

  /**
   * @Author: 李天红
   * @Description: 可能存在登录延时的情况，在生命周期中判断是否登录，如果登录就无需重新登录了。
   */
  onShow() {
    if (app.globalData.login) {
      wx.navigateBack({
        delta: 1,
      })
    }
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
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    })
    // console.log(userInfo.nickName)
    // console.log(userInfo.avatarUrl)
  },

  navibackBtn(e) {
    wx.navigateBack({
      delta: 1,
    })
  },

})