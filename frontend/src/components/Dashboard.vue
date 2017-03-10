<template lang="pug">
div(class="dashboard")
	thing-map(
		v-bind:lat="pos.lat"
		v-bind:lng="pos.lng"
	)
		
	div(id="side")
		pre {{ socketStatus }}, {{ pos }}
	
</template>

<script>
// outdoors-v9
// streets-v9
// light-v9
import ThingMap from './ThingMap'

export default {
	name: 'Dashboard',
	components: { ThingMap },
	data () {
		return {
			map: null,
			socketStatus: null,
			thing: null
		}
	},
	computed: {
		pos () {
			if (this.thing == null)
				return { lat: null, lng: null }
			
			const arr = this.thing.latlng.split(',')
			return { lat: arr[0], lng: arr[1] }
		}	
	},
	watch: {
		pos (new_pos) {
			//this.map.setCenter([new_pos.lng, new_pos.lat])
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
			if (data.state.hasOwnProperty('reported')) {
				this.thing = data.state.reported
			}
		}
	},
	mounted () {
		/*mapboxgl.accessToken = 'pk.eyJ1IjoicHdudHVzIiwiYSI6ImNqMDNydGUyZTAwYjIyd3BmMXhid2hmaDgifQ.SqJ9z6hXH0D0w1QxdPU2Hw'
		this.map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/outdoors-v9',
			zoom: 13
		})*/
	}
}
</script>

<style lang="scss" scoped>
.dashboard {
	height: 100%;
}
</style>
