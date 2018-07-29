var client = require('./lib/client')
var collection = require('./lib/collection')
var detectFromURL = require('./lib/detectFromURL')
var mapURL = require('./lib/util/mapURL')
var transports = require('./lib/transports')

module.exports = {
	AddonClient: client.AddonClient,
	AddonCollection: collection.AddonCollection,
	detectFromURL: detectFromURL,
	mapURL: mapURL,
	transports: transports,
}
