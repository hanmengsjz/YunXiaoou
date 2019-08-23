// components/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
   // 调到另一个小程序
    another() {
      wx.navigateToMiniProgram({
        appId: 'wxb24ea56f10dec071',
        path: 'pages/index/indexes/indexes',
        success(res) {
          // 打开成功
        }
      })
    }
  },



  // methods: {
  //   // 海报
  // another() {
  //     let that = this;
  //     wx.showToast({
  //       title: '海报生成中...',
  //       icon: 'loading',
  //       duration: 2000
  //     });
  //     const ctx = wx.createCanvasContext('canvas_poster');
  //     console.log(111111111111111111111111111111111)
  //     ctx.clearRect(0, 0, 0, 0);
  //     //  绘制图片模板的 底图
  //     ctx.drawImage('../../images/logo.png', 0, 0, 270, 314);
  //     //  绘制顶部banner
  //     // ctx.drawImage(that.data.banner, 0, 0, 270, 154);
  //     ctx.drawImage('../../images/logo.png', 0, 0, 270, 154);

  //     //绘制视频名称
  //     // ctx.setTextAlign('left')
  //     // ctx.setFontSize(14);
  //     // ctx.fillText(`${that.data.item.videoName}`, 9, 173);
  //     //绘制横线
  //     ctx.moveTo(0, 188)
  //     ctx.lineTo(270, 188);
  //     ctx.setLineWidth(1)
  //     ctx.setStrokeStyle('rgb(239,239,239)')
  //     ctx.stroke();

  //     ctx.moveTo(0, 236)
  //     ctx.lineTo(270, 236);
  //     ctx.setLineWidth(1)
  //     ctx.setStrokeStyle('rgb(239,239,239)')
  //     ctx.stroke()
  //   console.log(22222222)
  //     // //绘制头像
  //     ctx.save();
  //     ctx.beginPath();
  //     let r = 13;
  //     let d = r * 2;
  //     let cx = 9;
  //     let cy = 194;
  //     ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
  //     ctx.closePath();
  //     ctx.clip();
  //     //ctx.drawImage(that.data.headerImg, cx, cy, d, d);
  //     ctx.restore();
  //     //绘制昵称时间
  //     ctx.setTextAlign('left')
  //     ctx.setFontSize(12);
  //     ctx.setFillStyle('rgb(30,30,52)')
  //     // ctx.fillText(`${that.data.item.name}`, 45, 204);
  //     ctx.setFontSize(12);
  //     ctx.setFillStyle('rgb(200,200,200)')
  //     // ctx.fillText(`${that.data.item.time}`, 45, 222);

  //     //  绘制小程序码
  //     //ctx.drawImage(that.data.wxcodePic, 18, 240, 71, 71);
  //     //  绘制二维码右边说明
  //     ctx.setTextAlign('left')
  //     ctx.setFontSize(14);
  //     ctx.setFillStyle('rgb(255,131,56)')
  //     // ctx.fillText(`${that.data.item.MicroName}`, 100, 264);
  //     ctx.setFontSize(14);
  //     ctx.setFillStyle('rgb(51,51,51)')
  //     ctx.fillText('长按识别小程序码访问', 100, 290);
  //     ctx.draw();
  //   }
  // },
  // getbanner(url, that) {    //  图片缓存本地的方法
  //   if (typeof url === 'string') {
  //     wx.getImageInfo({   //  小程序获取图片信息API
  //       src: url,
  //       success: function (res) {
  //         that.setData({
  //           banner: res.path
           
  //         })
  //         console.log(444444444444)
  //       },
  //       fail(err) {
  //         console.log(err)
  //       }
  //     })
  //   }
  // },
  // //保存图片至相册
  // savePoster: function (e) {
  //   setTimeout(function () {
  //     wx.canvasToTempFilePath({
  //       x: 0,
  //       y: 0,
  //       width: 270,
  //       height: 314,
  //       destWidth: 810,
  //       destHeight: 942,
  //       quality: 1,
  //       canvasId: 'canvas_poster',
  //       fileType: 'png',
  //       success: function (res) {
  //         wx.saveImageToPhotosAlbum({
  //           filePath: res.tempFilePath,
  //           success(res) {
  //             wx.hideLoading();
  //             wx.showToast({
  //               title: '保存成功',
  //             });
  //           },
  //           fail() {
  //             wx.hideLoading()
  //           }
  //         })
  //       }
  //     })
  //   }, 500);
  // }


})




