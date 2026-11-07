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