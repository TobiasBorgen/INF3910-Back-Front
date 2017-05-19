<template lang="pug">
.widgets
  md-layout.widgets-container
    md-layout(md-flex="100")
      card-loader(:loading="!thingsInited")
        md-card-header
          md-card-header-text
            .md-title Update Station
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
              ) {{ translateThingName(row.thingName) }}
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
        md-card-header
          md-card-header-text
            .md-title Rename Station
        md-card-content
          md-input-container
              label {{translateThingName(this.selected)}}
                md-input(v-model="renameInput")
          md-button(class="md-primary" @click.native="rename()") Rename
    
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
            md-subheader {{ translateThingName(row.thingName) }} reported
            md-list-item.green
              md-icon access_time
              span {{get_updated(row)}}
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'
import {MQTT} from '@/lib/MqttClient'

export default {
  name: 'Update',
  components: { CardLoader },
  data () {
    return {
      desired: 0,
      windChecked: true,
      dirChecked: true,
      tempChecked: true,
      renameInput: null,
      reporteds: []

    }
  },
  computed: {
		selected () {
			return this.$store.state['App'].thingName
    },
    getFormat() {
      if (this.windChecked == false && this.dirChecked == false && this.tempChecked == false)
        return 0
      
      if(this.windChecked && this.dirChecked && this.tempChecked)
        return 7
      else if(this.windChecked && this.dirChecked)
        return 3
      else if(this.dirChecked && this.tempChecked)
        return 5
      else if(this.windChecked && this.tempChecked)
        return 6
      else if(this.tempChecked)
        return 4
      else if(this.windChecked)
        return 2
      else if(this.dirChecked)
        return 1
      
      return 'error'
    }
	},
  methods: {
		changeSelected (selected) {
			this.$store.commit(this.t.APP_SET_THING_NAME, selected)
      this.windChecked = this.getWindChecked()
      this.dirChecked = this.getDirChecked()
      this.tempChecked = this.getTempChecked()
      this.desired = this.reported('u')
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
      return (format == 7 || format == 6 || format == 3 || format == 2)
    },
    getDirChecked () {
      const format = this.reported('f')
      return (format == 7 || format == 5 || format == 3 || format == 1)
    },
    getTempChecked () {
      const format = this.reported('f')
      return (format == 7 || format == 6 || format == 5 || format == 4)
    },
    translateThingName (thing) {
      for (var key in this.$store.state['App'].stations){
        if(key == thing) 
          return this.$store.state['App'].stations[key]
      }
      return thing
    },
    rename() {
      let oldname = this.translateThingName(this.selected)
      if(this.renameInput == null){
        this.showSnackbar('You must enter something to rename')
        return
      }
      var jsonObj = {}
      jsonObj[this.translateThingName(this.selected)] = this.renameInput
      this.$socket.emit('rename', jsonObj)
    },
    get_updated(data){

      if(data['state']&& data.state['u']){
        return data.state['u']
      }else{
        return 0
      }

    }
	},
	sockets: {
		renameAck (message) {
      if(message == 'ok')
        this.$socket.emit('getStations')
        this.showSnackbar('Station name updated')
        this.renameInput = null
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
