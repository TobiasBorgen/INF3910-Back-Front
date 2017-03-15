<template lang="pug">
.widgets
	md-layout.widgets-container
		widget-summary
		widget-graphs
		widget-measurements
		widget-map
</template>

<script>
import WidgetSummary from '@/components/dashboard/widgets/Summary'
import WidgetMap from '@/components/dashboard/widgets/Map'
import WidgetMeasurements from '@/components/dashboard/widgets/Measurements'
import WidgetGraphs from '@/components/dashboard/widgets/Graphs'

export default {
	name: 'Panel',
	components: {
		WidgetSummary,
		WidgetMap,
		WidgetMeasurements,
		WidgetGraphs
	}
}
</script>

<style lang="scss" scoped>

</style>
