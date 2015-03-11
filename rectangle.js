var Rectangle = function (x1, y1, x2, y2, color) {
	var rectangle = {
		x1: undefined,
		y1: undefined,
		x2: undefined,
		y2: undefined,
		color: undefined,

		init: function (x1, y1, x2, y2) {
			this.x1 = x1 < x2 ? x1 : x2;
			this.y1 = y1 < y2 ? y1 : y2;
			this.x2 = x2 < x1 ? x1 : x2;
			this.y2 = y2 < y1 ? y1 : y2;

			this.color = this.getRandomColor();

			return this;
		},

		changeColor: function(){
			this.color = this.getRandomColor();
		},

		getRandomColor: function () {
			var letters = '0123456789ABCDEF'.split('');
			var color = '#';
			for (var i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		},

		containsPoint: function (x, y) {
			return x > this.x1
				&& x < this.x2
				&& y > this.y1
				&& y < this.y2;
		},

		intersectsWith: function (otherRectangle) {

			if (this.y1 >= otherRectangle.y2)
				return false;

			if (this.y2 <= otherRectangle.y1)
				return false;

			if (this.x1 >= otherRectangle.x2)
				return false;

			if (this.x2 <= otherRectangle.x1)
				return false;

			return true;
		},

		toString: function () {
			return "rectacngle (" + this.x1 + ", " + this.y1 + "), (" + this.x2 + ", " + this.y2 + ")";
		}
	};

	return rectangle.init(x1, y1, x2, y2, color);
};