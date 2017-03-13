<template lang="pug">
md-layout(
	class="widget-measurements"
	md-flex-xsmall="100"
	md-flex-small="100"
	md-flex-medium="50"
	md-flex-large="33"
)
	
	card-loader
		md-card-header
			md-card-header-text
				div(class="md-title") Measurements
		md-card-content
			div Format: {{ reported('f') }}
			div Temp: {{ reported('t') }}°C
			div Speed: {{ reported('s') }} m/s
			div Direction: {{ reported('d') }}°
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'WidgetMeasurements',
	components: { CardLoader }
}
</script>

<style lang="scss" scoped>
.widget-things {
	
}
</style>
