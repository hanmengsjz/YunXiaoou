// pages/user/list/list/list.js
const app = getApp();
const e = require("../../../../config.js");
import Dialog from '../../../../dist/dialog/dialog';
Page({

  /* 页面的初始数据 */
  data: {
    order: {},
    index: 0,
    limit: 3,
    businessTime: true,
    first_order: false
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function(options) {
    wx.request({
      url: e.serverurl + 'frontOrder/findOrder.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId'),
        status: options.index ? options.index : 0,
        appid: e.appid,
        limit: 3
      },
      success: (res) => {
        this.setData({
          order: res.data.data,
          index: options.index ? options.index : 0,
          limit: 3
        })
      },
      fail: function() {}
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
  /* 标签切换的时候 */
  onChange(event) {
    wx.request({
      url: e.serverurl + 'frontOrder/findOrder.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId'),
        status: event.detail.index,
        appid: e.appid,
        limit: 3
      },
      success: (res) => {
        this.setData({
          order: res.data.data,
          index: event.detail.index,
          limit: 3
        })
      },
      fail: function() {}
    })
  },
  /* 进入订单详情页面 */
  toDetails(event) {
    wx.navigateTo({
      url: '../details/details?id=' + event.currentTarget.dataset.id,
    })
  },
  confirmReceipt(event){
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      success:(res)=> {
        if (res.confirm) {
          wx.request({
            url: e.serverurl + 'frontOrder/updateToStatus.action',
            method: 'POST',
            header: app.globalData.header,
            data: {
              status: 3,
              id: event.target.dataset.id
            },
            success: (res) => {
              /* 刷新页面 */
              wx.request({
                url: e.serverurl + 'frontOrder/findOrder.action',
                method: 'POST',
                header: app.globalData.header,
                data: {
                  userId: wx.getStorageSync('userId'),
                  status: this.data.index,
                  appid: e.appid,
                  limit: this.data.limit
                },
                success: (res) => {
                  this.setData({
                    order: res.data.data,
                    index: this.data.index,
                    limit: this.data.limit - 1
                  })
                },
                fail: function () { }
              })
            },
            fail: function () { }
          })
        } else if (res.cancel) {
        }
      }
    })

 
  },
  /* 取消删除订单 */
  cancel(event) {
    Dialog.confirm({
      message: '确认取消订单吗'
    }).then(() => {
      wx.request({
        url: e.serverurl + 'frontOrder/deleteOrder.action',
        method: 'POST',
        header: app.globalData.header,
        data: {
          userid: wx.getStorageSync('userId'),
          id: event.target.dataset.id
        },
        success: (res) => {
          /* 刷新页面 */
          wx.request({
            url: e.serverurl + 'frontOrder/findOrder.action',
            method: 'POST',
            header: app.globalData.header,
            data: {
              userId: wx.getStorageSync('userId'),
              status: this.data.index,
              appid: e.appid,
              limit: this.data.limit
            },
            success: (res) => {
              this.setData({
                order: res.data.data,
                index: this.data.index,
                limit: this.data.limit - 1
              })
            },
            fail: function() {}
          })
        },
        fail: function() {}
      })
    }).catch(() => {
      // on cancel
    });
  },
  payment(event) {
    if (this.data.businessTime) {
      var orders = this.data.order[event.target.dataset.bindex];
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
              },
              fail: function(error) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                });
              },
              complete: function(complete) {

              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success(res) {
                if (res.confirm) {
                } else if (res.cancel) {
                }
              }
            })
          }
        },
        fail: function() {

        }
      })

    } else {
      app.showError()
    }

  },
  /* 点击加载更多 */
  loadMore(event) {
    this.data.limit = this.data.limit + 3;
    wx.request({
      url: e.serverurl + 'frontOrder/findOrder.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        userId: wx.getStorageSync('userId'),
        status: this.data.index,
        appid: e.appid,
        limit: this.data.limit
      },
      success: (res) => {
        this.setData({
          order: res.data.data,
          index: this.data.index,
          limit: this.data.limit
        })
      },
      fail: function() {}
    })
  },
  /* 申请退款 */
  refund: function(event) {
    var order = this.data.order[event.target.dataset.bindex];
    var self = this;
    if (event.target.dataset.type===1){
      Dialog.confirm({
        message: '确认申请退款吗'
      }).then(() => {
        wx.request({
          url: e.serverurl + 'frontOrder/updateToOrderStatus.action',
          method: 'POST',
          header: app.globalData.header,
          data: {
            id: order.id,
            status: 4
          },
          success: function () {
            /* 刷新页面 */
            wx.request({
              url: e.serverurl + 'frontOrder/findOrder.action',
              method: 'POST',
              header: app.globalData.header,
              data: {
                userId: wx.getStorageSync('userId'),
                status: self.data.index,
                appid: e.appid,
                limit: self.data.limit
              },
              success: (res) => {

                self.setData({
                  order: res.data.data,
                  index: self.data.index,
                  limit: self.data.limit - 1
                })
              },
              fail: function () {

              }
            })
          },
          fail: function (error) {

          }
        })

      }).catch(() => {
        // on cancel
      });
    } else if (event.target.dataset.type === 2){
      Dialog.confirm({
        message: '余额支付不支持退款'
      }).then(() => {
        

      }).catch(() => {
        // on cancel
      });
    }

  }
})