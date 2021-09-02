// pages/select/select.js
var utils = require('../../utils/util.js');
var app = getApp()
var db = wx.cloud.database()
var activityCollection = db.collection("test_db_course")
var associationCollection = db.collection("test_db_manager")
var _ = db.command


Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_date: 0,
    activity: [],
    association: {},
    flag: false,
    // stuName:app.globalData.username
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onShow(options) {
    var uid = app.globalData.association_uid
    // 查询协会发布的活动
    await this.addMyActivity(uid)
    // 查询协会信息
    this.getAssociationInfo(uid)
  },

  getAssociationInfo(uid) {
    var page = this
    associationCollection.where({
      association_uid: uid
    }).get({
      success(res) {
        // console.log(res.data[0])
        page.setData({
          association: res.data[0]
        })
      }
    })
  },

  /**
   * 退选课程
   */
  quit(e) {
    let id = e.target.id
    console.log(e)
    activityCollection.doc(id).remove().then(res => {
      wx.showToast({
        title: '取消成功',
      })
    })
    activityCollection.doc(id).get().then(res => {
      wx.cloud.deleteFile({
        fileList: [res.data.imgID],
        success: res => {
          console.log(res.fileList)
        },
        fail: console.error
      })
    })
    this.refresh()
  },
  /**
   * 跳转到课程详细页面修改
   */
  updata(e) {
    // console.log(e.target.id)
    app.globalData.activity_id = e.target.id
    wx.navigateTo({
      url: '../updataActivityDetail/updataActivityDetail',
    })
  },

  addMyActivity: function (uid) {
    var page = this
    var now = Date.now()
    var openid = app.globalData.openid
    // console.log(now)
    var result = []
    var p = new Promise((resolve, reject) => {
      activityCollection.where({
        association_uid: uid,
        _openid: openid
      }).get().then(res => {
        // resolve(res.data[0])
        result = res.data
        // console.log(Date.parse(result[0].course_date + ' ' + result[0].course_start_time))
        for (let i = 0; i < result.length; i++) {
          if (now + 7200000 < Date.parse(result[i].course_date + ' ' + result[i].course_start_time)) {
            result[i].status = 1
          } else if (now < Date.parse(result[i].course_date + ' ' + result[i].course_start_time)) {
            result[i].status = 2
          } else if (now > Date.parse(result[i].course_date + ' ' + result[i].course_start_time) && now < Date.parse(result[i].course_date + ' ' + result[i].course_end_time)) {
            result[i].status = 3
          } else if (now > Date.parse(result[i].course_date + ' ' + result[i].course_end_time)){
            result[i].status = 4
          }
        }
        page.setData({
          activity: result
        })
        // console.log(page.data.activity)
      })
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async refresh() {
    var uid = app.globalData.association_uid

    await this.addMyActivity(uid)

  },


})