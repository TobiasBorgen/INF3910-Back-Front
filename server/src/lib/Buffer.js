const MAX_BUFFER = 5
const fs = require('fs');
var stationname;
fs.readFile('stations.json', 'utf8', function (err, data) {
  if (err) throw err;
  stationname = JSON.parse(data);
})

class Buffer {
	
	constructor () {
		this.buffer = {}
	}
	
	checkTopic (topic) {
		let thingName = topic.split('/')[3]
		
		/* Rename variable by using stations.json */
		for(var key in stationname){
			if (key == thingName){
				thingName = stationname[key]
			}
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
		if (thing.length > MAX_BUFFER)
			thing.splice(-1, 1)
	}

	getData (){
		return this.buffer
	}
	
	onMessage (topic, data) {
		const index = this.checkTopic(topic)
		
		this.pushData(index, data)
	}
}

module.exports = new Buffer
