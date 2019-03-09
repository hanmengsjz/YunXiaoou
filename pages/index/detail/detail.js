// pages/index/detail/detail.js
const e = require('../../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temp: 2,
    count: 1,
    detailData: {},
    goodsImg: [],
    businessTime: true
  },
  temp(event) {
    if (event.target.dataset.temp) {
      this.setData({
        temp: event.target.dataset.temp
      })
    }
  },
  onChange(event) {
    wx.showToast({
      icon: 'none',
      title: `当前值：${event.detail}`
    });
  },
  numChange(event) {
    this.setData({
      count: event.detail
    })
  },
  addCar(event) {
    app.showMsg('加载中');
    console.log(event);
    wx.request({
      url: e.serverurl + 'shoppingTrolley/edit.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.userInfo.userId,
        goods_id: event.currentTarget.dataset.id,
        conut: this.data.count,
        lced: this.data.temp == 1 ? this.data.count : this.data.temp == 2 ? 0 : Math.floor(this.data.count / 2)
      },
      success: (res) => {
        console.log(res)
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onLoad: function(event) {
    if (app.globalData.currentTime.slice(11, 13) < 11 || app.globalData.currentTime.slice(11, 13) > 22) {
      this.setData({
        businessTime: false
      })
    }
    console.log(event)
    app.showMsg('加载中')
    wx.request({
      url: e.serverurl + 'goodsFront/getById.action',
      method: 'post',
      data: {
        id: event.id
      },
      header: app.globalData.header,
      success: (res) => {
        console.log(res)
        this.setData({
          detailData: res.data.data,
          goodsImg: res.data.data.goodsImages
        })
        app.hideMsg()
      }
    })
  },
  buyNow() {
    if (this.data.businessTime) {
      wx.navigateTo({
        url: '../../car/order/order',
      })
    } else {
      app.showError()
    }
  },
})