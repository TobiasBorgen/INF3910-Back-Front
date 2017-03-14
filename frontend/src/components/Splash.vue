<template lang="pug">
.splash
	md-button.md-primary(@click.native="$router.push('/login')") Login
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
