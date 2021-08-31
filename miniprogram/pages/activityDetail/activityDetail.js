// // pages/activityDetails/activityDetails.js

/******************************************/
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var selectListCollection = db.collection("test_db_selectList")
var managerCollection = db.collection("test_db_manager")
// var course_id = ' Welcom to China'
// const_ = db.command
var course_id_var = ' '

Page({
  /**
   * 页面初始化
   * */
  data: {
    showUploadTip: false,
    haveOrdered: false,
    status: true,
    envId: '',
    openId: '',
    left_color: "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/left-color.png",
  },

  toastHide: function () {
    // console.log("触发bindchange，隐藏toast")
    this.setData({
      status: true
    })
    // this.setData({status:status})
  },

  order: function () {
    // console.log("触发了点击事件，弹出toast")

    this.setData({
      status: false,
      haveOrdered: true
    })
    selectListCollection.add({
      data: {
        course_id: course_id_var,
        date: "2021/08/30",
        enroll_flag: true,
        time: "17:00"
        // course_id : "010101" 
      },
      success: function (res) {
        // console.log('--------', course_id_var)
      }
    })
  },

  onShow(options) {
    var page = this
    var openid = app.globalData.openid
    var activityId = app.globalData.activityId
    var association_uid = app.globalData.association_uid
    // console.log(openid)
    this.setData({
      openid: openid
      // envId: options.envId
    })
    
    // 获取活动详情信息
    courseCollection.doc(activityId).get({
      success(res) {
        // console.log(res.data)
        page.setData({
          activity: res.data
        })
        association_uid = res.data.association_uid
      }
    })


    // 获取协会信息
    managerCollection.where({
      association_uid: association_uid
    }).get({
      success(res) {
        page.setData({
          association: res.data[0]
        })
        // console.log(res.data)
      }
    })

    // courseCollection.where({
    //   "activityName": "哈他瑜伽-平衡练习"

    // }).get({
    //   success(res) {
    //     // console.log('-----*********---', res)
    //     if (res.data.length != 0) {
    //       // console.log("res.data", res.data[0].activityDes)
    //       page.setData({
    //         activityIntroduceText_0: res.data[0].activityDess[0],
    //         activityIntroduceText_1: res.data[0].activityDess[1],
    //         activityIntroduceText_2: res.data[0].activityDess[2],
    //         activity_detail_image: res.data[0].imgID,
    //         activityName: res.data[0].activityName,
    //         coachImage: res.data[0].coachImg,
    //         coachName: res.data[0].associationName,
    //         coachExperience: res.data[0].associationDesc,
    //         timeText: res.data[0].dateAndTime,
    //         locationText: res.data[0].address,
    //         phoneText: res.data[0].creatorPhone,

    //       })
    //       course_id_var = res.data[0]._id
          // console.log('-----*********---', course_id_var)
          // console.log('-----*********---openId', openid)
      //   }
      // }
    // })

    selectListCollection.where({
      "_openid": openid
    }).get({
      success(res) {
        if (res.data.length != 0) {
          // console.log("res.data", res.data[0].course_id)
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index].course_id;
            // console.log("你好呀，Mick", element)
            // console.log("你好呀，Fine", course_id_var)
            // if('0' != '1') {
            if (element == course_id_var) {
              // console.log('-----************course_id_var2222', course_id_var)
              // console.log('-----************haveOrdered', haveOrdered)
              page.setData({
                status: false,
                haveOrdered: true
              })
            }
          }
        }

      }
    })
  },


  getActivityIntroduceText() {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'getActivityIntroduceText1',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'selectRecord'
      }
    }).then((resp) => {
      // console.log('resp.result.activityName', resp.result.activityName)
      this.setData({
        // haveGetRecord: true,
        activityIntroduceText: resp.result.activityDes
      })
      wx.hideLoading()
    }).catch((e) => {
      // console.log(e)
      this.setData({
        showUploadTip: true
      })
      wx.hideLoading()
    })
  },

  navBack(e) {
    wx.navigateBack({
      delta: 1
    })
  },

  navigateToAssociation(e) {
    wx.navigateTo({
      url: '../association/association',
    })
  }
})