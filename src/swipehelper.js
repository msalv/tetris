const SwipeHelper = (() => {

	let instance = null;

	let onSwipedLeft = null;
	let onSwipedRight = null;
	let onSwipedUp = null;
	let onSwipedDown = null;

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
	    if ( x === null || y === null ) {
	        return;
	    }

	    let dx = x - e.changedTouches[0].clientX;
	    let dy = y - e.changedTouches[0].clientY;

	    if ( Math.abs(dx - dy) < Number.EPSILON ) {
	    	// just a single touch
		    x = null;
		    y = null;
	    	return;
	    }

	    if ( Math.abs(dx) > Math.abs(dy) ) {
	        (dx > 0)
	            ? (typeof onSwipedLeft === "function") && onSwipedLeft()
	            : (typeof onSwipedRight === "function") && onSwipedRight()
	    } 
	    else {
	        (dy > 0)
		        ? (typeof onSwipedUp === "function") && onSwipedUp()
	        	: (typeof onSwipedDown === "function") && onSwipedDown()
	    }

	    x = null;
	    y = null; 
	}

	class SwipeHelper {

		constructor() {

		}

		static bind() {
			if ( instance === null ) {
				window.addEventListener("touchstart", handleTouchStart, false);
				window.addEventListener("touchend", handleTouchEnd, false);

				instance = new SwipeHelper();
			}

			return instance;
		}

		static on(direction, callback) {
			switch (direction) {
				case "left": onSwipedLeft = callback; break;
				case "right": onSwipedRight = callback; break;
				case "up": onSwipedUp = callback; break;
				case "down": onSwipedDown = callback; break;
			}
		}
	}

	return SwipeHelper;
})();

export default SwipeHelper;