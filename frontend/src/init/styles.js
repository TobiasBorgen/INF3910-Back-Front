import Vue from 'vue'
import VueMaterial from 'vue-material'

Vue.use(VueMaterial)

import '@/assets/css/fonts_icons.css'
import '@/../node_modules/vue-material/dist/vue-material.css'
import '@/../node_modules/leaflet/dist/leaflet.css'
import '@/assets/css/global.scss'

Vue.material.registerTheme('default', {
	primary: {
		color: 'indigo',
		hue: 500	
	},
	accent: 'indigo',
	warn: {
		color: 'indigo',
		hue: 400
	}
})

Vue.material.registerTheme('toolbar', {
	primary: 'white'
})
