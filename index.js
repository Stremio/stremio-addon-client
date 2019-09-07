module.exports = {
	AddonClient: require('./lib/AddonClient'),
	AddonCollection: require('./lib/AddonCollection'),

	fromDescriptor: require('./lib/fromDescriptor'),
	detectFromURL: require('./lib/detectFromURL'),
	stringifyRequest: require('./lib/stringifyRequest'),
	mapURL: require('./lib/util/mapURL'),

	transports: require('./lib/transports'),
}
