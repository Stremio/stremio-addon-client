# stremio-addon-client

Client library for using stremio addons (v3 protocol). You can read the actual protocol [here](https://github.com/Stremio/stremio-addons-sdk/blob/master/docs/protocol.md).

This can be used to make a UI to the stremio addons. It is currently used in the [Stremio desktop app](https://www.stremio.com), [mobile app](https://www.stremio.com) and [web app](https://app.strem.io).

## Using an add-on

```javascript
const AddonClient = require('stremio-addon-client')
```

**NOTE**: All functions here can either return a `Promise` or be given a `callback(err, res)`

#### `AddonClient.detectFromURL(url)` - detects whether a URL is an addon, collection or neither and constructs the given object

If it detects an add-on: `{ addon: { /* AddonClient object */ } }`

If it detects a collection: `{ collection: { /* collection descriptor that can be loaded by colletion.load() */ } }`

If it detects neither, it will throw an exception (or return an error if using a callback): `errors.ERR_RESP_UNRECOGNIZED`


#### `AddonClient.constructFromManifest(manifest, transportName, flags)`

`manifest` is a valid add-on manifest

`transportName` is the name of the used transport, such as `legacy`, `http` or `ipfs`. Needs to be consistent with `manifest.url`

`flags` is an arbitrary object in case you want any additional information about the add-on when you're adding it, such as where it was added from, whether it is official (`official`) or whether it's protected (`protected`)

Returns an `{ addon, fetchNewManifest }` where `addon` is an instance of `AddonClient` constructed from the passed manifest object, and `fetchNewManifest` is a function to fetch the latest manifest from the transport


#### Instance of AddonClient 

##### `addon.get(resource, type, id)` - call the add-on with the given args 

##### `addon.manifest` - the manifest of the add-on


## Example

```javascript
AddonClient.detectFromURL('https://gateway.ipfs.io/ipfs/QmeZ431sbdzuqJppkiGMTucuZxwBH7CffQMtftkLDypBrg/manifest.json')
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
let promises = col.load(require('stremio-official-addons'))

// Catch errors on trying to update the manifests for those add-ons
promises.forEach(function(p) {
    p.catch(function(err) { console.error(err) })
})
```

`col.addons` - array of all Add-ons, where each is an instance of `AddonClient`

`col.load()` - load from an object that describes all add-ons (format: `[{ manifest, transportUrl, transportName, flags }]`)

`col.save()` - get the object that describes all add-ons (same format as `col.load()`)

`col.includes(addon)` - returns boolean, whether the add-on is in the collection

`col.add(addon)` - adds an addon to a collection

`col.remove(addon)` - removes an addon from the collection

`col.clone()` - creates a clone of the collection

### Universal save/load format

The format of the `.save()` and `.load()` functions is widely used across Stremio to describe a collection of add-ons.

It can also be used to distribute collections of add-ons as JSON files amongst users - similar to the Kodi add-on repositories.

The format is `[{ manifest, transportUrl, transportName, flags }]`, where `flags` is ignored by Stremio if loading an untrusted collection.

`manifest` is a valid stremio addon v3 manifest

`transportUrl` is the URL to the add-on

`transportName` is the name of the transport

`flags` is used when Stremio is loading a trusted collection (a built-in collection) to flag add-ons as official or protected

## Internal APIs

#### Transport

```javascript
let transport = new Transport(url)
transport.manifest(cb)
transport.get(args, cb)

// transport.name
```

**NOTE** - you can synchronously construct instances of `AddonClient` by using the constructor directly: `new AddonClient(manifest, transport, flags)`
