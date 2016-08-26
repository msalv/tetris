import * as R from './res'

const PauseContainer = (() => {

	let _text = null;
	let _hint = null;

	const OPACITY = 0.8;

	const _invertFilter = new createjs.ColorMatrixFilter([-1,0,0,0,255,0,-1,0,0,255,0,0,-1,0,255,0,0,0,1,0]);

	class PauseContainer extends createjs.Container {
		
		constructor(width, height) {
			super();

			_text = new createjs.Text();
			_hint = new createjs.Text();

			this.width = width;
			this.height = height;

			this.setup();
		}

		setup() {
			let bg = new createjs.Shape();
			bg.graphics
				.beginFill(R.colors.WHITE)
				.drawRect(0, 0, this.width, this.height);

			bg.alpha = OPACITY;

			this.addChild(bg);

			let attrs = {
				x: this.width / 3,
				y: this.height / 2,
				textAlign: "center",
				color: R.colors.BLACK,
				lineHeight: R.dip(50)
			};

			_text.set(attrs);
			_text.font = R.dimen.TEXT_LARGE;

			this.addChild(_text);

			_hint.set(attrs);
			_hint.y += R.dip(100);
			_hint.font = R.dimen.TEXT_SMALL;

			this.addChild(_hint);

			this.cache(0, 0, this.width, this.height);
		}

		set text(text) {
			_text.text = text;
		}

		set hint(text) {
			_hint.text = text;
		}

		set inverted(value) {
			this.filters = (value == true) ? [_invertFilter] : null;
		}

		get inverted() {
			return (this.filters !== null);
		}
	}

	return createjs.promote(PauseContainer, "Container");
})();

export default PauseContainer;