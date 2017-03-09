const fs = require('fs')
const mqtt = require('mqtt')

const init = ({hostname, clientId, key, cert, ca}) => {

	var options = {
		port:		8883,
		protocol:	'mqtts',
		hostname:	hostname,
		clientId:	clientId,
		key:		fs.readFileSync(key),
		cert:		fs.readFileSync(cert),
		ca:			fs.readFileSync(ca)
	}
	const client = mqtt.connect(options)

	return client
}

module.exports = {init}
