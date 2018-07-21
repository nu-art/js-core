const Wrapper = require('../wrapper-core').Wrapper;
const ImplementationMissingException = require('js-core').ImplementationMissingException;

class EmailSender
	extends Wrapper {

	constructor(tag) {
		super(tag || "emailer");
	}

	_connect(callback) {
		this.client = require('nodemailer').createTransport({
			service: this.config.service,
			auth: this.config.auth
		});
		callback();
	}

	_waitForConnectivity(callback) {
		callback();
	}

	_getSender() {
		return this.config.auth.user;
	}

	sendEmail(email, callback) {
		email.sender = this.config.from;
		this.logInfo("Sending a '" + this.label + "' Email to:  " + email.to);
		this.client.sendMail(email, callback)
	}
}

module.exports = EmailSender;