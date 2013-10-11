/**
 * object functions
 */
m.createNamespace('m.object');

m.object = {
	each: function(obj, fn, scope) {
        var property;

		for (property in obj) {
			if (obj.hasOwnProperty(property)) {
				if (fn.call(scope || obj, property, obj[property], obj) === false) {
					return;
				}
			}
		}
	}
};
