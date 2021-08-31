// pages/myActivities/myActivities.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var userCollection = db.collection("test_db_user")
var selectListCollection = db.collection("test_db_selectList")
var _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: [],
    userInfo: {},
    current_time: "",
    refresh_triggered: true,
    switch1: true,
    switch2: true,
    old_switch1: true,
    old_switch2: true,
    value1: 0,
    menu: {
      switchTitle1: '显示预约中',
      switchTitle2: '显示已结束',
      itemTitle: '筛选',
      option1: [{
          text: '日期倒序',
          value: 0
        },
        {
          text: '日期升序',
          value: 1
        },
      ],
    }
  },
  /**
   * 退选课程
   */
  quit_course(e) {
    var course_id = e.currentTarget.dataset.course_id
    var user_id = e.currentTarget.dataset.user_id
    // console.log(course_id)
    // console.log(user_id)
    if (user_id == this.data.userInfo.openid) {
      // 判断用户是否为本用户id
      Dialog.confirm({
          title: '确认',
          message: '是否确认退选活动',
        })
        .then(() => {
          // on confirm
          wx.cloud.callFunction({
            name: 'quitCourse',
            data: {
              user_id: user_id,
              course_id: course_id
            },
            success: res => {
              // console.log('[云函数] [quitCourse] ' + res);
              Toast.success('退选成功');
              this.onLoad();
            },
            fail: err => {
              // console.error('[云函数] [quitCourse]', err);
              Toast.fail('退选失败');
            }
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  /**
   * 跳转到课程详细页面
   */
  into_coursePage: function (e) {
    // console.log(e)
    // app.globalData.courseName = e.currentTarget.dataset.course_id
    var jf_course_id = JSON.stringify(e.currentTarget.dataset.course_id)
    wx.navigateTo({
      url: '../activityDetail/activityDetail?course_id=' + jf_course_id,
    })
    /**
     * 代码建议👇👇👇👇👇亲测能用-----by 李天红
     */

     /*
    // 1.把course_id保存到全局变量，跳转到详情页面再取出
    var course_id = e.currentTarget.dataset.course_id
    app.globalData.activityId = course_id
    // 2.获取协会的uid，保存到全局变量，跳转到详情页面再取出
    courseCollection.doc(course_id).get({
      success(res) {
        // console.log(res.data)
        app.globalData.association_uid = res.data.association_uid
        // 3.跳转
        wx.navigateTo({
          url: '../activityDetail/activityDetail'
        })
      }
    })
    */
    /**
     * 代码建议👆👆👆👆👆亲测能用-----by 李天红
     */
    
  },

  async getMyCourses(user_openid) {
    var courseInfos = []
    var p = await new Promise((resolve, reject) => {
      selectListCollection.where({
        _openid: user_openid,
      }).get().then(res => {
        courseInfos = res.data
        resolve(courseInfos)
      })
    })
    // console.log(courseInfos)
    return courseInfos
  },

  addMyCourses: function (course_ids) {
    var prom = []
    var cf = {}
    var ef = {}
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时
    var h = date.getHours();
    //分
    var m = date.getMinutes();
    //秒
    var s = date.getSeconds();
    // console.log(Y + M + D + h + m)

    for (var i = 0; i < course_ids.length; i++) {
      // console.log(course_ids[i])
      cf[course_ids[i].course_id] = course_ids[i].enroll_flag
      var p = new Promise((resolve, reject) => {
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getCourseBInfos',
            // 传给云函数的参数
            data: {
              course_id: course_ids[i].course_id
            },
          })
          .then(res => {
            var new_res = res.result.list[0]
            // console.log(course_ids[i].course_id)
            // course_ids[i]['enroll_flag'] = true
            // console.log(res)
            resolve(new_res)
          })
      })
      // console.log(p)
      prom.push(p)
    }
    Promise.all(prom).then(res => {
      // console.log(res)
      if (this.data.value1 == 0){
        res.sort(function (a, b) {
          return Number(b.date_time_number + b.end_time_number) - Number(a.date_time_number + a.end_time_number)
        });
      }else if(this.data.value1 == 1){
        res.sort(function (a, b) {
          return Number(a.date_time_number + a.end_time_number) - Number(b.date_time_number + b.end_time_number)
        });
      }
      this.setData({
        courses: res
      })
    })
    this.setData({
      courses_flag: cf,
      current_time: Y + M + D + h + m
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    if (app.globalData.login) {
      var nickName = app.globalData.nickName
      var user_openid = app.globalData.openid
      // console.log(nickName)
      // console.log(user_openid)
      // console.log(app.globalData.avatarUrl)
      var p1 = await this.getMyCourses(user_openid)
      await this.addMyCourses(p1)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(app.globalData.login)
    if (app.globalData.login) {
      this.setData({
        userInfo: {
          nickName: app.globalData.nickName,
          avatarUrl: app.globalData.avatarUrl,
          openid: app.globalData.openid
        }
      })
    } else {
      wx.switchTab({
        url: '../user/user',
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  refresh() {
    this.onLoad();
    this.setData({
      refresh_triggered: false
    })
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },

  onConfirm() {
    this.setData({
      old_switch1: this.data.switch1,
      old_switch2: this.data.switch2
     });
    this.onLoad();
    this.selectComponent('#item').toggle();
  },

  onSwitchClose(e){
    // console.log(e)
    this.setData({
      switch1: this.data.old_switch1,
      switch2: this.data.old_switch2
     });
  },

  onValue1Change({detail}){
    this.setData({ value1: detail });
    this.onLoad();
  },

  onSwitch1Change({ detail }) {
    this.setData({
      switch1: detail,
      old_switch1: this.data.switch1
    });
  },

  onSwitch2Change({ detail }) {
    this.setData({
      switch2: detail,
      old_switch2: this.data.switch2
    });
  },

})
