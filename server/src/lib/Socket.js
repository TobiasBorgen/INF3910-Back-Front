const io = require('socket.io')()

class Socket {
	
	constructor () {
		this.io = require('socket.io')()
		this.io.listen(3000)
	}
	
	onMessage (topic, data) {
		io.emit('message', {topic, data})
	}
}

module.exports = new Socket
