const AWSIot = require('aws-iot-device-sdk')

class MQTTClient {
	constructor () {
		this.client = null
	}
	
	init (config) {
		this.client = AWSIot.device({

			region:						config.region,
			accessKeyId:			config.credentials.accessKeyId,
			secretKey:				config.credentials.secretAccessKey,
			sessionToken:			config.credentials.sessionToken,
			maximumReconnectTimeMs:	8000,
			protocol: 				'wss',
		})
	}
	
	updateWebsocketCredentials (config) {
		this.client.updateWebsocketCredentials(
			CC.AWS.config.credentials.accessKeyId,
			CC.AWS.config.credentials.secretAccessKey,
			CC.AWS.config.credentials.sessionToken
		)
	}
}

module.exports = new MQTTClient
