//
// Map polyfill for for the XLSXBuilder QUnits in PhantomJS.
//
window.Map = window.Map || function() {
	var _keys = [];
	var _values = [];
	return Object.create({}, {
		has: {
			value: function(key) {
				return _keys.indexOf(key) > -1;
			}
		},
		get: {
			value: function(key) {
				var index = _keys.indexOf(key);
				return index > -1 ? _values[index] : undefined;
			}
		},
		size: {
			get: function() {
				return _keys.length;
			}
		},
		set: {
			value: function(key, val) {
				var index = _keys.indexOf(key);
				if (index > -1) {
					_values[index] = val;
				} else {
					_keys.push[key];
					_values.push[val];
				}
			}
		}
	});
}
