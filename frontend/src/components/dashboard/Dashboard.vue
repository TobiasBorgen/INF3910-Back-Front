<template lang="pug">
.dashboard
	
	md-layout(md-hide-medium-and-up)
		md-whiteframe.top-toolbar(
			md-tag="md-toolbar"
			md-elavation="5"
		)
			md-button.md-icon-button(@click.native="$refs.sidenav.toggle()")
				md-icon menu
			h2.md-title(style="flex: 1") Vind
	
	md-layout(md-hide-medium-and-up)
		md-sidenav.md-left(ref="sidenav")
			md-list
				md-list-item
					router-link(
						to="/dashboard"
						exact
						@click.native="$refs.sidenav.toggle()"
					)
						md-icon dashboard
						p Dashboard
				md-list-item
					router-link(
						to="/dashboard/update"
						@click.native="$refs.sidenav.toggle()"
					)
						md-icon cloud_upload
						p Update
				md-list-item
					router-link(
						to="/dashboard/stations"
						@click.native="$refs.sidenav.toggle()"
					)
						md-icon toys
						p Stations
				md-list-item
					router-link(
						to="/dashboard/settings"
						@click.native="$refs.sidenav.toggle()"
					)
						md-icon settings
						p Settings

	md-layout.wrapper
		md-whiteframe.menu(
			md-tag="md-layout"
			md-elavation="5"
			md-hide-small
		)
			md-list
				md-list-item
					h2.md-headline Vind
				md-list-item
					router-link(
						to="/dashboard"
						exact
					)
						md-icon dashboard
						p Dashboard
				md-list-item
					router-link(to="/dashboard/update")
						md-icon cloud_upload
						p Update
				md-list-item
					router-link(to="/dashboard/stations")
						md-icon toys
						p Stations
				md-list-item
					router-link(to="/dashboard/settings")
						md-icon settings
						p Settings
		md-layout.main(md-flex-small="100")
			router-view
</template>

<script>
import {CONFIG} from '@/config'
import {MQTT} from '@/lib/MqttClient'

export default {
	name: 'Dashboard',
	data () {
		return {
		}
	},
	watch: {
		ccInited () {
			this.initDashboard()
		}
	},
	mounted () {
		this.initDashboard()
	},
	methods: {
		initDashboard () {
			if (!this.ccInited) return

			/* Init dashboard by fetching all stations
			 * under the same thing-type. MQTT will then
			 * subscribe to all found thing topics.
			 */
			this.$store.dispatch('Thing/find', CONFIG.THING_TYPE)
				.then(() => {

					const things = this.$store.getters['Thing/get']()

					/* Make first thing selected */
					this.$store.commit(this.t.APP_SET_THING_NAME, things[0].thingName)

					/* Load shadow from every thing */
					let jobs = 0
					things.forEach(thing => {
						this.$store.dispatch('Thing/get', thing.thingName)
							.then(() => {
								jobs++
								if (jobs >= things.length) {
									MQTT.init(this)
									this.$store.commit(this.t.APP_SET_THINGS_INITED, true)
								}
							})
					})
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.dashboard {
	height: 100%;

	@media (max-width: 944px) {

	}

	@media (max-width: 944px) {
		.md-hide-medium-and-up {
			display: block;
		}

		.menu {
			display: none;
		}
		.main {
			min-width: 100%;
			margin-left: 0 !important;
			padding-top: 64px !important;
			flex: 0 1 100%;
		}
	}

	.top-toolbar {
		top: 0;
		right: 0;
		left: 0;
		position: fixed;
		z-index: 100;
	}
	
	.md-sidenav-content {
		position: fixed;
	}

	.wrapper {
		min-height: 100%;

		.menu {
			position: fixed;
			top: 0;
			bottom: 0;
			z-index: 100;
			flex: 0;

			.md-list {
				width: 304px;	
			}
		}

		.main {
			margin-left: 304px;
		}
	}

}
</style>
