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
				this.graphics.clear().setStrokeStyle(R.dimen.STROKE).beginStroke(R.colors.BLACK).beginFill(this.color).drawRect(0, 0, R.dimen.BLOCK, R.dimen.BLOCK);

				this.setBounds(0, 0, R.dimen.BLOCK, R.dimen.BLOCK);
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
				var rotation = this.rotation + 90;
				this.rotation = rotation >= 360 ? 0 : rotation;

				this.updateReg();
				this.updateCache();
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

	var colors = [R.colors.RED, R.colors.GREEN, R.colors.BLUE, R.colors.YELLOW, R.colors.PURPLE];

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
				rect.graphics.beginFill(R.colors.GRAY).drawRect(this.containerWidth, 0, this.sidebarWidth, this.height);
				this.stage.addChild(rect);

				//this.stage.cache(this.containerWidth, 0, this.width - this.containerWidth, this.height);
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

				if (this.current.y >= this.height - d) {
					this.current.y = this.height - d;
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
			key: 'containerWidth',
			get: function get() {
				return Math.ceil(this.width * 0.75);
			}
		}, {
			key: 'sidebarWidth',
			get: function get() {
				return this.width - this.containerWidth;
			}
		}, {
			key: 'current',
			set: function set(figure) {
				figure.x = this.containerWidth / 2;
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
				figure.x = this.containerWidth + this.sidebarWidth / 2;
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
	BLACK: "#000000",
	GRAY: "#212121"
};

var dimen = exports.dimen = {
	BLOCK: 16,
	STROKE: 2
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
