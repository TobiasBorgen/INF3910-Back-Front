const fs = require('fs')

class Buffer {
	
	constructor (MAX_BUFFER = 10) {
		this.MAX_BUFFER = MAX_BUFFER
		this.buffer = {}
		this.stations = {}

		/* Read stored station mappings */
		fs.readFile('stations.json', 'utf8', (err, data) => {
			if (err) throw err
			this.stations = JSON.parse(data)
		})
	}
	
	checkTopic (topic) {
		let thingName = topic.split('/')[3]
		
		/* Rename variable by using stations.json */
		for (let key in this.stations) {
			if (key == thingName)
				thingName = this.stations[key]
		}
		
		/* Search for thing in buffer */
		let i = 0
		for (i in this.buffer) {
			if (i == thingName)
				return i
		}
		
		/* New thing */
		this.buffer[thingName] = []
		
		return thingName
	}
	
	pushData (index, data) {
		let thing = this.buffer[index]
		
		/* Prepend new data to buffer */
		thing.unshift(data)
		
		/* Remove last data if buffer overflow */
		if (thing.length > this.MAX_BUFFER)
			thing.splice(-1, 1)
	}

	getData () {
		return this.buffer
	}
	
	onMessage (topic, data) {
		const index = this.checkTopic(topic)
		this.pushData(index, data)
		return index
	}
	renameStation (client, data){
		for (var key in data){
			var name = key
			var newname = data[key]
		}
		var existing = 0

		/* Update stations in memory and in file*/
		for (var key in this.stations){
			if(this.stations[key] == name){
				this.stations[key] = newname
				existing = 1
			}
		}
		/* If new thing, add to this stations */
		if(existing == 0){
			console.log('not existing')
			this.stations[name] = newname
		}

		fs.writeFile('stations.json', JSON.stringify(this.stations, null, 2) , 'utf-8');

		/* Update current buffer with new name */ 
		for(var key in this.buffer){
			if(key == name)
				var measurements = this.buffer[key]
				delete this.buffer[key]
				this.buffer[newname] = measurements

		}
		client.emit('renameAck', 'ok')
	}
}

module.exports = new Buffer
