import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App) // ルートコンポーネントからアプリを作る
app.use(createPinia()) // プラグインとして Pinia を登録
app.use(router) // プラグインとして Router を登録
app.mount('#app') // #app に描画する
