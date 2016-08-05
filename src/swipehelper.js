const SwipeHelper = (() => {

	let instance = null;

	let onSwipingLeft = null;
	let onSwipingRight = null;
	let onSwipingUp = null;
	let onSwipingDown = null;

	let x = null;
	let y = null;

	function handleTouchStart(e) {
		if (!e.touches.length) {
			return;
		}

	    x = e.touches[0].clientX;
	    y = e.touches[0].clientY;
	}

	function handleTouchEnd(e) {
		x = null;
		y = null;
	}

	function handleTouchMove(e) {
	    if ( x === null || y === null ) {
	        return;
	    }

	    let nx = e.changedTouches[0].clientX;
	    let ny = e.changedTouches[0].clientY;

	    let dx = x - nx;
	    let dy = y - ny;

	    /*if ( Math.abs(dx - dy) < Number.EPSILON ) {
	    	// just a single touch
		    x = null;
		    y = null;
	    	return;
	    }*/

	    var direction = null;

	    if ( Math.abs(dx) > Math.abs(dy) ) {
	    	direction = (dx > 0) ? "left" : "right";
	    }
	    else {
	    	direction = (dy > 0) ? "up" : "down";
	    }

	    var movedX = Math.abs(dx) >= 24;
	    var movedY = Math.abs(dy) >= 24;

		if ( !(movedX || movedY) ) {
			return;
		}

	    switch (direction) {
	    	case "left":
				movedX && (typeof onSwipingLeft === "function") && onSwipingLeft()
	    	break;
				
	    	case "right":
				movedX && (typeof onSwipingRight === "function") && onSwipingRight()
	    	break;

	    	case "up":
	    		movedY && (typeof onSwipingUp === "function") && onSwipingUp()
	    	break;

	    	case "down":
	    		movedY && (typeof onSwipingDown === "function") && onSwipingDown()
	    	break;
	    }

	    x = nx;
	    y = ny;
	}

	class SwipeHelper {

		constructor() {

		}

		static bind() {
			if ( instance === null ) {
				window.addEventListener("touchstart", handleTouchStart, false);
				window.addEventListener("touchend", handleTouchEnd, false);
				window.addEventListener("touchmove", handleTouchMove, false);
				//window.addEventListener("touchcancel", handleCancel, false);

				instance = new SwipeHelper();
			}

			return instance;
		}

		static on(direction, callback) {
			switch (direction) {
				case "left": onSwipingLeft = callback; break;
				case "right": onSwipingRight = callback; break;
				case "up": onSwipingUp = callback; break;
				case "down": onSwipingDown = callback; break;
			}
		}

		static off(direction) {
			switch (direction) {
				case "left": onSwipingLeft = null; break;
				case "right": onSwipingRight = null; break;
				case "up": onSwipingUp = null; break;
				case "down": onSwipingDown = null; break;
				case undefined: onSwipingLeft = onSwipingRight = onSwipingUp = onSwipingDown = null; break;
			}
		}
	}

	return SwipeHelper;
})();

export default SwipeHelper;