#!/usr/bin/env node
console.log('\033[2J')

/* Input argv */
var argv = require('optimist')
	.demand('u').string('u')
	.demand('p').string('p')
	.argv

/* Libs */
const ora = require('ora')
const logger = require('./logger')
const CC = require('./lib/CloudConnect')
const MQTT = require('./lib/MQTTClient')
const Buffer = require('./lib/Buffer')

/* Constants */
const TOPIC = 'thing-update/UIT IFI course/vind/#'
const spinner = ora('Pressing random buttons')
spinner.color = 'green'
CC.addSpinner(spinner.start())

/* Init CC, fetch manifest */
CC.init().then(() => {
	/* Login using cmd parameters */
	CC.login(argv.u, argv.p).then(() => {
		
		spinner.text = 'Docking spaceship'
		
		/* Init MQTT client with AWS config */
		MQTT.init(CC.AWS.config)
		
		/* Setup event handlers */
		MQTT.client.on('reconnect',	()					=> onReconnect())
		MQTT.client.on('connect',	()					=> onConnect())
		MQTT.client.on('message',	(topic, message)	=> onMessage(topic, message))
		MQTT.client.on('close',		()					=> logger.warn('-- MQTT: connection closed'))
		MQTT.client.on('error',		(e)					=> logger.error('-- MQTT: error,', e))
	})
	.catch(error => {
		spinner.stop()
		logger.error('-- CC: error,', error)
	})
})
.catch(() => spinner.stop())

/* Event handlers */
const onReconnect = () => {
	logger.warn('-- MQTT: reconnect')
	CC.refreshCredentials().then(() => {
		MQTT.updateWebsocketCredentials(CC.AWS.config)
	})
}

const onConnect = () => {
	spinner.stop()
	logger.info('-- MQTT: connected')
	logger.info('-- MQTT: subscribing to', TOPIC)
	MQTT.client.subscribe(TOPIC, {qos: 1}, (err, granted) => {
		if (err) logger.error('-- MQTT: error in message,', err)
	})
}

const onMessage = (topic, message) => {
	const data = JSON.parse(message)
	logger.info(`-- MQTT: got message, [${topic}]\n\n`)
	Buffer.onMessage(topic, JSON.parse(message))
	console.log(Buffer)
}
