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
			.middle
				.temp {{ reported('t') }}°C
				.speed {{ reported('s') }} m/s
				.direction {{ translateDegrees(reported('d')) }}
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'WidgetMeasurements',
	components: { CardLoader },
	methods: {
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
	}
}
</script>

<style lang="scss" scoped>
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
</style>
