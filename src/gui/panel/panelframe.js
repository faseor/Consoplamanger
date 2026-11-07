function Panelframe(connector, pls, imgs, cfg, usr) {
	
	const CLR_FADE = cfg.COLOR_PANELFRAME_FADE;
	const CLR_BACKGROUND = cfg.COLOR_PANELBAR;
	const IMG_BORDER = imgs.IMAGE_PANELBAR_BORDER;
	const MARGIN_FRAME = cfg.MARGIN_PANELFRAME;
	const WIDTH_BORDER = cfg.getSidebarWidth();

	let frm = null;
	let wjts = null;
	let hover_widget = null;
	let active_widget = null;
	let focus_widget = null;
	let infobar = null;
	let sortbar = null;
	let searchbar = null;
	let tweakbar = null;
	let settingsbar = null;
	let headerbar1 = null;
	let headerbar2 = null;
	let curbar = null;
	let captionbar = null;
	let index_curbar = 0;
	let is_visibility = false;
	let mouse_tracking = null;
	let width = 0, height = 0;
	let prev_x = 0, prev_y = 0;
	
	class Self extends Frame {
		
		get order_indexes() { return [ 0, 3, 3 ]; }
		
		constructor() {
			super();
			this.pos = [ cfg.getSidebarWidth(), 0 ];
			mouse_tracking = { x: 0, y: 0 };
			headerbar1 = new Headerframe(pls, imgs, cfg, usr);
			infobar = new Infoframe(pls, imgs, cfg, usr, headerbar1);
			sortbar = new Sortframe(pls, imgs, cfg, usr, headerbar1);
			searchbar = new Searchframe(pls, imgs, cfg, usr, headerbar1);
			tweakbar = new Configframe(pls, imgs, cfg, usr, headerbar1);
			IMG_BORDER.pos = [ 0 - WIDTH_BORDER, 0 ];
			connector.registerListenersOfPanelbar(eventListener);
		}
		
		onSize(w, h) {
			width = w, height = h;
			if (is_visibility) {
				this.size = [
					width - cfg.getSidebarWidth(),
					height
				];
			} else {
				this.size = [ 0, 0 ];
			}
			headerbar1.onSize(w, h);
			infobar.onSize(w, h);
			sortbar.onSize(w, h);
			searchbar.onSize(w, h);
			tweakbar.onSize(w, h);
			IMG_BORDER.size = [ WIDTH_BORDER, sortbar.h ];
		}
		
		onUpdate() {
			headerbar1.onUpdate();
			infobar.onUpdate();
			sortbar.onUpdate();
			searchbar.onUpdate();
			tweakbar.onUpdate();
		}
	
		onFlush() {
			headerbar1.onFlush();
			infobar.onFlush();
			sortbar.onFlush();
			searchbar.onFlush();
			tweakbar.onFlush();
		}
		
		onDraw(g) {
			if (!is_visibility) return;
			g.FillSolidRect(
				this.x, this.y, this.w, this.h,
				CLR_FADE
			);
			g.GdiAlphaBlend(
				IMG_BORDER.img,
				curbar.a + IMG_BORDER.x, curbar.y + IMG_BORDER.y, IMG_BORDER.w, IMG_BORDER.h,
				0, 0, IMG_BORDER.w, IMG_BORDER.h
			);
			g.FillSolidRect(
				curbar.x, curbar.y, curbar.w - WIDTH_BORDER, curbar.h,
				CLR_BACKGROUND
			);
			curbar.onDraw(g);
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
			mouse_tracking.x = x + this.x;
			mouse_tracking.y = y + this.y;
		}
		
		onPressedMouseMove(x, y) {
			if (active_widget) {
				active_widget.onMove(x, y);
			}
		}
		
		onMouseLeftButtonDown(x, y) {
			if (hover_widget) {
				if (hover_widget.$XY(x, y)) {
					if (focus_widget) {
						if (focus_widget !== hover_widget) {
							focus_widget.onFocusLost();
							focus_widget = null;
							focus_widget = hover_widget;
							focus_widget.onFocusGet();
						}
					} else {
						focus_widget = hover_widget;
						focus_widget.onFocusGet();
					}
					active_widget = hover_widget;
					active_widget.onLeftButton(x, y);
					hover_widget = null;
				} else {
					hover_widget.onLoose();
					hover_widget = null;
					if (hover_widget = wjts.$XY(x, y)) {
						if (focus_widget) {
							if (focus_widget !== hover_widget) {
								focus_widget.onFocusLost();
								focus_widget = null;
							}
						} else {
							focus_widget = hover_widget;
							focus_widget.onFocusGet();
						}
						hover_widget.onEnter(x, y);
						active_widget = hover_widget;
						active_widget.onLeftButton(x, y);
						hover_widget = null;
					}
				}
			} else if (focus_widget) {
				focus_widget.onFocusLost();
				focus_widget = null;
			}
		}
		
		onMouseLeftButtonUp(x, y) {
			if (active_widget) {
				if (active_widget.$XY(x, y)) {
					active_widget.onClick(x, y);
				} else {
					active_widget.onLoose();
				}
				active_widget = null;
			} else if (curbar && !curbar.$XY(x + this.x, y + this.y)) {
				connector.close();
			}
		}
		
		onMouseWheel(s) {
			if (curbar && !curbar.$XY(mouse_tracking.x, mouse_tracking.y)) {
				let frm = connector.frames.$XY(mouse_tracking.x, mouse_tracking.y, 1);
				if (frm) {
					frm.onMouseWheel(s);
				}
			}
		}
		
		onFocusOut() {
			if (focus_widget) {
				focus_widget.onFocusLost();
				focus_widget = null;
			}
		}
		
		onKeyCode(key) {
			if (focus_widget && focus_widget.onKeyCode) {
				focus_widget.onKeyCode(key);
			}
		}
		
		onCharCode(char) {
			if (focus_widget && focus_widget.onChar) {
				focus_widget.onChar(String.fromCharCode(char));
			}
		}
	}
	
	function eventListener(index) {
		if (focus_widget) {
			focus_widget.onFocusLost();
			focus_widget = null;
		}
		if (index_curbar === index) {
			curbar = null;
			wjts = null;
			index_curbar = 0;
			if (is_visibility) {
				is_visibility = false;
				frm.size = [ 0, 0 ];
			}
		} else {
			switch (index) {
				case connector.INDEX_INFOBAR:
					curbar = infobar;
					break;
				case connector.INDEX_SORTBAR:
					curbar = sortbar;
					break;
				case connector.INDEX_SEARCHBAR:
					curbar = searchbar;
					break;
				case connector.INDEX_TWEAKBAR:
					curbar = tweakbar;
					break;
				default:
					curbar = null;
					wjts = null;
					index_curbar = 0;
					if (is_visibility) {
						is_visibility = false;
						frm.size = [ 0, 0 ];
					}
					connector.index = index_curbar;
					return;
			}
			wjts = curbar.widgets;
			index_curbar = index;
			if (!is_visibility) {
				is_visibility = true;
				frm.size = [
					width - cfg.getSidebarWidth(),
					height
				];
			}
		}
		connector.index = index_curbar;
	}
	
	frm = new Self();
	return frm;
}