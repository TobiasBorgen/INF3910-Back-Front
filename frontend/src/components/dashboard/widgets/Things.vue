<template lang="pug">
md-layout(
	class="widget-things"
	md-flex="100"
)
	
	card-loader
		md-card-header
			md-card-header-text
				div(class="md-title") Stations
		md-card-content
			md-table
				md-table-header
					md-table-row
						md-table-head Station Name
						md-table-head Created
						md-table-head Domain
				md-table-body
					md-table-row(
						v-for="(row, rowIndex) in things()"
						v-bind:key="rowIndex"
						v-bind:md-item="row"
						md-auto-select
						md-selection
					)
						md-table-cell {{ row.thingName }}
						md-table-cell {{ row.createdAt }}
						md-table-cell {{ row.domainTopic + row.thingName }}
						md-table-cell
							md-icon cloud
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'WidgetThings',
	components: { CardLoader }
}
</script>

<style lang="scss" scoped>
.widget-things {
	
}
</style>
