// pages/user/address/address/address.js
const app = getApp();
const e = require("../../../../config.js");
Page({
  data: {
    address: [],
    radio: '',
    type: null
  },
  onChange(event) {
    app.showMsg('加载中')
    this.setData({
      radio: event.detail
    })
    wx.request({
      url: e.url + 'mine/updateDeliveryAddress.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        user_id: wx.getStorageSync('userId'),
        id: parseInt(event.detail),
        acquiescence: '1'
      },
      success: (res) => {
        app.hideMsg();
      }
    })
  },
  onShow() {
    this.listData()
  },
  onLoad(event) {
    if (event.type) {
      this.setData({
        type: event.type
      })
    }
  },
  selectAddress(event) {
    if (this.data.type == 'order') {
      app.globalData.orderAddress = event.currentTarget.dataset.index
      wx.navigateBack({
        delta: 1
      })
    }
  },
  listData() {
    app.showMsg('加载中')
    this.setData({
      radio: ''
    })
    wx.request({
      url: e.url + 'mine/listtDeliveryAddressByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId')
      },
      success: (res) => {
        this.setData({
          address: res.data.data
        })
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].acquiescence == 1) {
            this.setData({
              radio: res.data.data[i].id + ''
            })
          }
        }
        app.hideMsg();
      }
    })
  },
  deleteAddress(event) {
    wx.showActionSheet({
      itemList: ['确认'],
      success: (res) => {
        if (res.tapIndex == 0) {
          app.showMsg('加载中')
          wx.request({
            url: e.url + 'mine/deleteDeliveryAddress.action',
            method: 'post',
            header: app.globalData.header,
            data: {
              id: event.currentTarget.dataset.id
            },
            success: (res) => {
              if (res.data.code == 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(() => {
                  this.listData()
                }, 1800)
              }
            }
          })
        }
      },
      fail(res) {
      }
    })
  },
  goAddressEdit(event) {
    wx.navigateTo({
      url: '../addressEdit/addressEdit?id=' + event.currentTarget.dataset.id,
    })
  }
})