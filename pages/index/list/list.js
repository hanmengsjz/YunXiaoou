// pages/index/list/list.js
const e = require('../../../config.js')
const app = getApp()
Page({
  data: {
    spec: 0,
    count: 1,
    showPop: false,
    listData: [],
    popData: {},
    businessTime: true,
    first_order: false,
    activeTab: 0,
    tabData: [],
    typeId: null
  },
  onLoad(event) {
    app.showMsg('加载中')
    if (event.type) {
      wx.request({
        url: e.url + 'goodsFront/listByAppId.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          pid: event.type,
          appid: e.appid,
          limit: 100
        },
        success: (res) => {
          this.setData({
            tabData: res.data.data,
            typeId: event.type
          })
          this.getGoods({
            detail: 0
          })
          app.hideMsg()
        }
      })
    } else if (event.search) {
      wx.request({
        url: e.url + 'goodsFront/listGoodsByName.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          name: event.search,
          limit: 100,
          appid: e.appid
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
  getGoods(event) {
    app.showMsg('加载中')
    console.log(event)
    wx.request({
      url: e.url + 'goodsFront/listByType.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        type: this.data.tabData[event.detail * 1].id,
        limit: 100,
        appid: e.appid
      },
      success: (res) => {
        this.setData({
          listData: res.data.data
        })
        app.hideMsg()
      }
    })
  },
  onShow() {
    this.setData({
      first_order: wx.getStorageSync('first_order') == 0
    })
    if (app.globalData.currentTime.slice(11, 13) < JSON.parse(wx.getStorageSync('bussiness_time')).data.start_time || app.globalData.currentTime.slice(11, 13) >= JSON.parse(wx.getStorageSync('bussiness_time')).data.end_time) {
      this.setData({
        businessTime: false
      })
    } else {
      this.setData({
        businessTime: true
      })
    }
  },
  spec(e) {
    if (e.target.dataset.spec) {
      this.setData({
        spec: e.target.dataset.spec
      })
    }
  },
  numChange(e) {
    this.setData({
      count: e.detail
    })
  },
  goDetail(event) {
    wx.navigateTo({
      url: '../detail/detail?id=' + event.currentTarget.dataset.id,
    })
  },
  showPop(event) {
    if (this.data.businessTime) {
      app.showMsg('加载中');
      this.setData({
        showPop: !this.data.showPop,
        temp: 0,
        count: 1
      });
      if (this.data.showPop) {
        this.setData({
          popData: this.data.listData[event.currentTarget.dataset.index],
          spec: this.data.listData[event.currentTarget.dataset.index].specificationGood[0]
        })
      }
      app.hideMsg()
    } else {
      app.showError()
    }
  },
  addCar(event) {
    app.showMsg('加载中');
    wx.request({
      url: e.url + 'shoppingTrolley/edit.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        user_id: wx.getStorageSync('userId'),
        goods_id: event.currentTarget.dataset.id,
        conut: this.data.count,
        specification_id: this.data.spec.specification_id,
        specification_name: this.data.spec.specification_name,
      },
      success: (res) => {
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
    wx.navigateTo({
      url: '../order/order?id=' + event.currentTarget.dataset.id + '&count=' + this.data.count + '&spec=' + JSON.stringify(this.data.spec),
    })
  }
})