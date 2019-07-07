//app.js

const e = require("/config.js")
const utils = require('/utils/util.js')
App({
  onLaunch: function() {
    var that = this;
    // 登录
    wx.login({
      success: r => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = r.code; //登录凭证  
        if (code) {
          //2、调用获取用户信息接口  
          wx.getUserInfo({
            success: function(res) {
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
                  code: code,
                  appid: e.appid
                },
                success: function(data){
                  //4.解密成功后 获取自己服务器返回的结果  
                  if (data.data.status == 0) {
                    var userInfo_ = data.data.userInfo;
                    that.globalData.userInfo = userInfo_;
                    try{
                      wx.setStorageSync(
                       'Cookie', data.header['Set-Cookie']        
                      )
                    }catch(e){
                      wx.setStorage({
                        key: 'Cookie',
                        data: data.header['Set-Cookie']
                      })
                    }
                    try {
                      wx.setStorageSync(
                       'openId', userInfo_.openId
                      )
                    } catch (e) {
                      wx.setStorage({
                        key: 'openId',
                        data: userInfo_.openId
                      })
                    }
                    try {
                      wx.setStorageSync(
                        'nickName', userInfo_.nickName
                      )
                    } catch (e) {
                      wx.setStorage({
                        key: 'nickName',
                        data: userInfo_.nickName
                      })
                    }
                    try {
                      wx.setStorageSync(
                       'userId', userInfo_.userId
                      )
                    } catch (e) {
                      wx.setStorage({
                        key: 'userId',
                        data: userInfo_.userId
                      })
                    }
                    wx.setStorage({
                      key: 'first_order',
                      data: userInfo_.first_order
                    })
                    that.globalData.header.Cookie = data.header['Set-Cookie']
                  } else {
                  }
                },
                fail: function() {
                }
              })
            },
            fail: function() {
            }
          })

        } else {
        }
      },
      fail: function() {
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
    currentTime: null,
    promoter:null
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
      content: JSON.parse(wx.getStorageSync('bussiness_time')).msg,
      success(res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      }
    })
  }
})