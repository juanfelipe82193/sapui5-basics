/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.reuse.tFacetFilter');
jQuery.sap.require('sap.m.FacetFilter');
jQuery.sap.require('sap.apf.ui.utils.formatter');
(function() {
	'use strict';
	var oFacetFilterView, oCoreApi, oUiApi, getSelectedValuesStubStartDate, getSelectedValuesStubCompanyCode, getSelectedValuesStubCountry, oPromiseForStartDateValues, oPromiseForCompanyCodeValues, oPromiseForCountryValues, oNewPromiseForCountrySelectedValues, oNewPromiseForStartDateSelectedValues, oNewPromiseForCompanyCodeSelectedValues;
	function doNothing() {
		return;
	}
	//Start filter functions for start date filter
	function getLabelForStartDate() {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : "StartDate"
		};
	}
	function getPropertyNameForStartDate() {
		return "StartDate";
	}
	function getMultiSelectionForStartDate() {
		return false;
	}
	function getMetadataForStartDate() {
		var oDeferredMetadata = jQuery.Deferred();
		var oPropertyMetadata = {
			"name" : "StartDate",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "8"
			},
			"label" : "Start Date",
			"aggregation-role" : "dimension",
			"isCalendarDate" : "true"
		};
		oDeferredMetadata.resolve(oPropertyMetadata);
		return oDeferredMetadata.promise();
	}
	function getValuesForStartDate() {
		oPromiseForStartDateValues = jQuery.Deferred();
		return oPromiseForStartDateValues.promise();
	}
	//Start filter functions for country filter
	function getLabelForCountry() {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : "Country"
		};
	}
	function getPropertyNameForCountry() {
		return "Country";
	}
	function getMultiSelectionForCountry() {
		return true;
	}
	function getMetadataForCountry() {
		var oDeferredMetadata = jQuery.Deferred();
		var oPropertyMetadata = {
			"name" : "Country",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "4"
			},
			"label" : "Country",
			"aggregation-role" : "dimension",
			"text" : "CountryName"
		};
		oDeferredMetadata.resolve(oPropertyMetadata);
		return oDeferredMetadata.promise();
	}
	function getValuesForCountry() {
		oPromiseForCountryValues = jQuery.Deferred();
		return oPromiseForCountryValues.promise();
	}
	//Start filter functions for company code filter
	function getLabelForCompanyCode() {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : "CompanyCode"
		};
	}
	function getPropertyNameForCompanyCode() {
		return "CompanyCode";
	}
	function getMultiSelectionForCompanyCode() {
		return true;
	}
	function getMetadataForCompanyCode() {
		var oDeferredMetadata = jQuery.Deferred();
		var oPropertyMetadata = {
			"name" : "CompanyCode",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "4"
			},
			"label" : "Company Code",
			"aggregation-role" : "dimension",
			"text" : "CompanyCodeName"
		};
		oDeferredMetadata.resolve(oPropertyMetadata);
		return oDeferredMetadata.promise();
	}
	function getValuesForCompanyCode() {
		oPromiseForCompanyCodeValues = jQuery.Deferred();
		return oPromiseForCompanyCodeValues.promise();
	}
	//Stub for formatter
	function formatterDouble() {
		var getFormattedValueStub = sinon.stub();
		var oFormatterStub = {
			getFormattedValue : getFormattedValueStub
		};
		//Different formatted values returned based on the arguments passed
		getFormattedValueStub.withArgs("StartDate", new Date(2017, 1, 1)).returns("1/1/2017");
		getFormattedValueStub.withArgs("StartDate", new Date(2016, 1, 1)).returns("1/1/2016");
		getFormattedValueStub.withArgs("StartDate", "20000101").returns("1/1/2000");
		getFormattedValueStub.withArgs("StartDate", "20000201").returns("2/1/2000");
		getFormattedValueStub.withArgs("StartDate", "").returns("");
		getFormattedValueStub.withArgs("CompanyCode", "0001").returns("0001");
		getFormattedValueStub.withArgs("CompanyCode", "0002").returns("0002");
		getFormattedValueStub.withArgs("CompanyCode", "0003").returns("0003");
		getFormattedValueStub.withArgs("CompanyCode", "0004").returns("0004");
		getFormattedValueStub.withArgs("CompanyCode", "0005").returns("0005");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP AG").returns("SAP AG");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP SE").returns("SAP SE");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP").returns("SAP");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP IN").returns("SAP IN");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP DE").returns("SAP DE");
		getFormattedValueStub.withArgs("Country", "BR").returns("BR");
		getFormattedValueStub.withArgs("Country", "AR").returns("AR");
		getFormattedValueStub.withArgs("CountryName", "Brazil").returns("Brazil");
		getFormattedValueStub.withArgs("CountryName", "Argentina").returns("Argentina");
		return oFormatterStub;
	}
	function resolveInitialValueHelps() {
		if(oPromiseForStartDateValues){
			oPromiseForStartDateValues.resolve([ {
				"StartDate" : "20000101"
			}, {
				"StartDate" : "20000201"
			}, {
				"StartDate" : ""
			} ]);
		}
		if(oPromiseForCountryValues){
			oPromiseForCountryValues.resolve([ {
				"Country" : "AR",
				"CountryName" : "Argentina"
			}, {
				"Country" : "BR",
				"CountryName" : "Brazil"
			} ]);
		}
		if(oPromiseForCompanyCodeValues){
			oPromiseForCompanyCodeValues.resolve([ {
				"CompanyCode" : "0001",
				"CompanyCodeName" : "SAP AG"
			}, {
				"CompanyCode" : "0002",
				"CompanyCodeName" : "SAP SE"
			}, {
				"CompanyCode" : "0003",
				"CompanyCodeName" : "SAP"
			} ]);
		}
	}
	sinon.stub(sap.apf.ui.utils, "formatter", sinon.stub().returns(formatterDouble()));
	function _commonInitialization(aSelectedFilterValuesCompanyCode, aSelectedFilterValuesCountry, aSelectedFilterValuesStartDate) {
		var oDeferredSelectedValuesCompanyCode, oDeferredSelectedValuesStartDate, oDeferredSelectedValuesCountry;
		//Stub for getSelectedValues() company code filter
		getSelectedValuesStubCompanyCode = sinon.stub();
		//Deferred object for getSelectedValues() for company code filter
		oDeferredSelectedValuesCompanyCode = jQuery.Deferred();
		oNewPromiseForCompanyCodeSelectedValues = jQuery.Deferred();
		oDeferredSelectedValuesCompanyCode.resolve(aSelectedFilterValuesCompanyCode, oNewPromiseForCompanyCodeSelectedValues.promise());
		//Different values returned based on the call count
		getSelectedValuesStubCompanyCode.onCall(0).returns(oDeferredSelectedValuesCompanyCode.promise());
		//Stub for getSelectedValues() country filter
		getSelectedValuesStubCountry = sinon.stub();
		//Deferred object for getSelectedValues() for company code filter
		oDeferredSelectedValuesCountry = jQuery.Deferred();
		oNewPromiseForCountrySelectedValues = jQuery.Deferred();
		oDeferredSelectedValuesCountry.resolve(aSelectedFilterValuesCountry, oNewPromiseForCountrySelectedValues.promise());
		//Different values returned based on the call count
		getSelectedValuesStubCountry.onCall(0).returns(oDeferredSelectedValuesCountry.promise());
		//Stub for getSelectedValues() for start date filter
		getSelectedValuesStubStartDate = sinon.stub();
		//Deferred object for getSelectedValues() for start date filter
		oDeferredSelectedValuesStartDate = jQuery.Deferred();
		oNewPromiseForStartDateSelectedValues = jQuery.Deferred();
		oDeferredSelectedValuesStartDate.resolve(aSelectedFilterValuesStartDate, oNewPromiseForStartDateSelectedValues.promise());
		//Different values returned based on the call count
		getSelectedValuesStubStartDate.onCall(0).returns(oDeferredSelectedValuesStartDate.promise());
		//oCoreApi stub
		oCoreApi = {
			getTextNotHtmlEncoded : doNothing,
			createMessageObject : doNothing,
			putMessage : sinon.spy()
		};
		//oUiApi stub
		oUiApi = {
			selectionChanged : sinon.spy(),
			getEventCallback : doNothing,
			getCustomFormatExit : function() {
				var exits = {};
				return exits;
			}
		};
		//Instantiation of facet filter view
		oFacetFilterView = new sap.ui.view({
			viewName : "sap.apf.ui.reuse.view.facetFilter",
			type : "JS",
			viewData : {
				oCoreApi : oCoreApi,
				oUiApi : oUiApi,
				aConfiguredFilters : [ {
					getLabel : getLabelForStartDate,
					getPropertyName : getPropertyNameForStartDate,
					isMultiSelection : getMultiSelectionForStartDate,
					getAliasNameIfExistsElsePropertyName : doNothing,
					getMetadata : getMetadataForStartDate,
					getValues : getValuesForStartDate,
					getSelectedValues : getSelectedValuesStubStartDate,
					setSelectedValues : sinon.spy(),
					hasValueHelpRequest : function () {return true;}
				}, {
					getLabel : getLabelForCountry,
					getPropertyName : getPropertyNameForCountry,
					isMultiSelection : getMultiSelectionForCountry,
					getAliasNameIfExistsElsePropertyName : doNothing,
					getMetadata : getMetadataForCountry,
					getValues : getValuesForCountry,
					getSelectedValues : getSelectedValuesStubCountry,
					setSelectedValues : sinon.spy(),
					hasValueHelpRequest : function () {return true;}
				}, {
					getLabel : getLabelForCompanyCode,
					getPropertyName : getPropertyNameForCompanyCode,
					isMultiSelection : getMultiSelectionForCompanyCode,
					getAliasNameIfExistsElsePropertyName : doNothing,
					getMetadata : getMetadataForCompanyCode,
					getValues : getValuesForCompanyCode,
					getSelectedValues : getSelectedValuesStubCompanyCode,
					setSelectedValues : sinon.spy(),
					hasValueHelpRequest : function () {return true;}
				} ],
				oStartFilterHandler : {
					resetVisibleStartFilters : sinon.spy()
				}
			}
		});
		resolveInitialValueHelps();
	}
	QUnit.module("Facet Filter Controller Tests", {
		beforeEach : function() {
			var aSelectedFilterValuesCompanyCode = [ "0003" ], aSelectedFilterValuesCountry = [ "BR" ], aSelectedFilterValuesStartDate = [ "20000201" ];
			_commonInitialization(aSelectedFilterValuesCompanyCode, aSelectedFilterValuesCountry, aSelectedFilterValuesStartDate);
		},
		afterEach : function() {
			oFacetFilterView.destroy();
		}
	});
	QUnit.test("When facet filter view is loaded", function(assert) {
		//arrangement for facet filter
		var expectedStartDateItems, expectedCountryItems, expectedCompanyCodeItems;
		var aFacetFilterListControls = oFacetFilterView.byId("idAPFFacetFilter").getLists();
		//assertion for facet filter
		assert.equal(aFacetFilterListControls.length, 3, "then three list controls are prepared for the facet filter control");
		//arrangement for start date
		expectedStartDateItems = [ {
			"key" : "20000101",
			"text" : "1/1/2000",
			"selected" : false
		}, {
			"key" : "20000201",
			"text" : "2/1/2000",
			"selected" : true
		}, {
			"key" : "",
			"text" : "",
			"selected" : false
		} ];
		//assert for start date filter
		assert.equal(aFacetFilterListControls[0].getItems().length, 3, "the start date filter control is populated with three values");
		assert.deepEqual(aFacetFilterListControls[0].getModel().getData(), expectedStartDateItems, "the start date list items are set correctly");
		assert.equal(Object.keys(aFacetFilterListControls[0].getSelectedKeys()).length, 1, "then one Start Date is selected in the start date list control");
		assert.equal(Object.keys(aFacetFilterListControls[0].getSelectedKeys())[0], "20000201", "and the selected Start Date is same as expected (20000201)");
		//arrangement for country
		expectedCountryItems = [ {
			"key" : "AR",
			"text" : "AR - Argentina",
			"selected" : false
		}, {
			"key" : "BR",
			"text" : "BR - Brazil",
			"selected" : true
		} ];
		//assert for country filter
		assert.equal(aFacetFilterListControls[1].getItems().length, 2, "the country filter control is populated with two countries");
		assert.deepEqual(aFacetFilterListControls[1].getModel().getData(), expectedCountryItems, "the country list items are set correctly");
		assert.equal(Object.keys(aFacetFilterListControls[1].getSelectedKeys()).length, 1, "then one country is selected in country list control");
		assert.equal(Object.keys(aFacetFilterListControls[1].getSelectedKeys())[0], "BR", "and the selected country is same as expected (BR)");
		//arrangement for company code
		expectedCompanyCodeItems = [ {
			"key" : "0001",
			"text" : "0001 - SAP AG",
			"selected" : false
		}, {
			"key" : "0002",
			"text" : "0002 - SAP SE",
			"selected" : false
		}, {
			"key" : "0003",
			"text" : "0003 - SAP",
			"selected" : true
		} ];
		//assert for company code filter
		assert.equal(aFacetFilterListControls[2].getItems().length, 3, "the company code filter control is populated with three company codes");
		assert.deepEqual(aFacetFilterListControls[2].getModel().getData(), expectedCompanyCodeItems, "the company code list items are set correctly");
		assert.equal(Object.keys(aFacetFilterListControls[2].getSelectedKeys()).length, 1, "then one company code is selected in company code list control");
		assert.equal(Object.keys(aFacetFilterListControls[2].getSelectedKeys())[0], "0003", "and the selected company code is same as expected (0003)");
	});
	QUnit.test("When user selects another value in a single select facet filter list (start date)", function(assert) {
		//arrangement 
		var expectedSelectedStartDateKeys = {
			"20000101" : "1/1/2000"
		};
		var oStartDateFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[0];
		//act
		oStartDateFilterControl.getItems()[0].setSelected(true);
		oStartDateFilterControl.fireListClose();
		//assert
		assert.deepEqual(oStartDateFilterControl.getSelectedKeys(), expectedSelectedStartDateKeys, "then the selected value is changed on start date list to 1/1/2000");
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "and selectionChanged event is trigerred on list close");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[0].setSelectedValues.calledWith([ "20000101" ]), true, "Expected value is selected in facet filter list for start date");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[0].setSelectedValues.calledOnce, true, "SetSelectedValues is called for the facet filter start date");
	});
	QUnit.test("When user selects another value in country filter and company code filter dependent on country", function(assert) {
		//arrangement 
		var oCountryFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[1];
		var oCompanyCodeFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[2];
		var newValuesForCompanyCode = [ {
			"CompanyCode" : "0004",
			"CompanyCodeName" : "SAP DE"
		}, {
			"CompanyCode" : "0005",
			"CompanyCodeName" : "SAP IN"
		} ];
		var expectedNewCompanyCodeItems = [ {
			"key" : "0004",
			"text" : "0004 - SAP DE",
			"selected" : true
		}, {
			"key" : "0005",
			"text" : "0005 - SAP IN",
			"selected" : true
		} ];
		var expectedNewCountrySelectedKeys = {
			"AR" : "AR - Argentina"
		};
		var oNewPromiseForCompanyCodeSelectedValues2 = jQuery.Deferred();
		//act
		oCountryFilterControl.getItems()[0].setSelected(true);
		oCountryFilterControl.getItems()[1].setSelected(false);
		oCountryFilterControl.fireListClose();
		oNewPromiseForCompanyCodeSelectedValues.resolve([ "0004", "0005" ], oNewPromiseForCompanyCodeSelectedValues2.promise());
		oPromiseForCompanyCodeValues.resolve(newValuesForCompanyCode);
		//assert for country
		assert.deepEqual(oCountryFilterControl.getSelectedKeys(), expectedNewCountrySelectedKeys, "then the selected value is changed on country list to AR");
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "and selectionChanged event is trigerred on list close");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[1].setSelectedValues.calledWith([ "AR" ]), true, "Expected value is selected in facet filter list for country");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[1].setSelectedValues.calledOnce, true, "SetSelectedValues is called for the facet filter country");
		//assert for company code filter
		assert.equal(oCompanyCodeFilterControl.getItems().length, 2, "the company code filter control is populated with two new company codes");
		assert.deepEqual(oCompanyCodeFilterControl.getModel().getData(), expectedNewCompanyCodeItems, "the company code list items are set correctly");
		assert.deepEqual(oCompanyCodeFilterControl.getSelectedItems().length, 3, "then 'All' is selected on company code list");
	});
	QUnit.test("When user selects multiple values in country filter and company code filter dependent on country", function(assert) {
		//arrangement 
		var oCountryFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[1];
		var oCompanyCodeFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[2];
		var newValuesForCompanyCode = [ {
			"CompanyCode" : "0001",
			"CompanyCodeName" : "SAP AG"
		}, {
			"CompanyCode" : "0002",
			"CompanyCodeName" : "SAP SE"
		}, {
			"CompanyCode" : "0003",
			"CompanyCodeName" : "SAP"
		}, {
			"CompanyCode" : "0004",
			"CompanyCodeName" : "SAP DE"
		}, {
			"CompanyCode" : "0005",
			"CompanyCodeName" : "SAP IN"
		} ];
		var expectedNewCompanyCodeItems = [ {
			"key" : "0001",
			"text" : "0001 - SAP AG",
			"selected" : false
		}, {
			"key" : "0002",
			"text" : "0002 - SAP SE",
			"selected" : false
		}, {
			"key" : "0003",
			"text" : "0003 - SAP",
			"selected" : true
		}, {
			"key" : "0004",
			"text" : "0004 - SAP DE",
			"selected" : false
		}, {
			"key" : "0005",
			"text" : "0005 - SAP IN",
			"selected" : false
		} ];
		var expectedNewCountrySelectedKeys = {
			"AR" : "AR - Argentina",
			"BR" : "BR - Brazil"
		};
		var oNewPromiseForCompanyCodeSelectedValues2 = jQuery.Deferred();
		//act
		oCountryFilterControl.getItems()[0].setSelected(true);
		oCountryFilterControl.getItems()[1].setSelected(true);
		oCountryFilterControl.fireListClose();
		oNewPromiseForCompanyCodeSelectedValues.resolve([ "0003" ], oNewPromiseForCompanyCodeSelectedValues2.promise());
		oPromiseForCompanyCodeValues.resolve(newValuesForCompanyCode);
		//assert for country
		assert.deepEqual(oCountryFilterControl.getSelectedKeys(), expectedNewCountrySelectedKeys, "then the selected value is changed on country list to All");
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "and selectionChanged event is trigerred on list close");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[1].setSelectedValues.calledWith([ "AR", "BR" ]), true, "Expected values are selected in facet filter list for country");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[1].setSelectedValues.calledOnce, true, "SetSelectedValues is called for the facet filter country");
		//assert for company code filter
		assert.equal(oCompanyCodeFilterControl.getItems().length, 5, "the company code filter control is populated with 5 company codes");
		assert.deepEqual(oCompanyCodeFilterControl.getModel().getData(), expectedNewCompanyCodeItems, "the company code list items are set correctly");
		assert.deepEqual(oCompanyCodeFilterControl.getSelectedItems().length, 1, "then '0003' is selected on company code list");
	});
	QUnit.test("When user deselects one value and selects another in a multiselect facet filter list (company code) ", function(assert) {
		//arrangement 
		var expectedSelectedCompanyCodeKeys = {
			"0001" : "0001 - SAP AG"
		};
		var oCompanyCodeFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[2];
		//act
		oCompanyCodeFilterControl.getItems()[0].setSelected(true);
		oCompanyCodeFilterControl.getItems()[2].setSelected(false);
		oCompanyCodeFilterControl.fireListClose();
		//assert
		assert.deepEqual(oCompanyCodeFilterControl.getSelectedKeys(), expectedSelectedCompanyCodeKeys, "then one value is selected on company code list");
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "and selectionChanged event is trigerred on list close");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[2].setSelectedValues.calledWith([ "0001" ]), true, "Expected value is selected in comapny code facet filter list");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[2].setSelectedValues.calledOnce, true, "SetSelectedValues is called for the facet filter comapny code");
	});
	QUnit.test("When user deselects one value and selects multiple values in a multiselect facet filter list (company code) ", function(assert) {
		//arrangement 
		var expectedSelectedCompanyCodeKeys = {
			"0001" : "0001 - SAP AG",
			"0002" : "0002 - SAP SE"
		};
		var oCompanyCodeFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[2];
		//act
		oCompanyCodeFilterControl.getItems()[0].setSelected(true);
		oCompanyCodeFilterControl.getItems()[1].setSelected(true);
		oCompanyCodeFilterControl.getItems()[2].setSelected(false);
		oCompanyCodeFilterControl.fireListClose();
		//assert
		assert.deepEqual(oCompanyCodeFilterControl.getSelectedKeys(), expectedSelectedCompanyCodeKeys, "then two values are selected on company code list");
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "and selectionChanged event trigerred on list close");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[2].setSelectedValues.calledWith([ "0001", "0002" ]), true, "Expected value is selected in comapny code facet filter list");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[2].setSelectedValues.calledOnce, true, "SetSelectedValues is called for the facet filter comapny code");
	});
	QUnit.test("When user selects 'all' in a multiselect facet filter list (company code)", function(assert) {
		//arrangement
		var oCompanyCodeFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[2];
		//act
		oCompanyCodeFilterControl.selectAll();
		oCompanyCodeFilterControl.fireListClose();
		//assert
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "and selectionChanged event trigerred on list close");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[2].setSelectedValues.calledWith([ "0001", "0002", "0003" ]), true, "Expected value is selected in company code facet filter list");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[2].setSelectedValues.calledOnce, true, "SetSelectedValues is called for the facet filter comapny code");
	});
	QUnit.test("When user deselects selected value in a multiselect facet filter list (company code) leading to no selections in facet filter list", function(assert) {
		//arrangement
		var oCompanyCodeFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[2];
		//act
		oCompanyCodeFilterControl.removeSelectedKeys();
		oCompanyCodeFilterControl.fireListClose();
		//assert
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "and selectionChanged event trigerred on list close");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[2].setSelectedValues.calledWith([]), true, "No value is selected in company code facet filter list");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[2].setSelectedValues.calledOnce, true, "SetSelectedValues is called for the facet filter comapny code");
	});
	QUnit.test("When user opens the list but does not change any selections in facet filter list", function(assert) {
		//arrangement
		var expectedSelectedCompanyCodeKeys = {
			"0003" : "0003 - SAP"
		};
		var oCompanyCodeFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[2];
		oCompanyCodeFilterControl.fireListClose();
		//assert
		assert.deepEqual(oCompanyCodeFilterControl.getSelectedKeys(), expectedSelectedCompanyCodeKeys, "then 0003 is selected on company code list and no changes were made");
		assert.equal(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, false, "and selectionChanged event is not trigerred on list close as selections did not change");
		assert.strictEqual(oFacetFilterView.getViewData().aConfiguredFilters[1].setSelectedValues.calledOnce, false, "SetSelectedValues is not called for the facet filter as selection did not change");
	});
	QUnit.test("When reset is pressed and there are changes to one of the facetFilterLists", function(assert) {
		//arrangement
		oFacetFilterView.getViewData().oCoreApi.isDirty = function() {
			return false;
		};
		var oCompanyCodeFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[2];
		oCompanyCodeFilterControl.getItems()[0].setSelected(true);
		oCompanyCodeFilterControl.fireListClose();
		assert.equal(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, true, "selectionChangedEvent triggered by facetFilter List once");
		//act
		oFacetFilterView.getController().onResetPress();
		//assert
		assert.equal(oFacetFilterView.getViewData().oStartFilterHandler.resetVisibleStartFilters.calledOnce, true, "then reset visible start filters is not called on start filter handler");
		assert.equal(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledTwice, true, "selectionChangedEvent triggered by facetFilter reset");
	});
	QUnit.module("Facet Filter Controller with Date Object", {
		beforeEach : function() {
			var oDeferredSelectedValuesStartDate;
			getSelectedValuesStubStartDate = sinon.stub();
			//Deferred object for getSelectedValues() for start date filter
			oDeferredSelectedValuesStartDate = jQuery.Deferred();
			oNewPromiseForStartDateSelectedValues = jQuery.Deferred();
			//Different values returned based on the call count
			getSelectedValuesStubStartDate.onCall(0).returns(oDeferredSelectedValuesStartDate.promise());
			//oCoreApi stub
			oCoreApi = {
				getTextNotHtmlEncoded : doNothing,
				createMessageObject : doNothing,
				putMessage : sinon.spy()
			};
			//oUiApi stub
			oUiApi = {
				selectionChanged : sinon.spy(),
				getEventCallback : doNothing,
				getCustomFormatExit : function() {
					var exits = {};
					return exits;
				}
			};
			//Instantiation of facet filter view
			oFacetFilterView = new sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.facetFilter",
				type : "JS",
				viewData : {
					oCoreApi : oCoreApi,
					oUiApi : oUiApi,
					aConfiguredFilters : [ {
						getLabel : getLabelForStartDate,
						getPropertyName : getPropertyNameForStartDate,
						isMultiSelection : getMultiSelectionForStartDate,
						getAliasNameIfExistsElsePropertyName : doNothing,
						getMetadata : getMetadataForDate,
						getValues : getValuesForDate,
						getSelectedValues : function() {
							return jQuery.Deferred().resolve([ new Date(2017, 1, 1).toString() ], jQuery.Deferred());
						},
						setSelectedValues : sinon.spy(),
						hasValueHelpRequest : function () {return true;}
					} ],
					oStartFilterHandler : {
						resetVisibleStartFilters : sinon.spy()
					}
				}
			});
			oPromiseForStartDateValues.resolve([ {
				"StartDate" : new Date(2016, 1, 1)
			}, {
				"StartDate" : new Date(2017, 1, 1)
			} ]);
			function getValuesForDate() {
				oPromiseForStartDateValues = jQuery.Deferred();
				return oPromiseForStartDateValues.promise();
			}
			function getMetadataForDate() {
				var oDeferredMetadata = jQuery.Deferred();
				var oPropertyMetadata = {
					"name" : "StartDate",
					"dataType" : {
						"type" : "Edm.Date",
						"maxLength" : "8"
					},
					"label" : "Start Date",
					"aggregation-role" : "dimension",
					"isCalendarDate" : "true"
				};
				oDeferredMetadata.resolve(oPropertyMetadata);
				return oDeferredMetadata.promise();
			}
		}
	});
	QUnit.test("Select a Date Object", function(assert) {
		// Tesssst
		var expectedStartDateItems;
		var aFacetFilterListControls = oFacetFilterView.byId("idAPFFacetFilter").getLists();
		//arrangement for start date
		expectedStartDateItems = [ {
			"key" : new Date(2016, 1, 1),
			"text" : "1/1/2016",
			"selected" : false
		}, {
			"key" : new Date(2017, 1, 1),
			"text" : "1/1/2017",
			"selected" : true
		} ];
		//assert for start date filter
		assert.equal(aFacetFilterListControls[0].getItems().length, 2, "the start date filter control is populated with two dates");
		assert.deepEqual(aFacetFilterListControls[0].getModel().getData(), expectedStartDateItems, "the start date list items are set correctly");
		assert.equal(Object.keys(aFacetFilterListControls[0].getSelectedKeys()).length, 1, "then one Start Date is selected in the start date list control");
		assert.equal(Object.keys(aFacetFilterListControls[0].getSelectedKeys())[0], new Date(2017, 1, 1), "and the selected Start Date is same as expected");
	});
	QUnit.module("Facet Filter Controller Tests - no preselections on load a.k.a filters with no selection preset", {
		beforeEach : function() {
			var aSelectedFilterValuesCompanyCode = [], aSelectedFilterValuesCountry = [], aSelectedFilterValuesStartDate = [];
			_commonInitialization(aSelectedFilterValuesCompanyCode, aSelectedFilterValuesCountry, aSelectedFilterValuesStartDate);
		},
		afterEach : function() {
			oFacetFilterView.destroy();
		}
	});
	QUnit.test("When facet filter view is loaded", function(assert) {
		//arrangement for facet filter
		var expectedStartDateItems, expectedCountryItems, expectedCompanyCodeItems;
		var aFacetFilterListControls = oFacetFilterView.byId("idAPFFacetFilter").getLists();
		//as value help is only filled when list is open we open every list to fill the list with items
		aFacetFilterListControls[0].fireListOpen();
		aFacetFilterListControls[1].fireListOpen();
		aFacetFilterListControls[2].fireListOpen();
		resolveInitialValueHelps();
		//assertion for facet filter
		assert.equal(aFacetFilterListControls.length, 3, "then three list controls are prepared for the facet filter control");
		//arrangement for start date
		expectedStartDateItems = [ {
			"key" : "20000101",
			"text" : "1/1/2000",
			"selected" : false
		}, {
			"key" : "20000201",
			"text" : "2/1/2000",
			"selected" : false
		}, {
			"key" : "",
			"text" : "",
			"selected" : false
		} ];
		//assert for start date filter
		assert.equal(aFacetFilterListControls[0].getItems().length, 3, "the start date filter control is populated with three dates");
		assert.deepEqual(aFacetFilterListControls[0].getModel().getData(), expectedStartDateItems, "the start date list items are set correctly");
		assert.equal(Object.keys(aFacetFilterListControls[0].getSelectedKeys()).length, 0, "then no Start Date is selected in the start date list control");
		//arrangement for country
		expectedCountryItems = [ {
			"key" : "AR",
			"text" : "AR - Argentina",
			"selected" : false
		}, {
			"key" : "BR",
			"text" : "BR - Brazil",
			"selected" : false
		} ];
		//assert for country filter
		assert.equal(aFacetFilterListControls[1].getItems().length, 2, "the country filter control is populated with two countries");
		assert.deepEqual(aFacetFilterListControls[1].getModel().getData(), expectedCountryItems, "the country list items are set correctly");
		assert.equal(Object.keys(aFacetFilterListControls[1].getSelectedKeys()).length, 0, "then no country is selected in country list control");
		//arrangement for company code
		expectedCompanyCodeItems = [ {
			"key" : "0001",
			"text" : "0001 - SAP AG",
			"selected" : false
		}, {
			"key" : "0002",
			"text" : "0002 - SAP SE",
			"selected" : false
		}, {
			"key" : "0003",
			"text" : "0003 - SAP",
			"selected" : false
		} ];
		//assert for company code filter
		assert.equal(aFacetFilterListControls[2].getItems().length, 3, "the company code filter control is populated with three company codes");
		assert.deepEqual(aFacetFilterListControls[2].getModel().getData(), expectedCompanyCodeItems, "the company code list items are set correctly");
		assert.equal(Object.keys(aFacetFilterListControls[2].getSelectedKeys()).length, 0, "then no company code is selected in company code list control");
	});
	QUnit.module("Facet filter list with lists which one of the list has no data, other list has empty values", {
		beforeEach : function() {
			oCoreApi = {
				getTextNotHtmlEncoded : function(oLabel) {
					return oLabel.key;
				},
				createMessageObject : doNothing,
				putMessage : sinon.spy()
			};
			oUiApi = {
				selectionChanged : sinon.spy(),
				getEventCallback : doNothing,
				getCustomFormatExit : function() {
					var exits = {};
					return exits;
				}
			};
			//Stub for getSelectedValues() start date filter
			var getSelectedValuesStartDate = function(){
				return jQuery.Deferred().resolve(["20000201"], jQuery.Deferred());
			};
			var getEmptySelectedValuesList = function () {
				return jQuery.Deferred().resolve([], jQuery.Deferred());
			};
			var getEmptyValueHelpList = function () {
				return jQuery.Deferred().resolve([]);
			};
			//Instantiation of facet filter view
			oFacetFilterView = new sap.ui.view({
				viewName : "sap.apf.ui.reuse.view.facetFilter",
				type : "JS",
				viewData : {
					oCoreApi : oCoreApi,
					oUiApi : oUiApi,
					aConfiguredFilters : [ {
						getLabel : getLabelForStartDate,
						getPropertyName : getPropertyNameForStartDate,
						isMultiSelection : getMultiSelectionForStartDate,
						getAliasNameIfExistsElsePropertyName : doNothing,
						getMetadata : getMetadataForStartDate,
						getValues : getValuesForStartDate,
						getSelectedValues : getSelectedValuesStartDate,
						setSelectedValues : doNothing,
						hasValueHelpRequest : function () {return true;}
					}, {
						getLabel : getLabelForCountry,
						getPropertyName : getPropertyNameForCountry,
						isMultiSelection : getMultiSelectionForCountry,
						getAliasNameIfExistsElsePropertyName : doNothing,
						getMetadata : getMetadataForCountry,
						getValues : getEmptyValueHelpList,
						getSelectedValues : getEmptySelectedValuesList,
						setSelectedValues : sinon.spy(),
						hasValueHelpRequest : function () {return false;}
					}, {
						getLabel : getLabelForCompanyCode,
						getPropertyName : getPropertyNameForCompanyCode,
						isMultiSelection : getMultiSelectionForCompanyCode,
						getAliasNameIfExistsElsePropertyName : doNothing,
						getMetadata : getMetadataForCompanyCode,
						getValues : getEmptyValueHelpList,
						getSelectedValues : getEmptySelectedValuesList,
						setSelectedValues : doNothing,
						hasValueHelpRequest : function () {return true;}
					} ],
					oStartFilterHandler : {
						resetVisibleStartFilters : sinon.spy()
					}
				}
			});
			resolveInitialValueHelps();
		},
		afterEach : function() {
			oFacetFilterView.destroy();
		}
	});
	QUnit.test("FacetFilter list is inactive when it has no value help request", function(assert) {
		assert.equal(oFacetFilterView.byId("idAPFFacetFilter").getLists().length, 3, "Three lists are available in facet filter");
		assert.equal(oFacetFilterView.byId("idAPFFacetFilter").getLists()[0].getActive(), true, "the start date filter list which has data is set to Active");
		assert.equal(oFacetFilterView.byId("idAPFFacetFilter").getLists()[1].getActive(), false, "the country code filter list which has no data is set to InActive");
		assert.equal(oFacetFilterView.byId("idAPFFacetFilter").getLists()[2].getActive(), true, "the company code filter list which has no data is still active as it has a value help request");
		assert.equal(oFacetFilterView.byId("idAPFFacetFilter").getLists()[2].getItems().length, 0, "the company code filter has no data");
	});
	QUnit.test("When user selects another value in a single select facet filter list (start date)", function(assert) {
		//arrangement 
		var oStartDateFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[0];
		assert.deepEqual(oStartDateFilterControl.getSelectedKeys(), {
			"20000201" : "2/1/2000"
		}, "then the selected value is initially set to 2/1/2000");
		//act
		oStartDateFilterControl.getItems()[0].setSelected(true);
		oStartDateFilterControl.fireListClose();
		//assert
		assert.deepEqual(oStartDateFilterControl.getSelectedKeys(), {
			"20000101" : "1/1/2000"
		}, "then the selected value is changed on start date list to 1/1/2000");
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "then selectionChanged event is trigerred only once after list close");
	});
	QUnit.test("When user selects an empty value in a single select facet filter list (start date)", function(assert) {
		//arrangement 
		var expectedSelectedStartDateKeys = {};
		var oStartDateFilterControl = oFacetFilterView.byId("idAPFFacetFilter").getLists()[0];
		//act
		oStartDateFilterControl.getItems()[0].setSelected(false);
		oStartDateFilterControl.getItems()[1].setSelected(false);
		oStartDateFilterControl.getItems()[2].setSelected(true);
		oStartDateFilterControl.fireListClose();
		//assert
		assert.deepEqual(oStartDateFilterControl.getSelectedKeys(), expectedSelectedStartDateKeys, "then the selected value is changed on start date list to empty");
		assert.ok(oFacetFilterView.getViewData().oUiApi.selectionChanged.calledOnce, "then selectionChanged event is trigerred only once after list close");
	});
}());
