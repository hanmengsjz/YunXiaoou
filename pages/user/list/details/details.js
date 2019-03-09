// pages/user/list/details/details.js
var times = require('../../../../utils/util.js');
const app = getApp();
const e = require("../../../../config.js");
import Dialog from '../../../../dist/dialog/dialog';
Page({

  /* 页面的初始数据 */
  data: {
    order:{}
  },
  /* 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    console.log(options)
    var order = JSON.parse(options.orders);
    order.time = times.formatTime(new Date(order.time), 'Y/M/D h:m:s');
    var orderStatus;
    var orderImg;
    switch (order.status) {
      case 0:
        orderStatus = "等待付款";
        orderImg = "/images/details0.png";
        break;
      case 1:
        orderStatus = "等待发货";
        orderImg = "/images/details1.png";
        break;
      case 2:
        orderStatus = "等待收货";
        orderImg = "/images/details2.png";
        break;
      case 3:
        orderStatus = "退款成功";
        orderImg = "/images/details3.png";
        break;
    }
    order.orderStatus = orderStatus;
    order.orderImg = orderImg;
    this.setData({
      order: order
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
          userid: app.globalData.userInfo.userId,
          id: this.data.order.id
        },
        success: (res) => {
          /* 进入列表页 */
          wx.navigateTo({
            url: '../list/list?index=0',
          })
        },
        fail: function () {
          console.log('系统错误')
        }
      })
    }).catch(() => {
      // on cancel
    });
  }
})