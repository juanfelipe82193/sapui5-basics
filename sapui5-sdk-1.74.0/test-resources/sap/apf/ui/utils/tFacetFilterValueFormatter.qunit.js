/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.utils.tFacetFilterValueFormatter');
jQuery.sap.require('sap.apf.ui.utils.facetFilterValueFormatter');
(function() {
	'use strict';
	function doNothing() {
	}
	//Stub for formatter
	function formatterDouble() {
		var getFormattedValueStub = sinon.stub();
		var oFormatterStub = {
			getFormattedValue : getFormattedValueStub
		};
		//Different values returned based on the arguments passed
		getFormattedValueStub.withArgs("StartDate", "20000101").returns("1/1/2000");
		getFormattedValueStub.withArgs("StartDate", "20000201").returns("2/1/2000");
		getFormattedValueStub.withArgs("CompanyCode", "0001").returns("0001");
		getFormattedValueStub.withArgs("CompanyCode", "0002").returns("0002");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP AG").returns("SAP AG");
		getFormattedValueStub.withArgs("CompanyCodeName", "SAP SE").returns("SAP SE");
		return oFormatterStub;
	}
	QUnit.module("Facet Filter value formatter for list values", {
		beforeEach : function() {
			this.formatterDouble = sinon.stub(sap.apf.ui.utils, "formatter", sinon.stub().returns(formatterDouble()));
			//oCoreApi stub
			var oCoreApi = {
				getTextNotHtmlEncoded : doNothing
			};
			//oUiApi stub
			var oUiApi = {
				getEventCallback : doNothing,
				getCustomFormatExit : function() {
					var exits = {};
					return exits;
				}
			};
			this.oFacetFilterValueFormatter = new sap.apf.ui.utils.FacetFilterValueFormatter(oUiApi, oCoreApi);
		},
		afterEach: function(){
			this.formatterDouble.restore();
		}
	});
	QUnit.test("Format filter value of property with no text field ", function(assert) {
		// arrangement
		var aExpectedFilterValues = [ {
			"StartDate" : "20000101",
			"formattedValue" : "1/1/2000"
		}, {
			"StartDate" : "20000201",
			"formattedValue" : "2/1/2000"
		} ];
		var sSelectProperty = "StartDate";
		var aFilterValues = [ {
			"StartDate" : "20000101"
		}, {
			"StartDate" : "20000201"
		} ];
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
		// act
		var aModifiedFilters = this.oFacetFilterValueFormatter.getFormattedFFData(aFilterValues, sSelectProperty, oPropertyMetadata);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "the formatted value is correct");
	});
	QUnit.test("Format filter value of property with a text field  ", function(assert) {
		// arrangement
		var sSelectProperty = "CompanyCode";
		var aFilterValues = [ {
			"CompanyCode" : "0001",
			"CompanyCodeName" : "SAP AG"
		}, {
			"CompanyCode" : "0002",
			"CompanyCodeName" : "SAP SE"
		} ];
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
		var aExpectedFilterValues = [ {
			"CompanyCode" : "0001",
			"CompanyCodeName" : "SAP AG",
			"formattedValue" : "0001 - SAP AG"
		}, {
			"CompanyCode" : "0002",
			"CompanyCodeName" : "SAP SE",
			"formattedValue" : "0002 - SAP SE"
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterValueFormatter.getFormattedFFData(aFilterValues, sSelectProperty, oPropertyMetadata);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "the formatted value is correct");
	});
	QUnit.test("Format filter value of property with an 'undefined' text field ", function(assert) {
		// arrangement
		var sSelectProperty = "CompanyCode";
		var aFilterValues = [ {
			"CompanyCode" : "0001"
		} ];
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
		
		var aExpectedFilterValues = [ {
			"CompanyCode" : "0001",
			"formattedValue" : "0001"
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterValueFormatter.getFormattedFFData(aFilterValues, sSelectProperty, oPropertyMetadata);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "the formatted value is correct");
	});
	QUnit.test("When format filter value of property with a key & text field  and value of text field present in the filter values ", function(assert) {
		// arrangement
		var sSelectProperty = "CompanyCode";
		var aFilterValues = [ {
			"CompanyCode" : "0001",
			"CompanyCodeName" : "SAP AG"
		}, {
			"CompanyCode" : "0002",
			"CompanyCodeName" : "SAP SE"
		} ];
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
		var aExpectedFilterValues = [ {
			"CompanyCode" : "0001",
			"CompanyCodeName" : "SAP AG",
			"formattedValue" : "0001 - SAP AG"
		}, {
			"CompanyCode" : "0002",
			"CompanyCodeName" : "SAP SE",
			"formattedValue" : "0002 - SAP SE"
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterValueFormatter.getFormattedFFData(aFilterValues, sSelectProperty, oPropertyMetadata);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "then since text field & text field value present in the filter values so formatted value is key - Text");
	});
	QUnit.test("When format filter value of property with a key and value of text field is undefined in filter values ", function(assert) {
		// arrangement
		var sSelectProperty = "CompanyCode";
		var aFilterValues = [ {
			"CompanyCode" : "0001"
		}, {
			"CompanyCode" : "0002"
		} ];
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
		var aExpectedFilterValues = [ {
			"CompanyCode" : "0001",
			"formattedValue" : "0001"
		}, {
			"CompanyCode" : "0002",
			"formattedValue" : "0002"
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterValueFormatter.getFormattedFFData(aFilterValues, sSelectProperty, oPropertyMetadata);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "then since text field is defined but value of text field not present in the filter values so  formatted value is only key");
	});
	QUnit.test("When format filter value of property with a text and text field is undefined ", function(assert) {
		// arrangement
		var sSelectProperty = "CompanyCodeName";
		var aFilterValues = [ {
			"CompanyCodeName" : "SAP AG"
		}, {
			"CompanyCodeName" : "SAP SE"
		} ];
		var oPropertyMetadata = {
			"name" : "CompanyCodeName",
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "4"
			},
			"label" : "Company Code Name",
			"aggregation-role" : "dimension"
		};
		var aExpectedFilterValues = [ {
			"CompanyCodeName" : "SAP AG",
			"formattedValue" : "SAP AG"
		}, {
			"CompanyCodeName" : "SAP SE",
			"formattedValue" : "SAP SE"
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterValueFormatter.getFormattedFFData(aFilterValues, sSelectProperty, oPropertyMetadata);
		// assert
		assert.deepEqual(aModifiedFilters, aExpectedFilterValues, "then since text is defined as facet filter property so  formatted value is only text");
	});
}());
