describe('$.monitor', function () {
	var $scatch;

	beforeEach(function () {
		 $scratch = $('<div></div>');
	});

	describe('width', function () {
		it('should capture width changes', function (done) {
			$scratch.monitor(function (dimensions) {
				expect(dimensions).to.have.property('width');
				expect(dimensions.width).to.equal(100);
				done();
			});

			$scratch.width(100);
		});

		it('should capture height changes', function (done) {
			$scratch.monitor(function (dimensions) {
				expect(dimensions).to.have.property('height');
				expect(dimensions.height).to.equal(100);
				done();
			});

			$scratch.height(100);
		});

		it('shouldnt fire when the dimensions are the same', function (done) {
			$scratch.css({
				height: 100,
				width: 100
			});

			$scratch.monitor(function (dimensions) {
				done(new Error('Monitor triggered when not expected'));
			});

			$scratch.css({
				height: 100,
				width: 100
			});

			setTimeout(done, 10); // Allow a moment to fire the event
		});
	});
})