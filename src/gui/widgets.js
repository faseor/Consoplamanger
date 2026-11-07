class Widgets {
	
	get length() { return this._widgets.length; }
	
	constructor() {
		this._widgets = [];
		this._is_single = [];
	}

	add(value) {
		if (value instanceof Widget) {
			this._is_single.push(true);
			this._widgets.push(value);
		} else if (value instanceof Widgets) {
			this._is_single.push(false);
			this._widgets.push(value);
		} else {
			throw new Error("The object to be added must be an instance of the Widget class.");
		}
	}
	
	del(index) {
		this._widgets.splice(index, 1);
	}
	
	del_all() {
		this._widgets.length = 0;
	}
	
	*[Symbol.iterator]() {
		for (let i = 0; i < this.length; i++) {
			if (this._is_single[i]) {
				yield this._widgets[i];
			} else {
				yield* this._widgets[i];
			}
		}
	}
	
	*fromStart(i) {
		if (!i) i = 0;
		for (; i < this.length; i++) {
			if (this._is_single[i]) {
				yield this._widgets[i];
			} else {
				yield* this._widgets[i];
			}
		}
	}

	$XY(x, y) {
		for (const wjt of this) {
			if (
				wjt.x < x &&
				wjt.a > x &&
				wjt.y < y &&
				wjt.b > y
			) {
				return wjt;
			}
		}
	}
}