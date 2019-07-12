// pages/user/royalty/royalty.js
const app = getApp();
const times = require('../../../utils/util.js');
wx.getStorage({
  key: 'Cookie',
  success(res) {

  }
})
const e = require("../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0.00,
    royalty:[],
    activeNames: ['1']
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  goIndex(){
    wx.switchTab({
      url: '/pages/index/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function(options) {
    wx.request({
      url: e.url + 'mine/selectById.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        id: wx.getStorageSync('userId')
      },
      success: (res) => {    
        this.setData({
          money: res.data.data.generalize_money
        })
      },
      fail: function () {
       
      }
    })
    this.getMoney()
  },
  getMoney(){
    wx.request({
      url: e.url + 'frontDeduction/findByUserId.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId')
      },
      success: (res) => {
        for(let i=0;i<res.data.data.length;i++){
          res.data.data[i].time = times.formatTime(new Date(res.data.data[i].time), 'Y/M/D h:m:s')
        }
        this.setData({
          royalty: res.data.data
        })
      },
      fail: function () {

      }
    })
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