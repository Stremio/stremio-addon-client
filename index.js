const client = require('./lib/client')
const collection = require('./lib/collection')

module.exports = {
	AddonClient: client.AddonClient,
	AddonCollection: collection.AddonCollection,
	constructFromManifest: client.constructFromManifest,
	detectFromURL: client.detectFromURL,
}