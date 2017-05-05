<template lang="pug">
md-layout.widget-things(md-flex="100")
	
	card-loader(:loading="!thingsInited")
		md-table-card
			md-toolbar
				h1.md-title Stations
				md-button.md-icon-button#add(
					@click.native="$refs.dialog.open"
				)
					md-icon add
			md-table-alternate-header(md-selected-label="selected")
				md-button.md-icon-button(
					@click.native="removeThing"
				)
					md-icon delete
			md-table(@select="onSelect")
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
						md-table-cell {{ translateThingName(row.thingName) }}
						md-table-cell {{ row.createdAt }}
						md-table-cell {{ row.domainTopic + row.thingName }}
	md-dialog-prompt(
		md-title="Add Station"
		md-ok-text="Add"
		md-cancel-text="Cancel"
		md-input-placeholder="Station Name"
		v-model="thingName"
		@close="addThing"
		ref="dialog"
	)
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'WidgetThings',
	components: { CardLoader },
	data () {
		return {
			thingName: '',
			selectedData: []
		}
	},
	methods: {
		onSelect (data) {
			this.selectedData = data
			this.$forceUpdate()
		},
		addThing (type) {
			if (type !== 'ok') return
			if (this.thingName === '') return

			this.$store.dispatch('ThingBatch/create')
				.then(() => {
					this.showSnackbar('Processing new station, refresh in a while')
				})
				.catch(error => {
					this.showSnackbar(`CC: ${error}`)
				})
		},
		removeThing () {
			for (let i in this.selectedData) {
				const selected = this.selectedData[i]

				this.$store.dispatch('Thing/remove', selected.thingName)
					.catch(error => {
						this.showSnackbar(`CC: ${error}`)
					})

				this.$store.commit(this.t.APP_SET_THING_NAME, null)
			}
		},
		translateThingName (thing) {
			for (var key in this.$store.state['App'].stations){
				if(key == thing) 
				return this.$store.state['App'].stations[key]
			}
			return thing
    	}
	}
}
</script>

<style lang="scss" scoped>
.widget-things {
	#add {
		float: right;
	}
}
</style>
