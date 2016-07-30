(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _get = function get(object, property, receiver) {
	if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
		var parent = Object.getPrototypeOf(object);if (parent === null) {
			return undefined;
		} else {
			return get(parent, property, receiver);
		}
	} else if ("value" in desc) {
		return desc.value;
	} else {
		var getter = desc.get;if (getter === undefined) {
			return undefined;
		}return getter.call(receiver);
	}
};

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _res = require('./res');

var R = _interopRequireWildcard(_res);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _interopRequireWildcard(obj) {
	if (obj && obj.__esModule) {
		return obj;
	} else {
		var newObj = {};if (obj != null) {
			for (var key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
			}
		}newObj.default = obj;return newObj;
	}
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Block = function () {
	var Block = function (_createjs$Shape) {
		_inherits(Block, _createjs$Shape);

		function Block(color) {
			_classCallCheck(this, Block);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Block).call(this));

			_this.color = color;
			_this.setup();
			return _this;
		}

		_createClass(Block, [{
			key: 'setup',
			value: function setup() {
				this.graphics.clear().setStrokeStyle(R.dimen.STROKE).beginStroke(R.colors.BLACK).beginFill(this.color).drawRect(R.dimen.STROKE, R.dimen.STROKE, R.dimen.BLOCK, R.dimen.BLOCK);

				this.setBounds(R.dimen.STROKE, R.dimen.STROKE, R.dimen.BLOCK, R.dimen.BLOCK);
			}
		}, {
			key: 'center',
			get: function get() {
				var b = this.getBounds();
				return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
			}
		}]);

		return Block;
	}(createjs.Shape);

	return createjs.promote(Block, "Shape");
}();

var Figure = function () {
	var Figure = function (_createjs$Container) {
		_inherits(Figure, _createjs$Container);

		function Figure(color) {
			_classCallCheck(this, Figure);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Figure).call(this));

			_this2.color = color;
			_this2.velocity = 0;
			_this2.coords = [];
			_this2.regXY = [];
			return _this2;
		}

		_createClass(Figure, [{
			key: 'tick',
			value: function tick(event) {}
		}, {
			key: 'setup',
			value: function setup() {
				for (var i = 0; i < this.coords.length; ++i) {
					var block = new Block(this.color);
					block.set(this.coords[i]);

					this.addChild(block);
				}

				this.snapToPixel = true;

				var _getBounds$pad = this.getBounds().pad(R.dimen.STROKE, R.dimen.STROKE, R.dimen.STROKE, R.dimen.STROKE);

				var x = _getBounds$pad.x;
				var y = _getBounds$pad.y;
				var width = _getBounds$pad.width;
				var height = _getBounds$pad.height;

				this.regXY = [{ regX: 0, regY: 0 }, { regX: 0, regY: height }, { regX: width, regY: height }, { regX: width, regY: 0 }];

				this.cache(x, y, width, height); // overrides bounds as well
			}
		}, {
			key: 'updateReg',
			value: function updateReg() {
				var i = this.rotation / 90;
				if (this.scaleX < 0) {
					i = this.regXY.length - 1 - i;
				}
				this.set(this.regXY[i]);
			}
		}, {
			key: 'flip',
			value: function flip() {
				this.scaleX = -this.scaleX;

				this.updateReg();
				this.updateCache();
			}
		}, {
			key: 'rotate',
			value: function rotate() {
				var clockwise = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

				var degree = clockwise ? 90 : -90;
				var rotation = this.rotation + degree;

				this.rotation = rotation >= 360 ? 0 : rotation < 0 ? 270 : rotation;

				this.updateReg();
				this.updateCache();
			}
		}, {
			key: 'width',
			get: function get() {
				var bounds = this.getBounds();
				return this.rotation / 90 % 2 == 0 ? bounds.width : bounds.height;
			}
		}, {
			key: 'height',
			get: function get() {
				var bounds = this.getBounds();
				return this.rotation / 90 % 2 == 0 ? bounds.height : bounds.width;
			}
		}]);

		return Figure;
	}(createjs.Container);

	return createjs.promote(Figure, "Container");
}();

var SquareFigure = function (_Figure) {
	_inherits(SquareFigure, _Figure);

	function SquareFigure(color) {
		_classCallCheck(this, SquareFigure);

		var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(SquareFigure).call(this, color));

		_this3.coords = [{ x: 0, y: 0 }, { x: R.dimen.BLOCK, y: 0 }, { x: 0, y: R.dimen.BLOCK }, { x: R.dimen.BLOCK, y: R.dimen.BLOCK }];
		_get(Object.getPrototypeOf(SquareFigure.prototype), 'setup', _this3).call(_this3);
		return _this3;
	}

	return SquareFigure;
}(Figure);

var LineFigure = function (_Figure2) {
	_inherits(LineFigure, _Figure2);

	function LineFigure(color) {
		_classCallCheck(this, LineFigure);

		var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(LineFigure).call(this, color));

		_this4.coords = [{ x: 0, y: 0 }, { x: 0, y: R.dimen.BLOCK }, { x: 0, y: R.dimen.BLOCK * 2 }, { x: 0, y: R.dimen.BLOCK * 3 }];
		_this4.setup();
		return _this4;
	}

	return LineFigure;
}(Figure);

var LFigure = function (_Figure3) {
	_inherits(LFigure, _Figure3);

	function LFigure(color) {
		_classCallCheck(this, LFigure);

		var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(LFigure).call(this, color));

		_this5.coords = [{ x: 0, y: 0 }, { x: 0, y: R.dimen.BLOCK }, { x: 0, y: R.dimen.BLOCK * 2 }, { x: R.dimen.BLOCK, y: R.dimen.BLOCK * 2 }];
		_get(Object.getPrototypeOf(LFigure.prototype), 'setup', _this5).call(_this5);
		return _this5;
	}

	return LFigure;
}(Figure);

var ZFigure = function (_Figure4) {
	_inherits(ZFigure, _Figure4);

	function ZFigure(color) {
		_classCallCheck(this, ZFigure);

		var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(ZFigure).call(this, color));

		_this6.coords = [{ x: 0, y: 0 }, { x: R.dimen.BLOCK, y: 0 }, { x: R.dimen.BLOCK, y: R.dimen.BLOCK }, { x: R.dimen.BLOCK * 2, y: R.dimen.BLOCK }];
		_get(Object.getPrototypeOf(ZFigure.prototype), 'setup', _this6).call(_this6);
		return _this6;
	}

	return ZFigure;
}(Figure);

var TeeFigure = function (_Figure5) {
	_inherits(TeeFigure, _Figure5);

	function TeeFigure(color) {
		_classCallCheck(this, TeeFigure);

		var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(TeeFigure).call(this, color));

		_this7.coords = [{ x: 0, y: 0 }, { x: R.dimen.BLOCK, y: 0 }, { x: R.dimen.BLOCK * 2, y: 0 }, { x: R.dimen.BLOCK, y: R.dimen.BLOCK }];
		_get(Object.getPrototypeOf(TeeFigure.prototype), 'setup', _this7).call(_this7);
		return _this7;
	}

	return TeeFigure;
}(Figure);

var FiguresFactory = function () {
	var classes = [SquareFigure, LFigure, ZFigure, LineFigure, TeeFigure];

	var colors = [R.colors.INDIGO, R.colors.RED, R.colors.LIME, R.colors.GREEN, R.colors.BLUE, R.colors.YELLOW, R.colors.PURPLE];

	var degrees = [0, 90, 180, 270];

	var instance = null;

	var FiguresFactory = function () {
		function FiguresFactory() {
			_classCallCheck(this, FiguresFactory);
		}

		_createClass(FiguresFactory, [{
			key: 'produce',
			value: function produce() {
				var F = classes[_util2.default.random(0, classes.length)];
				var color = colors[_util2.default.random(0, colors.length)];
				var rotation = degrees[_util2.default.random(0, degrees.length)];
				var doFlip = !!_util2.default.random(0, 2);

				var f = new F(color);

				doFlip && f.flip();
				f.rotate(rotation);

				return f;
			}
		}], [{
			key: 'getInstance',
			value: function getInstance() {
				if (instance === null) {
					instance = new FiguresFactory();
				}
				return instance;
			}
		}]);

		return FiguresFactory;
	}();

	return FiguresFactory;
}();

exports.default = FiguresFactory;

},{"./res":3,"./util":4}],2:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _res = require('./res');

var R = _interopRequireWildcard(_res);

var _figure = require('./figure');

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _interopRequireWildcard(obj) {
	if (obj && obj.__esModule) {
		return obj;
	} else {
		var newObj = {};if (obj != null) {
			for (var key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
			}
		}newObj.default = obj;return newObj;
	}
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Tetris = function () {

	var instance = null;

	var _current = null;
	var _next = null;

	var DEBUG = false;

	function drawDebugGrid() {
		var grid = new createjs.Container();
		grid.x = -1;
		grid.y = -1;

		var block = _figure2.default.getInstance().produce().getChildAt(0);

		block.color = R.colors.WHITE;
		block.alpha = 0.3;
		block.setup();

		for (var i = 0; i < this.width / R.dimen.BLOCK; ++i) {
			for (var j = 0; j < this.height / R.dimen.BLOCK; ++j) {
				var b = block.clone();
				b.x = i * R.dimen.BLOCK;
				b.y = j * R.dimen.BLOCK;
				grid.addChild(b);
			}
		}
		this.stage.addChild(grid);
	}

	var Tetris = function () {
		function Tetris(canvas) {
			_classCallCheck(this, Tetris);

			canvas.width = (R.dimen.FIELD_W + R.dimen.SIDEBAR_W) * R.dimen.BLOCK + R.dimen.STROKE * 0.5;
			canvas.height = R.dimen.FIELD_H * R.dimen.BLOCK + R.dimen.STROKE;

			this.stage = new createjs.Stage(canvas);
			this.stage.snapToPixelEnabled = true;

			this.field = new createjs.Container();
			this.placeholder = new createjs.Container();

			this.score = null;
			this.hiscore = null;
			this.overlay = null;

			this.bindEvents();
			this.restart();
		}

		_createClass(Tetris, [{
			key: 'pause',
			value: function pause() {
				createjs.Ticker.removeAllEventListeners("tick");
				this.paused = true;
				this.showPauseOverlay();
			}
		}, {
			key: 'unpause',
			value: function unpause() {
				var _this = this;

				createjs.Ticker.on("tick", function (event) {
					return _this.tick(event);
				});
				this.paused = false;
				this.hidePauseOverlay();
			}
		}, {
			key: 'restart',
			value: function restart() {
				this.pause();

				this.field.removeAllChildren();
				this.placeholder.removeAllChildren();
				this.stage.removeAllChildren();

				this.setupGUI();

				this.next = _figure2.default.getInstance().produce();
				this.current = _figure2.default.getInstance().produce();

				this.stage.update();

				createjs.Ticker.setInterval(1000);

				this.unpause();
			}
		}, {
			key: 'setupGUI',
			value: function setupGUI() {
				//todo: add text labels, buttons, etc

				if (DEBUG) {
					drawDebugGrid.call(this);
				}

				this.field.set({ x: -1, y: -1 });
				this.stage.addChild(this.field);

				this.placeholder.set({ x: -1, y: -1 });
				this.stage.addChild(this.placeholder);

				var rect = new createjs.Shape();
				rect.graphics.beginFill(R.colors.GRAY).drawRect(this.fieldWidth + R.dimen.STROKE, 0, this.sidebarWidth, this.height);
				this.stage.addChild(rect);

				this.setText();

				//this.stage.cache(this.fieldWidth, 0, this.width - this.fieldWidth, this.height);
			}
		}, {
			key: 'showPauseOverlay',
			value: function showPauseOverlay() {
				if (this.overlay !== null) {
					this.stage.addChild(this.overlay);
					return;
				}

				this.overlay = new createjs.Container();

				var shape = new createjs.Shape();
				shape.graphics.clear().beginFill(R.colors.WHITE).drawRect(0, 0, this.width, this.height);

				shape.alpha = 0.8;

				this.overlay.addChild(shape);

				var text = new createjs.Text(R.strings.PAUSED, R.dimen.TEXT_LARGE, R.colors.BLACK);
				var b = text.getBounds();
				text.set({
					x: this.fieldWidth / 2 - b.width / 2,
					y: this.height / 2 - b.height / 2
				});

				this.overlay.addChild(text);

				this.stage.addChild(this.overlay);
			}
		}, {
			key: 'hidePauseOverlay',
			value: function hidePauseOverlay() {
				this.stage.removeChild(this.overlay);
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
			key: 'setText',
			value: function setText() {
				var _this3 = this;

				var third = this.height / 3;

				var strings = [{ text: R.strings.NEXT, size: R.dimen.TEXT_BIG, y: 20 }, { text: R.strings.SCORE, size: R.dimen.TEXT_BIG, y: third + 20 }, { text: R.strings.ZEROS, size: R.dimen.TEXT_SMALL, y: third + 40, label: "score" }, { text: R.strings.HISCORE, size: R.dimen.TEXT_BIG, y: this.height - third }, { text: R.strings.ZEROS, size: R.dimen.TEXT_SMALL, y: this.height - third + 25, label: "hiscore" }];

				var x = this.fieldWidth + this.sidebarWidth / 2;

				strings.forEach(function (s, i) {
					var t = new createjs.Text(s.text, s.size, R.colors.WHITE);
					var b = t.getBounds();
					t.set({
						x: x - b.width / 2,
						y: i * b.height + s.y
					});

					_this3.stage.addChild(t);

					if (s.label) {
						_this3[s.label] = t;
					}
				});
			}
		}, {
			key: 'handleKeyDown',
			value: function handleKeyDown(event) {
				event = event || window.event;

				if (this.paused) {
					if (event.keyCode == R.keys.ESC) {
						this.unpause();
						this.stage.update();
					}
					return;
				}

				switch (event.keyCode) {
					case R.keys.UP:
						this.current.rotate();

						var threshold = this.fieldWidth - this.current.width + R.dimen.STROKE * 2;
						if (this.current.x >= threshold) {
							this.current.x = threshold;
						}

						// todo: come up with something smarter than just reverse rotation
						if (this.hitTest()) {
							this.current.rotate(false);
						}
						break;

					case R.keys.LEFT:
						this.moveLeft();
						break;

					case R.keys.RIGHT:
						this.moveRight();
						break;

					case R.keys.DOWN:
						this.moveDown();
						break;

					case R.keys.SPACE:
						this.fallDown();
						break;

					case R.keys.ESC:
						this.pause();
						break;
				}

				this.stage.update();
			}
		}, {
			key: 'hitTest',
			value: function hitTest() {
				var blocks = this.current.numChildren;

				for (var i = 0; i < blocks; ++i) {
					var b = this.current.getChildAt(i);
					var pt = b.localToLocal(b.center.x, b.center.y, this.field);

					if (this.field.hitTest(pt.x, pt.y)) {
						return true;
					}
				}

				return false;
			}
		}, {
			key: 'tick',
			value: function tick(event) {
				this.moveDown();
				// todo: this.removeLines();

				this.stage.update(event);
			}
		}, {
			key: 'swap',
			value: function swap() {
				this.placeholder.removeChildAt(0);
				this.field.addChild(this.current);

				this.current = this.next;
				this.next = _figure2.default.getInstance().produce();

				if (this.hitTest()) {
					// todo: update high score
					this.restart();
				}
			}
		}, {
			key: 'moveDown',
			value: function moveDown() {
				var threshold = this.height - this.current.height + R.dimen.STROKE;

				this.current.y += R.dimen.BLOCK;

				if (this.hitTest()) {
					this.current.y -= R.dimen.BLOCK;
					this.swap();
				} else if (this.current.y >= threshold) {
					this.current.y = threshold; // stick to bottom

					this.swap();
				}
			}
		}, {
			key: 'fallDown',
			value: function fallDown() {
				var threshold = this.height - this.current.height + R.dimen.STROKE;

				while (!this.hitTest()) {
					this.current.y += R.dimen.BLOCK;
					if (this.current.y >= threshold + R.dimen.BLOCK) {
						this.current.y = threshold + R.dimen.BLOCK;
						break;
					}
				}

				this.current.y -= R.dimen.BLOCK;
				this.swap();
			}
		}, {
			key: 'moveLeft',
			value: function moveLeft() {
				var x = this.current.x;

				if (x > 0) {
					this.current.x -= R.dimen.BLOCK;

					if (this.hitTest()) {
						this.current.x = x;
					}
				}
			}
		}, {
			key: 'moveRight',
			value: function moveRight() {
				var x = this.current.x;

				if (x < this.fieldWidth - this.current.width) {
					this.current.x += R.dimen.BLOCK;

					if (this.hitTest()) {
						this.current.x = x;
					}
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
				figure.x = this.fieldWidth / 2;
				figure.y = 0;

				this.placeholder.addChild(figure);

				_current = figure;
			},
			get: function get() {
				return _current;
			}
		}, {
			key: 'next',
			set: function set(figure) {
				figure.x = this.fieldWidth + this.sidebarWidth / 2 - figure.width / 2;
				figure.y = 50;

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./figure":1,"./res":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var colors = exports.colors = {
	RED: "#F44336",
	BLUE: "#2196F3",
	GREEN: "#8BC34A",
	YELLOW: "#FFC107",
	PURPLE: "#9C27B0",
	LIME: "#CDDC39",
	INDIGO: "#3F51B5",
	BLACK: "#000000",
	WHITE: "#FFFFFF",
	GRAY: "#212121"
};

var dimen = exports.dimen = {
	BLOCK: 32,
	STROKE: 4,
	FIELD_W: 10, // blocks
	FIELD_H: 20, // blocks
	SIDEBAR_W: 5, // blocks
	TEXT_BIG: "20px Roboto Mono",
	TEXT_SMALL: "16px Roboto Mono",
	TEXT_LARGE: "42px Roboto Mono"
};

var keys = exports.keys = {
	ENTER: 13,
	ESC: 27,
	SPACE: 32,
	UP: 38,
	LEFT: 37,
	RIGHT: 39,
	DOWN: 40
};

var strings = exports.strings = {
	NEXT: "next",
	SCORE: "score",
	HISCORE: "hi-score",
	ZEROS: "0000000",
	PAUSED: "paused"
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

var Util = function () {
	function Util() {
		_classCallCheck(this, Util);
	}

	_createClass(Util, null, [{
		key: "random",
		value: function random(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}]);

	return Util;
}();

exports.default = Util;

},{}]},{},[2]);
