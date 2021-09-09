var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var managerCollection = db.collection("test_db_manager")
var selectListCollection = db.collection("test_db_selectList")
const _ = db.command

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatDay(dd) {
  // console.log(date)
  var date = new Date(dd)
  var year = date.getFullYear()
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = 0 + String(month)
  }
  var day = date.getDate()
  if (day < 10) {
    day = 0 + String(day)
  }

  return year + '/' + month + '/' + day
}

function date2num(activity_date) {
  console.log(activity_date)

  var num2 = parseInt(activity_date.slice(0, 3)) * 10000 + parseInt(activity_date.slice(5, 6)) * 100 + parseInt(activity_date.slice(8, 9))
  console.log(num2)
  return num2
}


async function enroll(activity_id) {
  var page = this
  if (app.globalData.login) {
    var now = new Date()
    var date = now.getFullYear() + "/" + ((now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + "/" + (now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate())
    var time = (now.getHours() < 10 ? ('0' + now.getHours()) : now.getHours()) + ":" + (now.getMinutes() < 10 ? ('0' + now.getMinutes()) : now.getMinutes())

    // var info = await this.searchSelectionCollection(openid, activity_id)
    var select_id = ''
    var avatarUrl = app.globalData.avatarUrl
    // console.log(avatarUrl)
    // 首先查询这条记录存不存在
    selectListCollection.where({
      _openid: app.globalData.openid,
      course_id: activity_id
    }).get({
      success(res) {
        // console.log(res.data)
        if (res.data.length != 0) {
          select_id = res.data[0]._id
          app.globalData.selectId = select_id
          // 如果存在且已经报名了
          if (res.data[0].enroll_flag) {
            wx.showToast({
              title: '您已报名',
              icon: 'none',
              duration: 2000
            })
          } else {
            // 没有报名，如果记录存在，把enroll_flag改成true即可
            selectListCollection.doc(select_id).update({
              data: {
                date: date,
                time: time,
                enroll_flag: true
              },
              success(res) {
                wx.showToast({
                  title: '预约成功',
                })
              }
            })
          }
        } else {
          // 记录不存在，插入到数据库
          selectListCollection.add({
            data: {
              course_id: activity_id,
              date: date,
              time: time,
              enroll_flag: true,
              avatarUrl: avatarUrl
            },
            success(res) {
              // console.log(res._id)
              app.globalData.selectId = res._id
              // 预约成功，弹出提示，显示出已预约按钮
              wx.showToast({
                title: '预约成功',
              })
            }
          })
        }
      }
    })
  } else {
    // 没有登录，跳转登录页面
    wx.navigateTo({
      url: '../login/login',
    })
  }
}


module.exports = {
  formatTime: formatTime,
  formatDay: formatDay,
  date2num: date2num,
  enroll: enroll
}