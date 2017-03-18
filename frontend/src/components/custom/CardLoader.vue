<template lang="pug">
md-card.card-loader
	md-progress.md-warn(
		v-bind:md-indeterminate="loading"
		v-bind:md-progress="stateProgress"
	)
	.overlay(v-bind:class="{ visible: (loading && hidden) }")
	slot
</template>

<script>
export default {
	name: 'CardLoader',
	props: {
		loading: {
			type: Boolean,
			default: false
		},
		hidden: {
			type: Boolean,
			default: true
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
	
	.overlay {
		content: '';
		margin-top: 4px;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		position: absolute;
		background: rgba(255, 255, 255, 1);
		z-index: 100;
		visibility: hidden;
		opacity: 0;

		transition: visibility .5s, opacity .5s ease-in-out;
		-moz-transition: visibility .5s, opacity .5s ease-in-out;
		-webkit-transition: visibility .5s, opacity .5s ease-in-out;

		&.visible {
			visibility: visible;
			opacity: 1;
		}
	}
	
	.md-progress {
		opacity: 1;
		margin-top: 0px;
	}
}
</style>
