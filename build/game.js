'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _res = require('./res');

var R = _interopRequireWildcard(_res);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _figure = require('./figure');

var _figure2 = _interopRequireDefault(_figure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

				if (_util2.default.storageAvailable('localStorage')) {
					var hiscore = window.localStorage.getItem('hiscore');
					if (hiscore) {
						this.hiscore.text = _util2.default.str_pad(hiscore, '0', R.strings.ZEROS.length);
					}
				}
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

				this.stage.update(event);
			}
		}, {
			key: 'swap',
			value: function swap() {
				this.placeholder.removeChildAt(0);
				this.field.addChild(this.current);

				this.removeLines();

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
			key: 'removeLines',
			value: function removeLines() {
				var num = this.current.numChildren;
				var lines = [];
				var ys = [];

				for (var i = 0; i < num; ++i) {
					var block = this.current.getChildAt(i);
					var line = [];

					var pt = block.localToLocal(block.center.x, block.center.y, this.field);

					if (ys.indexOf(pt.y) !== -1) {
						continue;
					}

					ys.push(pt.y);

					for (var j = 0; j < R.dimen.FIELD_W; ++j) {
						var b = this.field.getObjectUnderPoint(R.dimen.BLOCK / 2 + R.dimen.BLOCK * j, pt.y);
						b && line.push(b);
					}

					if (line.length == R.dimen.FIELD_W) {
						lines.push(line);
					}
				}

				var points = 0;

				lines.forEach(function (line) {
					line.forEach(function (block) {
						var f = block.parent;
						f.removeChild(block);
						f.updateCache();
					});
					points = points * 2 + 100;
				});

				this.updateScore(points);

				this.stage.update();

				// todo: add points
			}
		}, {
			key: 'updateScore',
			value: function updateScore(points) {
				points = points + parseInt(this.score.text);
				var text = _util2.default.str_pad(points, '0', R.strings.ZEROS.length);

				this.score.text = text;

				if (points > parseInt(this.hiscore.text)) {
					this.hiscore.text = text;

					if (_util2.default.storageAvailable('localStorage')) {
						window.localStorage.setItem('hiscore', points);
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