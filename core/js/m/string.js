/**
 * string functions
 *
 * usage:
 * - format
 * var msg = m.string.format('{errorMsg} in function {fn}. error code: {errorCode}.', {
 *     errorMsg: 'no data available',
 *     fn: 'getData',
 *     errorCode: 110
 * });
 */
m.createNamespace('m.string');

m.string = {
	format: function(str, replacements) {
		m.object.each(replacements, function(key, replacement) {
			str = str.replace(new RegExp('\\{' + key + '\\}', 'g'), replacement);
		});
		
		return str;
	}
};
