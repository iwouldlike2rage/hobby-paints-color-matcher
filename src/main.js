import Vue from 'vue'
import App from './App.vue'
import VueTour from 'vue-tour';
import VueAnalytics from 'vue-analytics'
import VTooltip from 'v-tooltip'

Vue.config.productionTip = false
require('vue-tour/dist/vue-tour.css')

Vue.use(VTooltip)
Vue.use(VueTour)
Vue.use(VueAnalytics, {
  id: 'UA-136596846-1'
});
new Vue({
  render: h => h(App),
}).$mount('#app')
