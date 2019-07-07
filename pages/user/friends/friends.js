// pages/user/friends/friends.js
const app = getApp()
const e = require("../../../config.js");
var times = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.request({
      url: e.serverurl + 'friend/quan.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        promoter: wx.getStorageSync('userId')
      },
      success: (res) => {
        app.hideMsg();
        for(let i=0;i<res.data.data.length;i++){
          res.data.data[i].time = times.formatTime(new Date(res.data.data[i].time), 'Y/M/D h:m:s');
        }
        this.setData({
          user:res.data.data
        })
      }
    })
  },
  check(event){
    wx.request({
      url: e.serverurl + 'friend/sumMoney.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        pay_user_id: event.currentTarget.dataset.id
      },
      success: (res) => {
        wx.showModal({
          title: '提示',
          content: '该朋友已为您赚取'+res.data.data+'元',
          success(res) {
            if (res.confirm) {
            } else if (res.cancel) {
            }
          }
        })
      }
    })
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

  }
})