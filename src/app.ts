import { createApp } from 'vue'
import './app.styl'
import store from './store'
import { Searchbar } from '@nutui/nutui-taro'
import { Elevator } from '@nutui/nutui-taro'

const App = createApp({
  onShow () {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(store)
App.use(Searchbar)
App.use(Elevator)

export default App
