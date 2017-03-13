import Vue from 'vue'
import { mapGetters } from 'vuex'
import * as t from '@/store/mutation-types'

const eventBus = new Vue()

Vue.mixin({
	data () {
		return {
			eventBus,
			t,
			lambda: this.$store.state,
			config: {
				thingName: '00000371',
				rootDomain: 'UIT IFI course',
				subDomain: 'vind'
			}
		}
	},

	computed: {
		...mapGetters({
			things: 'Thing/get',
			thing: 'Thing/thing',
			reported: 'Thing/reported'
		})
	},

	methods: {
		showSnackbar (message = null) {
			this.eventBus.$emit('show-snackbar', message)
		}
	}

})
