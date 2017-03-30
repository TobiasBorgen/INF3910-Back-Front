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
		.md-title {{index}}
		md-table
			md-table-header
				md-table-row
					md-table-head Time
					md-table-head Average Speed
					//md-table-head Speedmin
					//md-table-head Speedmax
					md-table-head Direction
					md-table-head Temperature
			md-table-body
				md-table-row(
					v-for="measurement in thing"
					v-bind:key="measurement"
				)
					md-table-cell {{ measurement.time }}
					md-table-cell {{ measurement.state.reported['s']}} m/s
					//md-table-cell 0
					//md-table-cell 0
					md-table-cell {{ measurement.state.reported['d'] }} °
					md-table-cell {{ measurement.state.reported['t'] }} °C
		br
		br

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
		message ({thing, data}) {
			this.socketData = data
			for(var i in data){
				console.log('\n\n\n --- Weather station: ', i)
				for(var j in data[i]){
					var tmp = data[i][j]
					console.log('\n Measured at ', tmp.time)
					console.log('Temp: ', tmp.state.reported['t'])
					console.log('Speed: ', tmp.state.reported['s'])
					console.log('Dir: ', tmp.state.reported['d'])
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
