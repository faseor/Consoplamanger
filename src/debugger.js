function Debugger(is_enable) {
	
	const FONT_CAPTION = gdi.Font("Arial", 12, 0);
	const FONT_TEXT = gdi.Font("Verdana", 12, 0);
	const COLOR_BACKGROUND = 0xff000000;
	const COLOR_FOREGROUND1 = 0xff000000;
	const COLOR_FOREGROUND2 = 0xff0044ff;
	const COLOR_CAPTION = 0xff888888;
	let self = null;
	let osd_lines;
	let osd_color = 0xff000000;
	let osd_color_stoper;
	
	class Self {
		constructor() {
			osd_lines = new Map();
		}
		
		PRINT(...args) {
			console.log(toStrings(...args).join(", "));
		}
		
		ASSERT(proviso, msg) {
			if (!proviso) throw new Error(msg);
		}
		
		OSD(varsindex, ...vars) {
			osd_color = COLOR_FOREGROUND2;
			if (osd_lines.has(varsindex)) {
				let [stop_prev_timeout, _] = osd_lines.get(varsindex);
				stop_prev_timeout();
			}
			let stop_timeout = util.timeout(
				() => {
					osd_lines.delete(varsindex);
					util.repaint();
				}, 5000
			);
			osd_lines.set(varsindex, [stop_timeout, toStrings(...vars)]);
			if (osd_color_stoper) { osd_color_stoper(); }
			osd_color_stoper = util.timeout(
				() => {
					osd_color = COLOR_FOREGROUND1;
					util.repaint();
				}, 200
			);
			util.repaint();
		}
		
		drawOSD(g) {
			if (isHasOsdLines()) {
				let height = 0;
				for (const [caption, strings, color] of osdEntries()) {
					let [ w, h ] = util.textDimension(strings, FONT_TEXT, g);
					w = util.max(util.textWidth(caption, FONT_CAPTION, g), w) + 20;
					g.FillSolidRect(
						0, height, w, 20,
						0x88000000
					);
					g.DrawString(
						caption,
						FONT_CAPTION, 0xFFffffff,
						0, height, w, 20,
						util.stringFormat(1, 1)
					);
					g.FillSolidRect(
						0, height + 20, w, h,
						0xff888888
					);
					g.DrawString(
						strings.join("\n"),
						FONT_TEXT, color,
						0, height + 20, w, h,
						util.stringFormat(1, 0)
					);
					height += h + 20;
				}
			}
		}
	};
	
	function isHasOsdLines() {
		return !!osd_lines.size;
	}
		
	function* osdEntries() {
		for (const [key, [ _ , value] ] of osd_lines) {
			yield [ key, value, osd_color ];
		}
	}
	
	function classof(o) {
		return Object.prototype.toString.call(o).slice(8, -1);
	}
	
	function toStrings(...args) {
		let result = [];
		for (const arg of args) {
			switch (typeof arg) {
				case "object":
					let tmp = "#"+classof(arg)+": ";
					for (const prop in arg) {
						tmp += prop + "=" + arg[prop] + ", ";
					}
					result.push(tmp);
					break;
				case "number":
					result.push("#num: " + arg);
					break;
				case "boolean":
					result.push("#bool: " + arg);
					break;
				case "string":
					result.push("#str: " + arg);
					break;
				case "bigint":
					result.push("#big: " + arg);
					break;
				case "symbol":
					result.push("#sym: " + arg);
					break;
				case "function":
					result.push("#func: " + arg);
					break;
				case "undefined":
					result.push("#undefined");
					break;
				default:
					result.push("##: " + arg);
					break;
			}
		}
		return result;
	}
	
	self = is_enable ? new Self() : {
		PRINT() {},
		ASSERT() {},
		OSD() {},
		drawOSD() {}
	};
	isHasOsdLines = isHasOsdLines.bind(self);
	osdEntries = osdEntries.bind(self);
	return self;
};