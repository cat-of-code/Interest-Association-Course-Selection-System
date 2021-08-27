// pages/courseDetail/courseDetail.js
const app = getApp()
const db = wx.cloud.database()
const courseCollection = db.collection("course")

Component({

  /**
   * 页面的初始数据
   */
  data: {
    "course_name": "篮球基础入门(上)",
    "course_start_time": "14:00",
    "course_end_time": "16:00",
    "course_date": "2021/08/30",
    "address": "篮球场01",
    "dec": "简介",
    "img": "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/basketball.jpeg",
    "max_people": 10.0,
    "association_uid": 1.0,
    association_logo: "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/basketball_logo.jpg",
    association_name: "篮球协会",
    manager_phone: "123-456789"
  },



  
})