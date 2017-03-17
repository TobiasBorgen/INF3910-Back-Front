<template lang="pug">
md-layout.widget-log(
	md-flex-xsmall="100"
	md-flex-small="100"
	md-flex-medium="50"
	md-flex-large="33"
)
	card-loader(:loading="!thingsInited")
		md-card-header
			md-card-header-text
				.md-title Continous Log
		md-card-content
			md-table
				md-table-header
					md-table-row
						md-table-head Time
						md-table-head Speed
				md-table-body
					md-table-row(
						v-for="(row, index) in logs"
						v-bind:key="index"
					)
						md-table-cell {{ row.time }}
						md-table-cell {{ row.data }} m/s
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'WidgetLog',
	components: { CardLoader },
	data () {
		return {
			logs: new Array()
		}
	},
	computed: {
		currentThing () {
			return this.things()
		}
	},
	watch: {
		'$store.state.App.thingName' () {
			this.logs = []	
		},
		currentThing (newThing) {
			const now = new Date()
			const speed = this.reported('s')
			if (!speed) return
				
			this.logs.unshift({
				time: `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}`,
				data: this.reported('s')
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.widget-log {
	max-height: 350px;
}
</style>
