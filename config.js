const shareEvent = (option, id) => {
  let shareObj = {
    title: '云小讴',
    path: '/pages/login/login?id=' + id,
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

const serverurl = 'http://192.168.1.102:8080/'

const appid = 'wx2967a837dd25acd2'

//const serverurl = 'https://www.commerce.zhilaicloud.com/'
//serverurl = 'https://www.drinksmallwine.cn//'
//serverurl: "http://192.168.1.102:8080/",/*李凯*/
/*韩猛*/

//serverurl: "http://192.168.1.107:8080/", /*自己*/
module.exports = { serverurl, shareEvent, appid};