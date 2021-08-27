// components/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showNavBar: Boolean,
    showLeftArrow: Boolean,
    titleName: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    
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
