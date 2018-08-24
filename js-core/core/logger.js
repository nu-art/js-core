/**
 * Created by TacB0sS on 3/16/17.
 */
const LogLevel = {
	Verbose: "Verbose",
	Debug: "Debug",
	Info: "Info",
	Warning: "Warning",
	Error: "Error",
};

function getColor(level, bold) {
	let color;
	switch (level) {
		case "Verbose":
			color = "\x1b[30m";
			break;

		case "Debug":
			color = "\x1b[34m";
			break;

		case "Info":
			color = "\x1b[32m";
			break;

		case "Warning":
			color = "\x1b[33m";
			break;

		case "Error":
			color = "\x1b[31m";
			break;

	}
	if (!color)
		return "\x1b[0m";

	return color + (bold ? "\x1b[1m" : "");
}

function getPrefix(level) {
	switch (level) {
		case "Verbose":
			return "-V-";

		case "Debug":
			return "-D-";

		case "Info":
			return "-I-";

		case "Warning":
			return "-W-";

		case "Error":
			return "-E-";

		default:
			return "---";
	}
}

const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
const finalDate = new Date();

class Logger {
	constructor(tag) {
		this.setTag(tag);
	}

	setTag(tag) {
		this.tag = tag;
	}

	logVerbose(message, error) {
		this.log(LogLevel.Verbose, false, message, error);
	}

	logDebug(message, error) {
		this.log(LogLevel.Debug, false, message, error);
	}

	logInfo(message, error) {
		this.log(LogLevel.Info, false, message, error);
	}

	logWarning(message, error) {
		this.log(LogLevel.Warning, false, message, error);
	}

	logError(message, error) {
		this.log(LogLevel.Error, false, message, error);
	}

	logVerboseBold(message, error) {
		this.log(LogLevel.Verbose, true, message, error);
	}

	logDebugBold(message, error) {
		this.log(LogLevel.Debug, true, message, error);
	}

	logInfoBold(message, error) {
		this.log(LogLevel.Info, true, message, error);
	}

	logWarningBold(message, error) {
		this.log(LogLevel.Warning, true, message, error);
	}

	logErrorBold(message, error) {
		this.log(LogLevel.Error, true, message, error);
	}

	log(level, bold, message, error) {
		finalDate.setTime(Date.now() - tzoffset);

		const prefix = getPrefix(level);
		let logPrefix = " " + finalDate.toISOString().replace('T', ' ').substr(0, 23) + " " + prefix + " " + this.tag + ": ";
		let space = " ".repeat(logPrefix.length);

		if (message instanceof Error) {
			error = message;
			message = undefined;
		}

		const color = getColor(level, bold);
		if (message)
			console.log(color, logPrefix + message.replace(/\n/g, "\n" + space), getColor());

		if (error instanceof Error) {
			console.log(color, space + error.message, getColor());
			console.log(color, space + error.stack.replace(/\n/g, "\n" + space), getColor());
		} else if (error)
			console.log(color, space + error, getColor());

	}

	static indentBy(string, indentBy) {
		let space = " ".repeat(indentBy);
		return string.replace(/\n/g, "\n" + space)
	}

}

module.exports.Logger = Logger;
module.exports.LogLevel = LogLevel;