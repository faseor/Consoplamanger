class Widget {
	
	get STATE_NORMAL() { return 0; }
	get STATE_HOVER() { return 1; }
	get STATE_ACTIVE() { return 2; }
	
	get x() { return this._x; }
	get w() { return this._w; }
	get a() { return this._a; }
	get y() { return this._y; }
	get h() { return this._h; }
	get b() { return this._b; }
	get state() { return this._state; }
	get isNormal() { return this._state === this.STATE_NORMAL; }
	get isHover() { return this._state === this.STATE_HOVER; }
	get isActive() { return this._state === this.STATE_ACTIVE; }
	
	constructor() {
		this._x = 0;
		this._y = 0;
		this._w = 0;
		this._h = 0;
		this._a = 0;
		this._b = 0;
		this.state = this.STATE_NORMAL;
	}
	
	set state(value) {
		switch (value) {
			case this.STATE_NORMAL:
			case this.STATE_HOVER:
			case this.STATE_ACTIVE:
				this._state = value; 
				break;
			default:  throw new Error(`Illegal argument for widget. Argument - ${value}, widget coordinates - ${this}`);
		}
	}
	
	set size(value) {
		let [ w, h ] = [ ...value ];
		this._w = Math.round(w);
		this._h = Math.round(h);
		this._a = this._x + this._w;
		this._b = this._y + this._h;
	}
	
	set pos(value) {
		let [ x, y ] = [ ...value ];
		this._x = Math.round(x);
		this._y = Math.round(y);
		this._a = this._x + this._w;
		this._b = this._y + this._h;
	}
		
	$XY(x, y) {
		if (
			this._x < x &&
			this._a > x &&
			this._y < y &&
			this._b > y
		) {
			return true;
		}
	}
	
	onLoose() {
	}
	
	onEnter(x, y) {
	}
	
	onHover(x, y) {
	}
	
	onMove(x, y) {
	}
	
	onLeftButton(x, y) {
	}
	
	onClick(x, y) {
	}
	
	onRightButton(x, y) {			
	}
	
	onMenu(x, y) {
	}
	
	onDoubleClick(x, y) {
	}
	
	onFocusGet() {
	}
	
	onFocusLost() {
	}
}
