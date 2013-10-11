$(document).ready(function () {
    // aes-256 encrypt test vectors
    // from: http://csrc.nist.gov/groups/STM/cavp/documents/aes/KAT_AES.zip
    // all test cases from "ECBKeySbox256.rsp" used
    var testAes256Encrypt = function (testVectors) {
        m.array.each(testVectors, function (testVector) {
            var key = m.util.hex.stringToByteArray(testVector.key),
                plainText = m.util.hex.stringToByteArray(testVector.plainText),
                aes256 = new m.cipher.aes256(key),
                cipherText = aes256.encrypt(plainText),
                cipherTextSpecification = m.util.hex.stringToByteArray(testVector.cipherTextSpecification);

            $('body').append($('<div>', {
                class: 'pre',
                html: m.string.format('aes-256 encrypt test vectors: [<span class="{result}">{result}</span>], input: [key: {key}, plain text: {plainText}], expected: [{cipherTextSpecification}], returned: [{cipherText}]', {
                    result: m.array.equals(cipherText, cipherTextSpecification) ? 'ok' : 'error',
                    key: m.util.hex.byteArrayToString(key),
                    plainText: m.util.hex.byteArrayToString(plainText),
                    cipherTextSpecification: m.util.hex.byteArrayToString(cipherTextSpecification),
                    cipherText: m.util.hex.byteArrayToString(cipherText)
                })
            }));
        });
    };

    testAes256Encrypt([{
            key: 'c47b0294dbbbee0fec4757f22ffeee3587ca4730c3d33b691df38bab076bc558',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '46f2fb342d6f0ab477476fc501242c5f'
        }, {
            key: '28d46cffa158533194214a91e712fc2b45b518076675affd910edeca5f41ac64',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '4bf3b0a69aeb6657794f2901b1440ad4'
        }, {
            key: 'c1cc358b449909a19436cfbb3f852ef8bcb5ed12ac7058325f56e6099aab1a1c',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '352065272169abf9856843927d0674fd'
        }, {
            key: '984ca75f4ee8d706f46c2d98c0bf4a45f5b00d791c2dfeb191b5ed8e420fd627',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '4307456a9e67813b452e15fa8fffe398'
        }, {
            key: 'b43d08a447ac8609baadae4ff12918b9f68fc1653f1269222f123981ded7a92f',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '4663446607354989477a5c6f0f007ef4'
        }, {
            key: '1d85a181b54cde51f0e098095b2962fdc93b51fe9b88602b3f54130bf76a5bd9',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '531c2c38344578b84d50b3c917bbb6e1'
        }, {
            key: 'dc0eba1f2232a7879ded34ed8428eeb8769b056bbaf8ad77cb65c3541430b4cf',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: 'fc6aec906323480005c58e7e1ab004ad'
        }, {
            key: 'f8be9ba615c5a952cabbca24f68f8593039624d524c816acda2c9183bd917cb9',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: 'a3944b95ca0b52043584ef02151926a8'
        }, {
            key: '797f8b3d176dac5b7e34a2d539c4ef367a16f8635f6264737591c5c07bf57a3e',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: 'a74289fe73a4c123ca189ea1e1b49ad5'
        }, {
            key: '6838d40caf927749c13f0329d331f448e202c73ef52c5f73a37ca635d4c47707',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: 'b91d4ea4488644b56cf0812fa7fcf5fc'
        }, {
            key: 'ccd1bc3c659cd3c59bc437484e3c5c724441da8d6e90ce556cd57d0752663bbc',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '304f81ab61a80c2e743b94d5002a126b'
        }, {
            key: '13428b5e4c005e0636dd338405d173ab135dec2a25c22c5df0722d69dcc43887',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '649a71545378c783e368c9ade7114f6c'
        }, {
            key: '07eb03a08d291d1b07408bf3512ab40c91097ac77461aad4bb859647f74f00ee',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '47cb030da2ab051dfc6c4bf6910d12bb'
        }, {
            key: '90143ae20cd78c5d8ebdd6cb9dc1762427a96c78c639bccc41a61424564eafe1',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '798c7c005dee432b2c8ea5dfa381ecc3'
        }, {
            key: 'b7a5794d52737475d53d5a377200849be0260a67a2b22ced8bbef12882270d07',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '637c31dc2591a07636f646b72daabbe7'
        }, {
            key: 'fca02f3d5011cfc5c1e23165d413a049d4526a991827424d896fe3435e0bf68e',
            plainText: '00000000000000000000000000000000',
            cipherTextSpecification: '179a49c712154bbffbe6e7a84a18e220'
    }]);

    // aes-256 decrypt test vectors
    // from: http://csrc.nist.gov/groups/STM/cavp/documents/aes/KAT_AES.zip
    // all test cases from "ECBKeySbox256.rsp" used
    var testAes256Decrypt = function (testVectors) {
        m.array.each(testVectors, function (testVector) {
            var key = m.util.hex.stringToByteArray(testVector.key),
                cipherText = m.util.hex.stringToByteArray(testVector.cipherText),
                aes256 = new m.cipher.aes256(key),
                plainText = aes256.decrypt(cipherText),
                plainTextSpecification = m.util.hex.stringToByteArray(testVector.plainTextSpecification);

            $('body').append($('<div>', {
                class: 'pre',
                html: m.string.format('aes-256 decrypt test vectors: [<span class="{result}">{result}</span>], input: [key: {key}, cipher text: {cipherText}], expected: [{plainTextSpecification}], returned: [{plainText}]', {
                    result: m.array.equals(plainText, plainTextSpecification) ? 'ok' : 'error',
                    key: m.util.hex.byteArrayToString(key),
                    cipherText: m.util.hex.byteArrayToString(cipherText),
                    plainTextSpecification: m.util.hex.byteArrayToString(plainTextSpecification),
                    plainText: m.util.hex.byteArrayToString(plainText)
                })
            }));
        });
    }

    testAes256Decrypt([{
            key: 'c47b0294dbbbee0fec4757f22ffeee3587ca4730c3d33b691df38bab076bc558',
            cipherText: '46f2fb342d6f0ab477476fc501242c5f',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: '28d46cffa158533194214a91e712fc2b45b518076675affd910edeca5f41ac64',
            cipherText: '4bf3b0a69aeb6657794f2901b1440ad4',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: 'c1cc358b449909a19436cfbb3f852ef8bcb5ed12ac7058325f56e6099aab1a1c',
            cipherText: '352065272169abf9856843927d0674fd',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: '984ca75f4ee8d706f46c2d98c0bf4a45f5b00d791c2dfeb191b5ed8e420fd627',
            cipherText: '4307456a9e67813b452e15fa8fffe398',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: 'b43d08a447ac8609baadae4ff12918b9f68fc1653f1269222f123981ded7a92f',
            cipherText: '4663446607354989477a5c6f0f007ef4',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: '1d85a181b54cde51f0e098095b2962fdc93b51fe9b88602b3f54130bf76a5bd9',
            cipherText: '531c2c38344578b84d50b3c917bbb6e1',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: 'dc0eba1f2232a7879ded34ed8428eeb8769b056bbaf8ad77cb65c3541430b4cf',
            cipherText: 'fc6aec906323480005c58e7e1ab004ad',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: 'f8be9ba615c5a952cabbca24f68f8593039624d524c816acda2c9183bd917cb9',
            cipherText: 'a3944b95ca0b52043584ef02151926a8',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: '797f8b3d176dac5b7e34a2d539c4ef367a16f8635f6264737591c5c07bf57a3e',
            cipherText: 'a74289fe73a4c123ca189ea1e1b49ad5',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: '6838d40caf927749c13f0329d331f448e202c73ef52c5f73a37ca635d4c47707',
            cipherText: 'b91d4ea4488644b56cf0812fa7fcf5fc',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: 'ccd1bc3c659cd3c59bc437484e3c5c724441da8d6e90ce556cd57d0752663bbc',
            cipherText: '304f81ab61a80c2e743b94d5002a126b',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: '13428b5e4c005e0636dd338405d173ab135dec2a25c22c5df0722d69dcc43887',
            cipherText: '649a71545378c783e368c9ade7114f6c',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: '07eb03a08d291d1b07408bf3512ab40c91097ac77461aad4bb859647f74f00ee',
            cipherText: '47cb030da2ab051dfc6c4bf6910d12bb',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: '90143ae20cd78c5d8ebdd6cb9dc1762427a96c78c639bccc41a61424564eafe1',
            cipherText: '798c7c005dee432b2c8ea5dfa381ecc3',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: 'b7a5794d52737475d53d5a377200849be0260a67a2b22ced8bbef12882270d07',
            cipherText: '637c31dc2591a07636f646b72daabbe7',
            plainTextSpecification: '00000000000000000000000000000000'
        }, {
            key: 'fca02f3d5011cfc5c1e23165d413a049d4526a991827424d896fe3435e0bf68e',
            cipherText: '179a49c712154bbffbe6e7a84a18e220',
            plainTextSpecification: '00000000000000000000000000000000'
    }]);
});
