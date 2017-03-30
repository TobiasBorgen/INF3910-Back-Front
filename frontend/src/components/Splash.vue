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
		v-for="(thing, index) in buffer" 
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
			buffer: {}
		}
	},
	components: {
		CardLoader
	},
	sockets: {
		connect () {
			this.initSocket()
		},
		init (data) {
			this.buffer = {}
			
			console.log('init', data)
			
			for (let thingName in data) {
				this.buffer[thingName] = data[thingName]
			}
		},
		message ({topic, data}) {
			this.buffer[topic] = data
		}
	},
	methods: {
		initSocket () {
			console.log('sent init')
			this.$socket.emit('init', {foo:'bar'})
		}
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
