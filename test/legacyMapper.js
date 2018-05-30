var tape = require('tape')

var mapper = require('../lib/transports/legacy/mapper')

tape('legacyMapper: stream with imdb_id', function(t) {
	var req = mapper.mapRequest(['stream', 'movie', 'tt23141'])

	t.equals(req.method, 'stream.find')
	t.equals(req.params[0], null)
	t.deepEqual(req.params[1], { query: { imdb_id: 'tt23141', type: 'movie' } }, 'query is ok') 
	t.end()
})

tape('legacyMapper: stream with yt_id', function(t) {
	var req = mapper.mapRequest(['stream', 'channel', 'yt_id:99889'])

	t.equals(req.method, 'stream.find')
	t.equals(req.params[0], null)
	t.deepEqual(req.params[1], { query: { yt_id: '99889', type: 'channel' } }, 'query is ok') 
	t.end()
})

tape('legacyMapper: meta', function(t) {
	var req = mapper.mapRequest(['meta', 'movie', 'tt23141'])

	t.equals(req.method, 'meta.get')
	t.equals(req.params[0], null)
	t.deepEqual(req.params[1], { query:{ imdb_id: 'tt23141' } }, 'query is ok') 
	t.end()
})


