/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.representations.RepresentationInterfaceProxy');
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require("sap.apf.ui.utils.print");
jQuery.sap.require("sap.apf.ui.representations.lineChart");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.declare('test.sap.apf.ui.utils.tPrint');
(function() {
	'use strict';
	var oGlobalApi, aSampleData;
	var printHelper;
	function _doNothing(){
		return null;
	}
	function _getApplicationConfigPropertiesStub() {
		var oDeferred = jQuery.Deferred();
		oDeferred.resolve({
			appName : "dummy-app-name"
		});
		return oDeferred.promise();
	}
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
	function getStepsStub() {
		var oGetStepsOfLineChart = [ {
			title : "dummy-title",
			length : 1,
			getSelectedRepresentation : function() {
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
		} ];
	       var titleControl = new sap.m.Title({
					level : sap.ui.core.TitleLevel.H1
				}).addStyleClass("sapUiTinyMarginBegin").addStyleClass("sapUiTinyMarginTop");
			 titleControl.oParent = new sap.m.HBox();
			 titleControl.oParent.addItem(new sap.m.Title());
			 titleControl.oParent.addItem(new sap.m.HBox());
	       var GetStepsOfTable = [ {
				title : "Revenue by Customer",
				length : 1,
				getSelectedRepresentation : function() {
					return {
						type : "TableRepresentation",
						titleControl : titleControl,
						getPrintContent : function(stepTitle) {
							var dummyContent = new sap.ui.table.Table({
								showNoData : false,
								title : "Revenue by Customer",
								enableSelectAll : false,
								visibleRowCount : 15
							});
							return {
								oRepresentation : dummyContent
							};
						},
						getData : function() {
							return [ {
								Customer : "DE0200",
								CustomerName : "Shipotion"
							} ];
						},
						getMetaData : function() {
							return {
								type : "EntityTypeMetadata",
								getEntityTypeMetadata : _doNothing,
								getPropertyMetadata : _doNothing
							};
						},
						setData : undefined
					};
				}
			} ];
		if(!this.bIsTable){
			return oGetStepsOfLineChart;
		}
		return GetStepsOfTable;
	}
	QUnit.module("Print qUnit", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				oGlobalApi = oApi;
				aSampleData = sap.apf.testhelper.odata.getSampleService(oGlobalApi.oApi, 'sampleData');
				var oViewData = {
					oCoreApi : oGlobalApi.oCoreApi,
					uiApi : oGlobalApi.oUiApi,
					oFilterIdHandler : oGlobalApi.oFilterIdHandler
				};
				printHelper = new sap.apf.ui.utils.Print(oViewData);
				done();
			});
		},
		afterEach: function(){
			if (sap.ui.getCore().byId("stepList")){
				sap.ui.getCore().byId("stepList").destroy();
			}
		}
	});
	QUnit.test("When Print API loaded", function(assert) {
		assert.expect(5);
		var done = assert.async();
		var printStub = sinon.stub(window, "print", function(){
			//assert
			assert.ok(true, "Window print was called");
			assert.strictEqual(jQuery("#apfPrintArea").length, 1, "then, print Area Injected into the DOM");
			assert.strictEqual(oGlobalApi.oCoreApi.getApplicationConfigProperties.calledOnce, true, "then, configuration properties of application has been fetched");
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps.calledOnce, true, "then, steps has been captured");
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().type, "LineChart", "then Given step is line chart");
			//cleanup
			oGlobalApi.oCoreApi.getApplicationConfigProperties.restore();
			oGlobalApi.oCoreApi.getSteps.restore();
			printStub.restore();
			done();
		});
		//arrange
		this.bIsTable = false;
		sinon.stub(oGlobalApi.oCoreApi, "getApplicationConfigProperties", _getApplicationConfigPropertiesStub);
		sinon.stub(oGlobalApi.oCoreApi, "getSteps", getStepsStub.bind(this));
		//action
		printHelper.doPrint();  //KS there is much more, that has been done - test does not check this
	});
	QUnit.test("When Print API loaded for table representation", function(assert) {
		assert.expect(5);
		var done = assert.async();
		var printStub = sinon.stub(window, "print", function(){
			//assert
			assert.ok(true, "Window print was called");
			assert.strictEqual(jQuery("#apfPrintArea").length, 1, "then, print Area Injected into the DOM");
			assert.strictEqual(oGlobalApi.oCoreApi.getApplicationConfigProperties.calledOnce, true, "then, configuration properties of application has been fetched");
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps.calledOnce, true, "then, steps has been captured");
			assert.strictEqual(oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().type, "TableRepresentation", "then Given step is table representation");
			//cleanup
			oGlobalApi.oCoreApi.getApplicationConfigProperties.restore();
			oGlobalApi.oCoreApi.getSteps.restore();
			printStub.restore();
			done();
		});
		//arrange
		this.bIsTable = true;
		sinon.stub(oGlobalApi.oCoreApi, "getApplicationConfigProperties", _getApplicationConfigPropertiesStub);
		sinon.stub(oGlobalApi.oCoreApi, "getSteps", getStepsStub.bind(this));
		//action
		printHelper.doPrint();  //KS there is much more, that has been done - test does not check this
	});
}());
