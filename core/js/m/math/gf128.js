/**
 * galois field 2^128 functions
 *
 * usage:
 * - multiply
 * var result = m.math.gf128.multiply(a, b);
 *
 * - fast multiply with fixed factor
 * var fixedFactorGmul128 = new m.math.gf128.createFixedFactorMultiplication(fixedFactor),
 *     result = fixedFactorGmul128.multiply(a);
 *
 * the fixed factor can be changed:
 * fixedFactorGmul128.setFixedFactor(fixedFactor);
 */
m.createNamespace('m.math.gf128');

m.math.gf128 = {
    multiply: function(a, b) { // 128bit = arrays with 16 bytes, standard multiplication without fixed factor.
        var z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            v = b.slice(),
            i, j;

        for (i = 0; i < 128; i++) {
            if (a[i >> 3] & 0x01 << 7 - (i & 0x07)) {
                for (j = 0; j < 16; j++) {
                    z[j] ^= v[j];
                }
            }

            var lsb_v = v[15] & 0x01;

            for (j = 15; j > -1; j--) {
                v[j] = (v[j] >> 1 | v[j - 1] << 7) & 0xFF;
            }

            if (lsb_v) {
                v[0] ^= 0xE1;
            }
        }

        return z;
    },
    createFixedFactorMultiplication: function(fixedFactor) { // 128bit = array with 16 bytes
        var m;

        this.multiply = function(a) { // 128bit = array with 16 bytes
            var z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                i, j;

            for (i = 0; i < 16; i++) {
                for (j = 0; j < 16; j++) {
                    z[i] ^= m[j][a[j]][i];
                }
            }

            return z;
        };

        this.setFixedFactor = function(fixedFactor) { // 128bit = array with 16 bytes
            // init m table
            var i, j;

            m = [];

            for (i = 0; i < 16; i++) {
                m[i] = [];
                m[i][0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                for (j = 1; j < 256; j++) {
                    m[i][j] = [];
                }
            }

            // compute m table for fast gmul128
            var v = fixedFactor.slice(),
                k, l;

            for (i = 0; i < 128; i++) {
                m[i >> 3][0x01 << 7 - (i & 0x07)] = v.slice();

                var lsb_v = v[15] & 0x01;

                for (j = 15; j > -1; j--) {
                    v[j] = (v[j] >> 1 | v[j - 1] << 7) & 0xFF;
                }

                if (lsb_v) {
                    v[0] ^= 0xE1;
                }
            }

            for (i = 0; i < 16; i++) {
                for (j = 2; j < 256; j <<= 1) {
                    for (k = 1; k < j; k++) {
                        for (l = 0; l < 16; l++) {
                            m[i][j | k][l] = m[i][j][l] ^ m[i][k][l];
                        }
                    }
                }
            }
        };

        // set fixed factor
        this.setFixedFactor(fixedFactor);
    }
};
