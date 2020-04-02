sap.ui.define(["./../apps/index"], function(Tests) {
	"use strict";

	function _getAllTests() {
		return Tests.oTestList;
	}

	function _getTestsByGroupName(aSelectedGroupNames, exclude) {
		var oTestSuite = {};
		var oMasterTests = _getAllTests();
		if (!aSelectedGroupNames || aSelectedGroupNames.length === 0) {
			return [];
		}
		aSelectedGroupNames.forEach(function(selectedGroupName) {
			for (var selectedTestName in oMasterTests) {
				var selectedTest = oMasterTests[selectedTestName];
				if (exclude && !(selectedTest.group && selectedTest.group.indexOf(selectedGroupName) !== -1)) {
					oTestSuite[selectedTestName] = oMasterTests[selectedTestName];
				} else if (!exclude && selectedTest.group && selectedTest.group.indexOf(selectedGroupName) !== -1) {
					oTestSuite[selectedTestName] = oMasterTests[selectedTestName];
				}
			}
		});

		// If no testGroups test find, run all the testCase
		if (!Object.keys(oTestSuite).length) {
			oTestSuite = oMasterTests;
		}
		return oTestSuite;
	}

	function _getSelectedTests(aSelectedTests) {
		var oTestSuite = {};
		if (!aSelectedTests || aSelectedTests.length === 0) {
			return [];
		}
		aSelectedTests.forEach(function(selectedTest) {
			oTestSuite[selectedTest] = _getAllTests()[selectedTest];
		});
		return oTestSuite;
	}

	function _createTestSuite(selectedTestGroupConstants, selectedTests, excludedRunTestGroups, oTestSuite) {
		if (!oTestSuite && !selectedTestGroupConstants) {
			oTestSuite = _getAllTests();
		}
		if (
			(!selectedTestGroupConstants || selectedTestGroupConstants.length === 0) &&
			(!selectedTests || selectedTests.length === 0) &&
			(!excludedRunTestGroups || excludedRunTestGroups.length === 0)
		) {
			return oTestSuite;
		}
		if (selectedTestGroupConstants && !(selectedTestGroupConstants instanceof Array)) {
			return _getTestsByGroupName(selectedTestGroupConstants.split(","));
		}
		if (selectedTests && !(selectedTests instanceof Array)) {
			return _getSelectedTests(selectedTests.split(","));
		}
		if (excludedRunTestGroups && !(excludedRunTestGroups instanceof Array)) {
			return _getTestsByGroupName(excludedRunTestGroups.split(","), true);
		}
		return _getSelectedTests(selectedTests);
	}

	return {
		createTestSuite: _createTestSuite
	};
});
