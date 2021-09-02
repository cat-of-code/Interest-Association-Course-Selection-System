// // pages/activityDetails/activityDetails.js

/******************************************/
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var selectListCollection = db.collection("test_db_selectList")
var managerCollection = db.collection("test_db_manager")
var userCollection = db.collection("test_db_user")
var utils = require('../../utils/util.js');

Page({
  /**
   * 页面初始化
   * */
  data: {
    showUploadTip: false,
    haveOrdered: false,
    status: true,
    envId: '',
    openId: '',
    left_color: "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/left-color.png",
  },

  toastHide: function () {
    // console.log("触发bindchange，隐藏toast")
    this.setData({
      status: true
    })
    // this.setData({status:status})
  },

  order: function () {
    utils.enroll(this.data.activityId)
    this.setData({
      // status: false,
      haveOrdered: true
    })
  },

  onShow(options) {
    var page = this
    var openid = app.globalData.openid
    var activityId = app.globalData.activityId
    var association_uid = app.globalData.association_uid
    var now = new Date()

    // console.log(openid)
    this.setData({
      openid: openid,
      activityId: activityId
    })
    
    // 获取活动详情信息
    courseCollection.doc(activityId).get({
      success(res) {
        page.setData({
          activity: res.data
        })
        if (Date.parse(now) + 7200000 >= Date.parse(res.data.course_date + ' ' + res.data.course_start_time)) {

          page.setData({
            isEnd: true
          })
        } else {
          page.setData({
            isEnd: false
          })
        }
      }
    })

    // 获取协会信息
    managerCollection.where({
      association_uid: association_uid
    }).get({
      success(res) {
        page.setData({
          association: res.data[0]
        })
        // console.log(res.data)
      }
    })

    // 判断此活动是否已经报名
    selectListCollection.where({
      _openid: openid,
      course_id: activityId,
    }).get({
      success(res) {
        if (res.data.length != 0) {
          if (res.data[0].enroll_flag) {
            page.setData({
              haveOrdered: true
            })
          }
        }
      }
    })

    // 显示已报名学员的头像
    selectListCollection.where({
      course_id: activityId,
      enroll_flag: true
    }).get({
      success(res) {
        // console.log(res.data)
        page.setData({
          users: res.data
        })
      }
    })
  },

  navBack(e) {
    wx.navigateBack({
      delta: 1
    })
  },

  navigateToAssociation(e) {
    wx.navigateTo({
      url: '../association/association',
    })
  }
})