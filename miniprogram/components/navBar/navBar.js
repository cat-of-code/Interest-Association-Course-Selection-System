// components/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showLeftArrow: Boolean,
    titleName: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    left: "cloud://cloud1-0gyu6anlffcd11a5.636c-cloud1-0gyu6anlffcd11a5-1306965577/left.png",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navBack: function() {
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})
