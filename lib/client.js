const detectFromURL = require('./detectFromURL')

// The node.js promisify does not support still using callbacks (detection whether a cb is passed)
//const promisify = require('util').promisify
const promisify = require('./util/promisify')

module.exports.AddonClient = function AddonClient(manifest, transport, flags)
{
	this.manifest = manifest
	this.transportName = transport.name
	this.transportUrl = transport.url
	this.flags = flags || { }

	this.getLatestManifest = promisify(transport.manifest)

	this.get = promisify(function()
	{
		let args = Array.prototype.slice.call(arguments)
		let cb = args.pop()
		if (typeof(cb) !== 'function') throw 'cb is not a function'
		if (args.length < 2) throw 'args min length is 1'
		transport.get(args, cb)
	})

	this.destroy = promisify(function(cb) 
	{
		if (transport.destroy) transport.destroy(cb)
	})

	return this
}

module.exports.detectFromURL = promisify(detectFromURL)