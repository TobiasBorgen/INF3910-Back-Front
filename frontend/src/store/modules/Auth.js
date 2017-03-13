import Vue from 'vue'
import * as t from '@/store/mutation-types'
import {CC} from '@/lib/CloudConnect'

const state = {
	domainName: null,
	domainPath: null,
	email: null,
	firstName: null,
	lastName: null,
	roleName: null,
	userName: null,
}

const mutations = {
	[t.AUTH_LOGIN_RESPONSE] (state, account) {
		state.domainName = account.domainName
		state.domainPath = account.domainPath
		state.email = account.email
		state.firstName = account.firstName
		state.lastName = account.lastName
		state.roleName = account.roleName
		state.userName = account.userName
	}
}

const actions = {
	login ({commit}, {username, password}) {
		return CC.login(username, password)
			.then((account) => {
				commit(t.AUTH_LOGIN_RESPONSE, account)
				return Promise.resolve()
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
