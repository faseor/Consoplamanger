<div align=center>
	<img src=".README/header.png" />
</div>

# Consoplamanger playlist viewer

**_Consoplamanger_** is a playlist viewer for the audio player [foobar2000](https://www.foobar2000.org), which works through the Spider Monkey Panel plugin. Consoplamanger is implemented as a track tile - a special tile where you can compactly place any information about a track.

Consoplamanger supports sorting, search (full or fast), multiple selection, moving tracks within a playlist, and drag'n'drop. The load on the computer is small, Consoplamanger tries to minimize memory usage and CPU load. Consoplamanger supports full customization - both in terms of the placement of graphical elements and color scheme. A dark and light themes are included.

# Installation

To install Consoplamanger:

1) Download and install the [Spider Monkey Panel](https://www.foobar2000.org/components/view/foo_spider_monkey_panel) plugin for foobar2000. Download the plugin from the official foobar2000 repository for the 32-bit version. If you have the 64-bit version of foobar2000, then there is a version [Spider Monkey Panel](https://github.com/dima-lur/spider-monkey-panel-x64) from dima-lur, I cannot vouch for the security of this plugin, however, marc2k3 is one of the contributors. The plugin also has a lot of stars. Personally, I use this version of the plugin.

2) Download Consoplamanger from the releases page. Move the consoplamanger.js file to a place where it won't get in your way (for example, to %USER_PROFILE%\scripts). Inside the archive, also choose a dark or light theme — move the configuration and images folders directly into the foobar2000 settings folder.

2) Add the Spider Monkey Panel to your interface layout.

3) Right-click on the Spider Monkey Panel and select Configure panel...

4) In the Script Source field, select file and select the script through the file manager.

5) Press OK.

At first, the script loads album covers and builds a cache of tracks, which may cause some lag. Also, note that the dark theme requires special fonts - PT Sans and BankGothic Lt BT.

# Usage

+ Click on a tile to select a track.

+ Clicking with shift or cntrl — multiple track selection.

+ Click on empty space — start of track selection area.

+ Start typing in the Consoplamanger window to launch a quick search of the track titles.

+ Press Del on the keyboard to remove the selected tracks from the current playlist.

+ Grab the mouse over the track tile icon to move the track to a new position. This also works when multiple tracks are selected.

+ Grab the mouse over a track to initiate a drag'n'drop move.

The Consoplamanger control panel is on the left. There you can sort, search for tracks by patterns, and there are additional settings.

# Screenshots

![basic view](.README/img01.png)

![multiselection](.README/img02.png)

![side panel](.README/img03.png)

![sort panel](.README/img04.png)

![another sort panel](.README/img05.png)

![search panel](.README/img06.png)

![popup menu](.README/img07.png)

![consoplamanger configurations](.README/img08.png)

![fast search](.README/img09.png)

![dark view](.README/img10.png)

![dark side panel](.README/img11.png)

![dark sort panel](.README/img12.png)

![dark search panel](.README/img13.png)

![dark config panel](.README/img14.png)

![dark fast search](.README/img15.png)

# Problems

Soft-scrolling is not very soft. If the script stops responding to the mouse, select the same playlist from the playlist selector panel - probably you deleted some playlist, and the index of the current playlist changed.

# Support the author

If you’d like to support me, you can find the details on my main GitHub page.

