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
				.drawRect(R.dimen.STROKE, R.dimen.STROKE, R.dimen.BLOCK, R.dimen.BLOCK);

			this.setBounds(R.dimen.STROKE, R.dimen.STROKE, R.dimen.BLOCK, R.dimen.BLOCK);
		}

		get center() {
			let b = this.getBounds();
			return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
		}
	}
	 
	return createjs.promote(Block, "Shape");
})();

const Figure = (() => {

	class Figure extends createjs.Container {
		constructor(color) {
			super();
			this.color = color;
			this.coords = [];
			this.regXY = [];
		}

		setup() {
			for (let i = 0; i < this.coords.length; ++i) {
				let block = new Block(this.color);
				block.set(this.coords[i]);

				this.addChild(block);
			}

			this.snapToPixel = true;
			
			this.updateBounds();
		}

		updateBounds() {
			if ( this.cacheID ) {
				this.uncache();
			}

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
			let i = this.rotation / 90;
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

		rotate(clockwise = true) {
			const degree = clockwise ? 90 : -90; 
			let rotation = this.rotation + degree;

			this.rotation = (rotation >= 360) ? 0 : (rotation < 0 ? 270 : rotation);

			this.updateReg();
			this.updateCache();
		}

		get width() {
			let bounds = this.getBounds();
			return (this.rotation / 90) % 2 == 0 ? bounds.width : bounds.height;
		}

		get height() {
			let bounds = this.getBounds();
			return (this.rotation / 90) % 2 == 0 ? bounds.height : bounds.width;
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
			let F = classes[ Util.random(0, classes.length) ];
			let color = colors[ Util.random(0, colors.length) ];
			let rotation = Util.random(0, degrees.length);
			let doFlip = !!Util.random(0, 2);
			
			let f = new F(color);

			doFlip && f.flip();
			for (let i = 0; i < rotation; ++i) {
				f.rotate();
			}

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