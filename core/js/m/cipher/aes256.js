/**
 * aes-256 functions
 *
 * usage:
 * - encrypt one block (128bit = array with 16 bytes)
 * var aes256 = new m.cipher.aes256(key),
 *     encryptedData = aes256.encrypt(data);
 *
 * - decrypt one block (128bit = array with 16 bytes)
 * var aes256 = new m.cipher.aes256(key),
 *     decryptedData = aes256.decrypt(data);
 *
 * the key can be changed:
 * aes.setKey(key);
 */
m.createNamespace('m.cipher.aes256');

m.cipher.aes256 = (function () {
    var sboxEnc = [],
        sboxDec = [];

    // compute sbox
    var i;

    for (i = 0; i < 256; i++) {
        var s = x = m.math.gf8.divide(1, i),
            j;

        for (j = 0; j < 4; j++) {
            s = (s << 1 | s >> 7) & 0xFF;
            x ^= s;
        }

        x ^= 0x63;

        sboxEnc[i] = x;
        sboxDec[x] = i;
    }

    // return constructor
    return function (key) { // 256bit = array with 32 bytes
        var rkey = [],
            block = [],
            expandKey = function (key) { // 256bit = array with 32 bytes
                var rcon = 1,
                    i;

                rkey = key.slice();

                for (i = 32; i < 240; i++) {
                    var colInRoundKey = i >> 2 & 0x07;

                    rkey[i] = rkey[i - 32];

                    if (colInRoundKey == 0) {
                        // first column
                        var row = i & 0x03;

                        switch (row) {
                            case 0:
                                rkey[i] ^= rcon;
                                rcon = rcon << 1 ^ (rcon >> 7) * 0x011B;

                            case 1:
                            case 2:
                                rkey[i] ^= sboxEnc[rkey[i - 3]];
                                break;

                            case 3:
                                rkey[i] ^= sboxEnc[rkey[i - 7]];
                                break;
                        }
                    } else if (colInRoundKey == 4) {
                        // fifth column
                        rkey[i] ^= sboxEnc[rkey[i - 4]];
                    } else {
                        // other columns
                        rkey[i] ^= rkey[i - 4];
                    }
                }
            },
            addRoundKey = function (roundNumber) {
                var i;

                for (i = 0; i < 16; i++) {
                    block[i] ^= rkey[roundNumber << 4 | i];
                }
            },
            subBytes = function () {
                var i;

                for (i = 0; i < 16; i++) {
                    block[i] = sboxEnc[block[i]];
                }
            },
            invSubBytes = function () {
                var i;

                for (i = 0; i < 16; i++) {
                    block[i] = sboxDec[block[i]];
                }
            },
            shiftRows = function () {
                var tmp;

                // shift 2nd row one step left
                tmp = block[1];
                block[1] = block[5];
                block[5] = block[9];
                block[9] = block[13];
                block[13] = tmp;

                // shift 3rd row two steps left
                tmp = block[2];
                block[2] = block[10];
                block[10] = tmp;

                tmp = block[6];
                block[6] = block[14];
                block[14] = tmp;

                // shift 4th row three steps left
                tmp = block[3];
                block[3] = block[15];
                block[15] = block[11];
                block[11] = block[7];
                block[7] = tmp;
            },
            invShiftRows = function () {
                var tmp;

                // shift 2nd row one step right
                tmp = block[13];
                block[13] = block[9];
                block[9] = block[5];
                block[5] = block[1];
                block[1] = tmp;

                // shift 3rd row two steps right
                tmp = block[10];
                block[10] = block[2];
                block[2] = tmp;

                tmp = block[14];
                block[14] = block[6];
                block[6] = tmp;

                // shift 4th row three steps right
                tmp = block[7];
                block[7] = block[11];
                block[11] = block[15];
                block[15] = block[3];
                block[3] = tmp;
            },
            mixColumns = function () {
                var mathGf8 = m.math.gf8,
                    i;

                for (i = 0; i < 16; i += 4) {
                    var colValues = block.slice(i, i + 4);

					block[i]     = mathGf8.multiply(colValues[0], 2) ^ mathGf8.multiply(colValues[1], 3) ^ colValues[2]                      ^ colValues[3];
					block[i + 1] = colValues[0]                      ^ mathGf8.multiply(colValues[1], 2) ^ mathGf8.multiply(colValues[2], 3) ^ colValues[3];
					block[i + 2] = colValues[0]                      ^ colValues[1]                      ^ mathGf8.multiply(colValues[2], 2) ^ mathGf8.multiply(colValues[3], 3);
					block[i + 3] = mathGf8.multiply(colValues[0], 3) ^ colValues[1]                      ^ colValues[2]                      ^ mathGf8.multiply(colValues[3], 2);
                }
            },
            invMixColumns = function () {
                var mathGf8 = m.math.gf8,
                    i;

                for (i = 0; i < 16; i += 4) {
                    var colValues = block.slice(i, i + 4);

					block[i]     = mathGf8.multiply(colValues[0], 14) ^ mathGf8.multiply(colValues[1], 11) ^ mathGf8.multiply(colValues[2], 13) ^ mathGf8.multiply(colValues[3], 9);
					block[i + 1] = mathGf8.multiply(colValues[0], 9)  ^ mathGf8.multiply(colValues[1], 14) ^ mathGf8.multiply(colValues[2], 11) ^ mathGf8.multiply(colValues[3], 13);
					block[i + 2] = mathGf8.multiply(colValues[0], 13) ^ mathGf8.multiply(colValues[1], 9)  ^ mathGf8.multiply(colValues[2], 14) ^ mathGf8.multiply(colValues[3], 11);
					block[i + 3] = mathGf8.multiply(colValues[0], 11) ^ mathGf8.multiply(colValues[1], 13) ^ mathGf8.multiply(colValues[2], 9)  ^ mathGf8.multiply(colValues[3], 14);
                }
            };

        this.encrypt = function (data) { // 128bit = array with 16 bytes
            // set block
            block = data.slice();

            // initial round
            addRoundKey(0);

            // rounds
            var round;

            for (round = 1; round < 15; round++) {
                subBytes();
                shiftRows();

                // no mixColumns in last round
                if (round < 14) {
                    mixColumns();
                }

                addRoundKey(round);
            }

            return block;
        };

        this.decrypt = function (data) { // 128bit = array with 16 bytes
            // set block
            block = data.slice();

            // rounds
            var round;

            for (round = 14; round > 0; round--) {
                addRoundKey(round);

                // no invMixColumns in first round
                if (round < 14) {
                    invMixColumns();
                }

                invShiftRows();
                invSubBytes();
            }

            // last round
            addRoundKey(0);

            return block;
        };

        this.setKey = function (key) { // 256bit = array with 32 bytes
            // expand key to compute round keys
            expandKey(key);
        };

        // set key
        this.setKey(key);
    };
})();
