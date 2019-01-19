var fetch = require('node-fetch')
var errors = require('../errors')
var qs = require('querystring')

function httpTransport(url)
{
	// url should point to manifest.json 

	this.name = 'http'
	this.url = url

	this.manifest = function(cb) 
	{
		req(url, cb)
	}

	this.get = function(args, cb)
	{
		var reqUrl = url.replace('/manifest.json', '/'+args.map(mapArg).join('/')+'.json')
		req(reqUrl, cb)
	}

	function mapArg(arg) {
		if (typeof(arg) === 'object') return qs.encode(arg)
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

module.exports = httpTransport
