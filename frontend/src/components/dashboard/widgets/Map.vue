<template lang="pug">
md-layout.widget-map(
	md-flex-xsmall="100"
	md-flex-small="100"
	md-flex-medium="50"
	md-flex-large="100"
)
	
	card-loader(:loading="!thingsInited")
		md-card-header
			.md-title Base Station
			.md-subhead
				md-icon location_on
				span {{ latlng[0] }}, {{ latlng[1] }} - {{ place }}
		md-card-content
			thing-map(
				pack="light-v9"
				v-bind:lat="latlng[0]"
				v-bind:lng="latlng[1]"
			)
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'
import ThingMap from '@/components/custom/ThingMap'

export default {
	name: 'WidgetMap',
	components: {
		CardLoader,
		ThingMap
	},
	data () {
		return {
			place: 'Unknown'
		}
	},
	computed: {
		latlng () {
			const latlng = this.reported('latlng')
			if (latlng === null) return ['0', '0']
			return latlng.split(',')
		}
	},
	watch: {
		latlng (loc) {
			this.$http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${loc[1]},${loc[0]}.json?access_token=pk.eyJ1IjoicHdudHVzIiwiYSI6ImNqMDNydGUyZTAwYjIyd3BmMXhid2hmaDgifQ.SqJ9z6hXH0D0w1QxdPU2Hw`)
				.then(response => {
					const features = response.body.features
					if (features.length < 1) {
						this.place = 'The North Pole'
						return
					}
					this.place = features[0].place_name
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.widget-map {
	height: 500px;

	.md-card-header {
		.md-icon {
			width: 16px;
			min-width: 16px;
			height: 16px;
			min-height: 16px;
			font-size: 16px;
			line-height: 16px
		}

		span {
			vertical-align: middle;
		}
	}

	.md-card-content {
		height: 100%;
		padding: 0 1px 1px !important;
	}
}
</style>
