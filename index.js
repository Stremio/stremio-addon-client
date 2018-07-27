var client = require('./lib/client')
var collection = require('./lib/collection')
var mapURL = require('./lib/util/mapURL')
var transports = require('./lib/transports')

module.exports = {
	AddonClient: client.AddonClient,
	AddonCollection: collection.AddonCollection,
	detectFromURL: client.detectFromURL,
	mapURL: mapURL,
	transports: transports,
}
