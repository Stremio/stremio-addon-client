var AddonCollection = require('../').AddonCollection

var tape = require('tape')

var colJSON
var col1

function getTestAddonCol() {
	// 3 addons: cinemeta, channels, watchhub
	// the flags on watchhub have been intentionally removed
	return [
		{"manifest":{"id":"com.linvo.cinemeta","version":"2.4.0","description":"The official add-on for movie and series catalogs","name":"Cinemeta","resources":["catalog","meta"],"types":["movie","series"],"idPrefixes":["tt"],"catalogs":[{"type":"movie","id":"top","genres":["Action","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama","Family","Fantasy","Game-Show","History","Horror","Mystery","Romance","Sci-Fi","Sport","Thriller","War","Western"],"extraSupported":["search","genre","skip"]},{"type":"series","id":"top","genres":["Action","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama","Family","Fantasy","Game-Show","History","Horror","Mystery","Romance","Sci-Fi","Sport","Thriller","War","Western","Reality-TV","Talk-Show"],"extraSupported":["search","genre","skip"]}]},"transportUrl":"https://v3-cinemeta.strem.io/manifest.json","flags":{"official":true,"protected":true}},
		{"manifest":{"id":"com.linvo.stremiochannels","version":"1.26.0","description":"Watch your favourite YouTube channels ad-free and get notified when they upload new videos.","name":"YouTube","resources":["catalog","meta"],"types":["channel"],"idPrefixes":["yt_id:"],"catalogs":[{"type":"channel","id":"top","genres":["Animation","Automotive","Beauty & Fashion","Causes & Non-profits","Comedy","Cooking & Health","Film & Entertainment","From TV","Gaming","Lifestyle","Music","News & Politics","Sports"],"extraSupported":["search","genre","skip"]},{"type":"channel","id":"videos","extraRequired":["search"],"extraSupported":["search"]}]},"transportUrl":"https://v3-channels.strem.io/manifest.json","flags":{"official":true}},
		{"manifest":{"id":"org.stremio.guidebox","version":"1.13.5","name":"WatchHub","description":"Find where to stream your favorite movies and shows amongst iTunes, Hulu, Amazon and other UK/US services.","contactEmail":"office@strem.io","logo":"http://www.strem.io/images/watchhub-logo.png","resources":["stream"],"types":["movie","series"],"catalogs":[{"type":"movie","id":"popularities.guidebox_free","name":"FREE"}],"idPrefixes":["guidebox_id:","tt"]},"transportUrl":"https://watchhub.strem.io/stremioget/stremio/v1"}
	]
}


tape('can initialize a collection', function(t) {
	var col = new AddonCollection()
	t.ok(col, 'has object')
	t.ok(Array.isArray(col.save()), 'get [AddonDescriptor]')
	t.ok(Array.isArray(col.getAddons()), 'get [AddonClient]')


	col.load(getTestAddonCol())
	t.ok(Array.isArray(col.save()), 'get [AddonDescriptor] after the load')
	t.equals(col.getAddons().length, getTestAddonCol().length, '.load() worked')


	colJSON = JSON.stringify(col.save())
	col1 = col

	t.end()
})

tape('can load a collection', function(t) {
	var col = new AddonCollection()
	col.load(JSON.parse(colJSON))

	var getM = function(x) { return x.manifest }
	t.deepEquals(col.getAddons().map(getM), col1.getAddons().map(getM), 'loaded collection has same add-ons')
	t.end()
})

tape('can clone a collection', function(t) {
	var col1 = new AddonCollection()
	col1.load(JSON.parse(colJSON))

	var col2 = col1.clone()

	var getM = function(x) { return x.manifest }
	t.deepEquals(col1.getAddons().map(getM), col2.getAddons().map(getM), 'loaded collection has same add-ons')
	t.end()
})


// @TODO .includes, .add, .remove
