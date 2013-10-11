/**
 * object functions
 *
 * usage:
 * - each
 * var cities = {
 *     de: 'Berlin',
 *     en: 'London',
 *     fr: 'Paris'
 * };
 *
 * m.object.each(cities, function(country, city) {
 *     alert('country: ' + country + ', city: ' + city);
 * });
 */
m.createNamespace('m.object');

m.object = {
    each: function (obj, fn, scope) {
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
