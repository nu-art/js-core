/**
 * Created by TacB0sS on 3/16/17.
 */
const Exceptions = require('./exceptions');

const validate = (validator, obj) => {
	if (Array.isArray(validator)) {
		validator.forEach((_validator) => {
			validate(_validator, obj);
		});
		return;
	}

	Object.keys(validator).forEach(function (key) {
		let value = obj[key];
		validateKey(validator[key], value, obj)
	});
};

const validateKey = (keyValidator, value, obj) => {
	if (typeof keyValidator === "object") {
		if (!value)
			throw new Error("Expected value for key: " + value + ", was undefined");

		validate(keyValidator, value);
		return;
	}

	if (typeof keyValidator !== "function")
		throw new Exceptions.BadImplementationException("Error while validating nested value for key: " + key);

	keyValidator(value, obj);
};

module.exports = validate;
