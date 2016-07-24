import * as R from './res'
import Util from './util'

const Block = (() => {

	class Block extends createjs.Shape {
		constructor(color) {
			super();
			this.color = color;
			this.setup();
		}

		setup() {
			this.graphics.clear()
				.setStrokeStyle(R.dimen.STROKE)
				.beginStroke(R.colors.BLACK)
				.beginFill(this.color)
				.drawRect(0, 0, R.dimen.BLOCK, R.dimen.BLOCK);

			this.setBounds(0, 0, R.dimen.BLOCK, R.dimen.BLOCK);
		}
	}
	 
	return createjs.promote(Block, "Shape");
})();

const Figure = (() => {

	class Figure extends createjs.Container {
		constructor(color) {
			super();
			this.color = color;
			this.velocity = 0;
			this.coords = [];
		}

		tick(event) {
		}

		setup() {
			for (let i = 0; i < this.coords.length; ++i) {
				let block = new Block(this.color);
				block.set(this.coords[i]);

				this.addChild(block);
			}
			const {x, y, width, height} = this.getBounds();
			this.cache(x, y, width, height);
		}

		flip() {
			this.regX = Math.ceil(this.getTransformedBounds().width * 0.5);
			this.scaleX = -1;
			this.updateCache();
		}

		rotate(degree) {
			this.rotation = degree;
			this.updateCache();
		}
	}
	 
	return createjs.promote(Figure, "Container");
})();

class SquareFigure extends Figure {
	constructor(color) {
		super(color);
		this.coords = [
			{x: 0, y: 0},
			{x: R.dimen.BLOCK, y: 0},
			{x: 0, y: R.dimen.BLOCK},
			{x: R.dimen.BLOCK, y: R.dimen.BLOCK}
		];
		super.setup();
	}
}

class LineFigure extends Figure {
	constructor(color) {
		super(color);
		this.coords = [
			{x: 0, y: 0},
			{x: 0, y: R.dimen.BLOCK},
			{x: 0, y: R.dimen.BLOCK*2},
			{x: 0, y: R.dimen.BLOCK*3}
		];
		this.setup();
	}
}

class LFigure extends Figure {
	constructor(color) {
		super(color);
		this.coords = [
			{x: 0, y: 0},
			{x: 0, y: R.dimen.BLOCK},
			{x: 0, y: R.dimen.BLOCK*2},
			{x: R.dimen.BLOCK, y: R.dimen.BLOCK*2}
		];
		super.setup();
	}
}

class ZFigure extends Figure {
	constructor(color) {
		super(color);
		this.coords = [
			{x: 0, y: 0},
			{x: R.dimen.BLOCK, y: 0},
			{x: R.dimen.BLOCK, y: R.dimen.BLOCK},
			{x: R.dimen.BLOCK*2, y: R.dimen.BLOCK}
		];
		super.setup();
	}
}

class TeeFigure extends Figure {
	constructor(color) {
		super(color);
		this.coords = [
			{x: 0, y: 0},
			{x: R.dimen.BLOCK, y: 0},
			{x: R.dimen.BLOCK*2, y: 0},
			{x: R.dimen.BLOCK, y: R.dimen.BLOCK}
		];
		super.setup();
	}
}

const FiguresFactory = (() => {
	const classes = [
		SquareFigure,
		LFigure,
		ZFigure,
		LineFigure,
		TeeFigure
	];

	const colors = [
		R.colors.RED, R.colors.GREEN, R.colors.BLUE, R.colors.YELLOW, R.colors.PURPLE
	];

	const degrees = [0, 90, 180, 270];

	let instance = null;

	class FiguresFactory {
		constructor() {

		}

		produce() {
			var F = classes[ Util.random(0, classes.length) ];
			var color = colors[ Util.random(0, colors.length) ];
			var rotation = degrees[ Util.random(0, degrees.length) ];
			var doFlip = !!Util.random(0, 2);
			
			var f = new F(color);

			doFlip && f.flip();
			f.rotate(rotation);

			return f;
		}

		static getInstance() {
			if (instance === null) {
				instance = new FiguresFactory();
			}
			return instance;
		}
	}

	return FiguresFactory;
})();

export default FiguresFactory;