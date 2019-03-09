// pages/user/coupon/coupon.js
const app = getApp();
const e = require("../../../config.js");
console.log(app)
Page({

  /* 页面的初始数据 */
  data: {
    coupon: {},
    type: null,
    total: null
  },

  /*监听页面加载*/
  onLoad(event) {
    console.log(event)
    app.showMsg('加载中')
    if (event.type) {
      this.setData({
        type: event.type,
        total: event.total / 100
      })
    }
    wx.request({
      url: e.serverurl + 'mine/getDiscountsByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: app.globalData.userInfo.userId,
        status: 0
      },
      success: (res) => {
        this.setData({
          coupon: res.data.data
        })
        app.hideMsg()
      },
      fail: (res) => {
        console.log(res.data.msg)
      }
    })
  },
  /* 当标签改变时 */
  onChange(event) {
    console.log(event.detail.index);
    wx.request({
      url: e.serverurl + 'mine/getDiscountsByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: app.globalData.userInfo.userId,
        status: event.detail.index
      },
      success: (res) => {
        console.log(res)
        this.setData({
          coupon: res.data.data
        })
      },
      fail: (res) => {
        console.log(res.data.msg)
      }
    })
  },
  goOrder(event) {
    console.log(event)
    if (this.data.type == null) {
      console.log('go-index')
      wx.switchTab({
        url: '/pages/index/index/index',
      })
    } else if (this.data.type == 'order') {
      console.log('go-order')
      app.globalData.orderCoupon = event.currentTarget.dataset.index
      wx.navigateBack({
        delta: 1
      })
    }
  }
})