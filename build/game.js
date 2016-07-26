'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _res = require('./res');

var R = _interopRequireWildcard(_res);

var _figure = require('./figure');

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tetris = function () {

	var instance = null;

	var _current = null;
	var _next = null;

	var Tetris = function () {
		function Tetris(canvas) {
			var _this = this;

			_classCallCheck(this, Tetris);

			this.stage = new createjs.Stage(canvas);
			this.stage.snapToPixelEnabled = true;

			this.figures = [];

			this.setupGUI();
			this.bindEvents();

			this.next = _figure2.default.getInstance().produce();
			this.current = _figure2.default.getInstance().produce();

			this.stage.update();

			createjs.Ticker.setInterval(1000);
			createjs.Ticker.on("tick", function (event) {
				return _this.tick(event);
			});
		}

		_createClass(Tetris, [{
			key: 'setupGUI',
			value: function setupGUI() {
				//todo: add text labels, buttons, etc

				var rect = new createjs.Shape();
				rect.graphics.beginFill(R.colors.GRAY).drawRect(this.fieldWidth, 0, this.sidebarWidth, this.height);
				this.stage.addChild(rect);

				//this.stage.cache(this.fieldWidth, 0, this.width - this.fieldWidth, this.height);
			}
		}, {
			key: 'bindEvents',
			value: function bindEvents() {
				var _this2 = this;

				document.onkeydown = function (e) {
					return _this2.handleKeyDown(e);
				};
			}
		}, {
			key: 'handleKeyDown',
			value: function handleKeyDown(event) {
				event = event || window.event;

				switch (event.keyCode) {
					case R.keys.UP:
						this.current.rotate();
						break;

					case R.keys.LEFT:
						this.current.x -= R.dimen.BLOCK;
						break;

					case R.keys.RIGHT:
						this.current.x += R.dimen.BLOCK;
						break;

					case R.keys.DOWN:
						this.moveDown();
						break;
				}

				this.stage.update();
			}
		}, {
			key: 'tick',
			value: function tick(event) {
				this.moveDown();

				this.stage.update(event);
			}
		}, {
			key: 'moveDown',
			value: function moveDown() {
				this.current.y += R.dimen.BLOCK;

				var bounds = this.current.getBounds();
				var d = this.current.rotation / 90 % 2 == 0 ? bounds.height : bounds.width;

				if (this.current.y >= this.height - d + 1) {
					this.current.y = this.height - d + 1;
					this.current = this.next;
					this.next = _figure2.default.getInstance().produce();
				}
			}
		}, {
			key: 'height',
			get: function get() {
				return this.stage.canvas.height;
			}
		}, {
			key: 'width',
			get: function get() {
				return this.stage.canvas.width;
			}
		}, {
			key: 'fieldWidth',
			get: function get() {
				return R.dimen.FIELD_W * R.dimen.BLOCK;
			}
		}, {
			key: 'sidebarWidth',
			get: function get() {
				return this.width - this.fieldWidth;
			}
		}, {
			key: 'current',
			set: function set(figure) {
				figure.x = this.fieldWidth / 2 - 1;
				figure.y = 0;

				this.figures.push(figure);
				this.stage.addChild(figure);

				_current = figure;
			},
			get: function get() {
				return _current;
			}
		}, {
			key: 'next',
			set: function set(figure) {
				figure.x = this.fieldWidth + this.sidebarWidth / 2;
				figure.y = 100;
				this.stage.addChild(figure);

				_next = figure;
			},
			get: function get() {
				return _next;
			}
		}], [{
			key: 'start',
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