const fs = require("fs"),
	getAppControllerTemplate = require("./templates/app-controller-bcp"),
	getAppViewTemplate = require("./templates/vb-app-view-bcp"),
	getComponentTemplate = require("./templates/component-bcp"),
	getManifestTemplate = require("./templates/manifest-bcp");



let myArgs = process.argv.slice(2),
	testId = myArgs[0],
	testStructure = JSON.parse(fs.readFileSync("./test_structure_bcp.json", "utf8") || "[]");



// We check if we already have a test with that id. If we do, we don't generate another one.
if (testStructure.filter(test => test.number === testId).length === 0) {
	// create the test directories
	fs.mkdirSync(`./bcp_tests/${testId}`);
	fs.mkdirSync(`./bcp_tests/${testId}/controller`);
	fs.mkdirSync(`./bcp_tests/${testId}/view`);

	// create the test files (controller, view, component, manifest)
	fs.writeFileSync(`./bcp_tests/${testId}/controller/App.controller.js`, getAppControllerTemplate(testId, "vbm"));
	fs.writeFileSync(`./bcp_tests/${testId}/view/App.view.xml`, getAppViewTemplate(testId));
	fs.writeFileSync(`./bcp_tests/${testId}/Component.js`, getComponentTemplate(testId, "vbm"));
	fs.writeFileSync(`./bcp_tests/${testId}/manifest.json`, getManifestTemplate(testId, "vbm"));

	// create the new test item entry for the test_structure_bcp.json file
	testStructure.push({
		number: testId,
		name: "",
		description: "",
		componentName: `vbm-regression.bcp_tests.${testId}`
	});

	// update test_structure_bcp.json
	fs.writeFileSync('./test_structure_bcp.json', JSON.stringify(testStructure, null, '\t'));

} else {
	console.log(`A test with the id: ${testId} already exists. Please choose a different id.`);
}
