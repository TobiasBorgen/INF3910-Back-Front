<template lang="pug">
.widgets
  md-layout.widgets-container
    md-layout
      card-loader(:loading="!thingsInited")
        md-card-header
          md-card-header-text
            .md-title Settings
        md-card-content
          md-list
            md-list-item
              md-icon account_circle
              span {{ account('firstName') }} {{ account('lastName') }} ({{ account('userName') }})
            md-list-item
              md-icon email
              span {{ account('email') }}
            md-list-item
              md-icon account_balance
              span {{ account('domainName') }}
            md-list-item
              md-icon vpn_key
              span {{ account('roleName') }}
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'Settings',
  components: { CardLoader },
  methods: {
    account (prop) {
      if (this.$store.getters['Auth/account'] !== null)
        return this.$store.getters['Auth/account'][prop]
      return null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
