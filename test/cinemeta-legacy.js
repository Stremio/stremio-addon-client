#!/usr/bin/env node

const AddonClient = require('../lib/client')

const tape = require('tape')

let addon
tape('detectFromURL: detect and use cinemeta LEGACY URL and work', function(t) {
	AddonClient.detectFromURL('https://cinemeta.strem.io/stremio/v1')
	.then(function(resp) {
		t.ok(resp, 'has response')
		t.ok(resp.addon, 'has addon')
		t.ok(resp.addon.manifest.catalogs, 'has catalogs')
		t.ok(resp.addon.manifest.catalogs.length, 'has catalogs length')

		addon = resp.addon

		t.end()
	})
})

tape('can get catalog/movie/top', function(t) {
	return addon.get('catalog', 'movie', 'top')
	.then(function(resp) {
		let metas = resp.metas
		t.ok(Array.isArray(metas), 'resp is an array')
		t.end()		
	})
})

tape('can get meta/movie/{id}', function(t) {
	return addon.get('meta', 'movie', 'tt0816692')
	.then(function(resp) {
		t.ok(resp.meta, '.meta returned')
		t.end()
	})
})