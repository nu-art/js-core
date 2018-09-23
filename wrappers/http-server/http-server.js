/**
 * Module dependencies.
 */
const Wrapper = require("../wrapper-core").Wrapper;
const fs = require("fs");

class HttpServer
	extends Wrapper {

	constructor() {
		super("http-server");

		this.express = new require('express')();
		this.express.use(require('body-parser').json());
		this.express.all("*", (req, res, next) => {

			res.setHeader('Access-Control-Allow-Origin', "*");
			res.setHeader('Access-Control-Allow-Methods', "POST");
			res.setHeader('Access-Control-Allow-Headers', "content-type");
			next();
		}).options((req, res, next) => {
			res.end();
		});
	}

	_connect(callback) {

		this.server = this.createServer();

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

	createServer() {
		let ssl = this.config.ssl;
		if (!ssl)
			return require('http').createServer(this.express);

		return require('https').createServer({
			key: fs.readFileSync(ssl.key),
			cert: fs.readFileSync(ssl.cert),
		}, this.express);
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


