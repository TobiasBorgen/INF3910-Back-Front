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
				thing-chart(
					type="line"
					label="Wind Speed"
					v-bind:labels="labels"
					v-bind:data="data_s"
				)
			md-tab#direction(md-label="Wind Direction")
				thing-chart(
					type="line"
					label="Wind Direction"
					v-bind:labels="labels"
					v-bind:data="data_d"
				)
			md-tab#temperature(md-label="Temperature")
				thing-chart(
					type="line"
					label="Temperature"
					v-bind:labels="labels"
					v-bind:data="data_t"
				)
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'
import ThingChart from '@/components/custom/ThingChart'

export default {
	name: 'WidgetCHart',
	components: { CardLoader, ThingChart },
	data () {
		return {
			gte: (Date.now() - 2 * 60 * 60 * 1000),
			lte: Date.now()
		}	
	},
	computed: {
		labels () {
			return this.$store.state['Observation'].time || []
		},
		data_s () {
			return this.$store.state['Observation'].s || []
		},
		data_d () {
			return this.$store.state['Observation'].d || []
		},
		data_t () {
			return this.$store.state['Observation'].t || []
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
		}
	},
	mounted () {
		this.fetchData()
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
