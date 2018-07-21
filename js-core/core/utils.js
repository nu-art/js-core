/**
 * Created by tacb0ss on 12/07/2018.
 */


module.exports.countListener = (_expectedCount, onComplete) => {
	let expectedCount = _expectedCount;

	return (error) => {
		if (error)
			return onComplete(error);

		expectedCount--;
		if (expectedCount === 0)
			onComplete();
	};
};