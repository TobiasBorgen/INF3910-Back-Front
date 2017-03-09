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
		},
		message ({thing, data}) {
			if (data.state.hasOwnProperty('reported'))
				this.things[thing] = data.state.reported
		},
		connect_error (a) {
			this.socketStatus = 'Unable to connect'
		}
	}
}
</script>

<style lang="scss" scoped>
.dashboard {

}
</style>
