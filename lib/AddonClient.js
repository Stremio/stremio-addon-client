var promisify = require('./util/promisify')
var isSupported = require('./util/isSupported')

function AddonClient(manifest, transport, flags) {
	this.manifest = Object.freeze(manifest)
	this.transportUrl = transport.url
	this.flags = Object.freeze(flags || {})

	this.isSupported = isSupported.bind(null, manifest)

	this.get = promisify(function()
	{
		var args = Array.prototype.slice.call(arguments)
		var cb = args.pop()
		if (typeof(cb) !== 'function') throw new Error('cb is not a function')
		if (args.length < 2) throw new Error('args min length is 2')
		transport.get(args, cb)
	})

	this.destroy = promisify(function(cb) 
	{
		if (transport.destroy) transport.destroy(cb)
	})

	this.toDescriptor = function() {
		return {
			manifest: this.manifest,
			transportUrl: this.transportUrl,
			flags: this.flags
		}
	}

	Object.freeze(this)

	return this
}

module.exports = AddonClient
