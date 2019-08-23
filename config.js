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

const url = 'https://www.commerce.zhilaicloud.com/'
const appid = 'wx2967a837dd25acd2'

//const url = 'https://www.commerce.zhilaicloud.com/'
//url = 'https://www.drinksmallwine.cn//'
//url: "http://192.168.1.102:8080/",/*李凯*/
/*韩猛*/

//url: "http://192.168.1.107:8080/", /*自己*/
module.exports = { url, shareEvent, appid};