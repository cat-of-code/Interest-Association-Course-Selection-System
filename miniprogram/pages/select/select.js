// pages/select/select.js
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
    dates: [], // 保存未来30天的活动列表
    associations: [], // 协会列表
    selection: 0, // 当前选的是“每日活动”或者“协会信息”的id
    color: "#8CA6FD", // 统一颜色
    day_index: 0, // 日期索引，当前查看的是第几天的活动内容
    isOnLoad: true, // 判断是不是onLoad生命周期
    fixed: true
  },

  /**
   * 李天红写的
   * 生命周期函数
   */
  onLoad: function (e) {
    // console.log("开始执行onLoad")
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
    date = new Date()
    var today = "" + date.getFullYear() + "/" + (date.getMonth() + 1 < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "/" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate())
    // console.log(today)
    // console.log(date)
    // console.log(date.getMonth() + 1)
    this.setData({
      today: today
    })
    this.getTodayActivitiesInfo(today)

    // 从数据库获取所有协会信息
    this.getAssociationsInfo()
  },

  onShow() {
    // 每次返回此页面都刷新
    if (!this.data.isOnLoad) {
      if (this.data.day_index == 0) {
        this.getTodayActivitiesInfo(this.data.today)
      } else {
        this.getDateActivities(this.data.day_index)
      }
    }
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

  getTodayActivitiesInfo(today) {
    // console.log(today)
    var now = new Date()
    // console.log(now)
    var todayParse = Date.parse(new Date(today))
    // console.log(Date.parse(now))
    var page = this
    var openid = app.globalData.openid
    courseCollection.where({
      course_date: today,
      course_start_time: _.gte('')
    }).get({
      success(res) {
        var result = res.data
        // console.log(res.data)
        // console.log(result)
        if (res.data.length != 0) {
          for (var i = 0; i < result.length; i++) {
            if (Date.parse(now) + 7200000 >= Date.parse(today + ' ' + result[i].course_start_time)) {
              result[i].isEnd = true
            } else {
              result[i].isEnd = false
            }
          }
          page.setData({
            "dates[0].empty": false
          })
          if (!page.data.isOnLoad && app.globalData.login) {
            // console.log("check")
            page.checkWhatISign(result, 0) 
          }
          app.loginCallback = isLogin => {
            if (isLogin) {
              // console.log("登录成功")
              page.checkWhatISign(result, 0)
              page.setData({
                isOnLoad: false
              })
            }
          }
          // console.log(Date.parse(today + ' ' + res.data[0].course_start_time))
        }
      }
    })
  },

  checkWhatISign(result, index) {
    let page = this
    // console.log(result)
    for (let i = 0; i < result.length; i++) {
      selectListCollection.where({
        _openid: app.globalData.openid,
        course_id: result[i]._id,
        enroll_flag: true
      }).get({
        success(re) {
          if (re.data.length != 0) {
            result[i].isSign = true
          } else {
            result[i].isSign = false
          }
          // console.log(page.data.dates[index])
          // console.log("查看列表活动是否已经预约")
          page.setData({
            [`dates[${index}].activities[${i}]`]: result[i]
          })
        }
      })
    }
  },

  /**
   * 李天红写的
   * 功能：从数据库获取所有协会信息
   */
  getAssociationsInfo() {
    var page = this
    managerCollection.where({
      association_uid: _.gte("")
    }).get({
      success(res) {
        page.setData({
          associations: res.data
        })
        // console.log("onLoad执行结束")
      }
    })
  },

  /**
   * 李天红写的
   * 功能：点击按钮跳转到协会详情页
   */
  navigateToAssociationDetail(e) {
    var index = e.currentTarget.dataset.idx
    app.globalData.association_uid = this.data.associations[index].association_uid
    wx.navigateTo({
      url: '../association/association',
    })
  },


  /**
   * 李天红写的
   * 功能：选择每日活动或者协会预约的id
   */
  chooseActivity: function (e) {
    this.setData({
      selection: e.currentTarget.dataset.selection
    })
    this.onReady()
  },

  /**
   * 李天红写的
   * 功能：点击日期获取当日的activity列表
   */
  clickTheDateActivity: function (e) {
    this.onReady()
    // console.log(e)
    var x = e.detail.x
    // console.log(e.currentTarget.dataset.idx)
    var index = e.currentTarget.dataset.idx
    // 让被点中的元素居中
    if (x > 250) {
      this.setData({
        pageX: -index * 60 + 180
      })
    } else if (x < 70) {
      this.setData({
        pageX: -index * 60 + 190
      })
    }
    this.setData({
      day_index: index
    })
    // console.log(this.data.dates[index].empty)
    if (index == 0) {
      this.getTodayActivitiesInfo(this.data.today)
    } else {
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
      course_date: day,
      course_start_time: _.gte('')
    }).get({
      success(res) {
        // console.log(res.data)
        var result = res.data
        if (result.length != 0) {
          // console.log(res.data)
          page.setData({
            [`dates[${index}].empty`]: false
          })
          // console.log("是我干的getDateActivities" )
          if (app.globalData.login) {
            page.checkWhatISign(result, index)
          }
        }
      }
    })
  },

  /**
   * 李天红写的
   * 功能：点击某个活动进入活动详情页
   */
  navigateToActivity: function (e) {
    // console.log(e.currentTarget.dataset.idx)
    // 1.将点击的活动id保存到全局变量
    var index = e.currentTarget.dataset.idx
    app.globalData.activityId = this.data.dates[this.data.day_index].activities[index]._id
    app.globalData.association_uid = this.data.dates[this.data.day_index].activities[index].association_uid
    // console.log(this.data.dates[this.data.day_index].activities[index]._id)
    // 2.跳转到活动详情页面
    wx.navigateTo({
      url: '../activityDetail/activityDetail',
    })

  },

  /**
   * 李天红写的
   * 功能：点击预约按钮
   */
  reserveBtn(e) {
    var index = e.currentTarget.dataset.idx
    // console.log(e.currentTarget.dataset.idx)
    var activity_id = this.data.dates[this.data.day_index].activities[index]._id
    // var openid = app.globalData.openid
    // 公共代码封装在utils文件里了
    utils.enroll(activity_id)
    this.setData({
      [`dates[${this.data.day_index}].activities[${index}].isSign`]: true
    })
  }
})