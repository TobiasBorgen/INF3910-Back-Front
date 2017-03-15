import Vue from 'vue'
import Vuex from 'vuex'

import App from '@/store/modules/App'
import Auth from '@/store/modules/Auth'
import Observation from '@/store/modules/Observation'
import Thing from '@/store/modules/Thing'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		App,
		Auth,
		Observation,
		Thing
	},
	strict: process.env.NODE_ENV !== 'production'
})
