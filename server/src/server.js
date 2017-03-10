#!/usr/bin/env node

/* Input argv */
var argv = require('optimist')
	.demand('t').string('t')
	.describe('t', 'Thing type ID')
	.argv

/* Libs */
const mqtt = require('./lib/mqttClient')
const logger = require('./logger')
const path = require('path')
const io = require('socket.io')()

/* Init last data to send new socket clients */
LAST_DATA = null

/* Init Socket.io */
io.on('connection', (client) => {
	client.emit('message', LAST_DATA)	
})
io.listen(3000)

/* Init MQTT client */
const TOPIC = `$aws/things/${argv.t}/shadow/update`
const options = {
	hostname:	'a3k7odshaiipe8.iot.eu-west-1.amazonaws.com',
	clientId:	argv.t,
	key:		path.join(__dirname, '../certs', argv.t, 'privkey.pem'),
	cert:		path.join(__dirname, '../certs', argv.t, 'cert.pem'),
	ca:			path.join(__dirname, '../certs', 'root.crt')
}
const mqttClient = mqtt.init(options)

/* Setup MQTT event listeners & connect */
mqttClient.on('reconnect',	() => logger.warn('-- MQTT: reconnect'))
mqttClient.on('close',		() => logger.warn('-- MQTT: connection closed'))
mqttClient.on('error',		(e) => logger.error('-- MQTT: error, ', e))
mqttClient.on('connect',	() => {
	logger.info('-- MQTT: connected')
	logger.info('-- MQTT: subscribing to ', TOPIC)

	/* Subscribe to thing updates */
	mqttClient.subscribe(TOPIC, {qos: 1}, (err, granted) => {
		if (err) {
			logger.error('-- MQTT: subscribe error, ', err)
			return
		}

		/* Relay incoming messages over socket */
		mqttClient.on('message', (topic, message) => {
			const data = JSON.parse(message)
			LAST_DATA = {thing: argv.t, data}

			logger.info('-- MQTT: got message, ', data)
			io.emit('message', LAST_DATA)
		})
	})
})
