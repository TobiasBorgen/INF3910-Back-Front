#!/usr/bin/env node
console.log('\033[2J')

/* Input argv */
var argv = require('optimist')
	.demand('u').string('u')
	.demand('p').string('p')
	.demand('t').string('t')
	.argv

/* Libs */
const ora = require('ora')
const logger = require('./logger')
const CC = require('./lib/CloudConnect')
const MQTT = require('./lib/MQTTClient')
const IO = require('./lib/Socket')

/* Init CLI */
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
		MQTT.client.on('reconnect',  ()               => onReconnect())
		MQTT.client.on('connect',    ()               => onConnect())
		MQTT.client.on('message',    (topic, message) => onMessage(topic, message))
		MQTT.client.on('close',      ()               => logger.warn('-- MQTT: connection closed'))
		MQTT.client.on('error',      (e)              => logger.error('-- MQTT: error,', e))
	})
	.catch(error => {
		spinner.stop()
		logger.error('-- CC: error,', error)
	})
})
.catch(() => spinner.stop())

/* On MQTT reconnect try to refresh AWS Cognito
 * credentials, update websocket credentials
 * and reconnect.
 */
const onReconnect = () => {
	logger.warn('-- MQTT: reconnect')

	CC.refreshCredentials().then(() => {
		MQTT.updateWebsocketCredentials(CC.AWS.config)
	})
	.catch(err => {
		logger.error('-- onReconnect: catch,', err)
	})
}

/* On MQTT connection subscribe to configured topic.
 */
const onConnect = () => {
	spinner.stop()
	logger.info('-- MQTT: connected')
	logger.info('-- MQTT: subscribing to', argv.t)

	MQTT.client.subscribe(argv.t, {qos: 1}, (err, granted) => {
		if (err) logger.error('-- MQTT: error in message,', err)
	})

}
/* On MQTT message, parse the data and pass it to
 * the socket handler. The socket handler will take
 * care of adding to the bounded buffer.
 */
const onMessage = (topic, message) => {
	const data = JSON.parse(message)
	logger.info(`-- MQTT: got message, [${topic}]\n\n`)

	if(!data.state.reported || (!data.state.reported['s'] && !data.state.reported['d'] && !data.state.reported['t'])){
		logger.info(`-- MQTT: Invalid message recieved, [${message}]\n\n`)
		return
	}

	IO.onMessage(topic, data)
}


/*************************************************************
 *												DEBUG DATA 												 *
 *************************************************************/
const rndrng = (min, max) => { return (Math.random() * (max - min + 1) + min).toFixed(2) }

/* DEBUG DATA */
/*
const rndrng = (min, max) => { return (Math.random() * (max - min + 1) + min).toFixed(1) }
>>>>>>> 7a2127a352277fddd2e4e05f244fb005fbf003b0
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
