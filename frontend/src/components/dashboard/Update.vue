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
            label Desired
            md-input(
              type="number"
              v-model="desired"
            )
          md-button(class="md-primary") Update

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

export default {
  name: 'Update',
  components: { CardLoader },
  data () {
    return {
      desired: 30
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
