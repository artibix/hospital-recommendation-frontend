import { createApp } from 'vue'
import './app.styl'
import store from './store'
import { Searchbar } from '@nutui/nutui-taro'
import { Elevator } from '@nutui/nutui-taro'
import { setMockMode } from '@/api/config'

if (process.env.NODE_ENV === 'development') {
  setMockMode(true)  // 开发环境使用mock
} else {
  setMockMode(false) // 生产环境使用真实接口
}

const App = createApp({
  onShow () {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(store)
App.use(Searchbar)
App.use(Elevator)

export default App
