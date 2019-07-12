// pages/Member/index/index.js
const app = getApp();
wx.getStorage({
  key: 'Cookie',
  success(res) {

  }
})
const e = require("../../../config.js");
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dot1: false,
    dot2: false,
    couponCount:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getStorage({
      key: 'userId',
      success(res) {
        app.globalData.userId = res.data
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function(options) {
	  this.checkDot(0)
	  this.checkDot(1)
    this.getCounpon()
  },
  getCounpon(){
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
          couponCount:res.data.data.length
        })
      },
      fail: (res) => {
      }
    })
  },
  checkDot(status) {
    wx.request({
      url: e.url + 'frontOrder/findOrder.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId'),
        status,
        appid: e.appid,
        limit: 3
      },
      success: (res) => {
        if (status == 0 && res.data.data.length != 0) {
          this.setData({
            dot1: true
          })
        } else if (status == 1 && res.data.data.length != 0) {
          this.setData({
            dot2: true
          })
        }
        if (status == 0 && res.data.data.length == 0) {
          this.setData({
            dot1: false
          })
        } else if (status == 1 && res.data.data.length == 0) {
          this.setData({
            dot2: false
          })
        }
      },
      fail: function() {
       
      }
    })
  },
  /*进入我的二维码页面*/
  toCode() {
    wx.navigateTo({
      url: '../code/code',
    })
  },
  /*进入我的提成页面 */
  toRoyalty() {
    wx.navigateTo({
      url: '../royalty/royalty',
    })
  },
  /*进入我的优惠券页面 */
  toCoupon() {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  toFri() {
    wx.navigateTo({
      url: '../friends/friends',
    })
  },
  toAddress() {
    wx.navigateTo({
      url: '../address/address/address',
    })
  },
  /*进入订单页 */
  toList(event) {
    var index = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../list/list/list?index=' + index,
    })
  },
  onPullDownRefresh: function () {
    this.onShow()
    setTimeout(() => {
      app.hideMsg()
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500)
  },
})