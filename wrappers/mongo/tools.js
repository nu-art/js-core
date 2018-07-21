/**
 * Created by tacb0ss on 09/07/2018.
 */

const cursorValuesIteratorToArray = (errorHandler, cursor, callback) => {
	const array = [];
	cursorValuesIterator(errorHandler, cursor, (dbItem) => {
		if (!dbItem) {
			callback(array);
			return;
		}

		array[array.length] = dbItem;
	})
};

const cursorValuesIterator = (errorHandler, cursor, processor) => {
	let onRejected = errorHandler.onError.bind(errorHandler);
	const callback = (dbItem) => {
		processor(dbItem);
		if (!dbItem)
			return;

		cursor.next().then(callback, onRejected);
	};
	cursor.next().then(callback, onRejected);
};

const findValueInDictionary = (exception, dictionary, value) => {
	const foundValue = Object.keys(dictionary).find((key) => {
		return dictionary[key] === value;
	});

	if (!foundValue)
		throw exception;
};

module.exports = {
	cursorValuesIterator: cursorValuesIterator,
	cursorValuesIteratorToArray: cursorValuesIteratorToArray,
	findValueInDictionary: findValueInDictionary,
};