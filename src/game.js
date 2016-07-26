import * as R from './res'
import FiguresFactory from './figure'

const Tetris = (() => {

	let instance = null;
	
	let _current = null;
	let _next = null;
	
	class Tetris {
		constructor(canvas) {
			this.stage = new createjs.Stage(canvas);
			this.stage.snapToPixelEnabled = true;

			this.figures = [];

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
			figure.x = this.fieldWidth / 2 - 1;
			figure.y = 0;
			
			this.figures.push(figure);
			this.stage.addChild(figure);

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
			
			var rect = new createjs.Shape();
			rect.graphics.beginFill(R.colors.GRAY).drawRect(this.fieldWidth, 0, this.sidebarWidth, this.height);
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
					if ( this.current.x >= this.fieldWidth - this.current.width ) {
						this.current.x = this.fieldWidth - this.current.width + 2*R.dimen.STROKE*0.75;
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
			}

			this.stage.update();
		}

		tick(event) {
			this.moveDown();

			this.stage.update(event);
		}

		moveDown() {
			this.current.y += R.dimen.BLOCK;

			var d = this.current.height;

			if ( this.current.y >= this.height - d + R.dimen.STROKE*0.5) {
				this.current.y = this.height - d + R.dimen.STROKE*0.5;
				this.current = this.next;
				this.next = FiguresFactory.getInstance().produce();
			}
		}

		moveLeft() {
			if ( this.current.x > 0) {
				this.current.x -= R.dimen.BLOCK;
			}
		}

		moveRight() {
			if ( this.current.x < this.fieldWidth - this.current.width ) {
				this.current.x += R.dimen.BLOCK;
			}
		}
	}

	return Tetris;
})();

global.Tetris = Tetris;