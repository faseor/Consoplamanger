/*
*
*/
function Sideframe(connector, cfg, imgs) {
	
	const IMG_MAIN = imgs.IMAGE_ICON_MAIN;
	const IMG_SORT = imgs.IMAGE_ICON_SORT;
	const IMG_SEARCH = imgs.IMAGE_ICON_SEARCH;
	const IMG_PARAMS = imgs.IMAGE_ICON_PARAMS;
	const IMG_BACKGROUND = imgs.IMAGE_SIDEBAR_BACKGROUND;
	const MARGIN_FRAME = cfg.MARGIN_SIDEFRAME;
	const WIDTH_FRAME = cfg.getSidebarWidth();
	
	let frm = null;
	let wjts = null;
	let hover_widget = null;
	let active_widget = null;
	let btn_main = null;
	let btn_sort = null;
	let btn_search = null;
	let btn_params = null;
	let btn_settings = null;
	let width = 0, height = 0;
	
	class Self extends Frame {
		
		get order_indexes() { return [ 1, 2, 2 ] }
		
		constructor() {
			super();
			wjts = new Widgets();
			let tmp_size = WIDTH_FRAME - MARGIN_FRAME*2;
			wjts.add(btn_main = new Button(
				0, () => {
					connector.switchFrame(connector.INDEX_INFOBAR);
				}
			));
			wjts.add(btn_sort = new Button(
				tmp_size*2, () => {
					connector.switchFrame(connector.INDEX_SORTBAR);
				}
			));
			wjts.add(btn_search = new Button(
				tmp_size*3, () => {
					connector.switchFrame(connector.INDEX_SEARCHBAR);
				}
			));
			wjts.add(btn_params = new Button(
				tmp_size*4, () => {
					connector.switchFrame(connector.INDEX_TWEAKBAR);
				}
			));
			IMG_MAIN.size = [ btn_main.w, btn_main.h ];
			IMG_SORT.size = [ btn_sort.w, btn_sort.h ];
			IMG_SEARCH.size = [ btn_search.w, btn_search.h ];
			IMG_PARAMS.size = [ btn_params.w, btn_params.h ];
		}
		
		onSize(w, h) {
			width = w, height = h;
			this.pos = [ MARGIN_FRAME, MARGIN_FRAME ];
			this.size = [ WIDTH_FRAME - MARGIN_FRAME*2, height - MARGIN_FRAME*2 ];
			IMG_BACKGROUND.size = [ this.w, this.h ];
		}
		
		onDraw(g) {
			const opened_panel_index = connector.index;
			g.GdiAlphaBlend(
				IMG_BACKGROUND.img,
				this.x + IMG_BACKGROUND.x, this.y + IMG_BACKGROUND.y, IMG_BACKGROUND.w, IMG_BACKGROUND.h,
				0, 0, IMG_BACKGROUND.w, IMG_BACKGROUND.h
			);
			g.GdiAlphaBlend(
				IMG_MAIN.img(btn_main.state + (opened_panel_index === connector.INDEX_INFOBAR ? 3 : 0)),
				this.x + btn_main.x + IMG_MAIN.x, this.y + btn_main.y + IMG_MAIN.y, IMG_MAIN.w, IMG_MAIN.h,
				0, 0, IMG_MAIN.w, IMG_MAIN.h
			);
			g.GdiAlphaBlend(
				IMG_SORT.img(btn_sort.state + (opened_panel_index === connector.INDEX_SORTBAR ? 3 : 0)),
				this.x + btn_sort.x + IMG_SORT.x, this.y + btn_sort.y + IMG_SORT.y, IMG_SORT.w, IMG_SORT.h,
				0, 0, IMG_SORT.w, IMG_SORT.h
			);
			g.GdiAlphaBlend(
				IMG_SEARCH.img(btn_search.state + (opened_panel_index === connector.INDEX_SEARCHBAR ? 3 : 0)),
				this.x + btn_search.x + IMG_SEARCH.x, this.y + btn_search.y + IMG_SEARCH.y, IMG_SEARCH.w, IMG_SEARCH.h,
				0, 0, IMG_SEARCH.w, IMG_SEARCH.h
			);
			g.GdiAlphaBlend(
				IMG_PARAMS.img(btn_params.state + (opened_panel_index === connector.INDEX_TWEAKBAR ? 3 : 0)),
				this.x + btn_params.x + IMG_PARAMS.x, this.y + btn_params.y + IMG_PARAMS.y, IMG_PARAMS.w, IMG_PARAMS.h,
				0, 0, IMG_PARAMS.w, IMG_PARAMS.h
			);
		}
		
		onMouseCome(x, y) {
			if (hover_widget = wjts.$XY(x, y)) {
				hover_widget.onEnter(x, y);
			}
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
		}
		
		onPressedMouseMove(x, y) {
			if (active_widget) {
				active_widget.onMove(x, y);
			}
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
			}
		}
		
		onMouseLeftButtonUp(x, y) {
			if (active_widget) {
				if (active_widget.$XY(x, y)) {
					active_widget.onClick();
				} else {
					active_widget.onLoose();
				}
				active_widget = null;
			}
			if (hover_widget = wjts.$XY(x, y)) {
				hover_widget.onHover(x, y);
			}
		}
		
		onCharCode(c) {
			if (!connector.index) {
				connector.sendChar(c);
			}
		}
	
		onKeyCode(k) {
			if (!connector.index) {
				connector.sendKey(k);
			}
		}
	}
	
	class Button extends Widget {
		constructor(pos, action) {
			super();
			this.pos = [ 0, pos ];
			let tmp_size = WIDTH_FRAME - MARGIN_FRAME*2;
			this.size = [ tmp_size, tmp_size ];
			this._action = action;
		}
		
		onLoose() {
			this.state = this.STATE_NORMAL;
		}
		
		onEnter(x, y) {
			this.state = this.STATE_HOVER;
		}
		
		onLeftButton(x, y) {
			this.state = this.STATE_ACTIVE;
		}
		
		onClick(x, y) {
			this._action();
			this.state = this.STATE_NORMAL;
		}
	}
	
	frm = new Self();
	return frm;
}