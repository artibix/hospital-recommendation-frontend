// src/app.config.ts
export default ({
  pages: [
    'pages/index/index',
    'pages/assistant/index',
    'pages/hospital/list',
    'pages/hospital/favorites',
    'pages/hospital/detail',
    'pages/profile/index'
  ],
  tabBar: {
    color: '#666666',
    selectedColor: '#2B87FF',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: '/assets/img/home-gray.png',
        selectedIconPath: '/assets/img/home-blue.png'
      },
      {
        pagePath: 'pages/assistant/index',
        text: '智能助手',
        iconPath: '/assets/img/assistant-gray.png',
        selectedIconPath: '/assets/img/assistant-blue.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: '/assets/img/user-gray.png',
        selectedIconPath: '/assets/img/user-blue.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '智能医院导航',
    navigationBarTextStyle: 'black'
  }
})