// pages/user/code/code.js
const app = getApp();
const e = require("../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeUrl:'',
    infoUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(event) {
    wx.request({
      url: e.serverurl + 'twoCode/getTwoCode.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        promoter: wx.getStorageSync('userId')
       // appid: e.appid
      },
      success: (res) => {
        this.setData({
          codeUrl: res.data.data.twoCodeUrl
        })
      }
    })
    wx.request({
      url: e.serverurl + 'frontTwoCodeIntroduce/findByAppId.action',
      method: 'post',
      data:{appid:e.appid},
      header: app.globalData.header,
      success: (res) => {
        this.setData({
          infoUrl: res.data.data
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