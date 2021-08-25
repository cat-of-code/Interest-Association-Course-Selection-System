// pages/select/select.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var courseListCollection = db.collection("list")
var stuListListCollection = db.collection("stuList")
var managerCollection = db.collection("test_db_manager")
var user = db.collection("user")
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disable: false,
    dates: [],
    associations: [],
    selection: 0,
  },

  /**
   * 李天红写的
   * 生命周期函数
   */
  onLoad: function (e) {
    // 获取30天的日期
    var date = new Date()
    var page = this
    var dates = [{
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      empty: true,
      activities: []
    }]
    for (let index = 0; index < 29; index++) {
      date = new Date(Date.parse(date) + 86400000)
      dates.push({
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        empty: true,
        activities: []
      })
    }
    page.setData({
      dates: dates
    })
    // 从数据库中获取每日活动当天的活动
    var today = "" + date.getFullYear() + "/" + (date.getMonth() < 10 ? ("0" + date.getMonth()) : date.getMonth()) + "/" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate())
    // console.log(today)
    // console.log(date.getMonth() + 1)
    courseCollection.where({
      course_date: today
    }).get({
      success(res) {
        // console.log(res.data)
        if (res.data.length != 0) {
          page.setData({
            "dates[0].empty": false,
            "dates[0].activities": res.data
          })
        }
      }
    })
    // 从数据库获取所有协会信息
    managerCollection.where({
      association_uid: _.lt(100)
    }).get({
      success(res) {
        page.setData({
          associations: res.data
        })
      }
    })
  },

  getAssociationDetail() {
    // wx.redirectTo({
    //   url: '../association/association',
    // })
  },


  /**
   * 李天红写的
   * 功能：选择每日活动或者协会预约的id
   */
  chooseActivity: function (e) {
    this.setData({
      selection: e.detail.index
    })
  },

  /**
   * 李天红写的
   * 功能：点击日期获取当日的activity列表
   */
  clickTheDateActivity: function (e) {
    var index = e.detail.index
    if (this.data.dates[index].empty) {
      this.getDateActivities(index)
    }
  },

  /**
   * 李天红写的
   * 功能：点击日期，从数据库获取当天的活动
   */
  getDateActivities(index) {
    var page = this
    var date = new Date()
    date = new Date(Date.parse(date) + index * 86400000)
    var day = "" + date.getFullYear() + "/" + (date.getMonth() + 1 < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()) + "/" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate())
    // console.log(day)
    courseCollection.where({
      course_date: day
    }).get({
      success(res) {
        // console.log(res.data)
        if (res.data.length != 0) {
          page.setData({
            [`dates[${index}].empty`]: false,
            [`dates[${index}].activities`]: res.data
          })
        }
      }
    })
  },

  /**
   * 李天红写的
   * 功能：点击某个活动进入活动详情页
   */
  clickActivity: function (e) {
    console.log(e.currentTarget.dataset.idx)
    // wx.redirectTo({
    //   url: '../courseDetail/courseDetail',
    // })

  },

  /**
   * 李天红写的
   * 功能：点击预约按钮
   */
  reserveBtn: function (e) {
    console.log(e.currentTarget.dataset.idx)
  },

  /**
   * 李天红写的
   * 功能：展开页面
   */
})