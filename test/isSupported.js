var tape = require('tape')

var isSupported = require('../lib/util/isSupported')

tape('isSupported: checks for resource and types', function(t) {
	var m = { resources: ['catalog', 'stream'], types: ['movie', 'channel'] }
	t.equal(isSupported(m, 'catalog', 'movie', '1'), true, 'all match')
	t.equal(isSupported(m, 'stream', 'movie', '1'), true, 'all match - second resource')
	t.equal(isSupported(m, 'catalog', 'channel', '1'), true, 'all match - second type')
	t.equal(isSupported(m, 'meta', 'movie', '1'), false, 'resource does not match')
	t.equal(isSupported(m, 'catalog', 'series', '1'), false, 'type does not match')
	t.equal(isSupported(m, 'meta', 'series', '1'), false, 'neither match')
	t.end()
})

tape('isSupported: checks for idPrefixes', function(t) {
	var m = { resources: ['catalog'], types: ['movie'], idPrefixes: ['tt', 'yt_id:'] }

	t.equal(isSupported(m, 'catalog', 'movie', '1'), false, 'does not match')
	t.equal(isSupported(m, 'catalog', 'movie', 'tt1'), true, 'matches first prefix')
	t.equal(isSupported(m, 'catalog', 'movie', 'yt_id:1'), true, 'matches second prefix')
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