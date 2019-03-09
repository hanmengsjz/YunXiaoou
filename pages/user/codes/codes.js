// pages/user/code/code.js
const app = getApp();
const e = require("../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: e.serverurl + 'twoCode/getTwoCode.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        promoter: app.globalData.userInfo.userId
      },
      success: (res) => {
        console.log(res)
        this.setData({
          codeUrl: res.data.twoCodeUrl
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})