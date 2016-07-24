"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _figure = require("./figure");

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tetris = function () {

	var instance = null;

	var Tetris = function () {
		function Tetris(canvas) {
			_classCallCheck(this, Tetris);

			this.stage = new createjs.Stage(canvas);

			createjs.Ticker.on("tick", this.tick);
		}

		_createClass(Tetris, [{
			key: "tick",
			value: function tick() {
				// todo: some logic
				//this.stage.update();
			}
		}, {
			key: "height",
			get: function get() {
				return this.stage.canvas.height;
			}
		}, {
			key: "width",
			get: function get() {
				return this.stage.canvas.width;
			}
		}], [{
			key: "start",
			value: function start(canvas) {
				if (instance === null) {
					instance = new Tetris(canvas);
				}
				return instance;
			}
		}]);

		return Tetris;
	}();

	return Tetris;
}();

global.Tetris = Tetris;