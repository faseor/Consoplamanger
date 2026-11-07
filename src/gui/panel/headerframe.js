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