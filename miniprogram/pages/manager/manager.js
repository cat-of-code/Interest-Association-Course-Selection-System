// pages/manager_index/manager_index.js
var app = getApp()
var db = wx.cloud.database()
var manager = db.collection("test_db_manager")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['-请选择-', '篮球协会', '跑步协会', '瑜伽协会', '乒乓球协会', '足球协会', '网球协会'], //下拉列表的数据
    index: 0, //选择的下拉列表下标
    password: "",
    disable: false,
    name: "",

  },
  setPassword: function (e) {
    // console.log(e.detail)
    this.setData({
      password: e.detail
    })

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
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    // console.log(Index)
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },

  handleLogin: function (e) {
    var page = this
    var uid = page.data.index
    var password = page.data.password
    //var name= page.data.selectData[index]
    var index = page.data.index

    if (page.judge(uid, password) == false) {
      manager.where({
        xiala_id: uid,
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
          app.globalData.association_name = res.data[0].association_name
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