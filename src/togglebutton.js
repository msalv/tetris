import * as R from './res'

const ToggleButton = (() => {

	let _checked = false;

	class ToggleButton extends createjs.Container {
		
		constructor(checked_icon, unchecked_icon) {
			super();

			this.cursor = "pointer";
			this.mouseChildren = false;

			this.checked_icon = checked_icon;
			this.unchecked_icon = unchecked_icon;

			let circle = new createjs.Shape();
			circle.graphics.beginFill(R.colors.BLACK).drawCircle(R.dip(18), R.dip(18), R.dip(24));

			this.addChild(circle);

			this.unchecked_icon.y += 1;
			this.checked_icon.y += 1;

			this.addChild(this.unchecked_icon);

			this.cache(-R.dip(6), -R.dip(6), R.dip(48), R.dip(48));
		}

		set checked(checked) {
			if ( _checked == checked ) {
				return;
			}

			_checked = checked;

			this.removeChildAt(this.numChildren - 1);
			this.addChild(_checked ? this.checked_icon : this.unchecked_icon);

			this.updateCache();
		}

		get checked() {
			return _checked;
		}

	}

	return createjs.promote(ToggleButton, "Container");
})();

export default ToggleButton;