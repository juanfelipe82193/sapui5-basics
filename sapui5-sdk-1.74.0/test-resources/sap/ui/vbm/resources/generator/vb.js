const fs = require("fs"),
	getAppControllerTemplate = require("./templates/app-controller"),
	getAppViewTemplate = require("./templates/vb-app-view"),
	getComponentTemplate = require("./templates/component"),
	getManifestTemplate = require("./templates/manifest");



let myArgs = process.argv.slice(2),
	testId = myArgs[0],
	testStructure = JSON.parse(fs.readFileSync("./test_structure.json", "utf8") || "[]");



// We check if we already have a test with that id. If we do, we don't generate another one.
if (testStructure.tests.filter(test => test.number === testId).length === 0) {
	// create the test directories
	fs.mkdirSync(`./tests/${testId}`);
	fs.mkdirSync(`./tests/${testId}/controller`);
	fs.mkdirSync(`./tests/${testId}/view`);

	// create the test files (controller, view, component, manifest)
	fs.writeFileSync(`./tests/${testId}/controller/App.controller.js`, getAppControllerTemplate(testId, "vbm"));
	fs.writeFileSync(`./tests/${testId}/view/App.view.xml`, getAppViewTemplate(testId));
	fs.writeFileSync(`./tests/${testId}/Component.js`, getComponentTemplate(testId, "vbm"));
	fs.writeFileSync(`./tests/${testId}/manifest.json`, getManifestTemplate(testId, "vbm"));

	// create the new test item entry for the test_structure.json file
	testStructure.tests.push({
		number: testId,
		area: "",
		name: "",
		description: "",
		componentName: `vbm-regression.tests.${testId}`
	});

	// update test_structure.json
	fs.writeFileSync('./test_structure.json', JSON.stringify(testStructure, null, '\t'));

} else {
	console.log(`A test with the id: ${testId} already exists. Please choose a different id.`);
}
