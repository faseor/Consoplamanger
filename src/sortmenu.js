class Sortmenu {

	constructor(usr) {
		this.CONFIG_FILE = usr.getPathForConfigurationFile() + "consoplamanger_sortmenu.ini";
		let menu = window.CreatePopupMenu();
		let default_items = this._buildDefaultItems();
		let items = this._loadItems(default_items, utils.FileTest(this.CONFIG_FILE, "e"));
		let index = 1;
		for (let j = 0; j < items[0].length; j++) {
			menu.AppendMenuItem(0, index++, items[0][j][0]);
		}
		for (let i = 1; i < items.length; i++) {
			menu.AppendMenuItem(0x0020, index++, items[i][0][0]);
			for (let j = 1; j < items[i].length; j++) {
				menu.AppendMenuItem(0, index++, items[i][j][0]);
			}
		}
		this._max_index = index - 1;
		this._items = items;
		this._menu = menu;
	}

	activate(x, y) {
		let tmp = this._menu.TrackPopupMenu(x, y);
		if (tmp < 1) {
			return null;
		} else {
			tmp -= 1;
			let tmp1 = tmp;
			for(var i = 0; i < this._items.length; i++) {
				if(tmp < this._items[i].length) {
					return [ ...this._items[i][tmp], tmp1 ];
				} else {
					tmp -= this._items[i].length;
				}
			}
		}
	}

	isValidIndex(index) {
		return index < this._max_index;
	}

	getItemFromIndex(index) {
		let tmp1 = index;
		for(var i = 0; i < this._items.length; i++) {
			if(index < this._items[i].length) {
				return [ ...this._items[i][index], tmp1 ];
			} else {
				index -= this._items[i].length;
			}
		}
	}

	_buildDefaultItems() {
		let result = [ [], [], [] ];
		result[0].push(
			[ "Artist", "$if2(%artist%,000)" ]
		);
		result[0].push(
			[ "Title", "%title%" ]
		);
		result[0].push(
			[ "Album", "$if2(%album%,000)" ]
		);
		result[0].push(
			[ "Genre", "$if2(%genre%,000)" ]
		);
		result[1].push(
			[ "Path", "%path_sort%" ]
		);
		result[1].push(
			[ "Filename", "%filename_ext%" ]
		);
		result[1].push(
			[ "Filesize", "%filesize%" ]
		);
		result[1].push(
			[ "Duration", "%length%" ]
		);
		result[2].push(
			[ "By Artist and Title", "$if2(%artist%,000) - %title%" ]
		);
		result[2].push(
			[ "By Artist and Album", "$if2(%album artist%,000) - $if2(%album%,000) - $if2(%discnumber%,000) - $if2(%tracknumber%,%title%)" ]
		);
		result[2].push(
			[ "By Album", "$if2(%album%,000) - $if2(%tracknumber%,%title%)" ]
		);
		result[2].push(
			[ "By Track quality", "%samplerate% - %channels% - %bitrate%" ]
		);
		return result;
	}

	_loadItems(default_items, load_data) {
		if (load_data) {
			for (let i = 0; i < default_items.length; i++) {
				let name = null;
				let index = 0;
				do {
					name = utils.ReadINI(this.CONFIG_FILE, "group_" + i, "item_name_" + index);
					if (name) {
						let value = utils.ReadINI(this.CONFIG_FILE, "group_" + i, "item_value_" + index);
						if (value) {
							default_items[i][index] = [ name, value ]
						}
					}
					index++;
				} while (name);
			}
		}  else {
			for (let i = 0; i < default_items.length; i++) {
				for (let j = 0; j < default_items[i].length; j++) {
					utils.WriteINI(this.CONFIG_FILE, "group_" + i, "item_name_" + j, default_items[i][j][0]);
					utils.WriteINI(this.CONFIG_FILE, "group_" + i, "item_value_" + j, default_items[i][j][1]);
				}
			}
		}
		return default_items;
	}
}