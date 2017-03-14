<template lang="pug">
div(id="app")
	router-view
	snackbar
</template>

<script>
import Snackbar from '@/components/custom/Snackbar'
import {CC} from '@/lib/CloudConnect'

export default {
	name: 'app',
	components: { Snackbar },
	mounted () {
		this.$material.setCurrentTheme('default')

		/* Init by fetching manifest */
		CC.init()
			.then(() => {
				/* Check if an account is persisted */
				return this.$store.dispatch('checkPersisted')
			})
			.then((token) => {
				/* Fetch credentials. Token can be null */
				return CC.getCredentials(token)
			})
			.then(() => {
				/* Signal CC initialization done */
				this.$store.commit(this.t.APP_SET_CC_INITED, true)
			})
			.catch(error => {
				if (!CC.isAuthError(error)) {
					this.showError(error)
					return
				}
				
				/* Fetch refreshToken from local storage */
				const account = window.localStorage.getItem('account')
				const refreshToken = JSON.parse(account).credentials.refreshToken
				CC.refreshCredentials(refreshToken)
					.then(() => {
						/* Signal CC initialization done */
						this.$store.commit(this.t.APP_SET_CC_INITED, true)
					})
					.catch(() => {
						this.showSnackbar('Failed to authenticate')
						// TODO:
						// Destroy cached credentials > redirect to front
					})
			})
	}
}
</script>

<style lang="scss">
#app {
	height: 100%;
}
</style>
