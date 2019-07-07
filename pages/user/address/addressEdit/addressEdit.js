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
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          name: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
      fail:(r)=>{
        wx.getSetting({
          success: (res)=> {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: (tip)=> {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: (data)=> {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: (res)=> {
                              this.setData({
                                name: res.name,
                                latitude: res.latitude,
                                longitude: res.longitude
                              })
                            },
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: (res)=> {
            wx.showToast({
              title: '调用授权窗口失败',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })      
  },
  onLoad(event) {
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
    }else if(type='address'){
      this.setData({
        address: event.detail
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
          user_id: wx.getStorageSync('userId'),
          name: this.data.username,
          phone: this.data.phone,
          location: this.data.name,
          address: this.data.address,
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          acquiescence: this.data.acquiescence ? '1' : '0'
        },
        success: (res) => {
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
  }
})