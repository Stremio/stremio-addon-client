// manifest, resource, type, id
function isSupported(manifest, resource, type, id) {
	// special case
	if (resource === 'catalog' && Array.isArray(manifest.catalogs)) {
		return manifest.catalogs.some(function(c) {
			return c.type === type && c.id === id
		})
	}

	// resources is [{ name, types?, idPrefixes? }]
	var matched = manifest.resources.find(function(x) {
		return resource === x.name
	})

	if (!matched) return false

	return secondaryMatch(
		matched.types || manifest.types,
		matched.idPrefixes || manifest.idPrefixes,
		type, id
	)
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
