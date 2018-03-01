import WeCropper from '../widget/we-cropper/we-cropper.js';
const device = wx.getSystemInfoSync(); // 获取设备信息
var width =684/750 * device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
var height = width;

const app = getApp()
Page({
  data:{
    privacy:0,
    shareImage:false,
    allowPublicAccess:0,
    photo_url:'',
    cropperBtnhide:'',
    uploadSuccesscls:'hide',
    alddata:{
      template_key: "1bd5645c42de23824ea182d52a2a2e4d",
      video_brand: app.globalData.appName,
      video_category: "",
      video_icon: "https://nymyzp.rmwn.com/mpimages/others/logo2.jpeg",
      video_image: "https://nymyzp.rmwn.com/photos/test/0872976684992.png",
      video_play: "",
      video_title: "快来给我发弹幕吧(^ｰ^)ノ",
      video_title_lower: "分享自" + app.globalData.appName
    },
    cropperOpt: {
      isshow:'',
      id: 'cropper',
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      
      cut: {
        x: (width - 200) / 2, // 裁剪框x轴起点
        y: (height - 200) / 2, // 裁剪框y轴期起点
        width: 200, // 裁剪框宽度
        height: 200 // 裁剪框高度
      }
    },
    pid: null
  },
  onLoad:function(option) {
      const { cropperOpt } = this.data
      const self = this;
      // 若同一个页面只有一个裁剪容器，在其它Page方法中可通过this.wecropper访问实例
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context: ${ctx}`)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context: ${ctx}`)
          wx.hideToast();
        
        })

      // 若同一个页面由多个裁剪容器，需要主动做如下处理

     // this.A = new weCropper(cropperOptA)
     // this.B = new weCropper(cropperOptB)
    },
    touchStart(e) {
      this.wecropper.touchStart(e)
    },
    touchMove(e) {
      this.wecropper.touchMove(e)
    },
    touchEnd(e) {
      this.wecropper.touchEnd(e)
    },
    uploadTap() {
      const self = this

      console.log("uploadTap");

      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
        
          const src = res.tempFilePaths[0]
          const { cropperOpt } = self.data
          cropperOpt.isshow='active';
          self.setData({ cropperBtnhide:'hide',cropperOpt: cropperOpt});
          
          self.wecropper.pushOrign(src)
        }
      })
    },
   
    getCropperImage :function() {
      console.log("getCropperImage");

      const self = this;
      self.setData({ uploadSuccesscls: '' });
   
     
      this.wecropper.getCropperImage((src) => {
        if (self.data.cropperBtnhide==''){          
        
         //uploadSuccesscls
         // self.setData({ uploadSuccesscls:''});

          wx.showToast({
            title: '您还未上传图片',
            icon: 'none',
            duration: 2000
          })
        }else  if (src) {// src裁剪后的图片路径
          wx.showLoading({
            title: "图片上传中",
          })

          //上传服务器 错误网关。。待测
        //  var tempFilePaths = res.tempFilePaths;
          self.setData({ photo_url: '' });
          wx.uploadFile({
            url: 'https://nymyzp.rmwn.com/uploadPhoto', //仅为示例，非真实的接口地址
            header: {
              'content-type': 'application/json' // 默认值
            },
            formData: {
              appSession: app.globalData.appSession
            },
            filePath: src,
            name: 'photoFile',
            success: function (res) {
              if (res.statusCode != 200){
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
                return ;
              }
              console.log(res);
              console.log(res.data);
              var data = JSON.parse(res.data)["data"];
              //do something
              self.setData({ photo_url: data.photo_url});              
              console.log(self.data);
              wx.request({
                url: 'https://nymyzp.rmwn.com/publishPhoto', //仅为示例，并非真实的接口地址
                data: {
                  appSession: app.globalData.appSession,
                  "wxnick": app.globalData.userInfo.nickName,
                  "photoFile": self.data.photo_url,
                  "privacy": self.data.privacy,
                  "allowPublicAccess": self.data.allowPublicAccess
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                method: "POST",
                success: function (res) {
                  console.log(res.data)
                  if (res.statusCode != 200) {
                    wx.showToast({
                      title: res.msg,
                      icon: 'none',
                      duration: 2000
                    });
                    return;
                  }
                  self.data.alddata.video_image = res.data.data.photo_url;
                  self.data.pid = res.data.data.pid;
                  // self.aldminishare(self.data.alddata);

                  self.download(res.data.data.mp4_url, function(res) {
                    console.log(res);
                    wx.getSavedFileList({
                      success: function (res1) {
                        if (res1.fileList.length > 0) {
                          console.log("save file list:")
                          console.log(res1)
                          wx.removeSavedFile({
                            filePath: res1.fileList[0].filePath,
                            complete: function (res2) {
                              console.log(res2)
                              wx.saveFile({
                                tempFilePath: res,
                                success: function (res) {
                                  var savedFilePath = res.savedFilePath
                                  wx.hideLoading();
                                  wx.redirectTo({
                                    url: '/pages/detail/detail?pid=' + self.data.pid + "&" + "local_mp4=" + res.savedFilePath
                                  });
                                }, fail: function (res) {
                                  console.log("dophoto saveFile fail 1")
                                  console.log(res)
                                  wx.hideLoading();
                                  wx.redirectTo({
                                    url: '/pages/detail/detail?pid=' + self.data.pid
                                  });
                                }
                              })
                            }
                          })
                        } else {
                          wx.saveFile({
                            tempFilePath: res,
                            success: function (res) {
                              var savedFilePath = res.savedFilePath
                              wx.hideLoading();
                              wx.redirectTo({
                                url: '/pages/detail/detail?pid=' + self.data.pid + "&" + "local_mp4=" + res.savedFilePath
                              });
                            }, fail: function (res) {
                              console.log("dophoto saveFile fail 2")
                              console.log(res)
                              wx.hideLoading();
                              wx.redirectTo({
                                url: '/pages/detail/detail?pid=' + self.data.pid
                              });
                            }
                          })
                        }
                      }
                    })
                  })
                }
              })
            }
          })
          // wx.previewImage({
          //   current: '', // 当前显示图片的http链接
          //   urls: [src] // 需要预览的图片http链接列表
          // })
        } else {
          wx.showToast({
            title: '获取图片地址失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
  radioChange:function(e){
    var dset= e.currentTarget.dataset;
 
    this.setData({ privacy: Number(dset.privacy)});
   // console.log(e);
  },
  allowPubAccess: function (event){
    var self = this;
    var isallow = self.data.allowPublicAccess;
    if (isallow==0){
      self.setData({ allowPublicAccess: 1 });
   }else{
      self.setData({ allowPublicAccess: 0 });
   } 
   // event.currentTarget.dataset.postId
   // allowPublic
  },
  goBack:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  getHelp:function(){

  },
  share:function(){

  },
  aldminishare: function (alddata) {
    var page = this;
    var url = page['__route__'];
    var data = {};

    data = alddata;
    data['path'] = url;
    wx.showLoading({
      title: '分享生成中...',
    })
    wx.request({
      method: 'post',
      url: 'https://shareapi.aldwx.com/Main/action/Template/Template/applet_htmlpng',
      data: data,
      success: function (data) {
        console.log("aldminishare");
        console.log(data);
        if (data.data.code === 200) {
          wx.previewImage({
            urls: [data.data.data],
            success: function() {
              console.log("previewImage success");
              wx.navigateTo({
                url: '/pages/owner/owner',
              })
            }
          })
        }
        wx.hideLoading()
      },
      fail: function () {
        wx.hideLoading();
      }
    })
  },
  shareImage:function(){

  },
  //分享转发
  onShareAppMessage: function (res) {
    var self = this;
    res.from= 'button';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '你的回忆',
      path: '/pages/index/index',//待续
      success: function (res) {
         self.setData({ uploadSuccesscls: 'hide'});
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  download: function (url, callback) {
    console.log("call download:" + url);
    var self = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        if (res.statusCode == 200) {
          console.log("statusCode == 200");
          callback(res.tempFilePath);
        } else {
          console.log("statusCode != 200, retry");
          setTimeout(function() {
            self.download(url, callback);
          }, 500);
        }
      }
    })
  },
})