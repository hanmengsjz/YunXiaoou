// pages/user/royalty/royalty.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  goIndex(){
    wx.switchTab({
      url: '/pages/index/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {　
    var that = this;
    var shareObj = {　　　　
      title: "转发的标题",
      path: '/pages/index/index/index',
      imgUrl: '',
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') {}　　　　
      },
      fail: function() {
        if (res.errMsg == 'shareAppMessage:fail cancel') {

        } else if (res.errMsg == 'shareAppMessage:fail') {

        }　　　　
      },
      complete: (res) => {

      }　　
    }　　
    return shareObj;
  }
})