var AddonClient = require('./AddonClient')
var transports = require('./transports')

function fromDescriptor(descriptor) {
	// NOTE: this will throw if transportUrl is not supported by any of the transports
	// @TODO introduce transport.isValidURL, use that
	// also, use the same thing in detectFromURL itself
	var Transport
	var url = descriptor.transportUrl
	if (url.startsWith('https:') && url.endsWith('/manifest.json')) Transport = transports.http
	if (url.startsWith('https:') && url.includes('/stremio/v1')) Transport = transports.legacy
	if (url.startsWith('ipfs:') || url.startsWith('ipns:')) Transport = transports.ipfs
	var t = new Transport(descriptor.transportUrl) 
	return new AddonClient(descriptor.manifest, t, descriptor.flags)
}

module.exports = fromDescriptor
