const collection = require('../lib/collection')

const tape = require('tape')

tape('can initialize a collection', function(t) {
	let col = new collection.AddonCollection()
	t.ok(col, 'has object')
	t.end()
})

// @TODO .includes, .add, .remove

// @TODO collection can be persisted and restored