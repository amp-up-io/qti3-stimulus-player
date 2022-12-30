import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// Get app context from window.qti3PlayerContext
Vue.prototype.$VUE_APP_CONTEXT = window?.qti3PlayerContext || null

new Vue({
  render: h => h(App)
}).$mount('#qti3Player')
