// src/app.config.ts
export default ({
  pages: [
    'pages/index/index',
    'pages/assistant/index',
    // 'pages/profile/index'
  ],
  tabBar: {
    color: '#666666',
    selectedColor: '#2B87FF',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: '/assets/img/my-off.png',
        selectedIconPath: '/assets/img/my-off.png'
      },
      {
        pagePath: 'pages/assistant/index',
        text: '智能助手',
        iconPath: '/assets/img/my-off.png',
        selectedIconPath: '/assets/img/my-off.png'
      },
      // {
      //   pagePath: 'pages/profile/index',
      //   text: '我的',
      //   iconPath: '/assets/img/my-off.png',
      //   selectedIconPath: '/assets/img/my-off.png'
      // }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '智能医院导航',
    navigationBarTextStyle: 'black'
  }
})