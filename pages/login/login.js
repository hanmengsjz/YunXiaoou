// pages/login/login.js
const app = getApp();
const e = require("../../config.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    main: false,
    user_id: null,
    bgInfo:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBg()
    wx.getStorage({
      key: 'userId',
      success(res) {
        app.globalData.userId = res.data
      }
    })
    app.showMsg('正在进入…')
    setTimeout(() => {
      if (app.globalData.userInfo) {
        wx.switchTab({
          url: '../index/index/index'
        })
        return
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          wx.switchTab({
            url: '../index/index/index'
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            wx.switchTab({
              url: '../index/index/index'
            })
          }
        })
      }
    }, 1000)
    setTimeout(() => {
      app.hideMsg()
      this.setData({
        main: true
      })
    }, 2000)
    if (options.id || options.scene) {
      // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      let promoter = options.id || decodeURIComponent(options.scene)
      app.globalData.promoter = promoter
    }
  },
  getBg(){
    wx.request({
      url: e.serverurl + 'frontAuthorization/findByAppid.action',
      method: 'post',
      data:{appid:e.appid},
      header: app.globalData.header,
      success: (res) => {
        this.setData({
          bgInfo:res.data.data[0]
        })
      }
    })
  },
  gave() {
    var self = this;
    wx.login({
      success: function(r) {
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
                  appid:e.appid
                },
                success: function(data) {
                  //4.解密成功后 获取自己服务器返回的结果  
                  if (data.data.status == 0) {
                    var userInfo_ = data.data.userInfo;
                    app.globalData.userInfo = userInfo_;
                    app.globalData.header.Cookie = data.header['Set-Cookie'];
                    try {
                      wx.setStorageSync(
                       'Cookie',
                       data.header['Set-Cookie']
                      )
                    } catch (e) {
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
                         'nickName',userInfo_.nickName
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
                    wx.switchTab({
                      url: '../index/index/index'
                    });
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
  }
})