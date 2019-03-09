// pages/Member/index/index.js
const app = getApp();
wx.getStorage({
  key: 'Cookie',
  success(res) {

  }
})
const e = require("../../../config.js");
Page({
    data: {
      userInfo:{},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
    /*登录授权*/
    login(){
      var self=this;
      wx.login({
        success: function (r) {
          var code = r.code; //登录凭证  
          console.log(code)
          if (code) {
            //2、调用获取用户信息接口  
            wx.getUserInfo({
              success: function (res) {
                //3.请求自己的服务器，解密用户信息 获取unionId等加密信息  
                wx.request({
                  url: e.serverurl + 'appFrontLogin/decodeUserInfo.action', //自己的服务接口地址  
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    code: code
                  },
                  success: function (data) {
                    console.log(data)
                    //4.解密成功后 获取自己服务器返回的结果  
                    if (data.data.status == 0) {
                      var userInfo_ = data.data.userInfo;
                      app.globalData.userInfo = userInfo_;
                      app.globalData.header.Cookie = data.header['Set-Cookie'];
                      wx.setStorage({
                        key: 'Cookie',
                        data: data.header['Set-Cookie']
                      })
                      self.setData({
                        userInfo: userInfo_,
                        hasUserInfo: true
                      })
                    } else {
                      console.log('解密失败')
                    }

                  },
                  fail: function () {
                    console.log('系统错误')
                  }
                })
              },
              fail: function () {
                console.log('获取用户信息失败')
              }
            })

          } else {
            console.log('获取用户登录态失败！' + r.errMsg)
          }
        },
        fail: function () {
          console.log('登陆失败')
        }
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
    },
    /*进入我的二维码页面*/
  toCode(){
    wx.navigateTo({
      url: '../code/code',
    })
  },
  /*进入我的提成页面 */
  toRoyalty(){
    wx.navigateTo({
      url: '../royalty/royalty',
    })
  },
  /*进入我的优惠券页面 */
  toCoupon(){
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  toAddress() {
	    wx.navigateTo({
	      url: '../address/address/address',
	    })
	  },
  /*进入订单页 */
  toList(event) {
    var index = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../list/list/list?index=' + index,
    })
  }
})