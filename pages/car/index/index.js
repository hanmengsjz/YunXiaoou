// pages/shoppingcar/index/index.js
var app = getApp();
const e = require('../../../config.js')
Page({
  data: {
    shopcarData: [],
    selectArr: [],
    allsel: false,
    total: 0,
    businessTime: true
  },
  onShow(event) {
    if (app.globalData.currentTime.slice(11, 13) < 11 || app.globalData.currentTime.slice(11, 13) > 22) {
      this.setData({
        businessTime: false
      })
    }
    this.listData();
    this.total();
  },
  listData() {
    app.showMsg('加载中');
    wx.request({
      url: e.serverurl + 'shoppingTrolley/listAllByUserId.action',
      method: 'post',
      header: app.globalData.header,
      data: {
        UserId: app.globalData.userInfo.userId
      },
      success: (res) => {
        console.log(res)
        this.setData({
          shopcarData: res.data.data
        })
        this.total();
        app.hideMsg();
      }
    })
  },
  numChange(event) {
    app.showMsg('加载中');
    console.log(event);
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
        user_id: app.globalData.userInfo.userId,
        goods_id: event.currentTarget.dataset.id,
        conut: count
      },
      success: (res) => {
        this.listData();
        this.total()
        app.hideMsg();
      }
    })
  },
  deleteGoods(event) {
    console.log(event)
    wx.showActionSheet({
      itemList: ['确认'],
      success: (res) => {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.request({
            url: e.serverurl + 'shoppingTrolley/delete.action',
            method: 'post',
            header: app.globalData.header,
            data: {
              id: event.currentTarget.dataset.id
            },
            success: (res) => {
              console.log(res)
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
      fail(res) {
        console.log(res.errMsg)
      }
    })

  },
  goDetail(event) {
    console.log(event)
    wx.navigateTo({
      url: '../../index/detail/detail?id=' + event.currentTarget.dataset.id,
    })
  },
  onSelect(event) {
    console.log(event);
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
    console.log(this.data.selectArr)
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
    console.log(this.data.selectArr)
    let tempTotal = 0
    for (let i = 0; i < this.data.selectArr.length; i++) {
      console.log(i)
      for (let n = 0; n < this.data.shopcarData.length; n++) {
        if (this.data.selectArr[i] == this.data.shopcarData[n].id) {
          tempTotal += this.data.shopcarData[n].conut * this.data.shopcarData[n].goods.money
        }
      }
    }
    this.setData({
      total: tempTotal * 100
    })
  },
  submit(event) {
    console.log(event)
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
  }
})