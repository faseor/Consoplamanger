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
