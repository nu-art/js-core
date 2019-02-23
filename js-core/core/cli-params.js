/**
 * Created by tacb0ss on 12/07/2018.
 */


// const ParamRef = {
// 	keys: ["--param-name"], // multi-options for this param
// 	name: "Param description", // human readable description
// 	keyName: "paramKey", // will be the property in the object returned
// 	mandatory: true // is mandatory
// };


module.exports = function (...params) {
	const coreParams = Array.isArray(params) ? params || [] : [params];
	const extractedParams = {};

	const toRet = {
		extractParams: (argsDetails) => {
			const allParams = [];
			allParams.push(...coreParams);
			allParams.push(...(argsDetails || []));
			allParams.forEach((argDetails) => {
				console.log("argDetails: " + argDetails.keyName);
				process.argv.slice(2, process.argv.length).forEach((arg) => {
					const value = argDetails.keys.map((key) => {
						const match = arg.match(new RegExp(`${key}=(.*)`));
						return match ? match[1] : null;
					}).find((value) => {
						return value;
					});

					if (value) {
						extractedParams[argDetails.keyName] = value;
					}
				});
			});

			toRet.printHowTo(allParams, extractedParams);
			return extractedParams;
		},
		printHowTo: (argsDetails, foundArgs) => {
			console.log("\nHOW TO USE:\n");
			console.log(`     node ${process.argv[1].split(process.argv[1].lastIndexOf("/"))}`);
			const _foundArgs = argsDetails.filter((arg) => {
				return foundArgs[arg.keyName];
			});

			if (_foundArgs.length) {
				console.log(`        Found Args:`);
				_foundArgs.forEach((arg) => {
					const foundArg = foundArgs[arg.keyName];
					if (foundArg)
						console.log(`          ${arg.keys[0]}=${foundArg}`);
				});
			}

			const mandatoryArgs = argsDetails.filter((arg) => {
				return arg.mandatory;
			});

			if (_foundArgs.length !== mandatoryArgs.length) {
				console.log(`\n        Missing Args:`);
				argsDetails.forEach((arg) => {
					const foundArg = foundArgs[arg.keyName];
					if (!foundArg)
						console.log(`          ${arg.keys.join("/")}=<${arg.name}>`);
				});

				process.exit(1);
			}

			argsDetails.filter((arg) => {
				return !arg.mandatory && foundArgs[arg.keyName] === undefined;
			}).forEach((arg) => {
				foundArgs[arg.keyName] = null;
			});
			console.log();
		},
		getParams: () => {
			return extractedParams;
		}
	};
	return toRet;
};