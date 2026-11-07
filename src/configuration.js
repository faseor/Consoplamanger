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
