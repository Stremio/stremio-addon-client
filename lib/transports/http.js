var fetch = require('node-fetch')
var http = require('http')
var https = require('https')
var errors = require('../errors')
var stringifyRequest = require('../stringifyRequest')
var URL = require('url')
var HTTP_PROTOCOLS = [':', 'http:', 'https:']

function httpTransport(url)
{
	var KEEP_ALIVE_MSECS = 5000
	var httpAgent = new http.Agent({ keepAlive: true, keepAliveMsecs: KEEP_ALIVE_MSECS })
	var httpsAgent = new https.Agent({ keepAlive: true, keepAliveMsecs: KEEP_ALIVE_MSECS })
	var fetchAgent = function(parsedUrl) {
		if (parsedUrl.protocol == 'http:') {
			return httpAgent;
		} else {
			return httpsAgent;
		}
	}

	// url should point to manifest.json 
	this.url = url

	this.manifest = function(cb) 
	{
		req(url, cb)
	}

	this.get = function(args, cb)
	{
		if (!url.endsWith('/manifest.json')) throw new Error('url must end in manifest.json')
		var reqUrl = url.replace('/manifest.json', stringifyRequest(args))
		req(reqUrl, cb)
	}

	function req(url, cb)
	{
		fetch(url, { agent: fetchAgent })
		.then(function(resp) {
			const cachingInfo = { cacheControl: resp.headers.get('cache-control') }
			if (resp.status === 404) {
				cb(errors.ERR_NOT_FOUND)
				return
			}
			if (resp.status !== 200) {
				cb(errors.ERR_BAD_HTTP)
				return
			}

			resp.json()
			.then(function(resp) { cb(null, resp, cachingInfo) })
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
