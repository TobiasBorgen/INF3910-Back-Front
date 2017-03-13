import Vue from 'vue'
import { mapGetters } from 'vuex'
import * as t from '@/store/mutation-types'

const eventBus = new Vue()

Vue.mixin({
	data () {
		return {
			eventBus,
			t
		}
	},

	computed: {
		...mapGetters({
			things: 'Thing/get',
			thing: 'Thing/thing',
			reported: 'Thing/reported'
		}),
		ccInited () {
			return this.$store.state['App'].ccInited
		},
		thingsInited () {
			return this.$store.state['App'].thingsInited
		}
	},

	methods: {
		showSnackbar (message = null) {
			this.eventBus.$emit('show-snackbar', message)
		}
	}

})
