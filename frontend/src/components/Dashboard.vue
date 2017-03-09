<template lang="pug">
div(class="dashboard")
	div {{ socketStatus }}
	div(v-for="(reported, thing) in things")
		small {{ thing }}
		br
		br
		b  {{ JSON.stringify(reported) }}
</template>

<script>
export default {
	name: 'Dashboard',
	data () {
		return {
			socketStatus: null,
			things: {}
		}
	},
	sockets: {
		connect () {
			this.socketStatus = 'Connected to socket'

			this.$options.sockets.message = ({thing, data}) => {
				if (data.state.hasOwnProperty('reported'))
					this.things[thing] = data.state.reported
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.dashboard {

}
</style>
