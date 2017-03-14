<template lang="pug">
.widgets
	md-layout.widgets-container
		widget-summary
		widget-map
		widget-measurements
</template>

<script>
import WidgetSummary from '@/components/dashboard/widgets/Summary'
import WidgetMap from '@/components/dashboard/widgets/Map'
import WidgetMeasurements from '@/components/dashboard/widgets/Measurements'

export default {
	name: 'Panel',
	components: {
		WidgetSummary,
		WidgetMap,
		WidgetMeasurements
	}
}
</script>

<style lang="scss" scoped>

</style>
