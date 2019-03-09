// pages/user/list/list/list.js
const app = getApp();
const e = require("../../../../config.js");
import Dialog from '../../../../dist/dialog/dialog';
Page({

  /* 页面的初始数据 */
  data: {
    order:{},
    index:0,
    limit:3
  },

  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    console.log(app)
    wx.request({
      url: e.serverurl + 'frontOrder/findOrder.action', 
      method: 'POST',
      header: app.globalData.header,
      data: {
        userId: app.globalData.userInfo.userId,
        status: options.index ? options.index : 0,
        limit:3
      },
      success: (res) => {
        this.setData({
          order: res.data.data,
          index: options.index ? options.index : 0,
          limit: 3
        })
      },
      fail: function () {
        console.log('系统错误')
      }
    })
  },
  /* 标签切换的时候 */
  onChange(event) {
    wx.request({
      url: e.serverurl + 'frontOrder/findOrder.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        userId: app.globalData.userInfo.userId,
        status: event.detail.index,
        limit: 3
      },
      success: (res) => {
        this.setData({
          order: res.data.data,
          index: event.detail.index,
          limit: 3
        })
      },
      fail: function () {
        console.log('系统错误')
      }
    })
  },
  /* 进入订单详情页面 */
  toDetails (event){
    var orders = this.data.order[event.target.dataset.bindex];
    console.log(JSON.stringify(orders))
    wx.navigateTo({
      url: '../details/details?orders=' + JSON.stringify(orders) + '',
    })
  },
  /* 取消删除订单 */
  cancel (event){ 
    Dialog.confirm({
      message: '确认取消订单吗'
    }).then(() => {
      wx.request({
        url: e.serverurl + 'frontOrder/deleteOrder.action',
        method: 'POST',
        header: app.globalData.header,
        data: {
          userid: app.globalData.userInfo.userId,
          id: event.target.dataset.id
        },
        success: (res) => {
          /* 刷新页面 */
          wx.request({
            url: e.serverurl + 'frontOrder/findOrder.action',
            method: 'POST',
            header: app.globalData.header,
            data: {
              userId: app.globalData.userInfo.userId,
              status: this.data.index,
              limit: this.data.limit
            },
            success: (res) => {
              this.setData({
                order: res.data.data,
                index: this.data.index,
                limit:this.data.limit-1
              })
            },
            fail: function () {
              console.log('系统错误')
            }
          })
        },
        fail: function () {
          console.log('系统错误')
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  payment(event){
    var orders = this.data.order[event.target.dataset.bindex];
    console.log(orders.id)
    wx.request({
      url: e.serverurl + 'weixin/wxPay.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        openid: wx.getStorageSync("openId"),
        id: JSON.stringify(orders.id),
        total_money: JSON.stringify(orders.total_money*100),
        ids: orders.id,
        status:1
      },
      success: (res) => {
        console.log(res)
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: "MD5",
          paySign: res.data.data.paySign,
          success: (data) => {
            console.log(data);
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
          },
          fail: function (error){
            // fail   
            console.log("支付失败")
            wx.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000
            });
            console.log(error)
          },
          complete: function (complete) {
            console.log(complete)
          }
        })
      },
      fail: function () {
        console.log('系统错误')
      }
    })
  },
  /* 点击加载更多 */
  loadMore(event){
    
    this.data.limit = this.data.limit + 3;
    wx.request({
      url: e.serverurl + 'frontOrder/findOrder.action',
      method: 'POST',
      header: app.globalData.header,
      data: {
        userId: app.globalData.userInfo.userId,
        status: this.data.index,
        limit: this.data.limit
      },
      success: (res) => {
        this.setData({
          order: res.data.data,
          index: this.data.index,
          limit: this.data.limit
        })
      },
      fail: function () {
        console.log('系统错误')
      }
    })
  },
  /* 申请退款 */
  refund: function (event) {
    var order = this.data.order[event.target.dataset.bindex];
    var self = this;
    console.log(event)
    Dialog.confirm({
      message: '确认退款吗'
    }).then(() => {
      wx.request({
        url: e.serverurl + 'frontOrder/updateToOrderStatus.action',
        method: 'POST',
        header: app.globalData.header,
        data: {
          id:order.id,
          status:4
        },
        success: function () {
          /* 刷新页面 */
          wx.request({
            url: e.serverurl + 'frontOrder/findOrder.action',
            method: 'POST',
            header: app.globalData.header,
            data: {
              userId: app.globalData.userInfo.userId,
              status: self.data.index,
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
              console.log('系统错误')
            }
          })
        },
        fail: function (error) {
          console.log("失败")
          console.log(error)
        }
      })

    }).catch(() => {
      // on cancel
    });
  }
})
