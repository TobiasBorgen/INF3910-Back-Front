<template lang="pug">
.widgets
  md-layout.widgets-container
    md-layout(md-flex="100")
      card-loader(:loading="!thingsInited")
        md-card-header
          md-card-header-text
            .md-title Update Stations
        md-card-content
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
          md-input-container
            label Desired
            md-input(
              type="number"
              v-model="desired"
            )
          md-button(class="md-primary" @click.native="update()") Update
          md-checkbox(id="cbWind" name="Wind" v-model="windChecked") Wind
          md-checkbox(id="cbDir" name="Dir" v-model="dirChecked") Direction
          md-checkbox(id="cbTemp" name="Temp" v-model="tempChecked") Temperature

    md-layout(
      v-for="(row, rowIndex) in things()"
      v-bind:key="rowIndex"
      md-flex-xsmall="100"
      md-flex-small="100"
      md-flex-medium="25"
      md-flex-large="25"
    )
      card-loader(:loading="!thingsInited")
        md-card-content
          md-list
            md-subheader {{ row.thingName }} reported
            md-list-item.green
              md-icon access_time
              span 30s
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'
import {MQTT} from '@/lib/MqttClient'

export default {
  name: 'Update',
  components: { CardLoader },
  data () {
    return {
      desired: 30,
      windChecked: false,
      dirChecked: false,
      tempChecked: false
    }
  },
  computed: {
		selected () {
			return this.$store.state['App'].thingName
    },
    getFormat() {
      if (this.windChecked == false && this.dirChecked == false && this.tempChecked == false)
        return null
      
      if(this.windChecked && this.dirChecked && this.tempChecked)
        return 0
      else if(this.windChecked && this.dirChecked)
        return 1
      else if(this.dirChecked && this.tempChecked)
        return 2
      else if(this.windChecked && this.tempChecked)
        return 3
      else if(this.tempChecked)
        return 4
      else if(this.windChecked)
        return 5
      else if(this.dirChecked)
        return 6
      
      return 'error'
    }

	},

  methods: {
		changeSelected (selected) {
			this.$store.commit(this.t.APP_SET_THING_NAME, selected)
      this.windChecked = this.getWindChecked()
      this.dirChecked = this.getDirChecked()
      this.tempChecked = this.getTempChecked()
		},
    update () {
      var thing = this.selected
      var message = JSON.stringify({
                      state: {
                      desired : {
                          u : this.desired,
                          f : this.getFormat
                      } }
                      })
      MQTT.publish(thing, message)
    },
    getWindChecked () {
      const format = this.reported('f')
      return (format <= 5 && (format != 2 && format != 4))
    },
    getDirChecked () {
      const format = this.reported('f')
      return (format <= 6 && (format != 3 && format != 4 && format != 5))
    },
    getTempChecked () {
      const format = this.reported('f')
      return (format <= 4 && format != 1)
    }
    
  }

}
</script>

<style lang="scss" scoped>
.green {
  color: green;
  .md-icon {
    color: green;
  }
}

.md-button {
  margin: 0;
  float: right;
}
</style>
