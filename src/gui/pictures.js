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