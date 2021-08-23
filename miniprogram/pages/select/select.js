// pages/select/select.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("course")
var courseListCollection = db.collection("list")
var stuListListCollection = db.collection("stuList")
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [{
      name: "篮球",
    }, {
      name: "瑜伽",
    }],
    disable: false,
    dates: [],
    associations: [{
      name: "篮球",
    }, {
      name: "瑜伽",
    }, {
      name: "乒乓球",
  }],
    selection: 0
  },

  /**
   * 李天红写的
   * 生命周期函数
   */
  onLoad: function (e) {
    console.log("进入pages/select/select")
    // 获取30天的日期
    var date = new Date()
    var page = this
    var dates = [{
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    }]
    for (let index = 0; index < 29; index++) {
      date = new Date(Date.parse(date) + 86400000)
      dates.push({
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      })
    }
    page.setData({
      dates: dates
    })
    // TODO: 从数据库中获取每日活动当天的活动
  },

  
  /**
   * 李天红写的
   * 功能：选择每日活动或者协会预约的id
   */
  chooseActivity: function (e) {
    this.setData({
      selection: e.detail.index
    })
    // console.log(e.detail.index)
  },

  /**
   * 李天红写的
   * 功能：点击日期获取当日的activity列表
   */
  clickTheDateActivity: function (e) {
    console.log(e.detail.index)
    // TODO: 从数据库中获取每日活动当天的活动
    
  },

  /**
   * 李天红写的
   * 功能：点击某个活动进入活动详情页
   */
  clickActivity: function (e) {
    console.log(e.currentTarget.dataset.idx)
    wx.redirectTo({
      url: '../courseDetail/courseDetail',
    })
    
  },

 
    /**
     * 选课
     */
    select:function(e){
      let courseName = e.target.id
      // console.log(courseName)
      // console.log(app.globalData.username)
      courseListCollection.where({
          stuName:app.globalData.username,
          courseName:courseName
      }).count().then(res => {
        console.log(res)
        if (res.total != 0) {
          console.log(res)
          wx.showModal({
            title: '提示',
            content: '不能重复选课',
          })
        }
        else {
          courseCollection.where({
            data: {
              courseName: courseName
            }
          }).get().then(res => {
            if (res.data.num == 0) {
              wx.showModal({
                title: '提示',
                content: '本课程人数已满',
              })
            }
            else {
              stuListListCollection.where({
                courseName:courseName
              }).count().then(res=>{
                if(res.total==0){
                  stuListListCollection.add({
                    data:{
                      courseName:courseName,
                      stuName:new Array(app.globalData.username)
                    }
                  })
                }
                else {
                  stuListListCollection.where({
                    courseName:courseName
                  }).update({
                    data:{
                      stuName:_.push(app.globalData.username)
                    }
                  })
                }
              })
              //为“我的课程”添加课程数据
              courseListCollection.where({
                stuName:app.globalData.username
              }).count().then(res=>{
                if(res.total == 0){
                  courseListCollection.add({
                    data:{
                      stuName:app.globalData.username,
                      courseName:new Array(courseName)
                    }
                  })
                }
                else{
                  courseListCollection.where({
                    stuName:app.globalData.username
                  }).update({
                    data:{
                      courseName:_.push(courseName)
                    }
                  })
                }
              })
              //对应课程余量-1
              wx.cloud.callFunction({
                name:"minusCourseNum",
                data:{
                  courseName:courseName
                }
              }).then(res=>{
                wx.showToast({
                  title: '选课成功',
                })
              })
              this.data.disable = true
            }
          })
        }
      })
    },
    /**
     * 跳转到课程详细页面
     */
    into_coursePage:function(e){
      // console.log(e.currentTarget.dataset.coursename)
      app.globalData.courseName = e.currentTarget.dataset.coursename
      wx.navigateTo({
        url: '../courseDetail/courseDetail',
      })
    },
    /**
   * 生命周期函数--监听页面加载
   */
    // onLoad: function (options) {
    //   courseCollection.get().then(res=>{
    //     this.setData({
    //       courses:res.data
    //     })
    //     // console.log(this.data.courses)
    //   })
    // },

    

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    refresh: function () {
      wx.showLoading({
        title: '请稍等',
      })
      courseCollection.get().then(res => {
        this.setData({
          courses: res.data
        })
        // console.log(this.data.courses)
      })
      wx.hideLoading()
    },
    refreshAbort:function(){
      wx.showToast({
        title: '刷新成功',
      })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
  
})