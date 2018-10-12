// pages/content/content.js
let contentList=[]
let contentLength
let key

let markers = []

const innerAudioContext = wx.createInnerAudioContext()

Page({
  data:{
    contentList:[],
    markers:[],
    hide:'null'
  },
  onLoad:function(){
    //wx.clearStorageSync()
    contentList=[];
    markers= [];
    wx.setNavigationBarTitle({
      title: '生活经历'
    })
    contentLength=wx.getStorageInfoSync().keys.length-1
    for(var i=0;i<contentLength;i++){
      key='c'+(i+1)
      contentList.unshift(wx.getStorageSync(key))
    }
    this.setData({
      contentList:contentList
    })
    console.log(contentList)
    for(var i=0;i<contentList.length;i++){
      markers.push([{
        latitude:contentList[i].latitude,
        longitude:contentList[i].longitude,
        iconPath:'/images/location2.png'
      }])
    }
    this.setData({
      markers: markers
    })
  },
  recordReplay:function(e) {
    var index=(e.target.dataset.num.split(""))[1]-1
    this.setData({
      hide: e.target.dataset.index
    })
    innerAudioContext.src=this.data.contentList[index].recordFilePath;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    });
  },
  recordReplayStop: function () {
    innerAudioContext.stop();
    this.setData({
      hide: 'null'
    })
  }
})
