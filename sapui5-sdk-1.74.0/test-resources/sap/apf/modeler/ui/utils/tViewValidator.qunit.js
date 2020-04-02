/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.modeler.ui.utils.viewValidator');
jQuery.sap.declare('sap.apf.modeler.ui.utils.tViewValidator');
(function() {
	'use strict';
	var sampleViewXML = '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:core="sap.ui.core" visible="true" xmlns="sap.m">' + '<Input xmlns="sap.m" id="idInput"/>' + '<ComboBox xmlns="sap.m" id="idComboBox" items="{/Objects}">'
			+ '<core:Item key="{key}" text="{name}" />' + '</ComboBox>' + '<MultiComboBox xmlns="sap.m" id="idMultiComboBox" items="{/Objects}">' + '<core:Item key="{key}" text="{name}" />' + '</MultiComboBox>'
			+ '<Select xmlns="sap.m" id="idSelect" items="{/Objects}">' + '<core:Item key="{key}" text="{name}" />' + '</Select>' + '<MultiInput xmlns="sap.m" id="idMultiInput">' + '</MultiInput>' + '</mvc:View>';
	var oViewValidator;
	QUnit.module("Validator apis ", {
		beforeEach : function(assert) {
			var oSampleView = new sap.ui.xmlview({
				viewContent : sampleViewXML
			});
			var oModel = new sap.ui.model.json.JSONModel({
				"Objects" : [ {
					"key" : "1",
					"name" : "1"
				}, {
					"key" : "2",
					"name" : "2"
				}, {
					"key" : "3",
					"name" : "3"
				} ]
			});
			var oToken = new sap.m.Token({
				text : "token1"
			});
			oSampleView.byId("idInput").setValue("Test");
			oSampleView.byId("idComboBox").setModel(oModel);
			oSampleView.byId("idComboBox").setValue("1");
			oSampleView.byId("idMultiComboBox").setModel(oModel);
			oSampleView.byId("idMultiComboBox").setSelectedKeys([ "1", "3" ]);
			oSampleView.byId("idSelect").setModel(oModel);
			oSampleView.byId("idComboBox").setSelectedKey("1");
			oSampleView.byId("idMultiInput").addToken(oToken);
			oViewValidator = new sap.apf.modeler.ui.utils.ViewValidator(oSampleView);
		},
		afterEach : function() {
			oViewValidator.clearFields();
			oViewValidator.getView().destroy();
		}
	});
	QUnit.test('When initialization', function(assert) {
		assert.ok(oViewValidator, 'then object exists');
	});
	QUnit.test('When null or undefined array of ids are passed', function(assert) {
		// arrange
		var input;
		// act
		oViewValidator.addFields(input);
		var output = oViewValidator.getFields();
		// assert
		assert.strictEqual(output.length, 0, " then oViewValidator has no ids to work with");
	});
	QUnit.test('When null or undefined array of ids are passed', function(assert) {
		// arrange
		var input = null;
		// act
		oViewValidator.addFields(input);
		var output = oViewValidator.getFields();
		// assert
		assert.strictEqual(output.length, 0, " then oViewValidator has no ids to work with");
	});
	QUnit.test('When array ids are passed for addition', function(assert) {
		// arrange
		var input = [ "idInput", "idComboBox", "idMultiComboBox" ];
		// act
		oViewValidator.addFields(input);
		var output = oViewValidator.getFields();
		// assert
		assert.deepEqual(output, input, " then oViewValidator has correct ids to work with");
	});
	QUnit.test('When duplicate array of ids are passed for addition', function(assert) {
		// arrange
		var input = [ "idInput", "idInput", "idComboBox", "idMultiComboBox" ];
		// act
		oViewValidator.addFields(input);
		var output = oViewValidator.getFields();
		var expectedOutput = [ "idInput", "idComboBox", "idMultiComboBox" ];
		// assert
		assert.deepEqual(output, expectedOutput, " then oViewValidator has correct ids to work with");
		assert.notDeepEqual(output, input, " then oViewValidator removed duplicate ids");
		assert.strictEqual(output.length, 3, " then oViewValidator has 3 precise ids to work with");
	});
	QUnit.test('When non-string values are passed as ids for addition', function(assert) {
		// arrange
		var input = [ "idInput", 1, "idComboBox", "idMultiComboBox" ];
		// act
		oViewValidator.addFields(input);
		// assert
		assert.deepEqual(oViewValidator.getFields(), [ "idInput", "idComboBox", "idMultiComboBox" ], "then validator object only accepts string ids for addition after checking for type");
	});
	QUnit.test('When some null values are passed as ids for addition', function(assert) {
		// arrange
		var input = [ "idInput", null, "idComboBox", "idMultiComboBox" ];
		// act
		oViewValidator.addFields(input);
		// assert
		assert.deepEqual(oViewValidator.getFields(), [ "idInput", "idComboBox", "idMultiComboBox" ], "then validator object only accepts string ids for addition after checking for type");
	});
	QUnit.test('When array ids are passed for removal', function(assert) {
		// arrange
		var input = [ "idInput", "idComboBox", "idMultiComboBox" ];
		oViewValidator.addFields(input);
		// act
		oViewValidator.removeFields([ "idInput" ]);
		var output = oViewValidator.getFields();
		var expectedOutput = [ "idComboBox", "idMultiComboBox" ];
		// assert
		assert.deepEqual(output, expectedOutput, " then oViewValidator has correct ids to work with");
		assert.strictEqual(output.length, 2, " then oViewValidator has successfully removed an id");
		assert.notDeepEqual(output, input, " then oViewValidator removed correct ids");
	});
	QUnit.test('When invalid array ids are passed for removal', function(assert) {
		// arrange
		var input = [ "idInput", "idComboBox", "idMultiComboBox" ];
		oViewValidator.addFields(input);
		// act
		oViewValidator.removeFields([ "idSelect" ]);
		var output = oViewValidator.getFields();
		var expectedOutput = [ "idInput", "idComboBox", "idMultiComboBox" ];
		// assert
		assert.deepEqual(output, expectedOutput, " then oViewValidator has correct ids to work with");
		assert.strictEqual(output.length, 3, " then oViewValidator has successfully not removed any id");
		assert.deepEqual(output, input, " then oViewValidator removed no id");
	});
	QUnit.test('When empty array is tried for removal', function(assert) {
		// arrange
		oViewValidator.addFields([]);
		// act
		oViewValidator.removeFields([ "idSelect" ]);
		var output = oViewValidator.getFields();
		var expectedOutput = [];
		// assert
		assert.deepEqual(output, expectedOutput, " then oViewValidator has an empty array of ids");
	});
	QUnit.test('When duplicate array of ids are passed for removal', function(assert) {
		// arrange
		var input = [ "idInput", "idComboBox", "idMultiComboBox" ];
		oViewValidator.addFields(input);
		// act
		oViewValidator.removeFields([ "idInput", "idInput" ]);
		var output = oViewValidator.getFields();
		var expectedOutput = [ "idComboBox", "idMultiComboBox" ];
		// assert
		assert.deepEqual(output, expectedOutput, " then oViewValidator has correct ids to work with");
		assert.strictEqual(output.length, 2, " then oViewValidator has successfully removed an id");
		assert.notDeepEqual(output, input, " then oViewValidator removed correct ids");
	});
	QUnit.test('When non-string values are passed as ids for removal', function(assert) {
		// arrange
		var input = [ "idInput", "idComboBox", "idMultiComboBox" ];
		oViewValidator.addFields(input);
		// act
		oViewValidator.removeFields([ "idInput", 1 ]);
		// assert
		assert.deepEqual(oViewValidator.getFields(), [ "idComboBox", "idMultiComboBox" ], " then validator object only accepts string ids for removal after checking for type");
	});
	QUnit.test('When some null values are passed as ids for removal', function(assert) {
		// arrange
		var input = [ "idInput", "idComboBox", "idMultiComboBox" ];
		oViewValidator.addFields(input);
		// act
		oViewValidator.removeFields([ "idInput", null ]);
		//assert
		assert.deepEqual(oViewValidator.getFields(), [ "idComboBox", "idMultiComboBox" ], "then validator object only accepts string ids for removal after checking for type");
	});
	QUnit.test('When remove fields is called with empty array', function(assert) {
		// arrange
		var input = [ "idInput", "idComboBox", "idMultiComboBox" ];
		oViewValidator.addFields(input);
		// act
		oViewValidator.removeFields([]);
		//assert
		assert.deepEqual(oViewValidator.getFields(), [ "idInput", "idComboBox", "idMultiComboBox" ], "then validator object does not remove any ids as an empty array was passed");
	});
	QUnit.test('When array is cleared', function(assert) {
		// arrange
		var input = [ "idInput", "idComboBox", "idMultiComboBox" ];
		oViewValidator.addFields(input);
		// act
		oViewValidator.clearFields();
		var output = oViewValidator.getFields();
		var expectedOutput = [];
		// assert
		assert.deepEqual(output, expectedOutput, " then oViewValidator has no ids to work with");
		assert.strictEqual(output.length, 0, " then oViewValidator has successfully removed all ids");
	});
	QUnit.test('When an empty array is cleared', function(assert) {
		// arrange
		oViewValidator.addFields([]);
		// act
		oViewValidator.clearFields();
		var output = oViewValidator.getFields();
		var expectedOutput = [];
		// assert
		assert.deepEqual(output, expectedOutput, " then oViewValidator has no ids to work with");
		assert.strictEqual(output.length, 0, " then oViewValidator has successfully removed all ids");
	});
	QUnit.test("When a null value is tried for addition", function(assert) {
		// arrange
		oViewValidator.addField(null);
		// assert
		assert.deepEqual(oViewValidator.getFields(), [], "then oViewValidator does not accept null value");
	});
	QUnit.test("When a non-string value is tried for addition", function(assert) {
		// arrange
		oViewValidator.addField(1);
		// assert
		assert.deepEqual(oViewValidator.getFields(), [], "then oViewValidator does not accept non-string value");
	});
	QUnit.test("When a string value is tried for addition", function(assert) {
		// arrange
		oViewValidator.addField("idInput");
		// assert
		assert.deepEqual(oViewValidator.getFields(), [ "idInput" ], "then oViewValidator accepts string value");
	});
	QUnit.test("When a control id not part of View is tried for addition", function(assert) {
		// arrange
		oViewValidator.addField("idCheck");
		// assert
		assert.deepEqual(oViewValidator.getFields(), [], "then oViewValidator accepts only controls part of view");
	});
	QUnit.test("When a null value is tried for removal", function(assert) {
		// arrange
		oViewValidator.addField("idInput");
		// act
		oViewValidator.removeField(null);
		// assert
		assert.deepEqual(oViewValidator.getFields(), [ "idInput" ], "then oViewValidator does not remove null value");
	});
	QUnit.test("When a non string value is tried for removal", function(assert) {
		// arrange
		oViewValidator.addField("idInput");
		// act
		oViewValidator.removeField("idSelect");
		// assert
		assert.deepEqual(oViewValidator.getFields(), [ "idInput" ], "then oViewValidator does not remove non string value");
	});
	QUnit.test("When a string value is tried for removal", function(assert) {
		// arrange
		oViewValidator.addField("idInput");
		// act
		oViewValidator.removeField("idInput");
		// assert
		assert.deepEqual(oViewValidator.getFields(), [], "then oViewValidator removes string value");
	});
	QUnit.test("A value is tried for removal when view validator has no ids", function(assert) {
		// act
		oViewValidator.removeField("idInput");
		// assert
		assert.deepEqual(oViewValidator.getFields(), [], "then oViewValidator does not remove value");
	});
	QUnit.test('Get validation state when view is valid', function(assert) {
		oViewValidator.addField([ "idInput", "idComboBox", "idMultiComboBox", "idSelect" ]);
		assert.strictEqual(oViewValidator.getValidationState(), true, "then true is returned");
	});
	QUnit.test('Get validation state when view is not valid for input', function(assert) {
		//arrangement
		oViewValidator.addFields([ "idInput", "idComboBox", "idMultiComboBox", "idSelect" ]);
		oViewValidator.getView().byId("idInput").setValue("");
		//assert
		assert.strictEqual(oViewValidator.getValidationState(), false, "then false is returned");
	});
	QUnit.test('Get validation state when view is not valid for combo box', function(assert) {
		//arrangement
		oViewValidator.addFields([ "idInput", "idComboBox", "idMultiComboBox", "idSelect" ]);
		oViewValidator.getView().byId("idComboBox").setValue("");
		//assert
		assert.strictEqual(oViewValidator.getValidationState(), false, "then false is returned");
	});
	QUnit.test('Get validation state when view is not valid for multi combo box', function(assert) {
		//arrangement
		oViewValidator.addFields([ "idInput", "idComboBox", "idMultiComboBox", "idSelect" ]);
		oViewValidator.getView().byId("idMultiComboBox").setSelectedKeys([]);
		//assert
		assert.strictEqual(oViewValidator.getValidationState(), false, "then false is returned");
	});
	QUnit.test('Get validation state when view is not valid for select', function(assert) {
		//arrangement
		oViewValidator.addFields([ "idInput", "idComboBox", "idMultiComboBox", "idSelect" ]);
		oViewValidator.getView().byId("idSelect").clearSelection();
		//assert
		assert.strictEqual(oViewValidator.getValidationState(), false, "then false is returned");
	});
	QUnit.test('Get validation state when view is not valid for MultiInput', function(assert) {
		//arrangement
		oViewValidator.addFields([ "idMultiInput", "idComboBox", "idMultiComboBox", "idSelect" ]);
		oViewValidator.getView().byId("idMultiInput").setTokens([]);
		//assert
		assert.strictEqual(oViewValidator.getValidationState(), false, "then false is returned");
	});
	QUnit.test('When new oViewValidator is created', function(assert) {
		// arrange
		var oViewValidator2;
		var oSampleView2 = new sap.ui.xmlview({
			viewContent : sampleViewXML
		});
		oViewValidator2 = new sap.apf.modeler.ui.utils.ViewValidator(oSampleView2);
		assert.notEqual(oViewValidator, oViewValidator2, " then new oViewValidator object is different");
		// arrange
		var input = [ "idInput", "idComboBox" ];
		// act
		oViewValidator.addFields(input);
		var output = oViewValidator.getFields();
		// assert
		assert.deepEqual(output, input, " then oViewValidator has correct ids to work with");
		var input2 = [ "idMultiComboBox", "idSelect" ];
		// act
		oViewValidator2.addFields(input2);
		var output2 = oViewValidator2.getFields();
		// assert
		assert.deepEqual(output2, input2, " then second oViewValidator has correct ids to work with");
		// cleanup
		oViewValidator2.clearFields();
		oViewValidator2.getView().destroy();
	});
})();
