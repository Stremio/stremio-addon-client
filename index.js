const client = require('./lib/client')
const collection = require('./lib/collection')
const mapURL = require('./lib/util/mapURL')

module.exports = {
	AddonClient: client.AddonClient,
	AddonCollection: collection.AddonCollection,
	constructFromManifest: client.constructFromManifest,
	detectFromURL: client.detectFromURL,
	mapURL: mapURL,
}
