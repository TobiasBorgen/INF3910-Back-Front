<template lang="pug">
md-layout.widget-things(
	md-flex-xsmall="100"
	md-flex-small="100"
	md-flex-medium="100"
	md-flex-large="66"
)
	
	card-loader(:loading="!thingsInited")
		md-tabs(md-fixed)
			md-tab#speed(md-label="Wind Speed")
				vue-chart(
					chart-type="LineChart"
					v-bind:packages="['line']"
					v-bind:columns="charts.speed.columns"
					v-bind:rows="charts.speed.rows"
					v-bind:options="charts.speed.options"
				)
			md-tab#direction(md-label="Wind Direction")
				.graph#direction-graph
			md-tab#temperature(md-label="Temperature")
				.graph#temperature-graph
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'WidgetGraphs',
	components: { CardLoader },
	data () {
		return {
			gte: (Date.now() - 30 * 60 * 1000),
			lte: Date.now(),
			charts: {
				speed: {
					columns: [{
						type: 'string',
						label: 'Time'
					},{
						type: 'number',
						label: 'm/s'
					}],
					rows: [[20, 30],[30,50],[40, 10],[50,100]],
					options: {
						legend: { position: 'bottom' },
						curveType: 'function'
					}
				}
			}
		}	
	},
	watch: {
		thingsInited () {
			this.fetchData()
		},
		'$store.state.App.thingName' () {
			this.fetchData()
		}
	},
	methods: {
		fetchData () {
			if (!this.thingsInited) return
				
			this.$store.dispatch('Observation/find', {
				gte: this.gte,
				lte: this.lte,
				thingName: this.$store.state['App'].thingName
			})
		},
		resizeGraph () {
			
		}
	},
	mounted () {
		this.fetchData()
	},
	beforeRouteEnter (to, from, next) {
		window.addEventListener('resize', this.resizeGraph)
		next()
	},
	beforeRouteLeave (to, from, next) {
		window.removeEventListener('resize', this.resizeGraph)
		next()
	}
}
</script>

<style lang="scss" scoped>
.widget-things {
	.md-card {
		min-height: 300px;
	}
}
</style>
