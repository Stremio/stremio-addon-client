const AddonClient = require('./client').AddonClient
const constructFromManifest = require('./client').constructFromManifest
const transports = require('./transports')
const promisify = require('./util/promisify')

function AddonCollection() {
	const handle = this
	handle.addons = []
	
	handle.load = function(all) {
		handle.addons = all.map(function(x) {
			// @TODO: WARNING: this will throw if transportName is invalid
			const Transport = transports[x.transportName]
			const t = new Transport(x.transportUrl) 
			return new AddonClient(x.manifest, t, x.flags)
		})
	}

	handle.save = function() {
		return handle.addons.map(function(x) { 
			return { manifest: x.manifest, transportName: x.transportName, transportUrl: x.transportUrl, flags: x.flags } 
		})
	}

	handle.includes = function(addon) {
		if (!addon instanceof AddonClient) throw 'instance of AddonClient required'
		return handle.addons.some(function(x) { return x.transportUrl === addon.transportUrl })
	}

	handle.add = function(addon) {
		if (!addon instanceof AddonClient) throw 'instance of AddonClient required'
		if (!handle.includes(addon)) handle.addons.push(addon)
	}

	handle.remove = function(addon) {
		if (!addon instanceof AddonClient) throw 'instance of AddonClient required'
		handle.addons = handle.addons.filter(function(x) { return x.transportUrl != addon.transportUrl })
	}

	// Create a copy of the collection without deep-copying the add-ons
	handle.clone = function() {
		var col = new AddonCollection()
		col.addons = [].concat(this.addons)
		return col
	}

	return handle
}

module.exports.AddonCollection = AddonCollection