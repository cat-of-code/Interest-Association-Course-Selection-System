// pages/certification/certification.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certificated: false
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

      // page.setWeapp(canvas, ctx, width / 100, height / 120000 * 812)
      page.getCertification()
    })
  },


  getCertification() {
    // console.log(e)
    var canvas = this.data.canvas
    var ctx = this.data.ctx
    var width = this.data.width / 100
    var height = this.data.height / 120000 * 812
    // 开始渲染内容
    ctx.beginPath()
    // 设置字体
    ctx.lineWidth = 1
    ctx.font = "12px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif"

    this.setActivityText(ctx, width, height)

    this.setWeapp(canvas, ctx, width, height)

    this.setData({
      certificated: true
    })
  },

  setActivityText(ctx, width, height) {
    // console.log("设置字", Date.now())
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
        ctx.beginPath()
        ctx.strokeText(app.globalData.nickName + '同学：', 25 * width, 62 * height)
        ctx.strokeText('感谢您参与活动：', 30 * width, 68 * height)
        ctx.strokeText(res.data.course_name, 35 * width, 73 * height)
        ctx.strokeText('特发此证，以资鼓励！', 30 * width, 78 * height)
        ctx.strokeText(res.data.associationName, 60 * width, 84 * height)
        ctx.strokeText(res.data.course_date.replace('/', '年').replace('/', '月') + '日', 55 * width, 88 * height)
        ctx.closePath()
        setTimeout(page.setAvatar, 200)
      }
    })
  },

  setWeapp(canvas, ctx, width, height) {
    // 小程序码
    ctx.beginPath()
    ctx.strokeText('长按识别微信小程序', 60 * width, 110 * height)
    var weapp = canvas.createImage()
    weapp.src = '../../img/weapp.jpg'
    weapp.onload = () => ctx.drawImage(weapp, 0, 0, 258, 258, 20 * width, 105 * height, 20 * width, 20 * width)
    ctx.closePath()
  },

  setAvatar() {
    var canvas = this.data.canvas
    var ctx = this.data.ctx
    var width = this.data.width / 100
    var height = this.data.height / 120000 * 812
    ctx.beginPath()
    // 设置字体居中
    ctx.textAlign = 'center'
    ctx.strokeText(this.data.nickName, 51.5 * width, 54 * height)

    // 先画一个圆形
    // ctx.save()
    ctx.arc(52 * width, 42 * height, 13 * width, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.clip() // 裁剪圆形

    var avatar = canvas.createImage()
    avatar.src = this.data.avatar
    avatar.onload = () => ctx.drawImage(avatar, 0, 0, 130, 130, 37 * width, 32 * height, 28 * width, 28 * width)
    // ctx.restore()
  },

  // 下载海报
  downloadPost(e) {
    // console.log(e)
    this.getCanvasImg(this.data.canvas)
  },

  getCanvasImg(canvas) {
    var page = this
    wx.canvasToTempFilePath({
      canvas: canvas,
      height: canvas.height * 0.85,
      success(res) {
        // 查看是否授权
        wx.getSetting({
          success(r) {
            // 如果没有授权
            if (!r.authSetting['scope.writePhotosAlbum']) {
              // console.log('没有授权')
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success(re) {
                  // console.log('授权成功')
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(rs) {
                      // console.log(rs, '保存成功')
                      wx.showToast({
                        title: '保存成功',
                      })
                    },
                    fail(err) {
                      // console.log(err)
                    }
                  })
                },
                fail(err) {
                  // console.log('调用权限失败')
                }
              })
            } else {
              // console.log('已经授权')
              // 如果授权了
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  // console.log(res, '保存成功')
                  wx.showToast({
                    title: '保存成功',
                  })
                },
                fail(err) {
                  // console.log(err)
                }
              })
            }
          }
        })
      },
      fail() {
        // console.log('err')
        // return 'err'
      }
    }, )
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (this.data.certificated) {
      console.log('hello world')
    }
  }
})