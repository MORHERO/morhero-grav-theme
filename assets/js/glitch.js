// https://codepen.io/tksiiii/pen/xdQgJX
class ImageGlitch {
	constructor(parent) {
		this._parent = parent;
		
		// ORIGIN IMAGE RELATED
		this._img_src = this._parent.querySelector('img.canvas');
		this._img_x = this._img_src.width;
		this._img_y = this._img_src.height
		this._img_data = '';

		// CANVAS RELATED
		this._canvas = this._parent.querySelector('canvas');
		this._ctx = this._canvas.getContext('2d');

		// ANIMATION RELATED
		this._anim_current_frame = 0;
		this._anim_total_frames = 10;
		this._anim_running = false;
		this._anim_interval = '';
		this._anim_delay = 10;
		//this._requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		
		//window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		//window.requestAnimationFrame = this._requestAnimationFrame;


		// HANDLERS
		this._canvas_reset_time = 300;
		this._canvas_reset_handler = '';

		this._setup_eventlisteners();
		this._setup_canvas();
	}
	_setup_eventlisteners() {
		const that = this;
		window.addEventListener('resize', function(e){
			that._resize_canvas();
		});
		//that._exec_glitch();
		document.addEventListener('scroll', function(e){
			//that._exec_glitch();
			that._start_glitch_handler();
		});
		return;
	}

	_setup_canvas() {
		this._resize_canvas();

		return;
	}
	_resize_canvas() {
		this._img_x = this._img_src.width;
		this._img_y = this._img_src.height

		this._canvas.setAttribute('width', this._img_x);
		this._canvas.setAttribute('height', this._img_y);
		this._reset_canvas();
		return;
	}

	_start_glitch_handler() {
		const that = this;
		
		// Check if elment is in viewport
		let rect = this._parent.getBoundingClientRect();
		let in_viewport = false;
		if(rect.bottom >= 100 ) {
			in_viewport = true;
		}

		// Run only if not currently running and in viewport
		if(!this._anim_running && in_viewport) {
			this._anim_running = true;
			
			this._anim_interval = window.setInterval(function() {
				that._exec_glitch();
			}, that._anim_delay);
			
			window.setTimeout(function() {
				window.clearTimeout(that._anim_interval);
				that._reset_canvas();
				that._anim_running = false;
			}, that._anim_delay * (that._anim_total_frames ));
		}
		return;
	}
	_reset_canvas() {
		this._ctx.clearRect(0, 0, this._img_x, this._img_y);
		this._ctx.drawImage(this._img_src, 0, 0, this._img_x, this._img_y);
		this._img_data = this._ctx.getImageData(0, 0, this._img_x, this._img_y);
		return;
	}



	_exec_glitch() {
		//console.log('exec')
		if (!(this._anim_current_frame % this._anim_total_frames) || this._anim_current_frame > this._anim_total_frames) {
			//this._reset_canvas();
			
			this._img_data = this._ctx.getImageData(0, 0, this._img_x, this._img_y);
			
			//this._img_data = this._pixel_processor(this._img_data, 1);
			this._img_data = this._pixel_processor(this._img_data, 4);
			
			if(this._rand_int(0, 3) == 0) {
				this._img_data = this._pixel_processor(this._img_data, 1);
			}
			//this._ctx.putImageData(this._img_data, 0, 0);

			this._anim_current_frame = 0;
		}

		if (this._anim_current_frame === this._rand_int(0, this._anim_total_frames)) {
			//this._img_data = this._pixel_processor(this._img_data, 4);
			this._img_data = this._pixel_processor(this._img_data, 1);
			//this._ctx.putImageData(this._img_data, 0, 0);

			//this._draw_glitch(this._img_x, this._img_y, this._rand_int(3, 10), 1);
			//this._draw_glitch(this._img_x, this._img_y, this._rand_int(10, 60), 1);

			//this._draw_glitch(this._img_x, this._img_y, this._rand_int(3, 30), 2);
			//this._draw_glitch(this._img_x, this._img_y, this._rand_int(30, 120), 2);
		}
		this._ctx.putImageData(this._img_data, 0, 0);

		//this._draw_glitch(this._img_x, this._img_y, this._rand_int(3, 10), 1);
		this._draw_glitch(this._img_x, this._img_y, this._rand_int(10, 60), 1);

		//this._draw_glitch(this._img_x, this._img_y, this._rand_int(3, 30), 2);
		this._draw_glitch(this._img_x, this._img_y, this._rand_int(30, 120), 2);

		this._anim_current_frame++;

		return;
	}


	_pixel_processor(img_data, step) {
		let data = img_data.data || [];
		step = step * 4 || 4;

		if (data.length) {
			var rgb = [];

			for (var i = 0; i < data.length; i += step) {
				this._pixel_cooler(i, data);
			}

			return img_data;
		} else {
			return img_data;
		}
	}
	_pixel_cooler(i, d) {
		//d[i] = 1;
		//d[i + 1] += this._rand_int(2, 5);
		//d[i + 2] *= this._rand_int(1, 3) + 8;
		d[i] = 10;
		d[i + 1] += this._rand_int(2, 5);
		d[i + 2] *= this._rand_int(1, 3) + 8;
		d[i + 3] -= this._rand_int(5, 100);
		return d;
	}
	_pixel_flick(i, d) {
		//d[i] = d[i + 16];
		d[i] = d[i + 16];
		return d;
	}
	_glitch_block(i, x, y) {
		if (i > 3) {
			//var spliceHeight = 1 + this._rand_int(0, 1);
			var spliceHeight = 1 + this._rand_int(10, 30);
			this._ctx.drawImage(this._canvas,
				x,
				y,
				x,
				spliceHeight,
				this._rand_int(0, x),
				y,
				this._rand_int(x, this._img_x),
				spliceHeight);
		}
		return;
	}
	_glitch_line(i, x, y) {
		//var spliceHeight = 1 + this._rand_int(1, 50);
		var spliceHeight = 1 + this._rand_int(10, 100);
		this._ctx.drawImage(this._canvas,
			0.02,
			y,
			this._img_x - 0.02 * 2,
			spliceHeight,
			1 + this._rand_int(0, 0.02 * 2), //-offset / 3 + this._rand_int(0, offset / 1.5),
			y + this._rand_int(0, 10),
			this._img_x - 0.02,
			spliceHeight);
		return;
	}
	_draw_glitch(width, height, amount, effect_id) {
		for (var i = 0; i < (amount || 10); i++) {
			var x = Math.random() * width + 1,
			y = Math.random() * height + 1;

			if(effect_id == 1) {
				this._glitch_block(i, x, y);
			}else {
				this._glitch_line(i, x, y);
			}
		}
		return;
	}
	_rand_int(a, b) {
		return ~~(Math.random() * (b - a) + a);
	}
}