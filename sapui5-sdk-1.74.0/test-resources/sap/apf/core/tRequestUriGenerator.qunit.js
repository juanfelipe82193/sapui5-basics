jQuery.sap.declare("test.sap.apf.core.tRequestUriGenerator");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.request");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.ui.thirdparty.datajs");
/*global OData:true */
(function() {
	'use strict';
	function setupTestEnvironment(o) {
		function defineFilterOperators() {
			jQuery.extend(o, sap.apf.core.constants.FilterOperators);
		}
		o.Filter = sap.apf.core.utils.Filter;
		defineFilterOperators();
		var oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
		o.oMessageHandler = oMessageHandler;
		o.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : oMessageHandler
			}
		});
		o.oCoreApi.getXsrfToken = function() {
			return sap.apf.utils.createPromise();
		};
		o.oCoreApi.getStartParameterFacade = function() {
			return new sap.apf.utils.StartParameter();
		};
		o.oMetadataDouble = new sap.apf.testhelper.doubles.Metadata({
			instances : {
				messageHandler : oMessageHandler
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable
			}
		});
		o.oCoreApi.getMetadata = function() {
			return jQuery.Deferred().resolve(o.oMetadataDouble);
		};
		o.oCoreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		o.oCoreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
			var oInject = {
				instances : {
					datajs : {
						request : function(oRequest) {
							o.sRequestUri = oRequest.data.__batchRequests[0].requestUri;
							if(oRequest.data.__batchRequests[1]){
								o.secondRequestUri = oRequest.data.__batchRequests[1].requestUri;
							}
						}
					}
				},
				functions : {
					getSapSystem : function() {
						return undefined;
					}
				}
			};
			sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
		};
		o.oInject = {
			instances : {
				messageHandler : oMessageHandler,
				coreApi : o.oCoreApi
			}
		};
	}
	QUnit.module('Check generated URIs', {
		beforeEach : function(assert) {
			this.sRequestUri = '';
			setupTestEnvironment(this);
			this.request = new sap.apf.core.Request(this.oInject, {
				service : 'dummy',
				entityType : 'entityTypeWithParams',
				selectProperties : [ 'propertyOne', 'propertyTwo' ]
			});
		},
		afterEach : function(assert) {
		}
	});
	QUnit.test('Build uri with entity type and select fields', function(assert) {
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithoutParams',
			selectProperties : [ 'propertyOne', 'propertyTwo' ]
		});
		this.request.sendGetInBatch({});
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
		assert.equal(this.sRequestUri, sExpected, "");
	});
	QUnit.test('Build uri with parameters based on metadata with default values', function(assert) {
		this.request.sendGetInBatch({});
		var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=10)/Results?$select=propertyOne,propertyTwo&$format=json";
		QUnit.equal(this.sRequestUri, sExpected, 'Exact URI (case sensitive) expected');
	});
	QUnit.test('Build uri with optional parameter', function(assert) {
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithOptionalParam',
			selectProperties : [ 'propertyOne' ]
		});
		this.oMetadataDouble.addParameters('entityTypeWithOptionalParam', [ {
			'name' : 'p_stringParameter',
			'dataType' : {
				'type' : 'Edm.String'
			},
			'parameter' : 'optional'
		}]);
		this.request.sendGetInBatch({});
		var sExpected = "entityTypeWithOptionalParamResults?$select=propertyOne&$format=json";
		assert.equal(this.oMessageHandler.spyResults.putMessage, undefined, "No Message logged");
		assert.equal(this.sRequestUri, sExpected, 'Exact URI (case sensitive) expected');
	});
	QUnit.test('Build uri with parameters based on metadata and actual filter values (flat filter)', function(assert) {
		var oFilter = new this.Filter(this.oMessageHandler, 'p_int32Parameter', this.EQ, 4711);
		this.request.sendGetInBatch(oFilter);
		var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=4711)/Results?$select=propertyOne,propertyTwo&$format=json";
		QUnit.equal(this.sRequestUri, sExpected, 'Exact URI (case sensitive) expected');
	});
	QUnit.test('Build uri with filter validation request', function(assert) {
		var oFilter = new this.Filter(this.oMessageHandler, 'p_int32Parameter', this.EQ, 4711);
		oFilter.addAnd("FilterPropertyOne", "EQ", '1');
		var selectionFilter =  new sap.apf.core.utils.Filter(this.oMessageHandler, 'FilterPropertyTwo', this.EQ, '2');
		var selectionValidationRequest = {
				requiredFilterProperties : ["FilterPropertyTwo"], 
				selectionFilter : selectionFilter
		};
		this.request.sendGetInBatch(oFilter, undefined, undefined, selectionValidationRequest);
		var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=4711)/Results?$select=propertyOne,propertyTwo&$filter=(FilterPropertyOne%20eq%20%271%27)&$format=json";
		QUnit.equal(this.sRequestUri, sExpected, 'Exact URI (case sensitive) expected');
		QUnit.equal(this.secondRequestUri, "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=4711)/Results?$select=FilterPropertyTwo&$filter=((FilterPropertyOne%20eq%20%271%27)%20and%20(FilterPropertyTwo%20eq%20%272%27))&$format=json", 'Exact second URI (case sensitive) expected');
	});
	QUnit.test('Build uri with parameters based on metadata and actual filter values (two level filter)', function(assert) {
				var oFilter = new this.Filter(this.oMessageHandler, 'FilterPropertyOne', this.EQ, '10');
				oFilter.addOr('p_int32Parameter', this.EQ, 4711);
				oFilter.addOr('FilterPropertyTwo', this.LT, '200');
				var oNextLevelFilter = new this.Filter(this.oMessageHandler, 'FilterPropertyOne', this.EQ, '20');
				oNextLevelFilter.addOr('FilterPropertyThree', this.GT, '120');
				oNextLevelFilter.addOr('FilterPropertyFour', this.GT, '120');
				oNextLevelFilter.addOr('p_int32Parameter', this.EQ, 4712);
				var oCombinedFilter = new this.Filter(this.oMessageHandler, oFilter);
				oCombinedFilter.addAnd(oNextLevelFilter);
				this.request.sendGetInBatch(oCombinedFilter);
				var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=4712)/Results?$select=propertyOne,propertyTwo&$filter=(((FilterPropertyOne%20eq%20%2710%27)%20or%20(FilterPropertyTwo%20lt%20%27200%27))%20and%20((FilterPropertyOne%20eq%20%2720%27)%20or%20(FilterPropertyThree%20gt%20%27120%27)))&$format=json";
				QUnit.equal(this.sRequestUri, sExpected, 'Exact URI (case sensitive) expected');
			});
	QUnit.test('Build uri with parameters based on metadata and actual filter values (compound filter - three level filter)', function(assert) {
		var createCompound = function(sParameterValue) {
			var oCompound = new this.Filter(this.oMessageHandler, 'FilterPropertyOne', this.EQ, 'val1');
			oCompound.addAnd('p_int32Parameter', this.EQ, sParameterValue);
			oCompound.addAnd('FilterPropertyThree', this.EQ, 'val3');
			return oCompound;
		}.bind(this);
		var oFilter = new this.Filter(this.oMessageHandler, createCompound(4711));
		oFilter.addOr(createCompound(4712));
		var oNextLevelFilter = new this.Filter(this.oMessageHandler, createCompound(4713));
		oNextLevelFilter.addOr(createCompound(4714));
		var oCombinedFilter = new this.Filter(this.oMessageHandler, oFilter);
		oCombinedFilter.addAnd(oNextLevelFilter);
		this.request.sendGetInBatch(oCombinedFilter);
		var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=4714)/Results?$select=propertyOne,propertyTwo&$filter=((((FilterPropertyOne%20eq%20%27val1%27)%20and%20(FilterPropertyThree%20eq%20%27val3%27))%20or%20((FilterPropertyOne%20eq%20%27val1%27)%20and%20(FilterPropertyThree%20eq%20%27val3%27)))%20and%20(((FilterPropertyOne%20eq%20%27val1%27)%20and%20(FilterPropertyThree%20eq%20%27val3%27))%20or%20((FilterPropertyOne%20eq%20%27val1%27)%20and%20(FilterPropertyThree%20eq%20%27val3%27))))&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'Exact URI (case sensitive) expected');
	});
	QUnit.test('Build uri with more parameters than required by the view - superfluos parameters need to be removed from filter)', function(assert) {
		var oFilter = new this.Filter(this.oMessageHandler, 'p_int32Parameter', this.EQ, 4711);
		oFilter.addAnd('p_paramX', this.EQ, 4711);
		this.request.sendGetInBatch(oFilter);
		var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=4711)/Results?$select=propertyOne,propertyTwo&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'Exact URI (case sensitive) expected');
	});
	QUnit.test('Build uri with filters based on filter object', function(assert) {
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithoutParams',
			selectProperties : [ 'propertyOne', 'propertyTwo' ]
		});
		var oFilter = new this.Filter(this.oMessageHandler, 'FilterPropertyOne', this.EQ, 'val1');
		this.request.sendGetInBatch(oFilter);
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$filter=(FilterPropertyOne%20eq%20%27val1%27)&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'Exact URI (case sensitive) expected');
	});
	QUnit.test('OData query string paging options "top" and "skip" and "inlinecount"', function(assert) {
		var oRequestOptions = {
			paging : {
				top : 5,
				skip : 10,
				inlineCount : true
			}
		};
		this.request.sendGetInBatch({}, function() {
		}, oRequestOptions);
		var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=10)/Results?$select=propertyOne,propertyTwo&$top=5&$skip=10&$inlinecount=allpages&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'HANA view paging parameter values are correctly OData escaped and URL encoded');
	});
	QUnit.test('OData query string sorting option "orderby"', function(assert) {
		var oRequestOptions = {
			orderby : [ {
				property : 'propertyOne'
			}, {
				property : 'propertyTwo',
				ascending : false
			} ]
		};
		this.request.sendGetInBatch({}, function() {
		}, oRequestOptions);
		var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=10)/Results?$select=propertyOne,propertyTwo&$orderby=propertyOne%20asc,propertyTwo%20desc&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'HANA view orderby parameter values are correctly OData escaped and URL encoded');
	});
	QUnit.test('Negative Test: OData query string with misspelled sorting option "orderBy"', function(assert) {
		var oRequestOptions = {
			orderBy : [ {
				property : 'propertyOne'
			}, {
				property : 'propertyTwo',
				ascending : false
			} ]
		};
		this.oMessageHandler.spyPutMessage();
		this.request.sendGetInBatch({}, function() {
		}, oRequestOptions);
		var sExpected = "entityTypeWithParams(p_stringParameter=%27defaultString%27,p_int32Parameter=10)/Results?$select=propertyOne,propertyTwo&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'HANA view orderby omitted and OData escaped and URL encoded');
		assert.equal(this.oMessageHandler.spyResults.putMessage.code, "5032", "technical error has been logged");
	});
	QUnit.test('URL encoding for parameter key property values', function(assert) {
		var oFilter = new this.Filter(this.oMessageHandler, 'p_stringParameter', this.EQ, "Mr. O'Neil");
		oFilter.addAnd(new this.Filter(this.oMessageHandler, 'p_int32Parameter', this.EQ, 2));
		this.request.sendGetInBatch(oFilter);
		var sExpected = "entityTypeWithParams(p_stringParameter=%27Mr.%20O%27%27Neil%27,p_int32Parameter=2)/Results?$select=propertyOne,propertyTwo&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'parameter key property values are correctly OData escaped and URL encoded');
	});
	QUnit.test('URL encoding for parameter entity set key property value of type DateTime', function(assert) {
		this.oMetadataDouble.addNewParameter('entityTypeWithParams', {
			'name' : 'p_dateTimeParameter1',
			'dataType' : {
				'type' : 'Edm.DateTime'
			}
		});
		this.oMetadataDouble.addNewParameter('entityTypeWithParams', {
			'name' : 'p_dateTimeParameter2',
			'dataType' : {
				'type' : 'Edm.DateTime'
			}
		});
		sap.ui.getCore().getConfiguration().applySettings({
			language: 'de',
			calendarType: sap.ui.core.CalendarType.Gregorian
		});
		var oFilter = new this.Filter(this.oMessageHandler, 'p_stringParameter', this.EQ, "Mr. O'Neil");
		oFilter.addAnd(new this.Filter(this.oMessageHandler, 'p_int32Parameter', this.EQ, 2));
		oFilter.addAnd(new this.Filter(this.oMessageHandler, 'p_dateTimeParameter1', this.EQ, new Date(Date.UTC(1995, 11, 17, 3, 24))));
		oFilter.addAnd(new this.Filter(this.oMessageHandler, 'p_dateTimeParameter2', this.EQ, new Date(Date.UTC(2014,0,1))));
		this.request.sendGetInBatch(oFilter);
		
		assert.equal(this.sRequestUri , 
				'entityTypeWithParams(p_stringParameter=%27Mr.%20O%27%27Neil%27,p_int32Parameter=2,p_dateTimeParameter1=datetime%271995-12-17T03%3a24%3a00%27,p_dateTimeParameter2=datetime%272014-01-01T00%3a00%3a00%27)/Results?$select=propertyOne,propertyTwo&$format=json',
				'Parameter entity set key property values of type Edm.DateTime is correctly OData escaped and URL encoded' );
	});
	QUnit.test('URL encoding for select fields', function(assert) {
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithoutParams',
			selectProperties : [ "property O'ne", 'property Two' ]
		});
		this.request.sendGetInBatch({});
		var sExpected = "entityTypeWithoutParamsResults?$select=property%20O%27%27ne,property%20Two&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'Select fields are correctly OData escaped and URL encoded');
	});
	QUnit.test('URL encoding for filter values', function(assert) {
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithoutParams',
			selectProperties : [ 'property' ]
		});
		var oFilter = new this.Filter(this.oMessageHandler, "name", this.EQ, "O'Neil");
		oFilter.addAnd(new this.Filter(this.oMessageHandler, 'name', this.EQ, "O'Reilly"));
		oFilter.addAnd(new this.Filter(this.oMessageHandler, 'FilterPropertyOne', this.EQ, 10));
		this.request.sendGetInBatch(oFilter);
		var sExpected = "entityTypeWithoutParamsResults?$select=property&$filter=((name%20eq%20%27O%27%27Neil%27)%20and%20(name%20eq%20%27O%27%27Reilly%27)%20and%20(FilterPropertyOne%20eq%2010))&$format=json";
		assert.equal(this.sRequestUri, sExpected, 'Filter values are correctly OData escaped and URL encoded');
	});
	QUnit.test('URL encoding for filter values of type dateTime and time', function(assert) {
		this.request = new sap.apf.core.Request(this.oInject, {
			service : 'dummy',
			entityType : 'entityTypeWithoutParams',
			selectProperties : [ 'dateTimeProperty', 'timeProperty' ]
		});
		this.oMetadataDouble.setPropertyMetadata('entityTypeWithoutParams', [ {
			name : 'dateTimeProperty',
			metadata : {
				dataType : {
					type : 'Edm.DateTime'
				}
			}
		}, {
			name : 'timeProperty',
			metadata : {
				dataType : {
					type : 'Edm.Time'
				}
			}
		} ]);
		this.oMetadataDouble.addFilterableAnnotations('entityTypeWithoutParams', {
			'dateTimeProperty' : true,
			'timeProperty' : true
		});
		var oFilter = new this.Filter(this.oMessageHandler, "dateTimeProperty", this.EQ, "1995-12-17T03:24:00");
		oFilter.addAnd(new this.Filter(this.oMessageHandler, 'timeProperty', this.EQ, "03:24:00"));
		this.request.sendGetInBatch(oFilter);
		var sExpectedPattern = "dateTimeProperty%20eq%20datetime%271995-12";
		var bFound = this.sRequestUri.search(sExpectedPattern) > -1;
		assert.equal(bFound, true, 'Filter values are correctly OData escaped and URL encoded');
	});
}());