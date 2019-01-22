var httpTransport = require('./http')
var URL = require('url')
function ipfsShimTransport(url)
{
	var IPFS_GATEWAY = 'https://gateway.ipfs.io/ipfs/'
	var IPNS_GATEWAY = 'https://gateway.ipfs.io/ipns/'

	var httpUrl = url
		.replace('ipfs://', IPFS_GATEWAY)
		.replace('ipns://', IPNS_GATEWAY)

	httpTransport.call(this, httpUrl)

	// this is important: override the transport url so we don't default to http when we persist the add-on
	this.url = url

	return this
}
ipfsShimTransport.isValidURL = function(url) {
        var parsed = URL.parse(url)
        return parsed.protocol === 'ipfs:' || parsed.protocol === 'ipns:'
}
module.exports = ipfsShimTransport
