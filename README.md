# stremio-addon-client

Client library for using stremio addons (v3 protocol). You can read the actual protocol [here](https://github.com/Stremio/stremio-addons-sdk/blob/master/docs/protocol.md).

This can be used to make a UI to the stremio addons. It is currently used in the [Stremio desktop app](https://www.stremio.com), [mobile app](https://www.stremio.com) and [web app](https://app.strem.io).

## AddonClient

```javascript
const client = require('stremio-addon-client')
```

**NOTE**: All functions here can either return a `Promise` or be given a `callback(err, res)`

#### `client.detectFromURL(url)` - detects whether a URL is an addon, collection or neither and constructs the given object

If it detects an add-on: `{ addon: { /* AddonClient object */ } }`

If it detects a collection: `{ collection: { /* collection descriptor that can be loaded by colletion.load() */ } }`

If it detects neither, it will throw an exception (or return an error if using a callback): `errors.ERR_RESP_UNRECOGNIZED`

Please note, this will apply the `stremio-addon-linter` to lint both add-ons and collections. If the linting fails, the `err` will contain `lintResult` property with the exact output from the linter.



#### Instance of AddonClient 

##### `addon.get(resource, type, id)` - call the add-on with the given args 

##### `addon.getLatestManifest()` - returns the latest manifest

##### `addon.manifest` - the manifest of the add-on


### AddonClient Example

```javascript
client.detectFromURL('https://gateway.ipfs.io/ipfs/QmeZ431sbdzuqJppkiGMTucuZxwBH7CffQMtftkLDypBrg/manifest.json')
.then(function(resp) {
	return resp.addon.get('meta', 'movie', 'exmp:1')
})
.then(function(resp) {
	console.log(resp.meta)
})
```

## AddonCollection

```javascript
let col = new client.AddonCollection()
col.load(require('stremio-official-addons'))
```

`col.getAddons()` - get an array of all Add-ons, where each is an instance of `AddonClient`

`col.load()` - load from an object that describes all add-ons (format: `[{ manifest, transportUrl, transportName, flags }]`, i.e. `[AddonDescriptor]`)

`col.save()` - get the object that describes all add-ons (same format as `col.load()`)

`col.includes(addon)` - returns boolean, whether the add-on is in the collection

`col.add(addon)` - adds an addon (`AddonClient`) to a collection

`col.remove(addon)` - removes an addon (`AddonClient`) from the collection

`col.clone()` - creates a clone of the collection

### Universal save/load format (`[AddonDescriptor]`)

The format of the `.save()` and `.load()` functions is widely used across Stremio to describe a collection of add-ons.

It can also be used to distribute collections of add-ons as JSON files amongst users - similar to the Kodi add-on repositories.

The format is `[{ manifest, transportUrl, transportName, flags }]` (also referred to as `[AddonDescriptor]`), where `flags` is ignored by Stremio if loading an untrusted collection.

#### AddonDescriptor

`manifest` is a valid stremio addon v3 manifest

`transportUrl` is the URL to the add-on

`transportName` is the name of the transport

`flags` is used when Stremio is loading a trusted collection (a built-in collection) to flag add-ons as official or protected

## mapURL

`client.mapURL(URL1)` (returns a string, URL2) is a function that will convert URL1 to a more browser-friendly URL2. This just means forcing HTTPS, and changing `localhost` to `127.0.0.1` (CORS does not work on localhost). Since this is needed in a lot of places, we expose that function, and recommend that every URL obtained by user input is passed through it before becoming `transportUrl`


## Internal APIs

#### Transport

```javascript
let transport = new Transport(url)
transport.manifest(cb)
transport.get(args, cb)

// transport.name
```

**NOTE** - you can synchronously construct instances of `AddonClient` by using the constructor directly: `new AddonClient(manifest, transport, flags)`
