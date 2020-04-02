jQuery.sap.require('sap.apf.ui.representations.utils.displayOptionHandler');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
(function() {
	"use strict";
	var oDisplayOptionHandler,
		oMetadata,
		oRepresentationHelper,
		aDataResponse;
	function _getsampleMetadata() {
		return {
			getPropertyMetadata : oRepresentationHelper.setPropertyMetadataStub.call()
		};
	}
	function _getFieldDesc(key) {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : key
		};
	}
	QUnit.module("Display option handler", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				oRepresentationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				aDataResponse = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				oMetadata = _getsampleMetadata();
				oDisplayOptionHandler = new sap.apf.ui.representations.utils.DisplayOptionHandler();
				done();
			});
		},
		afterEach: function(){
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When property has key as display option", function(assert) {
		var sExpectedColumnName = "formatted_CompanyCodeCountry";
		var sGeneratedColumnName = oDisplayOptionHandler.getColumnNameBasedOnDisplayOption("CompanyCodeCountry", "key", oMetadata);
		assert.strictEqual(sGeneratedColumnName, sExpectedColumnName, "then correct column name is generated for display option key");
	});
	QUnit.test("When property has text as display option", function(assert) {
		var sExpectedColumnName = "CompanyCodeCountryName";
		var sGeneratedColumnName = oDisplayOptionHandler.getColumnNameBasedOnDisplayOption("CompanyCodeCountry", "text", oMetadata);
		assert.strictEqual(sGeneratedColumnName, sExpectedColumnName, "then correct column name is generated for display option text");
	});
	QUnit.test("When property has key and text as display option", function(assert) {
		var sExpectedColumnName = "CompanyCodeCountry_CompanyCodeCountryName";
		var sGeneratedColumnName = oDisplayOptionHandler.getColumnNameBasedOnDisplayOption("CompanyCodeCountry", "keyAndText", oMetadata);
		assert.strictEqual(sGeneratedColumnName, sExpectedColumnName, "then correct column name is generated for display option key and text");
	});
	QUnit.test("When measure has a unit", function(assert) {
		var sExpectedMeasureDisplayName = "Revenue (USD)";
		var oGetTextNotHtmlEncodedStub = sinon.stub(this.oGlobalApi.oApi, "getTextNotHtmlEncoded", function(sKeyName, aText) {
			return aText[0] + " (" + aText[1] + ")";
		});
		var sGeneratedMeasureDisplayName = oDisplayOptionHandler.getDisplayNameForMeasure({
			fieldName : "Revenue"
		}, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		assert.strictEqual(sGeneratedMeasureDisplayName, sExpectedMeasureDisplayName, "then correct display name is set for the measure with unit");
		assert.strictEqual(oGetTextNotHtmlEncodedStub.calledOnce, true, "then getTextNotHtmlEncoded is called to append the unit to label for display text");
		assert.strictEqual(oGetTextNotHtmlEncodedStub.getCall(0).args[0], "displayUnit", "then key displauName is sent to set text");
		assert.deepEqual(oGetTextNotHtmlEncodedStub.getCall(0).args[1], [ "Revenue", "USD" ], "then label and unit arguments sent with key");
	});
	QUnit.test("When measure has a unit proper and data response is empty", function(assert) {
		var sExpectedMeasureDisplayName = "Revenue";
		var sGeneratedMeasureDisplayName = oDisplayOptionHandler.getDisplayNameForMeasure({
			fieldName : "Revenue"
		}, oMetadata, []);
		assert.strictEqual(sGeneratedMeasureDisplayName, sExpectedMeasureDisplayName, "then correct display name is set for the measure without unit");
	});
	QUnit.test("When getDisplayNameForDimension is called without dimension fieldDesc and has default label ", function(assert) {
		var sExpectedMeasureDisplayName = "Customer Country";
		var sGeneratedDimensionDisplayName = oDisplayOptionHandler.getDisplayNameForDimension({
			fieldName : "CustomerCountry"
		}, oMetadata, this.oGlobalApi.oApi);
		assert.strictEqual(sGeneratedDimensionDisplayName, sExpectedMeasureDisplayName, "then correct display name is set for the dimension");
	});
	QUnit.test("When getDisplayNameForDimension is called with dimension fieldDesc to set user defined label", function(assert) {
		var sExpectedMeasureDisplayName = "Customer Country Name";
		var oGetTextNotHtmlEncodedStub = sinon.stub(this.oGlobalApi.oApi, "getTextNotHtmlEncoded", function(oProperty) {
			return oProperty.key;
		});
		var sGeneratedDimensionDisplayName = oDisplayOptionHandler.getDisplayNameForDimension({
			fieldName : "CustomerCountry",
			fieldDesc : _getFieldDesc("Customer Country Name")
		}, oMetadata, this.oGlobalApi.oApi);
		assert.strictEqual(sGeneratedDimensionDisplayName, sExpectedMeasureDisplayName, "then correct display name is set for the dimension");
		assert.strictEqual(oGetTextNotHtmlEncodedStub.calledOnce, true, "then getTextNotHtmlEncoded is called to set the user defined label as display text");
		assert.strictEqual(oGetTextNotHtmlEncodedStub.calledWith(_getFieldDesc("Customer Country Name")), true, "then user defined label is set as display text");
	});
	QUnit.test("When getDisplayNameForMeasure is called with measure fieldDesc to set user defined label", function(assert) {
		var sExpectedMeasureDisplayName = "Revenue Name";
		var oGetTextNotHtmlEncodedStub = sinon.stub(this.oGlobalApi.oApi, "getTextNotHtmlEncoded", function(oProperty) {
			return oProperty.key;
		});
		var sGeneratedDimensionDisplayName = oDisplayOptionHandler.getDisplayNameForDimension({
			fieldName : "Revenue",
			fieldDesc : _getFieldDesc("Revenue Name")
		}, oMetadata, this.oGlobalApi.oApi);
		assert.strictEqual(sGeneratedDimensionDisplayName, sExpectedMeasureDisplayName, "then correct display name is set for the measure");
		assert.strictEqual(oGetTextNotHtmlEncodedStub.calledOnce, true, "then getTextNotHtmlEncoded is called to set the user defined label as display text");
		assert.strictEqual(oGetTextNotHtmlEncodedStub.calledWith(_getFieldDesc("Revenue Name")), true, "then user defined label is set as display text");
	});
})();