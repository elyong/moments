// pages/add/add.js
const app = getApp()

let imageFilePath=[]
let key=[]

let recordFilePath=''

let timer
let seconds=0
let minutes=0

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

function Count(that,stopSign) {
  if(stopSign==true){
    clearTimeout(timer);
    return;
  }
  if (seconds < 59) {
    seconds = seconds + 1;
  } else if (seconds >= 59) {
    seconds = 0;
    minutes = minutes + 1;
  }
  timer = setTimeout(function () {
    that.setData({
      seconds: seconds,
      minutes: minutes
    })
    Count(that);
  }, 1000);
}

Page({
  data: {
    title:'',
    titleKey: 'titleKey',
    formKey:'',
    imageUrlList: [],
    recordStatus:1,
    minutes:'0',
    seconds:'0',
    playOrStop:false,
    address:'',
    latitude:'',
    longitude:'',
    isIpx: app.globalData.isIpx ? true : false,
    contentLength: 0,
    submit:false
  },
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: '添加生活新鲜事'
    })
    imageFilePath=[]
    recordFilePath = ''
  },
  onReady: function () {
    this.restoreForm();
  },
  restoreForm: function () {
    var key = this.data.titleKey;
    var storageData = wx.getStorageSync(key);
    if (storageData) {
      this.setData({
        title: storageData.title
      });
    }
    if(!storageData)
      wx.setStorageSync(key)

  },
  titleChange:function(e){
    this.data.title = e.detail.value;
  },
  onUnload:function(){
    this.setFormStorage();
    recorderManager.stop();
    Count(this, true);
  },
  setFormStorage: function () {
    var key = this.data.titleKey;
    var title=this.data.title;
    var obj={
      title:title
    }
    wx.setStorage({
      key: key,
      data: this.data.submit?'':obj
    })
  },
  chooseImage:function(){
    var that = this;
    wx.chooseImage({
      success: function(res) {
        imageFilePath=imageFilePath.concat(res.tempFilePaths);
        that.setData({
           imageUrlList: imageFilePath
        })
      }
    })
  },
  previewImage:function(e){
    wx.previewImage({
      current: imageFilePath[e.target.dataset.index],
      urls: imageFilePath,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  recordStart:function(){
    var that = this;
    seconds=0;
    minutes=0;
    recorderManager.start();
    recorderManager.onStart(() => {
      console.log('recorder start')
      that.setData({
        minutes: '0',
        seconds: '0',
        recordStatus: 2
      });
      Count(that);
    })
  },
  recordStop:function(){
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop')
      recordFilePath = res.tempFilePath;
    })
    Count(this,true);
    this.setData({
      recordStatus: 3
    });
  },
  recordReplay:function(){
    var that = this;
    console.log(recordFilePath)
    innerAudioContext.src = recordFilePath;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.setData({
        playOrStop: true
      })
    });
    innerAudioContext.onEnded(() => {
      console.log('停止播放')
      that.setData({
        playOrStop: false
      })
    });
  },
  recordReplayStop:function(){
    innerAudioContext.stop();
    this.setData({
      playOrStop: false
    })
  },
  recordUninstall:function(){
    innerAudioContext.stop();
    innerAudioContext.src='';
    recordFilePath='';
    this.setData({
      recordStatus: 1,
      playOrStop: false
    })
  },
  chooseLocation:function(){
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          address:res.address,
          latitude:res.latitude,
          longitude:res.longitude
        })
      },
    })
  },
  formSubmit: function (e) {
    var that=this;
    var key = 'c'+(wx.getStorageInfoSync().keys.length-1+1)
    var obj = {
      num:key,
      title: e.detail.value.title,
      imageFilePath: imageFilePath,
      recordFilePath: recordFilePath,
      address: this.data.address,
      latitude: this.data.latitude,
      longitude: this.data.longitude
    }
    console.log(key,obj)
    if (obj.title === '' || !obj.imageFilePath === [] || obj.recordFilePath === '' || obj.address === '' || obj.latitude === '' || obj.longitude === ''){
      wx.showModal({
        title:'请填入全部内容',
        showCancel:false
      })
    }else{
      wx.setStorage({
        key: key,
        data: obj,
        success:function(){
          that.setData({
            submit: true
          });
          wx.showToast({
            title: '提交成功'
          })
        }
      });
      wx.navigateBack()
    }
  }
})