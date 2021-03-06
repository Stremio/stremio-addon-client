var fetch = require('node-fetch')
var errors = require('../../errors')

var mapper = require('./mapper')

var URL = require('url')
var HTTP_PROTOCOLS = [':', 'http:', 'https:']

// Legacy add-on adapter
// Makes legacy add-ons magically work with the new API
// This is very ugly but a necessary evil

function legacyTransport(url)
{
	this.url = url
	
	this.manifest = function(cb) 
	{
		jsonRPCRequest('meta', [], function(err, resp) {
			if (err)
				return cb(err)

			var v3Manifest
			var error

			cb(null, mapper.mapManifest(resp))
		})
	}

	this.get = function(args, cb) 
	{
		if (args.length < 3)
			return cb(errors.ERR_UNSUPPORTED_ARGS)

		var request = mapper.mapRequest(args)
		if (!request)
			return cb(errors.ERR_UNSUPPORTED_RESOURCE)

		jsonRPCRequest(request.method, request.params, request.wrapper(cb))
	}

	function jsonRPCRequest(method, params, cb)
	{
		var body = JSON.stringify({ params: params, method: method, id: 1, jsonrpc: '2.0' })
		var reqUrl = url + '/q.json?b=' + Buffer.from(body).toString('base64')

		fetch(reqUrl)
		.then(function(resp) {
			const cachingInfo = { cacheControl: resp.headers.get('cache-control') }
			if (resp.status !== 200) {
				cb(errors.ERR_BAD_HTTP)
				return
			} else {
				resp.json()
				.then(function(resp) {
					cb(resp.error, resp.result, cachingInfo)
				})
				.catch(cb)
			}
		})
		.catch(cb)
	}

	return this
}

legacyTransport.isValidURL = function(url) {
	var parsed = URL.parse(url)
	return HTTP_PROTOCOLS.includes(parsed.protocol)
		&& (parsed.pathname.endsWith('/stremio/v1') || parsed.pathname.endsWith('/stremio/v1/stremioget'))
}
module.exports = legacyTransport
