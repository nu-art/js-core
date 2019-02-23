/**
 * Created by TacB0sS on 3/16/17.
 */
const Exceptions = require('./exceptions');

class ResponseErrorHandler {
	constructor(response, logger) {
		this.response = response;
		this.logger = logger;
	}

	onError(error) {
		let errorCode;
		let errorBody;

		if (error instanceof Exceptions.ApiException) {

			errorCode = error.errorCode;
			errorBody = JSON.stringify(error.errorBody);
		} else {
			errorCode = 500;
			errorBody = error.stack;
			this.logger.error("Exception in server: ", error);
		}

		if (this.logger)
			this.logger.verbose("Error code: " + errorCode, error);

		this.response.writeHead(errorCode);
		this.response.end(errorBody);
	}

	callbackInvertedResult(exceptionToThrow, successCallback) {
		return function (err, successResponse) {
			if (err) {
				this.onError(err);
				return;
			}

			if (successResponse && exceptionToThrow) {
				this.onError(exceptionToThrow);
				return;
			}

			successCallback();
		}.bind(this);

	}

	callback(exceptionToThrow, successCallback) {
		if (successCallback === undefined) {
			successCallback = exceptionToThrow;
			exceptionToThrow = undefined;
		}

		return function (err, successResponse) {
			if (err) {
				this.onError(err);
				return;
			}

			if (exceptionToThrow && !successResponse) {
				this.onError(exceptionToThrow);
				return;
			}

			successCallback(successResponse);
		}.bind(this);
	}
}


const Infra = {
	ErrorHandler: ResponseErrorHandler,
	validate: require("./validator")
};


module.exports = Infra;