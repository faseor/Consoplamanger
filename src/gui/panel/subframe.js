class Subframe {
	
	get x() { return this._x; }
	get w() { return this._w; }
	get a() { return this._a; }
	get y() { return this._y; }
	get h() { return this._h; }
	get b() { return this._b; }
	get widgets() { return this._wjts; }
	
	constructor() {
		this._x = 0;
		this._y = 0;
		this._w = 0;
		this._h = 0;
		this._a = 0;
		this._b = 0;
		this._wjts = new Widgets();
	}
	
	set size(value) {
		let [ w, h ] = [ ...value ];
		this._w = w;
		this._h = h;
		this._a = this._x + this._w;
		this._b = this._y + this._h;
	}
	
	set pos(value) {
		let [ x, y ] = [ ...value ];
		this._x = x;
		this._y = y;
		this._a = this._x + this._w;
		this._b = this._y + this._h;
	}
	
	set widgets(value) { this._wjts = value; }
	
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
	
	onSize() {}
	
	onUpdate() {}
	
	onFlush() {}
	
	onDraw() {}

}