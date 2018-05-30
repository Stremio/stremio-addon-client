function mapRequest(args) {
	let resource = args[0]

	if (resource == 'catalog') {
		return { 
			method: 'meta.find',
			params: [null, remapCatalog(args)],
			wrapper: wrapResp.bind(null, 'metas')
		}
	}
	else if (resource == 'meta') {
		return {
			method: 'meta.get',
			params: [null, remapMeta(args)],
			wrapper: wrapResp.bind(null, 'meta')
		}
	}
	else if (resource == 'stream') {
		return {
			method: 'stream.find',
			params: [null, remapStream(args)],
			wrapper: wrapResp.bind(null, 'streams')
		}
	}
	else if (resource == 'subtitles') {
		return {
			method: 'subtitles.find',
			params: [null, remapSubs(args)],
			wrapper: wrapResp.bind(null, 'subtitles')
		}
	}

	return null
}

function wrapResp(name, cb) 
{
	return function(err, res) {
		if (err) return cb(err)

		var o = { }
		o[name] = res
		return cb(null, o)
	}
}

function mapManifest(resp)
{
	const manifest = resp.manifest
	let v3Manifest = {
		id: manifest.id,

		version: manifest.version || '0.0.1',

		name: manifest.name,
		description: manifest.description,
		contactEmail: manifest.contactEmail,

		logo: manifest.logo,
		background: manifest.background,

		resources: [],
		types: manifest.types,

		catalogs: []
	}

	if (manifest.idProperty) {
		var prefixes = Array.isArray(manifest.idProperty) ? manifest.idProperty : [manifest.idProperty]

		// This design decision comes from the implicit assumption in stremio that /tt\\d{7}/ is an imdb id
		// in order to avoid further ugliness with assumptions about /tt\\d{7}/ in other, non-legacy parts of the v3 code,
		// it's best to just count ^tt as a valid prefix. This also simplifies the notion of prefixes, as now the ':' is included
		v3Manifest.idPrefixes = prefixes.map(function(prefix) {
			if (prefix === 'imdb_id') return 'tt'
			if (prefix === 'yt_id') return 'UC'
			return prefix+':'
		})
	}

	const sorts = Array.isArray(manifest.sorts) ? manifest.sorts : [ null ]

	if (resp.methods.indexOf('meta.find') !== -1) {
		sorts.forEach(function(sort) {
			((sort && sort.types) || manifest.types).forEach(function(type) {
				if (! type) return

				let key = 'top'
				if (sort) key = sort.prop
				v3Manifest.catalogs.push({ type: type, id: key, name: sort && sort.name })
			})
		})
	}

	if (resp.methods.indexOf('meta.get') !== -1)
		v3Manifest.resources.push('meta')

	if (resp.methods.indexOf('stream.find') !== -1)
		v3Manifest.resources.push('stream') 

	if (resp.methods.indexOf('subtitles.find') !== -1)
		v3Manifest.resources.push('subtitles')

	return v3Manifest
}

function remapCatalog(args)
{
	// resource, type, id
	let id = args[2]
	let req = { query: { type: args[1] }, limit: 100 }

	let extra = args[3]

	if (id !== 'top') {
		// Just follows the convention set out by stremboard
		// L287 cffb94e4a9c57f5872e768eff25164b53f004a2b
		req.sort = { }
		req.sort[id] = -1
		req.sort['popularity'] = -1
	}

	if (extra && extra.skip) req.skip = extra.skip
	if (extra && extra.genre) req.query.genre = extra.genre

	return req
}

function getQueryFromId(id) {
	let spl = id.split(':')
	let query = { }

	if (spl[0].match('^tt')) query.imdb_id = spl[0]
	else if (spl[0].match('^UC')) query.yt_id = spl[0]
	else query[spl[0]] = spl[1]
	
	return query
}

function isSpecialPrefix(id) {
	return id.match('^tt') || id.match('^UC')
}

function remapMeta(args)
{
	return { query: getQueryFromId(args[2]) }
}

function remapStream(args)
{
	let req = { query: getQueryFromId(args[2]) }

	req.query.type = args[1]
	
	let id = args[2].split(':')
	.slice(isSpecialPrefix(args[2]) ? 1 : 2)

	if (id.length == 2) {
		req.query.season = parseInt(id[0])
		req.query.episode = parseInt(id[1])
	}
	if (id.length == 1) {
		req.query.video_id = id[0]
	}

	return req
}

function remapSubs(args) 
{
	let req = { supportsZip: true, query: { videoHash: args[2] } }
	let extra = args[3]

	if (extra) {
		if (extra.videoId) req.query.itemHash = extra.videoId.replace(/\:/g, ' ')
		if (extra.videoSize) req.query.videoSize = extra.videoSize
		if (extra.videoName) req.query.videoName = extra.videoName
	}

	return req
}

module.exports = {
	mapRequest: mapRequest,
	mapManifest: mapManifest,
}