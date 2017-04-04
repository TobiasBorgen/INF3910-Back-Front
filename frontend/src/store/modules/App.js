import Vue from 'vue'
import * as t from '@/store/mutation-types'

const state = {
	ccInited: false,
	thingsInited: false,
	thingName: null
}

const mutations = {
	[t.APP_SET_CC_INITED] (state, value) {
		state.ccInited = value
	},
	[t.APP_SET_THINGS_INITED] (state, value) {
		state.thingsInited = value
	},
	[t.APP_SET_THING_NAME] (state, thingName) {
		state.thingName = thingName
	}
}

const actions = {
	persistAccount ({commit}, account) {
		window.localStorage.setItem('account', JSON.stringify(account))
	},
	checkPersisted ({commit}) {
		const account = window.localStorage.getItem('account')
		let token = null

		if (account !== null) {
			const parsed = JSON.parse(account)
			token = parsed.credentials.token

			/* Set user data in store */
			commit(`Auth/${t.AUTH_LOGIN_RESPONSE}`, parsed.user)
		}

		return Promise.resolve(token)
	}
}

export default {
	state,
	mutations,
	actions
}
