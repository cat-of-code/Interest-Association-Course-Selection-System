// pages/association/association.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var managerCollection = db.collection("test_db_manager")
const _ = db.command
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    association: {},
    activities: [],
    color: "#8CA6FD",
    left_color: "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/left-color.png",
  },

  onShow() {
    var page = this
    var uid = app.globalData.association_uid
    // console.log(uid)
    var date = new Date()
    var today = "" + date.getFullYear() + "/" + (date.getMonth() + 1 < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "/" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate())
    // console.log(today)
    // 从数据库获取协会详细信息
    this.getAssociationInfo(uid)
    // 从数据库获取协会未办活动信息
    this.getActivitiesInfo(uid, today)
    // 从数据库获取协会所办所有活动数
    this.getActivitiesLength(uid)
  }, 


  /**
   * 李天红写的
   * 功能：从数据库获取协会详细信息
   */
  getAssociationInfo(uid) {
    var page = this
    managerCollection.where({
      association_uid: uid
    }).get({
      success(res) {
        page.setData({
          association: res.data[0]
        })
        // console.log(res.data[0])
      }
    })
  },

  /**
   * 李天红写的
   * 功能：从数据库获取协会未办活动信息
   */
  getActivitiesInfo(uid, today) {
    var page = this
    courseCollection.where({
      association_uid: uid,
      course_date: _.gte(today)
    }).get({
      success(res) {
        page.setData({
          activities: res.data
        })
      }
    })
  },

  /**
   * 李天红写的
   * 功能：从数据库获取协会所办活动数
   */
  getActivitiesLength(uid) {
    var page = this
    courseCollection.where({
      association_uid: uid
    }).get({
      success(res) {
        page.setData({
          count: res.data.length
        })
      }
    })
  },

  /**
   * 李天红写的
   * 功能：活动报名
   */
  reserveBtn (e) {
    var index = e.currentTarget.dataset.idx
    // console.log(this.data.activities[index])
    var activity_id = this.data.activities[index]._id
    utils.enroll(activity_id)
  },


  navBack(e) {
    wx.navigateBack({
      delta: 1
    })
  },


  navigateToActivity(e) {
    // console.log(e.currentTarget.dataset.idx)
    var index = e.currentTarget.dataset.idx
    app.globalData.activityId = this.data.activities[index]._id
    // console.log(this.data.dates[this.data.day_index].activities[index]._id)
    // 2.跳转到活动详情页面
    wx.navigateTo({
      url: '../activityDetail/activityDetail',
    })
  }
})