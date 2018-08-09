var methods = {};

var output = 1337;

methods.updateServer = function() {
	console.log("Imortant function");
};

methods.eatCookies = function() {
	console.log("Chocolate cookies");
};

methods.node = function() {
	console.log("NodsJS, is AWESOME");
};

methods.sumNumber = function(a, b) {
	output = a+b;
	return a+b;
};

methods.circleCircumference = function(radius) {
	output = 2 * MATH.PI * radius;
	return 2 * MATH.PI * radius;
};

methods.areaOfRectangle = function(a, b) {
	output = a*b;
	return a*b;
};

exports.data = methods;
exports.output = output;