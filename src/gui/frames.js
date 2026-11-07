/*

*/
function Frames() {

	let self = null;
	let frames = null;
	let frames_by_size = null;
	let frames_by_paint = null;
	let default_frame = null;
	
	class Self {
		
		get length() { return frames.length; }
		
		constructor() {
			frames = new Array(4);
			frames_by_size = new Array(4);
			frames_by_paint = new Array(4);
			default_frame = new Frame();
		}
		
		set length(value) {
			frames.length = value;
		}
		
		add(value) {
			if (value instanceof Frame) {
				let [ order_ofmouse, order_ofsize, order_ofpaint ] = [ ...value.order_indexes ];
				frames[order_ofmouse] = value;
				frames_by_size[order_ofsize] = value;
				frames_by_paint[order_ofpaint] = value;
			} else {
				throw new Error("The object to be added must be an instance of the Frame class.");
			}
		}
		
		setFrame(value) {
			if (value instanceof Frame) {
				let [ order_ofmouse, order_ofsize, order_ofpaint ] = [ ...value.order_indexes ];
				frames[order_ofmouse] = value;
				frames_by_size[order_ofsize] = value;
				frames_by_paint[order_ofpaint] = value;
			} else {
				throw new Error("The object to be added must be an instance of the Frame class.");
			}
		}
		
		*ofSize() {
			for (let frm of frames_by_size) {
				yield frm ? frm : default_frame;
			}
		}
		
		*ofPaint() {
			for (let frm of frames_by_paint) {
				yield frm ? frm : default_frame;
			}
		}
		
		*[Symbol.iterator]() {
			for (let frm of frames) {
				yield frm ? frm : default_frame;
			}
		}
		
		$XY(x, y, i) {
			if (i) {
				for (let frm = frames[i]; i < frames.length; frm = frames[++i]) {
					if (
						frm.x < x &&
						frm.a > x &&
						frm.y < y &&
						frm.b > y
					) {
						return frm;
					}
				}
			} else {
				for (const frm of this) {
					if (
						frm.x < x &&
						frm.a > x &&
						frm.y < y &&
						frm.b > y
					) {
						return frm;
					}
				}
			}
		}
	}
	
	self = new Self();
	return self;
};