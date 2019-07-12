// pages/user/coupon/coupon.js
const app = getApp();
const e = require("../../../config.js");
Page({

  /* 页面的初始数据 */
  data: {
    coupon: {},
    type: null,
    total: null
  },

  /*监听页面加载*/
  onLoad(event) {
    app.showMsg('加载中')
    if (event.type) {
      this.setData({
        type: event.type,
        total: event.total / 100
      })
    }
    wx.request({
      url: e.url + 'mine/getDiscountsByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId'),
        status: 0
      },
      success: (res) => {
        this.setData({
          coupon: res.data.data
        })
        app.hideMsg()
      },
      fail: (res) => {
      }
    })
  },
  /* 当标签改变时 */
  onChange(event) {
    wx.request({
      url: e.url + 'mine/getDiscountsByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId'),
        status: event.detail.index
      },
      success: (res) => {
        this.setData({
          coupon: res.data.data
        })
      },
      fail: (res) => {
      }
    })
  },
  goOrder(event) {
    if (this.data.type == null) {
      wx.switchTab({
        url: '/pages/index/index/index',
      })
    } else if (this.data.type == 'order') {
      app.globalData.orderCoupon = event.currentTarget.dataset.index
      wx.navigateBack({
        delta: 1
      })
    }
  }
})