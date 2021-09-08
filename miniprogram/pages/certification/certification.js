// pages/certification/certification.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "Redsky",
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/EHTB2Xnk4vFZ0Udibiaaia9uoMpf5saSuqSRXEeuXmbOhusQhk2wUzicXia7LMu2zDnWh9He4Lan5oZlkuZiaTl1E05Q/132'
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var page = this
    var width = 0
    var height = 0
    var ratio = 1
    // 获取设备宽高，像素比
    wx.getSystemInfo({
      success: (result) => {
        width = result.windowWidth
        height = result.windowHeight
        ratio = result.pixelRatio
        // console.log('width: ' + width, 'height: ' + height)
        page.setData({
          width: width,
          height: height,
          ratio: ratio
        })
      },
    })
    // 给canvas设置初始样式
    var query = wx.createSelectorQuery()
    var canvas = ''
    var ctx = ''
    query.select('#certificate').fields({
      node: true,
      size: true,
    }).exec((res) => {
      canvas = res[0].node
      ctx = canvas.getContext('2d')
      page.setData({
        canvas: canvas,
        ctx: ctx
      })

      ctx.scale(ratio, ratio)
      canvas.width = width
      canvas.height = height

      var img = canvas.createImage()
      img.src = '../../img/certification.png'
      img.onload = () => ctx.drawImage(img, 0, 0, 812, 1200, 0, 0, width, height / 1200 * 812)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var page = this
    this.setData({
      nickName: app.globalData.nickName,
      avatar: app.globalData.avatarUrl,
      activity_id: app.globalData.activityId,
    })
    courseCollection.doc(this.data.activity_id).get({
      success(res) {
        page.setData({
          associationName: res.data.associationName,
          activityName: res.data.course_name
        })
      }
    })
  },

  getCertification(e) {
    // console.log(e)
    var canvas = this.data.canvas
    var ctx = this.data.ctx
    var width = this.data.width / 100
    var height = this.data.height / 120000 * 812
    var ratio = this.data.ratio
    // 开始渲染内容
    ctx.beginPath()
    // 设置字体
    ctx.lineWidth = 1
    ctx.font = "12px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif"

    ctx.strokeText(this.data.nickName + '同学：', 25 * width, 62 * height)
    ctx.strokeText('感谢您参与活动：', 30 * width, 68 * height)
    ctx.strokeText(this.data.activityName, 35 * width, 73 * height)
    ctx.strokeText('特发此证，以资鼓励！', 30 * width, 78 * height)
    ctx.strokeText(this.data.associationName, 60 * width, 85 * height)

    
    // 设置字体居中
    ctx.textAlign = 'center'
    ctx.strokeText(this.data.nickName, 51.5 * width, 54 * height)

    // 先画一个圆形
    ctx.arc(52 * width, 42 * height, 13 * width, 0, 2 * Math.PI)
    ctx.clip()  // 裁剪圆形

    var avatar = canvas.createImage()
    avatar.src = this.data.avatar
    avatar.onload = () => ctx.drawImage(avatar, 0, 0, 130, 130, 37 * width, 32 * height, 28 * width, 28 * width)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})