var AddonClient = require('./client').AddonClient
var transports = require('./transports')
var promisify = require('./util/promisify')

function AddonCollection(addons) {
	var handle = this
	
	addons = Array.isArray(addons) ? addons : []

	handle.getAddons = function() {
		return addons.slice()
	}
	
	handle.load = function(all) {
		addons = all.map(function(x) {
			// @TODO: WARNING: this will throw if transportName is invalid
			var Transport = transports[x.transportName]
			var t = new Transport(x.transportUrl) 
			return new AddonClient(x.manifest, t, x.flags)
		})
	}

	handle.save = function() {
		return addons.map(function(x) { 
			return { manifest: x.manifest, transportName: x.transportName, transportUrl: x.transportUrl, flags: x.flags } 
		})
	}

	handle.includes = function(addon) {
		if (!addon instanceof AddonClient) throw 'instance of AddonClient required'
		return addons.some(function(x) { return x.transportUrl === addon.transportUrl })
	}

	handle.add = function(addon) {
		if (!addon instanceof AddonClient) throw 'instance of AddonClient required'
		if (!handle.includes(addon)) addons.push(addon)
	}

	handle.remove = function(addon) {
		if (!addon instanceof AddonClient) throw 'instance of AddonClient required'
		addons = addons.filter(function(x) { return x.transportUrl != addon.transportUrl })
	}

	// Create a copy of the collection without deep-copying the add-ons
	handle.clone = function() {
		var col = new AddonCollection(addons.slice())
		return col
	}

	return handle
}

module.exports.AddonCollection = AddonCollection
