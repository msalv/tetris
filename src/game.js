import * as R from './res'
import Util from './util'
import FiguresFactory from './figure'
import ToggleButton from './togglebutton'
import PauseContainer from './pausecontainer'

const Tetris = (() => {

	let instance = null;
	let queue = null;
	
	let _current = null;
	let _next = null;

	const INTERVAL    	   = 1000;
	const SPEED_K     	   =  0.8;
	const LEVELUP_PTS 	   = 2000;
	const VIBRATE_DURATION =  200;

	const DEBUG = false;

	function drawDebugGrid() {
		let grid = new createjs.Container();
		grid.x = R.dip(-1);
		grid.y = R.dip(-1);

		let block = FiguresFactory.getInstance().produce().getChildAt(0);

		block.color = R.colors.WHITE;
		block.alpha = 0.3;
		block.setup();

		for (let i=0; i < this.width / R.dimen.BLOCK; ++i) {
			for (let j=0; j < this.height / R.dimen.BLOCK; ++j) {
				let b = block.clone();
				b.x = i * R.dimen.BLOCK;
				b.y = j * R.dimen.BLOCK;
				grid.addChild(b);
			}
		}
		this.stage.addChild(grid);
	}

	class BlocksMap {
		constructor() {
			this.data = {};
		}

		add(blocks) {
			blocks.forEach(block => {
				let pt = block.localToGlobal(block.center.x, block.center.y);
				pt = { x: Math.round(pt.x), y: Math.round(pt.y) };

				this.data[ pt.y ] = this.data[ pt.y ] || {};
				this.data[ pt.y ][ pt.x ] = block;
			});
		}

		getLine(y) {
			return this.data[ Math.round(y) ] || {};
		}

		remove(y) {
			y = Math.round(y);

			this.data[y] = null;

			this.shift(y);
		}

		clear() {
			this.data = {};
		}

		shift(y) {
			let map = {};
			const keys = Object.keys(this.data);

			let above = keys.filter(key => ~~key < y);

			above.forEach(a => {

				let line = this.getLine(a);

				for (let x in line) {
					let block = line[x];

					switch (block.parent.rotation) {
					    case   0: block.y += R.dimen.BLOCK; break;
					    case  90: block.x += block.parent.scaleX*R.dimen.BLOCK; break;
					    case 180: block.y -= R.dimen.BLOCK; break;
					    case 270: block.x -= block.parent.scaleX*R.dimen.BLOCK; break;
					}
					
					block.parent.updateBounds();
				}

				map[~~a + R.dimen.BLOCK] = line;
				this.data[a] = null;
			});

			Object.assign(this.data, map);
		}

		toString() {
			let t = '';

			for ( let i in this.data ) {
				let keys = Object.keys(this.data[i] || {}).map(k => Util.str_pad(k, ' ', 3));
		  		t += Util.str_pad(i, ' ', 3) + ':' + keys.join(',') + ' (' + keys.length  + ')' + '\n';
			}

			return t;
		}
	}
	
	class Tetris {
		constructor(canvas) {
			canvas.width = (R.dimen.FIELD_W + R.dimen.SIDEBAR_W) * R.dimen.BLOCK + R.dimen.STROKE*0.5;
			canvas.height = R.dimen.FIELD_H * R.dimen.BLOCK + R.dimen.STROKE;

			this.stage = new createjs.Stage(canvas);
			this.stage.snapToPixelEnabled = true;
			this.stage.enableMouseOver(10);

			createjs.Touch.enable(this.stage);
			createjs.Sound.alternateExtensions = ["ogg"];

			this.field = new createjs.Container();
			this.placeholder = new createjs.Container();
			this.sidebar = new createjs.Container();

			this.level = 0;
			this.paused = false;
			this.stopped = false;
			
			this.level_label = null;
			this.lines = null;
			this.score = null;
			this.hiscore = null;
			this.overlay = null;

			this.soundToggle = null;

			this.map = new BlocksMap();

			this.bindEvents();
			this.restart();
		}

		static start(canvas) {
			if (instance === null) {
				instance = new Tetris(canvas);
			}
			return instance;
		}

		loadResources() {
			if ( queue === null ) {
				let preferXHR = window.location.protocol.indexOf("http") === 0;

				queue = new createjs.LoadQueue(preferXHR);
				queue.addEventListener('complete', () => onResourcesLoaded.call(this));
    			queue.installPlugin(createjs.Sound);

				queue.loadManifest([
					R.img.SOUND_ON, 
					R.img.SOUND_OFF,
					R.audio.FALL,
					R.audio.LEVELUP,
					R.audio.REMOVE,
					R.audio.GAMEOVER
				]);
			}
			return queue;
		}

		pause() {
			createjs.Ticker.removeAllEventListeners("tick");
			this.paused = true;
			this.showPauseOverlay();
		}

		unpause() {
			createjs.Ticker.on("tick", (event) => this.tick(event));
			this.paused = false;
			this.hidePauseOverlay();
		}

		restart() {
			this.stopped = false;

			this.pause();

			this.field.removeAllChildren();
			this.placeholder.removeAllChildren();
			this.sidebar.removeAllChildren();
			this.stage.removeAllChildren();

			this.map.clear();
			this.setupGUI();
			
			this.next = FiguresFactory.getInstance().produce();
			this.current = FiguresFactory.getInstance().produce();

			this.field.updateCache();
			this.sidebar.updateCache();
			this.stage.update();

			this.level = 0;
			this.updateTicker();

			this.unpause();
		}

		stop() {
			createjs.Sound.play(R.audio.GAMEOVER.id);

			this.stopped = true;
			this.pause();
			this.showFinalScore();
			this.stage.update();
		}

		updateTicker() {
			createjs.Ticker.interval = Math.ceil( INTERVAL * Math.pow(SPEED_K, this.level) );
		}

		get height() {
			return this.stage.canvas.height;
		}

		get width() {
			return this.stage.canvas.width;
		}

		get fieldWidth() {
			return R.dimen.FIELD_W * R.dimen.BLOCK;
		}

		get sidebarWidth() {
			return this.width - this.fieldWidth;
		}

		set current(figure) {
			figure.x = this.fieldWidth / 2;
			figure.y = 0;
			
			this.placeholder.addChild(figure);

			_current = figure;
		}

		get current() {
			return _current;
		}

		set next(figure) {
			figure.x = this.fieldWidth + this.sidebarWidth / 2 - figure.width / 2;
			figure.y = R.dip(50);

			this.stage.addChild(figure);

			_next = figure;
		}

		get next() {
			return _next;
		}

		setupGUI() {
			if (DEBUG) {
				drawDebugGrid.call(this);
			}

			this.field.set({x: R.dip(-1), y: R.dip(-1)});
			this.stage.addChild(this.field);

			//cache field
			this.field.cache(R.dip(1), R.dip(1), this.fieldWidth + R.dimen.STROKE, this.height);

			this.placeholder.set({x: R.dip(-1), y: R.dip(-1)});
			this.stage.addChild(this.placeholder);

			this.sidebar.set({x: this.fieldWidth + R.dimen.STROKE, y: 0});
			this.stage.addChild(this.sidebar);
			
			let rect = new createjs.Shape();
			rect.graphics.beginFill(R.colors.GRAY).drawRect(0, 0, this.sidebarWidth, this.height);
			this.sidebar.addChild(rect);

			this.setText();

			if (this.soundToggle !== null) {
				this.sidebar.addChild(this.soundToggle);
			}

			// cache sidebar
			this.sidebar.cache(0, 0, this.sidebarWidth, this.height);
		}

		showPauseOverlay() {
			if ( this.overlay !== null ) {
				this.stage.addChild(this.overlay);
				return;
			}

			this.overlay = new PauseContainer(this.width, this.height);
			
			this.overlay.text = R.strings.PAUSED;
			this.overlay.hint = !createjs.Touch.isSupported() ? R.strings.PAUSE_HINT : R.strings.PAUSE_HINT_TAP;

			this.overlay.updateCache();

			this.stage.addChild(this.overlay);
		}

		hidePauseOverlay() {
			this.stage.removeChild(this.overlay);
		}

		showFinalScore() {
			if ( this.overlay === null ) {
				return;
			}

			this.overlay.inverted = true;

			this.overlay.text = [R.strings.FINAL_SCORE, parseInt(this.score.text)].join('\n');
			this.overlay.hint = (!createjs.Touch.isSupported()) ? R.strings.RESTART_HINT : R.strings.RESTART_HINT_TAP;

			this.overlay.updateCache();
		}

		hideFinalScore() {
			if (this.overlay !== null) {

				this.overlay.inverted = false;
				
				this.overlay.text = R.strings.PAUSED;
				this.overlay.hint = (!createjs.Touch.isSupported()) ? R.strings.PAUSE_HINT : R.strings.PAUSE_HINT_TAP;

				this.overlay.updateCache();
			}
			this.restart();
		}

		bindEvents() {
			document.onkeydown = (e) => this.handleKeyDown(e);

			if ( createjs.Touch.isSupported() ) {

				let hammer = new Hammer.Manager(this.stage.canvas, {
					recognizers: [
						[Hammer.Tap],
						[Hammer.Press],
						[Hammer.Pan, { direction: Hammer.DIRECTION_ALL }]
					]
				});

				hammer.on('tap', e => {
					if (this.stopped) {
						this.hideFinalScore();
						return;
					}

					if (this.paused) {
						return;
					}

					// exit if gui button was clicked
					if ( this.soundToggle !== null ) {
						let pt = this.soundToggle.globalToLocal(this.stage.mouseX, this.stage.mouseY);
						if ( this.soundToggle.hitTest(pt.x, pt.y) ) {
							return;
						}
					}

					this.fallDown();
					this.stage.update();
				});

				hammer.on('press', e => {
					if (this.stopped) {
						return;
					}

					Util.vibrate(VIBRATE_DURATION);
					!this.paused ? this.pause() : this.unpause();
					this.stage.update();
				});

				let x0 = 0;
				let y0 = 0;

				hammer.on('panend', e => {
					x0 = null;
					y0 = null;
				});

				hammer.on('panstart', e => {
					x0 = 0;
					y0 = 0;
				});

				hammer.on('panmove', e => {
					if (this.paused) {
						return;
					}

					if (x0 == null || y0 == null) {
						return;
					}

					let movedX = Math.abs(x0 - e.deltaX) >= 29;
					let movedY = Math.abs(y0 - e.deltaY) >= 29;

					if ( !(movedX || movedY) ) {
						return;
					}

					x0 = e.deltaX;
					y0 = e.deltaY;

					switch (e.direction) {
						case Hammer.DIRECTION_LEFT:
							movedX && this.moveLeft();
							break;

						case Hammer.DIRECTION_RIGHT:
							movedX && this.moveRight();
							break;

						case Hammer.DIRECTION_DOWN:
							movedY && this.moveDown();
							break;

						case Hammer.DIRECTION_UP:
							if (movedY) {
								x0 = null;
								y0 = null;
								this.rotate();
							}
							break;
					}

					this.stage.update();
				});
			}
		}

		setText() {
			const offset = this.height / 3;

			let strings = [
				{ text: R.strings.NEXT, size: R.dimen.TEXT_BIG, y: R.dip(20) },
				{ text: R.strings.LEVEL, size: R.dimen.TEXT_BIG, y: offset + R.dip(20) },
				{ text: Util.str_pad(1, '0', R.strings.ZEROS.length), size: R.dimen.TEXT_SMALL, y: offset + R.dip(40), label: "level_label" },
				{ text: R.strings.LINES, size: R.dimen.TEXT_BIG, y: offset + R.dip(60) },
				{ text: R.strings.ZEROS, size: R.dimen.TEXT_SMALL, y: offset + R.dip(80), label: "lines" },
				{ text: R.strings.SCORE, size: R.dimen.TEXT_BIG, y: offset + R.dip(100) },
				{ text: R.strings.ZEROS, size: R.dimen.TEXT_SMALL, y: offset + R.dip(125), label: "score" },
				{ text: R.strings.HISCORE, size: R.dimen.TEXT_BIG, y: offset + R.dip(140) },
				{ text: R.strings.ZEROS, size: R.dimen.TEXT_SMALL, y: offset + R.dip(170), label: "hiscore" }
			];

			const x = this.sidebarWidth / 2;

			strings.forEach((s, i) => {
				let t = new createjs.Text(s.text, s.size, R.colors.WHITE);
				let b = t.getBounds();
				t.set({
					x: x - b.width / 2,
					y: i*b.height + s.y
				});

				this.sidebar.addChild(t);

				if ( s.label ) {
					this[ s.label ] = t;
				}
			});

			if ( Util.storageAvailable('localStorage') ) {
				let hiscore = window.localStorage.getItem('hiscore');
				if ( hiscore ) {
					this.hiscore.text = Util.str_pad(hiscore, '0', R.strings.ZEROS.length);
				}
			}
		}

		handleKeyDown(event) {
			event = event || window.event;

			if ( this.stopped ) {
				if ( event.keyCode == R.keys.SPACE ) {
					this.hideFinalScore();
				}
				return;
			}

			if ( this.paused ) {
				if ( event.keyCode == R.keys.ESC ) {
					this.unpause();
					this.stage.update();
				}
				return;
			}

			switch (event.keyCode) {
				case R.keys.UP:
					this.rotate();
					break;

				case R.keys.LEFT:
					this.moveLeft();
					break;

				case R.keys.RIGHT:
					this.moveRight();
					break;

				case R.keys.DOWN:
					this.moveDown();
					break;

				case R.keys.SPACE:
					this.fallDown();
					break;

				case R.keys.ESC:
					this.pause();
					break;
			}

			this.stage.update();
		}

		hitTest() {
			const blocks = this.current.numChildren;

			for (let i = 0; i < blocks; ++i) {
				let b = this.current.getChildAt(i);
				let pt = b.localToGlobal(b.center.x, b.center.y);
				
				pt = { x: Math.round(pt.x), y: Math.round(pt.y) };

				if ( this.map.data[ pt.y ] && this.map.data[ pt.y ][ pt.x ] ) {
					return true;
				}
			}

			return false;
		}

		tick(event) {
			this.moveDown();

			this.stage.update(event);
		}

		swap() {
			this.placeholder.removeChildAt(0);
			this.field.addChild(this.current);

			this.map.add(this.current.children);

			this.removeLines();
			
			this.field.updateCache();
			this.stage.update();

			this.current = this.next;
			this.next = FiguresFactory.getInstance().produce();

			if ( this.hitTest() ) {
				this.stop();
			}
		}

		rotate() {
			this.current.rotate();

			let threshold = this.fieldWidth - this.current.width + R.dimen.STROKE * 2;
			if ( this.current.x >= threshold ) {
				this.current.x = threshold;
			}

			if ( this.hitTest() ) {
				this.current.rotate(false);
			}
		}

		moveDown() {
			let threshold = this.height - this.current.height + R.dimen.STROKE;

			this.current.y += R.dimen.BLOCK;

			if ( this.hitTest() ) {
				this.current.y -= R.dimen.BLOCK;
				this.swap();
				createjs.Sound.play(R.audio.FALL.id);
			}
			else if ( this.current.y > threshold) {
				this.current.y = threshold; // stick to bottom
				
				this.swap();
				createjs.Sound.play(R.audio.FALL.id);
			}
		}

		fallDown() {
			let threshold = this.height - this.current.height + R.dimen.STROKE;

			while ( !this.hitTest() ) {
				this.current.y += R.dimen.BLOCK;
				if ( this.current.y >= threshold + R.dimen.BLOCK) {
					this.current.y = threshold + R.dimen.BLOCK;
					break;
				}
			}

			this.current.y -= R.dimen.BLOCK;
			this.swap();
			createjs.Sound.play(R.audio.FALL.id);
		}

		moveLeft() {
			const x = this.current.x;

			if ( x > 0) {
				this.current.x -= R.dimen.BLOCK;
				
				if ( this.hitTest() ) {
					this.current.x = x;
				}
			}
		}

		moveRight() {
			const x = this.current.x;

			if ( x < this.fieldWidth - this.current.width ) {
				this.current.x += R.dimen.BLOCK;

				if ( this.hitTest() ) {
					this.current.x = x;
				}
			}
		}

		removeLines() {
			const num = this.current.numChildren;
			let lines = [];
			let ys = [];
			let set = [];

			for ( let i = 0; i < num; ++i ) {
				let block = this.current.getChildAt(i);

				let pt = block.localToGlobal(block.center.x, block.center.y);

				if ( set.indexOf( Math.round(pt.y) ) !== -1 ) {
					continue;
				}

				set.push( Math.round(pt.y) );

				let line = this.map.getLine(pt.y);
				let rows = Object.keys( line );

				if (rows.length == R.dimen.FIELD_W) {
					lines.push(line);
					ys.push(pt.y);
				}
			}

			let points = 0;

			ys.sort( (a,b) => a-b ).forEach(y => this.map.remove(y));

			lines.forEach( line => {

				for (let x in line) {
					let block = line[x];

					let f = block.parent;
					f.removeChild(block);
					f.updateCache();

					if ( f.numChildren == 0 ) {
						f.parent.removeChild(f);
					}
				}

				points = points * 2 + 100;
			});

			if (points > 0) {
				createjs.Sound.play(R.audio.REMOVE.id);
				this.updateScore(points, lines.length);
			}
		}

		updateScore(points, lines) {
			points = points + parseInt(this.score.text);
			let text = Util.str_pad(points, '0', R.strings.ZEROS.length);
			
			this.score.text = text;

			if ( points > parseInt( this.hiscore.text ) ) {
				this.hiscore.text = text;

				if ( Util.storageAvailable('localStorage') ) {
					window.localStorage.setItem('hiscore', points);
				}
			}

			lines = lines + parseInt(this.lines.text);
			this.lines.text = Util.str_pad(lines, '0', R.strings.ZEROS.length);

			if ( points / LEVELUP_PTS >= this.level+1 ) {
				this.levelUp();
			}

			this.sidebar.updateCache();
		}

		levelUp() {
			++this.level;

			this.level_label.text = Util.str_pad(this.level + 1, '0', R.strings.ZEROS.length);

			createjs.Sound.play(R.audio.LEVELUP.id);
			this.updateTicker();
		}
	}

	function onResourcesLoaded() {
		createjs.Sound.muted = true;

		let sound_off = new createjs.Bitmap(queue.getResult(R.img.SOUND_OFF.id));
		let sound_on = new createjs.Bitmap(queue.getResult(R.img.SOUND_ON.id));

		this.soundToggle = new ToggleButton(sound_on, sound_off);

		let b = this.soundToggle.getBounds();

		this.soundToggle.set({
			x: this.sidebarWidth / 2 - b.width / 2,
			y: this.height - b.height - R.dip(40)
		});

		this.soundToggle.on('click', e => {
			createjs.Sound.muted = !createjs.Sound.muted;
			this.soundToggle.checked = !createjs.Sound.muted;
			this.sidebar.updateCache();
			this.stage.update();
		});

		this.sidebar.addChild(this.soundToggle);
		this.sidebar.updateCache();
	}

	return Tetris;
})();

window.Tetris = Tetris;