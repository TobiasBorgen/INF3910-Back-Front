<template lang="pug">
.widgets
	md-layout.widgets-container
		widget-summary
		widget-chart
		widget-measurements
		widget-map
</template>

<script>
import WidgetSummary from '@/components/dashboard/widgets/Summary'
import WidgetChart from '@/components/dashboard/widgets/Chart'
import WidgetMeasurements from '@/components/dashboard/widgets/Measurements'
import WidgetMap from '@/components/dashboard/widgets/Map'

export default {
	name: 'Panel',
	components: {
		WidgetSummary,
		WidgetChart,
		WidgetMeasurements,
		WidgetMap
	}
}
</script>

<style lang="scss" scoped>

</style>
