const shareEvent = (option, id) => {
  let shareObj = {
    title: '喝小酒儿',
    path: '/pages/index/index/index?id=' + id,
    imgUrl: '',
    success(res) {
      console.log(res)
      if (res.errMsg == 'shareAppMessage:ok') {}
    },
    fail(res) {
      console.log(res)
      if (res.errMsg == 'shareAppMessage:fail cancel') {} else if (res.errMsg == 'shareAppMessage:fail') {}
    },
    complete(res) {
      console.log(res)
    }
  };
  if (option.from === 'button') {
    console.log(option.target)
  }
  return shareObj;
}
const pay = () => {
  wx.login({
    success: function(res) {
      console.log(res)
      if (res.code) {
        wx.request({
          url: 'http://wine.yunquekeji.com/weixin/wxPay.action',
          data: {
            openid: res.code
          },
          method: 'POST',
          success: function(res) {
            console.log(res.data)
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: 'MD5',
              paySign: res.data.paySign,
              success: function(res) {
                // success
                console.log(res);
              },
              fail: function(res) {
                // fail
                console.log(res);
              },
              complete: function(res) {
                // complete
                console.log(res);
              }
            })
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
}
const serverurl = 'http://wine.yunquekeji.com/'
//serverurl: "http://192.168.1.119:8080/",/*李凯*/
//serverurl: "http://192.168.1.102:8080/", /*韩猛*/
//serverurl: "http://192.168.1.184:8080/", /*加一*/
//serverurl: "http://192.168.1.107:8080/", /*自己*/
module.exports = { serverurl, shareEvent, pay};