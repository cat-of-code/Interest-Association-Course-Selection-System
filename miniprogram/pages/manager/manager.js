// pages/manager_index/manager_index.js
var app = getApp()
var db = wx.cloud.database()
var manager = db.collection("test_db_manager")
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: "",
    disable: false,
    defaultType: true,
    passwordType: true,
    fixed: true,
  },


  onLoad() {
    var page = this
    manager.where({
      association_uid: _.gte('')
    }).get({
      success(res) {
        // console.log(res.data)
        const result = res.data
        const len = result.length
        for (let i = 0, len = result.length; i < len; ++i) {
          result[i].value = i
        }
        page.setData({
          associations: result,
          len: len
        })
      }
    })
  },

  onReady() {
    let page = this
    let height = app.globalData.windowHeight
    wx.createSelectorQuery().select('#provider').boundingClientRect(function(res) {
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

  radioChange(e) {
    // console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.associations
    // console.log(items)
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = false
    }
    items[e.detail.value].checked = true

    this.setData({
      associations: items,
      index: e.detail.value
    })
  },

  setPassword: function (e) {
    // console.log(e.detail)
    this.setData({
      password: e.detail
    })

  },

  eyeStatus: function () {
    if (this.data.defaultType) {
      this.setData({
        passwordType: false,
        defaultType: false,
      })
    } else {
      this.setData({
        passwordType: true,
        defaultType: true,
      })
    }
  },

  judge: function (password) {
    var flag = false
    if (password == "") {
      wx.showModal({
        title: '提示',
        content: '请输入密码',
      })
      flag = true
    }
    return flag
  },

  handleLogin: function (e) {
    var page = this
    var id = page.data.associations[page.data.index]._id
    var password = page.data.password
    //var name= page.data.selectData[index]
    var index = page.data.index

    if (page.judge(id, password) == false) {
      manager.where({
        _id: id,
        password: password,
      }).get().then(res => {
        // console.log(res.data)
        if (res.data.length == 0) {
          wx.showModal({
            title: '提示',
            content: '登录失败',
          })
        } else {
          // console.log( uid, password)
          // console.log(res.data[0].association_name)
          app.globalData.managerLogin = true
          // console.log(res.data[0].association_name)
          app.globalData.association_name = res.data[0].association_name
          app.globalData.association_uid = res.data[0].association_uid
          // console.log(app.globalData.association_uid)
          wx.switchTab({
            url: '../user/user',
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
})