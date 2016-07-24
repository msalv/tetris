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

				var _getBounds = this.getBounds();

				var x = _getBounds.x;
				var y = _getBounds.y;
				var width = _getBounds.width;
				var height = _getBounds.height;

				this.cache(x, y, width, height);
			}
		}, {
			key: 'flip',
			value: function flip() {
				this.regX = this.getBounds().width / 2;
				this.scaleX = -1;
				this.updateCache();
			}
		}, {
			key: 'rotate',
			value: function rotate(degree) {
				this.rotation = degree;
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
"use strict";

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

var _figure = require("./figure");

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./figure":1}],3:[function(require,module,exports){
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
	BLACK: "#000000"
};

var dimen = exports.dimen = {
	BLOCK: 15,
	STROKE: 2
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
