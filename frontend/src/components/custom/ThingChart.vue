<template lang="pug">
canvas.chartjs(
	v-bind:width="width"
	v-bind:height="height"
)
</template>

<script>
import Chart from 'chart.js'

const types = ['line', 'bar', 'radar', 'polarArea', 'pie', 'doughnut']

export default {
	name: 'ThingChart',
	props: {
		width: Number,
		height: Number,
		type: {
			type: String,
			required: true,
			validator: val => types.includes(val)
		},
		data: {
			type: Array,
			required: true,
			default: () => ([])
		},
		labels: {
			type: Array,
			required: true,
			default: () => ([])
		},
		options: {
			type: Object,
			default: () => ({
				legend: {
					display: false
				}
			})
		},
		label: {
			type: String,
			default: 'Undefined'
		}
	},
	data () {
		return {
			chart: null
		}
	},
	computed: {
		chartData () {
			return {
				labels: this.labels,
				datasets: [{
					label: this.label,
					data: this.data,
					borderColor: 'rgba(92,107,192,.8)',
					pointRadius: 0,
					pointHoverRadius: 4,
					pointHitRadius: 15,
					pointBackgroundColor: 'rgba(92,107,192,.8)',
					fill: true,
					backgroundColor: 'rgba(92,107,192,.2)'
				}]
			}
		}
	},
	watch: {
		type () {
			this.resetChart()
		},
		data () {
			this.resetChart()
			this.chart.update()
		},
		options () {
			this.resetChart()
		}
	},
	methods: {
		resetChart () {
			this.$nextTick(() => {
				this.chart.destroy()
				this.chart = new Chart(this.$el, {
					type: this.type,
					data: this.chartData,
					options: this.options
				})
			})
		}
	},
	mounted () {
        this.chart = new Chart(this.$el, {
			type: this.type,
			data: this.chartData,
			options: this.options
		})
	},
	beforeDestroy () {
		this.chart.destroy()
	}
}
</script>

<style lang="scss" scoped>
.chartjs {
	max-width: 100%;
}
</style>
