<template lang="pug">
md-layout(
	class="widget-summary"
	md-flex="100"
)
	
	card-loader(:loading="!thingsInited")
		md-card-content(class="select")
			md-input-container
				label(for="things") Select Station
				md-select(
					name="things"
					v-model="selected"
					@change="changeSelected"
				)
					md-option(
						v-for="(row, rowIndex) in things()"
						v-bind:key="rowIndex"
						v-bind:value="row.thingName"
					) {{ row.thingName }}

		md-card-header
			md-card-header-text
				div(class="md-title") Summary
				div(class="md-subhead")
					div
						span {{ reported('tcxn', 'cellular', 'network_type') }}:
						md-icon(
							v-bind:class="{ 'green': 1 > 0 }"
						) {{ cloud }}
						| {{ reported('tcxn', 'cellular', 'rssi') }}%
						| &nbsp;(lsnr: {{ reported('lsnr') }})
					div
						span Thing name:
						| {{ thing('thingName') }}
					div
						span Date created:
						| {{ thing('createdAt') }}
					div
						span Last heard from:
						| {{ thing('shadow', 'timestamp') }}

			md-card-media(md-medium)
				md-image(md-src="https://vuematerial.github.io/assets/card-weather.png")

		
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'WidgetSummary',
	components: { CardLoader },
	data () {
		return {
			selected: this.$store.state['App'].thingName
		}
	},
	computed: {
		cloud () {
			return 'cloud'//(this.rssi > 0) ? 'cloud' : 'cloud_off'
		}
	},
	methods: {
		changeSelected (selected) {
			this.$store.commit(this.t.APP_SET_THING_NAME, selected)
		}
	}
}
</script>

<style lang="scss" scoped>
.widget-summary {
	.select {
		max-width: 250px;
		padding-bottom: 0;

		.md-input-container {
			margin-bottom: 10px;
		}
	}

	.md-card-header-text {
		.md-subhead {

			span {
				width: 120px;
				display: inline-block;
			}
		}
	}

	.md-icon {
		margin-right: 10px;
		width: 20px;
		min-width: 20px;
		height: 20px;
		min-height: 20px;
		font-size: 20px;
		line-height: 20px;

		&.green {
			color: green;
		}
	}
}
</style>
