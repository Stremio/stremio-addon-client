# stremio-addons-client

Client library for using stremio addons (v3 protocol). You can read the actual protocol [here](https://github.com/Stremio/stremio-addons-sdk/blob/master/docs/protocol.md).

## Using an add-on

```javascript
const AddonClient = require('stremio-addons').AddonClient
```

**NOTE**: All async functions can either return a `Promise` or be given a `callback(err, res)`

#### `AddonClient.detectFromURL(url)` - detects whether a URL is an addon, repository or neither and constructs the given object

If it detects an add-on: `{ addon: { /* AddonClient object */ } }`

If it detects a repo: `{ repository: { /* repo object */ } }`

If it detects neither, it will throw an exception (or return an error if using a callback): `errors.ERR_RESP_UNRECOGNIZED`


#### `new AddonClient(manifest, transport)` - synchronously returns an instance of `AddonClient`

#### `addon.get(resource, type, id)` - call the add-on with the given args 

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

## Internal APIs

#### Transport

```javascript
let transport = new Transport(url)
transport.manifest(cb)
transport.get(args, cb)
```
