const io = require('socket.io')()
const Buffer = require('./Buffer')

class Socket {
	
	constructor () {
		this.io = require('socket.io')()
		this.io.on('connection', (client) => {
			console.log('Connection recieved')
			var data = Buffer.getData()
			client.emit('message', {topic:null, data})	
		})
  	this.io.listen(3000)
	}
	
	onMessage (topic, data) {
		io.emit('message', {topic, data})
	}
}

module.exports = new Socket
