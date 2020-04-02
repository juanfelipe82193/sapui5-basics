/*
 * tests for the sap.suite.ui.generic.template.AnalyticalListPage.control.KpiTag
 */
sap.ui.define(
	[
	"sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/VisualFilterProvider",
	"sap/ui/model/json/JSONModel"
	],
		function(VisualFilterProvider, JSONModel) {
			"use strict";
			var jsonModel = new JSONModel({});
			var filter = {
				getModel: function() {
					return jsonModel;
				}
			};
			var oEntityType = {
				"com.sap.vocabularies.UI.v1.FieldGroup#Overview": {
					Data : [ { Value: {Path: "YearMonth"}}, {Value: {Path: "CompanyCodeName"}  }] ,
					Label : { String: "Overview"}
				},
				"com.sap.vocabularies.UI.v1.FieldGroup#Overview1": {
					Data: [ {Value: {Path: "FiscalMonth"} }] ,
					Label: {String: "Overview1"}
				}
			};
		
		var orig = VisualFilterProvider.prototype._initMetadata;
		VisualFilterProvider.prototype._initMetadata = function() {
			return;
		};
		var myObject = new VisualFilterProvider(filter);
		//TESTBEGIN
		QUnit.test("FieldGroup", function(assert) {
			assert.equal(myObject._getFieldGroupForProperty(oEntityType,""),undefined);
			assert.equal(myObject._getFieldGroupForProperty("",""),undefined);
			assert.equal(myObject._getFieldGroupForProperty("","FiscalMonth"),undefined);
			assert.equal(myObject._getFieldGroupForProperty(oEntityType, "FiscalMonth"), "Overview1");
			assert.equal(myObject._getFieldGroupForProperty(oEntityType,"YearMonth"),"Overview");
			assert.equal(myObject._getFieldGroupForProperty(oEntityType,"CompanyCodeName"),"Overview");
			assert.equal(myObject._getFieldGroupForProperty(oEntityType,"ID"),undefined);//ID is not present in any field group
			assert.equal(myObject._getFieldGroupForProperty(undefined,undefined),undefined);
			assert.equal(myObject._getFieldGroupForProperty(undefined,""),undefined);
			assert.equal(myObject._getFieldGroupForProperty("",undefined),undefined);
			assert.equal(myObject._getFieldGroupForProperty(undefined,"FiscalMonth"),undefined);
			assert.equal(myObject._getFieldGroupForProperty(oEntityType,undefined),undefined);
		});
		
		// Test begin - _sortVisualFilter
		var allSelectionFields = [{"PropertyPath":"AmountInCompanyCodeCurrency"},{"PropertyPath":"PostingDate"},{"PropertyPath":"CompanyCode"},{"PropertyPath":"CostCenter"},{"PropertyPath":"FiscalMonth"},{"PropertyPath":"YearMonth"}];
		var config = {"filterList":[{"parentProperty":"Currency", "isMandatory" : true},{"parentProperty":"FiscalMonth"},{"parentProperty":"CompanyCode"},{"parentProperty":"CostCenter"},{"parentProperty":"CostElement"}]};

		QUnit.test("SortVisualFilter", function(assert) {
			assert.equal(myObject._sortVisualFilter(allSelectionFields,config),config);
			assert.equal(myObject._sortVisualFilter(allSelectionFields,config),config);
			assert.equal(myObject._sortVisualFilter(undefined,config),config);
			assert.equal(myObject._sortVisualFilter("",config),config);
			assert.equal(myObject._sortVisualFilter(allSelectionFields,""),"");
			assert.equal(myObject._sortVisualFilter("",""),"");
			assert.equal(myObject._sortVisualFilter(undefined,undefined),undefined);
			assert.equal(myObject._sortVisualFilter(allSelectionFields,undefined),undefined);
		});

		VisualFilterProvider.prototype._initMetadata = orig;
	}
);