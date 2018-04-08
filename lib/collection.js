const AddonClient = require('./client').AddonClient
const constructFromManifest = require('./client').constructFromManifest

function AddonCollection(opts) {
	const handle = this
	handle.addons = []
	
	handle.load = function(all) {
		handle.addons = all.map(function(x) {
			return constructFromManifest(x.manifest, x.transportName, function(err) {
				// @TODO: err handling
				// this callback is only called when the manifest is UPDATED
				// hence we do not REALLY need it
			})
		})
	}
	handle.save = function() {
		return handle.addons.map(function(x) { 
			return { manifest: x.manifest, transportName: x.transportName } 
		})
	}

	handle.add = function(addon) {
		if (!addon instanceof AddonClient) throw 'instance of AddonClient required'
		// @TODO: should we deduplicate here?
		handle.addons.push(addon)
	}

	handle.remove = function(addon) {
		if (!addon instanceof AddonClient) throw 'instance of AddonClient required'
		handle.addons = handle.addons.filter(function(x) { return x != addon })
	}

	return handle
}

module.exports.AddonCollection = AddonCollection