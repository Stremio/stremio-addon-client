var fetch = require('node-fetch')
var errors = require('../errors')
var qs = require('querystring')
var URL = require('url')
var HTTP_PROTOCOLS = [':', 'http:', 'https:']

function httpTransport(url)
{
	// url should point to manifest.json 

	this.url = url

	this.manifest = function(cb) 
	{
		req(url, cb)
	}

	this.get = function(args, cb)
	{
		if (args.length !== 3 && args.length !== 4) throw new Error('incorrect args length')
		if (args.length === 4 && !isNotEmptyObject(args[3])) args = args.slice(0, 3)
		if (!url.endsWith('/manifest.json')) throw new Error('url must end in manifest.json')
		var reqUrl = url.replace('/manifest.json', '/'+args.map(mapArg).join('/')+'.json')
		req(reqUrl, cb)
	}

	function isNotEmptyObject(arg) {
		return typeof(arg) === 'object' && arg && Object.keys(arg).length > 0
	}

	function mapArg(arg) {
		if (isNotEmptyObject(arg)) return qs.encode(arg)
		return encodeURIComponent(arg)
	}

	function req(url, cb)
	{
		fetch(url)
		.then(function(resp) { 
			if (resp.status === 404) {
				cb(errors.ERR_NOT_FOUND)
				return
			}
			if (resp.status !== 200) {
				cb(errors.ERR_BAD_HTTP)
				return
			}

			resp.json()
			.then(function(resp) { cb(null, resp) })
			.catch(cb)
		})
		.catch(cb)
	}

	return this
}

httpTransport.isValidURL = function(url) {
	var parsed = URL.parse(url)
	return HTTP_PROTOCOLS.includes(parsed.protocol) && parsed.pathname.endsWith('/manifest.json')
}

module.exports = httpTransport
