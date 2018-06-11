## Using the core modules

To build a basic stremio client, you need to use `stremio-addon-client`, `stremio-official-addons` and `stremio-aggregators`

This is an example:

```javascript
const client = require('stremio-addon-client')
const officialAddons = require('stremio-official-addons')
const aggregators = require('stremio-aggregators')

const col = new client.AddonCollection()

// Load official add-ons
col.load(officialAddons)

// Create an aggregator to get all rows
const aggr = new aggregators.Catalogs(col.addons)

aggr.run()

// Each time 'updated' is emitted you should re-fresh the view
aggr.evs.on('updated', function() {
	// iterate through aggr.results
	// each result is a row of items that you have to display
	aggr.results.forEach(function(result) {
		console.log(result)
		// each object in result.response.metas is an item that you have to display
		//if (result.response && result.response.metas)
	})

})

```