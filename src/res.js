export let dip = (value) => Math.floor(value * (window.devicePixelRatio || 1));

let fgte = function(a, b) {
	return (Math.abs(a - b) < Number.EPSILON) || a > b;
};

export const pixelRatio = (function() {
	let ratio = window.devicePixelRatio || 1;

	if ( fgte(ratio, 4.0) ) return "xxxhdpi";
	if ( fgte(ratio, 3.0) ) return "xxhdpi";
	if ( fgte(ratio, 2.0) ) return "xhdpi";
	if ( fgte(ratio, 1.5) ) return "hdpi";
	return "mdpi";
})();

export const colors = {
	RED:    "#F44336",
	BLUE:   "#2196F3",
	GREEN:  "#8BC34A",
	YELLOW: "#FFC107",
	PURPLE: "#9C27B0",
	LIME:   "#CDDC39",
	INDIGO: "#3F51B5",
	BLACK:  "#000000",
	WHITE:  "#FFFFFF",
	GRAY:   "#212121"
};

export const dimen = {
	BLOCK:   dip(32),
	STROKE:   dip(4),
	FIELD_W: 10, // blocks
	FIELD_H: 20, // blocks
	SIDEBAR_W: 5, // blocks
	TEXT_BIG: dip(20) + "px Roboto Mono",
	TEXT_SMALL: dip(16) + "px Roboto Mono",
	TEXT_LARGE: dip(42) + "px Roboto Mono",
};

export const keys = {
	ENTER: 13,
	ESC:   27,
	SPACE: 32,
	UP:    38,
	LEFT:  37,
	RIGHT: 39,
	DOWN:  40
};

export const strings = {
	NEXT: "next",
	SCORE: "score",
	HISCORE: "hi-score",
	ZEROS: "0000000",
	PAUSED: "paused"
};

export const img = {
	SOUND_ON:  {"id": "sound_on",  "src": ["res/img", pixelRatio, "ic_volume_up_white_24dp.png"].join('/')},
	SOUND_OFF: {"id": "sound_off", "src": ["res/img", pixelRatio, "ic_volume_off_white_24dp.png"].join('/')},
};

export const audio = {
	FALL: {"id": "fall",  "src": "res/audio/fall.mp3"},
	LEVELUP: {"id": "levelup",  "src": "res/audio/levelup.mp3"},
	REMOVE: {"id": "remove",  "src": "res/audio/remove.mp3"},
	//ROTATE: {"id": "rotate",  "src": "res/audio/rotate.mp3"},
}