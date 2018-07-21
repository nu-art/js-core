/**
 * Created by TacB0sS on 3/16/17.
 */
class ValidationError
	extends Error {
	constructor(message) {
		super(message)
	}
}

class Validator {
	constructor(...validators) {
		if (validators.length === 1)
			this.validator = validators[0];
		else
			this.validator = Object.assign({}, ...validators);
	}

	setMandatory(mandatory) {
		this.mandatory = mandatory;
		return this;
	}

	setStrict(strict) {
		this.strict = strict;
		return this;
	}

	validate(values, path) {
		if (!path)
			throw new ValidationError(`MUST specify object name`);

		values = Array.isArray(values) ? values : [values];
		for (let i = 0; i < values.length; i++) {
			let value = values[i];
			let fullPath = path + (values.length > 1 ? "[" + i + "]" : "");

			if (this.validator instanceof RegExp) {
				if (!this.validator.test(value))
					throw new ValidationError(`invalid value for ${fullPath}: ${value}`);

				continue;
			}

			if (this.validator instanceof Function) {
				let validator = this.validator(value, fullPath);
				if (validator === false)
					throw new ValidationError(`invalid value for ${fullPath}: ${value}`);

				continue;
			}

			if (Object.keys(this.validator).length) {
				const toCheck1 = [];
				Object.keys(value).forEach((property) => {
					if (this.strict && !this.validator[property])
						throw new ValidationError(`Strict policy!!\n  Unexpected property: ${fullPath}.${property}`);

					toCheck1.push(property);
				});

				for (const property of Object.keys(this.validator)) {
					let propertyValue = value[property];
					let validator = this.validator[property];

					if (validator.mandatory && !propertyValue)
						throw new ValidationError(`Missing property: ${fullPath}.${property}`);

					if (propertyValue)
						validator.validate(propertyValue, `${fullPath}.${property}`);
				}

				continue;
			}

			if (this.validator !== value)
				throw new ValidationError(`Unexpected value for: ${fullPath} => ${value}`);
		}
	}
}

Validator.ValidationError = ValidationError;
module.exports = Validator;
