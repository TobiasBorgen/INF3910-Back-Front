import Vue from 'vue'
import * as t from '@/store/mutation-types'
import {CC} from '@/lib/CloudConnect'

const state = {
	account: null
}

const mutations = {
	[t.AUTH_LOGIN_RESPONSE] (state, account) {
		state.account = account
	}
}

const actions = {
	login ({commit, dispatch}, {username, password}) {
		return CC.login(username, password)
			.then(account => {
				commit(t.AUTH_LOGIN_RESPONSE, account.user)
				/* Dispatch persistAccount to local storage */
				dispatch('persistAccount', account, {root: true})
				
				return Promise.resolve()
			})
	}
}

const getters = {
	account: (state) => {
		return state.account
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
