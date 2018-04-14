const fetch = require('node-fetch')
const errors = require('../errors')

// Legacy add-on adapter
// Makes legacy add-ons magically work with the new API
// This is very ugly but a necessary evil

// @TODO subtitles
// @TODO perhaps search?

module.exports = function legacyTransport(url)
{
	this.name = 'legacy'
	this.url = url
	
	this.manifest = function(cb) 
	{
		jsonRPCRequest('meta', [], function(err, resp) {
			if (err)
				return cb(err)

			let v3Manifest
			let error

			cb(null, mapManifest(resp))
		})
	}

	this.get = function(args, cb) 
	{
		let resource = args[0]

		if (args.length < 3)
			return cb(errors.ERR_UNSUPPORTED_ARGS)

		if (resource == 'catalog') {
			jsonRPCRequest('meta.find', [null, remapCatalog(args)], wrapResp('metas', cb))
		}
		else if (resource == 'meta') {
			jsonRPCRequest('meta.get', [null, remapMeta(args)], wrapResp('meta', cb))
		}
		else if (resource == 'stream') {
			jsonRPCRequest('stream.find', [null, remapStream(args)], wrapResp('streams', cb))
		}
		/*
		else if (resource == 'subtitles') {
			jsonRPCRequest('subtitles.find', [null, remapSubs(args)], wrapResp('subtitles', cb))
		}*/
		else {
			cb(errors.ERR_UNSUPPORTED_RESOURCE)
		}
	}

	function jsonRPCRequest(method, params, cb)
	{
		const body = JSON.stringify({ params: params, method: method, id: 1, jsonrpc: '2.0' })
		const reqUrl = url + '/q.json?b=' + new Buffer(body).toString('base64')

		fetch(reqUrl)
		.then(function(resp) {
			if (resp.status !== 200) {
				cb(errors.ERR_BAD_HTTP)
				return
			} else {
				resp.json()
				.then(function(resp) {
					cb(resp.error, resp.result)
				})
				.catch(cb)
			}
		})
		.catch(cb)
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
					if (sort) {
						key = sort.prop
						if (sort.countryCode) key += ':COUNTRY'
					}

					v3Manifest.catalogs.push({ type: type, id: key })
				})
			})
		}

		if (resp.methods.indexOf('meta.get') !== -1)
			v3Manifest.resources.push('meta')

		if (resp.methods.indexOf('stream.find') !== -1)
			v3Manifest.resources.push('stream') 

		return v3Manifest
	}

	function remapCatalog(args)
	{
		// resource, type, id
		let id = args[2]
		let spl = id.split(':')
		let req = { query: { type: args[1] }, limit: 100 }

		if (spl[0] !== 'top') {
			// Just follows the convention set out by stremboard
			// L287 cffb94e4a9c57f5872e768eff25164b53f004a2b
			req.query.sort = { }
			req.query.sort[spl[0]] = -1
			req.query.sort['popularity'] = -1
		}
		if (spl[1]) req.countryCode = spl[1].toLowerCase()

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

	/*
	function remapSubs(args) 
	{
		// @TODO
		return req
	}*/

	// Examples
	//console.log(remapStream(['stream', 'channel', 'yt_id:UCaFoZFhV1LgbFIB3-6zdWVg:OLT7x6mpBq4']))
	//console.log(remapStream(['stream', 'series', 'tt0386676:1:1']))

	return this
}
