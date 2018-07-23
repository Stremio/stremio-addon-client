const URL = require('url')

module.exports = function mapURL(u) {
	var parsed = url.parse(u)

	if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
		// modern browsers have a cross-origin exception that works on 127... but not on localhost
		parsed.host = parsed.host.replace('localhost', '127.0.0.1')
	} else {
		parsed.protocol = 'https:'
	}
	
	return url.format(parsed)
}
