var Container = function (width, height, minRectDim, maxRectDim, getRandom) {
	var container = {
		width: undefined,
		height: undefined,
		minRectDim: undefined,
		maxRectDim: undefined,

		rectangles: [],

		init: function (width, height, minRectDim, maxRectDim) {
			this.width = width;
			this.height = height;
			this.minRectDim = minRectDim;
			this.maxRectDim = maxRectDim;
			return this;
		},

		generateRectangles: function (nRectangles) {
			for (var i = 0; i < nRectangles; i++) {
				var newRectangle = this.getRandomRectangle();
				if (newRectangle)
					this.addRectangle(newRectangle);
			}
		},

		moveRectangle: function (rectangle, forbiddenPoint) {
			this.removeRectangle(rectangle);
			var newRectangle = this.getRandomRectangle(forbiddenPoint);
			if (newRectangle)
				this.addRectangle(newRectangle);
			return newRectangle;
		},

		getRandomRectangle: function (forbiddenPoint) { //TODO ms: optimize
			var generatedWellRectangle = false;
			var newRectangle = null;
			for (var attempt = 0; attempt < 1000 && !generatedWellRectangle; attempt++)
			{
				generatedWellRectangle = true;

				var width = this.__getRandom(minRectDim, maxRectDim);
				var height = this.__getRandom(minRectDim, maxRectDim);


				var x1 = this.__getRandom(0, this.width - width);
				var y1 = this.__getRandom(0, this.height - height);

				newRectangle = new Rectangle(x1, y1, x1 + width, y1 + height);

				if (forbiddenPoint && newRectangle.containsPoint(forbiddenPoint.x, forbiddenPoint.y)) {
					generatedWellRectangle = false;
					continue;
				}

				for (var rectangleIndex in this.rectangles) {
					var existingRectangle = this.rectangles[rectangleIndex];
					if (newRectangle.intersectsWith(existingRectangle)) {
						generatedWellRectangle = false;
						break;
					}
				}
			}

			return generatedWellRectangle ? newRectangle : null;
		},

		removeRectangle: function (rectangle) {
			this.rectangles.splice(this.rectangles.indexOf(rectangle), 1);
		},

		addRectangle: function (rectangle) {
			this.rectangles.push(rectangle);
		},

		__getRandom: getRandom ? getRandom : function (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
	};

	return container.init(width, height, minRectDim, maxRectDim);
};