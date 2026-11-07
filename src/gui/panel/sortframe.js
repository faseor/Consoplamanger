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