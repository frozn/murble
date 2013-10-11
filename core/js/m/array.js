/**
 * array functions
 */
m.createNamespace('m.array')

m.array = {
	each: function(arr, fn, scope) {
		var arrClone = arr.slice(),
			i;
		
		for (i = 0; i < arr.length; i++) {
			if (fn.call(scope || arrClone[i], arrClone[i], i, arrClone) === false) {
				return i;
			}
		}

		return true;
	}
};
