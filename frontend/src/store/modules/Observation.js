import Vue from 'vue'
import * as t from '@/store/mutation-types'
import {CC} from '@/lib/CloudConnect'

const state = {
	s: null,
	d: null,
	t: null
}

const mutations = {
	[t.OBSERVATION_FIND_RESPONSE] (state, data) {
		state.s = {}
		state.d = {}
		state.t = {}
		
		const buckets = data.aggregations.hist.buckets
		buckets.forEach(bucket => {
			state.s[bucket.key] = bucket.s.value
			state.d[bucket.key] = bucket.d.value
			state.t[bucket.key] = bucket.t.value
		})
	}
}

const actions = {
	find ({commit}, {gte, lte, thingName}) {
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
							interval: '5m',
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
