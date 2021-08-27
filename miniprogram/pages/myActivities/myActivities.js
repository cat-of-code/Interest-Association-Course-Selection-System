// pages/select/select.js
var app = getApp()
var db = wx.cloud.database()
var courseCollection = db.collection("test_db_course")
var courseListCollection = db.collection("list")
var _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [
      {
        "_id": "8937eaa96124ea2e0619dd2b0257e259",
        "course_name": "篮球基础入门(上)",
        "course_start_time": "14:00",
        "course_end_time": "16:00",
        "course_date": "2021/08/30",
        "address": "篮球场01",
        "dec": "简介",
        "img": "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/basketball.jpeg",
        "max_people": 10.0,
        "association_uid": 1.0
      }, {
        "_id": "14139e126124eb9006b8cfaf3d517c2e",
        "course_name": "跑步基础入门(上)",
        "course_start_time": "14:00",
        "course_end_time": "16:00",
        "course_date": "2021/08/30",
        "address": "田径场01",
        "dec": "简介",
        "img": "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/basketball.jpeg",
        "max_people": 13.0,
        "association_uid": 2.0
      }, {
        "_id": "8937eaa96124ede8061a5eb10279a765",
        "course_name": "瑜伽基础入门(上)",
        "course_start_time": "14:00",
        "course_end_time": "16:00",
        "course_date": "2021/08/31",
        "address": "瑜伽室01",
        "dec": "简介",
        "img": "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/yoga.jpeg",
        "max_people": 13.0,
        "association_uid": 3.0
      }, {
        "_id": "8937eaa96124edeb061a5f0e1a7211bf",
        "course_name": "乒乓球基础入门(上)",
        "course_start_time": "14:00",
        "course_end_time": "16:00",
        "course_date": "2021/08/31",
        "address": "乒乓球场01",
        "dec": "简介",
        "img": "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/basketball.jpeg",
        "max_people": 20.0,
        "association_uid": 4.0
      }, {
        "_id": "8937eaa96124eded061a5f5a601cd3a9",
        "course_name": "足球基础入门(上)",
        "course_start_time": "14:00",
        "course_end_time": "16:00",
        "course_date": "2021/09/01",
        "address": "足球场01",
        "dec": "简介",
        "img": "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/basketball.jpeg",
        "max_people": 13.0,
        "association_uid": 5.0
      }, {
        "_id": "14139e126124edf006b936b773c1b3c6",
        "course_name": "网球基础入门(上)",
        "course_start_time": "14:00",
        "course_end_time": "16:00",
        "course_date": "2021/09/01",
        "address": "网球场01",
        "dec": "简介",
        "img": "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/basketball.jpeg",
        "max_people": 22.0,
        "association_uid": 6.0
      }

    ],
  },



})