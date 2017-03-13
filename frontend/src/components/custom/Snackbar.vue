<template lang="pug">
md-snackbar(
	md-position="top center"
	ref="snackbar"
)
	span {{ message }}
</template>

<script>
export default {
	name: 'Snackbar',
	data () {
		return {
			message: null
		}
	},
	created () {
		this.eventBus.$on('show-snackbar', (message) => {
			this.message = message
			this.$refs.snackbar.open()
		})
	}
}
</script>

<style lang="scss" scoped>
</style>
