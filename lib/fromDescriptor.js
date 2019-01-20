var AddonClient = require('./AddonClient')
var transports = require('./transports')

function fromDescriptor(descriptor) {
	var Transport = Object.values(transports).find(function(t) {
		return t.isValidURL(descriptor.transportUrl)
	})
	if (!Transport) throw 'unsupported transport for '+descriptor.transportUrl
	var t = new Transport(descriptor.transportUrl) 
	return new AddonClient(descriptor.manifest, t, descriptor.flags)
}

module.exports = fromDescriptor
