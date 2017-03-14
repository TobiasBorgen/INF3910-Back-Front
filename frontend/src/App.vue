<template lang="pug">
#app
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
			/* Check if an account is persisted */
			.then(() => { return this.$store.dispatch('checkPersisted') })
			/* Fetch credentials. Token can be null */
			.then((token) => { return CC.getCredentials(token) })
			/* Signal CC initialization done */
			.then(() => { this.$store.commit(this.t.APP_SET_CC_INITED, true) })
			
			/* Token needs to be refreshed */
			.catch(error => {
				CC.refreshCredentials()
					/* Dispatch persistAccount to local storage and
					 * signal CC initialization done.
					 */
					.then(account => {
						console.log(account)
						this.$store.commit(`Auth/${this.t.AUTH_LOGIN_RESPONSE}`, account.user)
						this.$store.dispatch('persistAccount', account)
						this.$store.commit(this.t.APP_SET_CC_INITED, true)
					})
					.catch(error => {
						console.log(error)
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
