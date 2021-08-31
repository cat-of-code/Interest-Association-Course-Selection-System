// pages/select/select.js
var utils = require('../../utils/util.js');
var app = getApp()
var db = wx.cloud.database()


var activityCollection = db.collection("test_db_course")
var activityListCollection = db.collection("list")
var stuListCollection = db.collection("stuList")

var _ = db.command
// console.log(activityCollection)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_date:0,
    activity: [],
    flag:false,
    // stuName:app.globalData.username
  },
  /**
   * 退选课程
   */
  quit(e){
    let id = e.target.id
    console.log(e)
    activityCollection.doc(id).remove().then(res=>{
      wx.showToast({
      title: '取消成功',})
    })
    activityCollection.doc(id).get().then(res=>{
      wx.cloud.deleteFile({
        fileList:[res.data.imgID],
        success:res=>{
          console.log(res.fileList)
          
        },
        fail:console.error
      })
    })
    this.refresh()
  },
  /**
   * 跳转到课程详细页面修改
   */
  updata(e) {
    console.log(e.target.id)
    app.globalData.activityName = e.target.id
    wx.navigateTo({
      url: '../updataActivityDetail/updataActivityDetail',
    })
  },
  
  addMyActivity:function(associationName){
    var temp = []
    var prom = []
    var p = new Promise((resolve,reject)=>{
      activityCollection.where({
        associationName: associationName
      }).get().then(res => {
        // resolve(res.data[0])
        this.setData({activity:res.data})
        console.log(this.data.activity)
      })
    })
    this.setCurrentDate()
    console.log("currnt_time:" + this.data.current_date)
  },

  setCurrentDate:function(){
    var current_date = utils.formatDay(new Date)
    var num2 = parseInt(current_date.slice(0,4))*10000+parseInt(current_date.slice(5,7))*100+parseInt(current_date.slice(8,10))
    console.log(num2)
    this.setData({current_date:num2})
  },

  /**
 * 生命周期函数--监听页面加载
 */
  async onLoad(options) {
    var stuName = app.globalData.association_name
    // var stuName = "摄影DV联合会"
    await this.addMyActivity(stuName)
  
  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async refresh() {
    var stuName = app.globalData.association_name
    // var stuName = "摄影DV联合会"
    await this.addMyActivity(stuName)
 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  
})