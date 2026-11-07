function Infoframe(pls, imgs, cfg, usr, header) {
		
	let frm = null;
	
	class Self extends Subframe {
		constructor() {
			super();
			this.pos = [ cfg.getSidebarWidth(), 0 ];
		}
		onSize(w, h) {
			this.size = [
				cfg.getPanelbarWidth(),
				h
			];
		}
		onDraw(g) {
			header.onDraw(g);
		}
	}
	
	frm = new Self();
	return frm;
}