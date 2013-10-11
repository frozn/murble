/**
 * string functions
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
