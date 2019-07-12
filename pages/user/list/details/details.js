// pages/user/list/details/details.js
var times = require('../../../../utils/util.js');
const app = getApp();
const e = require("../../../../config.js");
import Dialog from '../../../../dist/dialog/dialog';
Page({

  /* 页面的初始数据 */
  data: {
    order: {},
    first_order: false,
    businessTime: true,
    express:null
  },
  /* 生命周期函数--监听页面加载 */
  onLoad(options) {
    wx.request({
      url: e.url + 'frontOrder/getOrder.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        orderId: options.id,
      },
      success: (res) => {
        res.data.data.time = times.formatTime(new Date(res.data.data.time), 'Y/M/D h:m:s')
        this.setData({
          order: res.data.data
        })
        if (res.data.data.logistics){
          this.getExpress(res.data.data.logistics)
        }
      },
      fail: function() {

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
  getExpress(number){
    wx.request({
      url: e.url + 'Express/getExpressInfo.action',
      method: 'POST',
      header: app.globalData.header,
      data: {number},
      success: (res) => {
        let cacheArr = []
        for(let i=0;i<res.data.data.expressDetail.length;i++){
          cacheArr.push({ text: res.data.data.expressDetail[i].status, desc: res.data.data.expressDetail[i].time})
        }
        this.setData({
          express: cacheArr
        })
      }
    })
  },
  /* 取消删除订单 */
  cancel(event) {
    Dialog.confirm({
      message: '确认取消订单吗'
    }).then(() => {
      wx.request({
        url: e.url + 'frontOrder/deleteOrder.action',
        method: 'POST',
        header: app.globalData.header,
        data: {
          userid: wx.getStorageSync('userId'),
          id: this.data.order.id
        },
        success: (res) => {
          /* 进入列表页 */
          wx.navigateTo({
            url: '../list/list?index=0',
          })
        },
        fail: function() {

        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  payment(event) {
    if (this.data.businessTime) {
      var orders = this.data.order;
      wx.request({
        url: e.url + 'weixin/wxPay.action',
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
                })
              },
              complete: function(complete) {}
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
        fail: function() {}
      })
    } else {
      app.showError()
    }
  },
})