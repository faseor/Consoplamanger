/*
*
*/
function Util(usr) {
	
	let self = null;
	let colorpattern1 = /[^ABC]RGB\(.+\)/i;
	let colorpattern2 = /RGBA\(.+\)/i;
	let colorpattern3 = /ARGB\(.+\)/i;
	let booleanpattern = /true|yes|1/i;
	let curdpi = 160;
	let repaint_count = 0;
	let tasks = null;
	let colordefines = {
		aliceblue: 0xfff0f8ff,
		antiquewhite: 0xfffaebd7,
		aqua: 0xff00ffff,
		aquamarine: 0xff7fffd4,
		azure: 0xfff0ffff,
		beige: 0xfff5f5dc,
		bisque: 0xffffe4c4,
		black: 0xff000000,
		blanchedalmond: 0xffffebcd,
		blue: 0xff0000ff,
		blueviolet: 0xff8a2be2,
		brown: 0xffa52a2a,
		burlywood: 0xffdeb887,
		cadetblue: 0xff5f9ea0,
		chartreuse: 0xff7fff00,
		chocolate: 0xffd2691e,
		coral: 0xffff7f50,
		cornflowerblue: 0xff6495ed,
		cornsilk: 0xfffff8dc,
		crimson: 0xffdc143c,
		cyan: 0xff00ffff,
		darkblue: 0xff00008b,
		darkcyan: 0xff008b8b,
		darkgoldenrod: 0xffb8860b,
		darkgray: 0xffa9a9a9,
		darkgreen: 0xff006400,
		darkkhaki: 0xffbdb76b,
		darkmagenta: 0xff8b008b,
		darkolivegreen: 0xff556b2f,
		darkorange: 0xffff8c00,
		darkorchid: 0xff9932cc,
		darkred: 0xff8b0000,
		darksalmon: 0xffe9967a,
		darkseagreen: 0xff8fbc8b,
		darkslateblue: 0xff483d8b,
		darkslategray: 0xff2f4f4f,
		darkturquoise: 0xff00ced1,
		darkviolet: 0xff9400d3,
		deeppink: 0xffff1493,
		deepskyblue: 0xff00bfff,
		dimgray: 0xff696969,
		dodgerblue: 0xff1e90ff,
		firebrick: 0xffb22222,
		floralwhite: 0xfffffaf0,
		forestgreen: 0xff228b22,
		fuchsia: 0xffff00ff,
		gainsboro: 0xffdcdcdc,
		ghostwhite: 0xfff8f8ff,
		gold: 0xffffd700,
		goldenrod: 0xffdaa520,
		gray: 0xff808080,
		green: 0xff008000,
		greenyellow: 0xffadff2f,
		honeydew: 0xfff0fff0,
		hotpink: 0xffff69b4,
		indianred: 0xffcd5c5c,
		indigo: 0xff4b0082,
		ivory: 0xfffffff0,
		khaki: 0xfff0e68c,
		lavender: 0xffe6e6fa,
		lavenderblush: 0xfffff0f5,
		lawngreen: 0xff7cfc00,
		lemonchiffon: 0xfffffacd,
		lightblue: 0xffadd8e6,
		lightcoral: 0xfff08080,
		lightcyan: 0xffe0ffff,
		lightgoldenrodyellow: 0xfffafad2,
		lightgray: 0xffd3d3d3,
		lightgreen: 0xff90ee90,
		lightpink: 0xffffb6c1,
		lightsalmon: 0xffffa07a,
		lightseagreen: 0xff20b2aa,
		lightskyblue: 0xff87cefa,
		lightslategray: 0xff778899,
		lightsteelblue: 0xffb0c4de,
		lightyellow: 0xffffffe0,
		lime: 0xff00ff00,
		limegreen: 0xff32cd32,
		linen: 0xfffaf0e6,
		magenta: 0xffff00ff,
		maroon: 0xff800000,
		mediumaquamarine: 0xff66cdaa,
		mediumblue: 0xff0000cd,
		mediumorchid: 0xffba55d3,
		mediumpurple: 0xff9370db,
		mediumseagreen: 0xff3cb371,
		mediumslateblue: 0xff7b68ee,
		mediumspringgreen: 0xff00fa9a,
		mediumturquoise: 0xff48d1cc,
		mediumvioletred: 0xffc71585,
		midnightblue: 0xff191970,
		mintcream: 0xfff5fffa,
		mistyrose: 0xffffe4e1,
		moccasin: 0xffffe4b5,
		navajowhite: 0xffffdead,
		navy: 0xff000080,
		oldlace: 0xfffdf5e6,
		olive: 0xff808000,
		olivedrab: 0xff6b8e23,
		orange: 0xffffa500,
		orangered: 0xffff4500,
		orchid: 0xffda70d6,
		palegoldenrod: 0xffeee8aa,
		palegreen: 0xff98fb98,
		paleturquoise: 0xffafeeee,
		palevioletred: 0xffdb7093,
		papayawhip: 0xffffefd5,
		peachpuff: 0xffffdab9,
		peru: 0xffcd853f,
		pink: 0xffffc0cb,
		plum: 0xffdda0dd,
		powderblue: 0xffb0e0e6,
		purple: 0xff800080,
		red: 0xffff0000,
		rosybrown: 0xffbc8f8f,
		royalblue: 0xff4169e1,
		saddlebrown: 0xff8b4513,
		salmon: 0xfffa8072,
		sandybrown: 0xfff4a460,
		seagreen: 0xff2e8b57,
		seashell: 0xfffff5ee,
		sienna: 0xffa0522d,
		silver: 0xffc0c0c0,
		skyblue: 0xff87ceeb,
		slateblue: 0xff6a5acd,
		slategray: 0xff708090,
		snow: 0xfffffafa,
		springgreen: 0xff00ff7f,
		steelblue: 0xff4682b4,
		tan: 0xffd2b48c,
		teal: 0xff008080,
		thistle: 0xffd8bfd8,
		tomato: 0xffff6347,
		transparent: 0x00ffffff,
		turquoise: 0xff40e0d0,
		violet: 0xffee82ee,
		wheat: 0xfff5deb3,
		white: 0xffffffff,
		whitesmoke: 0xfff5f5f5,
		yellow: 0xffffff00,
		yellowgreen: 0xff9acd32
	};
	
	class Self {
		
		get is_any_modifier_pressed() {
			return utils.IsKeyPressed(0x10) || utils.IsKeyPressed(0x11);
		}
		
		get is_shift_pressed() {
			return utils.IsKeyPressed(0x10);
		}
		
		get is_cntrl_pressed() {
			return utils.IsKeyPressed(0x11);
		}
		
		constructor() {
			/*
			curdpi = window.GetProperty("Consoplamanger.App.DotsPerInch(DPI)");
			if (curdpi) {
				curdpi = parseInt(curdpi);
			} else {
				curdpi = window.GetProperty("SYSTEM.dpi (0 = Default)");
				if (curdpi) {
					curdpi = parseInt(curdpi);
				} else {
					curdpi = Math.NaN;
				}
			}
			if (isNaN(curdpi)) {
				try {
					let ws = new ActiveXObject("WScript.Shell");
					curdpi = parseInt(ws.RegRead(
						"HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI")
					);
					if (isNaN(curdpi)) throw new Error();
				} catch(e) {
					curdpi = 96;
				}
				window.SetProperty("Consoplamanger.App.DotsPerInch(DPI)", curdpi)
			}
			curdpi = Math.max(Math.abs(curdpi), 48);
			*/
			let last_index = -1;
			let indexes = [];
			Object.defineProperty(Array.prototype, "first", {
				get: function() {
					if (this.length) {
						return this[0];
					}
					return undefined;
				},
				enumerable: false,
				configurable: false
			});
			Object.defineProperty(Array.prototype, "last", {
				get: function() {
					if (this.length) {
						return this[this.length - 1];
					}
					return undefined;
				},
				enumerable: false,
				configurable: false
			});
			Object.defineProperty(Array.prototype, "random", {
				get: function() {
					if (this.length) {
						return this[Math.round(Math.random()*(this.length - 1))];
					}
					return undefined;
				},
				enumerable: false,
				configurable: false
			});
			Object.defineProperty(Array.prototype, "random_except_last", {
				get: function() {
					if (this.length) {
						let result;
						do {
							result = Math.round(Math.random()*(this.length - 1));
						} while ((result === last_index) && (this.length > 1));
						last_index = result;
						return this[result];
					}
					return undefined;
				},
				enumerable: false,
				configurable: false
			});
			Object.defineProperty(Array.prototype, "random_except_sequence", {
				get: function() {
					if (this.length) {
						let result;
						if (!indexes.length) {
							for (let i = 0; i < this.length; ++i) {
								indexes.push(i);
							}
							do {
								result = Math.round(Math.random()*(this.length - 1));
							} while ((result === last_index) && (this.length > 1));
							last_index = result;
							return this[result];
						}
						let index = Math.round(Math.random()*(indexes.length - 1));
						last_index = indexes[index];
						result = this[indexes[index]];
						indexes.splice(index, 1);
						return result;
					}
					return undefined;
				},
				enumerable: false,
				configurable: false
			});
			tasks = new Map();
			tasks.set(0, ()=>{ throw new Error("Null task can't be call")})
			/*
			let repaint_id = setInterval(() => {
				if (repaint_count > 0) {
					for (const [ id, action, delay ] of tasks) {
						if (id) {
							action();
						}
					}
					repaint_count = 0;
					window.Repaint();
				}
			}, Math.round(1000/24));
			*/
		}
		
		repaint() {
			// repaint_count++;
			window.Repaint();
		}

		stringFormat(...args) {
			var h_align = 0, v_align = 0, trimming = 0, flags = 0;
			switch (args.length) {
				// fall-thru
				case 4:
					flags = args[3];
				case 3:
					trimming = args[2];
				case 2:
					v_align = args[1];
				case 1:
					h_align = args[0];
					break;
				default:
					return 0;
			}
			return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
		}
		
		timeout(func, time, immediate_call) {
			immediate_call && func();
			let id = setTimeout(() => { func(); id = 0; }, time);
			return () => { if (id !== 0) clearTimeout(id); }
		}
		
		repeater(func, delay, immediate_call, ...args) {
			function func_local() { func(...args); }
			immediate_call && func_local();
			let id = setInterval(func_local, delay);
			return (...new_args) => {
				(new_args.length && (args = new_args)) ||
				(id && clearInterval(id))
			}
		}
		
		repeater2(func, delay, immediate_call, ...args) {
			if (immediate_call && func(...args)) {
				return null;
			}
			let id = setInterval(() => {
				func(...args) && clearInterval(id);
			}, delay);
			return (...new_args) => {
				if (new_args.length) {
					args = new_args;
				} else {
					id = clearInterval(id);
				}
			}
		}
		
		repeater3(func, delay, immediate_call, ...args) {
			if (immediate_call && func(...args)) {
				return null;
			}
			let id = tasks.size;
			tasks.set(
				id,
				() => {
					if (func(...args)) {
						if (id) {
							tasks.delete(id);
							id = 0;
						} else {
							throw new Error("")
						}
					}
				},
				delay
			);
			return (...new_args) => {
				if (new_args.length) {
					tasks.delete(id);
					id = 0;
				}
			}
		}
		
		max(...args) {
			let result = Number.NEGATIVE_INFINITY;
			for (const arg of args) {
				let tmp = parseFloat(arg);
				if (Number.isFinite(tmp)) {
					result = Math.max(tmp, result);
				}
			}
			return result;
		}
		
		min(...args) {
			let result = Number.POSITIVE_INFINITY;
			for (const arg of args) {
				let tmp = parseFloat(arg);
				if (Number.isFinite(tmp)) {
					result = Math.min(tmp, result);
				}
			}
			return result;
		}
		
		limit(min, arg, max) {
			return this.min(this.max(arg, min), max);
		}
		
		textWidth(str, fnt, g) {
			let result = 0;
			if (!str || !fnt || (typeof str !== "string")) {
				throw new Error("Illegal argument for textHeight method");
			}
			if (str.indexOf("\n") !== -1) {
				throw new Error("Text must not include the new line symbol");
			}
			let tmp_image = null;
			if (!g) {
				tmp_image = gdi.CreateImage(1, 1);
				g = tmp_image.GetGraphics();
			}
			result = g.CalcTextWidth(str, fnt);
			if (tmp_image) {
				tmp_image.ReleaseGraphics(g);
			}
			return Math.ceil(result);
		}
		
		textHeight(str, fnt, g) {
			let result = 0;
			if (!str || !fnt || (typeof str !== "string")) {
				throw new Error("Illegal argument for textHeight method");
			}
			if (str.indexOf("\n") !== -1) {
				throw new Error("Text must not include the new line symbol");
			}
			let tmp_image = null;
			if (!g) {
				tmp_image = gdi.CreateImage(1, 1);
				g = tmp_image.GetGraphics();
			}
			result = g.CalcTextHeight(str, fnt);
			if (tmp_image) {
				tmp_image.ReleaseGraphics(g);
			}
			return Math.ceil(result);
		}
		
		textDimension(arg, fnt, g) {
			let w, h = 0;
			if (!arg || !fnt) {
				throw new Error("Illegal argument for textDimension method");
			}
			if (Array.isArray(arg)) {
				arg = arg.join("\n");
			}
			let tmp_image = null;
			if (!g) {
				tmp_image = gdi.CreateImage(1, 1);
				g = tmp_image.GetGraphics();
			}
			let info = g.MeasureString(
				arg, fnt,
				0, 0,
				g.CalcTextWidth("W", fnt)*arg.length, g.CalcTextHeight("W", fnt)*arg.length,
				0
			);
			w = info.Width;
			h = info.Height;
			if (tmp_image) {
				tmp_image.ReleaseGraphics(g);
			}
			return [ Math.ceil(w), Math.ceil(h) ];
		}
		
		*indexator(iterator) {
			function flatator(value) {
				let result = [];
				function toFlat(arr) {
					for (const tmp of arr) {
						if (
							Array.isArray(tmp)
						) {
							toFlat(tmp);
						} else {
							result.push(tmp);
						}
					}
				}
				if (
					Array.isArray(value)
				) {
					toFlat(value)
				} else {
					result.push(value)
				}
				return result;
			}
			let i = 0;
			for (const o of iterator) {
				let iter = flatator(o);
				yield [i++, ...iter];
			}
		}

		booleanProcessor(str) {
			return booleanpattern.test(str);
		}
		
		stringProcessor(str) {
			return str.replace(
				/\\u([A-Fa-f0-9]+)/g,
				function(str, p1) {
					return String.fromCharCode(parseInt(p1, 16));
				}
			);
		}
		
		colorProcessor(str) {
			var tmp = parseInt(str);
			if(isNaN(tmp)) {
				tmp = colordefines[str.toLowerCase()];
				if(!tmp) {
					if(colorpattern1.test(str)) {
						str = str.substring(4, str.length - 1);
						tmp = str.split(/,\s*/);
						if(tmp.length > 2) {
							for(var i in tmp) {
								tmp[i] = parseInt(tmp[i]);
								if(isNaN(tmp[i])) {
									tmp[i] = 0;
								} else {
									tmp[i] %= 256;
								}
							}
							tmp = (0xFF000000) | (tmp[0] << 16) | (tmp[1] << 8) | tmp[2];
						} else {
							tmp = 0;
						}
					} else if(colorpattern2.test(str)) {
						str = str.substring(5, str.length - 1);
						tmp = str.split(/,\s*/);
						if(tmp.length > 3) {
							for(var i in tmp) {
								tmp[i] = parseInt(tmp[i]);
								if(isNaN(tmp[i])) {
									tmp[i] = 0;
								} else {
									tmp[i] %= 256;
								}
							}
							tmp = (tmp[3] << 24) | (tmp[0] << 16) | (tmp[1] << 8) | tmp[2];
						} else {
							tmp = 0;
						}
					} else if(colorpattern3.test(str)) {
						str = str.substring(5, str.length - 1);
						tmp = str.split(/,\s*/);
						if(tmp.length > 3) {
							for(var i in tmp) {
								tmp[i] = parseInt(tmp[i]);
								if(isNaN(tmp[i])) {
									tmp[i] = 0;
								} else {
									tmp[i] %= 256;
								}
							}
							tmp = (tmp[0] << 24) | (tmp[1] << 16) | (tmp[2] << 8) | tmp[3];
						} else {
							tmp = 0;
						}
					} else {
						tmp = str.split(/,?\s*/);
						for(var i in tmp) {
							tmp[i] = parseInt(tmp[i]);
							tmp[i] = isNaN(tmp[i]) ? 0 : tmp[i];
						}
						if(tmp.length > 3) {
							tmp = (tmp[0] << 24) | (tmp[1] << 16) | (tmp[2] << 8) | tmp[3];
						} else if(tmp.length > 2) {
							tmp = (0xFF << 24) | (tmp[0] << 16) | (tmp[1] << 8) | tmp[2];
						} else {
							tmp = 0;
						}
					}
				}
			}
			return tmp;
		}
		
		fontProcessor(str, default_size, nozoom) {
			str = str.split(/,\s*/);
			str[0] = str[0] ? str[0] : "Arial";
			str[1] = parseInt(str[1]);
			if(nozoom) {
				str[1] = isNaN(str[1]) ? default_size : Math.max(Math.abs(str[1]), 1);
			} else {
				str[1] = isNaN(str[1]) ? default_size : Math.max(util.dp2px(Math.abs(str[1])), 1);
			}
			str[2] = parseInt(str[2]);
			str[2] = isNaN(str[2]) ? 0 : Math.abs(str[2]);
			return gdi.Font(str[0], str[1], str[2]);
		}
		
		objectProcessor(str, obj) {
			if(!str) return obj;
			str = str.split(/,\s*/);
			var tmp1 = {};
			var tmp2;
			for(var i in str) {
				tmp2 = str[i].split(/\s*:\s*/);
				tmp1[tmp2[0]] = tmp2[1];
			}
			for(var i in obj) {
				tmp2 = parseFloat(obj[i]);
				if(tmp1[i] === undefined) {
				
				} else if(!isNaN(tmp2)) {
					tmp1[i] = parseFloat(tmp1[i]);
					obj[i] = isNaN(tmp1[i]) ? obj[i] : tmp1[i];
				} else {
					obj[i] = tmp1[i];
				}
			}
			return obj;
		}
		
		angleProcessor(str) {
			str = parseInt(str);
			if(isNaN(str)) {
				return 0;
			}
			return Math.abs(str) % 360;
		}
		
		concatWith(str, end) {
			if(str && (str.length >= end.length)) {
				if(str.lastIndexOf(end) != (str.length - end.length)) {
					return str + end;
				} else {
					return str;
				}
			} else {
				return str + end;
			}
		}
		
		createGradient(color_start, color_end, count, isBidirect) {
			function interpolate(color0, color1, coefficient) {
				return Math.floor((1-coefficient)*color0 + coefficient*color1);
			}
			let result = [];
			let alpha0 = (color_start & 0xFF000000) >>> 24;
			let red0 = (color_start & 0x00FF0000) >>> 16;
			let green0 = (color_start & 0x0000FF00) >>> 8;
			let blue0 = color_start & 0x000000FF;
			let alpha1 = (color_end & 0xFF000000) >>> 24;
			let red1 = (color_end & 0x00FF0000) >>> 16;
			let green1 = (color_end & 0x0000FF00) >>> 8;
			let blue1 = color_end & 0x000000FF;
			let coef;
			for (let i = 0; i < count; ++i) {
				coef = i / (count - 1);
				result.push(
					(interpolate(alpha0, alpha1, coef) << 24) |
					(interpolate(red0, red1, coef) << 16) |
					(interpolate(green0, green1, coef) << 8) |
					interpolate(blue0, blue1, coef)
				);
			}
			if (isBidirect) {
				for (let i = result.length - 1; i > 0; i--) {
					result.push(result[i]);
				} 
			}
			return result;
		}
		
		dp2px(dp, isNoRound) {
			return isNoRound ? (dp*curdpi/160) : Math.round(dp*curdpi/160);
		}
	};
	
	self = new Self();
	return self;
};