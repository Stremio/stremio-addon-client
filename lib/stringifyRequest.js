var qs = require('querystring')

function stringifyRequest(args) {
	if (args.length !== 3 && args.length !== 4) throw new Error('incorrect args length')
	if (args.length === 4 && !isNotEmptyObject(args[3])) args = args.slice(0, 3)
	return '/'+args.map(mapArg).join('/')+'.json'
	
}

function isNotEmptyObject(arg) {
	return typeof(arg) === 'object' && arg && Object.keys(arg).length > 0
}

function mapArg(arg) {
	if (isNotEmptyObject(arg)) return qs.encode(arg)
	return encodeURIComponent(arg)
}

module.exports = stringifyRequest
