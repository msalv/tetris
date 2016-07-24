import FiguresFactory from './figure'

const Tetris = (() => {

	let instance = null;
	
	class Tetris {
		constructor(canvas) {
			this.stage = new createjs.Stage(canvas);

			createjs.Ticker.on("tick", this.tick);
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

		tick() {
			// todo: some logic
			//this.stage.update();
		}
	}

	return Tetris;
})();

global.Tetris = Tetris;