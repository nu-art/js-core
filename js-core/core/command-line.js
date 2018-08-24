/**
 * Created by tacb0ss on 21/07/2018.
 */

function executeCommand(command, logger, onCompleted) {
	const exec = require('child_process').exec;

	logger.logDebug("Executing command:\n   " + command.replaceAll("\n", "\n   ") + "\n");
	exec(command, function (error, stdout, stderr) {
		if (error !== null) {
			logger.logErrorBold('exec error: ' + error);
			return;
		}

		logger.logError("stderr: " + stderr);
		logger.logVerbose("stdout: " + stdout);
		logger.logDebug("Executed command:\n   " + command.replaceAll("\n", "\n   ") + "\n");
		onCompleted();
	});
}

module.exports = executeCommand;