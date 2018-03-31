#!/usr/bin/env node

const AddonClient = require('../lib/client')
const errors = require('../lib/errors')

const tape = require('tape')

tape('detectFromURL: detect and use cinemeta LEGACY URL and work', function(t) {
	let addon

	AddonClient.detectFromURL('https://cinemeta.strem.io/stremio/v1')
	.then(function(resp) {
		t.ok(resp, 'has response')
		t.ok(resp.addon, 'has addon')
		t.ok(resp.addon.manifest.catalogs, 'has catalogs')
		t.ok(resp.addon.manifest.catalogs.length, 'has catalogs length')

		addon = resp.addon
	
		return addon.get('catalog', 'movie', 'top')
	})
	.then(function(resp) {
		let metas = resp.metas
		t.ok(Array.isArray(metas), 'resp is an array')
		
		return addon.get('meta', 'movie', 'tt0816692')
	})
	.then(function(resp) {
		t.ok(resp.meta, '.meta returned')
		t.ok(resp.meta.fanart, 'response has fanart')
		t.end()
	})
	.catch(function(err) {
		t.error(err, 'error')
		t.end()
	})
})
