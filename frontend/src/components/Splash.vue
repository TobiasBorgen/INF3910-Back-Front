<template lang="pug">
.splash
	md-button.md-primary(@click.native="$router.push('/login')") Login
	md-layout.widget-measurements(
		md-flex-xsmall="100"
		md-flex-small="100"
		md-flex-medium="50"
		md-flex-large="33"
	)
		card-loader
			md-card-header
				md-card-header-text
					.md-title Measurements
			md-card-content
				.middle
					.temp {{ stateReported('t') }}°C
					.speed {{ stateReported('s') }} m/s
					.direction {{ stateReported('d') }}°
</template>

<script>
//import '@/init/socket'
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'Splash',
	data () {
		return {
			socketStatus: null,
			socketData: null
		}
	},
	components: {
		CardLoader
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
			console.log(this.socketData)
		}
	},
	methods: {
		stateReported (property) {
			if (this.socketData !== null && this.socketData.state !== null && this.socketData.hasOwnProperty('state') && typeof this.socketData.state !== 'undefined')
				return this.socketData.state.reported[property]
			return null
		}
	},
	mounted () {

	}
}
</script>

<style lang="scss" scoped>
.splash {
	.widget-measurements {
		.md-card-content {
			height: 100%;
			text-align: center;
			font-weight: 300;

			&:before {
				content: '';
				display: inline-block;
				height: 100%;
				vertical-align: middle;
			}

			.middle {
				display: inline-block;
				vertical-align: middle;

				.temp {
					font-size: 2em;
				}

				.speed {
					font-size: 4em;
					line-height: 100px;
				}
				.direction {
					font-size: 2em;
				}
			}
		}
	}
}
</style>
