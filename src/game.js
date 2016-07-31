import * as R from './res'
import Util from './util'
import FiguresFactory from './figure'

const Tetris = (() => {

	let instance = null;
	
	let _current = null;
	let _next = null;

	const DEBUG = false;

	function drawDebugGrid() {
		var grid = new createjs.Container();
		grid.x = -1;
		grid.y = -1;

		var block = FiguresFactory.getInstance().produce().getChildAt(0);

		block.color = R.colors.WHITE;
		block.alpha = 0.3;
		block.setup();

		for (let i=0; i < this.width / R.dimen.BLOCK; ++i) {
			for (let j=0; j < this.height / R.dimen.BLOCK; ++j) {
				let b = block.clone();
				b.x = i * R.dimen.BLOCK;
				b.y = j * R.dimen.BLOCK;
				grid.addChild(b);
			}
		}
		this.stage.addChild(grid);
	}
	
	class Tetris {
		constructor(canvas) {
			canvas.width = (R.dimen.FIELD_W + R.dimen.SIDEBAR_W) * R.dimen.BLOCK + R.dimen.STROKE*0.5;
			canvas.height = R.dimen.FIELD_H * R.dimen.BLOCK + R.dimen.STROKE;

			this.stage = new createjs.Stage(canvas);
			this.stage.snapToPixelEnabled = true;

			this.field = new createjs.Container();
			this.placeholder = new createjs.Container();
			this.sidebar = new createjs.Container();

			this.score = null;
			this.hiscore = null;
			this.overlay = null;

			this.bindEvents();
			this.restart();
		}

		static start(canvas) {
			if (instance === null) {
				instance = new Tetris(canvas);
			}
			return instance;
		}

		pause() {
			createjs.Ticker.removeAllEventListeners("tick");
			this.paused = true;
			this.showPauseOverlay();
		}

		unpause() {
			createjs.Ticker.on("tick", (event) => this.tick(event));
			this.paused = false;
			this.hidePauseOverlay();
		}

		restart() {
			this.pause();

			this.field.removeAllChildren();
			this.placeholder.removeAllChildren();
			this.sidebar.removeAllChildren();
			this.stage.removeAllChildren();

			this.setupGUI();
			
			this.next = FiguresFactory.getInstance().produce();
			this.current = FiguresFactory.getInstance().produce();

			this.sidebar.updateCache();
			this.stage.update();

			createjs.Ticker.setInterval(1000);

			this.unpause();
		}

		get height() {
			return this.stage.canvas.height;
		}

		get width() {
			return this.stage.canvas.width;
		}

		get fieldWidth() {
			return R.dimen.FIELD_W * R.dimen.BLOCK;
		}

		get sidebarWidth() {
			return this.width - this.fieldWidth;
		}

		set current(figure) {
			figure.x = this.fieldWidth / 2;
			figure.y = 0;
			
			this.placeholder.addChild(figure);

			_current = figure;
		}

		get current() {
			return _current;
		}

		set next(figure) {
			figure.x = this.sidebarWidth / 2 - figure.width / 2;
			figure.y = 50;

			this.sidebar.addChild(figure);

			_next = figure;
		}

		get next() {
			return _next;
		}

		setupGUI() {
			if (DEBUG) {
				drawDebugGrid.call(this);
			}

			this.field.set({x: -1, y: -1});
			this.stage.addChild(this.field);

			this.placeholder.set({x: -1, y: -1});
			this.stage.addChild(this.placeholder);

			this.sidebar.set({x: this.fieldWidth + R.dimen.STROKE, y: 0});
			this.stage.addChild(this.sidebar);
			
			var rect = new createjs.Shape();
			rect.graphics.beginFill(R.colors.GRAY).drawRect(0, 0, this.sidebarWidth, this.height);
			this.sidebar.addChild(rect);

			this.setText();

			// cache sidebar
			this.sidebar.cache(0, 0, this.sidebarWidth, this.height);
		}

		showPauseOverlay() {
			if ( this.overlay !== null ) {
				this.stage.addChild(this.overlay);
				return;
			}

			this.overlay = new createjs.Container();

			var shape = new createjs.Shape();
			shape.graphics.clear()
				.beginFill(R.colors.WHITE)
				.drawRect(0, 0, this.width, this.height);

			shape.alpha = 0.8;

			this.overlay.addChild(shape);

			var text = new createjs.Text(R.strings.PAUSED, R.dimen.TEXT_LARGE, R.colors.BLACK);
			var b = text.getBounds();
			text.set({
				x: this.fieldWidth / 2 - b.width / 2,
				y: this.height / 2 - b.height / 2
			})

			this.overlay.addChild(text);

			this.stage.addChild(this.overlay);
			this.overlay.cache(0, 0, this.width, this.height);
		}

		hidePauseOverlay() {
			this.stage.removeChild(this.overlay);
		}

		bindEvents() {
			document.onkeydown = (e) => this.handleKeyDown(e);
		}

		setText() {
			const third = this.height / 3;

			var strings = [
				{ text: R.strings.NEXT, size: R.dimen.TEXT_BIG, y: 20 },
				{ text: R.strings.SCORE, size: R.dimen.TEXT_BIG, y: third + 20 },
				{ text: R.strings.ZEROS, size: R.dimen.TEXT_SMALL, y: third + 40, label: "score" },
				{ text: R.strings.HISCORE, size: R.dimen.TEXT_BIG, y: this.height - third },
				{ text: R.strings.ZEROS, size: R.dimen.TEXT_SMALL, y: this.height - third + 25, label: "hiscore" }
			];

			const x = this.sidebarWidth / 2;

			strings.forEach((s, i) => {
				let t = new createjs.Text(s.text, s.size, R.colors.WHITE);
				let b = t.getBounds();
				t.set({
					x: x - b.width / 2,
					y: i*b.height + s.y
				});

				this.sidebar.addChild(t);

				if ( s.label ) {
					this[ s.label ] = t;
				}
			});

			if ( Util.storageAvailable('localStorage') ) {
				var hiscore = window.localStorage.getItem('hiscore');
				if ( hiscore ) {
					this.hiscore.text = Util.str_pad(hiscore, '0', R.strings.ZEROS.length);
				}
			}
		}

		handleKeyDown(event) {
			event = event || window.event;

			if ( this.paused ) {
				if ( event.keyCode == R.keys.ESC ) {
					this.unpause();
					this.stage.update();
				}
				return;
			}

			switch (event.keyCode) {
				case R.keys.UP:
					this.current.rotate();

					var threshold = this.fieldWidth - this.current.width + R.dimen.STROKE * 2;
					if ( this.current.x >= threshold ) {
						this.current.x = threshold;
					}

					// todo: come up with something smarter than just reverse rotation
					if ( this.hitTest() ) {
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

		hitTest() {
			const blocks = this.current.numChildren;

			for (let i = 0; i < blocks; ++i) {
				let b = this.current.getChildAt(i);
				var pt = b.localToLocal(b.center.x, b.center.y, this.field);
				
				if ( this.field.hitTest(pt.x, pt.y) ) {
					return true;
				}
			}

			return false;
		}

		tick(event) {
			this.moveDown();

			this.stage.update(event);
		}

		swap() {
			this.placeholder.removeChildAt(0);
			this.field.addChild(this.current);

			this.removeLines();

			this.current = this.next;
			this.next = FiguresFactory.getInstance().produce();

			if ( this.hitTest() ) {
				// todo: update high score
				this.restart();
			}
		}

		moveDown() {
			var threshold = this.height - this.current.height + R.dimen.STROKE;

			this.current.y += R.dimen.BLOCK;

			if ( this.hitTest() ) {
				this.current.y -= R.dimen.BLOCK;
				this.swap();
			}
			else if ( this.current.y >= threshold) {
				this.current.y = threshold; // stick to bottom
				
				this.swap();
			}
		}

		fallDown() {
			var threshold = this.height - this.current.height + R.dimen.STROKE;

			while ( !this.hitTest() ) {
				this.current.y += R.dimen.BLOCK;
				if ( this.current.y >= threshold + R.dimen.BLOCK) {
					this.current.y = threshold + R.dimen.BLOCK;
					break;
				}
			}

			this.current.y -= R.dimen.BLOCK;
			this.swap();
		}

		moveLeft() {
			const x = this.current.x;

			if ( x > 0) {
				this.current.x -= R.dimen.BLOCK;
				
				if ( this.hitTest() ) {
					this.current.x = x;
				}
			}
		}

		moveRight() {
			const x = this.current.x;

			if ( x < this.fieldWidth - this.current.width ) {
				this.current.x += R.dimen.BLOCK;

				if ( this.hitTest() ) {
					this.current.x = x;
				}
			}
		}

		removeLines() {
			const num = this.current.numChildren;
			var lines = [];
			var ys = [];

			for ( let i = 0; i < num; ++i ) {
				let block = this.current.getChildAt(i);
				let line = [];

				let pt = block.localToLocal(block.center.x, block.center.y, this.field);

				if ( ys.indexOf(pt.y) !== -1 ) {
					continue;
				}

				ys.push(pt.y);

				for (let j = 0; j < R.dimen.FIELD_W; ++j) {
			  		let b = this.field.getObjectUnderPoint(R.dimen.BLOCK / 2 + R.dimen.BLOCK*j, pt.y);
			  		b && line.push(b);
				}

				if (line.length == R.dimen.FIELD_W) {
					lines.push(line);
				}
			}

			var points = 0;

			lines.forEach( line => {
				line.forEach( block => {
					let f = block.parent;
					f.removeChild(block);
					f.updateCache();
				});
				points = points * 2 + 100;
			});

			if (points > 0) {
				this.updateScore(points);
			}

			this.stage.update();
		}

		updateScore(points) {
			points = points + parseInt(this.score.text);
			var text = Util.str_pad(points, '0', R.strings.ZEROS.length);
			
			this.score.text = text;

			if ( points > parseInt( this.hiscore.text ) ) {
				this.hiscore.text = text;

				if ( Util.storageAvailable('localStorage') ) {
					window.localStorage.setItem('hiscore', points);
				}
			}

			this.sidebar.updateCache();

			// todo: if ( points / speed > 10 ) increase speed
		}
	}

	return Tetris;
})();

window.Tetris = Tetris;