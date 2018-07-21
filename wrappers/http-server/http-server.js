/**
 * Module dependencies.
 */
const Wrapper = require("../wrapper-core").Wrapper;

class HttpServer
	extends Wrapper {

	constructor() {
		super("http-server");

		this.express = new require('express')();
		this.express.use(require('body-parser').json());
	}

	_connect(callback) {
		this.server = require('http').createServer(this.express);
		this.sockets = [];
		this.server.listen(this.config.port);
		this.server.on('connection', (socket) => {
			let socketId = this.sockets.length;

			this.logInfo("Registering socket(" + socketId + "): " + socket);
			this.sockets[socketId] = socket;

			// Extend socket lifetime for demo purposes
			// socket.setTimeout(4000);

		});

		this.server.on('error', (error) => {
			callback(error);

			if (error.syscall !== 'listen') {
				throw error;
			}

			switch (error.code) {
				case 'EACCES':
					this.logErrorBold('Server port: ' + this.config.port + ' requires elevated privileges');
					process.exit(1);
					break;
				case 'EADDRINUSE':
					this.logErrorBold('Server port: ' + this.config.port + 'is already in use');
					process.exit(1);
					break;
				default:
					throw error;
			}
		});

		this.server.on('listening', () => {
			const addr = this.server.address();
			const port = typeof addr === 'string'
				? 'pipe ' + addr
				: 'port ' + addr.port;
			this.logDebug('Listening on ' + port);
			if (callback)
				callback();
		});
	}

	_waitForConnectivity(callback) {
		this.server.on('listening', callback);
	}

	stop(onServerStoppedListener) {
		this.server.close(function () {
			this.logInfo('Server closed!');
			onServerStoppedListener();
		}.bind(this));
	}
}

module.exports = HttpServer;


