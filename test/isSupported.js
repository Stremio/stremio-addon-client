var tape = require('tape')

var isSupported = require('../lib/util/isSupported')

tape('isSupported: checks for resource and types', function(t) {
	var m = { resources: ['meta', 'stream'], types: ['movie', 'channel'] }
	t.equal(isSupported(m, 'meta', 'movie', '1'), true, 'all match')
	t.equal(isSupported(m, 'stream', 'movie', '1'), true, 'all match - second resource')
	t.equal(isSupported(m, 'meta', 'channel', '1'), true, 'all match - second type')
	t.equal(isSupported(m, 'meta', 'series', '1'), false, 'type does not match')
	t.equal(isSupported(m, 'madeup', 'series', '1'), false, 'neither match')
	t.end()
})

tape('isSupported: checks for idPrefixes', function(t) {
	var m = { resources: [{ name: 'meta' }], types: ['movie'], idPrefixes: ['tt', 'yt_id:'] }

	t.equal(isSupported(m, 'meta', 'movie', '1'), false, 'does not match')
	t.equal(isSupported(m, 'meta', 'movie', 'tt1'), true, 'matches first prefix')
	t.equal(isSupported(m, 'meta', 'movie', 'yt_id:1'), true, 'matches second prefix')
	t.end()
})


tape('isSupported: resource-specific types', function(t) {
	var m = {
		resources: [
			{ name: 'stream', types: ['movie', 'series'], idPrefixes: ['tt'] },
			{ name: 'meta', types: ['other'], idPrefixes: ['local:'] }
		]
	}

	t.equal(isSupported(m, 'stream', 'movie', 'tt2'), true, 'stream-specific rules match')
	t.equal(isSupported(m, 'stream', 'other', 'local:2'), false, 'stream-specific rules do not match')

	t.equal(isSupported(m, 'meta', 'other', 'local:2'), true, 'meta-specific rules do match')
	t.equal(isSupported(m, 'meta', 'other', 'tt2'), false, 'meta-specific rules do not match')
	t.equal(isSupported(m, 'meta', 'movie', 'tt2'), false, 'meta-specific rules do not match')

	t.end()
})

tape('isSupported: special case: catalog', function(t) {
	var m = {
		catalogs: [
			{ id: 'top', type: 'movie' },
			{ id: 'top2', type: 'channel' }
		]
	}

	t.equal(isSupported(m, 'catalog', 'movie', 'top'), true, 'match catalog #1')
	t.equal(isSupported(m, 'catalog', 'channel', 'top2'), true, 'match catalog #2')
	t.equal(isSupported(m, 'catalog', 'channel', 'top'), false, 'anything else does not match')
	t.equal(isSupported(m, 'catalog', 'series', 'top'), false, 'anything else does not match')

	t.end()
})
