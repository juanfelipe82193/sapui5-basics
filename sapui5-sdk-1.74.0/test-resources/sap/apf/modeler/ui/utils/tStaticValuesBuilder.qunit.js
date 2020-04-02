/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require('sap.apf.modeler.ui.utils.staticValuesBuilder');
jQuery.sap.require('sap.apf.modeler.ui.utils.optionsValueModelBuilder');
jQuery.sap.declare('sap.apf.modeler.ui.utils.tStaticValuesBuilder');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var staticValuesBuilder, oTextReader;
	var optionsValueModelBuilder = sap.apf.modeler.ui.utils.optionsValueModelBuilder;
	QUnit.module("tests for staticValuesBuilder apis ", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				oTextReader = oModelerInstance.modelerCore.getText;
				staticValuesBuilder = new sap.apf.modeler.ui.utils.StaticValuesBuilder(oTextReader, optionsValueModelBuilder);
				done();
			});
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(staticValuesBuilder, 'then staticValuesBuilder object exists');
	});
	QUnit.test('when testing nav target type data', function(assert) {
		// act
		var aNavTargetTypeData = staticValuesBuilder.getNavTargetTypeData();
		var expectedOutput = {
			Objects : [ {
				key : oTextReader("globalNavTargets"),
				name : oTextReader("globalNavTargets")
			}, {
				key : oTextReader("stepSpecific"),
				name : oTextReader("stepSpecific")
			} ]
		};
		// assert
		assert.deepEqual(aNavTargetTypeData.getData(), expectedOutput, " then model with correct values is returned");
	});
	QUnit.test('when testing sort direction data', function(assert) {
		// act
		var aSortDirectionData = staticValuesBuilder.getSortDirections();
		var expectedOutput = {
			Objects : [ {
				key : "true",
				name : oTextReader("ascending")
			}, {
				key : "false",
				name : oTextReader("descending")
			} ]
		};
		// assert
		assert.deepEqual(aSortDirectionData.getData(), expectedOutput, " then model with correct values is returned");
	});
})();