class Sequencer {
	get is_exec() { return false }
	constructor() {}
	start() {}
	stop() {}
}

function Walker(action) {
	
	let step = 0;
	let stoper = 0;
	
	class Self extends Sequencer {
		get is_exec() { return !!stoper }
		constructor() {
			super();
		}
		start(steps, duration) {
			debug.ASSERT(!stoper, "Animation is already start");
			duration *= 1000;
			step = 0;
			stoper = setInterval(() => {
				action(step);
				step++;
				if (step >= steps) {
					step = 0;
				}
				util.repaint();
			}, Math.round(duration / steps));
		}
		stop() {
			debug.ASSERT(stoper, "No animation to stop");
			stoper = clearInterval(stoper);
			return step;
		}
	}
	return new Self();
}

class Animator extends Sequencer {
	get is_exec() { return !!this._stoper }
	constructor(fps) {
		super();
		this._stoper = null;
		this._init_time = 0;
		this._duration_time = 0;
		this._fps = fps;
		this._coefficient = 0;
	}
	start(action, new_duration) {
		debug.ASSERT(!this._stoper, "Animation is already start");
		this._duration_time = Math.round(new_duration*1000);
		this._init_time = Date.now();
		this._last_time = this._init_time;
		this._stoper = setInterval(() => {
			this._last_time = Date.now();
			let elapsed_time = this._last_time - this._init_time;
			this._coefficient = elapsed_time/this._duration_time;
			action(util.limit(0, this._coefficient, 1));
			util.repaint();
			if (elapsed_time >= this._duration_time) {
				this._stoper = clearInterval(this._stoper);
			}
		}, Math.round(1000/this._fps));
	}
	restart(reinit_time, new_duration) {
		debug.ASSERT(this._stoper, "No animation to restart");
		this._duration_time = new_duration*1000;
		if (reinit_time) {
			this._init_time = Date.now();
		} else {
			/*
			this._init_time = this._last_time - 
				this._coefficient*
				this._duration_time;
			*/
		}
	}
	stop() {
		debug.ASSERT(this._stoper, "No animation to stop");
		this._stoper = clearInterval(this._stoper);
	}
	static fabricateTimingFunction(type, ...args) {
		switch (type) {
			case Animator.TYPE_CUBIC:
				{
					const point1 = 0, point2 = 0, point3 = 1, point4 = 1;
					const ratio1 = 1, ratio4 = 1;
					const [ ratio2, ratio3 ] = [ ...args ];
					return (coef) => {
						const coef1 = ratio1 * Math.pow(1-coef,3);
						const coef2 = ratio2 * 3 * Math.pow(1-coef,2) * coef;
						const coef3 = ratio3 * 3 * (1-coef) * Math.pow(coef,2);
						const coef4 = ratio4 * Math.pow(coef,3);
						return (coef1*point1 + coef2*point2 + coef3*point3 + coef4*point4) / (coef1 + coef2 + coef3 + coef4);
					};
				}
			case Animator.TYPE_QUADRATIC:
				return (coef) => {
					let point0 = 0, point2 = 1;
					let [ point1 ] = [ ...args ];
					return Math.pow(1-coef,2)*point0 +
						2*(1-coef)*coef*point1 +
						Math.pow(coef,2)*point2;
				};
			case Animator.TYPE_LINEAR:
			case Animator.TYPE_DEFAULT:
			default:
				return (coef) => {
					return coef;
				};
		}
	}
}
Animator.TYPE_DEFAULT = 0;
Animator.TYPE_LINEAR = 0;
Animator.TYPE_QUADRATIC = 1;
Animator.TYPE_CUBIC = 2;

function SmoothScroller(action_function, usr, cfg) {
	
	const SCROLL_PARAMS = cfg.getSmoothScrollParams();
	const RADIX_MULT = 0.23;
	const RADIX_COEF = 0.9;
	const LINEAR_BASE = 0.2;
	const LINEAR_ADD = 0.2;
	
	let start_pos = 0;
	let original_pos = 0;
	let destination = 0;
	let distance = 0;
	let height = 0;
	let timing_function = null;
	
	class Self extends Animator {
		constructor() {
			super(usr.getFPS());
			timing_function = Animator.fabricateTimingFunction(Animator.TYPE_CUBIC, 0.1, 0.5);
		}
		start(old_pos, new_pos, frame_height) {
			height = frame_height;
			start_pos = new_pos;
			original_pos = old_pos;
			destination = new_pos-original_pos;
			distance = Math.abs(destination);
			if (distance < 1) return;
			let duration = calcDuration(distance, height);
			super.start((coefficient)=>{
				action_function(original_pos + timing_function(coefficient)*destination);
			}, duration);
		}
		restart(cur_pos, new_pos) {
			let is_reinit_time = false;
			if (Math.sign(start_pos-original_pos) !== Math.sign(new_pos-cur_pos)) {
				is_reinit_time = true;
				original_pos = cur_pos;
				start_pos = new_pos;
			}
			destination = new_pos-original_pos;
			distance = Math.abs(destination);
			if (distance < 1) return;
			let duration = calcDuration(distance, height);
			super.restart(is_reinit_time, duration);
		}
		stop(is_applied_pos) {
			super.stop();
			if (is_applied_pos) {
				action_function(original_pos + destination);
			}
		}
	}
	
	function calcDuration(d, h) {
		if (d > h) {
			return (Math.pow(d, RADIX_MULT) / Math.pow(h, RADIX_MULT)) * RADIX_COEF;
		} else {
			return LINEAR_BASE + d/h * LINEAR_ADD;
		}
	}
	
	return new Self();
}