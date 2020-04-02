/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
/*global sap:false, jQuery:false, sinon */
sap.ui.define([
	'sap/apf/testhelper/odata/savedPaths'
], function(SavedPaths) {
	'use strict';
	var module = {
		/**
		 * Stubbing the success function for selected requests, and passing the other requests through unchanged.
		 * For those selected requests, pass on a response object without requesting the static resource beforehand.
		 * @param {object} [parameters]
		 */
		stubJQueryAjax : function(parameters) {
			var fnOriginalAjax = jQuery.ajax;
			function isEnResource(url){
				return url.includes("_en_US.properties")
					|| url.includes("_en.properties");
			}
			function isExcludedEnResource(url){
				return isEnResource(url);
			}
			//noinspection FunctionWithMoreThanThreeNegationsJS
			function ajaxStubbed(oConfig) {
				var deferred = jQuery.Deferred();
				var fnOriginalSuccess = oConfig.success;
				var tmp;
				if (oConfig.dataType === "json") {
					if (oConfig.url.search("apfMessageDefinition") !== -1) {
						tmp = module.givenApfMessageDefinition();
						setTimeout(function() {
							deferred.resolve(tmp, "success", undefined);
						}, 1);
						return deferred.promise();
					} else if (oConfig.url.search("applicationMessageDefinition") !== -1) {
						tmp = module.givenApplicationMessageDefinition();
						setTimeout(function() {
							deferred.resolve(tmp, "success", undefined);
						}, 1);
						return deferred.promise();
					} else if (((oConfig.url.search("applicationConfiguration") !== -1) && (oConfig.url.search("applicationConfigurationIntegration") === -1) && (oConfig.url.search("applicationConfigurationFacetFilter") === -1))
							|| (oConfig.url.search("applicationConfigurationKarma") !== -1)) {
						tmp = module.givenApplicationConfiguration();
						deferred.resolve(tmp, "success", undefined);
						return deferred.promise();
					} else if ((oConfig.url.search("applicationConfigurationIntegration") !== -1)) {
						tmp = module.givenApplicationConfigurationIntegration();
						setTimeout(function() {
							deferred.resolve(tmp, "success", undefined);
						}, 1);
						return deferred.promise();
					} else if ((oConfig.url.search("applicationConfigurationFacetFilter") !== -1)) {
						tmp = module.givenApplicationConfigurationFacetFilter();
						setTimeout(function() {
							deferred.resolve(tmp, "success", undefined);
						}, 1);
						return deferred.promise();
					} else if ((oConfig.url.search("integrationSampleConfiguration") !== -1)) {
						tmp = module.givenIntegrationSampleConfiguration();
						setTimeout(function() {
							deferred.resolve(tmp, "success", undefined);
						}, 1);
						return deferred.promise();
					} else if ((oConfig.url.search("sampleConfiguration") !== -1) && (oConfig.url.search("integrationSampleConfiguration") === -1)) {
						tmp = module.getSampleConfiguration();
						setTimeout(function() {
							deferred.resolve(tmp, "success", undefined);
						}, 1);
						return deferred.promise();
					} else if ((oConfig.url.search("configurationFacetFilter") !== -1)) {
						tmp = module.getSampleConfiguration("addOneFacetFilters");
						setTimeout(function() {
							deferred.resolve(tmp, "success", undefined);
						}, 1);
						return deferred.promise();
					} else if ((oConfig.url.search("savedPath") !== -1)) {
						tmp = SavedPaths.getSavedPaths();
						if (fnOriginalSuccess) {
								fnOriginalSuccess(tmp, "success", undefined);
						} else {
							setTimeout(function() {
								deferred.resolve(tmp, "success", undefined);
							}, 1);
							return deferred.promise();
						}
					} else {
						return fnOriginalAjax(oConfig);
					}
				} else if (oConfig.type === "HEAD") {
					if ((oConfig.url.search("MessageDefinition") !== -1)) { // apfMessage or ApplicationMessage
						// stub the requests about existence of files
						tmp = {};
						fnOriginalSuccess(tmp, "success", undefined);
					} else if (((oConfig.url.search("Configuration") !== -1) || (oConfig.url.search("configuration") !== -1)) && (oConfig.url.search(".json") !== -1)) {
						// stub the requests about existence of files
						tmp = {};
						fnOriginalSuccess(tmp, "success", undefined);
					} else if ((oConfig.url.search("i18n") !== -1) && (oConfig.url.search(".properties") !== -1)) {
						// Stub the requests about existence of properties files.
						// This might stub other text files, but  we assume that the tests are sufficiently isolated from those.
						tmp = {};
						fnOriginalSuccess(tmp, "success", undefined);
					} else {
						return fnOriginalAjax(oConfig); // <<<<<< HEAD on any other allowed resource OK
					}
				} else if (oConfig.dataType === "text" && (oConfig.url.search("i18n") !== -1) && (oConfig.url.search(".properties") !== -1)) {
					if (oConfig.url.search("apfMessages") !== -1) {
						tmp = "";
						fnOriginalSuccess(tmp, "success", undefined);
					} else if (oConfig.url.search("apfUi") !== -1) {
						tmp = "";
						fnOriginalSuccess(tmp, "success", undefined);
					} else {
						var url = oConfig.url;
						var sApfLocation = jQuery.sap.getModulePath("sap.apf") + '/';
						var mappedUrl;
						if (sApfLocation.indexOf("/base") > -1) { // Karma
							mappedUrl = url.replace(/\/apf-test\/test-resources/g, "/base/test/uilib");
							oConfig.url = mappedUrl;
						}
						if (isExcludedEnResource(oConfig.url)){
							return fnOriginalSuccess("", "success", undefined);
						}
						fnOriginalAjax(oConfig);
					}
				} else {
					fnOriginalAjax(oConfig); // <<<<<< all other resources, e.h. *js, png, css
				}
			}
			jQuery.ajax = sinon.stub(jQuery, "ajax", ajaxStubbed);
		},
		givenApplicationConfiguration : function() {
			return {
				"applicationConfiguration" : {
					"type" : "applicationConfiguration",
					"appName" : "appName",
					"appTitle" : "appTitle",
					"analyticalConfigurationLocation" : "/apf-test/test-resources/sap/apf/resources/config/sampleConfiguration.json",
					"applicationMessageDefinitionLocation" : "/apf-test/test-resources/sap/apf/resources/config/applicationMessageDefinition.json",
					"textResourceLocations" : {
						"apfMessageTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/apfMessages.properties",
						"applicationMessageTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/applicationMessages.properties",
						"apfUiTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/apfUi.properties",
						"applicationUiTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/test_texts.properties"
					},
					"persistence" : {
						"path" : {
							"service" : "/sap/hba/apps/reuse/apf/s/logic/path.xsjs"
						},
						"logicalSystem" : {
							"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
						}
					}
				}
			};
		},
		givenApplicationConfigurationFacetFilter : function() {
			return {
				"applicationConfiguration" : {
					"type" : "applicationConfiguration",
					"appName" : "appName",
					"appTitle" : "appTitle",
					"analyticalConfigurationLocation" : "/apf-test/test-resources/sap/apf/resources/config/configurationFacetFilter.json",
					"applicationMessageDefinitionLocation" : "/apf-test/test-resources/sap/apf/resources/config/applicationMessageDefinition.json",
					"textResourceLocations" : {
						"apfMessageTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/apfMessages.properties",
						"applicationMessageTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/applicationMessages.properties",
						"apfUiTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/apfUi.properties",
						"applicationUiTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/test_texts.properties"
					},
					"persistence" : {
						"path" : {
							"service" : "/sap/hba/apps/reuse/apf/s/logic/path.xsjs"
						},
						"logicalSystem" : {
							"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
						}
					}
				}
			};
		},
		givenApplicationConfigurationIntegration : function() {
			return {
				"applicationConfiguration" : {
					"type" : "applicationConfiguration",
					"appName" : "appName2",
					"appTitle" : "appTitle2",
					"analyticalConfigurationLocation" : "/apf-test/test-resources/sap/apf/resources/config/integrationSampleConfiguration.json",
					"applicationMessageDefinitionLocation" : "/apf-test/test-resources/sap/apf/resources/config/applicationMessageDefinition.json",
					"textResourceLocations" : {
						"apfMessageTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/apfMessages.properties",
						"applicationMessageTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/applicationMessages.properties",
						"apfUiTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/apfUi.properties",
						"applicationUiTextBundle" : "/apf-test/test-resources/sap/apf/resources/i18n/test_texts.properties"
					},
					"persistence" : {
						"path" : {
							"service" : "/sap/hba/apps/reuse/apf/s/logic/path.xsjs"
						},
						"logicalSystem" : {
							"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata"
						}
					}
				}
			};
		},
		// source is  apf.resources.apfMessageDefinition.json @ May 17th 2014
		givenApfMessageDefinition : function() {
			return {
				"messageConfiguration" : {
					"type" : "messageConfiguration",
					"id" : "apfMessageConfiguration",
					"definitions" : [ {
						"code" : "3001",
						"severity" : "technError",
						"text" : "Text is not available for the following key: {0}."
					}, {
						"code" : "5001",
						"severity" : "technError",
						"text" : "Request {3} to server failed with http status code {0}, http error message {1}, and server response {2}."
					}, {
						"code" : "5002",
						"severity" : "error",
						"description" : "Error in OData request; update of analysis step {0} failed.",
						"key" : "5002"
					}, {
						"code" : "5004",
						"severity" : "fatal",
						"description" : "Request with ID {0} does not exist in the analytical content configuration.",
						"key" : "5004"
					}, {
						"code" : "5005",
						"severity" : "technError",
						"text" : "Required property {1} is missing in the filter of the OData request for entity type {0}."
					}, {
						"code" : "5006",
						"severity" : "technError",
						"text" : "Inconsistency in data model; non-filterable property {1} is set as required filter for entity type {0}."
					}, {
						"code" : "5015",
						"severity" : "fatal",
						"description" : "Service for request {0} is not defined in the analytical content configuration.",
						"key" : "5015"
					}, {
						"code" : "5016",
						"severity" : "technError",
						"text" : "Mandatory parameter key property {0} is missing in filter."
					}, {
						"code" : "5018",
						"severity" : "fatal",
						"description" : "Metadata request {3} to server failed with http status code {0}, http error message {1}, and server response {2}.",
						"key" : "5018"
					}, {
						"code" : "5019",
						"severity" : "technError",
						"text" : "System query option $orderby for property {1} removed from OData request for entity type {0}."
					}, {
						"code" : "5020",
						"severity" : "fatal",
						"description" : "Analytical content configuration is not available.",
						"key" : "5020"
					}, {
						"code" : "5021",
						"severity" : "fatal",
						"description" : "Error during server request; session timeout occurred.",
						"key" : "5021"
					}, {
						"code" : "5025",
						"severity" : "fatal",
						"description" : "Value for SAP client has not been provided at startup of the application.",
						"key" : "5025"
					}, {
						"code" : "5026",
						"severity" : "fatal",
						"description" : "Logical system cannot be determined for SAP client {0}. ",
						"key" : "5026"
					}, {
						"code" : "5027",
						"severity" : "technError",
						"text" : "Inconsistent parameters; analysis path cannot be saved. Path ID: {0}, path name: {1}, callback function {2}"
					}, {
						"code" : "5028",
						"severity" : "technError",
						"text" : "Binding with ID {0} contains a representation without ID."
					}, {
						"code" : "5029",
						"severity" : "technError",
						"text" : "Binding with ID {0} contains a duplicated representation ID."
					}, {
						"code" : "5030",
						"severity" : "technError",
						"text" : "Constructor property of representation type ID {0} does not contain module path to a valid function."
					}, {
						"code" : "5100",
						"severity" : "fatal",
						"description" : "Unexpected internal error: {0}. Contact SAP.",
						"key" : "5100"
					}, {
						"code" : "5101",
						"severity" : "technError",
						"text" : "Unexpected internal error: {0}. Contact SAP."
					}, {
						"code" : "5102",
						"severity" : "fatal",
						"description" : "Wrong definition in analytical content configuration: {0}",
						"key" : "5102"
					}, {
						"code" : "5103",
						"severity" : "technError",
						"text" : "Wrong definition in analytical configuration."
					}, {
						"code" : "5200",
						"severity" : "technError",
						"text" : "Server error during processing a path: {0} {1}"
					}, {
						"code" : "5201",
						"severity" : "error",
						"description" : "Unknown server error.",
						"key" : "5201"
					}, {
						"code" : "5202",
						"severity" : "technError",
						"text" : "Method not allowed; probably incorrect URL parameter."
					}, {
						"code" : "5203",
						"severity" : "technError",
						"text" : "Bad request; data is structured incorrectly."
					}, {
						"code" : "5204",
						"severity" : "error",
						"description" : "Error during server request; maximum number of analysis steps exceeded.",
						"key" : "5204"
					}, {
						"code" : "5205",
						"severity" : "error",
						"description" : "Error during server request; maximum number of analysis paths exceeded.",
						"key" : "5205"
					}, {
						"code" : "5206",
						"severity" : "error",
						"description" : "Access forbidden; insufficient privileges",
						"key" : "5206"
					}, {
						"code" : "5207",
						"severity" : "error",
						"description" : "Inserted value too large; probably maximum length of analysis path name exceeded",
						"key" : "5207"
					}, {
						"code" : "5208",
						"severity" : "error",
						"description" : "Error during path persistence; request to server can not be proceed due to invalid ID.",
						"key" : "5208"
					}, {
						"code" : "5210",
						"severity" : "fatal",
						"description" : "Error during opening of analysis path; see log.",
						"key" : "5210"
					}, {
						"code" : "5211",
						"severity" : "error",
						"description" : "Server response contains undefined path objects.",
						"key" : "5211"
					}, {
						"code" : "5300",
						"severity" : "fatal",
						"description" : "The app has stopped working due to a technical error.",
						"key" : "5300"
					}, {
						"code" : "6001",
						"severity" : "fatal",
						"description" : "Missing {0} in the configuration; contact your administrator.",
						"key" : "6001"
					}, {
						"code" : "6000",
						"severity" : "error",
						"description" : "Data is not available for the {0} step.",
						"key" : "6000"
					}, {
						"code" : "6002",
						"severity" : "error",
						"description" : "Missing {0} for {1} in the configuration; contact your administrator.",
						"key" : "6002"
					}, {
						"code" : "6003",
						"severity" : "error",
						"description" : "Missing {0} in the configuration; contact your administrator.",
						"key" : "6001"
					}, {
						"code" : "6004",
						"severity" : "technError",
						"text" : "Metadata not available for step {0}"
					}, {
						"code" : "6005",
						"severity" : "error",
						"description" : "Server request failed. Unable to read paths.",
						"key" : "6005"
					}, {
						"code" : "6006",
						"severity" : "error",
						"description" : "Server request failed. Unable to save path {0}.",
						"key" : "6006"
					}, {
						"code" : "6007",
						"severity" : "error",
						"description" : "Server request failed. Unable to update path {0}.",
						"key" : "6007"
					}, {
						"code" : "6008",
						"severity" : "error",
						"description" : "Server request failed. Unable to open path {0}.",
						"key" : "6008"
					}, {
						"code" : "6009",
						"severity" : "error",
						"description" : "Server request failed. Unable to delete path {0}.",
						"key" : "6009"
					}, {
						"code" : "7000",
						"severity" : "error",
						"description" : "Missing {0} in the configuration; contact your administrator.",
						"key" : "6001"
					} ]
				}
			};
		},
		// applicationMessageDefinition.json
		givenApplicationMessageDefinition : function() {
			return {
				"messageConfiguration" : {
					"type" : "messageConfiguration",
					"id" : "webAppMessageConfiguration",
					"definitions" : [ {
						"code" : "8000",
						"severity" : "warning",
						"key" : "8000"
					}, {
						"code" : "8001",
						"severity" : "fatal",
						"key" : "8001"
					}, {
						"code" : "10000",
						"severity" : "warning",
						"rawText" : "I am a rawtext warning message"
					}, {
						"code" : "10001",
						"severity" : "error",
						"rawText" : "I am a rawtext error message"
					}, {
						"code" : "10002",
						"severity" : "error",
						"logOnly" : "true",
						"rawText" : "I am a rawtext error message"
					}, {
						"code" : "10003",
						"severity" : "undefined",
						"rawText" : "I am a rawtext info message"
					} ]
				}
			};
		},
		givenJSONStringExperiment : function() {
			var str = "" + "# TRANSLATE\n" + "# UI texts of the Analysis Path Framework\n" + "# __ldi.translation.uuid=37b44931-b8cf-11e3-a5e2-0800200c9a66\n" + "# Syntax\n" + "# <SAP-Text-Type>[,<Length-Restriction>[:<Note for translator>]]\n" + "\n"
					+ "# APPLICATION\n" + "\n" + "# Digest Area\n" + "\n" + "#XTIT, 60\n" + "no=No\n" + "#XTIT, 60\n" + "ok=OK\n" + "#XTIT, 60\n" + "cancel=Cancel\n" + "#XTIT, 60\n" + "save=Save";
			return str;
		},
		// key text pairs, source is apfMessages_en.properties @ May 17th 2014
		givenApfMessagesProperties : function(context) {
			context.addText(5002, "Error in OData request; update of analysis step {0} failed");
			context.addText(5004, "Request with ID {0} does not exist in the analytical content configuration");
			context.addText(5015, "Service for request {0} is not defined in the analytical content configuration");
			context.addText(5018, "Metadata request {3} to server failed with http status code {0}, http error message {1}, and server response {2}");
			context.addText(5020, "Analytical content configuration is not available");
			context.addText(5021, "Error during server request; session timeout occurred");
			context.addText(5025, "Value for SAP client has not been provided at startup of the application");
			context.addText(5026, "Logical system cannot be determined for SAP client {0}");
			context.addText(5100, "Unexpected internal error {0}; contact SAP {0}. Contact SAP.");
			context.addText(5102, "Wrong definition in analytical content configuration\: {0}");
			context.addText(5201, "Unknown server error");
			context.addText(5204, "Error during server request; maximum number of analysis steps exceeded");
			context.addText(5205, "Error during server request; maximum number of analysis paths exceeded");
			context.addText(5206, "Access forbidden; insufficient privileges");
			context.addText(5207, "Inserted value too large; probably maximum length of analysis path name exceeded");
			context.addText(5208, "Error during path persistence; request to server can not be proceed due to invalid ID");
			context.addText(5210, "Error during opening of analysis path; see the log");
			context.addText(5211, "Server response contains undefined path objects");
			context.addText(5300, "The app has stopped working due to a technical error.");
			context.addText(6000, "Data is not available for step {0}");
			context.addText(6001, "Missing {0} in the configuration; contact your administrator");
			context.addText(6002, "Missing {0} for {1} in the configuration; contact your administrator");
			context.addText(6005, "Server request failed; unable to read paths");
			context.addText(6006, "Server request failed Unable to save path {0}");
			context.addText(6007, "Server request failed Unable to update path {0}");
			context.addText(6008, "Server request failed Unable to open path {0}");
			context.addText(6009, "Server request failed Unable to delete path {0}");
			// apfUi_en.properties
			context.addText("select-analysis-step", "Select Analysis Step");
			context.addText("select-analysis-path", "Select Analysis Path");
			context.addText("no-analysis-path", "No analysis paths saved");
			context.addText("add-step", "Add Analysis Step");
			context.addText("addFirstStep", "Add First Analysis Step");
			context.addText("addNextStep", "Add Analysis Steph");
			context.addText("analysis-path", "Analysis Path");
			context.addText("new", "New");
			context.addText("open", "Open...");
			context.addText("saveAs", "Save As...");
			context.addText("print", "Print...");
			context.addText("delete", "Delete...");
			context.addText("unsaved", "Unnamed Analysis Path");
			context.addText("print-step-number", "Analysis Path\: Step {0} of {1}");
			context.addText("step", "Step");
			context.addText("selected-objects", "{0} selected\: {1}");
			context.addText("no", "No");
			context.addText("ok", "OK");
			context.addText("cancel", "Cancel");
			context.addText("save", "Save");
			context.addText("analysis-path-not-saved", "Analysis path is not saved. Do you want to save it?");
			context.addText("save-analysis-path", "Save Analysis Path");
			context.addText("no-of-steps", "{0} Steps");
			context.addText("do-you-want-to-delete-analysis-path", "Do you want to delete the analysis path?");
			context.addText("do-you-want-to-logout", "Do you want to log off?");
			context.addText("no-steps-in-analysis-path", "You cannot save the analysis path; the analysis path does not contain any analysis steps");
			context.addText("path-exists", "Analysis path {0} already exists. Do you want to replace it?");
			context.addText("enter-valid-path-name", "Enter a valid name for your analysis path");
			context.addText("month-1-name", "January");
			context.addText("month-2-name", "February");
			context.addText("month-3-name", "March");
			context.addText("month-4-name", "April");
			context.addText("month-5-name", "May");
			context.addText("month-6-name", "June");
			context.addText("month-7-name", "July");
			context.addText("month-8-name", "August");
			context.addText("month-9-name", "September");
			context.addText("month-10-name", "October");
			context.addText("month-11-name", "November");
			context.addText("month-12-name", "December");
			context.addText("label", "Label");
			context.addText("category", "Category");
			context.addText("path-saved-successfully", "Path {0} saved successfully");
			context.addText("path-updated-successfully", "Path {0} updated successfully");
			context.addText("detail-description", "Details");
			context.addText("application-logout", "Log Out");
			context.addText("no-of-paths-exceeded", "Maximum number of analysis paths exceeded");
			context.addText("no-of-steps-exceeded", "Maximum number of analysis steps exceeded; delete a step");
			context.addText("tooltip-detail", "Click the link to see details");
			context.addText("fatal-error", "Critical Error");
			context.addText("technical-error", "Technical Error\:");
			context.addText("yes", "Yes");
			context.addText("invalid-entry", "Please enter valid characters");
			context.addText("noDataText", "No Data");
			context.addText("month-1-shortName", "Jan");
			context.addText("month-2-shortName", "Feb");
			context.addText("month-3-shortName", "Mar");
			context.addText("month-4-shortName", "Apr");
			context.addText("month-5-shortName", "May");
			context.addText("month-6-shortName", "Jun");
			context.addText("month-7-shortName", "Jul");
			context.addText("month-8-shortName", "Aug");
			context.addText("month-9-shortName", "Sep");
			context.addText("month-10-shortName", "Oct");
			context.addText("month-11-shortName", "Nov");
			context.addText("month-12-shortName", "Dec");
			context.addText("sessionTimeout", "Session Timeout");
			context.addText("application-reload", "You must reload the application due to a session timeout");
			context.addText("reload-button", "Reload");
			context.addText("success", "Success");
			context.addText("confirmation", "Confirmation");
			context.addText("saveName", "Enter Name");
			context.addText("newPath", "New Analysis Path");
			context.addText("delPath", "Delete Analysis Path");
			context.addText("error", "Error");
			context.addText("steps", "Step");
			context.addText("representation", "Representation");
			context.addText("stepGallery", "Step Gallery");
			context.addText("caution", "Caution");
			context.addText("LineChart", "Line Chart");
			context.addText("ColumnChart", "Column Chart");
			context.addText("ColumnChartSorted", "Ranked Column Chart");
			context.addText("ColumnChartClustered", "Clustered Column Chart");
			context.addText("ColumnChartClusteredSorted", "Ranked Clustered Column Chart");
			context.addText("ScatterPlotChart", "Scatterplot Chart");
			context.addText("TableRepresentation", "Table Representation");
			context.addText("StackedColumn", "Stacked Column Chart");
			context.addText("StackedColumnSorted", "Ranked Stacked Column Chart");
			context.addText("GeoMapRepresentation", "GeoMap Representation");
			context.addText("PieChart", "Pie Chart");
			context.addText("PercentageStackedColumnChart", "Percentage Stacked Column Chart");
			context.addText("StackedColumnChart", "Stacked Column");
			context.addText("toggle-to-table", "Toggle to Table");
			context.addText("view-Settings", "View Settings Icon");
			context.addText("table", "Table Representation");
			context.addText("legend", "Toggle Legend");
			context.addText("toggle-fullscreen", "Toggle Fullscreen");
			context.addText("alert", "Alert");
			context.addText("noStepInPath", "You should have at least one step added in the path to save it.");
			context.addText("initialText", "To start your analysis, add an analysis step or open a saved analysis path.");
			context.addText("showAnalyticalPath", "Show Analysis Path");
			context.addText("list-representation", "List Representation");
			context.addText("currentStep", "Current Analysis Step");
			context.addText("resetSelection", "Reset Selection");
			context.addText("warning", "Warning");
			context.addText("addStepCheck", "The selected analysis step cannot be added.");
			context.addText("showDetails", "Show Details");
			context.addText("close", "Close");
			// test_texts.properties
			context.addText("Null", "Null");
			context.addText("OK", "OK");
			context.addText("Cancel", "Cancel");
			context.addText("Text1", "text1");
			context.addText("Text2", "text2");
			context.addText("localTextReference2", "localText2");
			context.addText("categoryTitle", "categoryTitle");
			context.addText("longTitleTest", "longTitleTest");
			context.addText("localTextReferenceStepTemplate1LeftUpper", "localTextReferenceStepTemplate1LeftUpper");
			context.addText("localTextReferenceStepTemplate1LeftLower", "localTextReferenceStepTemplate1LeftLower");
			context.addText("localTextReferenceStepTemplate1RightUpper", "localTextReferenceStepTemplate1RightUpper");
			context.addText("localTextReferenceStepTemplate1RightLower", "localTextReferenceStepTemplate1RightLower");
			context.addText("localTextReferenceStepTemplate2LeftUpper", "localTextReferenceStepTemplate2LeftUpper");
		},
		givenIntegrationSampleConfiguration : function() {
			return {
				"steps" : [ {
					"type" : "step",
					"id" : "RevenueByCustomer",
					"request" : "requestTemplate1",
					"binding" : "bindingTemplate1",
					"picture" : "resources/images/start.png",
					"hoverPicture" : "resources/images/start.png",
					"title" : {
						"type" : "label",
						"kind" : "text",
						"key" : "localTextReference2"
					},
					"longTitle" : {
						"type" : "label",
						"kind" : "text",
						"key" : "longTitleTest"
					},
					"thumbnail" : {
						"type" : "thumbnail",
						"leftUpper" : {
							"type" : "label",
							"kind" : "text",
							"key" : "localTextReferenceStepTemplate1LeftUpper"
						},
						"leftLower" : {
							"type" : "label",
							"kind" : "text",
							"key" : "localTextReferenceStepTemplate1LeftLower"
						},
						"rightUpper" : {
							"type" : "label",
							"kind" : "text",
							"key" : "localTextReferenceStepTemplate1RightUpper"
						},
						"rightLower" : {
							"type" : "label",
							"kind" : "text",
							"key" : "localTextReferenceStepTemplate1RightLower"
						}
					}
				} ],
				"requests" : [ {
					"type" : "request",
					"id" : "requestTemplate1",
					"service" : "dummy.xsodata",
					"entityType" : "EntityType1",
					"selectProperties" : [ "PropertyOne", "PropertyTwo" ]
				}, {
					"type" : "request",
					"id" : "requestTemplate2",
					"service" : "dummy.xsodata",
					"entityType" : "entityTypeWithParams",
					"selectProperties" : [ "PropertyOne", "PropertyTwo" ]
				}, {
					"type" : "request",
					"id" : "requestTemplate3",
					"service" : "dummy.xsodata",
					"entityType" : "EntityType3",
					"selectProperties" : [ "PropertyOne", "PropertyTwo" ]
				} ],
				"bindings" : [ {
					"type" : "binding",
					"id" : "bindingTemplate1",
					"requiredFilters" : [ "CustomerName" ],
					"representations" : [ {
						"type" : "representation",
						"id" : "PieChart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "representationText3"
						},
						"representationTypeId" : "PieChart",
						"parameter" : {
							"type" : "parameter",
							"dimensions" : [ {
								"fieldName" : "CustomerName"
							} ],
							"measures" : [ {
								"fieldName" : "DaysSalesOutstanding"
							} ],
							"alternateRepresentationTypeId" : "TableRepresentation"
						}
					}, {
						"type" : "representation",
						"id" : "ColumnChart",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "representationText2"
						},
						"representationTypeId" : "ColumnChart",
						"parameter" : {
							"type" : "parameter",
							"dimensions" : [ {
								"fieldName" : "CustomerName"
							} ],
							"measures" : [ {
								"fieldName" : "DaysSalesOutstanding"
							} ],
							"alternateRepresentationTypeId" : "TableRepresentation"
						}
					}, {
						"type" : "representation",
						"id" : "ColumnChartSorted",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "representationText2"
						},
						"representationTypeId" : "ColumnChartSorted",
						"parameter" : {
							"type" : "parameter",
							"dimensions" : [ {
								"fieldName" : "CustomerName"
							} ],
							"measures" : [ {
								"fieldName" : "DaysSalesOutstanding"
							} ],
							"alternateRepresentationTypeId" : "TableRepresentation"
						}
					} ]
				} ],
				"categories" : [ {
					"type" : "category",
					"id" : "categoryTemplate1",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "categoryTitle"
					},
					"steps" : [ {
						"type" : "step",
						"id" : "RevenueByCustomer"
					}, {
						"type" : "step",
						"id" : "RevenueByCustomerHierarchicalStep"
					} ]
				} ],
				"representationTypes" : [ {
					"type" : "representationType",
					"id" : "ColumnChartSorted",
					"constructor" : "sap.apf.ui.representations.columnChart",
					"picture" : "sap-icon://vertical-bar-chart",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "ColumnChartSorted"
					}
				}, {
					"type" : "representationType",
					"id" : "ColumnChart",
					"constructor" : "sap.apf.ui.representations.columnChart",
					"picture" : "sap-icon://bar-chart",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "ColumnChart"
					}
				}, {
					"type" : "representationType",
					"id" : "TableRepresentation",
					"constructor" : "sap.apf.ui.representations.table",
					"picture" : "sap-icon://table-chart",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "table"
					}
				}, {
					"type" : "representationType",
					"id" : "PieChart",
					"constructor" : "sap.apf.ui.representations.pieChart",
					"picture" : "sap-icon://pie-chart",
					"label" : {
						"type" : "label",
						"kind" : "text",
						"key" : "PieChart"
					}
				} ]
			};
		},
		/**
		 *
		 * @param {string} [sConfigChange] optional. Controls what config version to be returned. When undefined function returns main object oConfig.
		 * @returns {*}
		 */
		getSampleConfiguration : function(sConfigChange) {
			var oConfig = {
				steps : [ {
					"type" : "hierarchicalStep",
					"id" : "RevenueByCustomerHierarchicalStep",
					"request" : "requestTemplateHierarchicalStep1",
					"binding" : "bindingTemplateHierarchicalStep1",
					"picture" : "resources/images/start.png",
					"hoverPicture" : "resources/images/start.png",
					"title" : {
						"type" : "label",
						"kind" : "text",
						"key" : "localTextReference2"
					},
					"longTitle" : {
						"type" : "label",
						"kind" : "text",
						"key" : "longTitleTest"
					},
					"thumbnail" : {
						"type" : "thumbnail",
						"leftUpper" : {
							"type" : "label",
							"kind" : "text",
							"key" : "localTextReferenceStepTemplate1LeftUpper"
						},
						"leftLower" : {
							"type" : "label",
							"kind" : "text",
							"key" : "localTextReferenceStepTemplate1LeftLower"
						},
						"rightUpper" : {
							"type" : "label",
							"kind" : "text",
							"key" : "localTextReferenceStepTemplate1RightUpper"
						},
						"rightLower" : {
							"type" : "label",
							"kind" : "text",
							"key" : "localTextReferenceStepTemplate1RightLower"
						}
					}
				}, {
					type : "step", // optional
					id : "stepTemplate1",
					request : "requestTemplate1",
					binding : "bindingTemplate1",
					title : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2"
					},
					longTitle : { // optional
						type : "label", // optional
						kind : "text",
						key : "longTitleTest"
					},
					thumbnail : {
						type : "thumbnail",
						leftUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1LeftUpper"
						},
						leftLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1LeftLower"
						},
						rightUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1RightUpper"
						},
						rightLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1RightLower"
						}
					}
				}, {
					type : "step", // optional
					id : "stepTemplate2",
					request : "requestTemplate2",
					binding : "bindingTemplate2",
					title : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2"
					},
					longTitle : { // optional
						type : "label", // optional
						kind : "text",
						key : "localTextReference2"
					},
					thumbnail : {
						type : "thumbnail",
						leftUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate2LeftUpper"
						},
						leftLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate2LeftLower"
						},
						rightUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate2RightUpper"
						},
						rightLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate2RightLower"
						}
					}
				}, {
					type : "step", // optional
					id : "stepTemplate3",
					request : "requestTemplate3",
					binding : "bindingTemplate3",
					title : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2"
					},
					longTitle : { // optional
						type : "label", // optional
						kind : "text",
						key : "longTitleTest"
					},
					thumbnail : {
						type : "thumbnail",
						leftUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1LeftUpper"
						},
						leftLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1LeftLower"
						},
						rightUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1RightUpper"
						},
						rightLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1RightLower"
						}
					}
				}, {
					type : "step", // optional
					id : "stepTemplateComponent1",
					request : "requestTemplate1",
					binding : "bindingTemplateCompound1",
					title : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2"
					},
					longTitle : { // optional
						type : "label", // optional
						kind : "text",
						key : "longTitleTest"
					},
					thumbnail : {
						type : "thumbnail",
						leftUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1LeftUpper"
						},
						leftLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1LeftLower"
						},
						rightUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1RightUpper"
						},
						rightLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1RightLower"
						}
					}
				}, {
					type : "step", // optional
					id : "stepTemplateComponent2",
					request : "requestTemplate1",
					binding : "bindingTemplateCompound2",
					title : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2"
					},
					longTitle : { // optional
						type : "label", // optional
						kind : "text",
						key : "longTitleTest"
					},
					thumbnail : {
						type : "thumbnail",
						leftUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1LeftUpper"
						},
						leftLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1LeftLower"
						},
						rightUpper : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1RightUpper"
						},
						rightLower : {
							type : "label", // optional
							kind : "text",
							key : "localTextReferenceStepTemplate1RightLower"
						}
					}
				}, {
					type : "step", // optional
					id : "step0",
					request : "requestTemplate1",
					binding : "bindingTemplateInitialStep",
					title : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2"
					}
				} ],
				requests : [ {
					type : "request",
					id : "requestTemplate1",
					service : "dummy.xsodata",
					entityType : "EntityType1",
					selectProperties : [ "PropertyOne", "PropertyTwo" ]
				}, {
					type : "request",
					id : "requestTemplate2",
					service : "dummy.xsodata",
					entityType : "entityTypeWithParams",
					selectProperties : [ "PropertyOne", "PropertyTwo" ]
				}, {
					type : "request",
					id : "requestTemplate3",
					service : "dummy.xsodata",
					entityType : "EntityType3",
					selectProperties : [ "PropertyOne", "PropertyTwo" ]
				}, {
					"type" : "request",
					"id" : "requestTemplateHierarchicalStep1",
					"service" : "dummy.xsodata",
					"entityType" : "EntityType3",
					"selectProperties" : [ "PropertyOne", "PropertyTwo" ]
				} ], // steps
				bindings : [ {
					"type" : "binding",
					"id" : "bindingTemplateHierarchicalStep1",
					"requiredFilters" : [ "CustomerName" ],
					"representations" : [ {
						"type" : "representation",
						"id" : "TreeTableRepresentation1",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "representationText3"
						},
						"representationTypeId" : "TreeTableRepresentation",
						"parameter" : {
							"type" : "parameter",
							"hierarchicalColumn" : [ {
								"fieldName" : "CustomerName"
							} ],
							"column" : [ {
								"fieldName" : "DaysSalesOutstanding"
							} ]
						}
					}, {
						"type" : "representation",
						"id" : "TreeTableRepresentation",
						"label" : {
							"type" : "label",
							"kind" : "text",
							"key" : "representationText2"
						},
						"representationTypeId" : "TreeTableRepresentation",
						"parameter" : {
							"type" : "parameter",
							"hierarchicalColumn" : [ {
								"fieldName" : "CustomerName"
							} ],
							"column" : [ {
								"fieldName" : "DaysSalesOutstanding"
							} ]
						}
					} ]
				}, {
					type : "binding",
					id : "bindingTemplate1",
					requiredFilters : [ "Customer" ], // set of filters required to uniquely identify rows selection
					representations : [ {
						type : "representation",
						id : "representationId1",
						label : {
							type : "label",
							kind : "text",
							key : "representationText1"
						},
						representationTypeId : "representationTypeId1",
						parameter : {
							id : 'double1',
							type : "parameter",
							sRepresentationType : "RepresentationTestDouble"
						}
					}, {
						type : "representation",
						id : "representationId2",
						label : {
							type : "label",
							kind : "text",
							key : "representationText2"
						},
						representationTypeId : "representationTypeId2",
						parameter : {
							type : "parameter",
							sRepresentationType : "Representation2TestDouble"
						}
					}, {
						type : "representation",
						id : "representationId3",
						//label is missing on purpose
						representationTypeId : "representationTypeId3",
						parameter : {
							type : "parameter",
							sRepresentationType : "Representation2TestDouble"
						}
					}, {
						type : "representation",
						id : "representationId4",
						label : {
							type : "label",
							kind : "text",
							key : "representationText4"
						},
						representationTypeId : "representationTypeId3",
						parameter : {
							type : "parameter",
							sRepresentationType : "Representation2TestDouble",
							sort : {
								sortField : "CreditAmtInDisplayCrcy_E",
								descending : true
							}
						}
					} ]
				// representations
				}, {
					type : "binding",
					id : "bindingTemplate2",
					requiredFilters : [ "stringProperty" ], // set of filters required to uniquely identify rows selection
					representations : [ {
						type : "representation",
						id : "representationId1",
						label : {
							type : "label",
							kind : "text",
							key : "representationText1"
						},
						representationTypeId : "representationTypeId1",
						parameter : {
							type : "parameter",
							id : 'double1',
							sRepresentationType : "Representation2TestDouble"
						}
					} ]
				// representations
				}, {
					type : "binding",
					id : "bindingTemplate3",
					requiredFilters : [ "Customer" ], // set of filters required to uniquely identify rows selection
					representations : [ {
						type : "representation",
						id : "representationId2",
						label : {
							type : "label",
							kind : "text",
							key : "representationText2"
						},
						representationTypeId : "representationTypeId2",
						parameter : {
							type : "parameter",
							sRepresentationType : "Representation2TestDouble"
						}
					}, {
						type : "representation",
						id : "representationId1",
						label : {
							type : "label",
							kind : "text",
							key : "representationText1"
						},
						representationTypeId : "representationTypeId1",
						parameter : {
							type : "parameter",
							sRepresentationType : "RepresentationTestDouble"
						}
					} ]
				// representations
				}, {
					type : "binding",
					id : "bindingTemplateInitialStep",
					requiredFilters : [], // set of filters required to uniquely identify rows selection
					representations : []
				// representations
				}, {
					type : "binding",
					id : "bindingTemplateCompound1",
					requiredFilters : [ 'SAPClient', 'CoArea' ], // set of filters required to uniquely identify rows selection
					representations : [ {
						type : "representation",
						id : "representationId1",
						label : {
							type : "label",
							kind : "text",
							key : "representationText1"
						},
						representationTypeId : "representationTypeId1",
						parameter : {
							type : "parameter",
							sRepresentationType : "RepresentationTestDouble"
						}
					} ]
				// representations
				}, {
					type : "binding",
					id : "bindingTemplateCompound2",
					requiredFilters : [ 'SAPClient', 'CoArea', 'Project' ], // set of filters required to uniquely identify rows selection
					representations : [ {
						type : "representation",
						id : "representationId1",
						label : {
							type : "label",
							kind : "text",
							key : "representationText1"
						},
						representationTypeId : "representationTypeId1",
						parameter : {
							type : "parameter",
							sRepresentationType : "RepresentationTestDouble"
						}
					} ]
				// representations
				}, {
					type : "binding",
					id : "bindingTemplateSameRepresentationTypesDifferentRepresentations",
					requiredFilters : [], // set of filters required to uniquely identify rows selection
					representations : [ {
						type : "representation",
						id : "representationId1",
						label : {
							type : "label",
							kind : "text",
							key : "representationText1"
						},
						representationTypeId : "representationTypeId1",
						parameter : {
							type : "parameter",
							sRepresentationType : "RepresentationTestDouble"
						}
					}, {
						type : "representation",
						id : "representationId2",
						label : {
							type : "label",
							kind : "text",
							key : "representationText2"
						},
						representationTypeId : "representationTypeId1",
						parameter : {
							type : "parameter",
							sRepresentationType : "RepresentationTestDouble"
						}
					} ]
				// representations
				} ],// bindings
				categories : [ {
					type : "category", // optional
					id : "categoryTemplate1",
					label : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2" // key
					},
					steps : [ {
						type : "step",
						id : "stepTemplate1"
					}, {
						type : "step",
						id : "stepTemplate2"
					}, {
						type : "hierarchicalStep",
						id : "RevenueByCustomerHierarchicalStep"
					} ]
				}, {
					type : "category", // optional
					id : "categoryTemplate2",
					label : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2" // key
					},
					steps : [ {
						type : "step",
						id : "stepTemplate2"
					} ]
				}, {
					type : "category", // optional
					id : "categoryTemplate3",
					label : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2" // key
					},
					steps : [ {
						type : "step",
						id : "stepTemplate3"
					}, {
						type : "step",
						id : "stepTemplateComponent1"
					}, {
						type : "step",
						id : "stepTemplateComponent2"
					} ]
				}, {
					type : "category", // optional
					id : "initial",
					label : {
						type : "label", // optional
						kind : "text",
						key : "localTextReference2" // key
					},
					steps : [ {
						type : "step",
						id : "step0"
					} ]
				} ], // categories
				representationTypes : [ {
					type : "representationType", // optional
					id : "representationTypeId1",
					picture : "sap-icon://line-chart",
					constructor : "sap.apf.testhelper.doubles.Representation",
					label : { // optional
						type : "label", // optional
						kind : "text",
						key : "Text1" // key
					}
				}, {
					type : "representationType", // optional
					id : "representationTypeId2",
					constructor : "sap.apf.testhelper.doubles.Representation",
					picture : "sap-icon://vertical-bar-chart-2",
					label : { // optional
						type : "label", // optional
						kind : "text",
						key : "Text2" // key
					}
				}, {
					type : "representationType", // optional
					id : "representationTypeId3",
					constructor : "sap.apf.testhelper.doubles.Representation",
					picture : "sap-icon://bar-chart",
					label : { // optional
						type : "label", // optional
						kind : "text",
						key : "Text2" // key
					}
				}, {
					type : "representationType", // optional
					id : "representationTypeInitialStep",
					constructor : "sap.apf.testhelper.doubles.Representation",
					picture : "sap-icon://table-chart"
				} ],
				navigationTargets : [ {
					id : 'nav-SD',
					semanticObject : "DaysSalesOutstanding",
					action : "analyzeDSO"
				} ]
			};
			function initialStepRepresentation() {
				var i;
				var oRepresentation = {
					type : "representation",
					id : "representationIdInitial",
					label : {
						type : "label",
						kind : "text",
						key : "representationTextInitial"
					},
					representationTypeId : "representationTypeInitialStep",
					parameter : {
						type : "parameter",
						sRepresentationType : "RepresentationInitialStepTestDouble"
					}
				};
				for(i = 0; i < oConfig.bindings.length; i++) {
					if (oConfig.bindings[i].id === "bindingTemplateInitialStep") {
						oConfig.bindings[i].representations.push(oRepresentation);
						return oConfig;
					}
				}
				return oConfig;
			}
			function representationWithoutId() {
				var i;
				var oRepresentation = {
					type : "representation",
					representationTypeId : "representationTypeId1",
					parameter : {
						id : 'double1',
						type : "parameter",
						sRepresentationType : "RepresentationTestDouble"
					}
				};
				for(i = 0; i < oConfig.bindings.length; i++) {
					if (oConfig.bindings[i].id === "bindingTemplate1") {
						oConfig.bindings[i].representations.push(oRepresentation);
						return oConfig;
					}
				}
				return oConfig;
			}
			function representationsWithDuplicatedtIds() {
				var i;
				var oRepresentation = {
					type : "representation",
					representationTypeId : "representationTypeId1",
					id : "representationId1",
					parameter : {
						id : 'double1',
						type : "parameter",
						sRepresentationType : "RepresentationTestDouble"
					}
				};
				for(i = 0; i < oConfig.bindings.length; i++) {
					if (oConfig.bindings[i].id === "bindingTemplate1") {
						oConfig.bindings[i].representations.push(oRepresentation);
						return oConfig;
					}
				}
				return oConfig;
			}
			function initialStepRepresentationWithoutRequestForInitialStep() {
				var config = initialStepRepresentation();
				var i;
				for(i = 0; i < config.bindings.length; i++) {
					if (config.steps[i].id === "initialStep") {
						config.steps[i].request = undefined;
						return config;
					}
				}
			}
			function filterMapping() {
				var oStep = {
					id : "stepFilterMapping",
					binding : "bindingTemplate1",
					request : "requestTemplate1",
					filterMapping : {
						requestForMappedFilter : "requestFilterMapping",
						target : [ "targetProperty1", "targetProperty2" ],
						keepSource : "false"
					},
					categories : [ {
						type : "category", // optional
						id : "categoryTemplate1"
					} ]
				};
				var oRequest = {
					type : "request",
					id : "requestFilterMapping",
					service : "serviceForFilterMapping.xsodata",
					entityType : "entitytypeForFilterMapping",
					selectProperties : [ "selectProperty1", "selectProperty2" ]
				};
				oConfig.requests.push(oRequest);
				oConfig.steps.push(oStep);
				return oConfig;
			}
			function filterMappingKeepSource() {
				var oStep = {
					id : "stepFilterMappingKeepSource",
					binding : "bindingTemplate1",
					request : "requestTemplate1",
					filterMapping : {
						requestForMappedFilter : "requestFilterMapping",
						target : [ "targetProperty1", "targetProperty2" ],
						keepSource : "true"
					},
					categories : [ {
						type : "category", // optional
						id : "categoryTemplate1"
					} ]
				};
				var oRequest = {
					type : "request",
					id : "requestFilterMapping",
					service : "serviceForFilterMapping.xsodata",
					entityType : "entitytypeForFilterMapping",
					selectProperties : [ "selectProperty1", "selectProperty2" ]
				};
				oConfig.requests.push(oRequest);
				oConfig.steps.push(oStep);
				return oConfig;
			}
			function secondServiceDocument() {
				var oRequest = {
					type : "request",
					id : "secondServiceDocument",
					service : "secondServiceDocument.xsodata",
					entityType : "entitytypeForSecondServiceDocument",
					selectProperties : [ "selectProperty1", "selectProperty2" ]
				};
				oConfig.requests.push(oRequest);
				return oConfig;
			}
			function addOneFacetFilters() {
				var facetFilters = [ {
					type : "facetFilter",
					id : "filterIdA",
					property : 'CompanyCode',
					valueHelpRequest : undefined,
					filterResolutionRequest : undefined,
					multiSelection : false,
					preselectionDefaults : [ '1000' ],
					preselectionFunction : undefined,
					label : {
						type : 'label',
						kind : 'text',
						key : 'property1'
					}
				} ];
				oConfig.facetFilters = facetFilters;
				return oConfig;
			}
			function wrongRepresentationConstructor() {
				oConfig.representationTypes[2].constructor = "sap.apf.testhelper.doubles.anyObjectButNoFunction";
				return oConfig;
			}
			switch (sConfigChange) {
				case "initialStepRepresentation":
					return initialStepRepresentation();
				case "representationWithoutId":
					return representationWithoutId();
				case "representationsWithDuplicatedtIds":
					return representationsWithDuplicatedtIds();
				case "initialStepRepresentationWithoutRequestForInitialStep":
					return initialStepRepresentationWithoutRequestForInitialStep();
				case "filterMapping":
					return filterMapping();
				case "filterMappingKeepSource":
					return filterMappingKeepSource();
				case "wrongRepresentationConstructor":
					return wrongRepresentationConstructor();
				case "secondServiceDocument":
					return secondServiceDocument();
				case "addOneFacetFilters":
					return addOneFacetFilters();
				default:
					return oConfig;
			}
		}
		};

	Object.keys(module).forEach(function(key){
		sap.apf.testhelper.stub[key] = module[key];
	});
	return module;
}, true /*GLOBAL_EXPORT*/);
