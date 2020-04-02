jQuery.sap.require('sap.apf.modeler.ui.utils.treeTableDisplayOptionsValueBuilder');
jQuery.sap.require('sap.apf.modeler.ui.utils.optionsValueModelBuilder');
jQuery.sap.declare('sap.apf.modeler.ui.utils.tTreeTableDisplayOptionsValuebuilder');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var treeTableDisplayOptionsValueBuilder, oTextReader;
	var optionsValueModelBuilder = sap.apf.modeler.ui.utils.optionsValueModelBuilder;
	QUnit.module("tests for treeTableDisplayOptionsValueBuilder apis ", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				oTextReader = oModelerInstance.modelerCore.getText;
				treeTableDisplayOptionsValueBuilder = new sap.apf.modeler.ui.utils.TreeTableDisplayOptionsValueBuilder(oTextReader, optionsValueModelBuilder);
				done();
			});
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(treeTableDisplayOptionsValueBuilder, 'then treetableDisplayOptionsValueBuilder object exists');
	});
	QUnit.test('when testing label option type', function(assert) {
		// act
		var aLabelOptionTypes = treeTableDisplayOptionsValueBuilder.getLabelDisplayOptions();
		var expectedOutput = {
			Objects : [ {
				key : "key",
				name : oTextReader("key")
			}, {
				key : "text",
				name : oTextReader("text")
			} ]
		};
		// assert
		assert.deepEqual(aLabelOptionTypes.getData(), expectedOutput, " then model with correct values is returned");
	});
	QUnit.test('when validating label display option type when a text property is removed from step level', function(assert) {
		// act
		var oTextManipulator = sap.apf.modeler.ui.utils.textManipulator;
		var aLabelOptionTypes = treeTableDisplayOptionsValueBuilder.getValidatedLabelDisplayOptions();
		var expectedOutput = {
			Objects : [ {
				key : "key",
				name : oTextReader("key")
			}, {
				key : oTextManipulator.addPrefixText([ "text" ], oTextReader)[0],
				name : oTextManipulator.addPrefixText([ " " + oTextReader("text") ], oTextReader)[0]
			} ]
		};
		// assert
		assert.deepEqual(aLabelOptionTypes.getData(), expectedOutput, "then model with correct values is returned");
	});
})();