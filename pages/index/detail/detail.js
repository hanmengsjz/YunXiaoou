// pages/index/detail/detail.js
const e = require('../../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spec: {},
    count: 1,
    detailData: {},
    goodsImg: [],
    businessTime: true,
    first_order: false
  },
  temp(event) {
    if (event.target.dataset.spec) {
      this.setData({
        spec: event.target.dataset.spec
      })
    }
  },
  numChange(event) {
    this.setData({
      count: event.detail
    })
  },
  addCar(event) {
    app.showMsg('加载中');
    wx.request({
      url: e.url + 'shoppingTrolley/edit.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        user_id: wx.getStorageSync('userId'),
        goods_id: event.currentTarget.dataset.id,
        conut: this.data.count,
        specification_id: this.data.spec.specification_id,
        specification_name: this.data.spec.specification_name,
      },
      success: (res) => {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  onLoad: function(event) {
    app.showMsg('加载中')
    wx.request({
      url: e.url + 'goodsFront/getById.action',
      method: 'post',
      data: {
        id: event.id
      },
      header: app.globalData.header,
      success: (res) => {
        this.setData({
          detailData: res.data.data,
          goodsImg: res.data.data.goodsImages,
          spec: res.data.data.specificationGood[0]
        })
        app.hideMsg()
      }
    })
  },
  onShow() {
    if (app.globalData.currentTime.slice(11, 13) < JSON.parse(wx.getStorageSync('bussiness_time')).data.start_time || app.globalData.currentTime.slice(11, 13) >= JSON.parse(wx.getStorageSync('bussiness_time')).data.end_time) {
      this.setData({
        businessTime: false
      })
    } else {
      this.setData({
        businessTime: true
      })
    }
    this.setData({
      first_order: wx.getStorageSync('first_order') == 0
    })
  },
  buyNow() {
    if (this.data.businessTime) {
      wx.navigateTo({
        url: '../order/order?id=' + this.data.detailData.id + '&count=' + this.data.count + '&spec=' + JSON.stringify(this.data.spec),
      })
    } else {
      app.showError()
    }
  },
})