var glitch_list = [];
var parallax_list = [];

document.onreadystatechange = function() {
	if (document.readyState === 'complete') {

		let glitch_images = document.querySelectorAll('.glitch-image-container');
		if(glitch_images) {
			for (let i = 0; i < glitch_images.length; i++) {
				let image = glitch_images[i];
			
				glitch_list.push(new ImageGlitch(image));
			}
		}

		let parallax_elements = document.querySelectorAll('[scroll-parallax=true]');
		if(parallax_elements) {
			for (let i = 0; i < parallax_elements.length; i++) {
				let element = parallax_elements[i];
				parallax_list.push(new ScrollParallax(element));
			}
		}
		
		let matrix_elem = document.querySelector('[module=matrix-bg]');
		let row_amount = matrix_elem.offsetHeight / 46;
		if(matrix_elem) {
			for (let i = 0; i < 10; ++i) {
				new Rain({ target: matrix_elem, row: row_amount });
			}
		}
	}
}





