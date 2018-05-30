var tape = require('tape')

var mapper = require('../lib/transports/legacy/mapper')

tape('legacyMapper: stream with imdb_id', function(t) {
	var req = mapper.mapRequest(['stream', 'movie', 'tt23141'])

	t.equals(req.method, 'stream.find')
	t.equals(req.params[0], null)
	t.deepEqual(req.params[1], { query: { imdb_id: 'tt23141', type: 'movie' } }, 'query is ok') 
	t.end()
})


tape('legacyMapper: stream with imdb_id, season, episode', function(t) {
	var req = mapper.mapRequest(['stream', 'series', 'tt23141:2:5'])

	t.equals(req.method, 'stream.find')
	t.equals(req.params[0], null)
	t.deepEqual(req.params[1], { query: { imdb_id: 'tt23141', type: 'series', season: 2, episode: 5 } }, 'query is ok') 
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


tape('legacyMapper: subtitles', function(t) {
	var req = mapper.mapRequest(['subtitles', 'movie', 'testHash', { videoName: 'testTag', videoSize: 3250739325, videoId: 'tt7026672:1:2' }])

	t.equals(req.method, 'subtitles.find')
	t.equals(req.params[0], null)

	t.deepEqual(req.params[1], {
		supportsZip: true, 
		query: {
			videoHash: 'testHash',
			itemHash: 'tt7026672 1 2',
			videoSize: 3250739325,
			videoName: 'testTag',
		},
	}, 'params is ok') 
	t.end()
})
// @TODO: manifest
// @TODO: UC... special youtube case
// @TODO: catalogs, sort logic specifics
// @TODO: catalogs - genre filters and etc.