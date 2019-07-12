// pages/sort/sort.js
const e = require('../../config.js')
const app = getApp()
Page({
  data: {
    active: 0,
    sort: [],
    selectSort: []
  },
  getSort() {
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
          sort: res.data.data
        })
        let cacheId = {
          currentTarget: {
            dataset: {
              id: res.data.data[0].id
            }
          }
        }
        this.onChange(cacheId)
      }
    })
  },
  search(event) {
    wx.navigateTo({
      url: '../index/list/list?search=' + event.detail,
    })
  },
  onChange(event) {
    console.log(event)
    app.showMsg('加载中')
    wx.request({
      url: e.url + 'goodsFront/listAllByOneType.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        appid: e.appid,
        typeId: event.currentTarget.dataset.id,
        limit: 100
      },
      success: (res) => {
        this.setData({
          selectSort: res.data.data,
          active: event.detail||0
        })
        app.hideMsg()
      }
    })
  },
  onLoad(options) {
    this.getSort()
  },
  onPullDownRefresh() {
    this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500)
  },
})