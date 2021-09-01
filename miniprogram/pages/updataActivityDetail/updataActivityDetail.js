var utils = require('../../utils/util.js');
import request from '../../request/requestFunc.js';
var app = getApp()
var db = wx.cloud.database()
var activityCollection = db.collection("test_db_course")

Page({
  data: {
    matchArr:['篮球协会', '跑步协会', '瑜伽协会', '乒乓球协会', '足球协会', '网球协会','摄影DV联合会','乐益会','书法协会', '舞蹈协会', '羽毛球协会', '乐器协会'],
    matchIndex:0,
    activityName:'',
    startDate: utils.formatDay(new Date),
    startTime: "12:00",
    deadTime: "12:00",
    address:'',
    ownerName: '',
    phoneNumber: '',
    fileList: [],
    fileID:'',
    desc:''
  },

  initActivityDetail:function(activityName){
    var temp = []
    var p = new Promise((resolve,reject)=>{
      activityCollection.where({
        _id: activityName
      }).get().then(res => {
        console.log(res.data[0])
        wx.cloud.getTempFileURL({
          fileList: [res.data[0].img],
          success: res => {
            console.log(res.fileList[0].tempFileURL)
            console.log(this.data.fileList)
            temp[0]={url:res.fileList[0].tempFileURL, name:"11"}
            this.setData({fileList:temp})
            console.log(this.data.fileList)
          },
          fail: console.error
        })
        this.setData({matchIndex:app.globalData.association_uid-1,activityName:res.data[0].course_name, startDate:res.data[0].course_date, startTime:res.data[0].course_start_time, deadTime:res.data[0].course_end_time, address:res.data[0].address, desc:res.data[0].dec, ownerName:res.data[0].creator, phoneNumber:res.data[0].creatorPhone, fileID:res.data[0].img})
      })
    })
  },

  async onLoad(options) {
    var activityName = app.globalData.activityName
    await this.initActivityDetail(activityName)
  
  },

  // onLoad: function (options) {

    
  // },

  onShow: function () {
  
  },


  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  },

  //修改比赛类型
  matchChange(e){
    this.setData({
      matchIndex: e.detail.value
    })
  },

  //输入活动名称
  inputActivityName(e){
    this.setData({
      activityName: e.detail.value
    })
  },

  //修改开始日期
  startDateChange(e){
    this.setData({
      startDate: e.detail.value
    })
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
  inputAddress(e){
    this.setData({
      address: e.detail.value
    })
  },


  //选择海报
  afterRead(event) {

    const { file } = event.detail;
    console.log(event.detail.file.url)
    wx.cloud.uploadFile({
      cloudPath: this.data.activityName +'.png', // 上传至云端的路径
      filePath: event.detail.file.url,
      success: res => {
        // 返回文件 ID
        console.log(res)
        this.setData({fileID:res.fileID})
        const { fileList = [] } = this.data
        fileList.push({ ...file, url: res.data })
        this.setData({ fileList })
        console.log(this.data.fileList)
      },
      fail: console.error
    })
  },

  deleteImg(event){
    wx.cloud.deleteFile({
      fileList: [this.data.fileID],
      success: res => {
        // handle success
        console.log(res.fileList)
        this.setData({fileList:[]})
      },
      fail: console.error
    })
  },


  //输入活动简介
  inputDecs(e){
    this.setData({
      desc: e.detail.value
    })
  },


  //输入称呼
  inputName(e){
    this.setData({
      ownerName: e.detail.value
    })
  },

  //输入手机号
  inputPhone(e){
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  //点击确认修改
  updataInfo(){
    var associationName = this.data.matchArr[parseInt(this.data.matchIndex)]
    var activityName = this.data.activityName
    var beginDate = this.data.startDate
    var startTime = this.data.startTime
    var deadTime = this.data.deadTime
    var address = this.data.address
    var creator = this.data.ownerName
    var creatorPhone = this.data.phoneNumber
    var imgID = this.data.fileID
    var desc = this.data.desc
    if(associationName==""||beginDate==""||startTime==""||deadTime==""||address==""||creator==""||creatorPhone==""||imgID==""||activityName==""||desc==""){
      wx.showModal({
        title: '修改失败',
        content: '请填写完整活动的内容',
      })
    }
    else{
      activityCollection.doc(app.globalData.activityName).update({
        data:{
          associationName:associationName,
          course_date:beginDate,
          couser_start_time:startTime,
          course_end_time:deadTime,
          address:address,
          creator:creator,
          creatorPhone:creatorPhone,
          img:imgID,
          course_name:activityName,
          dec:desc,
        }
      }).then(res=>{
        wx.showToast({
          title: '修改成功',
          duration:1000
        })
        setTimeout(function(){
          wx.navigateTo({
            url: '../myCreatedActivity/myCreatedActivity',
          })
        },1000)
        
      }).catch(err=>{
        console.log(err)
      })
    } 
  }

})