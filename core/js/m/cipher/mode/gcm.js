/**
 * gcm functions
 *
 * usage:
 * - encrypt data
 * var gcm = new m.cipher.mode.gcm(key, iv),
 *     encryptedData = gcm.encrypt(data, authenticationData);
 *
 * encryptedData:
 * {
 *     cipherText: <array>,
 *     authenticationTag: <array>
 * }
 *
 * - decrypt data
 * var gcm = new m.cipher.mode.gcm(key, iv),
 *     decryptedData = gcm.decrypt(data, authenticationData, authenticationTag);
 *
 * the key can be changed:
 * gcm.setKey(key);
 *
 * the iv can be changed:
 * gcm.setIv(iv);
 */
m.createNamespace('m.cipher.mode.gcm');

m.cipher.mode.gcm = function (key, newIv) { // key = 256bit = array with 32 bytes, newIv = 128bit = array with 16 bytes
    var checkLengths = function (data, authenticationData) {
            if (ctrUsed + data.length > 0xFFFFFFFE) { // max. 4GB (consider +1 for init authentication)
                throw 'ctr limit reached';
            }

            if (authenticationData.length > 0xFFFFFFFF) { // max. 4GB
                throw 'can\'t deal with 4GB or more authentication data';
            }
        },
        incCtr = function () {
            var i;

            for (i = 15; i > 11; i--) {
                ctr[i] = ctr[i] + 1 & 0xFF;

                if (ctr[i] != 0) {
                    break;
                }
            }

            ctrUsed++;
        },
        initAuthenticationTagAndCounter = function (authenticationData) {
            s0 = ghash([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], authenticationData);

            if (ctrUsed == 0) {
                var ivBitLength = iv.length << 3;

                j0 = ghash([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], iv);
                j0 = ghash(j0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ivBitLength >> 8 & 0xFF, ivBitLength & 0xFF]); // only for unitTest and benchmark. iv length should be 0, 128.
                ctr = j0.slice();
                ctrUsed++;
            } else {
                incCtr();
                j0 = ctr.slice();
            }
        },
        encryptAndDecryptData = function (data) {
            var buffer = [],
                i, j;

            for (i = 0; i < data.length; i += 16) {
                incCtr();

                var encryptedCtr = aes256.encrypt(ctr),
                    dataBlock = data.slice(i, i + 16);

                for (j = 0; j < 16; j++) {
                    buffer.push(encryptedCtr[j] ^ dataBlock[j]);
                }
            }

            // remove unnecessary bytes
            var unnecessaryBytes = -data.length & 0x0F; // unnecessaryBytes = (16 - data.length % 16) % 16

            for (i = 0; i < unnecessaryBytes; i++) {
                buffer.pop();
            }

            return buffer;
        },
        computeFinalAuthenticationTagBlock = function (cipherTextData, authenticationData, authenticationTagData) {
            var buffer = authenticationTagData.slice(),
                authenticationDataBitLength = authenticationData.length << 3,
                cipherTextDataBitLength = cipherTextData.length << 3;

            buffer = ghash(buffer, [
                0, 0, 0, 0, authenticationDataBitLength >>> 24, authenticationDataBitLength >> 16 & 0xFF, authenticationDataBitLength >> 8 & 0xFF, authenticationDataBitLength & 0xFF,
                0, 0, 0, 0, cipherTextDataBitLength >>> 24, cipherTextDataBitLength >> 16 & 0xFF, cipherTextDataBitLength >> 8 & 0xFF, cipherTextDataBitLength & 0xFF
            ]);

            var encryptedJ0 = aes256.encrypt(j0),
                i;

            for (i = 0; i < 16; i++) {
                buffer[i] ^= encryptedJ0[i];
            }

            return buffer;
        },
        ghash = function (y0, data) { // y0 = 128bit = array with 16 bytes, data = x bytes
            var yi = y0.slice(),
                i, j;

            for (i = 0; i < data.length; i += 16) {
                for (j = 0; j < 16; j++) {
                    yi[j] ^= data[i | j];
                }

                yi = mathGf128.multiply(yi);
            }

            return yi;
        },
        aes256, iv, h, ctr, ctrUsed, mathGf128, j0, s0;

    this.encrypt = function (plainTextData, authenticationData) { // arrays of bytes
        // check lengths
        checkLengths(plainTextData, authenticationData);

        // init authenticationTag and counter
        initAuthenticationTagAndCounter(authenticationData);

        // encrypt plainText
        var cipherTextData = encryptAndDecryptData(plainTextData);

        // compute authenticationTag
        var authenticationTagData = ghash(s0, cipherTextData);

        // compute final authenticationTag block
        authenticationTagData = computeFinalAuthenticationTagBlock(cipherTextData, authenticationData, authenticationTagData);

        return {
            cipherText: cipherTextData,
            authenticationTag: authenticationTagData
        };
    };

    this.decrypt = function (cipherTextData, authenticationData, authenticationTagSpecificationData) { // 2x arrays of bytes, authenticationTagSpecificationData = 128bit = array with 16 bytes
        // check lengths
        checkLengths(cipherTextData, authenticationData);

        // init authenticationTag and counter
        initAuthenticationTagAndCounter(authenticationData);

        // compute authenticationTag
        var authenticationTagData = ghash(s0, cipherTextData);

        // compute final authenticationTag block
        authenticationTagData = computeFinalAuthenticationTagBlock(cipherTextData, authenticationData, authenticationTagData);

        // check if tag matches
        if (!m.array.equals(authenticationTagData, authenticationTagSpecificationData)) {
            throw 'tag doesn\'t match';
        }

        // decrypt cipherText
        var plainTextData = encryptAndDecryptData(cipherTextData);

        return plainTextData;
    };

    this.setKey = function (key) { // 256bit = array with 32 bytes
        if (typeof aes256 === 'undefined') {
            aes256 = new m.cipher.aes256(key);
        } else {
            aes256.setKey(key);
        }

        h = aes256.encrypt([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        if (typeof mathGf128 === 'undefined') {
            mathGf128 = new m.math.gf128.createFixedFactorMultiplication(h);
        } else {
            mathGf128.setFixedFactor(h);
        }
    };

    this.setIv = function (newIv) { // 128bit = array with 16 bytes
        iv = newIv.slice();
        ctrUsed = 0;
    };

    // set key
    this.setKey(key);

    // set iv
    this.setIv(newIv);
};
