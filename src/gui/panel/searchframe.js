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