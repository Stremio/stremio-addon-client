var URL = require('url')
var fetch = require('node-fetch')
var linter = require('stremio-addon-linter')
var errors = require('./errors')
var AddonClient = require('./AddonClient')
var transports = require('./transports')
var promisify = require('./util/promisify')

var SUPPORTED_PROTOCOLS = [
	'ipfs:', 'ipns:',
	':', 'http:', 'https:' // those all represent http
]

function detectFromURL(url, cb) 
{
	// Detects what a URL is
	// possible outcomes: collection or addon (addons have 3 different transports)

	var parsed = URL.parse(url)

	if (SUPPORTED_PROTOCOLS.indexOf(parsed.protocol) === -1)
		return cb(errors.ERR_PROTOCOL)

	if (parsed.protocol === 'ipfs:' || parsed.protocol === 'ipns:') {
		constructFromTransport(new transports.ipfs(url), cb)
		return
	}

	var isManifest = parsed.pathname.endsWith('manifest.json')
	var isJSON = parsed.pathname.endsWith('.json')

	if (parsed.pathname.endsWith('/stremio/v1') || parsed.pathname.endsWith('/stremio/v1/stremioget')) {
		constructFromTransport(new transports.legacy(url), cb)
		return
	}
	
	fetch(url)
	.then(function(resp) {
		if (resp.status !== 200)
			return cb(errors.ERR_BAD_HTTP)

		var contentType = resp.headers.get('content-type')
		var isHeaderJSON = contentType && contentType.indexOf('application/json') !== -1

		var urlToManifest = resp.headers.get('x-stremio-addon')

		if (urlToManifest) {
			// Detected as an HTTP add-on
			constructFromTransport(new transports.http(urlToManifest), cb)
			return
		} else if (!(isHeaderJSON || isManifest || isJSON)) {
			// Guess it as a legacy add-on
			// @TODO as we're phasing out legacy addons, remove this guess
			constructFromTransport(new transports.legacy(url), cb)
			return
		}

		return resp.json().then(function(resp) {
			var lintResult
			var result

			// Detected as a collection
			if (Array.isArray(resp)) {
				lintResult = linter.lintCollection(resp)
				if (lintResult.valid) result = {
					collection: resp
				}
			}

			// Detected as an HTTP add-on
			if (isManifest && resp.id) {
				lintResult = linter.lintManifest(resp)
				if (lintResult.valid) result = {
					addon: new AddonClient(resp, new transports.http(url))
				}
			}

			// Create a copy of the error
			var err = Object.assign({ lintResult: lintResult }, errors.ERR_RESP_UNRECOGNIZED)
			
			if (lintResult && lintResult.valid) cb(null, result)
			else cb(err)
		})
	})
	.catch(cb)
}

function constructFromTransport(transport, cb)
{
	transport.manifest(function(err, manifest) {
		if (err) cb(err)
		else cb(null, { addon: new AddonClient(manifest, transport) })
	})
}

module.exports = promisify(detectFromURL)
