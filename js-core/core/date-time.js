/**
 * Created by TacB0sS on 3/16/17.
 */

class DateTime {
    currentTimeMillies() {
        const date = new Date();
        return date.getTime();
    }

    currentTimeMilliesWithTimeZone() {
        const date = new Date();
        return date.getTime() + date.getTimezoneOffset();
    }
}

module.exports = new DateTime();