import * as R from './res'
import FiguresFactory from './figure'

const Tetris = (() => {

	let instance = null;
	
	let _current = null;
	let _next = null;
	
	class Tetris {
		constructor(canvas) {
			this.stage = new createjs.Stage(canvas);

			this.figures = [];

			this.setupGUI();
			
			this.next = FiguresFactory.getInstance().produce();
			this.current = FiguresFactory.getInstance().produce();

			this.stage.update();

			//createjs.Ticker.setInterval(1000);
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

		get containerWidth() {
			return Math.ceil(this.width * 0.75);
		}

		get sidebarWidth() {
			return this.width - this.containerWidth;
		}

		set current(figure) {
			figure.x = this.containerWidth / 2;
			figure.y = 0;
			
			this.figures.push(figure);
			this.stage.addChild(figure);

			_current = figure;
		}

		get current() {
			return _current;
		}

		set next(figure) {
			figure.x = this.containerWidth + this.sidebarWidth / 2;
			figure.y = 100;
			this.stage.addChild(figure);

			_next = figure;
		}

		get next() {
			return _next;
		}

		setupGUI() {
			//this.stage.setBounds(0, 0, this.containerWidth, this.height);

			//todo: add text labels, buttons, etc
			
			var rect = new createjs.Shape();
			rect.graphics.beginFill(R.colors.GRAY).drawRect(this.containerWidth, 0, this.sidebarWidth, this.height);
			this.stage.addChild(rect);

			//this.stage.cache(this.containerWidth, 0, this.width - this.containerWidth, this.height);
		}

		tick(event) {
			this.current.y += R.dimen.BLOCK;

			var bounds = this.current.getTransformedBounds();

			if ( this.current.y >= this.height - bounds.height ) {
				this.current.y += (this.current.y - bounds.y);
				this.current = this.next;
				this.next = FiguresFactory.getInstance().produce();
			}

			this.stage.update(event);
		}
	}

	return Tetris;
})();

global.Tetris = Tetris;