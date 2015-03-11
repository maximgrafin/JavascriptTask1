var mockRandom = function (randomValues) {
	var values = randomValues.slice();
	return function () {
		return values.shift();
	};
};

var getMockRandomsForRectangle = function (x1, y1, x2, y2) {
	return [x2 - x1, y2 - y1, x1, y1];
};

QUnit.test("QUnit works well", function (assert) {
	assert.ok(true, "Passed!");
});

QUnit.module("container");

QUnit.test("container init", function (assert) {
	var container = new Container(1, 2, 3, 4);
	assert.equal(container.width, 1);
	assert.equal(container.height, 2);
	assert.equal(container.minRectDim, 3);
	assert.equal(container.maxRectDim, 4);
});

QUnit.test("container __getRandom", function (assert) {
	var container = new Container();

	var hits = [];

	for (var i = 0; i < 100; i++) {
		var result = container.__getRandom(0, 2);
		hits[result] = 1;
		assert.ok(result == 0 || result == 1 || result == 2);
	}

	assert.ok(hits[0]);//check that at least once appears
	assert.ok(hits[1]);//check that at least once appears
	assert.ok(hits[2]);//check that at least once appears
});

QUnit.test("container mockRandom", function (assert) {
	var randomValues = [1, 2, 3, 4];

	var container = new Container(0, 0, 0, 0, mockRandom(randomValues));

	assert.equal(container.__getRandom(0, 1000), 1);
	assert.equal(container.__getRandom(0, 1000), 2);
	assert.equal(container.__getRandom(0, 1000), 3);
	assert.equal(container.__getRandom(0, 1000), 4);
});

QUnit.test("container generate rectangle", function (assert) {
	var randomValues = getMockRandomsForRectangle(1, 2, 3, 4); // rectangle with size 1x2 at (3, 4) -> (3, 4), (4, 6)

	var container = new Container(0, 0, 0, 0, mockRandom(randomValues));

	var newRectangle = container.getRandomRectangle();

	assert.equal(newRectangle.x1, 1);
	assert.equal(newRectangle.y1, 2);
	assert.equal(newRectangle.x2, 3);
	assert.equal(newRectangle.y2, 4);
});

QUnit.test("container generate rectangle if there is no space", function (assert) {
	var container = new Container(1, 1, 1, 1);

	var existingRectangle = new Rectangle(0, 0, 1, 1);
	container.addRectangle(existingRectangle);

	var newRectangle = container.getRandomRectangle();
	assert.equal(newRectangle, null);
});

QUnit.test("container remove rectangle", function (assert) {
	var container = new Container(0, 0, 0, 0);

	var rectangle1 = new Rectangle(0, 0, 1, 1);
	container.addRectangle(rectangle1);
	assert.equal(container.rectangles[0], rectangle1);

	var rectangle2 = new Rectangle(0, 0, 1, 1);
	container.addRectangle(rectangle2);
	assert.equal(container.rectangles[1], rectangle2);

	container.removeRectangle(rectangle1);
	assert.equal(container.rectangles.length, 1);
	assert.equal(container.rectangles[0], rectangle2);
});

QUnit.test("container generate without intersection", function (assert) {
	var randomValues = getMockRandomsForRectangle(0, 0, 10, 10)
		.concat(getMockRandomsForRectangle(2, 2, 3, 3))
		.concat(getMockRandomsForRectangle(10, 10, 11, 11));

	var container = new Container(0, 0, 0, 0, mockRandom(randomValues));

	container.generateRectangles(2);

	var nextRectangle = container.rectangles[1];

	assert.equal(nextRectangle.x1, 10);
	assert.equal(nextRectangle.y1, 10);
	assert.equal(nextRectangle.x2, 11);
	assert.equal(nextRectangle.y2, 11);
});

QUnit.test("container getRandomRectangle with forbiddenPoint", function (assert) {
	var randomValues = getMockRandomsForRectangle(0, 0, 3, 3)
		.concat(getMockRandomsForRectangle(1, 1, 2, 2));

	var container = new Container(0, 0, 0, 0, mockRandom(randomValues));

	var rectangle = container.getRandomRectangle({x: 1, y: 1});

	assert.equal(rectangle.x1, 1);
	assert.equal(rectangle.y1, 1);
	assert.equal(rectangle.x2, 2);
	assert.equal(rectangle.y2, 2);
});

QUnit.test("container moveRectangle", function (assert) {
	var randomValues = getMockRandomsForRectangle(0, 0, 3, 3)
		.concat(getMockRandomsForRectangle(0, 0, 3, 3))
		.concat(getMockRandomsForRectangle(1, 1, 2, 2));

	var container = new Container(0, 0, 0, 0, mockRandom(randomValues));
	container.generateRectangles(1);
	assert.equal(container.rectangles[0].x1, 0);
	assert.equal(container.rectangles[0].y1, 0);
	assert.equal(container.rectangles[0].x2, 3);
	assert.equal(container.rectangles[0].y2, 3);

	container.moveRectangle(container.rectangles[0], {x: 1, y: 1});
	assert.equal(container.rectangles[0].x1, 1);
	assert.equal(container.rectangles[0].y1, 1);
	assert.equal(container.rectangles[0].x2, 2);
	assert.equal(container.rectangles[0].y2, 2);
});


QUnit.module("rectangle");

QUnit.test("Rectangle init", function (assert) {
	var rectangle = new Rectangle(1, 2, 3, 4);
	assert.equal(rectangle.x1, 1);
	assert.equal(rectangle.y1, 2);
	assert.equal(rectangle.x2, 3);
	assert.equal(rectangle.y2, 4);
});

QUnit.test("Rectangle init mixed bounds", function (assert) {
	var rectangle = new Rectangle(3, 4, 1, 2);
	assert.equal(rectangle.x1, 1);
	assert.equal(rectangle.y1, 2);
	assert.equal(rectangle.x2, 3);
	assert.equal(rectangle.y2, 4);
});

QUnit.test("Rectangle containsPoint", function (assert) {
	var rectangle = new Rectangle(0, 0, 2, 2);

	assert.equal(rectangle.containsPoint(1, 1), true);

	assert.equal(rectangle.containsPoint(0, 0), false);
	assert.equal(rectangle.containsPoint(0, 1), false);
	assert.equal(rectangle.containsPoint(1, 0), false);

	assert.equal(rectangle.containsPoint(2, 1), false);
	assert.equal(rectangle.containsPoint(1, 2), false);
	assert.equal(rectangle.containsPoint(2, 2), false);

	assert.equal(rectangle.containsPoint(-1, 1), false);
	assert.equal(rectangle.containsPoint(1, -1), false);

	assert.equal(rectangle.containsPoint(3, 1), false);
	assert.equal(rectangle.containsPoint(1, 3), false);
});

QUnit.test("Rectangle intersectsWith", function (assert) {
	var rectangle = new Rectangle(0, 0, 10, 10);

	var intersectingRectangles =
		[new Rectangle(1, -1, 2, 2),
			new Rectangle(1, -1, 2, 11),
			new Rectangle(-1, 1, 11, 2),
			new Rectangle(-1, 1, 2, 2),
			new Rectangle(1, 1, 2, 2),
			new Rectangle(-1, -1, 11, 11),
			new Rectangle(0, 0, 10, 10),
			new Rectangle(1, 0, 9, 10),
			new Rectangle(0, 1, 10, 9),
			new Rectangle(0, 1, 2, 2),
			new Rectangle(1, 0, 2, 2),
		];

	var notIntersectingRectangles =
		[
			new Rectangle(0, 0, -1, -1),
			new Rectangle(10, 0, 11, 10),
			new Rectangle(0, 10, 10, 11),
			new Rectangle(0, 0, -1, -1)
		];

	for (var i in intersectingRectangles)
		assert.equal(rectangle.intersectsWith(intersectingRectangles[i]), true, "intersects with for " + rectangle.toString() + " and " + intersectingRectangles[i].toString());

	for (var i in notIntersectingRectangles)
		assert.equal(rectangle.intersectsWith(notIntersectingRectangles[i]), false, "not intersects with for " + rectangle.toString() + " and " + notIntersectingRectangles[i].toString());

});




