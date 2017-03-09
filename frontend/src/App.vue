<template lang="pug">
div(id="app")
	router-view
</template>

<script>
export default {
	name: 'app',
	mounted () {
		this.$material.setCurrentTheme('default')
	}
}
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

body {
	height: 100% !important;
	background: #f8f8f8 !important;
}

#app {
	height: 100%;
}
</style>
