import Vue from 'vue'
import * as t from '@/store/mutation-types'
import {CC} from '@/lib/CloudConnect'

const state = {
	time: null,
	s: null,
	d: null,
	t: null
}

const mutations = {
	[t.OBSERVATION_FIND_RESPONSE] (state, data) {
		state.time = []
		state.s = []
		state.d = []
		state.t = []
		
		const buckets = data.aggregations.hist.buckets
		buckets.forEach(bucket => {
			let date = new Date(bucket.key)
			let time = `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
			state.time.push(time)

			const s = bucket.s.value ? bucket.s.value.toString().slice(0, 5) : null
			const d = bucket.d.value ? bucket.d.value.toString().slice(0, 5) : null
			const t = bucket.t.value ? bucket.t.value.toString().slice(0, 5) : null
			state.s.push(s)
			state.d.push(d)
			state.t.push(t)
		})
	}
}

const actions = {
	find ({commit}, {gte, lte, thingName}) {
		const n_aggs = 40
		const diff = parseInt((lte - gte).toString().slice(0, -3))
		const fraction = diff / n_aggs
		const interval = (fraction / n_aggs).toString() + 'm'

		console.log(interval)

		const query = {
			action: 'FIND',
			query: {
				size: 1,
				trackScores: false,
				query: { bool: { must: [{ range: {
					timestamp: {
						gte,
						lte
					} } },
					{ terms: {
						thingName: [ thingName ]
					} }
				] } },
				aggs: {
					hist: {
						date_histogram: {
							field: 'timestamp',
							interval,
							time_zone: '+01:00',
							min_doc_count: 1,
							extended_bounds: {
								min: gte,
								max: lte
							}
						},
						aggs: {
							s: { avg: {
									field: 'state.s'
							} },
							d: { avg: {
									field: 'state.d'
							} },
							t: { avg: {
									field: 'state.t'
							} }
						}
					}
				}
			}
		}
		return CC.invoke('ObservationLambda', query)
			.then(data => {
				commit(t.OBSERVATION_FIND_RESPONSE, data)
			})
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
