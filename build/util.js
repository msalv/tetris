'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
	function Util() {
		_classCallCheck(this, Util);
	}

	_createClass(Util, null, [{
		key: 'random',
		value: function random(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}, {
		key: 'str_pad',
		value: function str_pad(str, pad, num) {
			str = '' + str;
			var s = Array(num + 1).join(pad);
			return s.substring(0, s.length - str.length) + str;
		}
	}, {
		key: 'storageAvailable',
		value: function storageAvailable(type) {
			try {
				var storage = window[type],
				    x = '__storage_test__';
				storage.setItem(x, x);
				storage.removeItem(x);
				return true;
			} catch (e) {
				return false;
			}
		}
	}]);

	return Util;
}();

exports.default = Util;