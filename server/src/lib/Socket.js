const io = require('socket.io')()
const Buffer = require('./Buffer')

class Socket {
	
	constructor () {
		this.io = require('socket.io')()
		this.io.listen(3000)

		this.io.on('connection', (client) => {
			client.on('init', () => this.onInit(client))
		})
	}
	
	onMessage (topic, data) {
		const now = new Date()
		data['time'] = `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}`

		const topicName = Buffer.onMessage(topic, data)
		this.io.emit('message', {topicName, data})
	}
	
	onInit (client, data) {
		client.emit('init', Buffer.getData())
	}
}

module.exports = new Socket
