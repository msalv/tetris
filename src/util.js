class Util {
	static random (min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
	}
}

export default Util;