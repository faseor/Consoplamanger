/*

*/
"use strict";

function Configframe(pls, imgs, cfg, usr, header) {
	const DURATION_ANIMATION_CARET = cfg.DURATION_TEXTBOX_ANIMATION_CARET;
	const FNT_TEXTBOX = cfg.FONT_NUMBER_TEXTBOX;
	const FNT_LABEL = cfg.FONT_CONFIGURATION_LABEL;
	const CLR_TEXTBOX = cfg.COLOR_NUMBER_TEXTBOX;
	const CLR_CARET = cfg.COLOR_NUMBER_TEXTBOX_CARET;
	const CLR_LABEL = cfg.COLOR_CONFIGURATION_LABEL;
	const IMG_TEXTBOX = imgs.IMAGE_NUMBER_TEXTBOX;
	const IMG_TOGGLEBOX = imgs.IMAGE_TOGGLEBOX;
	const MARGIN = cfg.getNumberTextboxMargin();
	const PADDING_HORIZONTAL = cfg.getPanelbarHorizontalPadding();
	const PADDING_VERTICAL = cfg.getConfigbarVerticalPadding();
	const TEXT_PADDING = cfg.getNumberTextboxPadding();
	const TEXTBOX_PADDING = cfg.getForNumberTextboxLabelPadding();
	const TOGGLEBOX_PADDING = cfg.getForToggleboxLabelPadding();

	let configuration_object = null;
	let animator_textbox_caret = null;
	let indix_textbox_caret = 0;
	
	class Self extends Subframe {
		constructor() {
			super();
			this.pos = [ cfg.getSidebarWidth(), 0 ];
			configuration_object = usr.getConfiguratorObjectSetter();
			let wjts = new Widgets();
			let tmp_index = 0;
			let textbox_height = FNT_TEXTBOX.Height + TEXT_PADDING*2;
			IMG_TEXTBOX.size = [ cfg.getNumberTextboxWidth(), textbox_height ];
			IMG_TOGGLEBOX.size = [ textbox_height*2, textbox_height ]
			let togglebox_height = FNT_TEXTBOX.Height + TEXT_PADDING*2;
			wjts.add(new ToggleButton(() => {
				configuration_object.toggleIsApplySortOnAdd();
				configuration_object.reloadConfig();
			}, "Apply sorting when adding", tmp_index++, usr.isApplySortOnAdd));
			wjts.add(new ToggleButton(() => {
				configuration_object.toggleIsSmoothScroll();
				configuration_object.reloadConfig();
			}, "Enable smooth scroll", tmp_index++, usr.isSmoothScroll));
			wjts.add(new ToggleButton(() => {
				configuration_object.toggleIsDrawBackgroundImage();
				configuration_object.reloadConfig();
			}, "Draw the back cover", tmp_index++, usr.isDrawBackgroundImage));
			wjts.add(new ToggleButton(() => {
				configuration_object.toggleIsCenterResultFastSearch();
				configuration_object.reloadConfig();
			}, "Focus on fast search", tmp_index++, usr.isCenterResultFastSearch));
			wjts.add(new NumberTextbox((new_value) => {
				if (new_value !== undefined) {
					configuration_object.FASTSEARCH_MAXDELAY = new_value;
				}
				return usr.FASTSEARCH_MAXDELAY;
			}, true, "Delay in the start of the fast search", tmp_index++));
			wjts.add(new NumberTextbox((new_value) => {
				if (new_value !== undefined) {
					configuration_object.SEARCH_PROCESSING_MAX_COMPOSITION = new_value;
				}
				return usr.SEARCH_PROCESSING_MAX_COMPOSITION;
			}, true, "Number of compositions to search", tmp_index++));
			super.widgets = wjts;
			animator_textbox_caret = new Walker((step) => {
				indix_textbox_caret = step;
			});
		}
		
		onSize(w, h) {
			this.size = [
				cfg.getPanelbarWidth(),
				h
			];
		}
	
		onUpdate() {
		}

		onFlush() {
		}

		onDraw(g) {
			header.onDraw(g);
			const wjts = super.widgets;
			for (const wjt of wjts) {
				if (wjt.type == 0) {
					g.GdiAlphaBlend(
						IMG_TEXTBOX.img(wjt.state + wjt.focus),
						this.x + wjt.x + IMG_TEXTBOX.x, this.y + wjt.y + IMG_TEXTBOX.y, IMG_TEXTBOX.w, IMG_TEXTBOX.h,
						0, 0, IMG_TEXTBOX.w, IMG_TEXTBOX.h
					);
					if (wjt.focus) {
						g.FillSolidRect(
							this.x + wjt.caret_pos, this.y + wjt.y + TEXT_PADDING,
							wjt.caret_width, FNT_TEXTBOX.Height,
							CLR_CARET[indix_textbox_caret]
						);
					}
					g.GdiDrawText(
						wjt.txt,
						FNT_TEXTBOX, CLR_TEXTBOX[wjt.state + wjt.focus],
						this.x + wjt.x + wjt.text_pos, this.y + wjt.y + TEXT_PADDING,
						wjt.text_width, FNT_TEXTBOX.Height,
						0x00000824
					);
					g.GdiDrawText(
						wjt.label,
						FNT_LABEL, CLR_LABEL,
						this.x + wjt.a + TEXTBOX_PADDING, this.y + wjt.y,
						this.w, wjt.h,
						0x00000824
					);
				} else if (wjt.type == 2) {
					g.GdiAlphaBlend(
						IMG_TOGGLEBOX.img(wjt.state + wjt.is_true),
						this.x + wjt.x + IMG_TOGGLEBOX.x, this.y + wjt.y + IMG_TOGGLEBOX.y, IMG_TOGGLEBOX.w, IMG_TOGGLEBOX.h,
						0, 0, IMG_TOGGLEBOX.w, IMG_TOGGLEBOX.h
					);
					g.GdiDrawText(
						wjt.label,
						FNT_LABEL, CLR_LABEL,
						this.x + wjt.a + TOGGLEBOX_PADDING, this.y + wjt.y,
						this.w, wjt.h,
						0x00000824
					);
				}
			}
		}
	}
	
	class NumberTextbox extends Widget {
		get txt() { return this._tb.length || this._focus ? this._tb.txt : this.DEFAULT_TXT }
		get focus() { return this._focus }
		get caret_pos() { return this.x + TEXT_PADDING + this._tb.caret.x }
		get caret_width() { return this._tb.caret.w }
		get text_pos() { return this._text_pos }
		get text_width() { return this._text_width }
		get label() { return this._label }
		get type() { return 0 }
		
		constructor(func, is_parse_integer, label, index) {
			super();
			this.pos = [
				PADDING_HORIZONTAL,
				header.height + PADDING_VERTICAL + (
					FNT_TEXTBOX.Height + TEXT_PADDING*2 + MARGIN
				) * index
			];
			this.size = [
				cfg.getNumberTextboxWidth(),
				FNT_TEXTBOX.Height + TEXT_PADDING*2
			];
			this.DEFAULT_TXT = func().toString();
			this._func = func;
			this._label = label;
			this._focus = 0;
			this._text_pos = TEXT_PADDING;
			this._text_width = this.w - TEXT_PADDING*2;
			this._is_parse_integer = is_parse_integer;
			this._tb = new Textcontainer(
				cfg.getNumberTextboxWidth(),
				FNT_TEXTBOX,
				usr.isTextboxEraseOnDeleteKeycode(),
				this.DEFAULT_TXT
			);
		}
		
		onLoose() {
			this.state = this.STATE_NORMAL;
		}
		
		onEnter(x, y) {
			this.state = this.STATE_HOVER;
		}
		
		onLeftButton(x, y) {
		}
		
		onClick(x, y) {
		}
		
		onChar(c) {
			switch (c) {
				case "0":
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					this._tb.onChar(c);
					break;
				case ".":
					if (!this._is_parse_integer) {
						this._tb.onChar(c);
					}
			}
		}
		
		onKeyCode(k) {
			switch (k) {
				case 8:
				case 37:
				case 39:
				case 46:
					this._tb.onKey(k);
					break;
				case 13:
					this._func(this._tb.full_text);
					break;
			}
		}
		
		onFocusGet() {
			this._focus = 3;
			animator_textbox_caret.start(CLR_CARET.length, DURATION_ANIMATION_CARET);
		}
		
		onFocusLost() {
			this._func(this._tb.txt);
			this._focus = 0;
			if (animator_textbox_caret.is_exec) {
				animator_textbox_caret.stop();
			}
		}
	}
	
	class ToggleButton extends Widget {
		get label() { return this._label }
		get type() { return 2 }
		get is_true() { return this._value() ? 3 : 0 }
		
		constructor(func, label, index, value_func) {
			super();
			this.pos = [ PADDING_HORIZONTAL, header.height + PADDING_VERTICAL + (FNT_TEXTBOX.Height + TEXT_PADDING*2 + MARGIN) * index ];
			this.size = [ (FNT_TEXTBOX.Height + TEXT_PADDING*2)*2, FNT_TEXTBOX.Height + TEXT_PADDING*2 ];
			this._func = func;
			this._label = label;
			this._value = value_func;
		}
		
		onLoose() {
			this.state = this.STATE_NORMAL;
		}
		
		onEnter(x, y) {
			this.state = this.STATE_HOVER;
		}
		
		onHover(x, y) {
		}
		
		onMove(x, y) {
		}
		
		onLeftButton(x, y) {
			this.state = this.STATE_ACTIVE;
		}
		
		onClick(x, y) {
			this._func();
			this.state = this.STATE_NORMAL;
		}
		
		onFocusGet() {
		}
		
		onFocusLost() {
		}
	}
	
	return new Self();
}
function Headerframe(pls, imgs, cfg, usr) {
	
	const FNT_PLAYLIST_NAME = cfg.FONT_PANELBAR_NAME;
	const FNT_PLAYLIST_INFO = cfg.FONT_PANELBAR_INFO;
	const CLR_PLAYLIST_NAME = cfg.COLOR_PANELBAR_NAME;
	const CLR_PLAYLIST_INFO = cfg.COLOR_PANELBAR_INFO;
	const IMG_BACKGROUND = imgs.IMAGE_PANELHEADER_BACKGROUND;
	const PADDING_HORIZONTAL = cfg.getPanelbarHorizontalPadding();
	const MARGIN_PLAYLIST_NAME = cfg.getHeaderbarNameMargin();
	const MARGIN_PLAYLIST_INFO = cfg.getHeaderbarInfoMargin();
	const MARGIN_BETWEEN = util.max(MARGIN_PLAYLIST_NAME, MARGIN_PLAYLIST_INFO);
	const HEIGHT_FRAME = MARGIN_PLAYLIST_NAME + FNT_PLAYLIST_NAME.Height +
		MARGIN_BETWEEN +
		FNT_PLAYLIST_INFO.Height + MARGIN_PLAYLIST_INFO;
		
	let frm = null;
	let playlist_name = "";
	let playlist_info = "";
	
	class Self extends Subframe {
		get height() { return HEIGHT_FRAME; }
		constructor() {
			super();
			this.pos = [ cfg.getSidebarWidth(), 0 ];
			this.size = [ cfg.getPanelbarWidth(), HEIGHT_FRAME ];
			IMG_BACKGROUND.size = [ this.w, this.h ];
		}
		onDraw(g) {
			g.GdiAlphaBlend(
				IMG_BACKGROUND.img,
				this.x + IMG_BACKGROUND.x, this.y + IMG_BACKGROUND.y, IMG_BACKGROUND.w, IMG_BACKGROUND.h,
				0, 0, IMG_BACKGROUND.w, IMG_BACKGROUND.h
			);
			g.GdiDrawText(
				playlist_name,
				FNT_PLAYLIST_NAME, CLR_PLAYLIST_NAME,
				this.x + PADDING_HORIZONTAL, this.y + MARGIN_PLAYLIST_NAME,
				this.w - PADDING_HORIZONTAL*2, FNT_PLAYLIST_NAME.Height,
				0x00000820
			);
			g.GdiDrawText(
				playlist_info,
				FNT_PLAYLIST_INFO, CLR_PLAYLIST_INFO,
				this.x + PADDING_HORIZONTAL,
				this.y + MARGIN_PLAYLIST_NAME + FNT_PLAYLIST_NAME.Height + MARGIN_BETWEEN,
				this.w - PADDING_HORIZONTAL*2, FNT_PLAYLIST_INFO.Height,
				0x00000820
			);
		}
		onUpdate() {
			playlist_name = pls.name;
			playlist_info = utils.FormatFileSize(pls.weight) + " | " + pls.count + " items | " + utils.FormatDuration(pls.duration);
		}
		onFlush() {
			playlist_name = "";
			playlist_info = "";
		}
	}
	
	frm = new Self();
	return frm;
}
function Infoframe(pls, imgs, cfg, usr, header) {
		
	let frm = null;
	
	class Self extends Subframe {
		constructor() {
			super();
			this.pos = [ cfg.getSidebarWidth(), 0 ];
		}
		onSize(w, h) {
			this.size = [
				cfg.getPanelbarWidth(),
				h
			];
		}
		onDraw(g) {
			header.onDraw(g);
		}
	}
	
	frm = new Self();
	return frm;
}
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
function Searchframe(pls, imgs, cfg, usr, header) {
	
	const DURATION_ANIMATION_CARET = cfg.DURATION_TEXTBOX_ANIMATION_CARET;
	const DURATION_SEARCHBOX_ANIMATION_CARET = cfg.DURATION_SEARCHBOX_ANIMATION_CARET;
	const FNT_TEXTBOX = cfg.FONT_SEARCHPLACE;
	const FNT_SEARCHBOX = cfg.FONT_SEARCHBOX;
	const CLR_CARET = cfg.COLOR_TEXTBOX_CARET;
	const CLR_TEXT = cfg.COLOR_TEXTBOX_TEXT;
	const CLR_SEARCHBOX_TXT = cfg.COLOR_SEARCHBOX_TEXT;
	const CLR_SEARCHBOX_CARET = cfg.COLOR_SEARCHBOX_CARET;
	const IMG_START = imgs.IMAGE_STARTSEARCH;
	const IMG_ADD = imgs.IMAGE_ADDTEXTBOX;
	const IMG_SEARCHTAG = imgs.IMAGE_TEXTBOX;
	const IMG_DELSEARCHTAG = imgs.IMAGE_TEXTBOX_DELETE;
	const IMG_SEARCHBOX = imgs.IMAGE_SEARCHBOX;
	const IMG_ERASE = imgs.IMAGE_SEARCHBOX_ERASE;
	const PADDING_HORIZONTAL_FRAME = cfg.getPanelbarHorizontalPadding();
	const PADDING_VERTICAL_FRAME = cfg.getSearchbarVerticalPadding();
	const PADDING_TEXTBOX = cfg.getTextboxPadding();
	const PADDING_SEARCHBOX = cfg.getSearchboxPadding();
	const MARGIN_ADD_BUTTON = cfg.getSearchtagAddButtonMargin();
	const MARGIN_TAGS = cfg.getSearchtagsVerticalMargin();
	const MARGIN_TEXTBOX = cfg.getTextboxMargin();
	const WIDTH_BUTTON_START = FNT_SEARCHBOX.Height + PADDING_SEARCHBOX*2;
	const WIDTH_FRAME = cfg.getPanelbarWidth();
	const WIDTH_DELETEBUTTON = FNT_TEXTBOX.Height + PADDING_TEXTBOX*2;
	const WIDTH_ERASEBUTTON = FNT_SEARCHBOX.Height + PADDING_SEARCHBOX*2;
	
	let frm = null;
	let wjts = null;
	let box_search = null;
	let searchtags = null;
	let btn_addtag = null;
	let menu = null;
	let indix_textbox_caret = 0;
	let indix_searchbox_caret = 0;
	let animator_textbox_caret = null;
	let animator_searchbox_caret = null;
	let width = 0, height = 0;
	
	class Self extends Subframe {
		
		constructor() {
			super();
			this.pos = [ cfg.getSidebarWidth(), 0 ];
			menu = new Searchmenu(usr);
			wjts = new Widgets();
			searchtags = new Widgets();
			wjts.add(box_search = new Searchbox());
			wjts.add(btn_addtag = new AddTagButton(cfg.FONT_SEARCHPLACE.Height + cfg.getSearchboxPadding() + cfg.getTextboxMargin()));
			wjts.add(searchtags);
			btn_addtag.recalcPosition();
			IMG_START.size = [ WIDTH_BUTTON_START, box_search.h ];
			IMG_START.pos = [ box_search.x, box_search.y ];
			IMG_ADD.size = [ btn_addtag.w, btn_addtag.h ];
			IMG_SEARCHTAG.size = [
				WIDTH_FRAME - PADDING_HORIZONTAL_FRAME*2,
				FNT_TEXTBOX.Height + PADDING_TEXTBOX*2
			];
			IMG_DELSEARCHTAG.size = [
				WIDTH_DELETEBUTTON, FNT_TEXTBOX.Height + PADDING_TEXTBOX*2
			];
			IMG_SEARCHBOX.size = [ box_search.w, box_search.h ];
			IMG_SEARCHBOX.pos = [ box_search.x, box_search.y ];
			IMG_ERASE.size = [ WIDTH_ERASEBUTTON, box_search.h ];
			IMG_ERASE.pos = [ box_search.erase_button_pos, box_search.y ];
			this.widgets = wjts;
			animator_textbox_caret = new Walker((step) => {
				indix_textbox_caret = step;
			});
			animator_searchbox_caret = new Walker((step) => {
				indix_searchbox_caret = step;
			});
		}
		
		onSize(w, h) {
			width = w, height = h;
			this.size = [
				cfg.getPanelbarWidth(),
				height
			];
		}
		
		onUpdate() {
			searchtags.del_all();
			btn_addtag.recalcPosition();
		}
		
		onFlush() {
			searchtags.del_all();
			btn_addtag.recalcPosition();
		}
		
		onDraw(g) {
			header.onDraw(g);
			g.GdiAlphaBlend(
				IMG_SEARCHBOX.img(box_search.state + box_search.focus),
				this.x + IMG_SEARCHBOX.x, this.y + IMG_SEARCHBOX.y, IMG_SEARCHBOX.w, IMG_SEARCHBOX.h,
				0, 0, IMG_SEARCHBOX.w, IMG_SEARCHBOX.h
			);
			if (box_search.focus) {
				g.FillSolidRect(
					this.x + box_search.caret_pos, this.y + box_search.y + PADDING_SEARCHBOX,
					box_search.caret_width, FNT_SEARCHBOX.Height,
					CLR_SEARCHBOX_CARET[indix_searchbox_caret]
				);
			}
			g.GdiDrawText(
				box_search.txt,
				FNT_SEARCHBOX, CLR_SEARCHBOX_TXT[box_search.state + box_search.focus],
				this.x + box_search.text_pos, this.y + box_search.y,
				box_search.text_width, box_search.h,
				0x00000824
			);
			g.GdiAlphaBlend(
				IMG_START.img(box_search.state_start + box_search.focus),
				this.x + IMG_START.x, this.y + IMG_START.y, IMG_START.w, IMG_START.h,
				0, 0, IMG_START.w, IMG_START.h
			);
			g.GdiAlphaBlend(
				IMG_ERASE.img(box_search.state_erase + box_search.focus),
				this.x + IMG_ERASE.x, this.y + IMG_ERASE.y, IMG_ERASE.w, IMG_ERASE.h,
				0, 0, IMG_ERASE.w, IMG_ERASE.h
			);
			for (const tag of searchtags) {
				g.GdiAlphaBlend(
					IMG_SEARCHTAG.img(tag.state + tag.focus),
					this.x + tag.x + IMG_SEARCHTAG.x, this.y + tag.y + IMG_SEARCHTAG.y, IMG_SEARCHTAG.w, IMG_SEARCHTAG.h,
					0, 0, IMG_SEARCHTAG.w, IMG_SEARCHTAG.h
				);
				if (tag.focus) {
					g.FillSolidRect(
						this.x + tag.caret_pos, this.y + tag.y + PADDING_TEXTBOX,
						tag.caret_width, FNT_TEXTBOX.Height,
						CLR_CARET[indix_textbox_caret]
					);
				}
				g.GdiDrawText(
					tag.text,
					FNT_TEXTBOX, CLR_TEXT[tag.state + tag.focus],
					this.x + tag.text_pos, this.y + tag.y,
					tag.text_width, tag.h,
					0x00000824
				);
				g.GdiAlphaBlend(
					IMG_DELSEARCHTAG.img(tag.state_delete + tag.focus),
					this.x + tag.delete_button_pos + IMG_DELSEARCHTAG.x, this.y + tag.y + IMG_DELSEARCHTAG.y, IMG_DELSEARCHTAG.w, IMG_DELSEARCHTAG.h,
					0, 0, IMG_DELSEARCHTAG.w, IMG_DELSEARCHTAG.h
				);
			}
			g.GdiAlphaBlend(
				IMG_ADD.img(btn_addtag.state),
				this.x + btn_addtag.x + IMG_ADD.x, this.y + btn_addtag.y + IMG_ADD.y, IMG_ADD.w, IMG_ADD.h,
				0, 0, IMG_ADD.w, IMG_ADD.h
			);
		}
	}
	
	
	class Searchbox extends Widget {
		get txt() { return this._tb.length || this._focus ? this._tb.txt : this.DEFAULT_TEXT }
		get focus() { return this._focus }
		get state_erase() { return this._state_erase }
		get state_start() { return this._state_start }
		get caret_pos() { return this.x + WIDTH_BUTTON_START + this._tb.caret.x + PADDING_SEARCHBOX }
		get caret_width() { return this._tb.caret.w }
		get text_pos() { return this._text_pos }
		get text_width() { return this._text_width }
		get erase_button_pos() { return this._erase_button_pos }
		get start_button_pos() { return this._start_button_pos }
		constructor() {
			super();
			this.pos = [
				PADDING_HORIZONTAL_FRAME,
				header.height + PADDING_VERTICAL_FRAME
			];
			this.size = [
				WIDTH_FRAME - PADDING_HORIZONTAL_FRAME*2,
				FNT_SEARCHBOX.Height + PADDING_SEARCHBOX*2
			];
			this.DEFAULT_TEXT = "search...";
			this._focus = false;
			this._erase_button_pos = this.x + this.w - this.h;
			this._start_button_pos = 0;
			this._text_pos = this.x + PADDING_SEARCHBOX + WIDTH_BUTTON_START;
			this._text_width = this.w - PADDING_SEARCHBOX*2 - WIDTH_ERASEBUTTON - WIDTH_BUTTON_START;
			this._state_erase = this.STATE_NORMAL;
			this._state_start = this.STATE_NORMAL;
			this._tb = new Textcontainer(this._text_width, FNT_SEARCHBOX, usr.isTextboxEraseOnDeleteKeycode());
		}
		onFocusGet() {
			this._focus = 3;
			animator_searchbox_caret.start(CLR_SEARCHBOX_CARET.length, DURATION_SEARCHBOX_ANIMATION_CARET);
		}
		onFocusLost() {
			this._focus = 0;
			if (animator_searchbox_caret.is_exec) {
				animator_searchbox_caret.stop();
			}
		}
		onLoose() {
			this.state = this.STATE_NORMAL;
			this._state_erase = this.STATE_NORMAL;
			this._state_start = this.STATE_NORMAL;
		}
		onEnter(x, y) {
			this.state = this.STATE_HOVER;
			this.onHover(x, y);
		}
		onHover(x, y) {
			if (x < this.x + WIDTH_BUTTON_START) {
				this._state_start = this.STATE_HOVER;
				this._state_erase = this.STATE_NORMAL;
			} else if (x > this._erase_button_pos) {
				this._state_start = this.STATE_NORMAL;
				this._state_erase = this.STATE_HOVER;
			} else {
				this._state_start = this.STATE_NORMAL;
				this._state_erase = this.STATE_NORMAL;
			}
		}
		onLeftButton(x, y) {
			if (this.STATE_HOVER === this._state_start) {
				this._state_start = this.STATE_ACTIVE;
			} else if (this.STATE_HOVER === this._state_erase) {
				this._state_erase = this.STATE_ACTIVE;
			} else if (this.isHover) {
				this._state = this.STATE_ACTIVE;
			}
		}
		onClick(x, y) {
			if (this.STATE_ACTIVE === this._state_start) {
				let places = [];
				for (const tags of searchtags) {
					if (tags.text) {
						places.push(tags.full_text);
					}
				}
				pls.startSearch(box_search.txt, places);
				this._state_start = this.STATE_NORMAL;
				this.state = this.STATE_NORMAL;
			} else if (this.STATE_ACTIVE === this._state_erase) {
				this._tb.deleteAll();
				this._state_erase = this.STATE_NORMAL;
				this.state = this.STATE_NORMAL;
			} else if (this.isActive) {
				this.state = this.STATE_NORMAL;
			}
		}
		onChar(char) {
			this._tb.onChar(char);
		}
		onKeyCode(key) {
			switch (key) {
				case 8:
				case 37:
				case 39:
				case 46:
					this._tb.onKey(key);
					break;
				case 13:
					let places = [];
					for (const tags of searchtags) {
						if (tags.text) {
							places.push(tags.full_text);
						}
					}
					pls.startSearch(this._tb.full_text, places);
					break;
				default:
			}
		}
	}
	
	class Textbox extends Widget {
		get text() { return this._tb.txt; }
		get focus() { return this._focus; }
		get state_delete() { return this._state_delete; }
		get caret_pos() { return this.x + this._tb.caret.x + PADDING_TEXTBOX; }
		get caret_width() { return this._tb.caret.w; }
		get text_pos() { return this._text_pos; }
		get text_width() { return this._text_width; }
		get delete_button_pos() { return this._delete_button_pos; }
		get full_text() { return this._tb.full_text }
		constructor(index, text) {
			super();
			this._index = index;
			this.recalcPosition();
			this.size = [
				WIDTH_FRAME - PADDING_HORIZONTAL_FRAME*2,
				FNT_TEXTBOX.Height + PADDING_TEXTBOX*2
			];
			this._focus = 0;
			this._delete_button_pos = this.x + this.w - this.h
			this._text_pos = this.x + PADDING_TEXTBOX;
			this._text_width = this.w - PADDING_TEXTBOX*2 - WIDTH_DELETEBUTTON;
			this._state_delete = this.STATE_NORMAL;
			this._tb = new Textcontainer(this._text_width, FNT_TEXTBOX, usr.isTextboxEraseOnDeleteKeycode(), text);
		}
		onFocusGet() {
			this._focus = 3;
			animator_textbox_caret.start(CLR_CARET.length, DURATION_ANIMATION_CARET);
		}
		onFocusLost() {
			this._focus = 0;
			if (animator_textbox_caret.is_exec) {
				animator_textbox_caret.stop();
			}
		}
		onLoose() {
			this.state = this.STATE_NORMAL;
			this._state_delete = this.STATE_NORMAL;
		}
		onEnter(x, y) {
			this.state = this.STATE_HOVER;
			this.onHover(x, y);
		}
		onHover(x, y) {
			if (x > this._delete_button_pos) {
				this._state_delete = this.STATE_HOVER;
			} else if (this._state_delete === this.STATE_HOVER) {
				this._state_delete = this.STATE_NORMAL;
			}
		}
		onLeftButton(x, y) {
			if (this.STATE_HOVER === this._state_delete) {
				this._state_delete = this.STATE_ACTIVE;
			} else if (this.isHover) {
				this.state = this.STATE_ACTIVE;
			}
		}
		onClick(x, y) {
			if (this.STATE_ACTIVE === this._state_delete) {
				this._state_delete = this.STATE_NORMAL;
				this.state = this.STATE_NORMAL;
				searchtags.del(this._index);
				for (const item of searchtags.fromStart(this._index)) {
					item.decreaseIndex();
					item.recalcPosition();
				}
				btn_addtag.recalcPosition();
			} else if (this.isActive) {
				this.state = this.STATE_NORMAL;
			}
		}
		decreaseIndex() {
			this._index--;
		}
		onChar(char) {
			this._tb.onChar(char);
		}
		onKeyCode(key) {
			switch (key) {
				case 8:
				case 37:
				case 39:
				case 46:
					this._tb.onKey(key);
					break;
				default:
			}
		}
		recalcPosition() {
			this.pos = [
				PADDING_HORIZONTAL_FRAME,
				box_search.b + MARGIN_TAGS + this._index*(FNT_TEXTBOX.Height + PADDING_TEXTBOX*2 + MARGIN_TEXTBOX)
			];
		}
	}
	
	class AddTagButton extends Widget {
		constructor(tag_height) {
			super();
			this.size = [ cfg.getAddTagButtonWidth(), cfg.getAddTagButtonHeight() ];
			this._tag_height = tag_height;
			this.recalcPosition();
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
			let result = menu.activate(frm.x + x, frm.y + y);
			if (result) {
				let [ text, expression ] = [ ...result ];
				searchtags.add(new Textbox(searchtags.length, expression));
				this.recalcPosition();
			}
			this.state = this.STATE_NORMAL;
		}
		
		recalcPosition() {
			this.pos = [
				cfg.getPanelbarWidth() - this.w - PADDING_HORIZONTAL_FRAME,
				box_search.b + MARGIN_TAGS + searchtags.length*(this._tag_height) + (searchtags.length ? MARGIN_ADD_BUTTON : 0)
			];
		}
	}
	
	frm = new Self();
	return frm;
}
function Sortframe(pls, imgs, cfg, usr, header) {
	
	const FNT_SORTTEXT = cfg.FONT_SORTBAR_SORT;
	const CLR_SORTTEXT = cfg.COLOR_SORTBAR_SORT;
	const IMG_SORT = imgs.IMAGE_SORT;
	const IMG_DEL = imgs.IMAGE_SORT_DELETE;
	const IMG_ADD = imgs.IMAGE_ADD_SORT;
	const PADDING_HORIZONTAL = cfg.getPanelbarHorizontalPadding();
	const PADDING_VERTICAL = cfg.getSortbarVerticalPadding();
	const PADDING_SORTTEXT = cfg.getSorttextPadding();
	const HEIGHT_ADD_BUTTON = cfg.getAddSortButtonHeight();
	const HEIGHT_SORT = FNT_SORTTEXT.Height + PADDING_SORTTEXT*2;
	const WIDTH_ADD_BUTTON = cfg.getAddSortButtonWidth();
	const WIDTH_FRAME = cfg.getPanelbarWidth();
	const WIDTH_SORT = cfg.getPanelbarWidth() - PADDING_HORIZONTAL*2;
	const WIDTH_DELETE_BUTTON = HEIGHT_SORT;
	const WIDTH_SORT_BUTTON = WIDTH_SORT - WIDTH_DELETE_BUTTON;
	const MARGIN_ADD_BUTTON = cfg.getAddSortButtonMargin();
	const MARGIN_SORT = cfg.getSortButtonMargin();
	
	let frm = null;
	let wjts = null;
	let sorters = null;
	let btn_add = null;
	let menu = null;
	let width = 0, height = 0;
	
	class Self extends Subframe {
		
		constructor() {
			super();
			this.pos = [ cfg.getSidebarWidth(), 0 ];
			menu = new Sortmenu(usr);
			wjts = new Widgets();
			sorters = new Widgets();
			wjts.add(btn_add = new AddSortButton());
			wjts.add(sorters);
			IMG_SORT.size = [ WIDTH_SORT_BUTTON, HEIGHT_SORT ];
			IMG_ADD.size = [ WIDTH_ADD_BUTTON, HEIGHT_ADD_BUTTON ];
			IMG_DEL.pos = [ WIDTH_SORT_BUTTON, 0 ];
			IMG_DEL.size = [ WIDTH_DELETE_BUTTON, HEIGHT_SORT ];
			this.widgets = wjts;
		}
		
		onSize(w, h) {
			width = w, height = h;
			this.size = [
				cfg.getPanelbarWidth(),
				height
			];
		}
		
		onUpdate() {
			sorters.del_all();
			let indexes = usr.getSortIndexesForPlaylist(pls.index)
			for (let index of indexes) {
				if (menu.isValidIndex(index)) {
					let result = menu.getItemFromIndex(index);
					let [ text, expression, _ ] = [ ...result ];
					sorters.add(new Sorter(sorters.length, text, expression), usr.isApplySortOnAdd());
				}
			}
			btn_add.recalcPosition();
		}
		
		onFlush() {
			sorters.del_all();
			btn_add.recalcPosition();
		}
		
		onDraw(g) {
			header.onDraw(g);
			for (let wjt of sorters) {
				g.GdiAlphaBlend(
					IMG_SORT.img(wjt.state),
					this.x + wjt.x + IMG_SORT.x, this.y + wjt.y + IMG_SORT.y, IMG_SORT.w, IMG_SORT.h,
					0, 0, IMG_SORT.w, IMG_SORT.h
				);
				g.GdiAlphaBlend(
					IMG_DEL.img(wjt.state_delete),
					this.x + wjt.x + IMG_DEL.x, this.y + wjt.y + IMG_DEL.y, IMG_DEL.w, IMG_DEL.h,
					0, 0, IMG_DEL.w, IMG_DEL.h
				);
				g.GdiDrawText(
					wjt.text,
					FNT_SORTTEXT, CLR_SORTTEXT[wjt.state],
					this.x + wjt.x + PADDING_SORTTEXT, this.y + wjt.y + PADDING_SORTTEXT,
					WIDTH_SORT_BUTTON - PADDING_SORTTEXT*2, FNT_SORTTEXT.Height,
					0x00000820
				);
			}
			g.GdiAlphaBlend(
				IMG_ADD.img(btn_add.state),
				this.x + btn_add.x + IMG_ADD.x, this.y + btn_add.y + IMG_ADD.y, IMG_ADD.w, IMG_ADD.h,
				0, 0, IMG_ADD.w, IMG_ADD.h
			);
		}
	}
	
	class AddSortButton extends Widget {
		constructor() {
			super();
			this.recalcPosition();
			this.size = [ cfg.getAddSortButtonWidth(), cfg.getAddSortButtonHeight() ];
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
			let result = menu.activate(frm.x + x, frm.y + y);
			if (result) {
				let [ text, expression, index ] = [ ...result ];
				usr.addSortIndexForPlaylist(index, pls.index);
				sorters.add(new Sorter(sorters.length, text, expression, usr.isApplySortOnAdd()));
				this.recalcPosition();
			}
			this.state = this.STATE_NORMAL;
		}
		
		recalcPosition() {
			this.pos = [
				cfg.getPanelbarWidth() - this.w - PADDING_HORIZONTAL,
				PADDING_VERTICAL + header.height + (sorters.length ? MARGIN_ADD_BUTTON : 0) + sorters.length*(HEIGHT_SORT + MARGIN_SORT)
			];
		}
	}
	
	class Sorter extends Widget {
		
		get state_delete() { return this._state_del }
		get text() { return this._txt }
		get direction() { return this._dir }
		
		constructor(index, txt, sort_expression, immediate_apply) {
			super();
			this._index = index;
			this.pos = [
				PADDING_HORIZONTAL,
				PADDING_VERTICAL + header.height + this._index * (HEIGHT_SORT + MARGIN_SORT)
			];
			this.size = [
				WIDTH_SORT,
				HEIGHT_SORT
			];
			this._txt = txt;
			this._expression = sort_expression;
			if (immediate_apply) {
				pls.sort(this._expression, 1);
				this._dir = -1;
			} else {
				this._dir = 1;
			}
			this._state_del = this.STATE_NORMAL;
		}
		
		onLoose() {
			this.state = this.STATE_NORMAL;
			this._state_del = this.STATE_NORMAL;
		}
		
		onEnter(x, y) {
			if (x - this.x < WIDTH_SORT_BUTTON) {
				this.state = this.STATE_HOVER;
				this._state_del = this.STATE_NORMAL;
			} else {
				this.state = this.STATE_NORMAL;
				this._state_del = this.STATE_HOVER;
			}
		}
		
		onHover(x, y) {
			if (x - this.x < WIDTH_SORT_BUTTON) {
				this.state = this.STATE_HOVER;
				this._state_del = this.STATE_NORMAL;
			} else {
				this.state = this.STATE_NORMAL;
				this._state_del = this.STATE_HOVER;
			}
		}
		
		onLeftButton(x, y) {
			if (this.state === this.STATE_HOVER) {
				this.state = this.STATE_ACTIVE;
			} else if (this._state_del === this.STATE_HOVER) {
				this._state_del = this.STATE_ACTIVE;
			}
		}
		
		onClick(x, y) {
			if (this.state === this.STATE_ACTIVE) {
				pls.sort(this._expression, this._dir);
				this.swapDirection();
				this.state = this.STATE_NORMAL;
			} else if (this._state_del === this.STATE_ACTIVE) {
				sorters.del(this._index);
				usr.deleteSortIndexForPlaylist(this._index, pls.index);
				for (const srt of sorters.fromStart(this._index)) {
					srt._index -= 1;
					srt.pos = [ srt.x, srt.y - HEIGHT_SORT - MARGIN_SORT ];
				}
				btn_add.recalcPosition();
				this._state_del = this.STATE_NORMAL;
			}
		}
		
		swapDirection() {
			if (this._dir > 0) {
				this._dir = -1;
			} else if (this._dir < 0) {
				this._dir = 1;
			} else {
				this._dir = 1;
			}
		}
	}
	
	frm = new Self();
	return frm;
}
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
/*

*/
class Frame {

	get x() { return this._x; }
	get w() { return this._w; }
	get a() { return this._a; }
	get y() { return this._y; }
	get h() { return this._h; }
	get b() { return this._b; }
	
	get order_indexes() { return [ 0, 0, 0 ]; }
	
	constructor() {
		this._x = 0;
		this._y = 0;
		this._w = 0;
		this._h = 0;
		this._a = 0;
		this._b = 0;
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
	
	onUpdate() {}
	
	onFlush() {}
	
	onMouseCome() {}
	
	onMouseOut() {}
	
	onMouseMove() {}
	
	onPressedMouseMove() {}
	
	onMouseLeftButtonDown() {}
	
	onMouseLeftButtonDoubleClick() {}
	
	onMouseLeftButtonUp() {}
	
	onMouseRightButtonDown() {}
	
	onMouseRightButtonUp() {}
	
	onDraw() {}
	
	onSize() {}
	
	onMouseWheel() {}
	
	onFocusIn() {}
	
	onFocusOut() {}
	
	onCharCode() {}
	
	onKeyCode() {}
}
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
function Pictures(cfg, usr) {
	
	const ART_SIZE = cfg.getTileHeight();
	const IMGS_PATH = usr.getPathForImages();
	const BUILDTYPE_DEFAULT = 0;
	const BUILDTYPE_VERTICAL = 1;
	const BUILDTYPE_HORIZONTAL = 2;
	const RESIZETYPE_DEFAULT = 0;
	const RESIZETYPE_VERTICAL = 1;
	const RESIZETYPE_HORIZONTAL = 2;
	const RESIZE_QUALITY = cfg.getResizeQuality();
	const RESIZE_QUALITY_ART = cfg.getResizeArtQuality();
	let IMG_MASK = null;
	let ART_MARGIN = 0;
	
	let self = null;
	let art_fonds = null;
	let art_original = null;
	
	class Self {
		constructor() {
			art_fonds = [];
			IMG_MASK = createMaskForArt();
			ART_MARGIN = 0;
			prepareArtsImages();
		}
		
		get IMAGE_TILE() {
			return buildImages(
				"tiles",
				cfg.MARGIN_IMAGE_TILE, 16,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_STATE() {
			return buildImages(
				"icon_state",
				cfg.MARGIN_IMAGE_STATE, 3,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_PLAYSTRIPE() {
			return buildImages(
				"playstripe",
				cfg.MARGIN_IMAGE_PLAYSTRIPE, 8,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_SCROLLUP() {
			return buildImages(
				"scrollup",
				cfg.MARGIN_IMAGE_SCROLLUP, 3,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_SCROLLDOWN() {
			return buildImages(
				"scrolldown",
				cfg.MARGIN_IMAGE_SCROLLDOWN, 3,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_SLIDER() {
			return buildImages(
				"slider",
				cfg.MARGIN_IMAGE_SLIDER, 3,
				BUILDTYPE_HORIZONTAL, RESIZETYPE_HORIZONTAL
			);
		}
		
		get IMAGE_SCROLLBAR_BACKGROUND() {
			return buildImage(
				"scrollbar_background",
				cfg.MARGIN_IMAGE_SCROLLBAR_BACKGROUND,
				BUILDTYPE_DEFAULT, RESIZETYPE_HORIZONTAL
			);
		}
		
		get IMAGE_SCROLLBAR_TIP() {
			return buildImage(
				"tip",
				cfg.MARGIN_IMAGE_SCROLLBAR_TIP,
				BUILDTYPE_DEFAULT, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_SIDEBAR_BACKGROUND() {
			return buildImage(
				"sidepanel_background",
				cfg.MARGIN_IMAGE_SIDEBAR_BACKGROUND,
				BUILDTYPE_DEFAULT, RESIZETYPE_HORIZONTAL
			);
		}
		
		get IMAGE_ICON_MAIN() {
			return buildImages(
				"sidepanel_logo",
				cfg.MARGIN_IMAGE_ICON_MAIN, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_ICON_SORT() {
			return buildImages(
				"sidepanel_sort",
				cfg.MARGIN_IMAGE_ICON_SORT, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_ICON_SEARCH() {
			return buildImages(
				"sidepanel_search",
				cfg.MARGIN_IMAGE_ICON_SEARCH, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_ICON_PARAMS() {
			return buildImages(
				"sidepanel_param",
				cfg.MARGIN_IMAGE_ICON_PARAMS, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_ICON_SETTINGS() {
			return buildImages(
				"sidepanel_settings",
				cfg.MARGIN_IMAGE_ICON_SETTINGS, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_PANELBAR_BORDER() {
			return buildImage(
				"sidepanel_border",
				cfg.MARGIN_IMAGE_PANELBAR_BORDER,
				BUILDTYPE_DEFAULT, RESIZETYPE_HORIZONTAL
			);
		}
		
		get IMAGE_PANELHEADER_BACKGROUND() {
			return buildImage(
				"header_background",
				cfg.MARGIN_IMAGE_PANELHEADER_BACKGROUND,
				BUILDTYPE_DEFAULT, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_SORT() {
			return buildImages(
				"sort",
				cfg.MARGIN_IMAGE_SORT, 3,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_SORT_DELETE() {
			return buildImages(
				"delete_sort",
				cfg.MARGIN_IMAGE_SORT_DELETE, 3,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_ADD_SORT() {
			return buildImages(
				"add_sort",
				cfg.MARGIN_IMAGE_ADD_SORT, 3,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_SEARCHBOX() {
			return buildImages(
				"searchbox",
				cfg.MARGIN_IMAGE_SEARCHBOX, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_SEARCHBOX_ERASE() {
			return buildImages(
				"erase_searchbox",
				cfg.MARGIN_IMAGE_SEARCHBOX_ERASE, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_STARTSEARCH() {
			return buildImages(
				"start_search",
				cfg.MARGIN_IMAGE_STARTSEARCH, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_ADDTEXTBOX() {
			return buildImages(
				"add_searchtag",
				cfg.MARGIN_IMAGE_ADDTEXTBOX, 3,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_TEXTBOX() {
			return buildImages(
				"searchtag",
				cfg.MARGIN_IMAGE_TEXTBOX, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_NUMBER_TEXTBOX() {
			return buildImages(
				"textbox",
				cfg.MARGIN_IMAGE_NUMBER_TEXTBOX, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_TOGGLEBOX() {
			return buildImages(
				"togglebox",
				cfg.MARGIN_IMAGE_TOGGLEBOX, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_TEXTBOX_DELETE() {
			return buildImages(
				"delete_textbox",
				cfg.MARGIN_IMAGE_TEXTBOX_DELETE, 6,
				BUILDTYPE_VERTICAL, RESIZETYPE_DEFAULT
			);
		}
		
		get IMAGE_FASTSEARCH_BACKGROUND() {
			return buildImages(
				"fastsearch_background",
				cfg.MARGIN_IMAGE_FASTSEARCH_BACKGROUND, 3,
				BUILDTYPE_VERTICAL, RESIZETYPE_VERTICAL
			);
		}
		
		get IMAGE_DEFAULT_ART() {
			const MARGIN = ART_MARGIN;
			let [ REFERENCE, WIDTH, HEIGHT ] =  [ art_original, art_original.Width, art_original.Height ];
			let m = MARGIN;
			let x = -MARGIN;
			let y = -MARGIN;
			let w = ART_SIZE + MARGIN*2;
			let h = ART_SIZE + MARGIN*2;
			let img = REFERENCE.Resize(w, h, RESIZE_QUALITY_ART).CreateRawBitmap();
			let special_picture = {
				get img() { return img; },
				get x() { return x; },
				get y() { return y; },
				get w() { return w; },
				get h() { return h; },
				set size(value) {
					throw new Error("Arts objects cannot be resized")
				},
				set pos(value) {
					let [ _x, _y ] = [ ...value ];
					x = _x - m;
					y = _y - m;
				}
			}
			return special_picture;
		}
		
		isCanCreateArt() {
			return !!art_fonds.length;
		}
		
		createArt(txt) {
			const MARGIN = ART_MARGIN;
			if (!txt) return null;
			if (!art_fonds.length) throw new Error("Art cannot be generated");
			let reference = art_fonds.random_except_sequence;
			let tmp_img = gdi.CreateImage(reference.Width, reference.Height);
			let g = tmp_img.GetGraphics();
			g.DrawImage(
				reference,
				0, 0, tmp_img.Width, tmp_img.Height,
				0, 0, reference.Width, reference.Height
			);
			g.SetTextRenderingHint(5);
			g.DrawString(
				txt,
				cfg.FONT_ICON_TEXT, cfg.COLOR_ICON_TEXT,
				0, 0, reference.Width, reference.Height,
				util.stringFormat(1, 1)
			);
			tmp_img.ReleaseGraphics(g);
			let m = Math.round(MARGIN*2 / reference.Height * ART_SIZE / 2);
			let x = -m;
			let y = -m;
			let w = ART_SIZE + m*2;
			let h = ART_SIZE + m*2;
			let img = tmp_img.Resize(w, h, RESIZE_QUALITY_ART).CreateRawBitmap();
			let special_picture = {
				get img() { return img; },
				get x() { return x; },
				get y() { return y; },
				get w() { return w; },
				get h() { return h; },
				set size(value) {
					throw new Error("Arts objects can not be resized")
				},
				set pos(value) {
					let [ _x, _y ] = [ ...value ];
					x = _x - m;
					y = _y - m;
				}
			}
			return special_picture;
		}
		
		assignArt(reference) {
			const MARGIN = ART_MARGIN;
			let m = Math.round(MARGIN*2 / reference.Height * ART_SIZE / 2);
			let x = -m;
			let y = -m;
			let w = ART_SIZE + m*2;
			let h = ART_SIZE + m*2;
			let img = null;
			if (IMG_MASK) {
				reference = reference.Resize(w, h, RESIZE_QUALITY_ART);
				reference.ApplyMask(IMG_MASK);
				img = reference.CreateRawBitmap();
			} else {
				img = reference.Resize(w, h, RESIZE_QUALITY_ART).CreateRawBitmap();
			}
			let special_picture = {
				get img() { return img; },
				get x() { return x; },
				get y() { return y; },
				get w() { return w; },
				get h() { return h; },
				set size(value) {
					throw new Error("Arts objects can not be resized")
				},
				set pos(value) {
					let [ _x, _y ] = [ ...value ];
					x = _x - m;
					y = _y - m;
				}
			}
			return special_picture;
		}
	}
	
	function buildImages(name, margin, length, build_type, resize_type) {
		let REFERENCE = null, WIDTH = 0, HEIGHT = 0;
		switch (build_type) {
			case 0:
				( [ REFERENCE, WIDTH, HEIGHT ] = [ ...createImages(name, length) ] );
				break;
			case 1:
				( [ REFERENCE, WIDTH, HEIGHT ] = [ ...createImagesDividedByHeight(name, length) ] );
				break;
			case 2:
				( [ REFERENCE, WIDTH, HEIGHT ] = [ ...createImagesDividedByWidth(name, length) ] );
				break;
			default:
				throw new Error("Illegal type for build image: build_type = " + build_type);
		}
		let imgs = [];
		for (const img of REFERENCE) {
			imgs.push(img.CreateRawBitmap());
		}
		let x = 0;
		let y = 0;
		let _x = x;
		let _y = y;
		let w = WIDTH;
		let h = HEIGHT;
		let m = margin;
		let picture = {
			img(state) { return imgs[state]; },
			get x() { return x; },
			get y() { return y; },
			get w() { return w; },
			get h() { return h; },
			get m() { return m; },
			set pos(value) {
				( [ _x, _y ] = [ ...value ] );
				x = _x - m;
				y = _y - m;
			}
		};
		let resize_func = null;
		switch (resize_type) {
			case 0:
				resize_func = (value) => {
					let [ _w, _h ] = [ ...value];
					m = Math.round(margin / (HEIGHT - margin*2) * _h);
					x = _x - m;
					y = _y - m;
					w = _w + m*2;
					h = _h + m*2;
					imgs = resizeImages(REFERENCE, w, h, m);
				}
				break;
			case 1:
				resize_func = (value) => {
					let [ _w, _h ] = [ ...value];
					m = Math.round(margin / (HEIGHT - margin*2) * _h);
					x = _x - m;
					y = _y - m;
					w = _w + m*2;
					h = _h + m*2;
					imgs = resizeImagesDividedByHeight(REFERENCE, w, h, m);
				}
				break;
			case 2:
				resize_func = (value) => {
					let [ _w, _h ] = [ ...value];
					m = Math.round(margin / (WIDTH - margin*2) * _w);
					x = _x - m;
					y = _y - m;
					w = _w + m*2;
					h = _h + m*2;
					imgs = resizeImagesDividedByWidth(REFERENCE, w, h, m);
				}
				break;
			default:
				throw new Error("Illegal type for build image: resize_type = " + resize_type);
		}
		Object.defineProperty(picture, "size", {
			set: resize_func,
			enumerable: true,
			configurable: true
		});
		return picture;
	}
	
	function buildImage(name, margin, build_type, resize_type) {
		let REFERENCE = gdi.Image(IMGS_PATH + name + ".png");
		if (!REFERENCE) throw new Error(`Image ${name} not loaded`);
		let WIDTH = REFERENCE.Width;
		let HEIGHT = REFERENCE.Height;
		let img = null;
		img = REFERENCE.CreateRawBitmap();
		let x = 0;
		let y = 0;
		let _x = x;
		let _y = y;
		let w = WIDTH;
		let h = HEIGHT;
		let m = margin;
		let picture = {
			get img() { return img; },
			get x() { return x; },
			get y() { return y; },
			get w() { return w; },
			get h() { return h; },
			get m() { return m; },
			set pos(value) {
				( [ _x, _y ] = [ ...value ] );
				x = _x - m;
				y = _y - m;
			}
		};
		let resize_func = null;
		switch (resize_type) {
			case 0:
				resize_func = (value) => {
					let [ _w, _h ] = [ ...value];
					m = Math.round(margin / (HEIGHT - margin*2) * _h);
					x = _x - m;
					y = _y - m;
					w = _w + m*2;
					h = _h + m*2;
					img = REFERENCE.Resize(w, h, RESIZE_QUALITY).CreateRawBitmap();
				}
				break;
			case 1:
				resize_func = (value) => {
					let [ _w, _h ] = [ ...value];
					m = Math.round(margin / (HEIGHT - margin*2) * _h);
					x = _x - m;
					y = _y - m;
					w = _w + m*2;
					h = _h + m*2;
					img = resizeImageByHeight(REFERENCE, w, h, m).CreateRawBitmap();
				}
				break;
			case 2:
				resize_func = (value) => {
					let [ _w, _h ] = [ ...value];
					m = Math.round(margin / (WIDTH - margin*2) * _w);
					x = _x - m;
					y = _y - m;
					w = _w + m*2;
					h = _h + m*2;
					img = resizeImageByWidth(REFERENCE, w, h, m).CreateRawBitmap();
				}
				break;
			default:
				throw new Error("Illegal type for build image: resize_type = " + resize_type);
		}
		Object.defineProperty(picture, "size", {
			set: resize_func,
			enumerable: true,
			configurable: true
		});
		return picture;
	}
	
	function createImages(img_name, massive_length) {
		let img = gdi.Image(IMGS_PATH + img_name + ".png");
		if (!img) throw new Error(`Image ${img_name} not loaded`);
		if (img.Width > img.Height) {
			return divideImageByWidth(img, massive_length);
		} else if (img.Width < img.Height) {
			return divideImageByHeight(img, massive_length);
		} else {
			return divideImageByWidth(img, massive_length);
		}
	}
	
	function createImagesDividedByWidth(img_name, massive_length) {
		let img = gdi.Image(IMGS_PATH + img_name + ".png");
		if (!img) throw new Error(`Image ${img_name} not loaded`);
		return divideImageByWidth(img, massive_length);
	}
	
	function createImagesDividedByHeight(img_name, massive_length) {
		let img = gdi.Image(IMGS_PATH + img_name + ".png");
		if (!img) throw new Error(`Image ${img_name} not loaded`);
		return divideImageByHeight(img, massive_length);
	}
	
	function divideImageByWidth(reference, massive_length) {
		let result = [];
		let width = Math.round(reference.Width / massive_length);
		for (let i = 0; i < massive_length; i++) {
			let img = gdi.CreateImage(width, reference.Height);
			let g = img.GetGraphics();
			g.DrawImage(
				reference,
				0, 0,
				img.Width, img.Height,
				i*width, 0,
				width, reference.Height,
			);
			img.ReleaseGraphics(g);
			result.push(img);
		}
		return [ result, width, reference.Height ];
	}
	
	function divideImageByHeight(reference, massive_length) {
		let result = [];
		let height = Math.round(reference.Height / massive_length);
		for (let i = 0; i < massive_length; i++) {
			let img = gdi.CreateImage(reference.Width, height);
			let g = img.GetGraphics();
			g.DrawImage(
				reference,
				0, 0,
				img.Width, img.Height,
				0, i*height,
				reference.Width, height
			);
			img.ReleaseGraphics(g);
			result.push(img);
		}
		return [ result, reference.Width, height ] ;
	}
	
	function resizeImages(references, w, h, m) {
		let result = [];
		for (const reference of references) {
			result.push(reference.Resize(w, h, RESIZE_QUALITY).CreateRawBitmap());
		}
		return result;
	}
	
	function resizeImagesDividedByWidth(references, w, h, m) {
		let result = [];
		for (let reference of references) {
			result.push(resizeImageByWidth(reference, w, h, m).CreateRawBitmap());
		}
		return result;
	}
	
	function resizeImagesDividedByHeight(references, w, h, m) {
		let result = [];
		for (let reference of references) {
			result.push(resizeImageByHeight(reference, w, h, m).CreateRawBitmap());
		}
		return result;
	}
	
	function resizeImageByWidth(reference, w, h, m) {
		w = util.max(w, 1);
		h = util.max(h, 1);
		let result = gdi.CreateImage(w, h);
		reference = reference.Resize(w, Math.round(w / reference.Width * reference.Height), RESIZE_QUALITY);
		let h_icon = Math.round(reference.Height/3);
		let pos_icon = Math.round(reference.Height/3*2);
		let h_background = pos_icon;
		let first_part = Math.round(m + (h_background - m*2)/3);
		let last_part = first_part;
		let middle_part = h_background - first_part - last_part;
		let g = result.GetGraphics();
		g.DrawImage(
			reference,
			0, 0, reference.Width, first_part,
			0, 0, reference.Width, first_part
		);
		let i = 0;
		for (; first_part + i*middle_part + middle_part < h - last_part; i++) {
			g.DrawImage(
				reference,
				0, first_part + i*middle_part, reference.Width, middle_part,
				0, first_part, reference.Width, middle_part
			);
		}
		if ((h - (first_part + i*middle_part) - last_part) > 0) {
			g.DrawImage(
				reference,
				0, first_part + i*middle_part, reference.Width, h - (first_part + i*middle_part) - last_part,
				0, first_part, reference.Width, h - (first_part + i*middle_part) - last_part
			);
		}
		g.DrawImage(
			reference,
			0, first_part + i*middle_part + (h - (first_part + i*middle_part) - last_part), reference.Width, last_part,
			0, first_part + middle_part, reference.Width, last_part
		);
		g.DrawImage(
			reference,
			0, Math.round(result.Height/2 - h_icon/2), reference.Width, h_icon,
			0, pos_icon, reference.Width, h_icon
		);
		result.ReleaseGraphics(g);
		return result;
	}
	
	function resizeImageByHeight(reference, w, h, m) {
		w = util.max(w, 1);
		h = util.max(h, 1);
		let result = gdi.CreateImage(w, h);
		reference = reference.Resize(Math.round(h / reference.Height * reference.Width), h, RESIZE_QUALITY);
		let w_icon = Math.round(reference.Width/3);
		let pos_icon = Math.round(reference.Width/3*2);
		let w_background = pos_icon;
		let first_part = Math.round(m + (w_background - m*2)/3);
		let last_part = first_part;
		let middle_part = w_background - first_part - last_part;
		let g = result.GetGraphics();
		g.DrawImage(
			reference,
			0, 0, first_part, reference.Height,
			0, 0, first_part, reference.Height
		);
		let i = 0;
		for (; first_part + i*middle_part + middle_part < w - last_part; i++) {
			g.DrawImage(
				reference,
				first_part + i*middle_part, 0, middle_part, reference.Height,
				first_part, 0, middle_part, reference.Height
			);
		}
		if ((w - (first_part + i*middle_part) - last_part) > 0) {
			g.DrawImage(
				reference,
				first_part + i*middle_part, 0, w - (first_part + i*middle_part) - last_part, reference.Height,
				first_part, 0, w - (first_part + i*middle_part) - last_part, reference.Height
			);
		}
		g.DrawImage(
			reference,
			first_part + i*middle_part + (w - (first_part + i*middle_part) - last_part), 0, last_part, reference.Height,
			first_part + middle_part, 0, last_part, reference.Height
		);
		g.DrawImage(
			reference,
			Math.round(result.Width/2 - w_icon/2), 0, w_icon, reference.Height,
			pos_icon, 0, w_icon, reference.Height
		);
		result.ReleaseGraphics(g);
		return result;
	}
	
	function createMaskForArt() {
		let result = gdi.Image(IMGS_PATH + "mask.png");
		if (!result) return null;
		if ((result.Width !== ART_SIZE) || (result.Height !== ART_SIZE)) {
			result = result.Resize(ART_SIZE, ART_SIZE, RESIZE_QUALITY);
		}
		return result;
	}
	
	function prepareArtsImages() {
		let reference = gdi.Image(IMGS_PATH + "default_art.png");
		if (!reference) throw new Error("Image not load");
		if (reference.Width !== reference.Height) {
			let tmp_img = null;
			if (reference.Width > reference.Height) {
				let size = reference.Height;
				tmp_img = gdi.CreateImage(size, size);
				let g = tmp_img.GetGraphics();
				g.DrawImage(
					reference,
					0, 0, size, size,
					0, 0, size, size
				);
				tmp_img.ReleaseGraphics(g);
				for (let i = 1; i*size + size <= reference.Width; ++i) {
					let tmp_img2 = gdi.CreateImage(size, size);
					let g = tmp_img2.GetGraphics();
					g.DrawImage(
						reference,
						0, 0, size, size,
						i*size, 0, size, size
					);
					tmp_img2.ReleaseGraphics(g);
					art_fonds.push(tmp_img2);
				}
				art_original = tmp_img;
			} else if (reference.Width < reference.Height) {
				let size = reference.Width;
				tmp_img = gdi.CreateImage(size, size);
				let g = tmp_img.GetGraphics();
				g.DrawImage(
					reference,
					0, 0, size, size,
					0, 0, size, size
				);
				tmp_img.ReleaseGraphics(g);
				for (let i = 1; i*size + size <= reference.Height; ++i) {
					let tmp_img2 = gdi.CreateImage(size, size);
					let g = tmp_img2.GetGraphics();
					g.DrawImage(
						reference,
						0, 0, size, size,
						0, i*size, size, size
					);
					tmp_img2.ReleaseGraphics(g);
					art_fonds.push(tmp_img2);
				}
				art_original = tmp_img;
			}
		}  else {
			art_original = reference;
		}
	}
	
	self = new Self();
	return self;
}
/*

*/
function Playlistframe(cfg, usr, imgs, pls, bridge) {

	const DELAY_SELECTION = cfg.PLAYLISTFRAME_DELAY_SELECTION;
	const DELAY_TILEMOVER = cfg.PLAYLISTFRAME_DELAY_TILEMOVER;
	const DURATION_ANIMATION_SELECTION = cfg.DURATION_ANIMATION_SELECTION;
	const FNT_CAPTION = cfg.FONT_CAPTION;
	const FNT_ROWS = cfg.FONT_ROWS;
	const FNT_DURATION = cfg.FONT_DURATION;
	const FNT_NUMERATOR = cfg.FONT_NUMERATOR;
	const FNT_FASTSEARCH = cfg.FONT_PLAYLISTBAR_FASTSEARCH;
	const CLR_CAPTION = cfg.COLOR_TILE_CAPTION;
	const CLR_ROWS = cfg.COLOR_TILE_ROWS;
	const CLR_DURATION = cfg.COLOR_TILE_DURATION;
	const CLR_NUMERATOR = cfg.COLOR_NUMERATOR;
	const CLR_SELECTION = cfg.COLOR_SELECTION_RECTANGLE;
	const CLR_FASTSEARCH = cfg.COLOR_FASTSEARCH_TEXT;
	const IMG_TILE = imgs.IMAGE_TILE;
	const IMG_STATE = imgs.IMAGE_STATE;
	const IMG_PLAYSTRIPE = imgs.IMAGE_PLAYSTRIPE;
	const IMG_FASTSEARCH = imgs.IMAGE_FASTSEARCH_BACKGROUND;
	const FRAME_MARGIN = cfg.MARGIN_PLAYLISTFRAME;

	let frm = null;
	let wjts = null;
	let hover_widget = null;
	let active_widget = null;
	let tile_sizes = null;
	let pls_items = null;
	let selection = null;
	let max_visible_tiles = 0;
	let stratum = null;
	let start_index = 0;
	let margin_right = 0, margin_left = 0;
	let playing_time = 0;
	let formated_playing_time = 0;
	let stratum_mover_controller = null;
	let moving_widget_index = -1;
	let numerator = null;
	let fsearch = null;
	let fsearch_sizes = null;
	let is_need_scrollbar = false;
	let indix_color_selection = 0;
	let animator_caret = null;
	let mouse_keeper = null;
	let width = 0, height = 0;

	class Self extends Frame {

		get order_indexes() { return [ 3, 0, 0 ]; }

		constructor() {
			super();
			this.pos = [ cfg.getSidebarWidth() + FRAME_MARGIN, FRAME_MARGIN ];
			wjts = new Widgets();
			stratum = new Stratum();
			numerator = { is_draw: cfg.isDrawTilesNumerator(), width: 0, margin: cfg.tilesNumeratorMargin() };
			fsearch = new FastSearch();
			([ margin_left, margin_right ] = cfg.getPlaylistbarPaddings());
			tile_sizes = cfg.getTileMargins();
			tile_sizes.height = cfg.getTileHeight();
			tile_sizes.average = tile_sizes.height + tile_sizes.margin;
			tile_sizes.icon_x = tile_sizes.left;
			tile_sizes.icon_y = 0;
			tile_sizes.icon_w = tile_sizes.height;
			tile_sizes.icon_h = tile_sizes.height;
			tile_sizes.caption_x = tile_sizes.icon_x + tile_sizes.icon_w + tile_sizes.middle;
			tile_sizes.caption_y = tile_sizes.up;
			tile_sizes.caption_w = 0;
			tile_sizes.caption_h = cfg.getCaptionHeight();
			tile_sizes.rows_x = tile_sizes.caption_x;
			tile_sizes.rows_y = tile_sizes.caption_y + tile_sizes.caption_h + tile_sizes.between;
			tile_sizes.rows_w = 0;
			tile_sizes.rows_h = util.max(tile_sizes.height - tile_sizes.up - tile_sizes.caption_h - tile_sizes.between - tile_sizes.down, 1);
			tile_sizes.duration_x = 0;
			tile_sizes.duration_y = tile_sizes.rows_y;
			tile_sizes.duration_w = util.textWidth("000.00.00", FNT_DURATION);
			tile_sizes.duration_h = tile_sizes.rows_h;
			let tmp = cfg.getPlaystripeMargins();
			tile_sizes.playstripe_x = tile_sizes.icon_x + tile_sizes.icon_w + tmp.left;
			tile_sizes.playstripe_y = tile_sizes.caption_y + tile_sizes.caption_h + tmp.up;
			tile_sizes.playstripe_w = 0;
			tile_sizes.playstripe_h = util.max(tile_sizes.height - tile_sizes.playstripe_y - tmp.down, 1);
			tmp = cfg.getTileTimeMargins();
			tile_sizes.time_x = tile_sizes.icon_x + tile_sizes.icon_w + tmp.left;
			tile_sizes.time_y = tile_sizes.caption_y + tile_sizes.caption_h + tmp.up;
			tile_sizes.time_w = util.textWidth("000.00.00", FNT_DURATION);
			tile_sizes.time_h = util.max(tile_sizes.height - tile_sizes.time_y - tmp.down, 1);
			fsearch_sizes = {};
			fsearch_sizes.pos_text = this.x + cfg.getFastsearchTextMargin();
			fsearch_sizes.pos_y = 0;
			fsearch_sizes.height = FNT_FASTSEARCH.Height + cfg.getFastsearchTextPadding()*2;
			IMG_STATE.size = [ tile_sizes.height, tile_sizes.height ];
			bridge.registerActions((pos, max) => {
				stratum.pos_event = (pos / max) * (stratum.max - frm.h);
			}, (delta) => {
				stratum.relative_event = delta * tile_sizes.average;
			}, (char) => {
				this.onCharCode(char);
			}, (key) => {
				this.onKeyCode(key);
			}, () => {
				stratum.apply_pos();
			});
			animator_caret = new Walker((step) => {
				indix_color_selection = step;
			});
			mouse_keeper = new MouseKeeper();
		}

		set time(value) {
			playing_time = value;
			formated_playing_time = utils.FormatDuration(value);
		}

		onSize(w, h) {
			width = w, height = h;
			let height_tmp = height - FRAME_MARGIN*2;
			is_need_scrollbar = (stratum.max > height_tmp);
			this.size = [
				util.max(
					width - (is_need_scrollbar ? cfg.getScrollbarWidth() : 0) - FRAME_MARGIN*2 - cfg.getSidebarWidth(),
					1
				),
				height_tmp
			];
			tile_sizes.width = util.max(
				this.w - (margin_left + margin_right + (numerator.is_draw ? numerator.width + numerator.margin : 0)),
				tile_sizes.height*3
			);
			tile_sizes.caption_w = util.max(
				tile_sizes.width - tile_sizes.left - tile_sizes.icon_x - tile_sizes.icon_w - tile_sizes.middle - tile_sizes.right,
				tile_sizes.height
			);
			tile_sizes.rows_w = util.max(
				tile_sizes.caption_w - tile_sizes.duration_w - tile_sizes.duration,
				tile_sizes.height
			);
			tile_sizes.duration_x = tile_sizes.rows_x + tile_sizes.rows_w + tile_sizes.duration;
			let tmp = cfg.getPlaystripeMargins();
			tile_sizes.playstripe_w = util.max(
				tile_sizes.width - tile_sizes.playstripe_x - tmp.right,
				tile_sizes.height
			);
			fsearch_sizes.pos_y = this.b - fsearch_sizes.height;
			IMG_TILE.size = [ tile_sizes.width, tile_sizes.height ];
			IMG_PLAYSTRIPE.size = [ tile_sizes.playstripe_w, tile_sizes.playstripe_h ];
			IMG_PLAYSTRIPE.pos = [ tile_sizes.playstripe_x, tile_sizes.playstripe_y ];
			IMG_FASTSEARCH.size = [ this.w, fsearch_sizes.height ];
			calculateTilesAmount();
			stratum.normalizeStratum();
			stratum.normalizeTilesPosition();
			bridge.event_updateDimensionsAndPosition(stratum.pos, this.h, stratum.max);
		}

		onUpdate() {
			stratum.load();
			numerator.width = util.textWidth(pls.count + "", FNT_NUMERATOR);
			this.onMouseOut();
			this.onSize(width, height);
		}

		onFlush() {
			stratum.load();
			numerator.width = 0;
			this.onMouseOut();
			this.onSize(width, height);
		}

		onDraw(g) {
			function drawTile(g, tile, index) {
				let [ state, caption, row, duration, length, art ] = pls.getComposition(index);
				let base_x = frm.x + tile.x;
				let base_y = frm.y + tile.y;
				g.GdiAlphaBlend(
					IMG_TILE.img(state),
					base_x + IMG_TILE.x, base_y + IMG_TILE.y, IMG_TILE.w, IMG_TILE.h,
					0, 0, IMG_TILE.w, IMG_TILE.h
				);
				g.GdiAlphaBlend(
					art.img,
					base_x + art.x, base_y + art.y, art.w, art.h,
					0, 0, art.w, art.h
				);
				g.GdiAlphaBlend(
					IMG_STATE.img(tile.state),
					base_x + IMG_STATE.x, base_y + IMG_STATE.y, IMG_STATE.w, IMG_STATE.h,
					0, 0, IMG_STATE.w, IMG_STATE.h
				);
				g.GdiDrawText(
					caption,
					FNT_CAPTION, CLR_CAPTION[state],
					base_x + tile_sizes.caption_x, base_y + tile_sizes.caption_y,
					tile_sizes.caption_w, tile_sizes.caption_h,
					0x00000800
				);
				let tmp = state & 0b0011;
				if (tmp && tmp < 3) {
					let tmp1 = Math.round((length > 0) ? (playing_time / length * IMG_PLAYSTRIPE.w) : IMG_PLAYSTRIPE.w);
					g.GdiAlphaBlend(
						IMG_PLAYSTRIPE.img(((state & 0b100) ? tmp+1 : tmp-1) | ((state & 0b1000) >> 1)),
						base_x + IMG_PLAYSTRIPE.x, base_y + IMG_PLAYSTRIPE.y, tmp1, IMG_PLAYSTRIPE.h,
						0, 0, tmp1, IMG_PLAYSTRIPE.h
					);
					g.GdiDrawText(
						formated_playing_time,
						FNT_DURATION, CLR_DURATION[state],
						base_x + tile_sizes.time_x, base_y + tile_sizes.time_y,
						tile_sizes.time_w, tile_sizes.time_h,
						0x00000824
					);
				} else {
					g.GdiDrawText(
						row,
						FNT_ROWS, CLR_ROWS[state >> 1],
						base_x + tile_sizes.rows_x, base_y + tile_sizes.rows_y,
						tile_sizes.rows_w, tile_sizes.rows_h,
						0x00000800
					);
				}
				g.GdiDrawText(
					duration,
					FNT_DURATION, CLR_DURATION[state],
					base_x + tile_sizes.duration_x, base_y + tile_sizes.duration_y,
					tile_sizes.duration_w, tile_sizes.duration_h,
					0x00000826
				);
			}
			if (numerator.is_draw) {
				for (const wjt of wjts) {
					if (start_index+wjt.i !== moving_widget_index) {
						drawTile(g, wjt, start_index+wjt.i);
					}
					g.GdiDrawText(
						"" + (start_index+wjt.i + 1),
						FNT_NUMERATOR, CLR_NUMERATOR,
						frm.x + margin_left + FRAME_MARGIN, frm.y + wjt.y,
						numerator.width, tile_sizes.height,
						0x00000826
					);
				}
			} else {
				for (const wjt of wjts) {
					if (start_index+wjt.i !== moving_widget_index) {
						drawTile(g, wjt, start_index+wjt.i);
					}
				}
			}
			if (moving_widget_index > -1) {
				drawTile(g, active_widget, moving_widget_index);
			}
			if (selection) {
				g.DrawRect(
					frm.x + selection.drawable_x, frm.y + selection.drawable_y,
					selection.drawable_w, selection.drawable_h,
					1, CLR_SELECTION[indix_color_selection]
				);
			}
			if (fsearch.is_text_contain) {
				g.GdiAlphaBlend(
					IMG_FASTSEARCH.img(fsearch.succes_state),
					frm.x + IMG_FASTSEARCH.x, fsearch_sizes.pos_y + IMG_FASTSEARCH.y,
					IMG_FASTSEARCH.w, IMG_FASTSEARCH.h,
					0, 0, IMG_FASTSEARCH.w, IMG_FASTSEARCH.h
				);
				g.GdiDrawText(
					fsearch.txt,
					FNT_FASTSEARCH, CLR_FASTSEARCH[fsearch.succes_state],
					fsearch_sizes.pos_text, fsearch_sizes.pos_y,
					this.w, fsearch_sizes.height,
					0x00000824
				);
			}
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
			if (stratum_mover_controller) {
				stratum_mover_controller();
				stratum_mover_controller = null;
			}
			if (animator_caret.is_exec) {
				animator_caret.stop();
			}
		}

		onMouseMove(x, y) {
			mouse_keeper.x = x;
			mouse_keeper.y = y;
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
			mouse_keeper.x = x;
			mouse_keeper.y = y;
			if (active_widget) {
				active_widget.onMove(x, y);
			} else if (selection) {
				if (y < 0 && stratum.pos > 0) {
					if (!stratum_mover_controller) {
						stratum.relative = tile_sizes.average*usr.getSelectionMoveStep();
						stratum_mover_controller = util.repeater(
							() => {
								stratum.relative = tile_sizes.average*usr.getSelectionMoveStep();
							}, DELAY_SELECTION
						);
					}
				} else if (y > frm.h && (stratum.pos + frm.h) < stratum.max) {
					if (!stratum_mover_controller) {
						stratum.relative = -tile_sizes.average*usr.getSelectionMoveStep();
						stratum_mover_controller = util.repeater(
							() => {
								stratum.relative = -tile_sizes.average*usr.getSelectionMoveStep();
							}, DELAY_SELECTION
						);
					}
				} else {
					if (stratum_mover_controller) {
						stratum_mover_controller();
						stratum_mover_controller = null;
					}
				}
				checkSelection(x, y);
			}
		}

		onMouseLeftButtonDown(x, y) {
			mouse_keeper.x = x;
			mouse_keeper.y = y;
			if (hover_widget) {
				if (hover_widget.$XY(x, y)) {
					active_widget = hover_widget.onLeftButton(x, y);
					hover_widget = null;
				} else {
					hover_widget.onLoose();
					hover_widget = null;
					if (hover_widget = wjts.$XY(x, y)) {
						hover_widget.onEnter(x, y);
						active_widget = hover_widget.onLeftButton(x, y);
						hover_widget = null;
					} else if (!util.is_any_modifier_pressed) {
						pls.deselect = null;
					}
				}
			} else {
				if (!util.is_any_modifier_pressed) {
					pls.deselect = null;
				}
				y += stratum.pos;
				let select = [];
				animator_caret.start(CLR_SELECTION.length,DURATION_ANIMATION_SELECTION);
				selection = {
					setPos(new_x, new_y) {
						new_y += stratum.pos;
						this._x = util.max(util.min(x, new_x), -1);
						this._y = util.max(util.min(y, new_y), -1);
						this._a = util.min(util.max(x, new_x), frm.w);
						this._b = util.min(util.max(y, new_y), stratum.max);
						this._lower_index = Math.floor(this.y / tile_sizes.average);
						this._upper_index = Math.floor(
							this.b % tile_sizes.average > tile_sizes.margin ?
							this.b / tile_sizes.average + 1 :
							this.b / tile_sizes.average
						);
						let [ tmp1, tmp2] = [ Math.abs(new_y - this.y), Math.abs(new_y - this.b)];
						if (tmp1 > tmp2) {
							this._item = this._upper_index - 1;
						} else if (tmp1 < tmp2) {
							this._item = this._lower_index;
						} else if (new_y % tile_sizes.average > tile_sizes.margin) {
							this._item = new_y / tile_sizes.average;
						} else {
							this._item = -1;
						}
					},
					get drawable_x() { return util.max(this._x, -1); },
					get drawable_y() { return util.limit(-1, this._y - stratum.pos, frm.h-1) },
					get drawable_w() { return util.max(Math.abs(this._x - this._a), 1) },
					get drawable_h() { return util.max(util.min(this._b - stratum.pos, frm.h+1) - util.max(this._y - stratum.pos, 0), 1); },
					get x() { return util.max(this._x, 0); },
					get y() { return util.max(this._y, 0); },
					get a() { return util.min(this._a, frm.w); },
					get b() { return util.min(this._b, stratum.max); },
					get near_item() {
						if (!(
							this.a < margin_left + (numerator.is_draw ? numerator.width + numerator.margin : 0) ||
							this.x > frm.w - margin_right
						)) {
							if (this._upper_index - this._lower_index) {
								return this._item;
							} else {
								return -1;
							}
						} else {
							return -1;
						}
					},
					get items() {
						let deselect = null;
						if (!(
							this.a < margin_left + (numerator.is_draw ? numerator.width + numerator.margin : 0) ||
							this.x > frm.w - margin_right
						)) {
							let i1 = this._lower_index;
							let i2 = this._upper_index;
							deselect = new Set(select);
							select = [];
							while (i1 < i2) {
								select.push(i1++);
							}
							for (const i of select) {
								deselect.delete(i);
							}
							deselect = [...deselect];
						} else {
							deselect = select;
							select = [];
						}
						return [ select, deselect ];
					}
				}
				selection.setPos(x, y-stratum);
			}
		}

		onMouseLeftButtonDoubleClick(x, y) {
			mouse_keeper.x = x;
			mouse_keeper.y = y;
			if (hover_widget) {
				hover_widget.onDoubleClick(x, y);
			}
		}

		onMouseLeftButtonUp(x, y) {
			mouse_keeper.x = x;
			mouse_keeper.y = y;
			if (active_widget) {
				active_widget.onClick();
				active_widget = null;
			} else if (selection) {
				selection = null;
			}
			if (hover_widget = wjts.$XY(x, y)) {
				hover_widget.onHover(x, y);
			}
			if (stratum_mover_controller) {
				stratum_mover_controller();
				stratum_mover_controller = null;
			}
			if (animator_caret.is_exec) {
				animator_caret.stop();
			}
		}

		onMouseRightButtonDown(x, y) {
			if (hover_widget) {
				if (hover_widget.$XY(x, y)) {
					active_widget = hover_widget;
					active_widget.onRightButton(x, y);
					hover_widget = null;
				} else {
					hover_widget.onLoose();
					hover_widget = null;
					if (hover_widget = wjts.$XY(x, y)) {
						hover_widget.onEnter(x, y);
						active_widget = hover_widget.onRightButton(x, y);
						hover_widget = null;
					}
				}
			}
		}

		onMouseRightButtonUp(x, y) {
			let is_supress = false;
			if (active_widget) {
				if (active_widget.$XY(x, y)) {
					is_supress = active_widget.onMenu(x, y);
				} else {
					active_widget.onLoose();
				}
				active_widget = null;
			}
			if (hover_widget = wjts.$XY(x, y)) {
				hover_widget.onEnter(x, y);
			}
			return is_supress;
		}

		onMouseWheel(s) {
			stratum.relative = s * usr.getWheelMouseStep() * tile_sizes.average;
		}

		onCharCode(char) {
			fsearch.addChar(String.fromCharCode(char));
		}

		onKeyCode(key) {
			function moveTo(pos) {
				if (pos > start_index + max_visible_tiles - 1) {
					stratum.pos = tile_sizes.average*pos - frm.h + tile_sizes.average + tile_sizes.margin;
				} else if (pos < start_index + 1) {
					stratum.pos = tile_sizes.average*pos;
				}
			}
			switch (key) {
				case 8: { // backspace
					fsearch.deleteChar();
				} break;
				case 13: { // enter
					pls.play();
				} break;
				case 46: { // delete
					if (fsearch.is_text_contain) {
						fsearch.deleteChar();
					} else {
						pls.deleteSelections();
					}
				} break;
				case 37: { // left

				} break;
				case 38: { // up
					let pos = -1;
					if (util.is_cntrl_pressed) {
						pos = pls.selectPrev(false, util.is_shift_pressed);
					} else {
						if (util.is_shift_pressed) {
							pos = pls.shift(-1);
						} else {
							pos = pls.selectPrev(true);
						}
					}
					if (pos > -1) {
						moveTo(pos);
					}
				} break;
				case 39: { // right

				} break;
				case 40: { // down
					let pos = -1;
					if (util.is_cntrl_pressed) {
						pos = pls.selectNext(false, util.is_shift_pressed);
					} else {
						if (util.is_shift_pressed) {
							pos = pls.shift(1);
						} else {
							pos = pls.selectNext(true);
						}
					}
					if (pos > -1) {
						moveTo(pos);
					}
				} break;
				case 93: { // menu

				} break;
				default: {

				}
			}
		}
	}

	class Tile extends Widget {

		get i() { return this._index }

		get delta() { return this._delta }

		constructor(index) {
			super();
			this.pos = [
				margin_left + (numerator.is_draw ? numerator.width + numerator.margin : 0),
				tile_sizes.margin + (index*tile_sizes.average)
			];
			this.size = [ tile_sizes.width, tile_sizes.height ];
			this._index = index;
			this._delta = 0;
			this._draging = null;
		}

		set delta(value) { this._delta = value }

		onLoose() {
			if (!this.isNormal) {
				this.state = this.STATE_NORMAL;
			}
			if (moving_widget_index > -1) {
				moving_widget_index = -1;
			}
			if (stratum_mover_controller) {
				stratum_mover_controller();
				stratum_mover_controller = null;
			}
			this._stop_drag();
		}

		onEnter(x, y) {
			if (x < this.x + tile_sizes.icon_x + tile_sizes.icon_w) {
				this.state = this.STATE_HOVER;
			}
		}

		onHover(x, y) {
			if (x < this.x + tile_sizes.icon_x + tile_sizes.icon_w) {
				this.state = this.STATE_HOVER;
			} else if (!this.isNormal) {
				this.state = this.STATE_NORMAL;
			}
		}

		onMove(x, y) {
			if (this.isActive) {
				let limited_y = util.limit(0, y, frm.h);
				this.pos =  [ this.x, limited_y-this.delta ]
				if (y < 0 && stratum.pos > 0) {
					if (!stratum_mover_controller) {
						stratum.relative = tile_sizes.average*usr.getTileMoveStep();
						checkSwapping(this.x+1, limited_y);
						stratum_mover_controller = util.repeater(
							() => {
								stratum.relative = tile_sizes.average*usr.getTileMoveStep();
								checkSwapping(this.x+1, limited_y);
							}, DELAY_TILEMOVER
						);
					}
				} else if (y > frm.h && (stratum.pos + frm.h) < stratum.max) {
					if (!stratum_mover_controller) {
						stratum.relative = -tile_sizes.average*usr.getTileMoveStep();
						checkSwapping(this.x+1, limited_y);
						stratum_mover_controller = util.repeater(
							() => {
								stratum.relative = -tile_sizes.average*usr.getTileMoveStep();
								checkSwapping(this.x+1, limited_y);
							}, DELAY_TILEMOVER
						);
					}
				} else {
					if (stratum_mover_controller) {
						stratum_mover_controller();
						stratum_mover_controller = null;
					}
					checkSwapping(this.x+1, limited_y);
				}
			} else {
				if (!this._draging) {
					this._draging = util.timeout(()=>{
						bridge.event_invokeDragDrop();
						let effect = fb.DoDragDrop(
							window.ID,
							pls.getContextHandles(start_index + this.i),
							(util.is_cntrl_pressed || pls.is_block ? 5 : 2)
						);
						if (this._draging) {
							this._draging = this._draging();
						}
					}, usr.DRAGDROP_DELAY);
				}
			}
		}

		onLeftButton(x, y) {
			let tmp = start_index + this.i;
			if (x < this.x + tile_sizes.icon_x + tile_sizes.icon_w) {
				if (util.is_cntrl_pressed) {
					pls.select_switch = tmp;
				}
				moving_widget_index = tmp;
				let tmp_wjt = new Tile(this.i);
				tmp_wjt.pos = [ tmp_wjt.x, this.y ];
				tmp_wjt.delta = y - tmp_wjt.y;
				tmp_wjt.state = this.STATE_ACTIVE;
				this.state = this.STATE_NORMAL;
				return tmp_wjt;
			} else {
				if (util.is_cntrl_pressed) {
					pls.select_switch = tmp;
				} else if (util.is_shift_pressed) {
					pls.select_to = tmp;
				} else {
					pls.deselect = null;
					pls.select = tmp;
				}
				return this;
			}
		}

		onClick(x, y) {
			if (this.isActive) {
				this.state = this.STATE_NORMAL;
			}
			if (moving_widget_index > -1) {
				moving_widget_index = -1;
			}
			if (stratum_mover_controller) {
				stratum_mover_controller();
				stratum_mover_controller = null;
			}
			this._stop_drag();
		}

		onRightButton(x, y) {
			let tmp = start_index + this.i;
			if (!pls.isSelect(tmp)) {
				if (util.is_shift_pressed) {
					pls.select_to = tmp;
				} else {
					pls.select = tmp;
				}
			}
		}

		onMenu(x, y) {
			let context = fb.CreateContextMenuManager();
			let menu = window.CreatePopupMenu();
			let handles = pls.getContextHandles(start_index + this.i);
			let choice = 0;
			context.InitContext(handles);
			context.BuildMenu(menu, 1, 128);
			choice = menu.TrackPopupMenu(frm.x + x, frm.y + y);
			choice && context.ExecuteByID(choice-1);
			this._stop_drag();
			return !!choice;
		}

		onDoubleClick(x, y) {
			pls.play(start_index + this.i);
			this._stop_drag();
		}

		_stop_drag() {
			if (this._draging) {
				this._draging = this._draging();
				bridge.event_flushDragDrop();
			}
		}
	}

	class Stratum {
		get pos() {
			return this._value;
		}
		get max() {
			return this._max;
		}
		constructor() {
			this._value = 0;
			this._max = 0;
			this._end_pos = 0;
			const set_func = (function(value) {
				this._value = Math.round(value);
				const x = mouse_keeper.x;
				const y = mouse_keeper.y;
				if (selection) {
					selection.setPos(x, y);
					checkSelection(x, y);
				}
				if (active_widget) {
					checkSwapping(active_widget.x+1, util.limit(0, y, frm.h));
				}
				this.normalizeStratum();
				this.normalizeTilesPosition();
			}).bind(this);
			if (usr.isSmoothScroll()) {
				this._animator = new SmoothScroller(set_func, usr, cfg);
			} else {
				this._animator = {
					is_exec: false,
					restart() {},
					start(old_value, new_value) {
						set_func(new_value);
					},
					stop() {}
				}
			}
		}
		set pos(value) {
			value = util.limit(0, value, this._max-frm.h);
			if (this._animator.is_exec) {
				this._animator.restart(this._value, value);
			} else {
				this._animator.start(this._value, value, frm.h);
			}
			this.end_pos = value;
			bridge.event_setPosition(this._end_pos);
		}
		set pos_event(value) {
			value = util.limit(0, value, this._max-frm.h);
			if (this._animator.is_exec) {
				this._animator.restart(this._value, value);
			} else {
				this._animator.start(this._value, value, frm.h);
			}
			this.end_pos = value;
		}
		set relative(value) {
			value = util.limit(0, this._end_pos - value, this._max-frm.h);
			if (this._animator.is_exec) {
				this._animator.restart(this._value, value);
			} else {
				this._animator.start(this._value, value, frm.h);
			}
			this.end_pos = value;
			bridge.event_setPosition(this._end_pos);
		}
		set relative_event(value) {
			value = util.limit(0, this._end_pos - value, this._max-frm.h);
			if (this._animator.is_exec) {
				this._animator.restart(this._value, value);
			} else {
				this._animator.start(this._value, value, frm.h);
			}
			this.end_pos = value;
			bridge.event_setPosition(this._end_pos);
		}
		set end_pos(value) {
			value = Math.floor(value);
			this._end_pos = value;
			usr.setPlaylistPosition(pls.index, value);
		}
		load() {
			this._max = tile_sizes.margin + pls.count*tile_sizes.average;
			this._value = usr.getPlaylistPosition(pls.index);
			this.normalizeStratum();
			this.normalizeTilesPosition();
			this._end_pos = this._value;
			if (this._animator.is_exec) {
				this._animator.stop(false);
			}
		}
		apply_pos() {
			if (this._animator.is_exec) {
				this._animator.stop(true);
			}
		}
		normalizeStratum() {
			if (this._value < 0) {
				this._value = 0;
			} else if ((this._value + frm.h) > this._max) {
				this._value = util.max(this._max - frm.h, 0);
			}
			start_index = Math.floor(this._value / tile_sizes.average);
		}
		normalizeTilesPosition() {
			for (const wjt of wjts) {
				if (wjt !== active_widget) {
					wjt.pos = [
						wjt.x,
						(wjt.i * tile_sizes.average) - (this._value % tile_sizes.average) + tile_sizes.margin
					]
				} else {
					wjt.origPosY = (wjt.i * tile_sizes.average) - (this._value % tile_sizes.average) + tile_sizes.margin;
				}
			}
		}
	}

	class FastSearch {
		get SUCCESS_WAIT() { return 0 }
		get SUCCESS_WIN() { return 1 }
		get SUCCESS_FAIL() { return 2 }
		get is_text_contain() { return !!this._txt_cache.length }
		get txt() { return this._txt_cache }
		get succes_state() { return this._succes }
		constructor() {
			this._delay = usr.FASTSEARCH_MAXDELAY;
			this._txt = [];
			this._txt_cache = "";
			this._flusher = null;
			this._succes_state_flusher = null;
			this._start_time = Date.now();
			this._succes = this.SUCCESS_WAIT;
			this._ignore_indexes = new Set();
		}
		addChar(char) {
			if (this._succes_state_flusher) {
				this._succes = this.SUCCESS_WAIT;
				this._succes_state_flusher();
				this._succes_state_flusher = null;
			}
			if (this._flusher) {
				this._flusher();
				this._flusher = null;
			}
			if (this._succes !== this.SUCCESS_WAIT) {
				this._succes = this.SUCCESS_WAIT;
			}
			this._txt.push(char);
			this._txt_cache = this._txt.join("");
			let delta_time = Date.now() - this._start_time;
			this._delay = util.limit(0, this._delay, usr.FASTSEARCH_MAXDELAY);
			this._flusher = util.timeout(() => {
				this._activate();
			}, this._delay);
			this._start_time = Date.now();
		}
		deleteChar() {
			if (this._flusher) {
				this._flusher();
				this._flusher = null;
			}
			if (this._succes !== this.SUCCESS_WAIT) {
				this._succes = this.SUCCESS_WAIT;
			}
			if (this._txt.length > 0) {
				this._txt.pop();
				this._txt_cache = this._txt.join("");
			}
			let delta_time = Date.now() - this._start_time;
			this._delay = util.limit(0, this._delay, usr.FASTSEARCH_MAXDELAY);
			this._flusher = util.timeout(() => {
				this._activate();
			}, this._delay);
			this._start_time = Date.now();
		}
		_activate() {
			function moveTo(pos) {
				if (usr.isCenterResultFastSearch()) {
					stratum.pos = tile_sizes.average*pos - frm.h/2 + tile_sizes.height;
				} else if (pos > start_index + max_visible_tiles) {
					stratum.pos = tile_sizes.average*pos - frm.h + tile_sizes.average + tile_sizes.margin;
				} else {
					stratum.pos = tile_sizes.average*pos;
				}
			}
			let from_index = Math.floor((stratum.pos + frm.y + frm.h/2) / tile_sizes.average);
			if (!this.txt) return;
			let index = pls.find(
				this.txt, from_index,
				this._ignore_indexes, usr.isCenterResultFastSearch() ? 0 : max_visible_tiles/2
			);
			if (index > -1) {
				this._succes = this.SUCCESS_WIN;
				this._ignore_indexes.add(index);
				moveTo(index);
			} else {
				if (index < -1) {
					this._succes = this.SUCCESS_WAIT;
					this._ignore_indexes.clear();
					this._txt = [];
					this._txt_cache = "";
					util.repaint();
					return;
				} else {
					this._succes = this.SUCCESS_FAIL;
				}
			}
			this._succes_state_flusher = util.timeout(() => {
				this._succes = this.SUCCESS_WAIT;
				this._ignore_indexes.clear();
				this._txt = [];
				this._txt_cache = "";
				this._delay = usr.FASTSEARCH_MAXDELAY;
				util.repaint();
			}, usr.FASTSEARCH_FLUSHDELAY);
			util.repaint();
		}
	}

	class MouseKeeper {
		get x() { return this._x }
		get y() { return this._y }
		constructor() { this._x = 0; this._y = 0; }
		set x(value) { this._x = value }
		set y(value) { this._y = value }
	}

	function calculateTilesAmount() {
		max_visible_tiles = Math.floor(frm.h / tile_sizes.average)
		let goal_length = util.min(Math.ceil(frm.h / tile_sizes.average) + 2, pls.count);
		wjts.del_all();
		for (let i = 0; i < goal_length; ++i) {
			wjts.add(new Tile(i, tile_sizes.x, tile_sizes.y, tile_sizes.width, tile_sizes.height));
		}
	}

	function checkSelection(local_x, local_y) {
		selection.setPos(local_x, local_y);
		let [ select, deselect ] = selection.items;
		pls.deselect = deselect;
		pls.select = [ select, selection.near_item ];
	}

	function checkSwapping(local_x, local_y) {
		local_y = util.limit(0, local_y+stratum.pos, stratum.max);
		let result = 0;
		let tmp = (moving_widget_index+1)*tile_sizes.average;
		if (local_y > tmp) {
			result = Math.floor((local_y - (tmp - tile_sizes.height) - 1) / tile_sizes.average);
		} else if (local_y < tmp - tile_sizes.height) {
			result = Math.ceil((local_y - (tmp) + 1) / tile_sizes.average);
		}
		if (result) {
			pls.shift(result);
			moving_widget_index += result;
		}
	}

	frm = new Self();
	calculateTilesAmount = calculateTilesAmount.bind(frm);
	return frm;
};
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
class Sequencer {
	get is_exec() { return false }
	constructor() {}
	start() {}
	stop() {}
}

function Walker(action) {
	
	let step = 0;
	let stoper = 0;
	
	class Self extends Sequencer {
		get is_exec() { return !!stoper }
		constructor() {
			super();
		}
		start(steps, duration) {
			debug.ASSERT(!stoper, "Animation is already start");
			duration *= 1000;
			step = 0;
			stoper = setInterval(() => {
				action(step);
				step++;
				if (step >= steps) {
					step = 0;
				}
				util.repaint();
			}, Math.round(duration / steps));
		}
		stop() {
			debug.ASSERT(stoper, "No animation to stop");
			stoper = clearInterval(stoper);
			return step;
		}
	}
	return new Self();
}

class Animator extends Sequencer {
	get is_exec() { return !!this._stoper }
	constructor(fps) {
		super();
		this._stoper = null;
		this._init_time = 0;
		this._duration_time = 0;
		this._fps = fps;
		this._coefficient = 0;
	}
	start(action, new_duration) {
		debug.ASSERT(!this._stoper, "Animation is already start");
		this._duration_time = Math.round(new_duration*1000);
		this._init_time = Date.now();
		this._last_time = this._init_time;
		this._stoper = setInterval(() => {
			this._last_time = Date.now();
			let elapsed_time = this._last_time - this._init_time;
			this._coefficient = elapsed_time/this._duration_time;
			action(util.limit(0, this._coefficient, 1));
			util.repaint();
			if (elapsed_time >= this._duration_time) {
				this._stoper = clearInterval(this._stoper);
			}
		}, Math.round(1000/this._fps));
	}
	restart(reinit_time, new_duration) {
		debug.ASSERT(this._stoper, "No animation to restart");
		this._duration_time = new_duration*1000;
		if (reinit_time) {
			this._init_time = Date.now();
		} else {
			/*
			this._init_time = this._last_time - 
				this._coefficient*
				this._duration_time;
			*/
		}
	}
	stop() {
		debug.ASSERT(this._stoper, "No animation to stop");
		this._stoper = clearInterval(this._stoper);
	}
	static fabricateTimingFunction(type, ...args) {
		switch (type) {
			case Animator.TYPE_CUBIC:
				{
					const point1 = 0, point2 = 0, point3 = 1, point4 = 1;
					const ratio1 = 1, ratio4 = 1;
					const [ ratio2, ratio3 ] = [ ...args ];
					return (coef) => {
						const coef1 = ratio1 * Math.pow(1-coef,3);
						const coef2 = ratio2 * 3 * Math.pow(1-coef,2) * coef;
						const coef3 = ratio3 * 3 * (1-coef) * Math.pow(coef,2);
						const coef4 = ratio4 * Math.pow(coef,3);
						return (coef1*point1 + coef2*point2 + coef3*point3 + coef4*point4) / (coef1 + coef2 + coef3 + coef4);
					};
				}
			case Animator.TYPE_QUADRATIC:
				return (coef) => {
					let point0 = 0, point2 = 1;
					let [ point1 ] = [ ...args ];
					return Math.pow(1-coef,2)*point0 +
						2*(1-coef)*coef*point1 +
						Math.pow(coef,2)*point2;
				};
			case Animator.TYPE_LINEAR:
			case Animator.TYPE_DEFAULT:
			default:
				return (coef) => {
					return coef;
				};
		}
	}
}
Animator.TYPE_DEFAULT = 0;
Animator.TYPE_LINEAR = 0;
Animator.TYPE_QUADRATIC = 1;
Animator.TYPE_CUBIC = 2;

function SmoothScroller(action_function, usr, cfg) {
	
	const SCROLL_PARAMS = cfg.getSmoothScrollParams();
	const RADIX_MULT = 0.23;
	const RADIX_COEF = 0.9;
	const LINEAR_BASE = 0.2;
	const LINEAR_ADD = 0.2;
	
	let start_pos = 0;
	let original_pos = 0;
	let destination = 0;
	let distance = 0;
	let height = 0;
	let timing_function = null;
	
	class Self extends Animator {
		constructor() {
			super(usr.getFPS());
			timing_function = Animator.fabricateTimingFunction(Animator.TYPE_CUBIC, 0.1, 0.5);
		}
		start(old_pos, new_pos, frame_height) {
			height = frame_height;
			start_pos = new_pos;
			original_pos = old_pos;
			destination = new_pos-original_pos;
			distance = Math.abs(destination);
			if (distance < 1) return;
			let duration = calcDuration(distance, height);
			super.start((coefficient)=>{
				action_function(original_pos + timing_function(coefficient)*destination);
			}, duration);
		}
		restart(cur_pos, new_pos) {
			let is_reinit_time = false;
			if (Math.sign(start_pos-original_pos) !== Math.sign(new_pos-cur_pos)) {
				is_reinit_time = true;
				original_pos = cur_pos;
				start_pos = new_pos;
			}
			destination = new_pos-original_pos;
			distance = Math.abs(destination);
			if (distance < 1) return;
			let duration = calcDuration(distance, height);
			super.restart(is_reinit_time, duration);
		}
		stop(is_applied_pos) {
			super.stop();
			if (is_applied_pos) {
				action_function(original_pos + destination);
			}
		}
	}
	
	function calcDuration(d, h) {
		if (d > h) {
			return (Math.pow(d, RADIX_MULT) / Math.pow(h, RADIX_MULT)) * RADIX_COEF;
		} else {
			return LINEAR_BASE + d/h * LINEAR_ADD;
		}
	}
	
	return new Self();
}
function PrivateConfigurations() {

	let self = null;
	let root = null;
	let delimeter = null;
	let caches = null;

	class Self {

		get PLAYLIST_COUNT_FOR_BUILD_COMPOSITIONS() { return caches.get(PROPERTY_01).cache }
		get PLAYLIST_DELAY_FOR_BUILD_COMPOSITIONS() { return caches.get(PROPERTY_02).cache }
		get PLAYLIST_COUNT_FOR_BUILD_ABBREVIATIONS() { return caches.get(PROPERTY_03).cache }
		get PLAYLIST_DELAY_FOR_BUILD_ABBREVIATIONS() { return caches.get(PROPERTY_04).cache }
		get PLAYLIST_COUNT_FOR_CHECK_CONSONANCE() { return caches.get(PROPERTY_22).cache }
		get PLAYLIST_DELAY_FOR_CHECK_CONSONANCE() { return caches.get(PROPERTY_23).cache }
		get DRAGDROP_DELAY() { return caches.get(PROPERTY_05).cache }
		get FASTSEARCH_MAXDELAY() { return caches.get(PROPERTY_06).cache }
		get FASTSEARCH_FLUSHDELAY() { return caches.get(PROPERTY_07).cache }
		get SEARCH_COMPOSITION_DELAY() { return caches.get(PROPERTY_08).cache }
		get SEARCH_PROCESSING_MAX_COMPOSITION() { return caches.get(PROPERTY_09).cache }

		constructor() {
			root = "Consoplamanger2";
			delimeter = ".";
			caches = new Map();
			buildSettings(this);
		}

		getPlaylistPosition(pls_num) {
			let result = window.GetProperty(
				root + delimeter + "{plspos"+delimeter+pls_num+"}",
				0
			);
			result = Number.parseInt(result);
			return Number.isNaN(result) ? 0 : Math.abs(result);
		}

		getPathForImages() {
			return window.GetProperty(
				root + delimeter + "App" + delimeter + "PicturesPath",
				fb.ProfilePath + "images\\"
			);
			/*
			return window.GetProperty(
				root + delimeter + "App" + delimeter + "PicturesPath",
				fb.ProfilePath + "\\images\\"
			);
			*/
		}

		getPathForConfigurationFile() {
			return window.GetProperty(
				root + delimeter + "App" + delimeter + "ConfigFilePath",
				fb.ProfilePath + "configuration\\"
			);
			/*
			return window.GetProperty(
				root + delimeter + "App" + delimeter + "ConfigFilePath",
				fb.ProfilePath + "\\configuration\\"
			);
			*/
		}

		getWheelMouseStep() {
			return caches.get(PROPERTY_10).cache;
		}

		getSelectionMoveStep() {
			return caches.get(PROPERTY_11).cache;
		}

		getTileMoveStep() {
			return caches.get(PROPERTY_12).cache;
		}

		getScrollbarScrollCount() {
			return caches.get(PROPERTY_13).cache;
		}

		getFocusChangeMethod() {
			return caches.get(PROPERTY_14).cache;
		}

		isApplySortOnAdd() {
			return caches.get(PROPERTY_15).cache;
		}

		isMoveFocusToNextPlayingItem() {
			return caches.get(PROPERTY_16).cache;
		}

		isSwitchToChangedPlaylist() {
			return caches.get(PROPERTY_17).cache;
		}

		isTextboxEraseOnDeleteKeycode() {
			return caches.get(PROPERTY_18).cache;
		}

		isCenterResultFastSearch() {
			return caches.get(PROPERTY_19).cache;
		}

		isSmoothScroll() {
			return caches.get(PROPERTY_20).cache;
		}

		isDrawBackgroundImage() {
			return caches.get(PROPERTY_21).cache;
		}

		getFPS() {
			let result = window.GetProperty(
				root + delimeter + "App" + delimeter + "FPS",
				60
			);
			result = Number.parseInt(result);
			if (Number.isNaN(result)) {
				result = 60
			}
			return Math.max(Math.abs(result), 16);
		}

		getDPI() {
			let result = window.GetProperty(
				root + delimeter + "App" + delimeter + "DotsPerInch(DPI)"
			);
			result = Number.parseInt(result);
			return Number.isNaN(result) ? 120 : Math.max(Math.abs(result), 30);
		}

		getSortIndexesForPlaylist(pls_index) {
			let result = window.GetProperty(
				root + delimeter + "{plssort" + delimeter + pls_index + "}"
			);
			if (!result) {
				result = [];
			} else {
				let indexes = result.split(/,\s*/);
				result = [];
				for (let tmp of indexes) {
					tmp = Number.parseInt(tmp);
					if (!Number.isNaN(tmp) && tmp > -1) {
						result.push(tmp);
					}
				}
			}
			return result;
		}

		deleteSortIndexForPlaylist(index, pls_index) {
			let result = this.getSortIndexesForPlaylist(pls_index);
			result.splice(index, 1);
			window.SetProperty(
				root + delimeter + "{plssort" + delimeter + pls_index + "}",
				result.join(", ")
			);
		}

		setPlaylistPosition(pls_num, pos) {
			window.SetProperty(
				root + delimeter + "{plspos"+delimeter+pls_num+"}",
				pos
			);
		}

		addSortIndexForPlaylist(index, pls_index) {
			let result = this.getSortIndexesForPlaylist(pls_index);
			result.push(index);
			window.SetProperty(
				root + delimeter + "{plssort" + delimeter + pls_index + "}",
				result.join(", ")
			);
		}

		getConfiguratorObjectSetter() {
			function storeInt(value, section) {
				value = Number.parseInt(value);
				value = Number.isNaN(value) ? Number.parseInt(caches.get(section).default_value) : Math.abs(value);
				window.SetProperty(
					root + delimeter + "Config" + delimeter + section,
					value.toString()
				);
			}
			function storeFloat(value, section) {
				value = Number.parseFloat(value);
				value = Number.isNaN(value) ? Number.parseFloat(caches.get(section).default_value) : Math.abs(value)
				window.SetProperty(
					root + delimeter + "Config" + delimeter + section,
					value.toString()
				);
			}
			function toggleBool(section) {
				let value = window.GetProperty(
					root + delimeter + "Config" + delimeter + section
				);
				window.SetProperty(
					root + delimeter + "Config" + delimeter + section,
					!value
				);
			}
			return new (class {
				reloadConfig() {
					for (let [ key, obj ] of caches) {
						obj.process();
					}
				}
				set PLAYLIST_COUNT_FOR_BUILD_COMPOSITIONS(value) {
					storeInt(value, PROPERTY_01);
				}
				set PLAYLIST_DELAY_FOR_BUILD_COMPOSITIONS(value) {
					storeInt(value, PROPERTY_02);
				}
				set PLAYLIST_COUNT_FOR_BUILD_ABBREVIATIONS(value) {
					storeInt(value, PROPERTY_03);
				}
				set PLAYLIST_DELAY_FOR_BUILD_ABBREVIATIONS(value) {
					storeInt(value, PROPERTY_04);
				}
				set DRAGDROP_DELAY(value) {
					storeInt(value, PROPERTY_05);
				}
				set FASTSEARCH_MAXDELAY(value) {
					storeInt(value, PROPERTY_06);
				}
				set FASTSEARCH_FLUSHDELAY(value) {
					storeInt(value, PROPERTY_07);
				}
				set SEARCH_COMPOSITION_DELAY(value) {
					storeInt(value, PROPERTY_08);
				}
				set SEARCH_PROCESSING_MAX_COMPOSITION(value) {
					storeInt(value, PROPERTY_09);
				}
				set PLAYLIST_COUNT_FOR_CHECK_CONSONANCE(value) {
					storeInt(value, PROPERTY_22);
				}
				set PLAYLIST_DELAY_FOR_CHECK_CONSONANCE(value) {
					storeInt(value, PROPERTY_23);
				}
				setWheelMouseStep(value) {
					storeFloat(value, PROPERTY_10);
				}
				setSelectionMoveStep(value) {
					storeFloat(value, PROPERTY_11);
				}
				setTileMoveStep(value) {
					storeFloat(value, PROPERTY_12);
				}
				setScrollbarScrollCount(value) {
					storeFloat(value, PROPERTY_13);
				}
				toggleIsApplySortOnAdd() {
					toggleBool(PROPERTY_15);
				}
				toggleIsMoveFocusToNextPlayingItem() {
					toggleBool(PROPERTY_16);
				}
				toggleIsSwitchToChangedPlaylist() {
					toggleBool(PROPERTY_17);
				}
				toggleIsTextboxEraseOnDeleteKeycode() {
					toggleBool(PROPERTY_18);
				}
				toggleIsCenterResultFastSearch() {
					toggleBool(PROPERTY_19);
				}
				toggleIsSmoothScroll() {
					toggleBool(PROPERTY_20);
				}
				toggleIsDrawBackgroundImage() {
					toggleBool(PROPERTY_21);
				}
			})();
		}
	}

	const PROPERTY_01 = "CompositionsCountForBuild";
	const PROPERTY_02 = "DelayForBuild";
	const PROPERTY_03 = "AbbreviationsCountForBuild";
	const PROPERTY_04 = "DelayForAbbreviationBuild";
	const PROPERTY_05 = "DragDropDelay";
	const PROPERTY_06 = "FastSearchDelay";
	const PROPERTY_07 = "FastSearchFlushDelay";
	const PROPERTY_08 = "SearchDelay";
	const PROPERTY_09 = "CompositionsCountForSearch";
	const PROPERTY_10 = "WheelMouseStep";
	const PROPERTY_11 = "SelectionMoveStep";
	const PROPERTY_12 = "TileMoveStep";
	const PROPERTY_13 = "ScrollbarScrollStep";
	const PROPERTY_14 = "FocusMethod";
	const PROPERTY_15 = "ApplySortOnAdd";
	const PROPERTY_16 = "MoveFocusToPlayingItem";
	const PROPERTY_17 = "SwitchToChangedPlaylist";
	const PROPERTY_18 = "EraseTextOnDeleteButtonPressed";
	const PROPERTY_19 = "CenterResultOnFastSearch";
	const PROPERTY_20 = "EnableSmoothScroll";
	const PROPERTY_21 = "DrawBackgroundImage";
	const PROPERTY_22 = "CompositionsCountForCheckConsonance";
	const PROPERTY_23 = "DelayForCheckConsonance";

	function buildSettings(self) {
		function getIntegerProperty(section_name, default_value) {
			let result = window.GetProperty(
				root + delimeter + "Config" + delimeter + section_name,
				default_value
			);
			result = Number.parseInt(result);
			return Number.isNaN(result) ? Number.parseInt(default_value) : Math.abs(result);
		}
		function getFloatProperty(section_name, default_value) {
			let result = window.GetProperty(
				root + delimeter + "Config" + delimeter + section_name,
				default_value
			);
			result = Number.parseFloat(result);
			return Number.isNaN(result) ? Number.parseFloat(default_value) : Math.abs(result);
		}
		function getBooleanProperty(section_name, default_value) {
			let result = window.GetProperty(
				root + delimeter + "Config" + delimeter + section_name,
				default_value
			);
			return result;
		}
		caches.set(PROPERTY_01, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_01, this.default_value), 1);
			},
			default_value: "50",
			cache: null
		});
		caches.set(PROPERTY_02, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_02, this.default_value), 1);
			},
			default_value: "100",
			cache: null
		});
		caches.set(PROPERTY_03, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_03, this.default_value), 1);
			},
			default_value: "100",
			cache: null
		});
		caches.set(PROPERTY_04, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_04, this.default_value), 1);
			},
			default_value: "100",
			cache: null
		});
		caches.set(PROPERTY_05, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_05, this.default_value), 1);
			},
			default_value: "400",
			cache: null
		});
		caches.set(PROPERTY_06, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_06, this.default_value), 1);
			},
			default_value: "2700",
			cache: null
		});
		caches.set(PROPERTY_07, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_07, this.default_value), 1);
			},
			default_value: "3000",
			cache: null
		});
		caches.set(PROPERTY_08, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_08, this.default_value), 1);
			},
			default_value: "50",
			cache: null
		});
		caches.set(PROPERTY_09, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_09, this.default_value), 1);
			},
			default_value: "12",
			cache: null
		});
		caches.set(PROPERTY_10, {
			process() {
				this.cache = getFloatProperty(PROPERTY_10, this.default_value);
			},
			default_value: "1.8",
			cache: null
		});
		caches.set(PROPERTY_11, {
			process() {
				this.cache = getFloatProperty(PROPERTY_11, this.default_value);
			},
			default_value: "1.5",
			cache: null
		});
		caches.set(PROPERTY_12, {
			process() {
				this.cache = getFloatProperty(PROPERTY_12, this.default_value);
			},
			default_value: "1",
			cache: null
		});
		caches.set(PROPERTY_13, {
			process() {
				this.cache = getFloatProperty(PROPERTY_13, this.default_value);
			},
			default_value: "1",
			cache: null
		});
		caches.set(PROPERTY_14, {
			process() {
				this.cache = getBooleanProperty(PROPERTY_15, "false");
			},
			cache: null
		});
		caches.set(PROPERTY_15, {
			process() {
				this.cache = getBooleanProperty(PROPERTY_15, "true");
			},
			cache: null
		});
		caches.set(PROPERTY_16, {
			process() {
				this.cache = getBooleanProperty(PROPERTY_16, "true");
			},
			cache: null
		});
		caches.set(PROPERTY_17, {
			process() {
				this.cache = getBooleanProperty(PROPERTY_17, "false");
			},
			cache: null
		});
		caches.set(PROPERTY_18, {
			process() {
				this.cache = getBooleanProperty(PROPERTY_18, "true");
			},
			cache: null
		});
		caches.set(PROPERTY_19, {
			process() {
				this.cache = getBooleanProperty(PROPERTY_19, "true");
			},
			cache: null
		});
		caches.set(PROPERTY_20, {
			process() {
				this.cache = getBooleanProperty(PROPERTY_20, "true");
			},
			cache: null
		});
		caches.set(PROPERTY_21, {
			process() {
				this.cache = getBooleanProperty(PROPERTY_21, "true");
			},
			cache: null
		});
		caches.set(PROPERTY_22, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_22, this.default_value), 1);
			},
			default_value: "70",
			cache: null
		});
		caches.set(PROPERTY_23, {
			process() {
				this.cache = Math.max(getIntegerProperty(PROPERTY_23, this.default_value), 1);
			},
			default_value: "100",
			cache: null
		});
		for (let [ key, obj ] of caches) {
			obj.process();
		}
	}

	function getBooleanProperty(prop_name, default_value) {
		return window.GetProperty(
			root + delimeter + "Config" + delimeter + prop_name, default_value
		);
	}

	self = new Self();
	return self;
}
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
function Playlist(cfg, usr, imgs, Job) {

	const DEFAULT_ART = imgs.IMAGE_DEFAULT_ART;

	let self = null;
	let db = null;
	let db_num = -1;
	let compositions = null;
	let abbreviations = null;
	let arts = null;
	let evalutor_caption = null;
	let evalutor_rows = null;
	let evalutor_unique_id = null;
	let evalutor_art_text_abreviation = null;
	let evalutor_abbr = null;
	let playing_position = null;
	let is_default_focus_to_playing_item = false;
	let composition_builder_controller = null;
	let arts_cache = null;
	let arts_cache_music_items = null;
	let compositions_found = null;
	let job = null;
	let job_abbr = null;
	let job_search = null;
	let key_items_visualiser = null;
	let is_self_altering = false;

	class Self {

		get count() {
			return db ? db.Count : 0;
		}

		get name() {
			return db ? plman.GetPlaylistName(db_num) : "";
		}

		get duration() {
			return db ? db.CalcTotalDuration() : 0;
		}

		get weight() {
			return db ? db.CalcTotalSize() : 0;
		}

		get playing_composition() {
			return (
				playing_position &&
				playing_position.IsValid &&
				playing_position.PlaylistIndex === db_num
			) ? playing_position.PlaylistItemIndex : -1;
		}

		get focus_composition() {
			return (
				fb.PlaybackFollowCursor
			) ? plman.GetPlaylistFocusItemIndex(db_num) : -1;
		}

		get index() {
			return db_num;
		}

		get is_self_altering() {
			if (is_self_altering) {
				is_self_altering = false
				return true;
			} else {
				return false;
			}
		}

		get is_block() {
			if (db) {
				return plman.IsPlaylistLocked(db_num);
			}
			return true;
		}

		constructor() {
			evalutor_caption = fb.TitleFormat(
				cfg.getExpressionForCaptionEvalutor().join("$char(10)")
			);
			evalutor_rows = fb.TitleFormat(
				cfg.getExpressionForRowsEvalutor().join("$char(10)")
			);
			evalutor_unique_id = fb.TitleFormat(
				"$trim($if(%album%,[%album artist% - ]%album%$if(%discnumber%, '('%discnumber%')',),$if($meta(title),[%artist% - ]$meta(title),)))"
			);
			evalutor_art_text_abreviation = fb.TitleFormat(
				"$if(%album%,$cut($trim(%album%),1),$cut(%title%,1))"
			);
			evalutor_abbr = fb.TitleFormat(
				"$if($trim(%artist%), $cut($trim(%artist%),1),)$cut(%title%,1))"
			);
			compositions_found = [];
			arts_cache = new Map();
			arts_cache.set(null, [ DEFAULT_ART, true ]);
			arts_cache_music_items = new Map();
			is_default_focus_to_playing_item = usr.getFocusChangeMethod();
		}

		set select(value) {
			if (!db) return;
			if (Array.isArray(value)) {
				let [ affected_items, focus_item ] = [ ...value ];
				if (affected_items.length) {
					plman.SetPlaylistSelection(db_num, affected_items, true);
				}
				if (focus_item > -1 && focus_item < db.Count) {
					plman.SetPlaylistFocusItem(db_num, focus_item);
				}
			} else if (typeof value === "number") {
				if (value < 0 || value >= db.Count) return;
				plman.SetPlaylistSelectionSingle(db_num, value, true);
				plman.SetPlaylistFocusItem(db_num, value);
			} else {
				throw new Error("Select error");
			}
		}

		set select_to(value) {
			if (!(typeof value === "number")) throw new Error("Select to error");
			if (!db || value < 0 || value >= db.Count) return;
			let affected_items = [];
			let last_selected = plman.GetPlaylistFocusItemIndex(db_num);
			plman.SetPlaylistFocusItem(db_num, value);
			if (last_selected < 0) {
				last_selected = 0;
			} else if (last_selected >= db.Count) {
				last_selected = db.Count - 1;
			}
			if (last_selected > value) {
				( [ last_selected, value ] = [ value, last_selected ] );
			}
			do {
				affected_items.push(last_selected)
			} while (last_selected++ < value);
			if (affected_items.length) {
				plman.SetPlaylistSelection(db_num, affected_items, true);
			}
		}

		set select_switch(value) {
			if (!(typeof value === "number")) throw new Error("Select switch error");
			if (!db || value < 0 || value >= db.Count) return;
			plman.SetPlaylistSelectionSingle(
				db_num,
				value,
				!plman.IsPlaylistItemSelected(db_num, value)
			);
			plman.SetPlaylistFocusItem(db_num, value);
		}

		set deselect(value) {
			if (!db) return;
			if (Array.isArray(value)) {
				if (value.length) {
					plman.SetPlaylistSelection(db_num, value, false);
				}
			} else if (typeof value === "number") {
				if (value < 0 || value >= db.Count) return;
				plman.SetPlaylistSelectionSingle(db_num, value, false);
			} else {
				plman.ClearPlaylistSelection(db_num);
			}
		}

		selectNext(erase_selection, inverse_selection) {
			if (!(db && db.Count)) return;
			let last_selected = plman.GetPlaylistFocusItemIndex(db_num);
			last_selected++;
			if (last_selected < db.Count) {
				if (erase_selection) {
					plman.ClearPlaylistSelection(db_num);
				}
				let select_item = true;
				if (erase_selection) {
					select_item = true;
				} else {
					select_item = inverse_selection ? !plman.IsPlaylistItemSelected(db_num, last_selected) : true;
				}
				plman.SetPlaylistFocusItem(db_num, last_selected);
				plman.SetPlaylistSelectionSingle(
					db_num, last_selected, select_item
				);
				return last_selected;
			} else {
				return -1;
			}
		}

		selectPrev(erase_selection, inverse_selection) {
			if (!(db && db.Count)) return;
			let last_selected = plman.GetPlaylistFocusItemIndex(db_num);
			last_selected--;
			if (last_selected > -1) {
				if (erase_selection) {
					plman.ClearPlaylistSelection(db_num);
				}
				let select_item = true;
				if (erase_selection) {
					select_item = true;
				} else {
					select_item = inverse_selection ? !plman.IsPlaylistItemSelected(db_num, last_selected) : true;
				}
				plman.SetPlaylistFocusItem(db_num, last_selected);
				plman.SetPlaylistSelectionSingle(
					db_num, last_selected, select_item
				);
				return last_selected;
			} else {
				return -1;
			}
		}

		registerKeyItemsVisualiser(func1, func2) {
			key_items_visualiser = [ func1, func2 ];
		}

		load(playlist_index) {
			let focus_item = -1;
			if (db_num == playlist_index) {
				focus_item = plman.GetPlaylistFocusItemIndex(db_num);
			}
			db_num = playlist_index;
			db = plman.GetPlaylistItems(db_num);
			compositions = [];
			abbreviations = [];
			arts = [];
			this.playingChange();
			startCompositionsBuilder();
			startAbbreviationBuilder();
			if (job_search) {
				job_search = job_search.stop();
				compositions_found = [];
			}
			key_items_visualiser[1]();
			arts_cache_music_items.clear();
			if (focus_item > -1) {
				plman.SetPlaylistFocusItem(db_num, focus_item);
			}
		}

		flush() {
			db_num = -1;
			db = null;
			compositions = [];
			abbreviations = [];
			arts = [];
			if (job) {
				job = job.stop();
			}
			if (job_abbr) {
				job_abbr = job_abbr.stop();
			}
			if (job_search) {
				job_search = job_search.stop();
				compositions_found = [];
			}
			key_items_visualiser[1]();
		}

		getComposition(i) {
			function bitmaskState() {
				return (
					(
						playing_position.IsValid &&
						playing_position.PlaylistIndex === db_num &&
						playing_position.PlaylistItemIndex === i
					) ? (fb.IsPaused ? 2 : 1) : (
						fb.PlaybackFollowCursor && plman.GetPlaylistFocusItemIndex(db_num) === i ? 3 : 0
					)
				) | (
					plman.IsPlaylistItemSelected(db_num, i) ? 4 : 0
				) | (
					compositions_found[i] ? 8 : 0
				);
			}
			if (!db || i < 0 || i >= db.Count) {
				return [ 0, "", "", "", "", DEFAULT_ART, false, "" ];
			}
			if (!compositions[i]) {
				compositions[i] = buildComposition(i);
			}
			return [ bitmaskState(), ...compositions[i], arts[i] ];
		}

		getAbbreviation(i) {
			if (abbreviations[i]) {
				return abbreviations[i];
			}
			return "";
		}

		getContextHandles(default_value) {
			let result = plman.GetPlaylistSelectedItems(db_num);
			if (!result.Count) {
				result = new FbMetadbHandleList(db[default_value]);
			}
			return result;
		}

		getHandle(i) {
			if (db && i > -1 && i < db.Count) {
				return db[i];
			} else {
				throw new Error("Incorrect index for retrieving handle");
			}
		}

		isSelect(i) {
			if (db && i > -1 && i < db.Count) {
				return plman.IsPlaylistItemSelected(db_num, i)
			}
			return false;
		}

		isFound(i) {
			return compositions_found[i];
		}

		shift(delta) {
			if (!db || !delta) return;
			is_self_altering = true;
			plman.UndoBackup(db_num);
			let last_selected = plman.GetPlaylistFocusItemIndex(db_num);
			compositions = [];
			abbreviations = [];
			arts = [];
			plman.MovePlaylistSelection(db_num, delta);
			db = plman.GetPlaylistItems(db_num);
			if (job_search) {
				job_search = job_search.stop();
				compositions_found = [];
			}
			this.playingChange();
			startCompositionsBuilder();
			startAbbreviationBuilder();
			key_items_visualiser[1]();
			last_selected = util.limit(0, last_selected + delta, db.Count-1);
			plman.SetPlaylistFocusItem(db_num, last_selected);
			return last_selected;
		}

		deleteSelections() {
			if (!db || db_num < 0) return;
			plman.UndoBackup(db_num);
			plman.RemovePlaylistSelection(db_num);
		}

		playingChange() {
			playing_position = plman.GetPlayingItemLocation();
			if (
				usr.isMoveFocusToNextPlayingItem() &&
				playing_position.IsValid &&
				playing_position.PlaylistIndex === db_num
			) {
				plman.SetPlaylistFocusItem(db_num, playing_position.PlaylistItemIndex);
			}
		}

		play(i) {
			if (!(db && db.Count)) return;
			if (i === undefined) {
				i = plman.GetPlaylistFocusItemIndex(db_num);
			}
			if (i > -1 && i < db.Count) {
				plman.ExecutePlaylistDefaultAction(db_num, i);
			}
		}

		find(str, start, ignore, ignore_vicinity) {
			if (!str || !str.trim()) return -2;
			ignore_vicinity = Math.floor(ignore_vicinity);
			const case_unsense = true;
			str = case_unsense ? str.toLocaleLowerCase() : str;
			const self = this;
			start = util.limit(0, start, this.count-1);
			function* compositionsCaptions(start_index) {
				const IGNORE_VICINITY = ignore_vicinity > 0 ? ignore_vicinity : 1;
				let cur_index = start_index;
				let backward_index = start_index - IGNORE_VICINITY;
				let forward_index = start_index + IGNORE_VICINITY;
				function backward_step() {
					if (backward_index >= 0 && compositions[backward_index]) {
						let result = compositions[backward_index][0];
						cur_index = backward_index;
						backward_index--;
						return result;
					}
				}
				function forward_step() {
					if (forward_index < self.count && compositions[forward_index]) {
						let result = compositions[forward_index][0];
						cur_index = forward_index;
						forward_index++;
						return result;
					}
				}
				let [ cur_func, direction ] = [ forward_step, 1 ];
				let result;
				do {
					result = cur_func();
					( [ cur_func, direction ] = (direction > 0) ? [ backward_step, -1 ] : [ forward_step, 1 ]);
					if (result === undefined) {
						result = cur_func();
						( [ cur_func, direction ] = (direction > 0) ? [ backward_step, -1 ] : [ forward_step, 1 ]);
					}
					if (case_unsense && result) {
						result = result.toLocaleLowerCase();
					}
					yield [ cur_index, result ];
				} while (result);
			}
			for (const [ index, caption ] of compositionsCaptions(start)) {
				if (caption === undefined) {
					return -1;
				} else if (caption.includes(str)) {
					if (ignore && ignore.has(index)) continue;
					return index;
				}
			}
		}

		startSearch(str, places) {
			let [ key_items_add, key_items_flush ] = [ ...key_items_visualiser ];
			key_items_flush();
			if (job_search) {
				job_search = job_search.stop();
				compositions_found = [];
			}
			if (!str) return;
			str = str.toLocaleLowerCase();
			job_search = new Job((i, max) => {
				do {
					if (i >= max) return max;
					compositions_found[i] = isCompositionMatch(str, i, places);
					if (compositions_found[i]) {
						key_items_add(i);
					}
				} while (++i % usr.SEARCH_PROCESSING_MAX_COMPOSITION);
				return i;
			}, usr.SEARCH_COMPOSITION_DELAY, db.Count);
		}

		sort(expression, direction) {
			if (!db) return;
			if (!expression) return;
			plman.UndoBackup(db_num);
			plman.SortByFormatV2(db_num, expression, direction);
		}

		checkChangePlaylist(pls_index) {
			if (db_num < 0 || pls_index === db_num || usr.isSwitchToChangedPlaylist()) {
				this.load(pls_index);
				return true;
			} else {
				return false;
			}
		}
	}

	function startAbbreviationBuilder() {
		if (job_abbr) {
			job_abbr = job_abbr.stop();
		}
		job_abbr = new Job((i, max) => {
			do {
				if (i >= max) return max;
				if (!abbreviations[i]) {
					abbreviations[i] = buildAbbreviation(i);
				}
			} while (++i % usr.PLAYLIST_COUNT_FOR_BUILD_ABBREVIATIONS);
			return i;
		}, usr.PLAYLIST_DELAY_FOR_BUILD_ABBREVIATIONS, db.Count);
	}

	function startCompositionsBuilder() {
		if (job) {
			job = job.stop();
		}
		job = new Job((i, max) => {
			do {
				if (i >= max) return max;
				if (!compositions[i]) {
					compositions[i] = buildComposition(i);
				}
			} while (++i % usr.PLAYLIST_COUNT_FOR_BUILD_COMPOSITIONS);
			return i;
		}, usr.PLAYLIST_DELAY_FOR_BUILD_COMPOSITIONS, db.Count);
	}


	function buildAbbreviation(i) {
		if (i < 0 || i >= db.Count) return "";
		let handle = db[i];
		return evalutor_abbr.EvalWithMetadb(handle);
	}

	function isCompositionMatch(str, index, places) {
		if (index < 0 || index >= db.Count) return false;
		let handle = db[index];
		if (places && places.length) {
			for (const place of places) {
				let expression = fb.TitleFormat(place).EvalWithMetadb(handle).toLocaleLowerCase();
				if (expression && expression.includes(str)) {
					return true;
				}
			}
		} else {
			let file = handle.GetFileInfo();
			if (!file) return;
			for (let i = 0; i < file.InfoCount; i++) {
				let value = file.InfoValue(i).toLocaleLowerCase();
				if (value && value.includes(str)) {
					return true;
				}
			}
			for (let i = 0; i < file.MetaCount; i++) {
				for (let j = 0; j < file.MetaValueCount(i); j++) {
					let value = file.MetaValue(i, j).toLocaleLowerCase();
					if (value && value.includes(str)) {
						return true;
					}
				}
			}
		}
	}

	function buildComposition(i) {
		if (i < 0 || i >= db.Count) return;
		let handle = db[i];
		let id = evalutor_unique_id.EvalWithMetadb(handle);
		let img = DEFAULT_ART;
		let img_process = arts_cache.get(id.length ? id : null);
		if (img_process) {
			let [ img_result, is_finished ] = img_process;
			if (is_finished) {
				img = img_result;
			} else if (arts_cache_music_items.has(id)) {
				arts_cache_music_items.get(id).push(i);
			} else {
				let affected_items = [];
				affected_items.push(i);
				arts_cache_music_items.set(id, affected_items);
			}
		} else {
			if (arts_cache_music_items.has(id)) {
				arts_cache_music_items.get(id).push(i);
			} else {
				if (imgs.isCanCreateArt()) {
					img = imgs.createArt(evalutor_art_text_abreviation.EvalWithMetadb(handle));
					if (!img) img = DEFAULT_ART;
					arts_cache.set(id, [ img, true ]);
				} else {
					let affected_items = [];
					affected_items.push(i);
					arts_cache_music_items.set(id, affected_items);
					arts_cache.set(id, [ DEFAULT_ART, false]);
					utils.GetAlbumArtAsyncV2(
						window.ID,
						handle, 0,
						true, true, false
					).then((result) => {
						let image = null;
						if (result && result.image) {
							image = imgs.assignArt(result.image);
						} else {
							image = DEFAULT_ART;
						}
						arts_cache.set(id, [ image, true ]);
						let indexes = arts_cache_music_items.get(id);
						if (indexes) {
							for (let index of indexes) {
								arts[index] = image;
							}
							arts_cache_music_items.delete(id);
						}
					}).catch((error) => {
						throw new Error(error.message, error.stack);
					});
				}
			}
		}
		arts[i] = img;
		return [
			evalutor_caption.EvalWithMetadb(handle),
			evalutor_rows.EvalWithMetadb(handle),
			utils.FormatDuration(handle.Length),
			handle.Length
		];
	}

	self = new Self();
	return self;
};
class Searchmenu {

	constructor(usr) {
		this.CONFIG_FILE = usr.getPathForConfigurationFile() + "consoplamanger_searchmenu.ini";
		let menu = window.CreatePopupMenu();
		let default_items = this._buildDefaultItems();
		let items = this._loadItems(default_items, utils.FileTest(this.CONFIG_FILE, "e"));
		let index = 1;
		for (let j = 0; j < items[0].length; j++) {
			menu.AppendMenuItem(0, index++, items[0][j][0]);
		}
		for (let i = 1; i < items.length; i++) {
			menu.AppendMenuItem(0x0020, index++, items[i][0][0]);
			for (let j = 1; j < items[i].length; j++) {
				menu.AppendMenuItem(0, index++, items[i][j][0]);
			}
		}
		this._items = items;
		this._menu = menu;
	}

	activate(x, y) {
		let tmp = this._menu.TrackPopupMenu(x, y);
		if (tmp < 1) {
			return null;
		} else {
			tmp -= 1;
			for(var i = 0; i < this._items.length; i++) {
				if(tmp < this._items[i].length) {
					return [ ...this._items[i][tmp] ];
				} else {
					tmp -= this._items[i].length;
				}
			}
		}
	}

	_buildDefaultItems() {
		let result = [ [], [] ];
		result[0].push(
			[ "Artist", "$if2(%artist%,)" ]
		);
		result[0].push(
			[ "Title", "%title%" ]
		);
		result[0].push(
			[ "Album", "$if2(%album%,)" ]
		);
		result[0].push(
			[ "Album Artist", "$if2(%album artist%,)" ]
		);
		result[0].push(
			[ "Genre", "$if2(%genre%,)" ]
		);
		result[0].push(
			[ "Codec", "$if2(%codec%,)" ]
		);
		result[0].push(
			[ "Full Path", "$if2(%path%,)" ]
		);
		result[0].push(
			[ "Filename", "%filename_ext%" ]
		);
		result[1].push(
			[ "By Artist and Title", "$if2(%artist% ,)%title%" ]
		);
		result[1].push(
			[ "By Artist and Album", "$if2(%artist% ,$if2(%album artist% ,))$if2(%album%,)" ]
		);
		return result;
	}

	_loadItems(default_items, load_data) {
		if (load_data) {
			for (let i = 0; i < default_items.length; i++) {
				let name = null;
				let index = 0;
				do {
					name = utils.ReadINI(this.CONFIG_FILE, "group_" + i, "item_name_" + index);
					if (name) {
						let value = utils.ReadINI(this.CONFIG_FILE, "group_" + i, "item_value_" + index);
						if (value) {
							default_items[i][index] = [ name, value ]
						}
					}
					index++;
				} while (name);
			}
		}  else {
			for (let i = 0; i < default_items.length; i++) {
				for (let j = 0; j < default_items[i].length; j++) {
					utils.WriteINI(this.CONFIG_FILE, "group_" + i, "item_name_" + j, default_items[i][j][0]);
					utils.WriteINI(this.CONFIG_FILE, "group_" + i, "item_value_" + j, default_items[i][j][1]);
				}
			}
		}
		return default_items;
	}
}
/*

*/
function Settings(util, usr) {

	class Self {
		get COLOR_BACKGROUND() { return colors[0] }
		get COLOR_BLENDING() { return colors[1] }
		get COLOR_TILE_CAPTION() { return colors[2] }
		get COLOR_TILE_ROWS() { return colors[3] }
		get COLOR_TILE_DURATION() { return colors[4] }
		get COLOR_NUMERATOR() { return colors[5] }
		get COLOR_ICON_TEXT() { return colors[6] }
		get COLOR_SCROLLBAR_TIP() { return colors[7] }
		get COLOR_PLAYING_INDEX_ITEM() { return colors[8] }
		get COLOR_FOCUS_INDEX_ITEM() { return colors[9] }
		get COLOR_FOUND_INDEX_ITEM() { return colors[10] }
		get COLOR_SCROLLBAR_JOB_INDICATOR() { return colors[11] }
		get COLOR_SELECTION_RECTANGLE() { return util.createGradient(colors[12][0], colors[12][1], 10, true) }
		get COLOR_PANELFRAME_FADE() { return colors[13] }
		get COLOR_PANELBAR_NAME() { return colors[14] }
		get COLOR_PANELBAR_INFO() { return colors[15] }
		get COLOR_SORTBAR_SORT() { return colors[16] }
		get COLOR_SEARCHBOX_TEXT() { return colors[17] }
		get COLOR_TEXTBOX_TEXT() { return colors[18] }
		get COLOR_PANELBAR() { return colors[19] }
		get COLOR_TEXTBOX_CARET() { return util.createGradient(colors[20][0], colors[20][1], 10, true) }
		get COLOR_SEARCHBOX_CARET() { return util.createGradient(colors[21][0], colors[21][1], 10, true) }
		get COLOR_FASTSEARCH_TEXT() { return colors[22] }
		get COLOR_NUMBER_TEXTBOX() { return colors[23] }
		get COLOR_NUMBER_TEXTBOX_CARET() { return util.createGradient(colors[24][0], colors[24][1], 10, true) }
		get COLOR_CONFIGURATION_LABEL() { return colors[25] }
		get COLOR_CONSONANCE() { return colors[26] }

		get FONT_DEFAULT() { return fonts[0] }
		get FONT_CAPTION() { return fonts[1] }
		get FONT_ROWS() { return fonts[2] }
		get FONT_DURATION() { return fonts[3] }
		get FONT_NUMERATOR() { return fonts[4] }
		get FONT_ICON_TEXT() { return fonts[5] }
		get FONT_SCROLLBAR_TIP() { return fonts[6] }
		get FONT_PANELBAR_NAME() { return fonts[7] }
		get FONT_PANELBAR_INFO() { return fonts[8] }
		get FONT_SORTBAR_SORT() { return fonts[9] }
		get FONT_SEARCHBOX() { return fonts[10] }
		get FONT_SEARCHPLACE() { return fonts[11] }
		get FONT_PLAYLISTBAR_FASTSEARCH() { return fonts[12] }
		get FONT_NUMBER_TEXTBOX() { return fonts[13] }
		get FONT_CONFIGURATION_LABEL() { return fonts[14] }
		get FONT_CONSONANCE() { return fonts[15] }

		get MARGIN_PLAYLISTFRAME() { return 0 }
		get MARGIN_SCROLLFRAME() { return 0 }
		get MARGIN_SIDEFRAME() { return 0 }
		get MARGIN_PANELFRAME() { return 0 }

		get PLAYLISTFRAME_DELAY_SELECTION() { return timings[0] }
		get PLAYLISTFRAME_DELAY_TILEMOVER() { return timings[1] }
		get DURATION_ANIMATION_SELECTION() { return timings[2] }
		get DURATION_TEXTBOX_ANIMATION_CARET() { return timings[3] }
		get DURATION_SEARCHBOX_ANIMATION_CARET() { return timings[4] }
		get BUTTON_DELAY_PRESS() { return timings[5] }
		get BUTTON_REPEAT_PRESS() { return timings[6] }

		get MARGIN_IMAGE_TILE() { return pictures_margins[0] }
		get MARGIN_IMAGE_STATE() { return pictures_margins[1] }
		get MARGIN_IMAGE_PLAYSTRIPE() { return pictures_margins[2] }
		get MARGIN_IMAGE_SCROLLUP() { return pictures_margins[3] }
		get MARGIN_IMAGE_SCROLLDOWN() { return pictures_margins[4] }
		get MARGIN_IMAGE_SLIDER() { return pictures_margins[5] }
		get MARGIN_IMAGE_SCROLLBAR_BACKGROUND() { return pictures_margins[6] }
		get MARGIN_IMAGE_SCROLLBAR_TIP() { return pictures_margins[7] }
		get MARGIN_IMAGE_SIDEBAR_BACKGROUND() { return pictures_margins[8] }
		get MARGIN_IMAGE_ICON_MAIN() { return pictures_margins[9] }
		get MARGIN_IMAGE_ICON_SORT() { return pictures_margins[10] }
		get MARGIN_IMAGE_ICON_SEARCH() { return pictures_margins[11] }
		get MARGIN_IMAGE_ICON_PARAMS() { return pictures_margins[12] }
		get MARGIN_IMAGE_ICON_SETTINGS() { return pictures_margins[13] }
		get MARGIN_IMAGE_PANELBAR_BORDER() { return pictures_margins[14] }
		get MARGIN_IMAGE_PANELHEADER_BACKGROUND() { return pictures_margins[15] }
		get MARGIN_IMAGE_SORT() { return pictures_margins[16] }
		get MARGIN_IMAGE_SORT_DELETE() { return pictures_margins[17] }
		get MARGIN_IMAGE_ADD_SORT() { return pictures_margins[18] }
		get MARGIN_IMAGE_SEARCHBOX() { return pictures_margins[19] }
		get MARGIN_IMAGE_SEARCHBOX_ERASE() { return pictures_margins[20] }
		get MARGIN_IMAGE_STARTSEARCH() { return pictures_margins[21] }
		get MARGIN_IMAGE_ADDTEXTBOX() { return pictures_margins[22] }
		get MARGIN_IMAGE_TEXTBOX() { return pictures_margins[23] }
		get MARGIN_IMAGE_NUMBER_TEXTBOX() { return pictures_margins[24] }
		get MARGIN_IMAGE_TOGGLEBOX() { return pictures_margins[25] }
		get MARGIN_IMAGE_TEXTBOX_DELETE() { return pictures_margins[26] }
		get MARGIN_IMAGE_FASTSEARCH_BACKGROUND() { return pictures_margins[27] }

		constructor() {
			prepareSettings();
		}

		getScrollbarWidth() {
			return settings_data.get(DATA_SCROLLBAR_WIDTH).cache;
		}

		getSidebarWidth() {
			return settings_data.get(DATA_SIDEBAR_WIDTH).cache;
		}

		getPanelbarWidth() {
			return settings_data.get(DATA_PANELBAR_WIDTH).cache;
		}

		getAddSortButtonWidth() {
			return settings_data.get(DATA_ADDSORT_BUTTON_WIDTH).cache;
		}

		getStartsearchButtonWidth() {
			return settings_data.get(DATA_STARTSEARCH_BUTTON_WIDTH).cache;
		}

		getAddTagButtonWidth() {
			return settings_data.get(DATA_ADDTAG_BUTTON_WIDTH).cache;
		}

		getNumberTextboxWidth() {
			return settings_data.get(DATA_NUMBER_TEXTBOX_WIDTH).cache;
		}

		getAddTagButtonHeight() {
			return settings_data.get(DATA_ADDTAG_BUTTON_HEIGHT).cache;
		}

		getTileHeight() {
			let tmp1 = this.getTileMargins();
			let result = tmp1.up +
				this.getCaptionHeight() +
				tmp1.between +
				util.max(this.getRowsHeight(), this.FONT_DURATION.Height) +
				tmp1.down;
			return result;
		}

		getCaptionHeight() {
			let tmp = util.textDimension(
				this.getExpressionForCaptionEvalutor(
				).join(
					"\n"
				).replace(
					"$char(10)", "\n"
				),
				this.FONT_CAPTION
			);
			return tmp[1];
		}

		getRowsHeight() {
			let tmp = util.textDimension(
				this.getExpressionForRowsEvalutor(
				).join(
					"\n"
				).replace(
					"$char(10)", "\n"
				),
				this.FONT_ROWS
			);
			return tmp[1];
		}

		getAddSortButtonHeight() {
			return settings_data.get(DATA_ADDSORT_BUTTON_HEIGHT).cache;
		}

		getTileMargins() {
			return settings_data.get(DATA_TILE_MARGINS).cache;
		}

		getPlaystripeMargins() {
			return settings_data.get(DATA_PLAYSTRIPE_MARGINS).cache;
		}

		getTileTimeMargins() {
			return settings_data.get(DATA_TILETIME_MARGINS).cache;
		}

		getSmoothScrollParams() {
			return settings_data.get(DATA_SMOOTHSCROLL_PARAMETERS).cache;
		}

		tilesNumeratorMargin() {
			return settings_data.get(DATA_TILES_NUMERATOR_MARGIN).cache;
		}

		getAddSortButtonMargin() {
			return settings_data.get(DATA_ADDSORT_BUTTON_MARGIN).cache;
		}

		getTipMargin() {
			return settings_data.get(DATA_TIP_MARGIN).cache;
		}

		getHeaderbarNameMargin() {
			return settings_data.get(DATA_HEADERBAR_NAME_MARGIN).cache;
		}

		getHeaderbarInfoMargin() {
			return settings_data.get(DATA_HEADERBAR_INFO_MARGIN).cache;
		}

		getSortButtonMargin() {
			return settings_data.get(DATA_SORT_BUTTON_MARGIN).cache;
		}

		getTextboxMargin() {
			return settings_data.get(DATA_TEXTBOX_MARGIN).cache;
		}

		getNumberTextboxMargin() {
			return settings_data.get(DATA_NUMBER_TEXTBOX_MARGIN).cache;
		}

		getSearchtagAddButtonMargin() {
			return settings_data.get(DATA_SEARCHTAG_ADDBUTTON_MARGIN).cache;
		}

		getSearchtagsVerticalMargin() {
			return settings_data.get(DATA_SEARCHTAGS_VERTICAL_MARGIN).cache;
		}

		getFastsearchTextMargin() {
			return settings_data.get(DATA_FASTSEARCH_TEXT_MARGIN).cache;
		}

		getFastsearchTextPadding() {
			return settings_data.get(DATA_FASTSEARCH_TEXT_PADDING).cache;
		}

		getPlaylistbarPaddings() {
			return settings_data.get(DATA_PLAYLISTBAR_PADDINGS).cache;
		}

		getTipHorizontalPaddings() {
			return settings_data.get(DATA_TIP_HORIZONTAL_PADDINGS).cache;
		}

		getTipVerticalPadding() {
			return settings_data.get(DATA_TIP_VERTICAL_PADDING).cache;
		}

		getPanelbarHorizontalPadding() {
			return settings_data.get(DATA_PANELBAR_HORIZONTAL_PADDING).cache;
		}

		getSortbarVerticalPadding() {
			return settings_data.get(DATA_SORTBAR_VERTICAL_PADDING).cache;
		}

		getSearchbarVerticalPadding() {
			return settings_data.get(DATA_SEARCHBAR_VERTICAL_PADDING).cache;
		}

		getConfigbarVerticalPadding() {
			return settings_data.get(DATA_CONFIGBAR_VERTICAL_PADDING).cache;
		}

		getSorttextPadding() {
			return settings_data.get(DATA_SORTTEXT_PADDING).cache;
		}

		getSearchboxPadding() {
			return settings_data.get(DATA_SEARCHBOX_PADDING).cache;
		}

		getTextboxPadding() {
			return settings_data.get(DATA_TEXTBOX_PADDING).cache;
		}

		getNumberTextboxPadding() {
			return settings_data.get(DATA_NUMBER_TEXTBOX_PADDING).cache;
		}

		getForNumberTextboxLabelPadding() {
			return settings_data.get(DATA_NUMBER_TEXTBOX_LABEL_PADDING).cache;
		}

		getForToggleboxLabelPadding() {
			return settings_data.get(DATA_TOGGLEBOX_LABEL_PADDING).cache;
		}

		getSymbolsCountForTip() {
			return settings_data.get(DATA_SYMBOLS_COUNT_FOR_TIP).cache;
		}

		blurBackgroundImage() {
			return settings_data.get(DATA_BLUR_BACKGROUND_IMAGE_VALUE).cache;
		}

		getExpressionForCaptionEvalutor() {
			return settings_data.get(DATA_EXPRESSION_FOR_CAPTION_EVALUTOR).cache;
		}

		getExpressionForRowsEvalutor() {
			return settings_data.get(DATA_EXPRESSION_FOR_ROWS_EVALUTOR).cache;
		}

		getGeneratedArtDefaultCharacter() {
			return settings_data.get(DATA_GENERATED_ART_DEFAULT_CHARACTER).cache;
		}

		isDrawTilesNumerator() {
			return settings_data.get(DATA_DRAW_TILES_NUMERATOR).cache;
		}

		isBlurBackgroundImage() {
			return settings_data.get(DATA_BLUR_BACKGROUND_IMAGE).cache;
		}

		getResizeQuality() {
			return settings_data.get(DATA_RESIZE_QUALITY).cache;
		}

		getResizeArtQuality() {
			return settings_data.get(DATA_RESIZE_ART_QUALITY).cache;
		}
	}

	const DATA_SCROLLBAR_WIDTH = "scrollbar_width";
	const DATA_SIDEBAR_WIDTH = "sidebar_width";
	const DATA_PANELBAR_WIDTH = "panelbar_width";
	const DATA_ADDSORT_BUTTON_WIDTH = "addsort_button_width";
	const DATA_STARTSEARCH_BUTTON_WIDTH = "startsearch_button_width";
	const DATA_ADDTAG_BUTTON_WIDTH = "addtag_button_width";
	const DATA_NUMBER_TEXTBOX_WIDTH = "number_textbox_width";
	const DATA_ADDTAG_BUTTON_HEIGHT = "addtag_button_height";
	const DATA_ADDSORT_BUTTON_HEIGHT = "addsort_button_height";
	const DATA_TILE_MARGINS = "tile_margins";
	const DATA_PLAYSTRIPE_MARGINS = "playstripe_margins";
	const DATA_TILETIME_MARGINS = "tiletime_margins";
	const DATA_SMOOTHSCROLL_PARAMETERS = "smoothscroll_parameters";
	const DATA_TILES_NUMERATOR_MARGIN = "tiles_numerator_margin";
	const DATA_ADDSORT_BUTTON_MARGIN = "addsort_button_margin";
	const DATA_TIP_MARGIN = "tip_margin";
	const DATA_HEADERBAR_NAME_MARGIN = "headerbar_name_margin";
	const DATA_HEADERBAR_INFO_MARGIN = "headerbar_info_margin";
	const DATA_SORT_BUTTON_MARGIN = "sort_button_margin";
	const DATA_TEXTBOX_MARGIN = "textbox_margin";
	const DATA_NUMBER_TEXTBOX_MARGIN = "number_textbox_margin";
	const DATA_SEARCHTAG_ADDBUTTON_MARGIN = "searchtag_addbutton_margin";
	const DATA_SEARCHTAGS_VERTICAL_MARGIN = "searchtags_vertical_margin";
	const DATA_FASTSEARCH_TEXT_MARGIN = "fastsearch_text_margin";
	const DATA_FASTSEARCH_TEXT_PADDING = "fastsearch_text_padding";
	const DATA_PLAYLISTBAR_PADDINGS = "playlistbar_paddings";
	const DATA_TIP_HORIZONTAL_PADDINGS = "tip_horizontal_paddings";
	const DATA_TIP_VERTICAL_PADDING = "tip_vertical_padding";
	const DATA_PANELBAR_HORIZONTAL_PADDING = "panelbar_horizontal_padding";
	const DATA_SORTBAR_VERTICAL_PADDING = "sortbar_vertical_padding";
	const DATA_SEARCHBAR_VERTICAL_PADDING = "searchbar_vertical_padding";
	const DATA_CONFIGBAR_VERTICAL_PADDING = "configbar_vertical_padding";
	const DATA_SORTTEXT_PADDING = "sorttext_padding";
	const DATA_SEARCHBOX_PADDING = "searchbox_padding";
	const DATA_TEXTBOX_PADDING = "textbox_padding";
	const DATA_NUMBER_TEXTBOX_PADDING = "number_textbox_padding";
	const DATA_NUMBER_TEXTBOX_LABEL_PADDING = "textbox_label_padding";
	const DATA_TOGGLEBOX_LABEL_PADDING = "togglebox_label_padding";
	const DATA_SYMBOLS_COUNT_FOR_TIP = "symbols_count_for_tip";
	const DATA_BLUR_BACKGROUND_IMAGE_VALUE = "blur_background_image_value";
	const DATA_EXPRESSION_FOR_CAPTION_EVALUTOR = "expression_for_caption_evalutor";
	const DATA_EXPRESSION_FOR_ROWS_EVALUTOR = "expression_for_rows_evalutor";
	const DATA_GENERATED_ART_DEFAULT_CHARACTER = "generated_art_default_character";
	const DATA_DRAW_TILES_NUMERATOR = "draw_tiles_numerator";
	const DATA_DRAW_BACKGROUND_IMAGE = "draw_background_image";
	const DATA_BLUR_BACKGROUND_IMAGE = "blur_background_image";
	const DATA_RESIZE_QUALITY = "resize_images_quality";
	const DATA_RESIZE_ART_QUALITY = "resize_art_quality";

	let CONFIG_FILE = "consoplamanger_config.ini";
	let self = null;
	let colors = [];
	let fonts = [];
	let timings = [];
	let settings_data = null;
	let pictures_margins = [];

	function prepareSettings() {
		CONFIG_FILE = usr.getPathForConfigurationFile() + CONFIG_FILE;
		const is_load = utils.FileTest(CONFIG_FILE, "e");
		settings_data = new Map();
		setColorsToDefault(is_load);
		setFontsToDefault(is_load);
		setTimingsToDefault(is_load);
		setSettingsToDefault(is_load);
		setPicturesMarginsToDefault(is_load);
		for (const [key, obj ] of settings_data) {
			obj.process(is_load);
		}
	}

	function setColorsToDefault(load_data) {
		function toColor(str) {
			return util.colorProcessor(str);
		}
		colors.push({ value: "0xffFFFFFF", name: "background" });
		colors.push({ value: "0xCCFFFFFF", name: "blending" });
		colors.push({ value: [
			"0xff444444",
			"0xff444444",
			"0xff444444",
			"0xff444444",
			"0xffFFFFFF",
			"0xffFFFFFF",
			"0xffFFFFFF",
			"0xffFFFFFF",
			"0xff444444",
			"0xff444444",
			"0xff444444",
			"0xff444444",
			"0xffFFFFFF",
			"0xffFFFFFF",
			"0xffFFFFFF",
			"0xffFFFFFF"
		], name: "tile_caption" });
		colors.push({ value: [
			"0xff999999",
			"0xff999999",
			"0xffDDDDDD",
			"0xffDDDDDD",
			"0xff999999",
			"0xff999999",
			"0xffDDDDDD",
			"0xffDDDDDD"
		], name: "tile_rows" });
		colors.push({ value: [
			"0xff777777",
			"0xff333333",
			"0xff777777",
			"0xff777777",
			"0xffDDDDDD",
			"0xffFFFFFF",
			"0xffDDDDDD",
			"0xffDDDDDD",
			"0xff777777",
			"0xff333333",
			"0xff777777",
			"0xff777777",
			"0xffDDDDDD",
			"0xffFFFFFF",
			"0xffDDDDDD",
			"0xffDDDDDD"
		], name: "tile_duration" });
		colors.push({ value: "0xffCCCCCC", name: "numerator" });
		colors.push({ value: "0xffFFFFFF", name: "icon_text" });
		colors.push({ value: "0xff999999", name: "scrollbar_tip" });
		colors.push({ value: "0x4400AA00", name: "playing_index_item" });
		colors.push({ value: "0x440000FF", name: "focus_index_item" });
		colors.push({ value: "0xffAAAA00", name: "found_index_item" });
		colors.push({ value: "0x44AAAAAA", name: "scrollbar_job_indicator" });
		colors.push({ value: [
			"0xff0088FF",
			"0xffFFFFFF"
		], name: "selection_rectangle" });
		colors.push({ value: "0x33000000", name: "panelframe_fade" });
		colors.push({ value: "0xff222222", name: "panelbar_name" });
		colors.push({ value: "0xff888888", name: "panelbar_info" });
		colors.push({ value: [
			"0xffDDDDDD",
			"0xffFFFFFF",
			"0xff222222"
		], name: "sortbar_sort" });
		colors.push({ value: [
			"0xffB8B8B8",
			"0xffB8B8B8",
			"0",
			"0xff666666",
			"0xff666666",
			"0xff666666"
		], name: "searchbox_text" });
		colors.push({ value: [
			"0xff888888",
			"0xff888888",
			"0",
			"0xff222222",
			"0xff222222",
			"0xff222222"
		], name: "textbox_text" });
		colors.push({ value: "0xeeD8D8D8", name: "panelbar" });
		colors.push({ value: [
			"0xff0088FF",
			"0xffD8D8D8"
		], name: "textbox_caret" });
		colors.push({ value: [
			"0xff0088FF",
			"0xffFFFFFF"
		], name: "searchbox_caret" });
		colors.push({ value: [
			"0xff888888",
			"0xffFFFFFF",
			"0xff884444"
		], name: "fastsearch_text" });
		colors.push({ value: [
			"0xff888888",
			"0xff888888",
			"0",
			"0xff222222",
			"0xff222222",
			"0xff222222"
		], name: "numbertextbox_text" });
		colors.push({ value: [
			"0xff0088FF",
			"0xffD8D8D8"
		], name: "numbertextbox_caret" });
		colors.push({ value: "0xff444444", name: "configuration_label"});
		colors.push({ value: [
			"0xff44DD44",
			"0xff666666"
		], name: "consonance"});
		for (let i = 0; i < colors.length; i++) {
			let color = colors[i];
			let result = null;
			if (load_data) {
				result = utils.ReadINI(CONFIG_FILE, "COLORS", color.name);
			} else {
				utils.WriteINI(CONFIG_FILE, "COLORS", color.name, color.value)
				result = (color.value instanceof Array) ? color.value.join(", ") : color.value
			}
			if (color.value instanceof Array) {
				result = result.split(/,\s*/);
				for (let i = 0; i < color.value.length; i++) {
					if (result[i]) {
						color.value[i] = toColor(result[i]);
					} else {
						color.value[i] = toColor(color.value[i]);
					}
				}
			} else {
				color.value = result ? toColor(result) : toColor(color.value);
			}
			colors[i] = color.value
		}
	}

	function setFontsToDefault(load_data) {
		fonts.push([ "Arial, 12, 0", "default" ]);
		fonts.push([ "Arial, 16, 0", "tile_caption" ]);
		fonts.push([ "Verdana, 11, 1", "tile_rows" ]);
		fonts.push([ "Courier New, 11, 1", "duration" ]);
		fonts.push([ "Courier New, 14, 0", "numerator" ]);
		fonts.push([ "Arial, 46, 1", "icon_text" ]);
		fonts.push([ "Arial, 18, 0", "scrollbar_tip" ]);
		fonts.push([ "Arial, 20, 1", "panelbar_name" ]);
		fonts.push([ "Verdana, 12, 0", "panelbar_info" ]);
		fonts.push([ "Verdana, 14, 0", "sortbar_sort" ]);
		fonts.push([ "Verdana, 24, 0", "searchbox" ]);
		fonts.push([ "Verdana, 14, 0", "searchtag" ]);
		fonts.push([ "Verdana, 18, 0", "fastsearch" ]);
		fonts.push([ "Verdana, 14, 0", "number_textbox" ]);
		fonts.push([ "Verdana, 14, 0", "label" ]);
		fonts.push([ "Times New Roman, 18, 0", "consonance"]);
		if (load_data) {
			for (let i = 0; i < fonts.length; i++) {
				let [ data, name ] = fonts[i];
				let tmp = utils.ReadINI(CONFIG_FILE, "FONTS", name);
				if (tmp.length) {
					tmp = tmp.split(/,\s*/);
				} else {
					tmp = data.split(/,\s/);
				}
				data = data.split(/,\s*/);
				data[1] = Number.parseInt(data[1]);
				data[2] = Number.parseInt(data[2]);
				switch (tmp.length) {
					case 1: {
						let result = gdi.Font(tmp[0], data[1], data[2]);
						if (!result) {
							result = gdi.Font(data[0], data[1], data[2]);
						}
						fonts[i] = result;
					} break;
					case 2: {
						tmp[1] = Number.parseInt(tmp[1]);
						tmp[1] = Number.isNaN(tmp[1]) ? data[1] : Math.abs(tmp[1]);
						let result = gdi.Font(tmp[0], tmp[1], data[2]);
						if (!result) {
							result = gdi.Font(data[0], data[1], data[2]);
						}
						fonts[i] = result;
					} break;
					case 3: {
						tmp[1] = Number.parseInt(tmp[1]);
						tmp[1] = Number.isNaN(tmp[1]) ? data[1] : Math.abs(tmp[1]);
						tmp[2] = Number.parseInt(tmp[2]);
						tmp[2] = Number.isNaN(tmp[2]) ? data[2] : Math.abs(tmp[2]);
						let result = gdi.Font(tmp[0], tmp[1], tmp[2]);
						if (!result) {
							result = gdi.Font(data[0], data[1], data[2]);
						}
						fonts[i] = result;
					} break;
					default: {
						fonts[i] = gdi.Font(data[0], data[1], data[2]);
					} break;
				}
			}
		} else {
			for (let i = 0; i < fonts.length; i++) {
				let [ data, name ] = fonts[i];
				utils.WriteINI(CONFIG_FILE, "FONTS", name, data);
				data = data.split(/,\s*/);
				data[1] = Number.parseInt(data[1]);
				data[2] = Number.parseInt(data[2]);
				fonts[i] = gdi.Font(data[0], data[1], data[2]);
			}
		}
	}

	function setTimingsToDefault(load_data) {
		timings = [
			[ "400", "delay_selection" ],
			[ "600", "playlistframe_delay_tilemover" ],
			[ "1.5", "duration_animation_selection" ],
			[ "1", "duration_textbox_animation_caret" ],
			[ "1", "duration_searchbox_animation_caret" ],
			[ "500", "button_delay_press" ],
			[ "235", "button_repeat_press" ]

		];
		if (load_data) {
			for (let i = 0; i < timings.length; i++) {
				let [ data, name ] = timings[i];
				let result = utils.ReadINI(CONFIG_FILE, "TIMINGS", name);
				result = Number.parseInt(result);
				timings[i] = Number.isNaN(result) ? Number.parseInt(data) : Math.abs(result);
			}
		} else {
			for (let i = 0; i < timings.length; i++) {
				let [ data, name ] = timings[i];
				utils.WriteINI(CONFIG_FILE, "TIMINGS", name, data);
				timings[i] = Number.parseInt(data);
			}
		}
	}

	function setPicturesMarginsToDefault(load_data) {
		pictures_margins.push([ "tile", 16 ]);
		pictures_margins.push([ "state", 0 ]);
		pictures_margins.push([ "playstripe", 8 ]);
		pictures_margins.push([ "scrollup", 0 ]);
		pictures_margins.push([ "scrolldown", 0 ]);
		pictures_margins.push([ "slider", 0 ]);
		pictures_margins.push([ "scrollbar_background", 0 ]);
		pictures_margins.push([ "scrollbar_tip", 32 ]);
		pictures_margins.push([ "sidepanel_background", 64 ]);
		pictures_margins.push([ "sidepanel_logo_icon", 0 ]);
		pictures_margins.push([ "sidepanel_sort_icon", 0 ]);
		pictures_margins.push([ "sidepanel_search_icon", 0 ]);
		pictures_margins.push([ "sidepanel_param_icon", 0 ]);
		pictures_margins.push([ "sidepanel_settings_icon", 0 ]);
		pictures_margins.push([ "sidepanel_border", 64 ]);
		pictures_margins.push([ "header_background", 0 ]);
		pictures_margins.push([ "sort", 0 ]);
		pictures_margins.push([ "delete_sort", 0 ]);
		pictures_margins.push([ "add_sort", 0 ]);
		pictures_margins.push([ "searchbox", 0 ]);
		pictures_margins.push([ "erase_searchbox", 0 ]);
		pictures_margins.push([ "start_search", 0 ]);
		pictures_margins.push([ "add_searchtag", 0 ]);
		pictures_margins.push([ "searchtag", 0 ]);
		pictures_margins.push([ "textbox", 0 ]);
		pictures_margins.push([ "togglebox", 0 ]);
		pictures_margins.push([ "delete_textbox", 0 ]);
		pictures_margins.push([ "fastsearch_background", 0 ]);
		if (load_data) {
			for (let i = 0; i < pictures_margins.length; i++) {
				let [ name, value ] = pictures_margins[i];
				let result = utils.ReadINI(CONFIG_FILE, "MARGINS_IMAGES", name);
				result = Number.parseInt(result);
				pictures_margins[i] = Number.isNaN(result) ? Number.parseInt(value) : Math.abs(result);
			}
		} else {
			for (let i = 0; i < pictures_margins.length; i++) {
				let [ name, value ] = pictures_margins[i];
				utils.WriteINI(CONFIG_FILE, "MARGINS_IMAGES", name, value);
				pictures_margins[i] = Number.parseInt(value);
			}
		}
	}

	function setSettingsToDefault(load_data) {
		class Data {
			get cache() { return this._cache }
			constructor(func) {
				this._process = func;
				this._cache = null;
			}
			process(str) {
				this._cache = this._process(str, this._string);
			}
		}
		function toInt(SECTION, NAME, DEFAULT_VALUE, is_no_abs) {
			let result = 0;
			if (load_data) {
				let tmp = Number.parseInt(utils.ReadINI(CONFIG_FILE, SECTION, NAME));
				result = Number.isNaN(tmp) ? DEFAULT_VALUE : tmp;
				result = is_no_abs ? result : Math.abs(result);
			} else {
				utils.WriteINI(CONFIG_FILE, SECTION, NAME, DEFAULT_VALUE.toString());
				result = DEFAULT_VALUE;
			}
			return result;
		}
		function toFloat(SECTION, NAME, DEFAULT_VALUE, is_no_abs) {
			let result = 0;
			if (load_data) {
				let tmp = Number.parseFloat(utils.ReadINI(CONFIG_FILE, SECTION, NAME));
				result = Number.isNaN(tmp) ? DEFAULT_VALUE : tmp;
				result = is_no_abs ? result : Math.abs(result);
			} else {
				utils.WriteINI(CONFIG_FILE, SECTION, NAME, DEFAULT_VALUE.toString());
				result = DEFAULT_VALUE;
			}
			return result;
		}
		function toObject(SECTION, NAME, building_object, str_object, is_no_abs) {
			let str = "";
			if (load_data) {
				str = utils.ReadINI(CONFIG_FILE, SECTION, NAME);
			} else {
				str = str_object;
				utils.WriteINI(CONFIG_FILE, SECTION, NAME, str);
			}
			let strings = str.split(/,\s*/);
			if (strings.length > 0) {
				for (let tmp of strings) {
					let [ name, value ] = tmp.split(/\s*:\s*/);
					if (!name || !(name in building_object)) continue;
					value = Number.parseInt(value);
					building_object[name] = Number.isNaN(value) ? building_object[name] : (is_no_abs ? value : Math.abs(value));
				}
			}
			return building_object;
		}
		function toArray(SECTION, NAME, array_data, str_array, is_no_abs) {
			let result = [];
			if (load_data) {
				let tmp = utils.ReadINI(CONFIG_FILE, SECTION, NAME);
				tmp = tmp.split(/,\s*/);
				for (let i = 0; i < array_data.length; i++) {
					let tmp1 = Number.parseInt(tmp[i]);
					tmp1 = Number.isNaN(tmp1) ? array_data[i] : tmp1;
					tmp1 = is_no_abs ? tmp1 : Math.abs(tmp1);
					result.push(tmp1);
				}
			} else {
				utils.WriteINI(CONFIG_FILE, SECTION, NAME, str_array);
				result = array_data;
			}
			return result;
		}
		function toString(str) {
			return str.replace(
				/\\u([A-Fa-f0-9]+)/g,
				function(str, p1) {
					return String.fromCharCode(parseInt(p1, 16));
				}
			);
		}
		function toArrayStrings(SECTION, NAME, default_string) {
			let result = [];
			if (load_data) {
				let tmp = toString(utils.ReadINI(
					CONFIG_FILE, SECTION, NAME
				));
				result.push(tmp ? tmp : default_string);
				for (
					let text_data = "", index = 1;
					text_data = utils.ReadINI(
						CONFIG_FILE, SECTION, NAME + "_" + index
					);
					index++
				) {
					result.push(toString(text_data));
				}
			} else {
				utils.WriteINI(
					CONFIG_FILE, SECTION, NAME, default_string
				);
				result.push(default_string)
			}
			return result;
		}
		function toBoolean(SECTION, NAME) {
			if (load_data) {
				let tmp = utils.ReadINI(CONFIG_FILE, SECTION, NAME);
				if (tmp) {
					return /true|yes|1/i.test(tmp);
				} else {
					return true;
				}
			} else {
				utils.WriteINI(CONFIG_FILE, SECTION, NAME, "yes");
				return true;
			}
		}
		settings_data.set(
			DATA_SCROLLBAR_WIDTH,
			new Data(
				function () {
					return toInt("SCROLLBAR", DATA_SCROLLBAR_WIDTH, utils.GetSystemMetrics(2));
				}
			)
		);
		settings_data.set(
			DATA_SIDEBAR_WIDTH,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_SIDEBAR_WIDTH, 40);
				}
			)
		);
		settings_data.set(
			DATA_PANELBAR_WIDTH,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_PANELBAR_WIDTH, 500);
				}
			)
		);
		settings_data.set(
			DATA_ADDSORT_BUTTON_WIDTH,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_ADDSORT_BUTTON_WIDTH, 100);
				}
			)
		);
		settings_data.set(
			DATA_STARTSEARCH_BUTTON_WIDTH,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_STARTSEARCH_BUTTON_WIDTH, 100);
				}
			)
		);
		settings_data.set(
			DATA_ADDTAG_BUTTON_WIDTH,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_ADDTAG_BUTTON_WIDTH, 100);
				}
			)
		);
		settings_data.set(
			DATA_NUMBER_TEXTBOX_WIDTH,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_NUMBER_TEXTBOX_WIDTH, 50);
				}
			)
		);
		settings_data.set(
			DATA_ADDTAG_BUTTON_HEIGHT,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_ADDTAG_BUTTON_HEIGHT, 30);
				}
			)
		);
		settings_data.set(
			DATA_ADDSORT_BUTTON_HEIGHT,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_ADDTAG_BUTTON_HEIGHT, 30);
				}
			)
		);
		settings_data.set(
			DATA_TILE_MARGINS,
			new Data(
				function () {
					return toObject(
						"PLAYLISTBAR",
						DATA_TILE_MARGINS,
						{
							margin: 20,
							up: 3,
							down: 6,
							left: 0,
							right: 24,
							middle: 4,
							between: 3,
							duration: 3,
							time: 24
						},
						"margin: 20, up: 3, down: 6, left: 0,  right: 24, middle: 4, between: 3, duration: 3, time: 24",
						true
					);
				}, "PLAYLISTBAR",
			)
		);
		settings_data.set(
			DATA_PLAYSTRIPE_MARGINS,
			new Data(
				function () {
					return toObject(
						"PLAYLISTBAR",
						DATA_PLAYSTRIPE_MARGINS,
						{
							up: 2,
							down: 6,
							left: 8,
							right: 14
						},
						"up: 2, down: 6, left: 8, right: 14",
						true
					);
				}
			)
		);
		settings_data.set(
			DATA_TILETIME_MARGINS,
			new Data(
				function () {
					return toObject(
						"PLAYLISTBAR",
						DATA_TILETIME_MARGINS,
						{
							up: 0,
							down: 3,
							left: 16,
							right: 0
						},
						"up: 0, down: 3, left: 16, right: 0",
						true
					);
				}
			)
		);
		settings_data.set(
			DATA_SMOOTHSCROLL_PARAMETERS,
			new Data(
				function () {
					return toObject(
						"PLAYLISTBAR",
						DATA_SMOOTHSCROLL_PARAMETERS,
						{
							multiplicator: 0.23,
							coefficient: 0.9,
							base: 0.2,
							add: 0.2
						},
						"multiplicator: 0.23, coefficient: 0.9, base: 0.2, add: 0.2"
					);
				}
			)
		);
		settings_data.set(
			DATA_TILES_NUMERATOR_MARGIN,
			new Data(
				function () {
					return toInt("PLAYLISTBAR", DATA_TILES_NUMERATOR_MARGIN, 30, true);
				}
			)
		);
		settings_data.set(
			DATA_ADDSORT_BUTTON_MARGIN,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_ADDSORT_BUTTON_MARGIN, 20, true);
				}
			)
		);
		settings_data.set(
			DATA_TIP_MARGIN,
			new Data(
				function () {
					return toInt("SCROLLBAR", DATA_TIP_MARGIN, 10, true);
				}
			)
		);
		settings_data.set(
			DATA_HEADERBAR_NAME_MARGIN,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_HEADERBAR_NAME_MARGIN, 3, true);
				}
			)
		);
		settings_data.set(
			DATA_HEADERBAR_INFO_MARGIN,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_HEADERBAR_INFO_MARGIN, 3, true);
				}
			)
		);
		settings_data.set(
			DATA_SORT_BUTTON_MARGIN,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_SORT_BUTTON_MARGIN, 5, true);
				}
			)
		);
		settings_data.set(
			DATA_TEXTBOX_MARGIN,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_TEXTBOX_MARGIN, 5, true);
				}
			)
		);
		settings_data.set(
			DATA_NUMBER_TEXTBOX_MARGIN,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_NUMBER_TEXTBOX_MARGIN, 12, true);
				}
			)
		);
		settings_data.set(
			DATA_SEARCHTAG_ADDBUTTON_MARGIN,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_SEARCHTAG_ADDBUTTON_MARGIN, 20, true);
				}
			)
		);
		settings_data.set(
			DATA_SEARCHTAGS_VERTICAL_MARGIN,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_SEARCHTAGS_VERTICAL_MARGIN, 30, true);
				}
			)
		);
		settings_data.set(
			DATA_FASTSEARCH_TEXT_MARGIN,
			new Data(
				function () {
					return toInt("PLAYLISTBAR", DATA_FASTSEARCH_TEXT_MARGIN, 50, true);
				}
			)
		);
		settings_data.set(
			DATA_FASTSEARCH_TEXT_PADDING,
			new Data(
				function () {
					return toInt("PLAYLISTBAR", DATA_FASTSEARCH_TEXT_PADDING, 10, true);
				}
			)
		);
		settings_data.set(
			DATA_PLAYLISTBAR_PADDINGS,
			new Data(
				function () {
					return toArray("PLAYLISTBAR", DATA_PLAYLISTBAR_PADDINGS, [ 50, 100 ], "50, 100")
				}
			)
		);
		settings_data.set(
			DATA_TIP_HORIZONTAL_PADDINGS,
			new Data(
				function () {
					return toArray("SCROLLBAR", DATA_TIP_HORIZONTAL_PADDINGS, [ 5, 15 ], "5, 15")
				}
			)
		);
		settings_data.set(
			DATA_TIP_VERTICAL_PADDING,
			new Data(
				function () {
					return toInt("SCROLLBAR", DATA_TIP_VERTICAL_PADDING, 5, true);
				}
			)
		);
		settings_data.set(
			DATA_PANELBAR_HORIZONTAL_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_PANELBAR_HORIZONTAL_PADDING, 29, true);
				}
			)
		);
		settings_data.set(
			DATA_SORTBAR_VERTICAL_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_SORTBAR_VERTICAL_PADDING, 45, true);
				}
			)
		);
		settings_data.set(
			DATA_SEARCHBAR_VERTICAL_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_SEARCHBAR_VERTICAL_PADDING, 45, true);
				}
			)
		);
		settings_data.set(
			DATA_CONFIGBAR_VERTICAL_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_CONFIGBAR_VERTICAL_PADDING, 45, true);
				}
			)
		);
		settings_data.set(
			DATA_SORTTEXT_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_SORTTEXT_PADDING, 5, true);
				}
			)
		);
		settings_data.set(
			DATA_SEARCHBOX_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_SEARCHBOX_PADDING, 8, true);
				}
			)
		);
		settings_data.set(
			DATA_TEXTBOX_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_TEXTBOX_PADDING, 3, true);
				}
			)
		);
		settings_data.set(
			DATA_NUMBER_TEXTBOX_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_NUMBER_TEXTBOX_PADDING, 3, true);
				}
			)
		);
		settings_data.set(
			DATA_NUMBER_TEXTBOX_LABEL_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_NUMBER_TEXTBOX_LABEL_PADDING, 15, true);
				}
			)
		);
		settings_data.set(
			DATA_TOGGLEBOX_LABEL_PADDING,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_TOGGLEBOX_LABEL_PADDING, 23, true);
				}
			)
		);
		settings_data.set(
			DATA_SYMBOLS_COUNT_FOR_TIP,
			new Data(
				function () {
					return toFloat("SCROLLBAR", DATA_SYMBOLS_COUNT_FOR_TIP, 2);
				}
			)
		);
		settings_data.set(
			DATA_BLUR_BACKGROUND_IMAGE_VALUE,
			new Data(
				function () {
					return util.limit(2, toFloat("PLAYLISTBAR", DATA_BLUR_BACKGROUND_IMAGE_VALUE, 6), 255);
				}
			)
		);
		settings_data.set(
			DATA_EXPRESSION_FOR_CAPTION_EVALUTOR,
			new Data(
				function () {
					return toArrayStrings(
						"PLAYLISTBAR",
						DATA_EXPRESSION_FOR_CAPTION_EVALUTOR,
						"[$char(171)$trim(%artist%)$char(187) $char(8212) ]" +
						"$if($meta(title)," +
							"$char(171)$trim(%title%)$char(187)," +
							"%title%" +
						")"
					);
				}
			)
		);
		settings_data.set(
			DATA_EXPRESSION_FOR_ROWS_EVALUTOR,
			new Data(
				function () {
					return toArrayStrings(
						"PLAYLISTBAR",
						DATA_EXPRESSION_FOR_ROWS_EVALUTOR,
						"$if(%album%," +
							"$if(%genre%," +
								"$char(171)%album%$char(187) $char(8212) $char(171)%genre%$char(187)," +
								"$char(171)%album%$char(187)" +
							")," +
							"$if(%genre%," +
								"$char(171)%genre%$char(187)," +
								"" +
							")" +
						")"
					);
				}
			)
		);
		settings_data.set(
			DATA_GENERATED_ART_DEFAULT_CHARACTER,
			new Data(
				function () {
					if (load_data) {
						let tmp = utils.ReadINI(CONFIG_FILE, "PLAYLISTBAR", DATA_GENERATED_ART_DEFAULT_CHARACTER);
						if (tmp) {
							return toString(tmp);
						} else {
							return "+";
						}
					} else {
						utils.WriteINI(CONFIG_FILE, "PLAYLISTBAR", DATA_GENERATED_ART_DEFAULT_CHARACTER, "+");
						return "+";
					}
				}
			)
		);
		settings_data.set(
			DATA_DRAW_TILES_NUMERATOR,
			new Data(
				function () {
					return toBoolean("PLAYLISTBAR", DATA_DRAW_TILES_NUMERATOR);
				}
			)
		);
		settings_data.set(
			DATA_BLUR_BACKGROUND_IMAGE,
			new Data(
				function () {
					return toBoolean("PLAYLISTBAR", DATA_BLUR_BACKGROUND_IMAGE);
				}
			)
		);
		settings_data.set(
			DATA_RESIZE_QUALITY,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_RESIZE_QUALITY, 0);
				}
			)
		);
		settings_data.set(
			DATA_RESIZE_ART_QUALITY,
			new Data(
				function () {
					return toInt("SIDEBAR", DATA_RESIZE_ART_QUALITY, 7);
				}
			)
		);
	}

	self = new Self();
	setColorsToDefault = setColorsToDefault.bind(self);
	setFontsToDefault = setFontsToDefault.bind(self);
	setSettingsToDefault = setSettingsToDefault.bind(self);
	return self;
};
class Sortmenu {

	constructor(usr) {
		this.CONFIG_FILE = usr.getPathForConfigurationFile() + "consoplamanger_sortmenu.ini";
		let menu = window.CreatePopupMenu();
		let default_items = this._buildDefaultItems();
		let items = this._loadItems(default_items, utils.FileTest(this.CONFIG_FILE, "e"));
		let index = 1;
		for (let j = 0; j < items[0].length; j++) {
			menu.AppendMenuItem(0, index++, items[0][j][0]);
		}
		for (let i = 1; i < items.length; i++) {
			menu.AppendMenuItem(0x0020, index++, items[i][0][0]);
			for (let j = 1; j < items[i].length; j++) {
				menu.AppendMenuItem(0, index++, items[i][j][0]);
			}
		}
		this._max_index = index - 1;
		this._items = items;
		this._menu = menu;
	}

	activate(x, y) {
		let tmp = this._menu.TrackPopupMenu(x, y);
		if (tmp < 1) {
			return null;
		} else {
			tmp -= 1;
			let tmp1 = tmp;
			for(var i = 0; i < this._items.length; i++) {
				if(tmp < this._items[i].length) {
					return [ ...this._items[i][tmp], tmp1 ];
				} else {
					tmp -= this._items[i].length;
				}
			}
		}
	}

	isValidIndex(index) {
		return index < this._max_index;
	}

	getItemFromIndex(index) {
		let tmp1 = index;
		for(var i = 0; i < this._items.length; i++) {
			if(index < this._items[i].length) {
				return [ ...this._items[i][index], tmp1 ];
			} else {
				index -= this._items[i].length;
			}
		}
	}

	_buildDefaultItems() {
		let result = [ [], [], [] ];
		result[0].push(
			[ "Artist", "$if2(%artist%,000)" ]
		);
		result[0].push(
			[ "Title", "%title%" ]
		);
		result[0].push(
			[ "Album", "$if2(%album%,000)" ]
		);
		result[0].push(
			[ "Genre", "$if2(%genre%,000)" ]
		);
		result[1].push(
			[ "Path", "%path_sort%" ]
		);
		result[1].push(
			[ "Filename", "%filename_ext%" ]
		);
		result[1].push(
			[ "Filesize", "%filesize%" ]
		);
		result[1].push(
			[ "Duration", "%length%" ]
		);
		result[2].push(
			[ "By Artist and Title", "$if2(%artist%,000) - %title%" ]
		);
		result[2].push(
			[ "By Artist and Album", "$if2(%album artist%,000) - $if2(%album%,000) - $if2(%discnumber%,000) - $if2(%tracknumber%,%title%)" ]
		);
		result[2].push(
			[ "By Album", "$if2(%album%,000) - $if2(%tracknumber%,%title%)" ]
		);
		result[2].push(
			[ "By Track quality", "%samplerate% - %channels% - %bitrate%" ]
		);
		return result;
	}

	_loadItems(default_items, load_data) {
		if (load_data) {
			for (let i = 0; i < default_items.length; i++) {
				let name = null;
				let index = 0;
				do {
					name = utils.ReadINI(this.CONFIG_FILE, "group_" + i, "item_name_" + index);
					if (name) {
						let value = utils.ReadINI(this.CONFIG_FILE, "group_" + i, "item_value_" + index);
						if (value) {
							default_items[i][index] = [ name, value ]
						}
					}
					index++;
				} while (name);
			}
		}  else {
			for (let i = 0; i < default_items.length; i++) {
				for (let j = 0; j < default_items[i].length; j++) {
					utils.WriteINI(this.CONFIG_FILE, "group_" + i, "item_name_" + j, default_items[i][j][0]);
					utils.WriteINI(this.CONFIG_FILE, "group_" + i, "item_value_" + j, default_items[i][j][1]);
				}
			}
		}
		return default_items;
	}
}
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

let util = null;
let debug = null;

function on_size(w, h) {

	const APP_NAME = "Consoplamanger2";
	const APP_AUTHOR = "faseor";
	const APP_VERSION = "02.00.10.a";
	const APP_IS_DRAGDROP = true;
	const DEBUG_IS_ENABLE = true;
	const MIN_WIDTH = 200;
	const MIN_HEIGHT = 100;
	let CLR_BACKGROUND = 0;
	let CLR_BLENDING = 0;

	let app = null;
	let frames = null;
	let active_frame = null;
	let hover_frame = null;
	let focus_frame = null;
	let cfg = null;
	let usr = null;
	let pls = null;
	let imgs = null;
	let sidebar = null;
	let playlistbar = null;
	let scrollbar = null;
	let panelbar = null;
	let panelconnector = null;
	let playlistbar_bridge = null;
	let scrollbar_bridge = null;
	let jobs_listener = null;
	let jobs_count = 0;
	let background_image = null;
	let prev_x = 0;
	let prev_y = 0;

	class Application {
		/*
		*
		*/
		constructor() {
			window.DefinePanel(
				APP_NAME,
				{
					author: APP_AUTHOR,
					version: APP_VERSION,
					features: { drag_n_drop: APP_IS_DRAGDROP }
				}
			);
			window.DlgCode = 0x0080;
			debug = new Debugger(DEBUG_IS_ENABLE);
			playlistbar_bridge = new PlaylistframeBridge();
			scrollbar_bridge = new ScrollframeBridge();
			jobs_listener = [];
			usr = new PrivateConfigurations();
			util = new Util(usr);
			frames = new Frames();
			cfg = new Settings(util, usr);
			imgs = new Pictures(cfg, usr);
			pls = new Playlist(cfg, usr, imgs, Job)
			panelconnector = new PanelbarConnector();
			sidebar = new Sideframe(panelconnector, cfg, imgs);
			panelbar = new Panelframe(panelconnector, pls, imgs, cfg, usr);
			playlistbar = new Playlistframe(cfg, usr, imgs, pls, playlistbar_bridge);
			scrollbar = new Scrollframe(cfg, usr, imgs, pls, scrollbar_bridge, Job);
			frames.add(sidebar);
			frames.add(panelbar);
			frames.add(playlistbar);
			frames.add(scrollbar);
			CLR_BACKGROUND = cfg.COLOR_BACKGROUND;
			CLR_BLENDING = cfg.COLOR_BLENDING;
		}
		/*
		*
		*/
		assignCallbacks() {
			on_size = this.on_size;
			on_paint = this.on_paint;
			on_mouse_lbtn_down = this.on_mouse_lbtn_down;
			on_mouse_lbtn_up = this.on_mouse_lbtn_up;
			on_mouse_lbtn_dblclk = this.on_mouse_lbtn_dblclk;
			on_mouse_move = this.on_mouse_move;
			on_mouse_leave = this.on_mouse_leave;
			on_mouse_wheel = this.on_mouse_wheel;
			on_playlist_switch = this.on_playlist_switch;
			on_playback_new_track = this.on_playback_new_track;
			on_playback_pause = this.on_playback_pause;
			on_playback_stop = this.on_playback_stop;
			on_playback_follow_cursor_changed = this.on_playback_follow_cursor_changed;
			on_playback_time = this.on_playback_time;
			on_playback_seek = this.on_playback_seek;
			on_item_focus_change = this.on_item_focus_change;
			on_playlist_items_added = this.on_playlist_items_added;
			on_playlist_items_removed = this.on_playlist_items_removed;
			on_playlist_items_reordered = this.on_playlist_items_reordered;
			on_library_items_changed = this.on_library_items_changed;
			on_focus = this.on_focus;
			on_char = this.on_char;
			on_key_down = this.on_key_down;
			on_key_up = this.on_key_up;
			on_mouse_rbtn_down = this.on_mouse_rbtn_down;
			on_mouse_rbtn_up = this.on_mouse_rbtn_up;
			on_item_focus_change = this.on_item_focus_change;
			on_drag_drop = this.on_drag_drop;
			on_drag_enter = this.on_drag_enter;
			on_drag_leave = this.on_drag_leave;
			on_drag_over = this.on_drag_over;
		}
		/*
		*
		*/
		on_size(width, height) {
			w = util.max(width, MIN_WIDTH);
			h = util.max(height, MIN_HEIGHT);
			for (const frm of frames.ofSize()) {
				frm.onSize(w, h);
			}
			playlistbar.time = fb.PlaybackTime
			util.repaint();
		}
		/*
		*
		*/
		on_paint(g) {
			if (background_image) {
				g.GdiAlphaBlend(
					background_image,
					0, 0, background_image.Width, background_image.Height,
					0, 0, background_image.Width, background_image.Height
				);
			} else {
				g.FillSolidRect(0, 0, w, h, CLR_BACKGROUND);
			}
			for (const frm of frames.ofPaint()) {
				frm.onDraw(g);
			}
			debug.drawOSD(g);
		}
		/*
		*
		*/
		on_mouse_move(x, y) {
			if (prev_x === x && prev_y === y) return;
			if (active_frame) {
				active_frame.onPressedMouseMove(x - active_frame.x, y - active_frame.y);
			} else if (hover_frame) {
				if (hover_frame.$XY(x, y)) {
					hover_frame.onMouseMove(x - hover_frame.x, y - hover_frame.y);
				} else {
					hover_frame.onMouseOut();
					if (hover_frame = frames.$XY(x, y)) {
						hover_frame.onMouseCome(x - hover_frame.x, y - hover_frame.y);
					}
				}
			} else if (hover_frame = frames.$XY(x, y)) {
				hover_frame.onMouseCome(x - hover_frame.x, y - hover_frame.y);
			}
			prev_x = x;
			prev_y = y;
			util.repaint();
		}
		/*
		*
		*/
		on_mouse_lbtn_down(x, y) {
			if (hover_frame) {
				if (!focus_frame) {
					focus_frame = hover_frame;
					focus_frame.onFocusIn();
				} else if (focus_frame !== hover_frame) {
					focus_frame.onFocusOut();
					focus_frame = hover_frame;
					focus_frame.onFocusIn();
				}
				active_frame = hover_frame;
				hover_frame = null;
				active_frame.onMouseLeftButtonDown(x - active_frame.x, y - active_frame.y);
			}
			util.repaint();
		}
		/*
		*
		*/
		on_mouse_lbtn_up(x, y) {
			if (active_frame) {
				active_frame.onMouseLeftButtonUp(x - active_frame.x, y - active_frame.y);
				active_frame.onMouseOut();
				active_frame = null;
			}
			if (hover_frame = frames.$XY(x, y)) {
				hover_frame.onMouseCome(x - hover_frame.x, y - hover_frame.y);
			}
			util.repaint();
		}
		/*
		*
		*/
		on_mouse_lbtn_dblclk(x, y) {
			if (hover_frame) {
				hover_frame.onMouseLeftButtonDoubleClick(x - hover_frame.x, y - hover_frame.y);
			}
		}
		/*
		*
		*/
		on_mouse_rbtn_down(x, y) {
			if (hover_frame) {
				if (!focus_frame) {
					focus_frame = hover_frame;
					focus_frame.onFocusIn();
				} else if (focus_frame !== hover_frame) {
					focus_frame.onFocusOut();
					focus_frame = hover_frame;
					focus_frame.onFocusIn();
				}
				active_frame = hover_frame;
				hover_frame = null;
				active_frame.onMouseRightButtonDown(x - active_frame.x, y - active_frame.y);
			}
			util.repaint();
		}
		/*
		*
		*/
		on_mouse_rbtn_up(x, y) {
			let is_supress = false;
			if (active_frame) {
				is_supress = active_frame.onMouseRightButtonUp(x - active_frame.x, y - active_frame.y);
				active_frame.onMouseOut();
				active_frame = null;
			}
			if (hover_frame = frames.$XY(x, y)) {
				hover_frame.onMouseCome(x - hover_frame.x, y - hover_frame.y);
			}
			util.repaint();
			return is_supress;
		}
		/*
		*
		*/
		on_mouse_leave(x, y) {
			if (hover_frame) {
				hover_frame.onMouseOut();
				hover_frame = null;
			}
			util.repaint();
		}
		/*
		*
		*/
		on_mouse_wheel(step) {
			if (hover_frame) {
				hover_frame.onMouseWheel(step)
			}
			util.repaint();
		}
		/*
		*
		*/
		on_playlist_switch() {
			if (plman.ActivePlaylist !== -1) {
				pls.load(plman.ActivePlaylist);
				playlistbar.onUpdate();
				scrollbar.onUpdate();
				panelbar.onUpdate();
			} else {
				pls.flush();
				playlistbar.onFlush();
				scrollbar.onFlush();
				panelbar.onFlush();
			}
			util.repaint();
		}
		/*
		*
		*/
		on_playback_new_track() {
			pls.playingChange();
			playlistbar.time = fb.PlaybackTime;
			scrollbar.updateKeyItems();
			loadBackgroundImage();
			util.repaint();
		}
		/*
		*
		*/
		on_playback_pause() { util.repaint(); }
		/*
		*
		*/
		on_playback_stop() { util.repaint(); }
		/*
		*
		*/
		on_playback_follow_cursor_changed() {  util.repaint(); }
		/*
		*
		*/
		on_playback_time(t) {
			playlistbar.time = t;
			util.repaint();
		}
		/*
		*
		*/
		on_playback_seek(t) {
			playlistbar.time = t;
			util.repaint();
		}
		/*
		*
		*/
		on_item_focus_change(playlistIndex, prev, cur) {
			scrollbar.updateKeyItems();
			util.repaint();
		}
		/*
		*
		*/
		on_playlist_items_added(playlistIndex) {
			pls.checkChangePlaylist(playlistIndex);
			playlistbar.onUpdate();
			scrollbar.onUpdate();
			panelbar.onUpdate();
		}
		/*
		*
		*/
		on_playlist_items_removed(playlistIndex, new_count) {
			pls.checkChangePlaylist(playlistIndex);
			playlistbar.onUpdate();
			scrollbar.onUpdate();
			panelbar.onUpdate();
		}
		/*
		*
		*/
		on_playlist_items_reordered(playlistIndex) {
			if (!pls.is_self_altering) {
				pls.checkChangePlaylist(playlistIndex);
				playlistbar.onUpdate();
				scrollbar.onUpdate();
				panelbar.onUpdate();
			}
		}
		/*
		*
		*/
		on_library_items_changed(hl) {
			if (plman.ActivePlaylist !== -1) {
				pls.load(plman.ActivePlaylist);
				playlistbar.onUpdate();
				scrollbar.onUpdate();
				panelbar.onUpdate();
			} else {
				pls.flush();
				playlistbar.onFlush();
				scrollbar.onFlush();
				panelbar.onFlush();
			}
			util.repaint();
		}
		/*
		*
		*/
		on_focus(is_focus) {
			if (is_focus) {
				if (active_frame) {
					focus_frame = active_frame;
					focus_frame.onFocusIn();
				}
			} else {
				if (focus_frame) {
					focus_frame.onFocusOut();
					focus_frame = null;
				}
				if (panelconnector.index) {
					panelconnector.close();
				}
				playlistbar_bridge.action_applicationLooseFocus();
			}
			util.repaint();
		}
		/*
		*
		*/
		on_char(c) {
			switch (c) {
				case 8:
				case 13:
					return;
				default:
				if (focus_frame) {
					focus_frame.onCharCode(c);
				} else {
					playlistbar.onCharCode(c);
				}
			}
			util.repaint();
		}
		/*
		*
		*/
		on_key_down(k) {
			switch (k) {
				case 8: // backspace
				case 13: // enter
				case 46: // delete
				case 37: // left
				case 38: // up
				case 39: // right
				case 40: // down
				case 93: // menu
					if (focus_frame) {
						focus_frame.onKeyCode(k);
					} else {
						playlistbar.onKeyCode(k);
					}
				default:
			}
			util.repaint();
		}
		/*
		*
		*/
		on_key_up(k) {
		}
		/*
		*
		*/
		on_drag_drop(action, x, y, m) {
			if (playlistbar_bridge.is_dragging) {
				action.Effect = 0;
				playlistbar_bridge.event_flushDragDrop();
				if (focus_frame) {
					focus_frame.onFocusOut();
					focus_frame = null;
				}
				if (active_frame) {
					active_frame.onMouseOut();
					active_frame = null;
				}
				if (hover_frame) {
					active_frame.onMouseOut();
					hover_frame = null;
				}
			}
		}
		on_drag_enter(action, x, y, m) {

		}
		on_drag_leave() {
			if (playlistbar_bridge.is_dragging) {
				playlistbar_bridge.event_flushDragDrop();
			}
		}
		on_drag_over(action, x, y, m) {

		}
	}

	class PlaylistframeBridge {
		get action_setPosition() { return this._action1 }
		get action_setRelativePosition() { return this._action2 }
		get action_sendChar() { return this._action3 }
		get action_sendKey() { return this._action4 }
		get action_applicationLooseFocus() { return this._action5 }
		get is_dragging() { return this._is_drag }
		constructor() {
			this._action1 = null;
			this._action2 = null;
			this._action3 = null;
			this._action4 = null;
			this._action5 = null;
			this._is_drag = false;
		}
		registerActions(action1, action2, action3, action4, action5) {
			this._action1 = action1;
			this._action2 = action2;
			this._action3 = action3;
			this._action4 = action4;
			this._action5 = action5;
		}
		event_setPosition(...args) {
			scrollbar_bridge.action_setPosition(...args);
		}
		event_updateDimensionsAndPosition(...args) {
			scrollbar_bridge.action_updateDimensionAndPosition(...args);
		}
		event_invokeDragDrop() {
			this._is_drag = true;
		}
		event_flushDragDrop() {
			this._is_drag = false;
		}
	}

	class ScrollframeBridge {
		get action_setPosition() { return this._action1 }
		get action_updateDimensionAndPosition() { return this._action2 }
		constructor() {
			this._action1 = null;
			this._action2 = null;
		}
		registerActions(action1, action2) {
			this._action1 = action1;
			this._action2 = action2;
		}
		event_setPosition(...args) {
			playlistbar_bridge.action_setPosition(...args);
		}
		event_setRelativePosition(...args) {
			playlistbar_bridge.action_setRelativePosition(...args);
		}
		event_sendChar(...args) {
			playlistbar_bridge.action_sendChar(...args);
		}
		event_sendKey(...args) {
			playlistbar_bridge.action_sendKey(...args);
		}
	}

	class PanelbarConnector {
		get INDEX_NULLBAR() { return 0; }
		get INDEX_SORTBAR() { return 1; }
		get INDEX_SEARCHBAR() { return 2; }
		get INDEX_TWEAKBAR() { return 3; }
		get INDEX_SETTINGSBAR() { return 4; }
		get INDEX_INFOBAR() { return 5; }
		get index() { return this._index; }
		get frames() { return frames; }
		constructor() {
			this._listener = null;
			this._index = 0;
		}
		set index(value) { this._index = value; }
		registerListenersOfPanelbar(action1) {
			this._listener = action1;
		}
		switchFrame(...args) {
			this._listener(...args);
			if (!this.index && focus_frame) {
				focus_frame.onFocusOut();
				focus_frame = null;
			}
		}
		close() {
			this._listener(-1);
			if (focus_frame) {
				focus_frame.onFocusOut();
				focus_frame = null;
			}
		}
		sendChar(c) {
			playlistbar_bridge.action_sendChar(...args);
		}
		sendKey(k) {
			playlistbar_bridge.action_sendKey(...args);
		}
	}

	class Job {
		constructor(func, delay, max) {
			let index = 0;
			this._delay = delay;
			this._id = setInterval(() => {
				index = func(index, max);
				for (let [ _1, process, _3 ] of jobs_listener) {
					process(this._id, index);
				}
				if (max > 0 && index >= max) {
					this.stop();
				}
				util.repaint();
			}, delay);
			for (let [ start, _2, _3 ] of jobs_listener) {
				start(this._id, max);
			}
			util.repaint();
		}
		stop() {
			clearInterval(this._id);
			setTimeout(() => {
				for (let [ _1, _2, stop ] of jobs_listener) {
					stop(this._id);
				}
				util.repaint();
			}, this._delay);
			util.repaint();
		}
		static registerListener(listener_start, listener_proc, listener_stop) {
			jobs_listener.push([
				listener_start, listener_proc, listener_stop
			]);
		}
	}

	function loadBackgroundImage() {
		background_image = null;
		let now_playing = fb.GetNowPlaying();
		if (now_playing && usr.isDrawBackgroundImage()) {
			utils.GetAlbumArtAsyncV2(
				window.ID,
				now_playing,
				0,
				true, true, false
			).then((result)=>{
				if (!result || !result.image) return;
				let img = result.image;
				let g = img.GetGraphics();
				g.FillSolidRect(0, 0, img.Width, img.Height, CLR_BLENDING);
				img.ReleaseGraphics(g);
				cfg.isBlurBackgroundImage() && img.StackBlur(cfg.blurBackgroundImage());
				img = img.Resize(w, h, 0);
				background_image = img.CreateRawBitmap();
			});
		}
	}

	app = new Application();
	app.assignCallbacks();
	app.on_size(w, h);
	app.on_playlist_switch();
	loadBackgroundImage();
}
function on_paint() {}
function on_mouse_lbtn_down() {}
function on_mouse_lbtn_up() {}
function on_mouse_lbtn_dblclk() {}
function on_mouse_move() {}
function on_mouse_leave() {}
function on_mouse_wheel() {}
function on_playlist_switch() {}
function on_playback_new_track () {}
function on_playback_pause() {}
function on_playback_stop() {}
function on_playback_follow_cursor_changed() {}
function on_playback_time() {}
function on_playback_seek() {}
function on_item_focus_change() {}
function on_playlist_items_added() {}
function on_playlist_items_removed() {}
function on_playlist_items_reordered() {}
function on_library_items_changed() {}
function on_focus() {}
function on_char() {}
function on_key_down() {}
function on_key_up() {}
function on_mouse_rbtn_down() {}
function on_mouse_rbtn_up() {}
function on_item_focus_change() {}
function on_drag_drop() {}
function on_drag_enter() {}
function on_drag_leave() {}
function on_drag_over() {}
