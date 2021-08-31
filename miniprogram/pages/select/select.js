// pages/select/select.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var managerCollection = db.collection("test_db_manager")
var selectListCollection = db.collection("test_db_selectList")
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates: [],                  // 保存未来30天的活动列表
    associations: [],           // 协会列表
    selection: 0,               // 当前选的是“每日活动”或者“协会信息”的id
    color: "#8CA6FD",           // 统一颜色
    day_index: 0,               // 日期索引，当前查看的是第几天的活动内容
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
    date = new Date()
    var today = "" + date.getFullYear() + "/" + (date.getMonth() + 1 < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "/" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate())
    // console.log(today)
    // console.log(date)
    // console.log(date.getMonth() + 1)
    this.getTodayActivitiesInfo(today)

    // 从数据库获取所有协会信息
    this.getAssociationsInfo()
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
          // console.log(result)
          // console.log(Date.parse(today + ' ' + res.data[0].course_start_time))
          page.setData({
            "dates[0].empty": false,
            "dates[0].activities": result
          })
        }
      }
    })
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
      this.setData({
        day_index: index
      })
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
        if (res.data.length != 0) {
          // console.log(res.data)
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
    async reserveBtn(e) {
    var page = this
    var index = e.currentTarget.dataset.idx
    // console.log(e.currentTarget.dataset.idx)
    var activity_id = this.data.dates[this.data.day_index].activities[index]._id
    var openid = app.globalData.openid
    // 判断是否登录
    if (app.globalData.login) {
      var now = new Date()
      var date = now.getFullYear() + "/" + ((now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + "/" + (now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate())
      var time = (now.getHours() < 10 ? ('0' + now.getHours()) : now.getHours()) + ":" + (now.getMinutes() < 10 ? ('0' + now.getMinutes()) : now.getMinutes())

      var info = await this.searchSelectionCollection(openid, activity_id)
      if (info.isExisted) {
        if (info.isEnrollFlag) {
          // 如果报名了
          wx.showToast({
            title: '您已报名',
            icon: 'none',
            duration: 2000
          })
        } else {
          // 没有报名，如果记录存在，把enroll_flag改成true即可
          await this.updateMyActivityStatus(info.select_id)
        }
      } else {
        // 记录不存在，插入到数据库
        await this.insertMyNewActivity(activity_id, date, time)
      }
    } else {
      // 没有登录，跳转登录页面
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  searchSelectionCollection(openid, activity_id) {
    var result = {
      isExisted: false,
      select_id: "",
      isEnrollFlag: false
    }
    // 首先查询这条记录存不存在
    selectListCollection.where({
      _openid: openid,
      course_id: activity_id
    }).get({
      success(res) {
        console.log(res.data)
        if (res.data.length != 0) {
          result.isExisted = true
          result.select_id = res.data[0]._id
          // 如果存在且已经报名了
          if (res.data[0].enroll_flag) {
            result.isEnrollFlag = true
          }
          return result
        } else {
          return result
        }
      }
    })
  },

  updateMyActivityStatus(select_id) {
    selectListCollection.doc(select_id).update({
      data:{
        enroll_flag: true
      },
      success (res) {
        wx.showToast({
          title: '预约成功',
        })
      }
    })
  },

  insertMyNewActivity(activity_id, date, time) {
    selectListCollection.add({
      data: {
        course_id: activity_id,
        date: date,
        time: time,
        enroll_flag: true
      },
      success (res) {
        // console.log(res)
        // 预约成功，弹出提示，显示出已预约按钮
        page.setData({
          [ `page.data.dates[${page.data.day_index}].activities[${index}].enroll_flag`]: true
        })
        wx.showToast({
          title: '预约成功',
        })
      }
    })
  }
})