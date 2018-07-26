var client = require('./lib/client')
var collection = require('./lib/collection')
var mapURL = require('./lib/util/mapURL')

module.exports = {
	AddonClient: client.AddonClient,
	AddonCollection: collection.AddonCollection,
	constructFromManifest: client.constructFromManifest,
	detectFromURL: client.detectFromURL,
	mapURL: mapURL,
}
