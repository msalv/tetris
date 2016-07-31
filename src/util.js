class Util {
	static random (min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
	}

	static str_pad(str, pad, num) {
		str = (''+str);
		var s = Array(num+1).join(pad);
		return s.substring(0, s.length - str.length) + str;
	}

	static storageAvailable(type) {
		try {
			var storage = window[type],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return false;
		}
	}
}

export default Util;