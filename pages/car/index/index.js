// pages/shoppingcar/index/index.js
var app = getApp();
const e = require('../../../config.js')
Page({
  data: {
    shopcarData: [],
    selectArr: [],
    allsel: false,
    total: 0,
    businessTime: true,
    first_order: false
  },
  onShow(event) {
    wx.getStorage({
      key: 'userId',
      success(res) {
        app.globalData.userId = res.data
      }
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
    this.listData();
    this.total();
    this.setData({
      first_order: wx.getStorageSync('first_order') == 0
    })
  },
  listData() {
    app.showMsg('加载中');
    wx.request({
      url: e.serverurl + 'shoppingTrolley/listAllByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        UserId: wx.getStorageSync('userId')
      },
      success: (res) => {
        this.setData({
          shopcarData: res.data.data
        })
        this.total();
        app.hideMsg();
      }
    })
  },
  numChange(event) {
    app.showMsg('加载中')
    let count = null
    if (event.type == 'plus') {
      count = 1
    } else if (event.type == 'minus') {
      count = -1
    }
    wx.request({
      url: e.serverurl + 'shoppingTrolley/edit.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        user_id: wx.getStorageSync('userId'),
        goods_id: event.currentTarget.dataset.id,
        conut: count,
        specification_id: event.currentTarget.dataset.sid,
        specification_name: event.currentTarget.dataset.sname,
      },
      success: (res) => {
        this.listData();
        this.total()
        app.hideMsg();
      }
    })
  },
  deleteGoods(event) {
    wx.showActionSheet({
      itemList: ['确认'],
      success: (res) => {
        if (res.tapIndex == 0) {
          wx.request({
            url: e.serverurl + 'shoppingTrolley/delete.action',
            method: 'post',
            header: app.globalData.header,
            data: {
              id: event.currentTarget.dataset.id
            },
            success: (res) => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(() => {
                this.listData();
              }, 1800)
              this.total();
            }
          })
        }
      },
      fail(res) {}
    })

  },
  goDetail(event) {
    wx.navigateTo({
      url: '../../index/detail/detail?id=' + event.currentTarget.dataset.id,
    })
  },
  onSelect(event) {
    this.setData({
      selectArr: event.detail
    });
    this.allsel()
    this.total();
  },
  onSelectAll(event) {
    this.setData({
      allsel: !this.data.allsel
    })
    if (this.data.allsel) {
      let tempArr = []
      for (let i = 0; i < this.data.shopcarData.length; i++) {
        tempArr.push(this.data.shopcarData[i].id + '')
      }
      this.setData({
        selectArr: tempArr
      })
    } else {
      this.setData({
        selectArr: []
      })
    }
    this.total();
  },
  allsel() {
    if (this.data.selectArr.length == this.data.shopcarData.length) {
      this.setData({
        allsel: true
      })
    } else {
      this.setData({
        allsel: false
      })
    }
  },
  total() {
    let tempTotal = 0
    for (let i = 0; i < this.data.selectArr.length; i++) {
      for (let n = 0; n < this.data.shopcarData.length; n++) {
        if (this.data.selectArr[i] == this.data.shopcarData[n].id) {
          if (this.data.first_order && this.data.shopcarData[n].goods.is_discount != 0) {
            tempTotal += (this.data.shopcarData[n].conut - 1) * this.data.shopcarData[n].goods.money + this.data.shopcarData[n].goods.money * this.data.shopcarData[n].goods.discount_num
          } else {
            tempTotal += this.data.shopcarData[n].conut * this.data.shopcarData[n].goods.money
          }
        }
      }
    }
    this.setData({
      total: tempTotal * 100
    })
  },
  submit(event) {
    if (this.data.businessTime) {
      if (this.data.selectArr.length == 0) {
        wx.showToast({
          title: '请选择商品',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../order/order?arr=' + this.data.selectArr,
        })
      }
    } else {
      app.showError()
    }
  },
  onPullDownRefresh: function() {
    this.onShow()
    setTimeout(() => {
      app.hideMsg()
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 500)
  },
  onHide(){
    this.setData({
      selectArr:[],
      allsel: false
    })
  }
})