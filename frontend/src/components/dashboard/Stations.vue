<template lang="pug">
div.widgets
	md-layout.widgets-container
		widget-things
</template>

<script>
import WidgetThings from '@/components/dashboard/widgets/Things'

export default {
	name: 'Stations',
	components: {
		WidgetThings
	}
}
</script>

<style lang="scss" scoped>

</style>
