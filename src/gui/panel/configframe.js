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