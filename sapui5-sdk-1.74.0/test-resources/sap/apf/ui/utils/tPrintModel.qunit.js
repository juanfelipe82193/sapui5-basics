/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require('sap.apf.ui.representations.RepresentationInterfaceProxy');
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.ui.utils.printModel');
jQuery.sap.require('sap.apf.ui.representations.lineChart');
jQuery.sap.require("sap.ui.table.Table");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.declare('test.sap.apf.ui.utils.tPrintModel');
(function() {
	'use strict';
	var oInject,
		printModel,
		aSampleData;
	function _getExpectedAppFilters() {
		var appExpected = [ {
			sFilterName : "Currency Exchange Rate Type",
			sFilterValue : "M"
		}, {
			sFilterName : "Currency Exchange Rate Type",
			sFilterValue : "00000000"
		}, {
			sFilterName : "Currency Exchange Rate Type",
			sFilterValue : "USD"
		} ];
		return appExpected;
	}
	function _getPrintFormattedFiltersExpected() {
		var aFilterExpected = _getExpectedAppFilters();
		aFilterExpected.push({
			sFilterName : "Facet Filter",
			sFilterValue : "text, text2"
		});
		return aFilterExpected;
	}
	function _getPrintFormattedSmartFiltersExpected() {
		var aSmartFiltersObjectExpected = _getExpectedAppFilters();
		aSmartFiltersObjectExpected.push({
			sFilterName : "SAPClient",
			sFilterValue : "=777"
		}, {
			sFilterName : "CompanyCode",
			sFilterValue : "AR10...BR10"
		}, {
			sFilterName : "CustomerCountry",
			sFilterValue : "=KR"
		});
		return aSmartFiltersObjectExpected;
	}
	function _getallInternalIdsStub() {
		var aAllAppSpecificFilterIds = [];
		aAllAppSpecificFilterIds[0] = 1;
		aAllAppSpecificFilterIds[1] = 2;
		aAllAppSpecificFilterIds[2] = 3;
		return aAllAppSpecificFilterIds;
	}
	function _getFilterFromInternalIdsStub(appSpecificFilter) {
		var obj = new sap.apf.utils.Filter();
		if (appSpecificFilter === 1) {
			obj.getExpressions = function() {
				var obj1 = {
					name : "P_ExchangeRateType",
					operator : "EQ",
					value : [ [ "M" ] ]
				};
				return [ [ obj1 ] ];
			};
		} else if (appSpecificFilter === 2) {
			obj.getExpressions = function() {
				var obj1 = {
					name : "P_ExchangeRateDate",
					operator : "EQ",
					value : [ [ "00000000" ] ]
				};
				return [ [ obj1 ] ];
			};
		} else if (appSpecificFilter === 3) {
			obj.getExpressions = function() {
				var obj1 = {
					name : "P_DisplayCurrency",
					operator : "EQ",
					value : [ [ "USD" ] ]
				};
				return [ [ obj1 ] ];
			};
		}
		return obj;
	}
	function _getMetadataFacadeStub() {
		return {
			getProperty : function(name) {
				var deferred = jQuery.Deferred();
				var propertyType = {
					label : "Currency Exchange Rate Type",
					name : "P_ExchangeRateType"
				};
				deferred.resolve(propertyType);
				return deferred.promise();
			}
		};
	}
	function _getFacetFilterForPrintStubWithSelectedItems() {
		var obj = {};
		var oFacetFilter = [ {
			length : 1,
			getTitle : function() {
				return "Facet Filter";
			},
			getSelectedItems : function() { 
				return [new sap.ui.core.Item({
					text : "text"
				}), new sap.ui.core.Item({
					text : "text2"
				})];
			}
		} ];
		obj.getLists = function() {
			return oFacetFilter;
		};
		return obj;
	}
	function _getFacetFilterForPrintStubWithoutSelectedItems() {
		var obj = {};
		var oFacetFilter = [ {
			length : 1,
			getTitle : function() {
				return "Facet Filter";
			},
			getSelectedItems : function() {
				return [];
			},
			getItems : function() {
				var obj = [ new sap.ui.core.Item({
					text : "text"
				}) ];
				return obj;
			}
		} ];
		obj.getLists = function() {
			return oFacetFilter;
		};
		return obj;
	}
	function _doNothing() {
		return undefined;
	}
	function _getSmartFilterForPrintStub() {
		return {
			getFilterData : function() {
				return {
					"SAPClient" : {},
					"CompanyCode" : {},
					"CustomerCountry" : {}
				};
			},
			getFilters : function() {
				return [ {
					aFilters : [ {
						aFilters : [ {
							sPath : "SAPClient",
							sOperator : "EQ",
							oValue1 : "777",
							oValue2 : "",
							_bMultiFilter : false
						} ]
					}, {
						aFilters : [ {
							sPath : "CompanyCode",
							sOperator : "BT",
							oValue1 : "AR10",
							oValue2 : "BR10",
							_bMultiFilter : false
						} ]
					}, {
						aFilters : [ {
							sPath : "CustomerCountry",
							sOperator : "EQ",
							oValue1 : "KR",
							oValue2 : "",
							_bMultiFilter : false
						} ]
					} ]
				} ];
			},
			getAnalyticalParameters : function(){}
		};
	}
	function _getStepsStubOfTableRep() {
         var titleControl = new sap.m.Title({
				level : sap.ui.core.TitleLevel.H1
			}).addStyleClass("sapUiTinyMarginBegin").addStyleClass("sapUiTinyMarginTop");
		 titleControl.oParent = new sap.m.HBox();
		 titleControl.oParent.addItem(new sap.m.Title());
		 titleControl.oParent.addItem(new sap.m.HBox());
       return [ {
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
					setData : _doNothing
				};
			}
		} ];
	}
	function getStepsStub(oGlobalApi) {
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
		return oGetStepsOfLineChart;
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
	function _getAnalysisPathStub() {
		var oSavedPathName = {};
		oSavedPathName.getTitle = function() {
			return "*Unnamed Analysis Path";
		};
		return {
			oSavedPathName : oSavedPathName
		};
	}
	QUnit.module("Print Model Tests", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			new sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				aSampleData = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				oInject = {
					oCoreApi : that.oGlobalApi.oCoreApi,
					uiApi : that.oGlobalApi.oUiApi,
					oFilterIdHandler : that.oGlobalApi.oFilterIdHandler
				};
				printModel = new sap.apf.ui.utils.PrintModel(oInject);
				done();
			});
		},
		afterEach : function() {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When printing in presence of facet and application filters", function(assert) {
		//arrange
		sinon.stub(this.oGlobalApi.oUiApi, "getFacetFilterForPrint", _getFacetFilterForPrintStubWithSelectedItems);
		sinon.stub(this.oGlobalApi.oUiApi, "getSmartFilterForPrint", _doNothing);
		sinon.stub(this.oGlobalApi.oFilterIdHandler, "getAllInternalIds", _getallInternalIdsStub);
		sinon.stub(this.oGlobalApi.oFilterIdHandler, "get", _getFilterFromInternalIdsStub);
		sinon.stub(this.oGlobalApi.oCoreApi, "getMetadataFacade", _getMetadataFacadeStub);
		//assert
		assert.deepEqual(printModel.getFiltersToPrint(), _getPrintFormattedFiltersExpected(), "Facet and application Filters are configured for print");
		//cleanup
		this.oGlobalApi.oUiApi.getFacetFilterForPrint.restore();
		this.oGlobalApi.oUiApi.getSmartFilterForPrint.restore();
		this.oGlobalApi.oFilterIdHandler.getAllInternalIds.restore();
		this.oGlobalApi.oFilterIdHandler.get.restore();
		this.oGlobalApi.oCoreApi.getMetadataFacade.restore();
	});
	QUnit.test("When printing empty facetFilters", function(assert) {
		//arrange
		sinon.stub(this.oGlobalApi.oUiApi, "getFacetFilterForPrint", _getFacetFilterForPrintStubWithoutSelectedItems);
		sinon.stub(this.oGlobalApi.oUiApi, "getSmartFilterForPrint", _doNothing);
		//assert
		assert.deepEqual(printModel.getFiltersToPrint(), [{
			sFilterName : "Facet Filter",
			sFilterValue : this.oGlobalApi.oCoreApi.getTextNotHtmlEncoded("noSelectionInFilter")
		}], "Facet Filter is returned with 'no selected values'");
		//cleanup
		this.oGlobalApi.oUiApi.getFacetFilterForPrint.restore();
		this.oGlobalApi.oUiApi.getSmartFilterForPrint.restore();
	});
	QUnit.test("When printing in presence of smart and application filters", function(assert) {
		// arrange
		sinon.stub(this.oGlobalApi.oUiApi, "getFacetFilterForPrint", _doNothing);
		sinon.stub(this.oGlobalApi.oUiApi, "getSmartFilterForPrint", _getSmartFilterForPrintStub);
		sinon.stub(this.oGlobalApi.oFilterIdHandler, "getAllInternalIds", _getallInternalIdsStub);
		sinon.stub(this.oGlobalApi.oFilterIdHandler, "get", _getFilterFromInternalIdsStub);
		sinon.stub(this.oGlobalApi.oCoreApi, "getMetadataFacade", _getMetadataFacadeStub);
		//assert
		assert.deepEqual(printModel.getFiltersToPrint(), _getPrintFormattedSmartFiltersExpected(), "Smart and application Filters are configured for print");
		//cleanup
		this.oGlobalApi.oUiApi.getFacetFilterForPrint.restore();
		this.oGlobalApi.oUiApi.getSmartFilterForPrint.restore();
		this.oGlobalApi.oFilterIdHandler.getAllInternalIds.restore();
		this.oGlobalApi.oFilterIdHandler.get.restore();
		this.oGlobalApi.oCoreApi.getMetadataFacade.restore();
	});
	QUnit.test("When printing in presence of only application filters", function(assert) {
		// arrange
		sinon.stub(this.oGlobalApi.oUiApi, "getFacetFilterForPrint", _doNothing);
		sinon.stub(this.oGlobalApi.oUiApi, "getSmartFilterForPrint", _doNothing);
		sinon.stub(this.oGlobalApi.oFilterIdHandler, "getAllInternalIds", _getallInternalIdsStub);
		sinon.stub(this.oGlobalApi.oFilterIdHandler, "get", _getFilterFromInternalIdsStub);
		sinon.stub(this.oGlobalApi.oCoreApi, "getMetadataFacade", _getMetadataFacadeStub);
		//assert
		assert.deepEqual(printModel.getFiltersToPrint(), _getExpectedAppFilters(), "Only application Filters are configured for print");
		//cleanup
		this.oGlobalApi.oUiApi.getFacetFilterForPrint.restore();
		this.oGlobalApi.oUiApi.getSmartFilterForPrint.restore();
		this.oGlobalApi.oFilterIdHandler.getAllInternalIds.restore();
		this.oGlobalApi.oFilterIdHandler.get.restore();
		this.oGlobalApi.oCoreApi.getMetadataFacade.restore();
	});
	QUnit.test("When printing in presence of no filters", function(assert) {
		// arrange
		sinon.stub(this.oGlobalApi.oUiApi, "getFacetFilterForPrint", _doNothing);
		sinon.stub(this.oGlobalApi.oUiApi, "getSmartFilterForPrint", _doNothing);
		//assert
		assert.deepEqual(printModel.getFiltersToPrint(), [], "No Filters are configured for print");
		//cleanup
		this.oGlobalApi.oUiApi.getFacetFilterForPrint.restore();
		this.oGlobalApi.oUiApi.getSmartFilterForPrint.restore();
	});
	QUnit.test("when printing in presence of header", function(assert) {
		var headerName = "*Unnamed Analysis Path";
		sinon.stub(this.oGlobalApi.oUiApi, "getAnalysisPath", _getAnalysisPathStub);
		assert.deepEqual(printModel.getHeaderForFirstPage(), headerName, "Header is coming for first pages");
	});
	QUnit.test("When printing table representation", function(assert) {
		// arrange
		sinon.stub(this.oGlobalApi.oCoreApi, "getSteps", _getStepsStubOfTableRep);
		//action
		var oTable = printModel.getRepresentationForPrint(_getStepsStubOfTableRep()[0]);
		//assert
		assert.strictEqual(this.oGlobalApi.oCoreApi.getSteps()[0].getSelectedRepresentation().type, "TableRepresentation", "then given step is table representation");
		assert.strictEqual(oTable instanceof sap.ui.table.Table, true, "table Representation for print");
		//cleanup
		this.oGlobalApi.oCoreApi.getSteps.restore();
	});
	QUnit.test("When printing line chart", function(assert) {
		// arrange
		sinon.stub(this.oGlobalApi.oCoreApi, "getSteps", getStepsStub);
		var oChartClone = printModel.getRepresentationForPrint(getStepsStub(this.oGlobalApi)[0]);
		//assert 
		assert.strictEqual(this.oGlobalApi.oCoreApi.getSteps(this.oGlobalApi)[0].getSelectedRepresentation().type, "LineChart", "then given step is line chart");
		assert.strictEqual(oChartClone.getVizType(), "line", true, "line chart for print");
		//cleanup
		this.oGlobalApi.oCoreApi.getSteps.restore();
	});
	QUnit.module("Print with smartFilterbar with parameters", {
		beforeEach : function() {
			var context = this;
			this.filterData = {};
			this.analyticalParameters = [];
			this.filters = [];
			var smartFilterBar = {
				getFilterData : function(){
					return context.filterData;
				},
				getFilters : function(aProperties){
					return context.filters;
				},
				getAnalyticalParameters : function(){
					return context.analyticalParameters;
				}
			};
			var oInject = {
				uiApi : {
					getFacetFilterForPrint : function(){},
					getSmartFilterForPrint : function(){
						return smartFilterBar;
					},
					getCustomFormatExit  : function(){},
					getEventCallback : function(){}
				},
				oCoreApi : {
					getTextNotHtmlEncoded : function(key, parameters){
						if(key === "EQ"){
							return "=" + parameters[0];
						}
						return key;
					},
					getMessageHandler : function(){
						return {
							check : function(){}
						};
					},
					getMetadataFacade : function(){
						return {
							getProperty : function(property){
								if(property === "P_Currency" || property === "P_FromDate" || property === "Country"){
									return jQuery.Deferred().resolve({
										type : "Edm.String"
									});
								}
							}
						};
					}
				},
				oFilterIdHandler : {
					getAllInternalIds : function(){
						return [];
					}
				}
			};
			this.printModel = new sap.apf.ui.utils.PrintModel(oInject);
		}
	});
	QUnit.test("Without any Filters", function(assert) {
		assert.deepEqual(this.printModel.getFiltersToPrint(), [], "Returns an empty array");
	});
	QUnit.test("With only parameters", function(assert) {
		//arrange
		this.filterData["$Parameter.P_Currency"] = "USD";
		this.analyticalParameters.push({
			fieldName : "$Parameter.P_Currency",
			fieldNameOData : "P_Currency"
		});
		this.filterData["$Parameter.P_FromDate"] = "20170512";
		this.analyticalParameters.push({
			fieldName : "$Parameter.P_FromDate",
			fieldNameOData : "P_FromDate"
		});
		//assert
		assert.deepEqual(this.printModel.getFiltersToPrint(), [{
			sFilterName : "P_Currency",
			sFilterValue : "=USD"
		}, {
			sFilterName : "P_FromDate",
			sFilterValue : "=20170512"
		}], "Returns array with parameter values");
	});
	QUnit.test("With parameter and filter", function(assert) {
		//arrange
		this.filterData["$Parameter.P_Currency"] = "USD";
		this.analyticalParameters.push({
			fieldName : "$Parameter.P_Currency",
			fieldNameOData : "P_Currency"
		});
		this.filterData["Country"] = {};
		this.filters.push(new sap.ui.model.Filter({
			path: "Country",
			operator: "EQ",
			value1: "DE"
		}));
		//assert
		assert.deepEqual(this.printModel.getFiltersToPrint(), [{
			sFilterName : "P_Currency",
			sFilterValue : "=USD"
		}, {
			sFilterName : "Country",
			sFilterValue : "=DE"
		}], "Returns array with parameter and filter values");
	});
}());
