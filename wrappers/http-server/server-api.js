/**
 * Created by tacb0ss on 11/07/2018.
 */

const ImplementationMissingException = require('js-core').ImplementationMissingException;
const Logger = require('js-core').Logger;
const ErrorHandler = require('./error-handler');
const Url = require('url');

class ServerApi
	extends Logger {

	constructor(method, relativePath, tag) {
		super(tag || relativePath);
		this.method = method;
		this.relativePath = "/" + relativePath;
	}

	route(router, prefixUrl) {
		let fullPath = `${this.relativePath}`;
		switch (this.method) {
			case ServerApi.Method_POST:
				router.post(fullPath, this.call.bind(this));
				break;

			case ServerApi.Method_GET:
				router.get(fullPath, this.call.bind(this));
				break;
		}
	}

	call(req, res) {
		const _res = {
			res: res,
			code: (responseCode, headers) => {
				res.set(headers);
				res.writeHead(responseCode);
				res.end();
			},
			text: (responseCode, response, headers) => {
				res.set(headers);
				res.writeHead(responseCode);
				res.end(response, "text/plain");
			},
			html: (responseCode, response, headers) => {
				res.set(headers);
				res.writeHead(responseCode);
				res.end(response, "text/html");
			},
			json: (responseCode, response, headers) => {
				(headers = headers || {})["content-type"] = "application/json";
				res.set(headers);
				res.writeHead(responseCode);
				res.end(JSON.stringify(response));
			},
			end: (responseCode, headers) => {
				(headers = headers || {})["content-type"] = "application/json";
				res.set(headers);
				res.end(responseCode);
			},
			exception: (exception, message, headers) => {
				const target = {};
				Object.assign(target, exception.errorBody);
				if (message)
					target.debug = message;
				_res.json(exception.responseCode, target, headers);
			},
			serverError: (error, headers) => {
				_res.text(500, error.stack, headers);
			},
			apiErrorHandler: (callback, headers) => {
				return (error, data1, data2, data3) => {
					if (error)
						return _res.text(500, error.stack, headers);

					callback(data1, data2, data3);
				}
			}
		};

		try {
			this.logInfo("-- Url: " + JSON.stringify(req.originalUrl));
			const reqQuery = Url.parse(req.url, true).query;
			if (reqQuery && Object.keys(reqQuery).length)
				this.logVerbose("-- Url Params: " + JSON.stringify(reqQuery));

			const body = req.body;
			if (body && (Object.keys(body).length || body.length))
				this.logVerbose("-- Body: " + JSON.stringify(body));

			this.process(req, _res, reqQuery, body);
		} catch (e) {
			this.logErrorBold(e);
			_res.code(500);
		}
	}

	process(req, res, urlParams, body) {
		throw new ImplementationMissingException("abstract class... implement this method");
	}
}

ServerApi.Method_POST = "post";
ServerApi.Method_GET = "get";
ServerApi.Method_PATCH = "patch";
ServerApi.Method_DELETE = "delete";
ServerApi.Method_PUT = "put";
ServerApi.Method_OPTIONS = "options";
ServerApi.Method_HEAD = "head";

require("./http-server").ServerApi = ServerApi;
module.exports = ServerApi;