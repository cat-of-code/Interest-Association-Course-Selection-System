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
    fixed: true,
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

    var user = {
      avatarUrl: app.globalData.avatarUrl
    }
    var users = this.data.users
    users.push(user)
    this.setData({
      users: users
    })
  },

  /**
   * 李天红
   * 退选活动
   */

  quit(e) {
    var page = this
    // console.log(e)
    wx.showModal({
      title: '取消活动',
      content: '确定要取消该活动',
      cancelText: '否',
      cancelColor: 'gray',
      confirmText: '是',
      confirmColor: '#8CA6FD',
      success(re) {
        if (re.cancel) {
          // 点击取消，默认隐藏弹框
        } else {
          // 点击是
          selectListCollection.doc(page.data.selectId).update({
            data: {
              enroll_flag: false
            },
            success(res) {
              // console.log(res)
              wx.showToast({
                title: '成功取消活动',
                icon: 'none',
                duration: 2000
              })
              page.getAvatarUrls(page.data.activityId)
              page.setData({
                haveOrdered: false
              })
            }
          })
        }
      }
    })
  },

  /**
   * 郭心德
   * NFC啟動
   */
  // 启动发现
  startDiscovery() {
    this.NFCAdapter.startDiscovery({
      success: res => {
        this.onDiscovered()
      },
      fail: error => {
        console.log("读取失败")
      }
    });
  },

  // 开始读取
  onDiscovered() {
    var page = this
    this.NFCAdapter.onDiscovered(res => {
      if (page.data.haveOrdered) {
        wx.navigateTo({
          url: '../certification/certification'
        })
      }
    });
  },

  onShow(options) {

    // 初始化
    this.NFCAdapter = wx.getNFCAdapter();
    // 获取NDEF对象
    this.NFCTab = this.NFCAdapter.getNdef()
    this.startDiscovery()

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
          page.setData({
            selectId: res.data[0]._id
          })
          if (res.data[0].enroll_flag) {
            page.setData({
              haveOrdered: true
            })
          }
        }
      }
    })

    // 显示已报名学员的头像
    this.getAvatarUrls(activityId)
  },

  onReady() {
    let page = this
    let height = app.globalData.windowHeight
    wx.createSelectorQuery().select('#provider').boundingClientRect(function (res) {
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
   * 李天红
   * 显示已报名学员的头像
   */

  getAvatarUrls(activityId) {
    var page = this
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
  },

  /**
   * 李天红
   * 跳转去活动认证
   */
  certificate(e) {
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
})