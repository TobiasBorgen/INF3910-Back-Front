<template lang="pug">
md-card.card-loader
	md-progress.md-warn(
		v-bind:md-indeterminate="loading"
		v-bind:md-progress="stateProgress"
	)
	.overlay(v-if="loading")
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

	.overlay {
		margin-top: 4px;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		position: absolute;
		background: rgba(255, 255, 255, .67);
		z-index: 100;
	}
}
</style>
