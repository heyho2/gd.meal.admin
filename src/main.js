import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// import { mockXHR } from '../mock' // simulation data

// // mock api in github pages site build
// if (process.env.NODE_ENV === 'production') { mockXHR() }

import VueLazyload from 'vue-lazyload'  //引入这个懒加载插件

//Vue.use(VueLazyload)

//或者添加VueLazyload 选项
Vue.use(VueLazyload, {
  preLoad: 1.3,//130%高度
  // error: 'dist/error.png',
  loading: 'static/img/loading.gif',
  attempt: 1
})

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
