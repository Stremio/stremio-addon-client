const AddonClient = require('./client').AddonClient
const constructFromManifest = require('./client').constructFromManifest

function AddonCollection() {
	const handle = this
	handle.addons = []
	
	handle.load = function(all) {
		let addons = []
		let manifestUpdates = []

		all.forEach(function(x) { 
			// @TODO: consider the warning
			// WARNING: this will throw if transportName is invalid
			const res = constructFromManifest(x.manifest, x.transportName, x.flags)
			
			// Push the newly constructed add-on
			addons.push(res.addon)

			// Try to update the manifest for every add-on
			let p = res.fetchNewManifest()
			p.then(function(newManifest) {
				// Keep these values from the original
				// NOTE: do we want to allow changes for those?
				newManifest.transport = res.addon.manifest.transport
				newManifest.url = res.addon.manifest.url

				res.addon.manifest = newManifest
			})
			manifestUpdates.push(p)
		})

		handle.addons = addons
		return manifestUpdates
	}

	handle.save = function() {
		return handle.addons.map(function(x) { 
			return { manifest: x.manifest, transportName: x.transportName, flags: x.flags } 
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