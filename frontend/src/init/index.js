import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'

Vue.config.productionTip = false
Vue.use(VueSocketio, 'localhost:3000')
Vue.use(VueResource)
Vue.use(VueMaterial)

import '@/assets/css/fonts_icons.css'
import '@/../node_modules/vue-material/dist/vue-material.css'

Vue.material.registerTheme('default', {
	primary: 'light-blue',
	accent: 'blue',
	warn: 'red'
})
