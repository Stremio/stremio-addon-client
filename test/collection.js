const collection = require('../lib/collection')

const tape = require('tape')

tape('can initialize a collection', function(t) {
	let col = new collection.AddonCollection()
	t.ok(col, 'has object')
	t.end()
})

// collection is properly de-duplicated

// collection can be persisted and restored