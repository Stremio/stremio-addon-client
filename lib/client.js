var promisify = require('./util/promisify')
var transports = require('./transports')

function AddonClient(manifest, transport, flags) {
	this.manifest = manifest
	this.transportName = transport.name
	this.transportUrl = transport.url
	this.flags = flags || { }

	this.getLatestManifest = promisify(transport.manifest)

	this.get = promisify(function()
	{
		var args = Array.prototype.slice.call(arguments)
		var cb = args.pop()
		if (typeof(cb) !== 'function') throw 'cb is not a function'
		if (args.length < 2) throw 'args min length is 1'
		transport.get(args, cb)
	})

	this.destroy = promisify(function(cb) 
	{
		if (transport.destroy) transport.destroy(cb)
	})

	this.toDescriptor = function() {
		return {
			manifest: this.manifest,
			transportName: this.transportName,
			transportUrl: this.transportUrl,
			flags: this.flags
		}
	}

	return this
}

function fromDescriptor(descriptor) {
	// NOTE: this will throw if transportName is invalid
	var Transport = transports[descriptor.transportName]
	var t = new Transport(descriptor.transportUrl) 
	return new AddonClient(descriptor.manifest, t, descriptor.flags)
}

module.exports = {
	fromDescriptor: fromDescriptor,
	AddonClient: AddonClient,
}
