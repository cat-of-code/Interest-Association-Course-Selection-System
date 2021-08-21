const db = wx.cloud.database()
const userInfo = db.collection('userInfo')
var app = getApp()

Page({
  data: {
    id: 0,
    openid: "",
    username: "",
    uid: "",
    password: "",
    identity: ""
  },


  getUserInfo: function (e) {
    userInfo.add({
      data: {
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl
      },
    }).then(res => {
      userInfo.doc(res._id).get({
        success(re){
          app.globalData.userInfo = res.data
        }
      })
    }).catch(err => {
      wx.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 2000
      })
    })
  },

  onShow: function (e) {
    var time = 0
    var login = false
    var page = this
    var timeStamp = Date.parse(new Date())

    if (wx.cloud) {
      wx.cloud.callFunction({
        name: "getOpenId"
      }).then(res => {
        // this.globalData.openid = res.result.openid
        page.data.openid = res.result.openid
      })
    }

    userCollection.where({
      _openid: page.data.openid
    }).get({
      success: function (res) {
        page.setData({
          username: res.data[0].username,
          uid: res.data[0].uid,
          timeStamp: res.data[0].timeStamp,
          identity: res.data[0].identity,
          id: res.data[0]._id
        })
        app.globalData.id = res.data[0]._id
        time = res.data[0].timeStamp
        if (timeStamp < time + 86400 * 1000 * 7) {
          page.setData({
            password: res.data[0].password
          })
        }
        
        userCollection.doc(res.data[0]._id).update({
          data: {
            timeStamp: Date.parse(new Date())
          },
          success: function (re) {
            wx.redirectTo({
              url: '../user/user',
            })
          }
        })
        
      }
    })
  },

  /**
   * 设置姓名，账号，密码，身份
   */
  setName: function (e) {
    this.setData({
      username: e.detail
    })
    app.globalData.username = this.data.username
  },
  setUid: function (e) {
    this.setData({
      uid: e.detail
    })
    app.globalData.uid = this.data.uid

  },
  setPassword: function (e) {
    this.setData({
      password: e.detail
    })
    app.globalData.password = this.data.password
  },
  onChange: function (e) {
    this.setData({
      identity: e.detail
    })
    app.globalData.identity = this.data.identity
  },
  /**
   * 检查信息是否完整
   */
  judge: function (uid, username, password, identity) {
    var flag = false
    if (username == "") {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
      })
      flag = true
    } else if (uid == "") {
      wx.showModal({
        title: '提示',
        content: '请输入账号',
      })
      flag = true
    } else if (password == "") {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
      })
      flag = true
    } else if (identity == "") {
      wx.showModal({
        title: '提示',
        content: '请选择身份',
      })
      flag = true
    }
    return flag
  },
  /**
   * 注册
   */
  handleReg: function () {
    var username = this.data.username
    var uid = this.data.uid
    var password = this.data.password
    var identity = this.data.identity
    var page = this
    // if (identity == "teacher") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '教师不可以注册',
    //   })
    //   return
    // }
    

    if (page.judge(uid, username, password, identity) == false) {
      userCollection.where({
        uid: uid,
        username: username
      }).count().then(res => {
        console.log(res.total)
        if (res.total != 0) {
          wx.showModal({
            title: '提示',
            content: '用户已存在',
          })
        } else {
          userCollection.add({
            data: {
              uid: uid,
              username: username,
              password: password,
              identity: identity,
              courses: [],
              timeStamp: Date.parse(new Date())
            },
            success: function (res) {
              wx.redirectTo({
                url: '../user/user',
              })
            }
          })
        }
      })
    }
  },
  /**
   * 登录
   */
  handleLogin: function () {
    var username = this.data.username
    var uid = this.data.uid
    var password = this.data.password
    var identity = this.data.identity
    var page = this
    console.log(username, password)
    if (page.judge(uid, username, password, identity) == false) {
      userCollection.where({
        uid: uid,
        username: username,
        password: password,
        identity: identity
      }).get().then(res => {
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '登录失败',
          })
        } else {
          userCollection.doc(page.data.id).update({
            data: {
              timeStamp: Date.parse(new Date())
            },
            success: function (re) {
              wx.redirectTo({
                url: '../user/user',
              })
            }
          })
          // console.log(app.globalData.identity, app.globalData.uid, app.globalData.username, app.globalData.password)
          
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },

})