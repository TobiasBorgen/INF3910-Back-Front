import Vue from 'vue'
import * as t from '@/store/mutation-types'
import {CONFIG} from '@/config'
import {CC} from '@/lib/CloudConnect'

const state = {
}

const mutations = {
}

const actions = {
	create ({commit}) {
		const payload = {
			action: 'CREATE',
			attributes: {
				thingType: CONFIG.THING_TYPE,
				domain: CONFIG.THING_DOMAIN
			},
			requestedSize: 1
		}
		return CC.invoke('ThingBatchLambda', payload)
	}
}

const getters = {
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
