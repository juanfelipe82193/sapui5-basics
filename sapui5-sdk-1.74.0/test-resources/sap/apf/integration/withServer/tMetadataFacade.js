/* This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. */
(function() {
	'use strict';

	jQuery.sap.declare("sap.apf.integration.withServer.tMetadataFacade");
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.authTestHelper');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.internal.server.userData');
	jQuery.sap.require('sap.apf.api');


	QUnit.module("Metadata Facade", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			var component = {
					getComponentData : function() {
						return {
							startupParameters : {}
						};
					}
			};
			function Probe(dependencies) {
				that.coreApi = dependencies.coreApi;
				that.serializationMediator = dependencies.serializationMediator;
			}

			function UiInstance () {
							this.handleStartup = function() {
								return sap.apf.utils.createPromise();
							};
							this.createApplicationLayout = function() {
								
							};
			} 
			this.api = new sap.apf.Api(component, {
				probe : Probe,
				constructors : {
					UiInstance : UiInstance
				}
			});
			this.fnOriginalAjax = jQuery.ajax;
			sap.apf.testhelper.replacePathsInAplicationConfiguration(this.fnOriginalAjax);
			var sUrl = sap.apf.testhelper.determineTestResourcePath() + "/integration/withServer/integrationTestingApplicationConfiguration.json";
			this.coreApi.loadApplicationConfig(sUrl);
			this.testHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
				this.api.setCallbackAfterApfStartup(function() {
					done();
				});
				this.api.startApf();
			}.bind(this));
		},
		afterEach : function() {
			jQuery.ajax = this.fnOriginalAjax;
		}
	});
	QUnit.test("Get all properties from two different service documents", function(assert) {
		var done = assert.async();
		assert.expect(1);
		var callbackAllProperties = function(aProperties) {
			var expectedProperties = ["AmountInDisplayCurrency_E.CURRENCY", "ClrgDaysWgtdAmtInDisplayCrcy_E.CURRENCY", "NetDueDaysWgtdAmtInDisplCrcy_E.CURRENCY","P_NumberOfMonthsForReceivables","P_NumberOfMonthsForRevenue","RevenueAmountInDisplayCrcy_E.CURRENCY","RevenueAmountInDisplayCrcy_E","AccountingDocument","AccountingDocumentItem","FiscalYear","PostingDate_E","ClearingDate_E","NetDueDate_E","IsOpen","IsOverdue","DunningLevel","LastDunningDate_E","DebitAmtInDisplayCrcy_E.CURRENCY","OverdueDebitAmtInDisplayCrcy_E.CURRENCY","DebitAmtInDisplayCrcy_E","OverdueDebitAmtInDisplayCrcy_E","OverdueDebitPercent","P_SAPClient","P_FromDate","P_ToDate","P_DisplayCurrency","P_ExchangeRateType","P_ExchangeRateDate","P_AgingGridMeasureInDays","P_NetDueGridMeasureInDays","P_NetDueArrearsGridMsrInDays","Country","Language","ChartOfAccounts","FiscalYearVariant","Company","CountryChartOfAccounts","CreditControlArea","CityName","CountryName","Currency","CurrencyShortName","IsLeapYear","MonthName","Quarter","HalfYear","NumberOfDays","StartDate","EndDate","StartDate_E","EndDate_E","SourceCurrency","TargetCurrency","ExchangeRate","NumberOfSourceCurrencyUnits","NumberOfTargetCurrencyUnits","AlternativeExchangeRateType","AltvExchangeRateTypeValdtyDate","SourceCurrencyDecimals","TargetCurrencyDecimals","InvertedExchangeRateIsAllowed","ReferenceCurrency","BuyingRateAvgExchangeRateType","SellingRateAvgExchangeRateType","FixedExchangeRateIsUsed","SpecialConversionIsUsed","ExchangeRateTypeName","ExchangeRateEffectiveDate_E","SAPClientName","LogicalSystem","GenID","SAPClient","CompanyCode","CompanyCodeName","CompanyCodeCountry","CompanyCodeCountryName","CompanyCodeCountryISOCode","CompanyCodeCurrency","SalesOrganization","SalesOrganizationName","DistributionChannel","DistributionChannelName","Division","DivisionName","SalesDistrict","SalesDistrictName","CustomerGroup","CustomerGroupName","Year","Month","YearMonth","Customer","CustomerName","CustomerCountry","CustomerCountryName","CustomerCountryISOCode","AcctsReceivableItemAgeInDays","UpperBoundaryAgingGridDays","LowerBoundaryAgingGridDays","AgingGridText","AgingGridMeasureInDays","NetDueDays","UpperBoundaryNetDueGridDays","LowerBoundaryNetDueGridDays","NetDueGridText","NetDueGridMeasureInDays","NetDueArrearsDays","UprBndryNetDueArrearsGridDays","LowrBndryNetDueArrearsGridDays","NetDueArrearsGridText","NetDueArrearsGridMsrInDays","DisplayCurrency","DisplayCurrencyShortName","DisplayCurrencyDecimals","ExchangeRateType","ClrgDaysWgtdAmtInDisplayCrcy_E","NetDueDaysWgtdAmtInDisplCrcy_E","DaysSalesOutstanding","BestPossibleDaysSalesOutstndng","ArrearsDaysSalesOutstanding"];
			assert.deepEqual(aProperties, expectedProperties, "Different property names as expected");
			done();
		};
		this.coreApi.getMetadataFacade().getAllProperties(callbackAllProperties);
	});
	QUnit.test("Get all parameter entity set key properties from two different service documents", function(assert) {
		assert.expect(1);
		var done = assert.async();
		var callbackAllParameterEntitySetKeyProperties = function(aParameterEntitySetKeyProperties) {
			assert.equal(aParameterEntitySetKeyProperties.length, 11, "11 different parameter entity set key properties expected");
			done();
		};
		this.coreApi.getMetadataFacade().getAllParameterEntitySetKeyProperties(callbackAllParameterEntitySetKeyProperties);
	});
	QUnit.test("Get property from two different service documents", function(assert) {
		assert.expect(4);
		var done = assert.async();
	
		this.coreApi.getMetadataFacade().getProperty("CompanyCodeCountry").done(function(oProperty){
			//different checks on returned property
			assert.equal(oProperty.name, "CompanyCodeCountry", "Correct metadata property 'CompanyCodeCountry' returned");
			assert.equal(oProperty.getAttribute("maxLength"), 3, "Property has correct attribute 'MaxLength'");
			assert.equal(oProperty.isKey(), false, "Property 'CompanyCodeCountry' is no key");
			assert.equal(oProperty.isParameterEntitySetKeyProperty(), false, "Property 'CompanyCodeCountry' is no parameter key property");
			done();
		});
	});
	QUnit.test("Get annotation for property attribute from two different service documents", function(assert) {
		assert.expect(2);
		var done = assert.async();
	
		this.coreApi.getMetadataFacade().getProperty("P_FromDate").done(function(oProperty){
			//different checks on returned property
			assert.equal(oProperty.name, "P_FromDate", "Correct metadata property 'P_FromDate' returned");
			assert.equal(oProperty.getAttribute("isCalendarDate"), "true", "Property 'P_FromDate' has annotation");
			done();
		});
	});
	QUnit.test("Get key property from two different service documents", function(assert) {
		var done = assert.async();
		assert.expect(4);
		
		this.coreApi.getMetadataFacade().getProperty("P_SAPClient").done(function(oProperty){
			//different checks on returned property
			assert.equal(oProperty.name, "P_SAPClient", "Correct metadata property 'P_SAPClient' returned");
			assert.equal(oProperty.getAttribute("maxLength"), 3, "Property has correct attribute 'maxLength'");
			assert.equal(oProperty.isKey(), true, "Property 'P_SAPClient' is key");
			assert.equal(oProperty.isParameterEntitySetKeyProperty(), true, "Property 'P_SAPClient' is parameter key property");
			done();
		});
	});
}());