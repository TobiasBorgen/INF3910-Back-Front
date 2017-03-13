import Vue from 'vue'
import objectMerge from 'object-merge'
import * as t from '@/store/mutation-types'
import {CC} from '@/lib/CloudConnect'

const state = {
	things: null
}

const mutations = {
	[t.THING_GET_RESPONSE] (state, data) {
		let copy = Object.assign({}, state.things)

		/* Find thing in store */
		let i = 0
		for (i in copy) {
			if (copy[i].thingName == data.thingName) break
		}

		/* Merge with store */
		let merged = objectMerge(copy[i], data)
		copy[i] = merged

		state.things = copy
	},
	[t.THING_FIND_RESPONSE] (state, data) {
		/* Parse Elasticsearch query */
		let parsed = []
		data.hits.hits.forEach(hit => parsed.push(hit._source))

		/* Merge with store */
		let merged = objectMerge(state.things, parsed)
		state.things = merged
	},
	[t.THING_GET_MQTT] (state, {topic, message}) {
		const thingName = topic.split('/')[3]
		let copy = Object.assign({}, state.things)

		/* Find thing in store */
		let i = 0
		for (i in copy) {
			if (copy[i].thingName == thingName) break
		}

		/* Merge with store */
		let merged = objectMerge(copy[i].shadow.state, message.state)
		copy[i].shadow.state = merged

		state.things = copy
	}
}

const actions = {
	get ({commit}, thingName) {

		const payload = {
			action: 'GET',
			attributes: {
				batchId: null,
				createdAt: null,
				createdBy: null,
				description: null,
				domain: null,
				label: null,
				shadow: null,
				thingName,
				thingType: null
			}
		}
		return CC.invoke('ThingLambda', payload)
			.then(data => {
				commit(t.THING_GET_RESPONSE, data)
			})
	},

	find ({commit}, thingType) {
		const payload = {
			action: 'FIND',
			query: {
				size: 10,
				from: 0,
				sort: {
					'label.lowercase': 'asc'
				},
				filter: {
					bool: {
						must: [{
							term: {
								thingType
							}
						}]
					}
				}
			}
		}
		return CC.invoke('ThingLambda', payload)
			.then(data => {
				commit(t.THING_FIND_RESPONSE, data)
			})
	}
}

const getters = {
	/* Get a thing from the store */
	get: (state) => (thingName = null) => {
		if (state.things === null) return null
		if (thingName === null) return state.things

		let i = 0
		for (i in state.things) {
			if (state.things[i].thingName == thingName)
				return state.things[i]
		}
		return null
	},

	/* Find a property in the thing state */
	thing: (state, getters, rootState) => (...props) => {
		if (rootState.App.thingName === null) return null

		const thing = getters['get'](rootState.App.thingName)
		if (thing === null || typeof thing === 'undefined') return null

		/* Traverse object and find requested prop */
		let hit = false
		let tmp = thing
		for (const prop of [...props]) {
			if (tmp.hasOwnProperty(prop)) {
				tmp = tmp[prop]
				hit = true
			} else {
				hit = false
				break
			}
		}

		return hit ? tmp : null
	},

	/* Find a property in the shadow.reported state */
	reported: (state, getters, rootState) => (...props) => {
		return getters['thing']('shadow', 'state', 'reported', ...props)
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
