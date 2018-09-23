/**
 * Created by TacB0sS on 3/16/17.
 */

String.prototype.nestedMatches = function (regexp) {
	const matches = this.match(new RegExp(regexp, 'g'));
	if (!matches || matches.length === 0)
		return [];

	const singleRegexp = new RegExp(regexp);
	return matches.map(aMatch => {
		return singleRegexp.exec(aMatch);
	});
};

Array.prototype.forEachAsync = function (processor, callback, bind) {

	if (this.length === 0) {
		callback();
		return;
	}

	const length = this.length;
	let i = 0;

	const onCompleted = (err) => {
		if (err)
			callback(err);

		i++;
		if (i === length)
			callback(undefined);
	};

	this.forEach((item) => {
		processor(item, onCompleted);
	}, bind);
};

Array.prototype.contains = function (item) {
	return this.indexOf(item) !== -1;
};

Array.prototype.lastItem = function () {
	return this.length === 0 ? undefined : this[this.length - 1];
};

Array.prototype.firstItem = function () {
	return this.length === 0 ? undefined : this[0];
};

function escapeRegExp(str) {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

String.prototype.replaceAll = function (search, replacement) {
	return this.replace(new RegExp(escapeRegExp(search), 'g'), replacement);
};

String.prototype.repeat = function (num) {
	return new Array(num + 1).join(this);
};

// Warn if overriding existing method
if (Array.prototype.equals)
	console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array)
		return false;

	// compare lengths - can save a lot of time
	if (this.length !== array.length)
		return false;

	return this.every(function (v, i) {
		return v === array[i];
	})
};

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

if (!Object.isString) {
	Object.prototype.isString = function () {
		return typeof this === "string" || this instanceof String;
	};

	Object.defineProperty(Object.prototype, "isString", {enumerable: false});
}
