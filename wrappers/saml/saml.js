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
		// Create identity provider.
		this.idp = new saml2.IdentityProvider(this.config.idp_options);

		// Create service provider.
		this.sp = new saml2.ServiceProvider(this.config.sp_options);

		callback();
	}

	loginRequest(callback) {
		this.sp.create_login_request_url(this.idp, {}, function(err, login_url, request_id) {
			if (err != null) {
				callback(err);
			} else {
				callback(null, login_url);
			}
		});
	}

	getMetadata() {
		return this.sp.create_metadata();
	}

	assert(options, callback) {
		this.sp.post_assert(this.idp, options, function(err, saml_response) {
			if (err != null) {
				callback(err);
			} else {
				callback(null, {
					name_id: saml_response.user.name_id,
					session_index: saml_response.user.session_index
				});
			}
		});
	}

	logoutRequest(options, callback) {
		this.sp.create_logout_request_url(this.idp, options, function(err, logout_url) {
			if (err != null) {
				callback(err);
			} else {
				callback(null, logout_url);
			}
		});
	}

}
module.exports = Saml;
