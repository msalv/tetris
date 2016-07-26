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
			this.regXY = [];
		}

		tick(event) {
		}

		setup() {
			for (let i = 0; i < this.coords.length; ++i) {
				let block = new Block(this.color);
				block.set(this.coords[i]);

				this.addChild(block);
			}

			this.snapToPixel = true;
			
			const {x, y, width, height} = this.getBounds().pad(R.dimen.STROKE, R.dimen.STROKE, R.dimen.STROKE, R.dimen.STROKE);

		 	this.regXY = [
			    { regX: 0, regY: 0 }, 
			    { regX: 0, regY: height }, 
			    { regX: width, regY: height }, 
			    { regX: width, regY: 0 }
			];

			this.cache(x, y, width, height); // overrides bounds as well
		}

		updateReg() {
			var i = this.rotation / 90;
			if (this.scaleX < 0) {
				i = (this.regXY.length - 1) - i;
			}
			this.set(this.regXY[i]);
		}

		flip() {
			this.scaleX = -this.scaleX;
			
			this.updateReg();
			this.updateCache();
		}

		rotate() {
			var rotation = this.rotation + 90;
			this.rotation = (rotation >= 360) ? 0 : rotation;

			this.updateReg();
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
		R.colors.INDIGO, R.colors.RED, R.colors.LIME, R.colors.GREEN, R.colors.BLUE, R.colors.YELLOW, R.colors.PURPLE
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