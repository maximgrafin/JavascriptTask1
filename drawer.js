var Drawer = function (container) {//TODO ms: test
	var drawer = {
		mousePosition: {x: undefined, y: undefined},
		container: undefined,
		init: function (container) {
			this.container = container;
			return this;
		},
		updateMousePosition: function (event) {
			drawer.mousePosition.x = event.clientX || event.pageX;
			drawer.mousePosition.y = event.clientY || event.pageY;
		},
		draw: function () {
			var newElement = window.document.createElement("div");
			newElement.style.cssText = 'position:absolute;left:0px;top:0px;width:' + container.width + 'px;height:' + container.height + 'px;background-color: grey;';
			window.document.body.appendChild(newElement);
			newElement.onmousemove = this.updateMousePosition;

			for (var i in container.rectangles) {
				this.drawRectangle(container.rectangles[i]);
			}
		},
		drawRectangle: function (rectangle) {
			if (!rectangle)
				return;
			var rectangleElement = window.document.createElement("div");
			rectangleElement.style.cssText = 'position:absolute;left:' + rectangle.x1 + 'px;top:' + rectangle.y1 + 'px;width:' + (rectangle.x2 - rectangle.x1) + 'px;height:' + (rectangle.y2 - rectangle.y1) + 'px;background-color: ' + rectangle.color + ';';

			rectangleElement.onmouseover = function () {
				rectangle.changeColor();
				rectangleElement.style.backgroundColor = rectangle.color;

				if (rectangleElement.mouseTimeout)
					clearTimeout(rectangleElement.mouseTimeout);

				rectangleElement.mouseTimeout = setTimeout(function () {
					rectangleElement.parentNode.removeChild(rectangleElement);
					var newRectangle = container.moveRectangle(rectangle, drawer.mousePosition);
					drawer.drawRectangle(newRectangle);
				}, 3000);
			};

			rectangleElement.onmouseout = function () {
				if (rectangleElement.mouseTimeout)
					clearTimeout(rectangleElement.mouseTimeout);
			};

			rectangleElement.onmousemove = this.updateMousePosition;

			window.document.body.appendChild(rectangleElement);
		}
	};
	return drawer.init(container);
};