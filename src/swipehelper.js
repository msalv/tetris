const SwipeHelper = (() => {

	const THRESHOLD = 32;

	const LEFT  = "left";
	const RIGHT = "right";
	const UP    = "up";
	const DOWN  = "down";
	const TOUCH = "touch";

	const MODE_MOVE = "move";
	const MODE_END = "end";

	// private api

	function getDirection(dx, dy) {
	    let direction = null;

	    if ( Math.abs(dx) > Math.abs(dy) ) {
	    	direction = (dx > 0) ? LEFT : RIGHT;
	    }
	    else {
	    	direction = (dy > 0) ? UP : DOWN;
	    }

	    return direction;
	}

	function handleTouchStart(e) {
		if (!e.touches.length) {
			return;
		}

	    this.x0 = e.touches[0].clientX;
	    this.y0 = e.touches[0].clientY;
	}

	function handleTouchEnd(e) {
		this.x0 = null;
		this.y0 = null;
	}

	function handleTouchCancel(e) {
		this.x0 = null;
		this.y0 = null;
	}

	function handleTouchMove(e) {
	    if ( this.x0 === null || this.y0 === null ) {
	        return;
	    }

	    let x1 = e.changedTouches[0].clientX;
	    let y1 = e.changedTouches[0].clientY;

	    let dx = this.x0 - x1;
	    let dy = this.y0 - y1;

	    if ( Math.abs(dx - dy) < Number.EPSILON ) {
	    	if (this.mode = MODE_END && typeof this.onTouched === "function") {
		    	this.onTouched(x1, y1);
			    this.x0 = null;
			    this.y0 = null;
		    	return;
	    	}
	    }

	    var movedX = Math.abs(dx) >= THRESHOLD;
	    var movedY = Math.abs(dy) >= THRESHOLD;

		if ( !(movedX || movedY) ) {
			return;
		}

		let direction = getDirection(dx, dy);

	    switch (direction) {
	    	case LEFT:
				movedX && (typeof this.onSwipingLeft === "function") && this.onSwipingLeft();
	    	break;
				
	    	case RIGHT:
				movedX && (typeof this.onSwipingRight === "function") && this.onSwipingRight();
	    	break;

	    	case UP:
	    		movedY && (typeof this.onSwipingUp === "function") && this.onSwipingUp();
	    	break;

	    	case DOWN:
	    		movedY && (typeof this.onSwipingDown === "function") && this.onSwipingDown();
	    	break;
	    }

	    this.x0 = x1;
	    this.y0 = y1;
	}

	// public api

	class SwipeHelper {

		constructor(target, mode = MODE_MOVE) {
			this.x0 = null;
			this.y0 = null;

			this.mode = mode;

			this.onSwipingLeft = null;
			this.onSwipingRight = null;
			this.onSwipingUp = null;
			this.onSwipingDown = null;
			this.onTouched = null;

			target.addEventListener("touchstart", e => handleTouchStart.call(this, e), false);

			if ( this.mode == MODE_MOVE ) {
				target.addEventListener("touchend", e => handleTouchEnd.call(this, e), false);
				target.addEventListener("touchmove", e => handleTouchMove.call(this, e), false);
				target.addEventListener("touchcancel", e => handleTouchCancel.call(this, e), false);
			}
			else {
				target.addEventListener("touchend", e => handleTouchMove.call(this, e), false);
				target.addEventListener("touchcancel", e => handleTouchCancel.call(this, e), false);
			}
		}

		on(direction, callback) {
			switch (direction) {
				case LEFT: this.onSwipingLeft = callback; break;
				case RIGHT: this.onSwipingRight = callback; break;
				case UP: this.onSwipingUp = callback; break;
				case DOWN: this.onSwipingDown = callback; break;
				case TOUCH: this.onTouched = callback; break;
			}
		}
	}

	return SwipeHelper;
})();

export default SwipeHelper;