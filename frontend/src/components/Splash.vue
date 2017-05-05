<template lang="pug">
.splash
	md-button.md-primary(@click.native="$router.push('/login')") Login

	md-layout.recent
		md-layout(
			v-for="(thing, index) in buffer" 
			v-bind:key="thing"
			md-flex-xsmall="100"
			md-flex-small="100"
			md-flex-medium="50"
			md-flex-large="33"
		)
			card-loader
				md-card-content
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
								md-table-cell {{ translateDegrees(measurement.state.reported['d']) }}
								md-table-cell {{ measurement.state.reported['t'] }} °C
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'
const MAX_BUFFER = 10

export default {
	name: 'Splash',
	components: { CardLoader },
	data () {
		return {
			buffer: {}
		}
	},
	methods: {
		bufferNew (data) {
			this.buffer = {}
			
			/* Create a new buffer and fill it */
			for (let thingName in data) {
				this.buffer[thingName] = data[thingName]
			}
		},
		bufferAdd (topic, data) {
			console.log(this.buffer)
			/* New thing, add it to the buffer and return */
			if (!this.buffer.hasOwnProperty(topic)) {
				this.buffer[topic] = data
				return
			}

			/* Prepend new data to buffer */
			this.buffer[topic].unshift(data)

			/* Remove last data if buffer overflow */
			if (this.buffer[topic].length > MAX_BUFFER)
				this.buffer[topic].splice(-1, 1)

			/* Make copy for ractivity (Vue doesn't see the changes) */
			const copy = Object.assign({}, this.buffer)
			this.buffer = copy
		},
		translateDegrees(degrees) {
			if(degrees <= 0)
				return 'North'
			else if(degrees <= 45)
				return 'North East'
			else if(degrees <= 90)
				return 'East'
			else if(degrees <= 135)
				return 'South East'
			else if(degrees <= 180)
				return 'South'
			else if(degrees <= 225)
				return 'South West'
			else if(degrees <= 270)
				return 'West'
			else if(degrees <= 315)
				return 'North West'
			else if(degrees <= 360)
				return 'North'
			else
				return ' '
		}
	},
	sockets: {
		connect () {
			this.$socket.emit('init')
		},
		init (data) {
			this.bufferNew(data)
		},
		message ({topicName, data}) {
			//console.log(topicName, data)
			this.bufferAdd(topicName, data)
		}
	}
}
</script>

<style lang="scss" scoped>
.splash {
	.recent {
		padding-left: 10px;
	}

	.md-card {
		margin-right: 10px;
		margin-bottom: 10px;

		.md-table {
			margin: 0 -16px -16px;
		}
	}
}
</style>
