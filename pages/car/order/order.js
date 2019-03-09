// pages/car/order/order.js
var app = getApp();
const e = require('../../../config.js')
var times = require('../../../utils/util.js');
Page({
  data: {
    selectcarData: [],
    selectAddress: [],
    onLoadEvent: null,
    selectCoupon: {},
    total: 0,
    remark:null,
    num: 1
  },
  onLoad(event) {
    console.log(event)
    this.setData({
      onLoadEvent: event
    })
  },
  onShow() {
    console.log(this.data)
    let event = this.data.onLoadEvent
    app.showMsg('加载中');
    wx.request({
      url: e.serverurl + 'shoppingTrolley/listAllByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        UserId: app.globalData.userInfo.userId
      },
      success: (res) => {
        console.log(res)
        console.log(event)
        let tempArr = []
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].goods.creation_time = times.formatTime(new Date(res.data.data[i].goods.creation_time), 'Y/M/D h:m:s')
        }
        if (event.arr) {
          let selectArr = event.arr.split(",");
          console.log(selectArr)
          for (let i = 0; i < selectArr.length; i++) {
            for (let n = 0; n < res.data.data.length; n++) {
              if (selectArr[i] == res.data.data[n].id) {
                tempArr.push(res.data.data[n])
              }
            }
          }
        } 
        console.log(tempArr)
        this.setData({
          selectcarData: tempArr
        })
        console.log(tempArr)
        let tempTotal = null
        for (let i = 0; i < tempArr.length; i++) {
          tempTotal += tempArr[i].conut * tempArr[i].goods.money * 100
        }
        this.setData({
          total: this.data.selectCoupon.id ? tempTotal - this.data.selectCoupon.subtract_money * 100 : tempTotal
        })
      }
    })
    wx.request({
      url: e.serverurl + 'mine/listtDeliveryAddressByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: app.globalData.userInfo.userId
      },
      success: (res) => {
        console.log(app.globalData.orderAddress)
        if (app.globalData.orderAddress != null) {
          this.setData({
            selectAddress: res.data.data[app.globalData.orderAddress]
          })
        } else {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].acquiescence == 1) {
              this.setData({
                selectAddress: res.data.data[i]
              })
            }
          }
        }
        console.log(res)
        app.hideMsg()
      }
    })
    wx.request({
      url: e.serverurl + 'mine/getDiscountsByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: app.globalData.userInfo.userId,
        status: 0
      },
      success: (res) => {
        console.log(res)
        console.log(app.globalData)
        if (app.globalData.orderCoupon != null) {
          this.setData({
            selectCoupon: res.data.data[app.globalData.orderCoupon]
          })
        }
      },
      fail: (res) => {
        console.log(res.data.msg)
      }
    })
  },
  goDetail(event) {
    console.log(event)
    wx.navigateTo({
      url: '../../index/detail/detail?id=' + event.currentTarget.dataset.id,
    })
  },
  goAddress(event) {
    console.log(event)
    wx.navigateTo({
      url: '../../user/address/address/address?type=' + event.currentTarget.dataset.type,
    })
  },
  selectCoupon(event) {
    console.log(event)
    wx.navigateTo({
      url: '../../user/coupon/coupon?type=' + event.currentTarget.dataset.type + '&total=' + this.data.total,
    })
  },
  onUnload() {
    console.log('退出-----')
    app.globalData.orderCoupon = null
  },
  remark(event) {
    console.log(event)
    this.setData({
      remark: event.detail
    })
  },
  order() {
    console.log(this.data)
    if(this.data.selectAddress.id){
      wx.request({
        url: e.serverurl + 'frontOrder/edit.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          user_id: app.globalData.userInfo.userId,
          ids: this.data.onLoadEvent.arr.split(","),
          user_discounts_id: typeof (this.data.selectCoupon.id) == 'undefined' ? 0 : this.data.selectCoupon.id,
          total_money: this.data.total / 100,
          address_id: this.data.selectAddress.id,
          remarks: this.data.remark,
          type: this.data.num
        },
        success: (res) => {
          app.showMsg('正在生成订单')
          console.log(res)
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000,
              success() {
                  wx.redirectTo({
                    url: '../../user/list/list/list',
                  })
                }
            })
          }
        },
        fail: (res) => {
          console.log(res.data.msg)
        }
      })
    }else{
      wx.showActionSheet({
        itemList: ['请选择地址'],
        success(res) {
          console.log(res.tapIndex)
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  /* 选择付款方式 */
  menuClick(event) {
    console.log(event)
    this.setData({
      num: event.target.dataset.num
    })
  }
})