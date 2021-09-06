// pages/association/association.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var managerCollection = db.collection("test_db_manager")
var selectListCollection = db.collection("test_db_selectList")
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
    empty: true,
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

  onReady() {
    let page = this
    let height = app.globalData.windowHeight
    wx.createSelectorQuery().select('#provider').boundingClientRect(function(res) {
      if (res.top < height - 27) {
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
    var now = new Date()
    courseCollection.where({
      association_uid: uid,
      course_date: _.gte(today)
    }).get({
      success(res) {
        var result = res.data
        // console.log(res.data)
        // console.log(result)
        if (res.data.length != 0) {
          for (var i = 0; i < result.length; i++) {
            if (Date.parse(now) + 7200000 >= Date.parse(result[i].course_date + ' ' + result[i].course_start_time)) {
              result[i].isEnd = true
            } else {
              result[i].isEnd = false
            }
          }
          page.setData({
            activities: result,
            empty: false
          })
          if (app.globalData.login) {
            // console.log(result)
            page.checkWhatISign(result)
          }
        } else {
          page.setData({
            empty: true
          })
        }
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
   * 查看自己是否报了名
   */
  checkWhatISign(result) {
    let page = this
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      selectListCollection.where({
        _openid: app.globalData.openid,
        course_id: result[i]._id,
        enroll_flag: true
      }).get({
        success(re) {
          // console.log(re)
          if (re.data.length != 0) {
            result[i].isSign = true
          } else {
            result[i].isSign = false
          }
          // console.log(result)
          // console.log("查看列表活动是否已经预约")
          page.setData({
            [`activities[${i}].isSign`]: result[i].isSign
          })
        }
      })
    }
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
    this.setData({
      [`activities[${index}].isSign`]: true
    })
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