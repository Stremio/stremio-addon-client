#!/usr/bin/env node

const client = require('../lib/client')

const errors = require('../lib/errors')

const tape = require('tape')

const exampleAddonHash = 'QmP8Y9GwHnvj3nFuENKHiNa2oCv1ZUGjTSPr3oqtR5J7gD'

tape('detectFromURL: invalid protocol', function(t) {
	client.detectFromURL('ftp://cinemeta.strem.io', function(err, res) {
		t.equals(err, errors.ERR_PROTOCOL, 'err is the right type')
		t.notOk(res, 'no response')
		t.end()
	})
})

tape('detectFromURL: legacy protocol', function(t) {
	// https://cinemeta.strem.io/stremioget/stremio/v1/q.json?b=eyJwYXJhbXMiOltdLCJtZXRob2QiOiJtZXRhIiwiaWQiOjEsImpzb25ycGMiOiIyLjAifQ==
	client.detectFromURL('https://cinemeta.strem.io/stremioget/stremio/v1', function(err, res) {
		t.error(err, 'no error from detectFromURL')
		t.ok(res.addon, 'addon is ok')
		t.ok(res.addon.manifest, 'manifest is ok')
		t.deepEqual(res.addon.manifest.catalogs, [{ type: 'series', id: 'top', name: null }, { type: 'movie', id: 'top', name: null }], 'catalogs is right')
		t.deepEqual(res.addon.manifest.resources, ['meta'], 'resources is right')
		t.deepEqual(res.addon.manifest.idPrefixes, ['tt'], 'idPrefixes is right')

		let cat = res.addon.manifest.catalogs[0]
		res.addon.get('catalog', cat.type, cat.id, function(err, resp) {
			t.error(err, 'no error from catalog')
			t.ok(resp, 'has response')
			t.ok(Array.isArray(resp.metas), 'response is an array')
			t.ok(resp.metas.length === 100, 'response is full length')

			res.addon.get('meta', resp.metas[0].type, resp.metas[0].imdb_id, function(err, resp) {
				t.error(err, 'no error from meta')

				t.ok(resp.meta, 'has meta')

				t.end()
			})
		})
	})
})

tape('detectFromURL: http transport: detect and use manifest.json URL', function(t) {
	// const ipfsURL = 'https://gateway.ipfs.io/ipfs/'+exampleAddonHash+'/manifest.json'
	const ipfsURL = 'http://localhost:8080/ipfs/'+exampleAddonHash+'/manifest.json'
	const ipnsURL = 'https://gateway.ipfs.io/ipns/QmYRaTC2DqsgXaRUJzGFagLy725v1QyYwt66kvpifPosgj/manifest.json'

	let addon
	client.detectFromURL(ipfsURL)
	.then(function(res) {
		t.ok(res.addon, 'addon is ok')
		t.ok(res.addon.manifest, 'manifest is ok')
		t.deepEqual(res.addon.manifest.catalogs, ['top'], 'catalogs is right')
		t.deepEqual(res.addon.manifest.resources, ['meta', 'stream'], 'resources is right')

		addon = res.addon

		return addon.get('catalog', 'movie', 'top')
	})
	.then(function(resp) {
		t.ok(resp && Array.isArray(resp.metas), 'response is an array')

		return addon.get('meta', resp.metas[0].type, resp.metas[0].id)
	})
	.then(function(resp) {
		t.ok(resp.meta.id, 'meta has id')

		return addon.get('stream', resp.meta.type, resp.meta.id)
	})
	.then(function(resp) {
		t.ok(Array.isArray(resp.streams), 'streams is array')
		t.equal(resp.streams.length, 2, 'streams is right length')
		t.end()
	})
	.catch(function(err) {
		t.error(err, 'no error')
		t.end()
	})
})

// Extra args
tape('extra args: http transport (IPFS gateway)', function(t) {
	// const ipfsURL = 'https://gateway.ipfs.io/ipfs/'+exampleAddonHash+'/manifest.json'
	const ipfsURL = 'http://localhost:8080/ipfs/'+exampleAddonHash+'/manifest.json'

	let addon
	client.detectFromURL(ipfsURL)
	.then(function(res) {
		t.ok(res.addon, 'addon is ok')
		return res.addon.get('catalog', 'movie', 'top', { search: 'the office' })
	})
	.then(function(res) {
		t.ok('has extra')
		t.equal(res.extra.search, 'the office', 'search arg works')
		t.end()
	})
	.catch(function(err) {
		t.error(err, 'extra args err')
		t.end()
	})
})

// Extra args
tape('extra args: ipfs transport', function(t) {
	const ipfsURL = 'ipfs://'+exampleAddonHash+'/manifest.json'
	const ipnsURL = 'ipns://QmYRaTC2DqsgXaRUJzGFagLy725v1QyYwt66kvpifPosgj/manifest.json'

	let addon
	client.detectFromURL(ipfsURL)
	.then(function(res) {
		t.ok(res.addon, 'addon is ok')
		return res.addon.get('catalog', 'movie', 'top', { search: 'the office' })
	})
	.then(function(res) {
		t.ok('has extra')
		t.equal(res.extra.search, 'the office', 'search arg works')
		t.end()
	})
	.catch(function(err) {
		t.error(err, 'extra args err')
		t.end()
	})
})

tape('detectFromURL: IPFS: detect and use manifest.json URL', function(t) {
	const ipfsURL = 'ipfs://'+exampleAddonHash+'/manifest.json'
	const ipnsURL = 'ipns://QmYRaTC2DqsgXaRUJzGFagLy725v1QyYwt66kvpifPosgj/manifest.json'

	let addon

	client.detectFromURL(ipfsURL)
	.then(function(res) {
		t.ok(res.addon, 'addon is ok')
		t.ok(res.addon.manifest, 'manifest is ok')
		t.deepEqual(res.addon.manifest.catalogs, ['top'], 'catalogs is right')
		t.deepEqual(res.addon.manifest.resources, ['meta', 'stream'], 'resources is right')

		addon = res.addon

		return addon.get('catalog', 'movie', 'top')
	})
	.then(function(resp) {
		t.ok(Array.isArray(resp.metas), 'response is an array')
		return addon.get('meta', resp.metas[0].type, resp.metas[0].id)
	})
	.then(function(resp) {
		t.ok(resp.meta.id, 'meta has id')

		return addon.get('stream', 'movie', parseInt(Math.random()*1000))
	})
	.then(function(resp) {
		console.log(resp)
		// IPFS addons need to be destroyed in order to allow the proc to exit
		addon.destroy(function() { t.end() })
	})
	.catch(function(err) {
		t.error(err, 'no error')

		// IPFS addons need to be destroyed in order to allow the proc to exit
		if (addon) addon.destroy(function() { t.end() })
		else t.end()
	})
})


// @TODO: detectFromURL: not recognized json response (ERR_RESP_UNRECOGNIZED)

// @TODO: detectFromURL: linked to a landing page with x-stremio-addon

// @TODO: detectFromURL: linked directly to manifest.json

// @TODO: detectFromURL: .get() in http transport: 404 and etc. handled accordingly

// @TODO: collections, save and load
