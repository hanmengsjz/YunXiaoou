// pages/user/address/addressEdit/addressEdit.js
const app = getApp();
const e = require("../../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    username: '',
    phone: '',
    name: '',
    address: '',
    latitude: null,
    longitude: null,
    acquiescence: false,
    error: {}
  },
  selectLocation() {
    console.log('选择地址')
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
  },
  onLoad(event) {
    console.log(event)
    if (event.id != 'undefined') {
      this.setData({
        id: event.id
      })
      wx.request({
        url: e.serverurl + 'mine/getDeliveryAddressById.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          id: event.id
        },
        success: (res) => {
          console.log(res)
          this.setData({
            username: res.data.data.name,
            phone: res.data.data.phone,
            name: res.data.data.location,
            address: res.data.data.address,
            latitude: res.data.data.latitude,
            longitude: res.data.data.longitude,
            acquiescence: res.data.data.acquiescence == 1 ? true : false,
          })
        }
      })
    }
  },
  onChange(event) {
    console.log(event)
    let type = event.currentTarget.dataset.type
    if (type == 'username') {
      this.setData({
        username: event.detail
      })
    } else if (type == 'phone') {
      this.setData({
        phone: event.detail
      })
    } else if (type == 'acquiescence') {
      this.setData({
        acquiescence: event.detail
      })
    }
  },
  save() {
    if (this.data.username == '') {
      this.setData({
        error: {
          username: '请输入收货人姓名'
        }
      })
    } else if (this.data.phone == '') {
      this.setData({
        error: {
          phone: '请输入手机号'
        }
      })
    } else if (this.data.name == '') {
      this.setData({
        error: {
          name: '请选择收货地址'
        }
      })
    } else if (this.data.address == '') {
      this.setData({
        error: {
          address: '请输入详细地址'
        }
      })
    } else {
      app.showMsg('加载中')
      this.setData({
        error: {}
      })
      wx.request({
        url: this.data.id == null ? e.serverurl + 'mine/insertDeliveryAddress.action' : e.serverurl + 'mine/updateDeliveryAddress.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          id: this.data.id == null ? '' : this.data.id,
          user_id: app.globalData.userInfo.userId,
          name: this.data.username,
          phone: this.data.phone,
          location: this.data.name,
          address: this.data.address,
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          acquiescence: this.data.acquiescence ? '1' : '0'
        },
        success: (res) => {
          console.log(res)
          if (res.data.code == 0) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1800)
          }
        }
      })
    }
    console.log(this.data)
  }
})