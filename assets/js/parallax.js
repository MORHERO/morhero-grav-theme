class ScrollParallax {
	constructor(parent) {
		this._parent = parent;
		this._type = this._parent.getAttribute('parallax-type');
		
		this._in_viewport = false;
		this._status = 0; // Perception of completion
		this._end_point = ((window.innerHeight || document.documentElement.clientHeight) * 0.3);
		this._curr_pos = 0;

		this._last_scroll_top = 0;
		this._scroll_direction = '';
		this._scroll_offset = (this._parent.hasAttribute('parallax-offset')? this._setup_scroll_offset(this._parent.getAttribute('parallax-offset')) : 0);

		this._first_load = true;

		this._setup_parallax();

		const that = this;

		document.addEventListener('scroll', function(e){
			// Determinate Scroll direction
			let scroll_top = window.pageYOffset || document.documentElement.scrollTop;
			if(that._last_scroll_top < scroll_top) {
				that._scroll_direction = 'down';
			} else {
				that._scroll_direction = 'up';
			}
			that._last_scroll_top = scroll_top <= 0 ? 0 : scroll_top; // For Mobile or negative scrolling

			// Determinate if Parent is in viewport
			let rect = that._parent.getBoundingClientRect();
			if(rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0 ) {
				that._in_viewport = true;

				// Get percentage of completion
				that._curr_pos = (window.innerHeight || document.documentElement.clientHeight) - rect.top;
				that._status = (that._curr_pos / (that._end_point - that._scroll_offset )) * 100;
		
				//console.log('COMPLETET ' + (that._status) + '%' );

			} else {
				that._in_viewport = false;
			}



			if(that._in_viewport && that._status <= 100 && that._status >= 0) {
				that._exec_parallax();
			} else if (that._status >= 100) {
				that._finish_parallax();
			}
		});
	}

	// SETUP FUNCTIONS
	_setup_parallax() {
		// Determinate position of Parent to viewport
		let rect = this._parent.getBoundingClientRect();
		if(rect.top >= (window.innerHeight || document.documentElement.clientHeight) ) {
			this._status = 0;
		} else if (rect.bottom <= 0) {
			this._status = 100
		} else {
			
		}

		this._exec_parallax();
		
		this._first_load = false;
		return;
	}

	// EXECUTE FUNCTIONS
	_exec_parallax() {

		if(this._type == 'split') {
			this._exec_split_parallax();
		} else if (this._type == 'left' || this._type == 'right' || this._type == 'top' || this._type == 'bottom') {
			this._exec_dir_parallax(this._type);
		} else {
			this._exec_dir_parallax('left');
		}
		return;
	}

	_exec_dir_parallax(dir) {
		let perc = (100 - this._status) / 2;
		
		if(this._first_load) {
			perc = 0;
		}

		if(dir == 'left') {
			this._parent.style.transform = 'translate(-'+ perc +'%, 0%)';
		} else if (dir == 'right') {
			this._parent.style.transform = 'translate('+ perc +'%, 0%)';
		} else if (dir == 'top') {
			this._parent.style.transform = 'translate(0%, -'+ perc +'%)';
		} else {
			this._parent.style.transform = 'translate(0%, '+ perc +'%)';
		}

		this._set_opacity(this._parent, 10);
		return;
	}

	_exec_split_parallax() {
		const that = this;

		let parent_flex = this._parent.querySelector('.flex');
		let split_elements = parent_flex.querySelectorAll('.element');

		if(split_elements) {
			// NOTE: SETUP FOR SPECIFIC 2 ELEMENTS 
			// TODO: MAKE MORE FLEXIBLE

			let perc = (100 - this._status) / 2;
			if(this._first_load) {
				perc = 0;
			}

			split_elements[0].style.transform = 'translate(-'+ perc +'%, '+ perc +'%)';
			split_elements[1].style.transform = 'translate('+ perc +'%, '+ perc +'%)';

			this._set_opacity(split_elements[0], 70);
			this._set_opacity(split_elements[1], 70);
		}
		return;
	}


	// HELPER FUNCTIONS
	_setup_scroll_offset(offset) {
		// If offset is two numbers a random offset between will be selected
		if(offset.match(/-/) != null) {
			// Get to numbers from offset string
			let min = parseInt(offset.match(/([0-9])+-/)[0].slice(0, -1));
			let max = parseInt(offset.match(/-([0-9])+/)[0].slice(1));

			offset = Math.floor(Math.random() * (max - min) + min);
		}else {
			offset = parseInt(offset);
		}
		return offset;
	}

	_set_opacity(elem, offset) {

		if(this._status > offset) {
			let perc = (this._status - offset) / (1 - (offset / 100));
			elem.style.opacity = perc / 100;
		} else {
			elem.style.opacity = 0;
		}

		if (this._first_load) {
			elem.style.opacity = 100;
		}
	}

	_finish_parallax() {
		if(this._type == 'split') {
			let parent_flex = this._parent.querySelector('.flex');
			let split_elements = parent_flex.querySelectorAll('.element');
			split_elements[0].style.transform = 'translate(0%, 0%)';
			split_elements[1].style.transform = 'translate(0%, 0%)';
			split_elements[0].style.opacity = '1';
			split_elements[1].style.opacity = '1';
		}else {
			this._parent.style.transform = 'translate(0%, 0%)';
			this._parent.style.opacity = '1';
		}
	}

}