// pages/myCertification/myCertification.js
var app = getApp()
var db = wx.cloud.database()
var selectListCollection = db.collection("test_db_selectList")
var courseCollection = db.collection("test_db_course")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: []
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var page = this
    // 从数据库获取自己已签到的活动认证
    var getSelectListPromise = new Promise((resolve, reject) => {
      selectListCollection.where({
        _openid: app.globalData.openid,
        gotCertification: true,
        enroll_flag: true
      }).get({
        success(res) {
          // console.log(res.data)
          resolve(res.data)
        }
      })
    })
    // 根据course_id获取活动列表
    var getActivitiesPromise = new Promise((resolve, reject) => {
      Promise.all([getSelectListPromise]).then(res => {
        var activities = []
        for (let i = 0; i < res[0].length; i++) {
          courseCollection.doc(res[0][i].course_id).get({
            success(re) {
              // console.log(re.data)
              activities.push(re.data)
              page.setData({
                activities: activities
              })
            }
          })
        }
        resolve(activities)
      })
    })
  },

  navigateToCerticification(e) {
    // console.log(e.currentTarget.dataset.id)
    app.globalData.activityId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../certification/certification',
    })
  },

  onReady() {
    let page = this
    let top = 0
    let height = 0
    // 获取设备的高度
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result.windowHeight)
        app.globalData.windowHeight = result.windowHeight
        height = result.windowHeight
      },
    })
    // 获取标签的高度
    wx.createSelectorQuery().select('#provider').boundingClientRect(function(res) {
      top = res.top
      // console.log(top)
      if (top < height - 27) {
        page.setData({
          fixed: true
        })
      } else {
        page.setData({
          fixed: false
        })
      }
      // console.log("top: ", res.top, ", bottom: ", res.bottom)
    }).exec()
  },

})