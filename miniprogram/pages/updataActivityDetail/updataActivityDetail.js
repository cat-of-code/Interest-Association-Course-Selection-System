var utils = require('../../utils/util.js');
import request from '../../request/requestFunc.js';
var app = getApp()
var db = wx.cloud.database()
var activityCollection = db.collection("test_db_course")

Page({
  data: {
    activityName: '',
    startDate: utils.formatDay(new Date),
    startTime: "12:00",
    deadTime: "12:00",
    address: '',
    ownerName: '',
    phoneNumber: '',
    fileList: [],
    fileID: '',
    desc: ''
  },

  initActivityDetail: function (activity_id) {
    var page = this
    var temp = []
    var p = new Promise((resolve, reject) => {
      activityCollection.doc(
        activity_id
      ).get().then(res => {
        // console.log(res.data.img)
        var fileList = [{
          url: res.data.img
        }]
        page.setData({
          activity: res.data,
          fileList: fileList
        })
        // page.setData({
        //   activityName: res.data.course_name,
        //   startDate: res.data.course_date,
        //   startTime: res.data.course_start_time,
        //   deadTime: res.data.course_end_time,
        //   address: res.data.address,
        //   desc: res.data.dec,
        //   ownerName: res.data.creator,
        //   phoneNumber: res.data.creatorPhone,
        //   fileID: res.data.img,
        //   fileList: fileList
        // })
      })
    })
  },

  async onShow(options) {
    var activity_id = app.globalData.activity_id
    await this.initActivityDetail(activity_id)
  },

  //输入活动名称
  inputActivityName(e) {
    this.setData({
      'activity.course_name': e.detail.value
    })
  },

  //修改开始日期
  startDateChange(e) {
    this.setData({
      'activity.course_date': utils.formatDay(e.detail.value)
    })
  },

  //修改开始时间
  startTimeChange(e) {
    this.setData({
      'activity.course_start_time': e.detail.value
    })
  },

  //修改截止时间
  deadTimeChange(e) {
    this.setData({
      'activity.course_end_time': e.detail.value
    })
  },

  //输入地点
  inputAddress(e) {
    this.setData({
      'activity.address': e.detail.value
    })
  },


  //选择海报
  afterRead(event) {
    var page = this
    const {
      file
    } = event.detail;
    // console.log(event.detail.file.url)
    wx.cloud.uploadFile({
      cloudPath: "activity_img/" + Date.now() + '.png', // 上传至云端的路径
      filePath: event.detail.file.url,
      success: res => {
        // 返回文件 ID
        console.log(res)
        page.setData({
          'activity.img': res.fileID
        })
        const {
          fileList = []
        } = page.data
        fileList.push({
          ...file,
          url: res.data
        })
        page.setData({
          fileList
        })
        // console.log(page.data.fileList)
      },
      fail: console.error
    })
  },

  deleteImg(event) {
    var page = this
    wx.cloud.deleteFile({
      fileList: [page.data.activity.img],
      success: res => {
        // handle success
        // console.log(res.fileList)
        page.setData({
          fileList: []
        })
      },
      fail: console.error
    })
  },


  //输入活动简介
  inputDesc(e) {
    this.setData({
      'activity.dec': e.detail.value
    })
  },


  //输入称呼
  inputName(e) {
    this.setData({
      'activity.creator': e.detail.value
    })
  },

  //输入手机号
  inputPhone(e) {
    let phoneNumber = e.detail.value
    if (phoneNumber.length === 11) {
      if (this.checkPhoneNum(phoneNumber)) {
        this.setData({
          phoneNumber: phoneNumber
        })
      }
    } else {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error'
      })
    }
  },

  checkPhoneNum: function (phoneNumber) {
    let str = /^1\d{10}$/
    if (str.test(phoneNumber)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        icon: 'error'
      })
      return false
    }
  },

  //点击确认修改
  updataInfo() {
    // var activityName = this.data.activityName
    // var beginDate = this.data.startDate
    // var startTime = this.data.startTime
    // var deadTime = this.data.deadTime
    // var address = this.data.address
    // var creator = this.data.ownerName
    // var creatorPhone = this.data.phoneNumber
    // var imgID = this.data.fileID
    // var desc = this.data.desc
    var activity = this.data.activity
    if (activity.course_date == "" || activity.course_start_time == "" || activity.course_end_time == "" || activity.address == "" || activity.creator == "" || activity.creatorPhone == "" || activity.img == "" || activity.course_name == "" || activity.dec == "") {
      wx.showModal({
        title: '修改失败',
        content: '请填写完整活动的内容',
      })
    } else {
      activityCollection.doc(activity._id).update({
        data: {
          course_date: activity.course_date,
          course_start_time: activity.course_start_time,
          course_end_time: activity.course_end_time,
          address: activity.address,
          creator: activity.creator,
          creatorPhone: activity.creatorPhone,
          img: activity.img,
          course_name: activity.course_name,
          dec: activity.dec,
        },
        success(res) {
          wx.showToast({
            title: '修改成功',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

})