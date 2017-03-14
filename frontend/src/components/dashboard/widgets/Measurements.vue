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
				.md-title Measurements
		md-card-content
			.temp {{ reported('t') }}°C
			.speed {{ reported('s') }} m/s
			.direction {{ reported('d') }}°
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
	.md-card-content {
		padding-top: 100px;
		text-align: center;
		font-weight: 300;
		
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
</style>
