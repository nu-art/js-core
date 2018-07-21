/**
 * Created by TacB0sS on 3/18/17.
 */

// const logger = require('../logger').create("GenericTest");
const BaseTest = require('./base-test');

class GenericTest
    extends BaseTest {

    constructor(name, action) {
        super(name);
        this.action = action;
    }

    execute(callback) {
        this.action((err, response) => {
            this.responseListener(response);

            callback(err, response);
        })
    }
}

module.exports = GenericTest;