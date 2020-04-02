/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.representations.RepresentationInterfaceProxy');
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.ui.utils.printView');
jQuery.sap.require('sap.apf.ui.representations.lineChart');
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.declare('test.sap.apf.ui.utils.tPrintView');
(function() {
	'use strict';
	var oPrintView,
		oPrintModel,
		aSampleData;
	var oPrintModel = {
		getApplicationName : function() {
			return "Application name";
		},
		getHeaderForFirstPage : function() {
			return "Header title";
		},
		getFiltersToPrint : function() {
			return [ {
				sFilterName : "Currency Exchange Rate Type",
				sFilterValue : "M"
			} ];
		},
		getRepresentationForPrint : function(oStep) {
		}
	};
	function metaDataStub() {
		var getPropertyMetadataStub = sinon.stub();
		getPropertyMetadataStub.withArgs("CompanyCodeCountry").returns({
			dataType : {
				maxLength : 10,
				type : "Edm.String"
			},
			label : "Company Code Country",
			name : "CompanyCodeCountry"
		});
		getPropertyMetadataStub.withArgs("DaysSalesOutstanding").returns({
			dataType : {
				maxLength : 10,
				type : "Edm.Int32"
			},
			label : "Days Sales Outstanding",
			name : "DaysSalesOutstanding"
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E").returns({
			ISOCurrency : "DisplayCurrency",
			label : "Revenue in Display Currency",
			name : "RevenueAmountInDisplayCrcy_E",
			scale : "DisplayCurrencyDecimals",
			unit : "RevenueAmountInDisplayCrcy_E.CURRENCY",
			dataType : {
				precision : 34,
				type : "Edm.Decimal"
			}
		});
		getPropertyMetadataStub.withArgs("RevenueAmountInDisplayCrcy_E.CURRENCY").returns({
			name : "RevenueAmountInDisplayCrcy_E.CURRENCY",
			semantics : "currency-code",
			dataType : {
				precision : 5,
				type : "Edm.String"
			}
		});
		return getPropertyMetadataStub;
	}
	function _getStep(oGlobalApi) {
		var sampleMetadata = {
			getPropertyMetadata : metaDataStub
		};
		var parameter = {
			dimensions : [ {
				fieldName : "CompanyCodeCountry"
			} ],
			measures : [ {
				fieldName : "RevenueAmountInDisplayCrcy_E"
			}, {
				fieldName : "DaysSalesOutstanding"
			} ],
			requiredFilters : [ "CompanyCodeCountry" ],
			chartType : "line",
			alternateRepresentationType : {
				type : "representationType",
				id : "table",
				constructor : "sap.apf.ui.representations.table",
				picture : "sap-icon://table-chart (sap-icon://table-chart/)",
				label : {
					type : "label",
					kind : "text",
					key : "table"
				}
			}
		};
		var interfaceProxy = new sap.apf.ui.representations.RepresentationInterfaceProxy(oGlobalApi.oCoreApi, oGlobalApi.oUiApi);
		var dummyContentForChart = new sap.apf.ui.representations.lineChart(interfaceProxy, parameter);
		dummyContentForChart.setData(aSampleData, sampleMetadata);
		dummyContentForChart.getPrintContent("sample Title").oChartForPrinting;
		dummyContentForChart.getMainContent("sample Title", 100, 100);
		return dummyContentForChart;
	}
	QUnit.module("Print Model Tests", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			new sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				aSampleData = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				var oInject = {
					oCoreApi : that.oGlobalApi.oCoreApi,
					uiApi : that.oGlobalApi.oUiApi,
					oFilterIdHandler : that.oGlobalApi.oFilterIdHandler
				};
				oPrintView = new sap.apf.ui.utils.PrintView(oInject, oPrintModel);
				done();
			});
		},
		afterEach: function(){
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When header for first page is created", function(assert) {
		//arrange
		var spyGetApplicationName = sinon.spy(oPrintModel, "getApplicationName");
		var spyGetHeaderForFirstPage = sinon.spy(oPrintModel, "getHeaderForFirstPage");
		//action
		var oHeaderForFirstPage = oPrintView.getHeaderForFirstPage();
		//assert
		assert.strictEqual(oHeaderForFirstPage instanceof sap.ui.layout.HorizontalLayout, true, "then horizontal layout is created to print header first page");
		assert.strictEqual(oHeaderForFirstPage.getContent().length, 3, "then header layout has 3 contents");
		assert.strictEqual(oHeaderForFirstPage.getContent()[0] instanceof sap.m.Text, true, "then header layout's first content is an instance of text");
		assert.strictEqual(oHeaderForFirstPage.getContent()[1] instanceof sap.m.Text, true, "then header layout's second content is an instance of text");
		assert.strictEqual(oHeaderForFirstPage.getContent()[2] instanceof sap.m.Text, true, "then header layout's third content is an instance of text");
		assert.strictEqual(spyGetApplicationName.calledOnce, true, "then application name is get from print model");
		assert.strictEqual(spyGetHeaderForFirstPage.calledOnce, true, "the header for first page is get from print model");
		// cleanup
		oPrintModel.getApplicationName.restore();
		oPrintModel.getHeaderForFirstPage.restore();
	});
	QUnit.test("When filters has been formatted and prepared to print", function(assert) {
		//arrange
		var spyGetFiltersToPrint = sinon.spy(oPrintModel, "getFiltersToPrint");
		//action
		var oFiltersLayout = oPrintView.getPrintLayoutForFacetFiltersAndFooters();
		//assert
		assert.strictEqual(oFiltersLayout instanceof sap.ui.layout.VerticalLayout, true, "then vertical layout is created for filters");
		assert.strictEqual(oFiltersLayout.getContent().length, 2, "then filter layout has 2 contents");
		assert.strictEqual(oFiltersLayout.getContent()[0] instanceof sap.m.Text, true, "then filter layout's first content is an instance of text");
		assert.strictEqual(oFiltersLayout.getContent()[1] instanceof sap.m.Text, true, "then filter layout's second content is an instance of text");
		assert.strictEqual(spyGetFiltersToPrint.calledOnce, true, "then array of formatted filters fetched from print model");
		//cleanup
		oPrintModel.getFiltersToPrint.restore();
	});
	QUnit.test("When steps has been prepared to print", function(assert) {
		//arrange
		var spyGetRepresentationForPrint = sinon.spy(oPrintModel, "getRepresentationForPrint");
		//action
		var oPrintLayoutForEachStep = oPrintView.getPrintLayoutForEachStep(_getStep(this.oGlobalApi), 1, 1);
		//assert
		assert.strictEqual(oPrintLayoutForEachStep instanceof sap.ui.layout.VerticalLayout, true, "then vertical layout is created for steps");
		assert.strictEqual(oPrintLayoutForEachStep.getContent().length, 2, "then step layout has 2 contents");
		assert.strictEqual(oPrintLayoutForEachStep.getContent()[0] instanceof sap.ui.core.HTML, true, "then step layout's first content is an instance of html");
		assert.strictEqual(oPrintLayoutForEachStep.getContent()[1] instanceof sap.ui.layout.VerticalLayout, true, "then step layout's second content is an instance of vertical layout");
		assert.strictEqual(spyGetRepresentationForPrint.calledOnce, true, "then representation fetched from print model");
		//cleanup
		oPrintModel.getRepresentationForPrint.restore();
	});
}());