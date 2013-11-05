/**
 * base64 functions
 *
 * usage:
 * - encode data
 * var str = m.codec.base64.encode(data);
 *
 * - decode string
 * var data = new m.codec.base64.decode(str);
 */
m.createNamespace('m.codec.base64');

m.codec.base64 = (function () {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    return {
        encode: function (data) { // array of bytes
            var buffer = [],
                i;

            for (i = 0; i < data.length; i += 3) {
                var value = data[i] << 16 | data[i + 1] << 8 | data[i + 2];

                buffer.push(b64.charAt(value >> 18), b64.charAt(value >> 12 & 0x3F), b64.charAt(value >> 6 & 0x3F), b64.charAt(value & 0x3F));
            }

            // consider padding
            var dataLengthMod3 = data.length % 3,
                paddingBytes = dataLengthMod3 << 1 & 0x02 | dataLengthMod3 >> 1 & 0x01;

            for (i = 0; i < paddingBytes; i++) {
                buffer.pop();
            }

            for (i = 0; i < paddingBytes; i++) {
                buffer.push('=');
            }

            return buffer.join('');
        },
        decode: function (str) {
            var data = [],
                i;

            for (i = 0; i < str.length; i += 4) {
                var value = b64.indexOf(str.charAt(i)) << 18 | b64.indexOf(str.charAt(i + 1)) << 12 | (b64.indexOf(str.charAt(i + 2)) & 0x3F) << 6 | b64.indexOf(str.charAt(i + 3)) & 0x3F;

                data.push(value >> 16, value >> 8 & 0xFF, value & 0xFF);
            }

            // remove padding
            for (i = str.length - 2; i < str.length; i++) {
                if (str.charAt(i) == '=') {
                    data.pop();
                }
            }

            return data;
        }
    };
})();
