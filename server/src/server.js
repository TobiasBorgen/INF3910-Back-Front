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
const IO = require('./lib/Socket')

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
		MQTT.client.on('reconnect',	()							=> onReconnect())
		MQTT.client.on('connect',	()								=> onConnect())
		MQTT.client.on('message',	(topic, message)	=> onMessage(topic, message))
		MQTT.client.on('front_init', ()							=> onFrontInit())
		MQTT.client.on('close',		()								=> logger.warn('-- MQTT: connection closed'))
		MQTT.client.on('error',		(e)								=> logger.error('-- MQTT: error,', e))
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

/*************************************************************
 *												DEBUG DATA 												 *
 *************************************************************/
/*
const rndrng = (min, max) => { return (Math.random() * (max - min + 1) + min).toFixed(1) }
const DEBUG_FREQ = 5000 // 5s interval
const DEBUG_TOPIC = 'thing-update/UIT IFI course/vind/00000371'
const DEBUG_TOPIC_2 = 'thing-update/UIT IFI course/vind/00000376'
let timer = () => {
	setTimeout(() => {
		
		let DEBUG_DATA = {
			state:{
				reported:{
					connection_status: 2,
					rssi: rndrng(0.0, 100.0),
					lsnr: rndrng(-8.0, 10.0),
					latlng: '69.6363,18.9977',
					f: 0,
					t: rndrng(-30.0, 30.0),
					s: rndrng(0.0, 25.0),
					d: rndrng(0.0, 360.0),
					payload: '0022.6000.05240.45',
				}
			}
		}
		var randnum = rndrng(0, 2)
		console.log('THIS IS THE NUMBER --------- ', randnum)
		if( randnum > 1){
			onMessage(DEBUG_TOPIC, JSON.stringify(DEBUG_DATA))
		}
		else{
			onMessage(DEBUG_TOPIC_2, JSON.stringify(DEBUG_DATA))
		}
		timer()
	}, DEBUG_FREQ)
}
timer()
*/

const onMessage = (topic, message) => {
	const data = JSON.parse(message)
	d = new Date()
	data['time'] = d.getHours() + ':' + d.getMinutes()
	logger.info(`-- MQTT: got message, [${topic}]\n\n`)
	//logger.info(JSON.parse(message))

	Buffer.onMessage(topic, data)
	//console.log(Buffer.getData())

	IO.onMessage(topic, data)
}

const onFrontInit = () => {
	logger.info('__________________________________got init')
	IO.init(Buffer.getData())
}
