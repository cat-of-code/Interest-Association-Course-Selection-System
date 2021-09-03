var utils = require('../../utils/util.js');
import request from '../../request/requestFunc.js';
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")

Page({
  data: {
    associationName: app.globalData.association_name,
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


  onLoad: function (options) {},

  onShow: function () {

  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },


  //输入活动名称
  inputActivityName(e) {
    this.setData({
      activityName: e.detail.value
    })
  },

  //修改开始日期
  startDateChange(e) {
    // console.log(e)
    this.setData({
      startDate: utils.formatDay(e.detail.value)
    })
    // console.log(this.data.startDate)
  },

  //修改开始时间
  startTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },

  //修改截止时间
  deadTimeChange(e) {
    this.setData({
      deadTime: e.detail.value
    })
  },

  //输入地点
  inputAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },


  //选择海报
  afterRead(event) {

    const {
      file
    } = event.detail;
    // console.log(event.detail.file.url)
    wx.cloud.uploadFile({
      cloudPath: "activity_img/" + Date.now() + '.png', // 上传至云端的路径
      filePath: event.detail.file.url,
      success: res => {
        // 返回文件 ID
        // console.log(new Date)
        // console.log(res)
        this.setData({
          fileID: res.fileID
        })
        const {
          fileList = []
        } = this.data
        fileList.push({
          ...file,
          url: res.data
        })
        this.setData({
          fileList
        })
        // console.log(this.data.fileList)
      },
      fail: console.error
    })
  },

  //删除图片
  deleteImg(event) {
    wx.cloud.deleteFile({
      fileList: [this.data.fileID],
      success: res => {
        // handle success
        console.log(res.fileList)
        this.setData({
          fileList: []
        })
      },
      fail: console.error
    })
  },


  //输入活动简介
  inputDecs(e) {
    this.setData({
      desc: e.detail.value
    })
  },


  //输入称呼
  inputName(e) {
    this.setData({
      ownerName: e.detail.value
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

  //点击提交
  submitInfo() {
    var activityName = this.data.activityName
    var beginDate = this.data.startDate
    var startTime = this.data.startTime
    var deadTime = this.data.deadTime
    var address = this.data.address
    var creator = this.data.ownerName
    var creatorPhone = this.data.phoneNumber
    var imgID = this.data.fileID
    var desc = this.data.desc
    if (beginDate == "" || startTime == "" || deadTime == "" || address == "" || creator == "" || creatorPhone == "" || imgID == "" || activityName == "" || desc == "") {
      wx.showModal({
        title: '发布失败',
        content: '请填写完整活动的内容',
      })
    } else {
      courseCollection.add({
        data: {
          associationName: app.globalData.association_name,
          association_uid: app.globalData.association_uid,
          course_date: beginDate,
          course_start_time: startTime,
          course_end_time: deadTime,
          address: address,
          creator: creator,
          creatorPhone: creatorPhone,
          img: imgID,
          course_name: activityName,
          dec: desc,
        }
      }).then(res => {
        wx.showToast({
          title: '发布成功',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)

      }).catch(err => {
        // console.log(err)
      })
    }
  }

})