import * as R from './res'
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

		block.color = "#FFFFFF";
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
			canvas.width += R.dimen.STROKE*0.5;
			canvas.height += R.dimen.STROKE;

			this.stage = new createjs.Stage(canvas);
			this.stage.snapToPixelEnabled = true;

			this.field = new createjs.Container();
			this.placeholder = new createjs.Container();

			this.setupGUI();
			this.bindEvents();
			
			this.next = FiguresFactory.getInstance().produce();
			this.current = FiguresFactory.getInstance().produce();

			this.stage.update();

			createjs.Ticker.setInterval(1000);
			createjs.Ticker.on("tick", (event) => this.tick(event));
		}

		static start(canvas) {
			if (instance === null) {
				instance = new Tetris(canvas);
			}
			return instance;
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
			figure.x = this.fieldWidth + this.sidebarWidth / 2 - figure.width / 2;
			figure.y = 50;

			this.stage.addChild(figure);

			_next = figure;
		}

		get next() {
			return _next;
		}

		setupGUI() {
			//todo: add text labels, buttons, etc

			if (DEBUG) {
				drawDebugGrid.call(this);
			}

			this.field.set({x: -1, y: -1});
			this.stage.addChild(this.field);

			this.placeholder.set({x: -1, y: -1});
			this.stage.addChild(this.placeholder);
			
			var rect = new createjs.Shape();
			rect.graphics.beginFill(R.colors.GRAY).drawRect(this.fieldWidth + R.dimen.STROKE, 0, this.sidebarWidth, this.height);
			this.stage.addChild(rect);

			//this.stage.cache(this.fieldWidth, 0, this.width - this.fieldWidth, this.height);
		}

		bindEvents() {
			document.onkeydown = (e) => this.handleKeyDown(e);
		}

		handleKeyDown(event) {
			event = event || window.event;

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
			// todo: this.removeLines();

			this.stage.update(event);
		}

		swap() {
			this.placeholder.removeChildAt(0);
			this.field.addChild(this.current);

			this.current = this.next;
			this.next = FiguresFactory.getInstance().produce();
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
				if ( this.current.y >= threshold) {
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
	}

	return Tetris;
})();

global.Tetris = Tetris;