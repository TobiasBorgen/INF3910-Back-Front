<template lang="pug">
div(class="login")

	card-loader(:loading="loading")
		md-card-header
			div(class="md-title") Login
			div(class="md-subhead") v0.1

		md-card-content
			md-input-container
				label Username
				md-input(
					v-model="username"
					v-bind:disabled="loading"
					@keyup.enter.native="login"
				)
			md-input-container(md-has-password)
				label Password
				md-input(
					type="password"
					v-model="password"
					v-bind:disabled="loading"
					@keyup.enter.native="login"
				)
		md-card-actions
			md-button(
				v-bind:disabled="loading"
				@click.native="login"
			) Login
</template>

<script>
import CardLoader from '@/components/custom/CardLoader'

export default {
	name: 'Login',
	components: { CardLoader },
	data () {
		return {
			username: '',
			password: '',
			loading: false
		}
	},
	computed: {
		payload () {
			return { username: this.username, password: this.password }
		}
	},
	methods: {
		login () {
			if (this.username == '' || this.password == '') return
				
			this.loading = true
			this.$store.dispatch('Auth/login', this.payload)
				.then(() => {
					this.$router.push('/dashboard')
				})
				.catch(error => {
					this.showSnackbar(error)
					this.loading = false
				})
		}
	}
}
</script>

<style lang="scss" scoped>
.login {
	height: 100%;

	.md-card {
		width: 310px;
		top: 50%;
		left: 50%;
		margin: -155px 0 0 -155px;
	}
}
</style>
