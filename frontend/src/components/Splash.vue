<template lang="pug">
div(class="splash")
	md-button(
		class="md-primary"
		@click.native="$router.push('/login')"
	) Login
</template>

<script>
export default {
	name: 'Splash'
}
</script>

<style lang="scss" scoped>
.splash {
	
}
</style>
