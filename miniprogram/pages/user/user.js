var app = getApp()
var db = wx.cloud.database()
var userCollection = db.collection("user")

Page({
  /**
   * 显示天气
   */
  data: {
    login: false,
    userInfo: {},
    projets:[ 
      {
        icon: "todo-list-o",
        text: "我的预约记录"
      },
      {
        icon: "label-o",
        text: "我的活动记录",
      },
      {
        icon: "orders-o",
        text: "我的报名记录"
      }
    ]
  },

  /**
   * 李天红写的
   * 功能：生命周期onShow，获取全局变量
   */
  onShow: function () {
    console.log("进入pages/user/user")
    var page = this
    if (app.globalData.login) {
      page.setData({
        login: app.globalData.login,
        userInfo: {
          nickName: app.globalData.nickName,
          avatarUrl: app.globalData.avatarUrl
        }
      })
    }
  },

  /**
   * 李天红写的
   * 功能：获取用户信息
   */
  getUserInfo: function (e) {
    var page = this
    var userInfo = e.detail.userInfo
    
    // 把登录数据添加到数据库
    userCollection.add({
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      },
      // 如果成功了
      success: function (res) {
        // 1.把用户名和头像保存到本页全局变量，login设置为true
        page.setData({
          login: true,
          userInfo: userInfo
        })
        // 2.把用户名和头像保存到整个weapp的全局变量
        app.globalData.nickName = userInfo.nickName
        app.globalData.avatarUrl = userInfo.avatarUrl
      }
    })
    // console.log(userInfo.nickName)
    // console.log(userInfo.avatarUrl)
  },
  
  loadInfo: function () {
    var page = this;
    // wx.getLocation({
    //   type: 'gcj02',
    //   success(res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     console.log(latitude, longitude);
    //     page.loadCity(latitude, longitude);
    //   }
    // })
  },
  /** 
  loadCity: function (latitude, longitude) {
    var page = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=D6WOzHaymzVVKvgiy8UbhQEznkgeK6BD&location='
        + latitude + ',' + longitude + '&output=json',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        var city = res.data.result.addressComponent.city;
        city = city.replace("市", "");
        page.setData({ city: city });
        page.loadWeather(city);
      }
    })
  },

  loadWeather: function (city) {
    var page = this;
    wx.request({
      url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + city,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        var future = res.data.data.forecast;
        var todayInfo = future.shift();
        var today = res.data.data;
        today.todayInfo = todayInfo;
        page.setData({ today: today});
        console.log(today.wendu);
      }
    });
  },
  */
  notify: function () {
    wx.showModal({
      title: '提示',
      content: '您没有该项操作权限',
    })
  },
  /**
   * 选课
   */
  select: function (e) {
    var page = this
    if (this.data.identity == "teacher") {
      page.notify()
    }
    else {
      wx.navigateTo({
        url: '../select/select'
      })
    }
  },
  /**
   * 开课
   */
  open: function (e) {
    var page = this
    if (this.data.identity == "student") {
      page.notify()
    }
    else {
      wx.navigateTo({
        url: '../openCourse/openCourse',
      })
    }
  },
  /**
   *查看课程
   */
  showCourse: function (e) {
    var page = this
    if (this.data.identity == "teacher") {
      page.notify()
    }
    else {
      wx.navigateTo({
        url: '../myCourse/myCourse',
      })
    }
  },

  /**
   * Github地址
   */
  github: function (e) {
    wx.setClipboardData({
      data: 'https://github.com/fanta04/courseSelectWeApp',
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
})