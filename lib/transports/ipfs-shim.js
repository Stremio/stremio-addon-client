var httpTransport = require('./http')

module.exports = function ipfsShimTransport(url)
{
	var IPFS_GATEWAY = 'https://gateway.ipfs.io/ipfs/'
	var IPNS_GATEWAY = 'https://gateway.ipfs.io/ipns/'

	var httpUrl = url
		.replace('ipfs://', IPFS_GATEWAY)
		.replace('ipns://', IPNS_GATEWAY)

	httpTransport.call(this, httpUrl)

	// this is important: override the transport name/url so we don't default to http when we persist the add-on
	this.name = 'ipfs'
	this.url = url

	return this
}