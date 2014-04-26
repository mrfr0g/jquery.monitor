describe('$.monitor', function () {
	var $scatch;

	beforeEach(function () {
		$('#scratch').remove();
		$scratch = $('<div id="scratch"></div>').appendTo('body');
	});

	describe('initialization', function () {
		it('should require that styles are passed', function (done) {
			try {
				$scratch.monitor();
			} catch (e) {
				if(e) {
					done();
				}
			}
		});
	});

	describe('jQuery support', function () {
		it('should exist as a callable method on jQuery', function () {
			expect($scratch.monitor).to.be.a('function');
		});

		it('should be chainable', function () {
			$scratch.width(1);

			var width = $scratch.monitor(['width']).width();

			expect(width).to.equal(1);
		});
	});

	describe('dimensions', function () {
		it('should capture width changes', function (done) {
			$scratch.monitor(['width'], function (styles) {
				expect(styles).to.have.property('width');
				expect(styles.width).to.equal("100px");
				done();
			});

			$scratch.width(100);
		});

		it('should capture height changes', function (done) {
			$scratch.monitor(['height'], function (styles) {
				expect(styles).to.have.property('height');
				expect(styles.height).to.equal("100px");
				done();
			});

			$scratch.height(100);
		});

		it('shouldnt fire when the dimensions are the same', function (done) {
			var scratch = $scratch[0];

			scratch.cssText = "width: 100px;height: 100px;";

			$scratch.monitor(['width', 'height'], function (styles) {
				done(new Error('Monitor triggered when not expected'));
			});

			scratch.cssText = "width: 100px;height: 100px;";

			setTimeout(done, 10); // Allow a moment to fire the event
		});
	});

	describe('color', function () {
		it('should capture color changes', function (done) {
			$scratch.monitor(['color'], function (styles) {
				expect(styles).to.have.property('color');

				// Might return rgb format
				if(styles.color.indexOf('rgb') != -1) {
					expect(styles.color).to.equal('rgb(0, 128, 0)');
				} 
				else {
					expect(styles.color).to.equal('green');
				}

				done();
			});

			$scratch.css({
				color: 'green'
			})
		})
	});
})