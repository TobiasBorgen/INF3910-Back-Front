<template lang="pug">
md-card(class="card-loader")
	md-progress(
		v-bind:md-indeterminate="loading"
		v-bind:md-progress="stateProgress"
	)
	slot
</template>

<script>
export default {
	name: 'CardLoader',
	props: {
		loading: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		stateProgress () {
			return this.loading ? 0 : 100
		}
	}
}
</script>

<style lang="scss" scoped>
.card-loader {
	width: 100%;
	
	.md-progress {
		margin-top: 0px;
	}
}
</style>
