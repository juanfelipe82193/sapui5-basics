/* This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. */

jQuery.sap.declare('sap.apf.withServer.tMetadata');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.ajax');
jQuery.sap.require('sap.apf.core.sessionHandler');
jQuery.sap.require('sap.apf.core.odataRequest');
jQuery.sap.require('sap.ui.model.odata.ODataModel');
jQuery.sap.require('sap.apf.core.metadata');
jQuery.sap.require('sap.apf.testhelper.createDefaultAnnotationHandler');
(function() {
	'use strict';
	/*globals OData, window */
	if (!sap.apf.withServer.tMetadata) {
		sap.apf.withServer.tMetadata = {};
		sap.apf.withServer.tMetadata.commonIsolatedSetup = function(oContext) {
			oContext.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
			oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler : oContext.oMessageHandler
				}
			});
			oContext.oCoreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			oContext.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					},
					functions : {
						getSapSystem : function() {}
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			oContext.oMetadataInject = {};
			oContext.oMetadataInject.instances = {};
			oContext.oMetadataInject.constructors = {};
			oContext.oMetadataInject.instances.coreApi = oContext.oCoreApi;
			oContext.oMetadataInject.instances.messageHandler = oContext.oMessageHandler;
			oContext.oMetadataInject.functions = {
					getSapSystem : function() {}
			};
			oContext.oMetadataInject.constructors.Hashtable = sap.apf.utils.Hashtable;
			oContext.oMetadataInject.constructors.EntityTypeMetadata = sap.apf.core.EntityTypeMetadata;
			oContext.oMetadataInject.instances.annotationHandler = sap.apf.testhelper.createDefaultAnnotationHandler();
		};
	}
	QUnit.module('Metadata', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.withServer.tMetadata.commonIsolatedSetup(this);
			this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
				done();
			});
			this.oCoreApi.getXsrfToken = function(sServiceRootPath) {
				return this.oAuthTestHelper.getXsrfToken();
			}.bind(this);
		}
	});
	QUnit.test('Get metadata for property', function(assert) {
		assert.expect(9);
		var done = assert.async();
		var oCompanyCode = {
				  "aggregation-role": "dimension",
				  "com.sap.vocabularies.Analytics.v1.Dimension": {
					    "Bool": "true"
					  },
				  "com.sap.vocabularies.Common.v1.Label": {
				    "String": "Company Code"
				  },
				  "com.sap.vocabularies.Common.v1.Text": {
				    "Path": "CompanyCodeName"
				  },
				  "dataType": {
				    "maxLength": "4",
				    "type": "Edm.String"
				  },
				  "dimension": "true",
				  "extensions": [
				    {
				      "name": "label",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "Company Code"
				    },
				    {
				      "name": "aggregation-role",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "dimension"
				    },
				    {
				      "name": "text",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "CompanyCodeName"
				    }
				  ],
				  "label": "Company Code",
				  "maxLength": "4",
				  "name": "CompanyCode",
				  "sap:aggregation-role": "dimension",
				  "sap:label": "Company Code",
				  "sap:text": "CompanyCodeName",
				  "text": "CompanyCodeName",
				  "type": "Edm.String"
		};
		var oSAPClient = {
				  "aggregation-role": "dimension",
				  "com.sap.vocabularies.Analytics.v1.Dimension": {
					    "Bool": "true"
				  },
				  "com.sap.vocabularies.Common.v1.Label": {
				    "String": "SAP Client"
				  },
				  "dataType": {
				    "maxLength": "3",
				    "type": "Edm.String"
				  },
				  "dimension": "true",
				  "extensions": [
				    {
				      "name": "label",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "SAP Client"
				    },
				    {
				      "name": "aggregation-role",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "dimension"
				    }
				  ],
				  "label": "SAP Client",
				  "maxLength": "3",
				  "name": "SAPClient",
				  "sap:aggregation-role": "dimension",
				  "sap:label": "SAP Client",
				  "type": "Edm.String"
				};
		var oNetDueDays = {
				  "aggregation-role": "dimension",
				  "com.sap.vocabularies.Analytics.v1.Dimension": {
					    "Bool": "true"
				  },
				  "com.sap.vocabularies.Common.v1.Label": {
				    "String": "Net Due Days"
				  },
				  "dataType": {
				    "type": "Edm.Int32"
				  },
				  "dimension": "true",
				  "extensions": [
				    {
				      "name": "label",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "Net Due Days"
				    },
				    {
				      "name": "aggregation-role",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "dimension"
				    }
				  ],
				  "label": "Net Due Days",
				  "name": "NetDueDays",
				  "sap:aggregation-role": "dimension",
				  "sap:label": "Net Due Days",
				  "type": "Edm.Int32"
				};
		var oPostingDate = 	
		{
				  "aggregation-role": "dimension",
				  "com.sap.vocabularies.Analytics.v1.Dimension": {
					    "Bool": "true"
				  },
				  "com.sap.vocabularies.Common.v1.Label": {
				    "String": "Posting Date"
				  },
				  "dataType": {
				    "type": "Edm.DateTime"
				  },
				  "display-format": "Date",
				  "dimension": "true",
				  "extensions": [
				    {
				      "name": "display-format",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "Date"
				    },
				    {
				      "name": "label",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "Posting Date"
				    },
				    {
				      "name": "aggregation-role",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "dimension"
				    }
				  ],
				  "label": "Posting Date",
				  "name": "PostingDate_E",
				  "sap:aggregation-role": "dimension",
				  "sap:display-format": "Date",
				  "sap:label": "Posting Date",
				  "type": "Edm.DateTime"
				};
		var oDebitAmtInDisplayCrcy = {
				  "ISOCurrency": "DisplayCurrency",
				  "Measure.Scale": {
				    "Path": "DisplayCurrencyDecimals"
				  },
				  "Org.OData.Measures.V1.ISOCurrency": {
				    "Path": "DisplayCurrency"
				  },
				  "aggregation-role": "measure",
				  "com.sap.vocabularies.Analytics.v1.Measure": {
					    "Bool": "true"
					  },
				  "com.sap.vocabularies.Common.v1.Label": {
				    "String": "Receivables in Display Currency"
				  },
				  "dataType": {
				    "precision": "26",
				    "type": "Edm.Decimal"
				  },
				  "extensions": [
				    {
				      "name": "filterable",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "false"
				    },
				    {
				      "name": "label",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "Receivables in Display Currency"
				    },
				    {
				      "name": "aggregation-role",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "measure"
				    },
				    {
				      "name": "unit",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "DebitAmtInDisplayCrcy_E.CURRENCY"
				    }
				  ],
				  "filterable": "false",
				  "label": "Receivables in Display Currency",
				  "measure": "true",
				  "name": "DebitAmtInDisplayCrcy_E",
				  "precision": "26",
				  "sap:aggregation-role": "measure",
				  "sap:filterable": "false",
				  "sap:label": "Receivables in Display Currency",
				  "sap:unit": "DebitAmtInDisplayCrcy_E.CURRENCY",
				  "scale": "DisplayCurrencyDecimals",
				  "type": "Edm.Decimal",
				  "unit": "DebitAmtInDisplayCrcy_E.CURRENCY"
				};
		var oYearMonth = {
				  "aggregation-role": "dimension",
				  "com.sap.vocabularies.Common.v1.IsCalendarYearMonth": {},
				  "com.sap.vocabularies.Analytics.v1.Dimension": {
					    "Bool": "true"
					  },
				  "com.sap.vocabularies.Common.v1.Label": {
				    "String": "Year and Month"
				  },
				  "dataType": {
				    "maxLength": "6",
				    "type": "Edm.String"
				  },
				  "dimension": "true",
				  "extensions": [
				    {
				      "name": "label",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "Year and Month"
				    },
				    {
				      "name": "aggregation-role",
				      "namespace": "http://www.sap.com/Protocols/SAPData",
				      "value": "dimension"
				    }
				  ],
				  "isCalendarYearMonth": "true",
				  "label": "Year and Month",
				  "maxLength": "6",
				  "name": "YearMonth",
				  "sap:aggregation-role": "dimension",
				  "sap:label": "Year and Month",
				  "type": "Edm.String"
		};
		
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		oMetadata.isInitialized().done(function(){
			assert.equal(oMetadata.getPropertyMetadata("WCAReceivableQuery", "FiscalYear").isFiscalYear, "true", 'Metadata shall contain the annotation');
			assert.deepEqual(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "CompanyCode"), oCompanyCode, 'All metadata of the property ("Edm.Decimal, Precision:"34") received');
			assert.deepEqual(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "SAPClient"), oSAPClient, 'All metadata of the property ("Edm.String", MaxLength:"3") received');
			assert.deepEqual(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "NetDueDays"), oNetDueDays, 'All metadata of the property ("Edm.Int32") received');
			assert.deepEqual(oMetadata.getPropertyMetadata("WCAOpenReceivableQuery", "PostingDate_E"), oPostingDate, 'All metadata of the property ("Edm.DateTime") received');
			assert.deepEqual(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "YearMonth"), oYearMonth, 'Annotation "yearmonth" of the property YearMonth contains value "yyyymm"');
			assert.deepEqual(oMetadata.getPropertyMetadata("WCAClearedReceivableQuery", "DebitAmtInDisplayCrcy_E"), oDebitAmtInDisplayCrcy,
			'Entity type DebitAmtInDisplayCrcy_E: annotation "unit" of the property DebitAmtInDisplayCrcy_E contains value "DisplayCurrency"');
			assert.equal(oMetadata.getPropertyMetadata("YearMonthQueryResults", "Year").isCalendarYear, "true", "Property 'Year' of entity set 'YearMonthQueryResults' has attribute 'isCalendarYear'");
			assert.equal(oMetadata.getPropertyMetadata("YearMonthQueryResults", "StartDate").isCalendarDate, "true", "Property 'StartDate' of entity set 'YearMonthQueryResults' has attribute 'isCalendarDate'");
			done();
		});
	});
	QUnit.test('Get parameters for entity type', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		var expectedResult = [
								                      {
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "SAP Client"
									},
									"dataType" : {
										"maxLength" : "3",
										"type" : "Edm.String"
									},
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "SAP Client"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isKey" : true,
									"label" : "SAP Client",
									"maxLength" : "3",
									"name" : "P_SAPClient",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "SAP Client",
									"sap:parameter" : "mandatory",
									"type" : "Edm.String"
								},
								{
									"com.sap.vocabularies.Common.v1.IsCalendarDate" : {},
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "From Date"
									},
									"dataType" : {
										"maxLength" : "8",
										"type" : "Edm.String"
									},
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "From Date"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isCalendarDate" : "true",
									"isKey" : true,
									"label" : "From Date",
									"maxLength" : "8",
									"name" : "P_FromDate",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "From Date",
									"sap:parameter" : "mandatory",
									"type" : "Edm.String"
								},
								{
									"com.sap.vocabularies.Common.v1.IsCalendarDate" : {},
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "To Date"
									},
									"dataType" : {
										"maxLength" : "8",
										"type" : "Edm.String"
									},
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "To Date"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isCalendarDate" : "true",
									"isKey" : true,
									"label" : "To Date",
									"maxLength" : "8",
									"name" : "P_ToDate",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "To Date",
									"sap:parameter" : "mandatory",
									"type" : "Edm.String"
								},
								{
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "Display Currency"
									},
									"dataType" : {
										"maxLength" : "5",
										"type" : "Edm.String"
									},
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "Display Currency"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isKey" : true,
									"label" : "Display Currency",
									"maxLength" : "5",
									"name" : "P_DisplayCurrency",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "Display Currency",
									"sap:parameter" : "mandatory",
									"type" : "Edm.String"
								},
								{
									"Sap.Wca.DefaultValue" : {
										"String" : "M"
									},
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "Currency Exchange Rate Type"
									},
									"dataType" : {
										"maxLength" : "4",
										"type" : "Edm.String"
									},
									"defaultValue" : "M",
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "Currency Exchange Rate Type"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isKey" : true,
									"label" : "Currency Exchange Rate Type",
									"maxLength" : "4",
									"name" : "P_ExchangeRateType",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "Currency Exchange Rate Type",
									"sap:parameter" : "mandatory",
									"type" : "Edm.String"
								},
								{
									"Sap.Wca.DefaultValue" : {
										"String" : "00000000"
									},
									"com.sap.vocabularies.Common.v1.IsCalendarDate" : {},
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "Currency Exchange Rate Date"
									},
									"dataType" : {
										"maxLength" : "8",
										"type" : "Edm.String"
									},
									"defaultValue" : "00000000",
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "Currency Exchange Rate Date"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isCalendarDate" : "true",
									"isKey" : true,
									"label" : "Currency Exchange Rate Date",
									"maxLength" : "8",
									"name" : "P_ExchangeRateDate",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "Currency Exchange Rate Date",
									"sap:parameter" : "mandatory",
									"type" : "Edm.String"
								},
								{
									"Sap.Wca.DefaultValue" : {
										"Int" : "10"
									},
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "Width of Aging Interval"
									},
									"dataType" : {
										"type" : "Edm.Int32"
									},
									"defaultValue" : "10",
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "Width of Aging Interval"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isKey" : true,
									"label" : "Width of Aging Interval",
									"name" : "P_AgingGridMeasureInDays",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "Width of Aging Interval",
									"sap:parameter" : "mandatory",
									"type" : "Edm.Int32"
								},
								{
									"Sap.Wca.DefaultValue" : {
										"Int" : "10"
									},
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "Width of Net Due Days Interval"
									},
									"dataType" : {
										"type" : "Edm.Int32"
									},
									"defaultValue" : "10",
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "Width of Net Due Days Interval"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isKey" : true,
									"label" : "Width of Net Due Days Interval",
									"name" : "P_NetDueGridMeasureInDays",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "Width of Net Due Days Interval",
									"sap:parameter" : "mandatory",
									"type" : "Edm.Int32"
								},
								{
									"Sap.Wca.DefaultValue" : {
										"Int" : "10"
									},
									"com.sap.vocabularies.Common.v1.Label" : {
										"String" : "Width of Days in Arrears Interval"
									},
									"dataType" : {
										"type" : "Edm.Int32"
									},
									"defaultValue" : "10",
									"extensions" : [
											{
												"name" : "label",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "Width of Days in Arrears Interval"
											},
											{
												"name" : "parameter",
												"namespace" : "http://www.sap.com/Protocols/SAPData",
												"value" : "mandatory"
											} ],
									"isKey" : true,
									"label" : "Width of Days in Arrears Interval",
									"name" : "P_NetDueArrearsGridMsrInDays",
									"nullable" : "false",
									"parameter" : "mandatory",
									"sap:label" : "Width of Days in Arrears Interval",
									"sap:parameter" : "mandatory",
									"type" : "Edm.Int32"
								} ];
		expectedResult.forEach(function(property) {
			property.isKey = true;
		});
		oMetadata.isInitialized().done(function(metadata) {
			assert.deepEqual(metadata.getParameterEntitySetKeyProperties("WCADaysSalesOutstandingQuery"), expectedResult, 'Nine parameters with their attributes expected');
			done();
		});
	});
	QUnit.test('getParameterEntitySetKeyProperties() called without parameter', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		oMetadata.isInitialized().done(function(metadata) {
			assert.throws(function() {
				metadata.getParameterEntitySetKeyProperties();
			}, "Error successfully thrown due to missing argument for getParameterEntitySetKeyProperties");
			done();
		});
	});
	QUnit.test('Get filterable properties of entity type', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		oMetadata.isInitialized().done(function(metadata) {
			assert.deepEqual(metadata.getFilterableProperties("CurrencyQuery"), [ "SAPClient", "Currency", "CurrencyShortName" ], 'Array with property names expected');
			done();
		});
	});
	QUnit.test('Get metadata for an entitytype', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oExpected = {
				"requiresFilter" : "true",
				"requiredProperties" : "SAPClient"
		};
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		oMetadata.isInitialized().done(function(metadata) {
			assert.deepEqual(metadata.getEntityTypeAnnotations("CurrencyQuery"), oExpected);
			done();
		});
	});
	QUnit.module('Metadata hash behavior', {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.withServer.tMetadata.commonIsolatedSetup(this);
			this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
				done();
			});
			this.oCoreApi.getXsrfToken = function(sServiceRootPath) {
				return this.oAuthTestHelper.getXsrfToken();
			}.bind(this);
		}
	});
	QUnit.test('Check is "getPropertyMetadata" return the same object reference as before', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		oMetadata.isInitialized().done(function(metadata) {
			assert.ok(oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "CompanyCode") === oMetadata.getPropertyMetadata("WCADaysSalesOutstandingQuery", "CompanyCode"), 'Same object reference expected');
			done();
		});
	});
	QUnit.test('Check is "getParameterEntitySetKeyProperties" return the same object reference as before', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		oMetadata.isInitialized().done(function(metadata) {
			assert.ok(oMetadata.getParameterEntitySetKeyProperties("WCADaysSalesOutstandingQuery") === oMetadata.getParameterEntitySetKeyProperties("WCADaysSalesOutstandingQuery"), 'Same object reference expected');
			done();
		});
	});
	QUnit.test('Check is "getEntityTypeAnnotations" return the same object reference as before', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		oMetadata.isInitialized().done(function(metadata) {
			assert.ok(oMetadata.getEntityTypeAnnotations("CurrencyQuery") === oMetadata.getEntityTypeAnnotations("CurrencyQuery"), 'Same object reference expected');
			done();
		});
	});
	QUnit.test('Check is "getFilterableProperties" return the same object reference as before', function(assert) {
		assert.expect(1);
		var done = assert.async();
		var oMetadata = new sap.apf.core.Metadata(this.oMetadataInject, "/sap/hba/apps/wca/dso/s/odata/wca.xsodata");
		oMetadata.isInitialized().done(function(metadata) {
			assert.ok(oMetadata.getFilterableProperties("WCAClearedReceivableQuery") === oMetadata.getFilterableProperties("WCAClearedReceivableQuery"), 'Same object reference expected');
			done();
		});
	});
})();