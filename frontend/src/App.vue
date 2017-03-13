<template lang="pug">
div(id="app")
	router-view
	snackbar
</template>

<script>
import Snackbar from '@/components/custom/Snackbar'

export default {
	name: 'app',
	components: { Snackbar },
	mounted () {
		this.$material.setCurrentTheme('default')
	}
}
</script>

<style lang="scss">
#app {
	height: 100%;
}
</style>
