<template lang="pug">
div(class="dashboard")
	div {{ socketStatus }}
	div
		b DATA:
	pre {{ socketData }}
	
</template>

<script>

export default {
	name: 'Dashboard',
	data () {
		return {
			socketStatus: null,
			socketData: null
		}
	},
	sockets: {
		connect () {
			this.socketStatus = 'Connected to socket'
		},
		connect_error (err) {
			this.socketStatus = 'Unable to connect: ' + err
		},
		message ({thing, data}) {
			this.socketData = data
		}
	},
	mounted () {
		
	}
}
</script>

<style lang="scss" scoped>
.dashboard {
	
}
</style>
