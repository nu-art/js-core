/**
 * Created by TacB0sS on 3/16/17.
 */

require("./infra");

class CustomException
	extends Error {

	constructor(message) {
		super(message);
		this.message = message;
		this.stack = (new Error(message)).stack;
		this.name = this.constructor.name;
	}
}

class BadImplementationException
	extends CustomException {

	constructor(message) {
		super(message);
	}
}

class ImplementationMissingException
	extends CustomException {

	constructor(message) {
		super(message);
	}
}

class ApiException
	extends CustomException {

	constructor(responseCode, errorBody) {
		super(JSON.stringify(errorBody));
		this.responseCode = responseCode;

		if (typeof errorBody === "string")
			this.errorBody = {message: errorBody};
		else
			this.errorBody = errorBody;
	}
}

const Exceptions = {
	ImplementationMissingException: ImplementationMissingException,
	BadImplementationException: BadImplementationException,
	ApiException: ApiException,
	CustomException: CustomException
};

module.exports = Exceptions;