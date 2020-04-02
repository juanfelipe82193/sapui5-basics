/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
sap.ui.define([
	"sap/apf/testhelper/modelerUIHelper",
	"sap/apf/modeler/ui/utils/textManipulator",
	"sap/apf/modeler/ui/utils/constants"
],function(modelerUIHelper, textManipulator, constants){
	'use strict';
	/* BEGIN_COMPATIBILITY */
	modelerUIHelper = modelerUIHelper || sap.apf.testhelper.modelerUIHelper;
	/* END_COMPATIBILITY */
	var oTextReader;
	QUnit.module("Text Manipulator api's tests ", {
		beforeEach : function(assert) {
			var done = assert.async();
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oTextReader = modelerInstance.modelerCore.getText;
				done();
			});
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(textManipulator, 'then object exists');
	});
	QUnit.test('when adding prefix text and input array is empty', function(assert) {
		// arrange
		var aProperties = [];
		// act
		var aPropertiesWithPrefix = textManipulator.addPrefixText(aProperties, oTextReader);
		//assert
		assert.deepEqual(aPropertiesWithPrefix, [], "then an empty array is returned");
	});
	QUnit.test('when adding prefix text and input array is undefined', function(assert) {
		// arrange
		var aProperties;
		// act
		var aPropertiesWithPrefix = textManipulator.addPrefixText(aProperties, oTextReader);
		//assert
		assert.deepEqual(aPropertiesWithPrefix, [], "then an empty array is returned");
	});
	QUnit.test('when adding prefix text and input array is not empty', function(assert) {
		// arrange
		var aProperties = [ "property1", "property2" ];
		var expectedOutput = [ "Not Available: property1", "Not Available: property2" ];
		// act
		var aPropertiesWithPrefix = textManipulator.addPrefixText(aProperties, oTextReader);
		//assert
		assert.deepEqual(aPropertiesWithPrefix, expectedOutput, "then an array with prefixed text 'Not Availble:' is returned");
	});
	QUnit.test('when removing prefix text and input property is empty', function(assert) {
		// arrange
		var sProperty = "";
		// act
		var sPropertyWithoutPrefix = textManipulator.removePrefixText(sProperty, oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
		//assert
		assert.strictEqual(sPropertyWithoutPrefix, "", "then empty property is returned");
	});
	QUnit.test('when removing prefix text and input property is prefixed with "Not Availanble:" empty', function(assert) {
		// arrange
		var sProperty = "Not Available: property1";
		// act
		var sPropertyWithoutPrefix = textManipulator.removePrefixText(sProperty, oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
		//assert
		assert.strictEqual(sPropertyWithoutPrefix, "property1", "then empty property is returned");
	});
	QUnit.test('when removing prefix text and input property is not empty', function(assert) {
		// arrange
		var sProperty = "property1";
		// act
		var sPropertyWithoutPrefix = textManipulator.removePrefixText(sProperty, oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
		//assert
		assert.strictEqual(sPropertyWithoutPrefix, "property1", "then empty property is returned");
	});
	QUnit.test('when removing prefix text and input property is prefixed with "Not Available:" ', function(assert) {
		// arrange
		var sProperty = "Not Available: property1";
		// act
		var sPropertyWithoutPrefix = textManipulator.removePrefixText(sProperty, oTextReader(sap.apf.modeler.ui.utils.CONSTANTS.texts.NOTAVAILABLE));
		//assert
		assert.strictEqual(sPropertyWithoutPrefix, "property1", "then empty property is returned");
	});
});