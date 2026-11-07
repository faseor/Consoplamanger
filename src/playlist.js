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
