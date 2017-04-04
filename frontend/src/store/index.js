import Vue from 'vue'
import Vuex from 'vuex'

import App from '@/store/modules/App'
import Auth from '@/store/modules/Auth'
import Observation from '@/store/modules/Observation'
import Thing from '@/store/modules/Thing'
import ThingBatch from '@/store/modules/ThingBatch'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		App,
		Auth,
		Observation,
		Thing,
		ThingBatch
	},
	strict: process.env.NODE_ENV !== 'production'
})
