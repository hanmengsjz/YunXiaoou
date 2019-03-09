//index.js
//获取应用实例
const e = require('../../../config.js')
const app = getApp()
Page({
  data: {
    temp: 0,
    count: 1,
    showPop: false,
    fashion: [],
    findHot: [],
    popData: [],
    user_id: null,
    businessTime: true
  },
  onLoad(event) {
    if (app.globalData.currentTime.slice(11, 13) < 11 || app.globalData.currentTime.slice(11, 13) > 22) {
      this.setData({
        businessTime: false
      })
    }
    if (event.id) {
      this.setData({
        user_id: event.id
      })
      wx.request({
        url: e.serverurl + 'frontGeneralize/insert.action',
        method: 'post',
        header: app.globalData.header,
        data: {
          promoter: event.id,
          by_promoter: app.globalData.userInfo.userId
        },
        success: (res) => {
          console.log(res)
        }
      })
    }
    app.showMsg('加载中')
    wx.request({
      url: e.serverurl + 'frontFashion/listAll.action',
      method: 'post',
      header: app.globalData.header,
      success: (res) => {
        console.log(res)
        if (res.data.code == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].id == 4) {
              res.data.data.splice(i, 1)
            }
          }
          this.setData({
            fashion: res.data.data
          })
        }
      }
    })
    wx.request({
      url: e.serverurl + 'goodsFront/findHot.action',
      method: 'post',
      header: app.globalData.header,
      success: (res) => {
        this.setData({
          findHot: res.data.data
        })
        console.log(res)
      }
    })
  },
  onReady() {
    app.hideMsg();
  },
  temp(e) {
    console.log(e)
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
  goList(e) {
    console.log(e)
    wx.navigateTo({
      url: '../list/list?type=' + e.currentTarget.dataset.type,
    })
  },
  showPop(event) {
    console.log(event)
    console.log(this.data)
    if(this.data.businessTime){
      this.setData({
        showPop: !this.data.showPop,
        temp: 2,
        count: 1
      });
      if (this.data.showPop) {
        let index = event.currentTarget.dataset.index
        this.setData({
          popData: this.data.findHot[index]
        })

      }
    }else{
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
          console.log(this)
          this.showPop();
        }, 1800)
      }
    })
  },
  search(event) {
    console.log(event.detail.value)
    wx.navigateTo({
      url: '../list/list?search=' + event.detail.value,
    })
  },
  buyNow(event) {
    console.log(event)
    wx.navigateTo({
      url: '../order/order?id=' + event.currentTarget.dataset.id + '&count=' + this.data.count + '&temp=' + this.data.temp,
    })
  },
  onShareAppMessage(event) {
    return e.shareEvent(event, app.globalData.userInfo.userId);
  }
})