/**
 * hex functions
 *
 * usage:
 * - byteArrayToString
 * var byteArr = [1, 2, 3, 4, 5, 128],
 *     str = m.util.hex.byteArrayToString(byteArr);
 *
 * - stringToByteArray
 * var str = '010203040580',
 *     byteArr = m.util.hex.stringToByteArray(str);
 */
m.createNamespace('m.util.hex');

m.util.hex = {
    byteArrayToString: function (arr) {
        var str = '';

        m.array.each(arr, function (byte) {
            str += ('0' + byte.toString(16)).slice(-2);
        });

        return str;
    },
    stringToByteArray: function (str) {
        var arr = [],
            i;

        for (i = 0; i < str.length; i += 2) {
            arr.push(parseInt(str.substr(i, 2), 16));
        }

        return arr;
    }
};

