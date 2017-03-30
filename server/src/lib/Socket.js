const io = require('socket.io')()
const Buffer = require('./Buffer')

class Socket {
	
	constructor () {
		this.client = null
		this.io = require('socket.io')()
		this.io.on('connection', (client) => {
			this.client = client
			console.log('Connection recieved')
			var data = Buffer.getData()
			client.emit('message', {topic:null, data})	
		})
  	this.io.listen(3000)
	}
	
	onMessage (topic, data) {
		this.io.emit('message', {topic, data})
	}
	
	init (data) {
		this.client.emit('init', data)
	}
}

module.exports = new Socket
