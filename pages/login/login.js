// pages/login/login.js
const app = getApp();
const e = require("../../config.js");
console.log(app)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    main: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //app.showMsg('正在加载…')
    console.log(this.data.canIUse)
    //app.hideMsg()
    if (app.globalData.userInfo) {
      console.log('----')
      wx.switchTab({
        url: '../index/index/index'
      })
      return
    } else if (this.data.canIUse) {
      console.log('=====')
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        wx.switchTab({
          url: '../index/index/index'
        })
      }
    } else {
      console.log('+++++')
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          wx.switchTab({
            url: '../index/index/index'
          })
        }
      })
    }
  },
  gave() {
    var self = this;
    wx.login({
      success: function(r) {
        var code = r.code; //登录凭证  
        console.log(code)
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
                  code: code
                },
                success: function(data) {
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
                    wx.setStorage({
                      key: 'openId',
                      data: userInfo_.openId
                    })
                    wx.setStorage({
                      key: 'nickName',
                      data: userInfo_.nickName
                    })
                    wx.switchTab({
                      url: '../index/index/index'
                    });
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
  }
})