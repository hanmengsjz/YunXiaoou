//app.js

const e = require("/config.js")
const utils = require('/utils/util.js')
App({
  onLaunch: function() {
    console.log('onLaunch')
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    // 登录
    wx.login({
      success: r => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = r.code; //登录凭证  
        console.log(code)
        if (code) {
          //2、调用获取用户信息接口  
          wx.getUserInfo({
            success: function(res) {
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息  
              console.log(res)
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
                success: function(data) {
                  console.log(data)
                  //4.解密成功后 获取自己服务器返回的结果  
                  if (data.data.status == 0) {
                    var userInfo_ = data.data.userInfo;
                    that.globalData.userInfo = userInfo_;
                    wx.setStorage({
                      key: 'Cookie',
                      data: data.header['Set-Cookie']
                    })
                    wx.setStorage({
                      key: 'openId',
                      data: userInfo_.openId
                    })
                    that.globalData.header.Cookie = data.header['Set-Cookie']
                    console.log(userInfo_)
                  } else {
                    console.log('解密失败')
                  }

                },
                fail: function() {
                  console.log('系统错误')
                }
              })
            },
            fail: function() {
              console.log('获取用户信息失败')
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function() {
        console.log('登陆失败')
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    this.getCurrentTime()
  },
  globalData: {
    userInfo: null,
    header: {
      'Cookie': wx.getStorageSync("Cookie"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    orderAddress: null,
    orderCoupon: null,
    currentTime: null
  },
  getCurrentTime() {
    setInterval(() => {
      this.globalData.currentTime = utils.formatTime(new Date())
    }, 1000)
  },
  showMsg(e) {
    wx.showLoading({
      title: e,
    })
  },
  hideMsg() {
    wx.hideLoading()
  },
  showError(e){
    wx.showModal({
      title: '提示',
      content: '非营业时间',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})