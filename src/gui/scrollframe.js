/*

*/
function Scrollframe(cfg, usr, imgs, pls, bridge, Job) {
	
	const DELAY_BUTTON_PRESS = cfg.BUTTON_DELAY_PRESS;
	const DELAY_BUTTON_REPEAT = cfg.BUTTON_REPEAT_PRESS;
	const FNT_TIP = cfg.FONT_SCROLLBAR_TIP;
	const CLR_TIP = cfg.COLOR_SCROLLBAR_TIP;
	const CLR_ITEM_PLAYING = cfg.COLOR_PLAYING_INDEX_ITEM;
	const CLR_ITEM_FOCUS = cfg.COLOR_FOCUS_INDEX_ITEM;
	const CLR_ITEM_FOUND = cfg.COLOR_FOUND_INDEX_ITEM;
	const CLR_JOB = cfg.COLOR_SCROLLBAR_JOB_INDICATOR;
	const IMG_SCROLLUP = imgs.IMAGE_SCROLLUP;
	const IMG_SCROLLDOWN = imgs.IMAGE_SCROLLDOWN;
	const IMG_SLIDER = imgs.IMAGE_SLIDER;
	const IMG_TIP = imgs.IMAGE_SCROLLBAR_TIP;
	const IMG_BACKGROUND = imgs.IMAGE_SCROLLBAR_BACKGROUND;
	const FRAME_WIDTH = cfg.getScrollbarWidth();
	const FRAME_MARGIN = cfg.MARGIN_SCROLLFRAME;
	const MARGIN_TIP = cfg.getTipMargin();

	let frm = null;
	let wjts = null;
	let btn_scrollup = null;
	let btn_scrolldown = null;
	let btn_slider = null;
	let hover_widget = null;
	let active_widget = null;
	let dimension = null;
	let is_draw = false;
	let width = 0, height = 0;
	let playlistbar = null;
	let item_playing = -1;
	let item_focus = -1;
	let items_found = null;
	let padding_tip_left = 0;
	let padding_tip_right = 0;
	let tip = null;
	let all_jobs = null;
	
	class Self extends Frame {
		
		get order_indexes() { return [ 2, 1, 1 ]; }
		
		constructor() {
			super();
			this.size = [
				FRAME_WIDTH - FRAME_MARGIN*2,
				FRAME_MARGIN*2
			];
			wjts = new Widgets();
			dimension = new Dimension();
			tip = new Tip();
			item_playing = new DrawableIndexer(this.w, 0);
			item_focus = new DrawableIndexer(this.w, 0);
			items_found = new Foundes();
			all_jobs = new Map();
			playlistbar = {
				pos: 0,
				height: 0,
				average: 0
			};
			wjts.add(btn_scrollup = new Button(
				this.w, this.w,
				() => {
					bridge.event_setRelativePosition(usr.getScrollbarScrollCount());
					if (tip.is_draw) {
						tip.is_draw = false;
					}
					util.repaint();
				}
			));
			wjts.add(btn_scrolldown = new Button(
				this.w, this.w,
				() => {
					bridge.event_setRelativePosition(-usr.getScrollbarScrollCount());
					if (tip.is_draw) {
						tip.is_draw = false;
					}
					util.repaint();
				}
			));
			([ padding_tip_left, padding_tip_right ] = cfg.getTipHorizontalPaddings());
			let tmp_width = padding_tip_left + util.textWidth("W", FNT_TIP) * cfg.getSymbolsCountForTip() + padding_tip_right;
			let tmp_height = FNT_TIP.Height + cfg.getTipVerticalPadding()*2;
			tip.size = [ tmp_width, tmp_height ];
			tip.pos = [ -tmp_width - cfg.getTipMargin(), 0 ];
			wjts.add(btn_slider = new Slider());
			Job.registerListener((function (id, max) {
				all_jobs.set(id, [ 0, max ]);
			}).bind(this), (function (id, value) {
				all_jobs.get(id)[0] = value;
			}).bind(this), (function (id) {
				all_jobs.delete(id);
			}).bind(this));
			bridge.registerActions((pos) => {
				playlistbar.pos = pos;
				btn_slider.position = playlistbar.pos / playlistbar.average;
			}, (pos, frame_h, max) => {
				playlistbar.pos = pos;
				playlistbar.height = frame_h;
				playlistbar.average = max;
			});
			pls.registerKeyItemsVisualiser((cur_index) => {
				items_found.add(cur_index);
			}, () => {
				items_found.flush();
			});
		}
		
		onSize(w, h) {
			width = w, height = h;
			is_draw = (playlistbar.height < playlistbar.average);
			if (!is_draw) {
				this.pos = [ width, FRAME_MARGIN ];
				this.size = [ 0, 0 ];
				return;
			}
			this.pos = [ width - FRAME_WIDTH + FRAME_MARGIN, FRAME_MARGIN ];
			this.size = [
				FRAME_WIDTH - FRAME_MARGIN*2,
				h - FRAME_MARGIN*2
			];
			btn_scrollup.pos = [ 0, 0 ];
			btn_scrolldown.pos = [ 0, this.h - btn_scrolldown.h ];
			dimension.pos = [ 0, btn_scrollup.b ];
			dimension.size = [ this.w, this.h - btn_scrollup.h - btn_scrolldown.h ];
			items_found.resize();
			let tmp_pos = playlistbar.pos / playlistbar.average;
			let tmp_height = playlistbar.height / playlistbar.average;
			btn_slider.pos = [ 0, btn_scrollup.b ];
			btn_slider.size = [ this.w, btn_slider.max_height ];
			btn_slider.position = isFinite(tmp_pos) ? tmp_pos : 0;
			btn_slider.height = isFinite(tmp_height) ? tmp_height : 1;
			IMG_SCROLLUP.size = [ btn_scrollup.w, btn_scrollup.h ];
			IMG_SCROLLDOWN.size = [ btn_scrolldown.w, btn_scrolldown.h ];
			IMG_BACKGROUND.size = [ this.w, this.h ];
			this.updateKeyItems();
		}
		
		onUpdate() {
			this.onSize(width, height);
		}
		
		onFlush() {
			is_draw = false;
		}
		
		onDraw(g) {
			if (!is_draw) return;
			if (tip.is_draw) {
				g.GdiAlphaBlend(
					IMG_TIP.img,
					this.x + tip.x + IMG_TIP.x, this.y + tip.y + IMG_TIP.y, IMG_TIP.w, IMG_TIP.h,
					0, 0, IMG_TIP.img.Width, IMG_TIP.img.Height
				);
				g.GdiDrawText(
					pls.getAbbreviation(tip.i),
					FNT_TIP, CLR_TIP,
					this.x + tip.x, this.y + tip.y, tip.w - padding_tip_right, tip.h,
					0x00000825
				);
			}
			g.GdiAlphaBlend(
				IMG_BACKGROUND.img,
				this.x + IMG_BACKGROUND.x, this.y + IMG_BACKGROUND.y, IMG_BACKGROUND.w, IMG_BACKGROUND.h,
				0, 0, IMG_BACKGROUND.w, IMG_BACKGROUND.h
			);
			if (item_playing.is_draw) {
				g.FillSolidRect(
					this.x + item_playing.x, this.y + item_playing.y,
					item_playing.w, item_playing.h,
					CLR_ITEM_PLAYING
				);
			}
			if (item_focus.is_draw) {
				g.FillSolidRect(
					this.x + item_focus.x, this.y + item_focus.y,
					item_focus.w, item_focus.h,
					CLR_ITEM_FOCUS
				);
			}
			for (const item of items_found) {
				g.FillSolidRect(
					this.x + item.x, this.y + dimension.y + item.y,
					item.w, item.h,
					CLR_ITEM_FOUND
				);
			}
			g.GdiAlphaBlend(
				IMG_SCROLLUP.img(btn_scrollup.state),
				this.x + btn_scrollup.x + IMG_SCROLLUP.x, this.y + btn_scrollup.y + IMG_SCROLLUP.y,
				IMG_SCROLLUP.w, IMG_SCROLLUP.h,
				0, 0, IMG_SCROLLUP.w, IMG_SCROLLUP.h
			);
			g.GdiAlphaBlend(
				IMG_SCROLLDOWN.img(btn_scrolldown.state),
				this.x + btn_scrolldown.x + IMG_SCROLLDOWN.x, this.y + btn_scrolldown.y + IMG_SCROLLDOWN.y,
				IMG_SCROLLDOWN.w, IMG_SCROLLDOWN.h,
				0, 0, IMG_SCROLLDOWN.w, IMG_SCROLLDOWN.h
			);
			for (const [cur_job, max_job] of all_jobs.values()) {
				g.FillSolidRect(
					this.x, this.y + dimension.y,
					this.w, util.max(Math.round(cur_job / max_job * dimension.h),1),
					CLR_JOB
				);
			}
			g.GdiAlphaBlend(
				IMG_SLIDER.img(btn_slider.state),
				this.x + btn_slider.x + IMG_SLIDER.x, this.y + btn_slider.y + IMG_SLIDER.y,
				IMG_SLIDER.w, IMG_SLIDER.h,
				0, 0, IMG_SLIDER.w, IMG_SLIDER.h
			);
		}
		
		onMouseCome(x, y) {
			if (hover_widget = wjts.$XY(x, y)) {
				hover_widget.onEnter(x, y);
			}
			if (!tip.is_draw) {
				tip.is_draw = true;
			}
			tip.y = util.limit(dimension.y, y, dimension.b);
		}
		
		onMouseOut() {
			if (hover_widget) {
				hover_widget.onLoose();
				hover_widget = null;
			}
			if (active_widget) {
				active_widget.onLoose();
				active_widget = null;
			}
			if (tip.is_draw) {
				tip.is_draw = false;
			}
		}
		
		onMouseMove(x, y) {
			if (hover_widget) {
				if (hover_widget.$XY(x, y)) {
					hover_widget.onHover(x, y);
				} else {
					hover_widget.onLoose();
					hover_widget = null;
					if (hover_widget = wjts.$XY(x, y)) {
						hover_widget.onEnter(x, y);
					}
				}
			} else if (hover_widget = wjts.$XY(x, y)) {
				hover_widget.onEnter(x, y);
			}
			if (!tip.is_draw) {
				tip.is_draw = true;
			}
			tip.y = util.limit(dimension.y, y, dimension.b);
		}
		
		onPressedMouseMove(x, y) {
			if (active_widget) {
				active_widget.onMove(x, y);
				if (active_widget !== btn_slider) {
					if (tip.is_draw) {
						tip.is_draw = false;
					}
				}
			} else if (!tip.is_draw) {
				tip.is_draw = true;
			}
			tip.y = util.limit(dimension.y, y, dimension.b);
		}
		
		onMouseLeftButtonDown(x, y) {
			if (hover_widget) {
				if (hover_widget.$XY(x, y)) {
					active_widget = hover_widget;
					active_widget.onLeftButton(x, y);
					hover_widget = null;
				} else {
					hover_widget.onLoose();
					hover_widget = null;
					if (hover_widget = wjts.$XY(x, y)) {
						hover_widget.onEnter(x, y);
						active_widget = hover_widget;
						active_widget.onLeftButton(x, y);
						hover_widget = null;
					}
				}
			} else {
				if (dimension.$XY(x, y)) {
					active_widget = btn_slider;
					active_widget.onLeftButton(x, btn_slider.y + btn_slider.h/2);
					active_widget.onMove(x, y);
				}
			}
		}
		
		onMouseLeftButtonUp(x, y) {
			if (active_widget) {
				active_widget.onClick();
				active_widget = null;
			}
			if (hover_widget = wjts.$XY(x, y)) {
				hover_widget.onHover(x, y);
			}
		}
		
		onMouseWheel(s) {
			if (active_widget) return;
			btn_slider.slide(s * btn_slider.h);
			if (hover_widget === btn_slider) {
				hover_widget.onLoose();
				hover_widget = null;
			}
		}
		
		updateKeyItems() {
			let tmp = util.max(Math.ceil(dimension.h / pls.count), 1);
			item_playing.is_draw = (pls.playing_composition >= 0);
			item_playing.y = dimension.y +
					(pls.playing_composition / (pls.count)) *
					(dimension.h-1);
			item_playing.h = tmp;
			item_focus.is_draw = (pls.focus_composition >= 0);
			item_focus.y = dimension.y +
					(pls.focus_composition / (pls.count)) *
					(dimension.h-1);
			item_focus.h = tmp;
		}
		
		onCharCode(c) {
			bridge.event_sendChar(c);
		}
	
		onKeyCode(k) {
			bridge.event_sendKey(k);
		}
	}
	
	class Slider extends Widget {
		
		constructor() {
			super();
			this._delta = 0;
		}
		
		set size(value) {
			let [ _w, _h ] = [ ...value ];
			_h = util.limit(this.w, _h, dimension.h);
			super.size = [ _w, _h ];
			IMG_SLIDER.size = [ this.w, this.h ];
		}
		
		set pos(value) {
			let [ _x, _y ] = [ ...value ];
			_y = util.limit(dimension.y, _y, dimension.b - this.h);
			super.pos = [ _x, _y ];
		}
		
		set position(coef) {
			coef = util.limit(0, coef, 1);
			let _y = coef * dimension.h;
			this.pos = [ this.x, dimension.y + _y ];
		}
		
		set height(coef) {
			coef = util.limit(0, coef, 1);
			let _h = coef * dimension.h;
			this.size = [ this.w, _h ];
		}
		
		onLoose() {
			this.state = this.STATE_NORMAL;
		}
		
		onEnter(x, y) {
			this.state = this.STATE_HOVER;
		}
		
		onMove(x, y) {
			if (this.isActive) {
				this.pos = [
					this.x,
					util.limit(
						dimension.y,
						y - this._delta,
						dimension.b - this.h
					)
				];
				bridge.event_setPosition(this.y - dimension.y, dimension.h - this.h);
			}
		}
		
		onLeftButton(x, y) {
			this.state = this.STATE_ACTIVE;
			this._delta = y - this.y;
		}
		
		onClick(x, y) {
			this.state = this.STATE_NORMAL;
			this._delta = 0;
		}
		
		slide(value) {
			this.pos = [ this.x, this.y - value ];
			bridge.event_setPosition(this.y - dimension.y, dimension.h - this.h);
		}
	}
	
	class Button extends Widget {
		
		constructor(w, h, action) {
			super();
			this.size = [ w, h ];
			this._action = action;
			this._stopper_timeout = null;
			this._stopper_repeat = null;
		}
		
		onLoose() {
			this.state = this.STATE_NORMAL;
			this._stopAllTimers();
		}
		
		onEnter(x, y) {
			this.state = this.STATE_HOVER;
			this._stopAllTimers();
		}
		
		onLeftButton(x, y) {
			this.state = this.STATE_ACTIVE;
			this._action();
			this._stopper_timeout = util.timeout(
				() => {
					this._stopper_repeat = util.repeater(
						this._action, DELAY_BUTTON_REPEAT
					);
				}, DELAY_BUTTON_PRESS
			);
		}
		
		onClick(x, y) {
			this.state = this.STATE_NORMAL;
			this._stopAllTimers();
		}
		
		_stopAllTimers() {
			if (this._stopper_timeout) {
				this._stopper_timeout();
				this._stopper_timeout = null;
			}
			if (this._stopper_repeat) {
				this._stopper_repeat();
				this._stopper_repeat = null;
			}
		}
	}
	
	class Dimension {
		get x() { return this._x; }
		get y() { return this._y; }
		get w() { return this._w; }
		get h() { return this._h; }
		get a() { return this._a; }
		get b() { return this._b; }
		constructor() {
			this._x = 0;
			this._y = 0;
			this._w = 0;
			this._h = 0;
			this._a = 0;
			this._b = 0;
		}
		set y(value) {
			this._y = Math.round(value);
			this._b = this._y + this._h;
		}
		set pos(value) {
			let [ x, y ] = [ ...value ];
			this._x = Math.round(x);
			this._y = Math.round(y);
			this._a = this._x + this._w;
			this._b = this._y + this._h;
		}
		set size(value) {
			let [ w, h ] = [ ...value ];
			this._w = Math.round(w);
			this._h = Math.round(h);
			this._a = this._x + this._w;
			this._b = this._y + this._h;
		}
		$XY(x, y) {
			if (
				x > this._x &&
				x < this._a &&
				y > this._y &&
				y < this._b
			) {
				return true;
			}
		}
	}
	
	class Tip {
		get x() { return this._x; }
		get y() { return this._y; }
		get w() { return this._w; }
		get h() { return this._h; }
		get is_draw() { return this._s; }
		get i() { return this._index; }
		constructor() {
			this._x = 0;
			this._y = 0;
			this._w = 0;
			this._h = 0;
			this._s = false;
		}
		set y(value) {
			this._y = value - Math.round(this.h/2);
			this._index = Math.floor((value - dimension.y) / dimension.h * (pls.count-1));
		}
		set x(value) {
			this._x = value;
		}
		set is_draw(value) {
			this._s = !!value;
		}
		set pos(value) {
			let [ x, y ] = [ ...value ];
			this._x = Math.round(x);
			this._y = Math.round(y);
		}
		set size(value) {
			let [ w, h ] = [ ...value ];
			this._w = Math.round(w);
			this._h = Math.round(h);
			IMG_TIP.size = [ this.w, this.h ];
		}
	}
	
	class DrawableIndexer {
		get x() { return this._x; }
		get y() { return this._y; }
		get w() { return this._w; }
		get h() { return this._h; }
		get is_draw() { return this._s; }
		constructor(w, m, ...args) {
			this._x = m;
			this._y = 0;
			this._w = w - m*2;
			this._h = 0;
			this._s = false;
			if (args.length === 2) {
				let [ _y, _h ] = [ ...args ];
				this._y = Math.floor(_y);
				this._h = Math.ceil(_h);
			}
		}
		set is_draw(value) { this._s = !!value }
		set y(value) { this._y = Math.floor(value) }
		set h(value) { this._h = Math.ceil(value) }
		set ex_h(value) { this._h = Math.ceil(this._h + value) }
	}
	
	class Foundes {
		constructor() {
			this.HEIGHT_PER_ELEMENT = 0;
			this._items = [];
			this._indexes = [];
		}
		add(i) {
			this._indexes.push(i);
			this._add(i);
		}
		flush() {
			this._items = [];
			this._indexes = [];
		}
		resize() {
			this.HEIGHT_PER_ELEMENT = util.max(Math.ceil(dimension.h / pls.count), 1);
			this._items = [];
			for (let i = 0; i < this._indexes.length; i++) {
				this._add(i)
			}
		}
		*[Symbol.iterator]() {
			for (const item of this._items) {
				yield item;
			}
		}
		_add(i) {
			const pos_y = Math.floor(i/(pls.count) * (dimension.h-1));
			if (this._items.length) {
				const item = this._items.last;
				if ((pos_y - item.y + item.h) > this.HEIGHT_PER_ELEMENT) {
					this._items.push(new DrawableIndexer(frm.w, 0, pos_y, this.HEIGHT_PER_ELEMENT));
				} else {
					item.ex_h = pos_y - item.y + item.h;
				}
			} else {
				this._items.push(new DrawableIndexer(frm.w, 0, pos_y, this.HEIGHT_PER_ELEMENT));
			}
		}
	}
	
	frm = new Self();
	return frm;
};