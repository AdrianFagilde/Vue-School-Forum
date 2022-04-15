import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import firebase from '@/helpers/firebase'
import firebaseConfig from '@/config/firebase.js'
import FontAwesome from '@/plugins/FontAwesome.js'
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective.js'
import PageScrollDirective from '@/plugins/PagesScrollDirective.js'
import Vue3Pagination from '@/plugins/Vue3Pagination.js'
import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'
firebase.initializeApp(firebaseConfig);


const app = createApp(App)
app.use(router)
app.use(store)
app.use(Vue3Pagination)
app.use(VeeValidatePlugin)
const requireComponent = require.context("./components", true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  app.component(baseComponentName, baseComponentConfig)
})
app.use(FontAwesome)
app.use(ClickOutsideDirective)
app.use(PageScrollDirective)

app.mount('#app')
