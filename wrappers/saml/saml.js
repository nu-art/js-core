/**
 * Created by odysseasg on 02/06/2018.
 *
 * Based on prototype by tacb0ss.
 */


const Wrapper = require('../wrapper-core').Wrapper;

class Saml
extends Wrapper {

	constructor() {
		super("saml");
	}

	_connect(callback) {
		const saml2 = require('saml2-js');
		const Promise = require('bluebird');

		// Create identity provider.
		this.idp = new saml2.IdentityProvider(this.config.idp_options);
		Promise.promisifyAll(this.idp);

		// Create service provider.
		this.sp = new saml2.ServiceProvider(this.config.sp_options);
		Promise.promisifyAll(this.sp);

		callback();
	}

	loginRequest() {
		return this.sp.create_login_request_urlAsync(this.idp, {});
	}

	getMetadata() {
		return this.sp.create_metadata();
	}

	assert(options) {
		return this.sp.post_assertAsync(this.idp, options)
			.then((saml_response) => {
				return {
					name_id: saml_response.user.name_id,
					session_index: saml_response.user.session_index
				};
			});
	}

	logoutRequest(options) {
		return this.sp.create_logout_request_urlAsync(this.idp, options);
	}

}
module.exports = Saml;
