<template lang="pug">
md-layout.widget-measurements(
	md-flex-xsmall="100"
	md-flex-small="100"
	md-flex-medium="50"
	md-flex-large="33"
)
	card-loader(:loading="!thingsInited")
		md-card-header
			md-card-header-text
				div.md-title Measurements
		md-card-content
			div Format: {{ reported('f') }}
			div Temp: {{ reported('t') }}°C
			div Speed: {{ reported('s') }} m/s
			div.direction {{ reported('d') }}°
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'WidgetMeasurements',
	components: { CardLoader }
}
</script>

<style lang="scss" scoped>
.widget-measurements {
	-md-card-content {
		.direction {
			display: block;
			background: red;
		}
	}
}
</style>
