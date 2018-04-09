const AddonClient = require('./client').AddonClient
const constructFromManifest = require('./client').constructFromManifest

function AddonCollection() {
	const handle = this
	handle.addons = []
	
	handle.load = function(all) {
		let results = all.map(function(x) { 
			return constructFromManifest(x.manifest, x.transportName)
		})

		handle.addons = results.map(function(x) { return x.addon })

		let manifestUpdates = []

		// Try to update the manifest for every add-on
		results.forEach(function(x) {
			let p = x.fetchNewManifest()
			
			p.then(function(newManifest) {
				// Keep these values from the original
				// NOTE: do we want to allow changes for those?
				newManifest.transport = x.addon.manifest.transport
				newManifest.url = x.addon.manifest.url

				x.addon.manifest = newManifest
			})

			manifestUpdates.push(p)
		})

		return manifestUpdates
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