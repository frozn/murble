/**
 * galois field 2^8 functions
 *
 * usage:
 * - multiply
 * var result = m.math.gf8.multiply(a, b);
 *
 * - divide
 * var result = m.math.gf8.divide(a, b);
 */
m.createNamespace('m.math.gf8');

m.math.gf8 = (function() {
	var gmul8 = function(a, b) {
			var p = 0,
				i;
			
			for (i = 0; i < 8; i++) {
				if (b & 0x01) {
					p ^= a;
				}
				
				a <<= 1;
				b >>= 1;
				
				if (a & 0x0100) {
					a ^= 0x011B;
				}
			}
			
			return p;
		},
		exp = [],
		log = [],
		x = 1,
		i;

	// compute log/exp tables for fast gmul8
	for (i = 0; i < 256; i++) {
		log[x] = i;
		exp[i] = x;
		x = gmul8(x, 3);
	}
	
	// return functions
	return {
		divide: function(a, b) {
			if (a && b) {
				return exp[(log[a] - log[b]) % 0xFF];
			} else {
				return 0;
			}
		},
		multiply: function(a, b) {
			if (a && b) {
				return exp[(log[a] + log[b]) % 0xFF];
			} else {
				return 0;
			}
		}
	};
})();
