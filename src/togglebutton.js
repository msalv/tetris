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

			let b = this.unchecked_icon.getBounds();
			
			const radius = b.width;
			const cx = b.width / 2;
			const cy = b.height / 2;

			let circle = new createjs.Shape();
			circle.graphics.beginFill(R.colors.BLACK).drawCircle(cx, cy, radius);

			this.addChild(circle);
			this.addChild(this.unchecked_icon);

			this.cache(-cx, -cy, radius * 2, radius * 2);

			this.regX = -cx;
			this.regY = -cy;
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