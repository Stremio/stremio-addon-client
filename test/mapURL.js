const mapURL = require('../lib/util/mapURL')

const tape = require('tape')

tape('does not touch non http URLs', function(t) {
	t.equal(mapURL('ipfs://test/'), 'ipfs://test/', 'does not change ipfs url')
	t.end()
})

tape('changes http to https', function(t) {
	t.equal(mapURL('http://test/'), 'https://test/', 'changes http to https')
	t.end()
})

tape('does not change http to https when it is local', function(t) {
	t.equal(mapURL('http://127.0.0.1/'), 'http://127.0.0.1/', 'url is not changed')
	t.end()
})

tape('changes localhost to 127.0.0.1', function(t) {
	t.equal(mapURL('http://localhost/'), 'http://127.0.0.1/', 'localhost is changed')
	t.end()
})