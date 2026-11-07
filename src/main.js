/*

*/
"use strict";

const DEV_PATH = "D:\\Dev\\"
[
	"util",
	"debugger",
	"settings",
	"configuration",
	"playlist",
	"sortmenu",
	"searchmenu",
	"animator",
	"gui\\widget",
	"gui\\widgets",
	"gui\\pictures",
	"gui\\frame",
	"gui\\frames",
	"gui\\scrollframe",
	"gui\\playlistframe",
	"gui\\sideframe",
	"gui\\textcontainer",
	"gui\\panel\\subframe",
	"gui\\panel\\headerframe",
	"gui\\panel\\panelframe",
	"gui\\panel\\infoframe",
	"gui\\panel\\sortframe",
	"gui\\panel\\searchframe",
	"gui\\panel\\configframe"
].forEach( item => {
	include(DEV_PATH + item + ".js");
});

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
