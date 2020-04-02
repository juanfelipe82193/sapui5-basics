/*
 * Copyright (C) 2010-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.sessionHandlerStubbedAjax");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.declare('test.sap.apf.ui.utils.helper');
jQuery.sap.require('sap.apf.ui.utils.helper');
(function() {
	"use strict";
	QUnit.module("Utils qUnit", {
		beforeEach : function(assert) {
			var inject = {
				SessionHandler : sap.apf.testhelper.doubles.sessionHandlerStubbedAjax
			};
			var done = assert.async();
			sap.apf.testhelper.doubles.createUiApiAsPromise("CompUi", "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfigurationIntegration.json", inject).done(function(api) {
				this.oGlobalApi = api;
				this.oCoreApi = this.oGlobalApi.oCoreApi;
				this.utils = new sap.apf.ui.utils.Helper(this.oCoreApi);
				this.getMetaDataFacade = function() {
					var obj = {};
					obj.getProperty = function(sName) {
						var deferred = jQuery.Deferred();
						var propertyDetails = {};
						propertyDetails.label = sName;
						deferred.resolve(propertyDetails);
						return deferred.promise();
					};
					return obj;
				};
				sinon.stub(this.oCoreApi, 'getMetadataFacade', this.getMetaDataFacade);
				this.getTextNotHtmlEncoded = function(text) {
					if (text.key === "RevenueAmountInDisplayCrcy_Ekey") {
						return "Revenue";
					} else if (text.key === "YearMonthkey") {
						return "Time";
					}
				};
				sinon.stub(this.oCoreApi, 'getTextNotHtmlEncoded', this.getTextNotHtmlEncoded);
				this.oRepresentationWithFieldDesc = { // Representation with two orderby Fields, which matches the dimension/measures
					"parameter" : { //Also the Description for both orderby is available in dimension/measures
						"dimensions" : [ {
							"fieldName" : "YearMonth",
							"kind" : "xAxis",
							"fieldDesc" : {
								"type" : "label",
								"kind" : "text",
								"key" : "YearMonthkey"
							}
						} ],
						"measures" : [ {
							"fieldName" : "RevenueAmountInDisplayCrcy_E",
							"kind" : "yAxis",
							"fieldDesc" : {
								"type" : "label",
								"kind" : "text",
								"key" : "RevenueAmountInDisplayCrcy_Ekey"
							}
						} ],
						"orderby" : [ {
							"property" : "RevenueAmountInDisplayCrcy_E",
							"ascending" : false
						}, {
							"property" : "YearMonth",
							"ascending" : false
						} ]
					},
					"picture" : "sap-icon://line-chart",
					"label" : {
						"type" : "label",
						"key" : "LineChart",
						"kind" : "text"
					}
				};
				this.oRepresentationWithoutFieldDesc = { // Representation with one orderby Field, which matches the dimension/measures 
					"parameter" : { //But Description is not available in dimension/measure i.e it should be read from metadataFacade
						"dimensions" : [ {
							"fieldName" : "YearMonth",
							"kind" : "xAxis"
						} ],
						"measures" : [ {
							"fieldName" : "RevenueAmountInDisplayCrcy_E",
							"kind" : "yAxis"
						} ],
						"orderby" : [ {
							"property" : "RevenueAmountInDisplayCrcy_E",
							"ascending" : false
						} ]
					},
					"picture" : "sap-icon://line-chart",
					"label" : {
						"type" : "label",
						"key" : "LineChart",
						"kind" : "text"
					}
				};
				this.oRepresentationWithNullKeyInFieldDesc = { // Representation with one orderby Field, which matches the dimension/measures 
					"parameter" : { //But Description is not available in dimension/measure i.e it should be read from metadataFacade
						"dimensions" : [ {
							"fieldName" : "YearMonth",
							"kind" : "xAxis",
							"fieldDesc" : {
								"type" : "label",
								"kind" : "text",
								"key" : ""
							}
						} ],
						"measures" : [ {
							"fieldName" : "RevenueAmountInDisplayCrcy_E",
							"kind" : "yAxis",
							"fieldDesc" : {
								"type" : "label",
								"kind" : "text",
								"key" : ""
							}
						} ],
						"orderby" : [ {
							"property" : "RevenueAmountInDisplayCrcy_E",
							"ascending" : false
						} ]
					},
					"picture" : "sap-icon://line-chart",
					"label" : {
						"type" : "label",
						"key" : "LineChart",
						"kind" : "text"
					}
				};
				this.oRepresentationMixed = { // Representation with two orderby Fields, which matches the dimension/measures 
					"parameter" : { //But Description is available only for one orderby Field (YearMonth) in dimension/measure 				                       //i.e it should be read from metadataFacade
						"dimensions" : [ { //Description is not available for field (RevenueAmountInDisplayCrcy_E) i.e it will be read from metadataFacade
							"fieldName" : "YearMonth",
							"kind" : "xAxis",
							"fieldDesc" : {
								"type" : "label",
								"kind" : "text",
								"key" : "YearMonthkey"
							}
						} ],
						"measures" : [ {
							"fieldName" : "RevenueAmountInDisplayCrcy_E",
							"kind" : "yAxis",
							"fieldDesc" : {
								"type" : "label",
								"kind" : "text",
								"key" : " "
							}
						} ],
						"orderby" : [ {
							"property" : "YearMonth",
							"ascending" : false
						}, {
							"property" : "RevenueAmountInDisplayCrcy_E",
							"ascending" : false
						} ]
					},
					"picture" : "sap-icon://line-chart",
					"label" : {
						"type" : "label",
						"key" : "LineChart",
						"kind" : "text"
					}
				};
				this.oRepresentationNewSortProperty = { // Representation with one orderby Fields, which does not match the dimension/measures 
					"parameter" : { //Description will be read from metadataFacade
						"dimensions" : [ {
							"fieldName" : "YearMonth",
							"kind" : "xAxis",
							"fieldDesc" : {
								"type" : "label",
								"kind" : "text",
								"key" : "YearMonthkey"
							}
						} ],
						"measures" : [ {
							"fieldName" : "RevenueAmountInDisplayCrcy_E",
							"kind" : "yAxis",
							"fieldDesc" : {
								"type" : "label",
								"kind" : "text",
								"key" : " "
							}
						} ],
						"orderby" : [ {
							"property" : "NewProperty",
							"ascending" : false
						} ]
					},
					"picture" : "sap-icon://line-chart",
					"label" : {
						"type" : "label",
						"key" : "LineChart",
						"kind" : "text"
					}
				};
				done();
			}.bind(this));
		},
		afterEach : function() {
			this.oCoreApi.getMetadataFacade.restore();
			this.oCoreApi.getTextNotHtmlEncoded.restore();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Api's Availability", function(assert) {
		assert.ok(typeof this.utils.getRepresentationSortInfo === "function", "getRepresentationSortInfo API exists");
	});
	QUnit.test("Orderby Property available in dimension/measures (Sort Description read from dimension/measures) - getRepresentationSortInfo() API", function(assert) {
		var aRepSortDetails = [];
		this.utils.getRepresentationSortInfo(this.oRepresentationWithFieldDesc).done(function(representationSortDetail) {
			representationSortDetail.forEach(function(promiseRepSortDetail) {
				promiseRepSortDetail.done(function(sRepSortDetail) {
					aRepSortDetails.push(sRepSortDetail);
				});
			});
			assert.ok(aRepSortDetails[0] === "Revenue", "Expected Sort details : Revenue , Sort Description available for the representation from dimension/measures.");
			assert.ok(aRepSortDetails[1] === "Time", "Expected Sort details : Time , Sort Description available for the representation from dimension/measures.");
		});
	});
	QUnit.test("Orderby Property available in dimension/measures (Sort Description read from metadataFacade)  - getRepresentationSortInfo() API", function(assert) {
		var expectedSortDetails = "RevenueAmountInDisplayCrcy_E"; // value from metaDataFacade
		var aRepSortDetails = [];
		this.utils.getRepresentationSortInfo(this.oRepresentationWithNullKeyInFieldDesc).done(function(representationSortDetail) {
			representationSortDetail.forEach(function(promiseRepSortDetail) {
				promiseRepSortDetail.done(function(sRepSortDetail) {
					aRepSortDetails.push(sRepSortDetail);
				});
			});
			assert.ok(aRepSortDetails[0] === expectedSortDetails, "Expected Sort details : " + expectedSortDetails + " , Sort Description available for the representation from metaDataFacade.");
		});
	});
	QUnit.test("Orderby Property available in dimension/measures (One Sort Description read from dimension/measures, another from metadataFacade) - getRepresentationSortInfo() API", function(assert) {
		var expectedSortDetails = "Time, RevenueAmountInDisplayCrcy_E"; // one value from metaDataFacade and one from dimension/measure
		var aRepSortDetails = [];
		this.utils.getRepresentationSortInfo(this.oRepresentationMixed).done(function(representationSortDetail) {
			representationSortDetail.forEach(function(promiseRepSortDetail) {
				promiseRepSortDetail.done(function(sRepSortDetail) {
					aRepSortDetails.push(sRepSortDetail);
				});
			});
			assert.ok(aRepSortDetails[0] === "Time", "Expected Sort details : Time , Sort Description available for the representation from metaDataFacade and dimension/measure.");
			assert.ok(aRepSortDetails[1] === "RevenueAmountInDisplayCrcy_E", "Expected Sort details : RevenueAmountInDisplayCrcy_E , Sort Description available for the representation from metaDataFacade and dimension/measure.");
		});
	});
	QUnit.test("Orderby Property not available in dimension/measures (Sort Description read from metadataFacade) - getRepresentationSortInfo() API", function(assert) {
		var expectedSortDetails = "NewProperty"; // value from metaDataFacade
		var aRepSortDetails = [];
		this.utils.getRepresentationSortInfo(this.oRepresentationNewSortProperty).done(function(representationSortDetail) {
			representationSortDetail.forEach(function(promiseRepSortDetail) {
				promiseRepSortDetail.done(function(sRepSortDetail) {
					aRepSortDetails.push(sRepSortDetail);
				});
			});
			assert.ok(aRepSortDetails[0] === expectedSortDetails, "Expected Sort details : " + expectedSortDetails + " , Sort Description available for the representation from metaDataFacade.");
		});
	});
	QUnit.test("Sort Description read from metadataFacade if the field description is not available  - getRepresentationSortInfo() API", function(assert) {
		var expectedSortDetails = "RevenueAmountInDisplayCrcy_E"; // value from metaDataFacade
		var aRepSortDetails = [];
		this.utils.getRepresentationSortInfo(this.oRepresentationWithoutFieldDesc).done(function(representationSortDetail) {
			representationSortDetail.forEach(function(promiseRepSortDetail) {
				promiseRepSortDetail.done(function(sRepSortDetail) {
					aRepSortDetails.push(sRepSortDetail);
				});
			});
			assert.ok(aRepSortDetails[0] === expectedSortDetails, "Expected Sort details : " + expectedSortDetails + " , Sort Description available for the representation from metaDataFacade.");
		});
	});
}());