/**
 * create namespace
 *
 * usage:
 * m.createNamespace('m.math.gf8');
 *
 * m.math.gf8 = ...
 */
var m = m || {};

m.global = this;

m.createNamespace = function (namespace) {
    var root = m.global,
        parts = namespace.split('.'),
        i;

    for (i = 0; i < parts.length; i++) {
        var part = parts[i];

        if (!root[part]) {
            root[part] = {};
        }

        root = root[part];
    }
};
