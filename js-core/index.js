require('./core/infra');

let Exceptions = require('./core/exceptions');
let loggerCore = require('./core/logger');
let Logger = loggerCore.Logger;
let createLogger = (tag) => {
	return new Logger(tag);
};

module.exports.DateTime = require('./core/date-time');
module.exports.Utils = require('./core/utils');
module.exports.Logger = Logger;
module.exports.LogLevel = loggerCore.LogLevel;
module.exports.createLogger = createLogger;
module.exports.createLoggerFromFile = (fileName, folder) => {
	return new Logger(fileName.substring(folder.length + 1, fileName.lastIndexOf(".")));
};

module.exports.CustomException = Exceptions.CustomException;
module.exports.ApiException = Exceptions.ApiException;
module.exports.BadImplementationException = Exceptions.BadImplementationException;
module.exports.ImplementationMissingException = Exceptions.ImplementationMissingException;
module.exports.validator = require("./core/validator");
module.exports.Validator = require("./core/new-validator");
module.exports.CommandLine = require("./core/command-line");
module.exports.Crypto = require("./core/crypto");
module.exports.CliParams = require("./core/cli-params");

