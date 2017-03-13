<template lang="pug">
div(class="thing-map")
	div(id="thing-map")
</template>

<script>
import L from 'leaflet'

/* Leaflet marker issue workaround.
 * https://github.com/Leaflet/Leaflet/issues/4968
 */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('@/../node_modules/leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('@/../node_modules/leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('@/../node_modules/leaflet/dist/images/marker-shadow.png')
})

export default {
	name: 'ThingMap',
	props: {
		pack: {
			type: String,
			default: 'dark-v9'
		},
		zoom: {
			type: Number,
			default: 13
		},
		lat: {
			type: String,
			default: '69.6816'
		},
		lng: {
			type: String,
			default: '18.9771'
		}
	},
	data () {
		return {
			map: null,
			layer: null,
			marker: null
		}
	},
	computed: {
		getCenter () {
			return new L.LatLng(this.lat, this.lng)
		},
		getLayerUrl () {
			return `https://api.mapbox.com/styles/v1/mapbox/${this.pack}/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHdudHVzIiwiYSI6ImNqMDNydGUyZTAwYjIyd3BmMXhid2hmaDgifQ.SqJ9z6hXH0D0w1QxdPU2Hw`
		}
	},
	methods: {
		update () {
			this.map.setView(this.getCenter, this.zoom, {
				pan: {
					animate: true,
					duration: 2.5
				},
				zoom: {
					animate: true
				}
			})
			this.marker.setLatLng(this.getCenter)
		}	
	},
	watch: {
		pack () {
			this.layer.setUrl(this.getLayerUrl)
		},
		zoom () {
			this.map.setView(this.getCenter, this.zoom)
		},
		lat () { this.update() },
		lng () { this.update() },
	},
	mounted () {
		this.layer = new L.TileLayer(this.getLayerUrl)
		this.map = L.map('thing-map', {
			center: this.getCenter,
			zoom: this.zoom,
			scrollWheelZoom: false,
			layers: this.layer,
			attributionControl: false
		})
		this.marker = new L.Marker(this.getCenter).addTo(this.map)
	}
}
</script>

<style lang="scss">
.thing-map, #thing-map {
	width: 100%;
	height: 100%;
	
	a {
		&:hover {
			text-decoration: none;
		}
		color: #2196F3;
	}
}
</style>
