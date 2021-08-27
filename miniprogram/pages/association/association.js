// pages/association/association.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var managerCollection = db.collection("test_db_manager")
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    association: {},
    activities: [],
    color: "#8CA6FD"
  },

  onShow() {
    var page = this
    var uid = "1"
    var date = new Date()
    var today = "" + date.getFullYear() + "/" + (date.getMonth() + 1 < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "/" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate())
    // console.log(today)
    courseCollection.where({
      association_uid: uid,
      course_date: _.gte(today)
    }).get({
      success(res) {
        page.setData({
          activities: res.data
        })
      }
    })
    managerCollection.where({
      association_uid: uid
    }).get({
      success(res) {
        page.setData({
          association: res.data[0]
        })
        // console.log(res.data[0])
      }
    })
  }, 

  reserveBtn (e) {
    console.log(e.currentTarget.dataset.idx)
  }
})