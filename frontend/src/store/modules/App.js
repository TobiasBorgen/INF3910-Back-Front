import Vue from 'vue'
import * as t from '@/store/mutation-types'

const state = {
	thingName: null
}

const mutations = {
	[t.APP_SET_THING_NAME] (state, thingName) {
		state.thingName = thingName
	}
}

export default {
	state,
	mutations
}
