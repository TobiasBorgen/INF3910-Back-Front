<template lang="pug">
.splash
	md-button.md-primary(@click.native="$router.push('/login')") Login
	md-layout.widget-measurements(
		md-flex-xsmall="100"
		md-flex-small="100"
		md-flex-medium="50"
		md-flex-large="33"
	)
	br
	md-card-header
		md-card-header-text(class="headertext") Recent Measurements
	br
	br
	br
	md-card-content(
		v-for="(thing, index) in socketData" 
		v-bind:key="thing") 
		.md-title Measurements for station {{index}}
		md-table
			md-table-header
				md-table-row
					md-table-head Time
					md-table-head Speed
					md-table-head Direction
					md-table-head Temperature
			md-table-body
				md-table-row(
					v-for="measurement in thing"
					v-bind:key="measurement"
				)
					md-table-cell {{ measurement.time }}
					md-table-cell {{ measurement.s }} m/s
					md-table-cell {{ measurement.d }} °C
					md-table-cell {{ measurement.t }} °

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
	.thingname {
		font-size: 1.5em;
	}
	.headertext{
		font-size: 2em;
	}

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
