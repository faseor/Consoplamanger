function Textcontainer(width, FNT_SEARCHBOX, is_erase_on_delete_keycode, init_text) {
	let caret = { pos: 0, median: 0 };
	let range = { start: 0, end: 0};
	let txt = [];
	let drawable_text = "";
	let caret_dimension = { x: 0, w: 1 };
	let tmp_img = gdi.CreateImage(1,1);
	let tmp_g = tmp_img.GetGraphics();
	
	
	if (init_text) {
		txt = init_text.split("");
		caret.pos = txt.length;
		caret.median = caret.pos;
		recalcTextCoordinates();
		recalcCaretCoordinates();
	}
	
	function receiveChar(char) {
		caret.pos = util.min(caret.pos, caret.median);
		txt.splice(caret.pos, Math.abs(caret.pos - caret.median), char);
		caret.pos++;
		caret.median = caret.pos;
		recalcTextCoordinates();
		recalcCaretCoordinates();
	}
	
	function receiveKey(key) {
		if (!txt.length) return;
		switch (key) {
			case 8: { // backspace
				if (caret.pos - caret.median) {
					let start = util.min(caret.pos, caret.median);
					txt.splice(start, Math.abs(caret.pos - caret.median));
					caret.pos = start;
				} else if (caret.pos > 0) {
					caret.pos--;
					txt.splice(caret.pos, 1);
				}
				if (caret.median !== caret.pos) {
					caret.median = caret.pos;
				}
			} break;
			case 46: { // delete
				if (caret.pos - caret.median) {
					caret.pos = util.min(caret.pos, caret.median);
					txt.splice(caret.pos, Math.abs(caret.pos - caret.median));
				} else if (is_erase_on_delete_keycode) {
					txt = [];
					caret.pos = 0;
				} else if (caret.pos < txt.length) {
					txt.splice(caret.pos, 1);
				}
				if (caret.median !== caret.pos) {
					caret.median = caret.pos;
				}
			} break;
			case 37: { // left
				if (util.is_shift_pressed) {
					caret.pos = util.max(caret.pos - 1, 0);
				} else {
					if (caret.pos - caret.median) {
						caret.pos = util.min(caret.pos, caret.median)
					} else {
						caret.pos = util.max(caret.pos - 1, 0);
					}
					if (caret.median !== caret.pos) {
						caret.median = caret.pos;
					}
				}
			} break;
			case 39: { // right
				if (util.is_shift_pressed) {
					caret.pos = util.min(caret.pos + 1, txt.length);
				} else {
					if (caret.pos - caret.median) {
						caret.pos = util.max(caret.pos, caret.median)
					} else {
						caret.pos = util.min(caret.pos + 1, txt.length);
					}
					if (caret.median !== caret.pos) {
						caret.median = caret.pos;
					}
				}
			} break;
			default: {
				return;
			}
		}
		recalcTextCoordinates();
		recalcCaretCoordinates();
	}
	
	function recalcTextCoordinates() {
		function calculateRangeStart() {
			range.start = Math.max(range.end - Math.round(width / (text_w / text.length)), 0);
			while (util.textWidth(text.substring(range.start, range.end), FNT_SEARCHBOX, tmp_g) < width) {
				range.start--;
				if (range.start < 0) {
					range.start = 0;
					break;
				}
			}
			while (util.textWidth(text.substring(range.start, range.end), FNT_SEARCHBOX, tmp_g) > width) {
				range.start++;
			}
		}
		function calculateRangeEnd() {
			range.end = Math.min(range.start + Math.round(width / (text_w / text.length)), text.length);
			while (util.textWidth(text.substring(range.start, range.end), FNT_SEARCHBOX, tmp_g) < width) {
				range.end++;
				if (range.end > text.length) {
					range.end = text.length;
					break;
				}
			}
			while (util.textWidth(text.substring(range.start, range.end), FNT_SEARCHBOX, tmp_g) > width) {
				range.end--;
			}
		}
		let text = txt.join("");
		if (!text.length) {
			drawable_text = "";
			range.start = 0;
			range.end = 0;
			return;
		}
		let text_w = util.textWidth(text, FNT_SEARCHBOX, tmp_g);
		if (text_w < width) {
			drawable_text = text;
			range.start = 0;
			range.end = text.length;
		} else {
			if (caret.pos < range.start) {
				range.start = caret.pos;
				calculateRangeEnd();
			} else if (caret.pos > range.end) {
				range.end = caret.pos;
				calculateRangeStart();
			} else if (range.end > text.length) {
				range.end = text.length
				calculateRangeStart();
			} else {
				calculateRangeEnd();
			}
		}
		drawable_text = text.substring(range.start, range.end);
	}
	
	function recalcCaretCoordinates() {
		let lbound = util.max(util.min(caret.pos, caret.median) - range.start, 0);
		let rbound = util.min(util.max(caret.pos, caret.median), range.end) - range.start;
		let text = drawable_text.substring(0, lbound);
		caret_dimension.x = text.length ? util.textWidth(text, FNT_SEARCHBOX, tmp_g) : 0;
		let select_text = drawable_text.substring(lbound, rbound);
		caret_dimension.w = select_text.length ? util.textWidth(select_text, FNT_SEARCHBOX, tmp_g) : 1;
	}
	
	function eraseText() {
		txt = [];
		drawable_text = "";
		range.start = 0;
		range.end = 0;
		caret.pos = 0;
		caret.median = 0;
		caret_dimension.x = 0;
		caret_dimension.w = 1;
	}
	
	if (this) {
		this.onChar = receiveChar;
		this.onKey = receiveKey;
		this.deleteAll = eraseText;
		Object.defineProperty(this, "txt", {
			get: function() {
				return drawable_text;
			},
			set: function(value) {
				txt = value.split("");
				caret.pos = txt.length;
				caret.median = caret.pos;
				recalcTextCoordinates();
				recalcCaretCoordinates();
			},
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(this, "caret", {
			get: function() {
				return caret_dimension;
			},
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(this, "length", {
			get: function() {
				return txt.length;
			},
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(this, "full_text", {
			get: function() {
				return txt.join("");
			},
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(this, "width", {
			get: function() {
				return width;
			},
			enumerable: true,
			configurable: false
		});
	} else {
		let self = {
			onChar: receiveChar,
			onKey: receiveKey,
			deleteAll: eraseText,
			get txt() { return drawable_text; },
			set txt(value) {
				txt = value.split("");
				caret.pos = txt.length;
				caret.median = caret.pos;
				recalcTextCoordinates();
				recalcCaretCoordinates();
			},
			get caret() { return caret_dimension; },
			get length() { return txt.length; },
			get full_text() { return txt.join(""); },
			get width() { return width; }
		}
		return self;
	}
}