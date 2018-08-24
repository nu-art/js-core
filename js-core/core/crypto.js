/**
 * Created by tacb0ss on 09/07/2018.
 */
const Crypto = require("crypto");

const generateHex = (length) => {
	return Crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

const hashPasswordWithSalt = (salt, password) => {
	return Crypto.createHmac('sha512', salt).update(password).digest('hex');
};

module.exports = {
	generateHex: generateHex,
	hashPasswordWithSalt: hashPasswordWithSalt,
};