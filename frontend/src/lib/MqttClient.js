import AWSMqtt from 'aws-mqtt-client'
import {CONFIG} from '@/config'
import {CC} from '@/lib/CloudConnect'

class MqttClient {

	init (ctx) {
		this.ctx = ctx
		this.mqtt = new AWSMqtt({
			region:				CC.AWS.config.region,
			accessKeyId:		CC.AWS.config.credentials.accessKeyId,
			secretAccessKey:	CC.AWS.config.credentials.secretAccessKey,
			sessionToken:		CC.AWS.config.credentials.sessionToken,
			endpointAddress:	CC.manifest.IotEndpoint,
			maximumReconnectTimeMs: 8000,
			protocol: 'wss'
		})
		
		this.mqtt.on('connect', () => this.connect())
		this.mqtt.on('close', () => this.close())
		this.mqtt.on('error', (e) => this.error(e))
		this.mqtt.on('message', (topic, message) => this.message(topic, message))
	}

	connect () {
		this.ctx.showSnackbar('MQTT: connected')

		const topic = `sub/${CONFIG.ROOT_DOMAIN}/${CONFIG.THING_DOMAIN}/#`
		this.mqtt.subscribe(topic)
	}

	close () {
		this.ctx.showSnackbar('MQTT: closed')
	}

	error (e) {
		this.ctx.showSnackbar(`MQTT: ${e.getMessage()}`)
	}

	message (topic, message) {
		const msg = JSON.parse(message.toString())
		this.ctx.$store.commit(`Thing/${this.ctx.t.THING_GET_MQTT}`, {topic, message: msg})
	}
}

export let MQTT = new MqttClient
