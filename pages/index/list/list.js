// pages/index/list/list.js
const e = require('../../../config.js')
const app = getApp()
Page({
  data: {
    temp: 0,
    count: 1,
    showPop: false,
    listData: [],
    popData: {},
    businessTime: true
  },
  onLoad(event) {
    if (app.globalData.currentTime.slice(11, 13) < 11 || app.globalData.currentTime.slice(11, 13) > 22) {
      this.setData({
        businessTime: false
      })
    }
    app.showMsg('加载中');
    console.log(event)
    if (event.type) {
      wx.request({
        url: e.serverurl + 'goodsFront/listAllByType.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          type: event.type,
          limit: 100
        },
        success: (res) => {
          this.setData({
            listData: res.data.data
          })
          app.hideMsg()
        }
      })
    } else if (event.search) {
      wx.request({
        url: e.serverurl + 'goodsFront/listGoodsByName.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          name: event.search,
          limit: 100
        },
        success: (res) => {
          this.setData({
            listData: res.data.data
          })
          app.hideMsg()
        }
      })
    }
  },
  temp(e) {
    if (e.target.dataset.temp) {
      this.setData({
        temp: e.target.dataset.temp
      })
    }
  },
  numChange(e) {
    this.setData({
      count: e.detail
    })
  },
  goDetail(event) {
    console.log(event)
    wx.navigateTo({
      url: '../detail/detail?id=' + event.currentTarget.dataset.id,
    })
  },
  showPop(event) {
    if (this.data.businessTime) {
      app.showMsg('加载中');
      this.setData({
        showPop: !this.data.showPop,
        temp: 2,
        count: 1
      });
      if (this.data.showPop) {
        this.setData({
          popData: this.data.listData[event.currentTarget.dataset.index]
        })
      }
      app.hideMsg()
    } else {
      app.showError()
    }
  },
  addCar(event) {
    app.showMsg('加载中');
    console.log(event);
    wx.request({
      url: e.serverurl + 'shoppingTrolley/edit.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        user_id: app.globalData.userInfo.userId,
        goods_id: event.currentTarget.dataset.id,
        conut: this.data.count,
        lced: this.data.temp == 1 ? this.data.count : this.data.temp == 2 ? 0 : Math.floor(this.data.count / 2)
      },
      success: (res) => {
        console.log(res)
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.showPop();
        }, 1800)
      }
    })
  },
  /* 立即购买 */
  buyNow(event) {
    console.log(event)
    wx.navigateTo({
      url: '../order/order?id=' + event.currentTarget.dataset.id + '&count=' + this.data.count + '&temp=' + this.data.temp,
    })
  }
})