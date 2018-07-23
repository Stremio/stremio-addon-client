const url = require('url')

// maps add-on URL for usage in a web browser
// any user-input URL to manifest.json should be passed through this
// This is a generic utility that should be used in many places, since transportUrl is by default assumed to have passed through this 

module.exports = function mapURL(u) {
	var parsed = url.parse(u)

	if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
		// modern browsers have a cross-origin exception that works on 127... but not on localhost
		parsed.host = parsed.host.replace('localhost', '127.0.0.1')
	} else if (parsed.protocol === 'http:' || !parsed.protocol) {
		parsed.protocol = 'https:'
	}
	
	return url.format(parsed)
}
