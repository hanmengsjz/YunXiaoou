//index.js
//获取应用实例
const e = require('../../../config.js')
const app = getApp()
Page({
  data: {
    spec: {},
    count: 1,
    showPop: false,
    goods: [],
    popData: [],
    user_id: null,
    businessTime: true,
    classify: [],
    swiperData: [],
    first_order: false
  },
  onLoad(event) {
    wx.hideTabBar({})
    app.showMsg('加载中')
    wx.getStorage({
      key: 'userId',
      success(res) {
        app.globalData.userId = res.data
      }
    })
    this.getGoods()
    this.getClass()
    this.getSwiperData()
    this.getBussiness()
    if (app.globalData.promoter != null) {
      wx.request({
        url: e.url + 'frontGeneralize/insert.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          promoter: app.globalData.promoter,
          by_promoter: wx.getStorageSync('userId'),
          by_promoter_name: app.globalData.userInfo.nickName
        },
        success: (res) => {}
      })
    }
  },
  getGoods() {
    wx.request({
      url: e.url + 'frontFashion/findAll.action',
      data: {
        appid: e.appid
      },
      method: 'post',
      header: app.globalData.header,
      success: (res) => {
        if (res.data.code == 0) {
          this.setData({
            goods: res.data.data
          })
        }
      }
    })
  },
  onReady() {
    app.hideMsg();
    wx.getStorage({
      key: 'userId',
      success(res) {
        app.globalData.userId = res.data
      }
    })
  },
  onShow() {
    this.checkFirstOrder()
    this.setData({
      first_order: wx.getStorageSync('first_order') == 0
    })
  },
  getBussiness() {
    wx.request({
      url: e.url + 'frontBusinessHours/findByAppid.action',
      method: 'post',
      data: {
        appid: e.appid
      },
      header: app.globalData.header,
      success: (res) => {
        try {
          wx.setStorageSync(
            'bussiness_time', JSON.stringify(res.data)
          )
        } catch (e) {
          wx.setStorage({
            key: 'bussiness_time',
            data: JSON.stringify(res.data)
          })
        }
        if (app.globalData.currentTime.slice(11, 13) < JSON.parse(wx.getStorageSync('bussiness_time')).data.start_time || app.globalData.currentTime.slice(11, 13) >= JSON.parse(wx.getStorageSync('bussiness_time')).data.end_time) {
          this.setData({
            businessTime: false
          })
        } else {
          this.setData({
            businessTime: true
          })
        }
      }
    })
  },
  checkFirstOrder() {
    wx.request({
      url: e.url + 'appFrontLogin/findById.action',
      method: 'post',
      data: {
        id: wx.getStorageSync('userId')
      },
      header: app.globalData.header,
      success: (res) => {
        wx.setStorage({
          key: 'first_order',
          data: res.data.data.first_order
        })
      }
    })
  },
  getSwiperData() {
    wx.request({
      url: e.url + 'frontCarousel/findByAppId.action',
      method: 'post',
      data: {
        appid: e.appid
      },
      header: app.globalData.header,
      success: (res) => {
        this.setData({
          swiperData: res.data.data
        })
      }
    })
  },
  getClass() {
    wx.request({
      url: e.url + 'goodsFront/listByAppId.action',
      data: {
        appid: e.appid,
        pid: 0
      },
      method: 'post',
      header: app.globalData.header,
      success: (res) => {
        this.setData({
          classify: res.data.data
        })
      }
    })
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
    if (event.currentTarget.dataset.id != null) {
      wx.navigateTo({
        url: '../detail/detail?id=' + event.currentTarget.dataset.id,
      })
    }
  },
  goList(e) {
    wx.navigateTo({
      url: '../list/list?type=' + e.currentTarget.dataset.type,
    })
  },
  showPop(event) {
    if (this.data.businessTime) {
      this.setData({
        showPop: !this.data.showPop,
        count: 1
      })
      if (event.currentTarget.dataset.goods) {
        this.setData({
          popData: event.currentTarget.dataset.goods,
          spec: event.currentTarget.dataset.goods.specificationGood[0]
        })
      }
    } else {
      app.showError()
    }
  },
  addCar(event) {
    app.showMsg('加载中')
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
  search(event) {
    wx.navigateTo({
      url: '../list/list?search=' + event.detail,
    })
  },
  buyNow(event) {
    wx.navigateTo({
      url: '../order/order?id=' + event.currentTarget.dataset.id + '&count=' + this.data.count + '&spec=' + JSON.stringify(this.data.spec),
    })
  },
  onShareAppMessage(event) {
    return e.shareEvent(event, wx.getStorageSync('userId'));
  },
  onPullDownRefresh() {
    this.onLoad()
    this.onShow()
    setTimeout(() => {
      app.hideMsg()
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500)
  },
})