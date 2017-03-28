<template lang="pug">
.splash
	md-button.md-primary(@click.native="$router.push('/login')") Login
	md-layout.widget-measurements(
		md-flex-xsmall="100"
		md-flex-small="100"
		md-flex-medium="50"
		md-flex-large="33"
	)
	//	card-loader
			md-card-header
				md-card-header-text
					.md-title Measurements
			md-card-content
				.middle
					.temp {{ stateReported('t') }}°C
					.speed {{ stateReported('s') }} m/s
					.direction {{ stateReported('d') }}°
	//ul(id = "Splash" v-for="item in socketData")
		li(v-for="subItem in item" value="subItem.state.reported.d") 
		|{{ subItem.state.reported['t'] }}°C {{ subItem.state.reported['s'] }}m/s {{ subItem.state.reported['d'] }}°

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
			console.log('Connected to socket')
			this.socketStatus = 'Connected to socket'
		},
		connect_error (err) {
			this.socketStatus = 'Unable to connect: ' + err
		},
		message (data) {
			this.socketData = data
			for(var thing in data){
				console.log('\n\n\n --- Weather station: ', thing)
				for(var measurement in data[thing]){
					console.log('\n Measured at ', data[thing][measurement].time)
					console.log('Temp: ', data[thing][measurement].t)
					console.log('Speed: ', data[thing][measurement].s)
					console.log('Dir: ', data[thing][measurement].d)
					
				}
			}
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
