// pages/car/order/order.js
var app = getApp();
const e = require('../../../config.js')
var times = require('../../../utils/util.js');
Page({
  data: {
    selectData: {},
    selectAddress: [],
    onLoadEvent: null,
    selectCoupon: {},
    total: 0,
    remark: null,
    num: '1',
    first_order: false,
    hasDicount: false,
    couponCount: 0
  },
  onLoad(event) {
    this.setData({
      onLoadEvent: event
    })
    this.setData({
      first_order: wx.getStorageSync('first_order') == 0
    })
  },
  onShow() {
    this.getCounpon()
    let event = this.data.onLoadEvent
    this.setData({})
    app.showMsg('加载中');
    wx.request({
      url: e.serverurl + 'goodsFront/getById.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        id: event.id
      },
      success: (res) => {
        res.data.data.creation_time = times.formatTime(new Date(res.data.data.creation_time), 'Y/M/D h:m:s')
        let cacheTotal = res.data.data.is_discount != 0 && this.data.first_order ? res.data.data.money * 100 * res.data.data.discount_num + res.data.data.money * (this.data.onLoadEvent.count - 1) * 100 : res.data.data.money * this.data.onLoadEvent.count * 100
        if (res.data.data.is_discount != 0 && this.data.first_order) {
          this.setData({
            hasDicount: true
          })
        }
        this.setData({
          selectData: res.data.data,
          total: cacheTotal
        })
      }
    })
    wx.request({
      url: e.serverurl + 'mine/listtDeliveryAddressByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId')
      },
      success: (res) => {
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
        app.hideMsg()
      }
    })
    wx.request({
      url: e.serverurl + 'mine/getDiscountsByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId'),
        status: 0
      },
      success: (res) => {
        setTimeout(() => {
          if (app.globalData.orderCoupon != null) {
            let m = this.data.total - res.data.data[app.globalData.orderCoupon].subtract_money * 100
            this.setData({
              selectCoupon: res.data.data[app.globalData.orderCoupon],
              total: (m <= 0) ? 1 : m
            })
          }
        }, 1000)
      },
      fail: (res) => {}
    })
  },
  getCounpon() {
    wx.request({
      url: e.serverurl + 'mine/getDiscountsByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId'),
        status: 0
      },
      success: (res) => {
        this.setData({
          couponCount: res.data.data.length
        })
      },
      fail: (res) => {}
    })
  },
  goDetail(event) {
    wx.navigateTo({
      url: '../../index/detail/detail?id=' + event.currentTarget.dataset.id,
    })
  },
  goAddress(event) {
    wx.navigateTo({
      url: '../../user/address/address/address?type=' + event.currentTarget.dataset.type,
    })
  },
  selectCoupon(event) {
    wx.navigateTo({
      url: '../../user/coupon/coupon?type=' + event.currentTarget.dataset.type + '&total=' + this.data.total,
    })
  },
  onUnload() {
    app.globalData.orderCoupon = null
  },
  remark(event) {
    this.setData({
      remark: event.detail
    })
  },
  order() {
    if (this.data.selectAddress.id) {
      wx.request({
        url: e.serverurl + 'frontOrder/insertOrder.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          user_id: wx.getStorageSync('userId'),
          id: this.data.onLoadEvent.id,
          user_discounts_id: typeof(this.data.selectCoupon.id) == 'undefined' ? 0 : this.data.selectCoupon.id,
          count: this.data.onLoadEvent.count,
          total_money: this.data.total / 100,
          address_id: this.data.selectAddress.id,
          remarks: this.data.remark,
          //specification_id: JSON.parse(this.data.onLoadEvent.spec).specification_id,
          specification_name: JSON.parse(this.data.onLoadEvent.spec).specification_name,
          type: this.data.num,
          appid: e.appid
        },
        success: (res) => {
          app.showMsg('正在生成订单')
          if (res.data.code == 0) {
            if (this.data.hasDicount) {
              wx.setStorage({
                key: 'first_order',
                data: 2
              })
            }
            this.payment(res.data.data)
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000,
              success: () => {

              }
            })
          }
        },
        fail: (res) => {}
      })
    } else {
      wx.showActionSheet({
        itemList: ['请选择地址'],
        success(res) {
          if (res.tapIndex == 0) {
            wx.navigateTo({
              url: '../../user/address/address/address?type=order'
            })
          }
        },
        fail(res) {}
      })
    }
  },
  payment(orders) {
    wx.request({
      url: e.serverurl + 'weixin/wxPay.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        openid: wx.getStorageSync("openId"),
        id: JSON.stringify(orders.id),
        total_money: JSON.stringify(orders.total_money * 100),
        ids: orders.id,
        status: 1,
        appid: e.appid
      },
      success: (res) => {
        if (res.data.success) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: "MD5",
            paySign: res.data.data.paySign,
            success: (data) => {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000
              });
              setTimeout(() => {
                wx.switchTab({
                  url: '../../index/index/index',
                })
              }, 1500)
            },
            fail: function(error) {
              wx.switchTab({
                url: '../../index/index/index',
              })
            },
            complete: function(complete) {

            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success(res) {
              if (res.confirm) {} else if (res.cancel) {}
            }
          })
        }

      },
      fail: function() {

      }
    })
  },
  /* 选择付款方式 */
  menuClick(event) {
    this.setData({
      num: event.currentTarget.dataset.num
    })
  }
})