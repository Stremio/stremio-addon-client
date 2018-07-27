var client = require('./lib/client')
var collection = require('./lib/collection')
var mapURL = require('./lib/util/mapURL')

module.exports = {
	AddonClient: client.AddonClient,
	AddonCollection: collection.AddonCollection,
	detectFromURL: client.detectFromURL,
	mapURL: mapURL,
}
