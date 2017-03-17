import Vue from 'vue'
import Router from 'vue-router'

import Splash from '@/components/Splash'
import Front from '@/components/Front'
import Login from '@/components/Login'
import Dashboard from '@/components/dashboard/Dashboard'
import Panel from '@/components/dashboard/Panel'
import Stations from '@/components/dashboard/Stations'
import Settings from '@/components/dashboard/Settings'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{ path: '/', component: Splash },
		{ path: '/login', component: Login },
		{ path: '/dashboard', component: Dashboard,
			children: [
				{ path: '', component: Panel },
				{ path: 'update', component: Settings },
				{ path: 'stations', component: Stations },
				{ path: 'settings', component: Settings }
			] }
	]
})
