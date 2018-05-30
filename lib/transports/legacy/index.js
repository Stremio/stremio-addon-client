const fetch = require('node-fetch')
const errors = require('../../errors')

const mapper = require('./mapper')

// Legacy add-on adapter
// Makes legacy add-ons magically work with the new API
// This is very ugly but a necessary evil

// @TODO subtitles

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

	return this
}
