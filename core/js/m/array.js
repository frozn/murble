/**
 * array functions
 *
 * usage:
 * - each
 * var cities = ['Berlin', 'London', 'Paris'];
 *
 * m.array.each(cities, function(city, index) {
 *     alert('city: ' + city + ', index: ' + index);
 * });
 *
 * - equals
 * var arr1 = ['Berlin', 'London', 'Paris'],
 *     arr2 = ['Berlin', 'London', 'Madrid'],
 *     result = m.array.equals(arr1, arr2);
 *
 * if (result) {
 *     alert('arrays are equal');
 * }
 */
m.createNamespace('m.array');

m.array = {
    each: function (arr, fn, scope) {
        var arrClone = arr.slice(),
            i;

        for (i = 0; i < arr.length; i++) {
            if (fn.call(scope || arrClone[i], arrClone[i], i, arrClone) === false) {
                return i;
            }
        }

        return true;
    },
    equals: function (arr1, arr2) {
        if (arr1 === arr2) {
            return true;
        }

        if (arr1.length !== arr2.length) {
            return false;
        }

        var i;

        for (i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }
};
