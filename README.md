# stremio-addons-client

Client library for using stremio addons (v3 protocol). You can read the actual protocol [here](https://github.com/Stremio/stremio-addons-sdk/blob/master/docs/protocol.md).

## Using an add-on

```
const AddonClient = require('stremio-addons').AddonClient

// .detectFromURL() will construct an add-on (or repo) from url

//const client = new AddonClient(manifest, transport)

client.get('stream', 'movie', 'tt')
// client.get(resource, type, id)
```

All functions can either take `cb` at the end or will return a promise

## Internal APIs

#### Transport

```
let transport = new Transport(url)
transport.manifest(cb)
transport.get(args, cb)
```
