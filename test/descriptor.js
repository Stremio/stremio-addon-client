var client = require('../')
var tape = require('tape')

var descriptor = {"manifest":{"id":"com.linvo.cinemeta","version":"2.4.0","description":"The official add-on for movie and series catalogs","name":"Cinemeta","resources":["catalog","meta"],"types":["movie","series"],"idPrefixes":["tt"],"catalogs":[{"type":"movie","id":"top","genres":["Action","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama","Family","Fantasy","Game-Show","History","Horror","Mystery","Romance","Sci-Fi","Sport","Thriller","War","Western"],"extraSupported":["search","genre","skip"]},{"type":"series","id":"top","genres":["Action","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama","Family","Fantasy","Game-Show","History","Horror","Mystery","Romance","Sci-Fi","Sport","Thriller","War","Western","Reality-TV","Talk-Show"],"extraSupported":["search","genre","skip"]}]},"transportName":"http","transportUrl":"https://v3-cinemeta.strem.io/manifest.json","flags":{"official":true,"protected":true}}

var addon

tape('can construct from descriptor', function(t) {
	addon = client.fromDescriptor(descriptor)
	t.ok(addon, 'has addon')
	t.ok(addon instanceof client.AddonClient, 'addon is AddonClient')
	t.end()
})

// @TODO: test error cases