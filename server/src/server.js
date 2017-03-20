#!/usr/bin/env node

/* Input argv */
var argv = require('optimist')
    .demand('u').string('u')
    .demand('p').string('p')
    .argv

/* Libs */
const AWSIot = require('aws-iot-device-sdk')
const CloudConnect = require('./lib/CloudConnect')
let CC = new CloudConnect


CC.init().then(() => {
    CC.login(argv.u, argv.p).then(() => {

        const mqtt = AWSIot.device({
            region:             CC.AWS.config.region,
            accessKeyId:        CC.AWS.config.credentials.accessKeyId,
            secretKey:          CC.AWS.config.credentials.secretAccessKey,
            sessionToken:       CC.AWS.config.credentials.sessionToken,
            maximumReconnectTimeMs: 8000,
            protocol: 'wss',
        })

        mqtt.on('reconnect', () => {
            CC.refreshCredentials()
						.then(() => {
							mqtt.updateWebsocketCredentials(CC.AWS.config.credentials.accessKeyId, CC.AWS.config.credentials.secretAccessKey, CC.AWS.config.credentials.sessionToken)
						})
        })

        mqtt.on('connect',   ()    => {
					const topic = 'thing-update/UIT IFI course/vind/#'
					mqtt.subscribe(topic, {qos: 1}, (err, granted) => {
						if (err){
							console.log(err)
							return
						}
					})
				})
				mqtt.on('message', (topic, message) => {
					console.log(topic)
					console.log(JSON.parse(message.toString()))
				})
        mqtt.on('close',     ()    => console.info('MQTT Close'))
        mqtt.on('error',     (err) => console.error('MQTT Error', err))
    })
		.catch(error => {
			console.log('Server error: -- :', error)
		})
})
