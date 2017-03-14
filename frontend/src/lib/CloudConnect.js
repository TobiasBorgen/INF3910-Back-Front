import AWS from 'aws-sdk'

class CloudConnect {
	
	/* Init class with host name configured for
	 * Telenor Connexion/Cloud Connect/Start IoT.
	 */
	constructor () {
		this.host = 'startiot.cc.telenorconnexion.com'
		this.AWS = AWS
		this.manifest = null
	}

	/* Load AWS manifest */
	init () {
		return this.loadManifest()
			.catch(error => console.log('Could not initialize CloudConnect:', error))
	}

	/* Parse different formats returned by a lambda call */
	parseError (error) {
		if (error && error.errorMessage) { return JSON.parse(error.errorMessage).message }
		else if (typeof(error) === 'string') { return JSON.parse(error) }
		else { return error }
	}

	/* Determine if an error returned by a lambda call is an auth error */
	isAuthError (error) {
		const authErrors = /No data|Token is expired|Invalid login token|Missing credentials in config|is not authorized to perform|Not Found/
		return  (typeof error === 'string' && error.match(authErrors)) ||
				(typeof error.message === 'string' && error.message.match(authErrors))
	}
	
	/* Fetch manifest from correct URL */
	loadManifest () {
		const manifest_url = `https://1u31fuekv5.execute-api.eu-west-1.amazonaws.com/prod/manifest/?hostname=${this.host}`

		return fetch(manifest_url)
			.then(response => response.json())
			.then(manifest => {
				this.manifest = manifest
				this.AWS.config.region = manifest.Region
			})
	}
	
	/* Invoke will execute a AWS lambda function */
	invoke (function_name, payload) {

		/* Create an instance of the lambda call for
		 * potentially later usage.
		 */
		const invoke_instance = () => {
			return this.lambda(function_name, payload)
		}
		
		/* Run it, but catch errors */
		return invoke_instance()
			.catch(error => {

				/* Refresh token if auth error */
				if (this.isAuthError(error)) {
					return this.refreshCredentials()
						.then(invoke_instance)
				}
				throw error
			})
	}
	
	/* Execute a Cloud Connect Lambda function */
	lambda (function_name, payload) {
		return new Promise((resolve, reject) => {

			/* Lambda parameters */
			let params = {
				FunctionName: this.manifest[function_name],
				Payload: JSON.stringify(payload)
			}
			
			/* Invoke the lambda function */
			let lambda = new this.AWS.Lambda()
			lambda.invoke(params, (err, res) => {

				/* Parse response */
				try {
					/* Got error */
					if (err) reject(this.parseError(err))
					/* Empty response */
					if (!res || !res.Payload) reject('No data')
					/* No error, got a response */
					const payload = JSON.parse(res.Payload)
					/* Got an error message in response */
					if (res.FunctionError || payload.errorMessage)
						reject(this.parseError(payload))
					/* OK */
					resolve(payload)
				/* Unexpected error */
				} catch (err) {
					reject(err)
				}
			})
		})
	}

	/* Get AWS Cognito Credentials */
	getCredentials (token = null) {
		/* Don't fetch credentials if we already have them */
		//if (token == null && this.AWS.config.credentials !== null) return Promise.resolve()

		this.AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: this.manifest.IdentityPool,
			Logins: {
				[`cognito-idp.${this.manifest.Region}.amazonaws.com/${this.manifest.UserPool}`]: token
			}
		})
		
		/* Clear previously cached ID if token is absent */
		if (!token) this.AWS.config.credentials.clearCachedId()

		return this.AWS.config.credentials.getPromise()
	}

	refreshCredentials () {
		const account = window.localStorage.getItem('account')
		
		if (typeof account === 'undefined')
			throw new Error('No Refresh Token')
		
		const refreshToken = JSON.parse(account).credentials.refreshToken
		
		if (!refreshToken)
			throw new Error('No Refresh Token')
		
		this.AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: this.manifest.IdentityPool
		})
		this.AWS.config.credentials.clearCachedId()
		
		const refreshPayload = {
			action: 'REFRESH',
			attributes: {
				refreshToken: refreshToken
			}
		}
		return this.invoke('AuthLambda', refreshPayload)
			.then(account => {
				return this.getCredentials(account.credentials.token)
			})
	}
	
	/* Perform steps needed to create a Cognito Identity */
	login (username, password) {

		/* Invoke an AuthLambda call to obtain an
		 * authentication token from Cloud Connect.
		 */
		let accountData = null
		const loginPayload = {
			action: 'LOGIN',
			attributes: {
				userName: username,
				password: password
			}
		}
		return this.invoke('AuthLambda', loginPayload)
			.then(account => {
				accountData = account

				/* Get AWS Cognito raised privilege credential
				 * using the obtained Cloud Connect auth token.
				 */
				return this.getCredentials(account.credentials.token)
			})
			.then(() => { return Promise.resolve(accountData) })
	}
}

export let CC = new CloudConnect
