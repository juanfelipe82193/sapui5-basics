jQuery.sap.require('sap.apf.ui.representations.utils.paginationDisplayOptionHandler');
jQuery.sap.require('sap.apf.ui.utils.formatter');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
(function() {
	"use strict";
	var oPaginationDisplayOptionHandler,
		oMetadata,
		oRepresentationHelper,
		aDataResponse,
		oGlobalApi,
		oFormatter;
	function _getsampleMetadata() {
		return {
			getPropertyMetadata : oRepresentationHelper.setPropertyMetadataStub.call()
		};
	}
	function _createAndCheckLookupForFilters(assert, aDataResponse, oPaginationDisplayOptionHandler) {
		var oExpectedKeyTextLookup = {
			"AR" : "Argentina",
			"AT" : "Austria"
		};
		var aSampleDataForLookup = aDataResponse.slice(7, 9);
		aSampleDataForLookup.forEach(function(dataRow) {
			oPaginationDisplayOptionHandler.createDisplayValueLookupForPaginatedFilter(dataRow["CompanyCodeCountry"], dataRow["CompanyCodeCountryName"]);
		});
		assert.deepEqual(oPaginationDisplayOptionHandler.oKeyTextForProperties, oExpectedKeyTextLookup, "then correct lookup for filter key-value pair is created");
	}
	QUnit.module("Pagination Display option handler", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				oRepresentationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				oMetadata = _getsampleMetadata();
				aDataResponse = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				oFormatter = new sap.apf.ui.utils.formatter({
					getEventCallback : that.oGlobalApi.oApi.getEventCallback.bind(that.oGlobalApi.oApi),
					getTextNotHtmlEncoded : that.oGlobalApi.oApi.getTextNotHtmlEncoded,
					getExits : that.oGlobalApi.oUiApi.getCustomFormatExit()
				}, oMetadata, aDataResponse);
				oPaginationDisplayOptionHandler = new sap.apf.ui.representations.utils.PaginationDisplayOptionHandler();
				done();
			});
		},
		afterEach: function(){
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When initializing pagination display option handler", function(assert) {
		assert.notEqual(oPaginationDisplayOptionHandler, undefined, "then instance of chart dataset helper is created");
		assert.deepEqual(oPaginationDisplayOptionHandler.oKeyTextForProperties, {}, "then lookup for filter key-value pair is created");
	});
	QUnit.test("When createDisplayValueLookupForPaginatedFilter is called for a property", function(assert) {
		_createAndCheckLookupForFilters(assert, aDataResponse, oPaginationDisplayOptionHandler);
	});
	QUnit.test("When getDisplayNameForPaginatedFilter is called and display option is text for required filter", function(assert) {
		var oRequiredFilteroptions = {
			"labelDisplayOption" : "text"
		};
		var metadata = {
				getPropertyMetadata : function() {
					return { type : "Edm.String" };
				}
		};
		_createAndCheckLookupForFilters(assert, aDataResponse, oPaginationDisplayOptionHandler);
		var sSelectionDisplayTextForAT = oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter("AT", oRequiredFilteroptions, "CompanyCodeCountry", oFormatter, metadata);
		assert.strictEqual(sSelectionDisplayTextForAT, "Austria", "then correct display text is returned");
		var sSelectionDisplayTextForAR = oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter("AR", oRequiredFilteroptions, "CompanyCodeCountry", oFormatter, metadata);
		assert.strictEqual(sSelectionDisplayTextForAR, "Argentina", "then correct display text is returned");
	});
	QUnit.test("When getDisplayNameForPaginatedFilter is called and NO display option for required filter", function(assert) {
		var oRequiredFilteroptions = {};
		var metadata = {
				getPropertyMetadata : function(name) {
					assert.equal(name, "CompanyCodeCountry", "required filter property is used");
					return { type : "Edm.String" };
				}
		};
		var spy = sinon.spy(sap.apf.utils, "convertToExternalFormat");
		_createAndCheckLookupForFilters(assert, aDataResponse, oPaginationDisplayOptionHandler);
		var sSelectionDisplayTextForAT = oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter("AT", oRequiredFilteroptions, "CompanyCodeCountry", oFormatter, metadata);
		assert.strictEqual(sSelectionDisplayTextForAT, "AT", "then correct display key is returned");
		var sSelectionDisplayTextForAR = oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter("AR", oRequiredFilteroptions, "CompanyCodeCountry", oFormatter, metadata);
		assert.strictEqual(sSelectionDisplayTextForAR, "AR", "then correct display key is returned");
		assert.equal(spy.args[0][0], "AT", "THEN converter has been called first with key");
		assert.equal(spy.args[1][0], "AR", "THEN converter has been called second with key");
		assert.ok(typeof spy.args[0][1].getAttribute === 'function', "THEN property meta data object is supplied");
		spy.restore();
	});
	QUnit.test("When getDisplayNameForPaginatedFilter is called and display option is key for required filter", function(assert) {
		var oRequiredFilteroptions = {
			"labelDisplayOption" : "key"
		};
		var metadata = {
				getPropertyMetadata : function(name) {
					assert.equal(name, "CompanyCodeCountry", "required filter property is used");
					return { type : "Edm.String" };
				}
		};
		var spy = sinon.spy(sap.apf.utils, "convertToExternalFormat");
		_createAndCheckLookupForFilters(assert, aDataResponse, oPaginationDisplayOptionHandler);
		var sSelectionDisplayTextForAT = oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter("AT", oRequiredFilteroptions, "CompanyCodeCountry", oFormatter, metadata);
		assert.strictEqual(sSelectionDisplayTextForAT, "AT", "then correct display key is returned");
		var sSelectionDisplayTextForAR = oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter("AR", oRequiredFilteroptions, "CompanyCodeCountry", oFormatter, metadata);
		assert.strictEqual(sSelectionDisplayTextForAR, "AR", "then correct display key is returned");
		assert.equal(spy.args[0][0], "AT", "THEN converter has been called first with key");
		assert.equal(spy.args[1][0], "AR", "THEN converter has been called second with key");
		assert.ok(typeof spy.args[0][1].getAttribute === 'function', "THEN property meta data object is supplied");
		spy.restore();
	});
	QUnit.test("When getDisplayNameForPaginatedFilter is called and display option is keyAndtext for required filter", function(assert) {
		var oRequiredFilteroptions = {
			"labelDisplayOption" : "keyAndText"
		};
		var metadata = {
				getPropertyMetadata : function() {
					return { type : "Edm.String" };
				}
		};
		_createAndCheckLookupForFilters(assert, aDataResponse, oPaginationDisplayOptionHandler);
		var sSelectionDisplayTextForAT = oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter("AT", oRequiredFilteroptions, "CompanyCodeCountry", oFormatter, metadata);
		assert.strictEqual(sSelectionDisplayTextForAT, "Austria (AT)", "then correct display key and text is returned");
		var sSelectionDisplayTextForAR = oPaginationDisplayOptionHandler.getDisplayNameForPaginatedFilter("AR", oRequiredFilteroptions, "CompanyCodeCountry", oFormatter, metadata);
		assert.strictEqual(sSelectionDisplayTextForAR, "Argentina (AR)", "then correct display key and text is returned");
	});
	QUnit.module("Display for key property is different from filter property (treeTable)", {
		beforeEach : function(assert) {
			this.paginationDisplayHandler = new sap.apf.ui.representations.utils.PaginationDisplayOptionHandler();
			this.paginationDisplayHandler.createDisplayValueLookupForPaginatedFilter("KeyFilterValue1", "KeyTextValue1", "KeyDisplayValue1");
			this.paginationDisplayHandler.createDisplayValueLookupForPaginatedFilter("KeyFilterValue2", "KeyTextValue2", "");
			this.paginationDisplayHandler.createDisplayValueLookupForPaginatedFilter("KeyFilterValue3", "", "KeyDisplayValue3");
			this.formatter = {
				getFormattedValueForTextProperty : function(sFilterProperty, oFormatterArgs){
					return oFormatterArgs.text + "(" + oFormatterArgs.key + ")";
				}
			};
			this.metadata = {
				getPropertyMetadata : function(){
					return "propertyMetadata";
				}
			};
			this.convertToExternalFormatStub = sinon.stub(sap.apf.utils, "convertToExternalFormat", function(sSelectionDisplayText, propertyMetadataInstance){
				assert.strictEqual(propertyMetadataInstance.test, "MetadataPropertyInstance", "PropertyMetadataInstance correctly handed over to convertToExternalFormatStub");
				return "convertedToExternalFormat : " + sSelectionDisplayText;
			});
			this.propertyMetadataStub = sinon.stub(sap.apf.core, "MetadataProperty", function(propertyMetadata){
				assert.strictEqual(propertyMetadata, "propertyMetadata", "PropertyMetadata correctly handed over to MetadataPropertyClass");
				this.test = "MetadataPropertyInstance";
			});
		},
		afterEach : function(){
			this.convertToExternalFormatStub.restore();
			this.propertyMetadataStub.restore();
		}
	});
	QUnit.test("When no display option", function(assert) {
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("KeyFilterValue1", undefined, "FilterProperty", this.formatter, this.metadata), "convertedToExternalFormat : KeyDisplayValue1", "Value from display property returned");
	});
	QUnit.test("When no display option and value was not registered ", function(assert) {
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("anotherKeyValue", undefined, "FilterProperty", this.formatter, this.metadata), "convertedToExternalFormat : anotherKeyValue", "Key value returned");
	});
	QUnit.test("When key display option", function(assert) {
		var displayOption = {labelDisplayOption : "key"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("KeyFilterValue1", displayOption, "FilterProperty", this.formatter, this.metadata), "convertedToExternalFormat : KeyDisplayValue1", "Value from display property returned");
	});
	QUnit.test("When key display option and value was not registered ", function(assert) {
		var displayOption = {labelDisplayOption : "key"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("anotherKeyValue", displayOption, "FilterProperty", this.formatter, this.metadata), "convertedToExternalFormat : anotherKeyValue", "Key value returned");
	});
	QUnit.test("When text display option", function(assert) {
		var displayOption = {labelDisplayOption : "text"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("KeyFilterValue1", displayOption, "FilterProperty", this.formatter, this.metadata), "KeyTextValue1", "Text value returned");
	});
	QUnit.test("When text display option and text value was not registered", function(assert) {
		var displayOption = {labelDisplayOption : "text"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("KeyFilterValue3", displayOption, "FilterProperty", this.formatter, this.metadata), "convertedToExternalFormat : KeyDisplayValue3", "Display value returned");
	});
	QUnit.test("When text display option and text value and display was not registered", function(assert) {
		var displayOption = {labelDisplayOption : "text"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("anotherKeyValue", displayOption, "FilterProperty", this.formatter, this.metadata), "convertedToExternalFormat : anotherKeyValue", "Key value returned");
	});
	QUnit.test("When keyAndText display option", function(assert) {
		var displayOption = {labelDisplayOption : "keyAndText"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("KeyFilterValue1", displayOption, "FilterProperty", this.formatter, this.metadata), "KeyTextValue1(convertedToExternalFormat : KeyDisplayValue1)", "Text + display value returned");
	});
	QUnit.test("When keyAndText display option and text value was not registered", function(assert) {
		var displayOption = {labelDisplayOption : "keyAndText"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("KeyFilterValue3", displayOption, "FilterProperty", this.formatter, this.metadata), "convertedToExternalFormat : KeyDisplayValue3", "Display value returned");
	});
	QUnit.test("When keyAndText display option and text value and display was not registered", function(assert) {
		var displayOption = {labelDisplayOption : "keyAndText"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("anotherKeyValue", displayOption, "FilterProperty", this.formatter, this.metadata), "convertedToExternalFormat : anotherKeyValue", "Key value returned");
	});
	QUnit.test("When keyAndText display option and display was not registered", function(assert) {
		var displayOption = {labelDisplayOption : "keyAndText"};
		assert.strictEqual(this.paginationDisplayHandler.getDisplayNameForPaginatedFilter("KeyFilterValue2", displayOption, "FilterProperty", this.formatter, this.metadata), "KeyTextValue2(convertedToExternalFormat : KeyFilterValue2)", "Text + key value returned");
	});
})();