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
 *
 * - toCharCodeArray
 * var charCodeArr = m.string.toCharCodeArray(str);
 *
 * - fromCharCodeArray
 * var str = m.string.fromCharCodeArray(charCodeArr);
 */
m.createNamespace('m.string');

m.string = {
    format: function (str, replacements) {
        m.object.each(replacements, function (key, replacement) {
            str = str.replace(new RegExp('\\{' + key + '\\}', 'g'), replacement);
        });

        return str;
    },
    toCharCodeArray: function (str) {
        var arr = [],
            i;

        for (i = 0; i < str.length; i++) {
            arr.push(str.charCodeAt(i));
        }

        return arr;
    },
    fromCharCodeArray: function(arr) {
        var str = '',
            i;

        for (i = 0; i < arr.length; i++) {
            str += String.fromCharCode(arr[i]);
        }

        return str;
    }
};
