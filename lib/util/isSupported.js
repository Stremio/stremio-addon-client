// manifest, resource, type, id
function isSupported(manifest, resource, type, id) {
	// special case
	if (resource === 'catalog' && Array.isArray(manifest.catalogs)) {
		return manifest.catalogs.find(function(c) {
			return c.type === type && c.id === id
		})
	}

	// resources can be [string], or [{ name, types, idPrefixes }] if we want detailed match per-resource
	var matched = manifest.resources.find(function(x) {
		return resource === x || resource === x.name
	})

	if (!matched) return false

	if (typeof(matched) === 'string') {
		return secondaryMatch(manifest.types, manifest.idPrefixes, type, id)
	} else {
		return secondaryMatch(matched.types, matched.idPrefixes, type, id)
	}
}

function secondaryMatch(types, idPrefixes, type, id) {
	if (types.indexOf(type) === -1) return false

	if (Array.isArray(idPrefixes)) {
		return idPrefixes.some(function(p) {
			return id.indexOf(p) === 0
		})
	}

	return true
}


module.exports = isSupported