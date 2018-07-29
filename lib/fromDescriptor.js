var AddonClient = require('./AddonClient')
var transports = require('./transports')

function fromDescriptor(descriptor) {
	// NOTE: this will throw if transportName is invalid
	var Transport = transports[descriptor.transportName]
	var t = new Transport(descriptor.transportUrl) 
	return new AddonClient(descriptor.manifest, t, descriptor.flags)
}

module.exports = fromDescriptor