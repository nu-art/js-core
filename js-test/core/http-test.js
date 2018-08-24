/**
 * Created by TacB0sS on 3/18/17.
 */
const JSCore = require('js-core');
const Logger = JSCore.Logger;

const BaseTest = require('./base-test');

class HttpRequestTest
	extends BaseTest {
	constructor(name) {
		super(name);
		this.headers = {};
	}

	setUrl(_url) {
		this.url = _url;
		return this;
	};

	setBody(_body) {
		this.body = _body;
		return this;
	};

	setMethod(_method) {
		this.method = _method;
		return this;
	};

	setParams(_params) {
		this.params = _params;
		return this;
	};

	setName(_name) {
		this.name = _name;
		return this;
	};

	getName() {
		return this.name;
	};

	setValidator(_validator) {
		this.validator = _validator;
		return this;
	};

	getValidator() {
		return this.validator;
	};

	addHeader(key, value) {
		this.headers[key] = value;
		return this;
	};

	resolveBody() {
		if (typeof this.body === "function")
			this.body = this.body();

		if (typeof this.body === "string")
			return this.body;

		return JSON.stringify(this.body, null, 2);
	}

	resolveUrl() {
		if (typeof this.url === "function")
			this.url = this.url();

		this.url += `${this.toUrlParams()}`;

		return this.url;
	}

	toUrlParams() {
		if (!this.params)
			return "";

		if (typeof this.params === "function")
			this.params = this.params();

		if (Object.keys(this.params).length === 0)
			return "";

		return "?" + Object.keys(this.params).map((key) => {
				return key + "=" + this.params[key];
			}).join("&");
	}

	execute(callback, logger) {
		let requestBody = {
			headers: this.headers,
			uri: this.resolveUrl(),
			body: this.resolveBody(),
			method: this.method
		};

		this.logInfo(" ---- Method: " + requestBody.method);
		this.logInfo(" ---- Uri: " + requestBody.uri);

		if (requestBody.headers)
			this.logVerbose(" ---- Headers: " + Logger.indentBy(JSON.stringify(requestBody.headers, null, 2), " ---- Headers: ".length + 1));

		if (requestBody.body)
			this.logVerbose(" ---- Body: " + Logger.indentBy(requestBody.body, " ---- Body: ".length + 1));

		require('request')(requestBody, function (error, response, bodyAsString) {

			let responseToValidate;

			if (error) {
				callback("Error in Request (" + this.name + "): " + error);
				return;
			}

			if (response.statusCode >= 500 && response.statusCode < 600) {
				callback(bodyAsString);
				return;
			}

			let bodyAsObject;
			try {
				if (!bodyAsString || bodyAsString === "")
					bodyAsString = "{}";

				if (response.headers && response.headers["content-type"] && response.headers["content-type"].indexOf("application/json") !== -1)
					bodyAsObject = JSON.parse(bodyAsString);
				else
					bodyAsObject = bodyAsString;

			} catch (e) {
				this.logError(" ---- Response: " + Logger.indentBy(bodyAsString, " ---- Response: ".length + 1));
				return callback(e);
			}

			responseToValidate = {
				headers: response.headers,
				statusCode: response.statusCode,
				body: bodyAsObject,
			};

			this.logInfo(" ---- Status Code: " + response.statusCode);
			this.logVerbose(" ---- Headers: " + Logger.indentBy(JSON.stringify(responseToValidate.headers, null, 2), " ---- Headers: ".length + 1));
			if (response.statusCode !== 200) {
				if (responseToValidate.body instanceof String)
					this.logError(" ---- Response: " + Logger.indentBy(JSON.stringify(responseToValidate.body, null, 2), " ---- Response: ".length + 1));
				else
					Object.keys(responseToValidate.body).forEach((errorKey) => {
						this.logError(` ---- Response: ${Logger.indentBy(`${errorKey}: ${responseToValidate.body[errorKey]}`, " ---- Response: ".length + 1)}`);
					})
			}
			else
				this.logVerbose(" ---- Response: " + Logger.indentBy(JSON.stringify(responseToValidate.body, null, 2), " ---- Response: ".length + 1));

			let e1;
			try {
				JSCore.validator(this.getValidator(), responseToValidate);
			} catch (e) {
				e1 = e;
			}

			if (response.statusCode !== 200) {
				return callback(e1);
			}

			try {
				this.responseListener(responseToValidate);
			} catch (e) {
				e1 = e;
			}
			callback(e1);
		}.bind(this));
	};

	compose(method, url, params, body, validator) {
		return this.setMethod(method).setUrl(url).setParams(params).setBody(body).setValidator(validator);
	}

	composeHttpJsonRequest(method, url, params, body, validator) {
		return this.compose(method, url, params, body, validator).addHeader('Content-Type', 'application/json');
	}

	static createResponseValidator(expectedStatusCode, expectedReasonCode) {
		const validator = {};

		if (expectedStatusCode)
			validator.statusCode = (statusCode) => {
				if (statusCode !== expectedStatusCode)
					throw new Error("Expected statusCode " + expectedStatusCode + ", but received " + statusCode);

			};

		if (expectedReasonCode)
			validator.body = (body) => {
				if (body.errorCode !== expectedReasonCode)
					throw new Error("Expected failure reason code " + expectedReasonCode + ", but received " + body.errorCode);

			};

		return validator;
	};
}

module.exports = HttpRequestTest;