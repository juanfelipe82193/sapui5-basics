// test.sap.suite.ui.generic.template.demokit.app.js
sap.ui.define("my.Component", [
		"sap/suite/ui/generic/template/lib/AjaxHelper",
		"sap/base/util/UriParameters",
		"sap/ui/generic/app/AppComponent",
		"sap/ui/core/util/MockServer",
		"demokits/mockFunctions",
		"sap/ui/fl/FakeLrepConnector",
		"sap/ui/fl/FakeLrepConnectorLocalStorage",
		"sap/ui/rta/RuntimeAuthoring"
	],
	function(AjaxHelper, UriParameters) {


var oUriParameters = new UriParameters(window.location.href);
var sProject = oUriParameters.get("project") || false;

var sApp = oUriParameters.get("app") || false;
var bResponder = oUriParameters.get("responderOn") === "true" || true;
var sDemoApp = oUriParameters.get("demoApp") || "sttaproducts";
var bRTA = oUriParameters.get("rta") || false;
var bMockLog = oUriParameters.get("mockLog") || false;
var iMockID = oUriParameters.get("mockID") || 0;

/*global MockLog, MS_LOG_TAG_FLOW, MS_LOG_TAG_RESPONSE, MS_LOG_TAG_REQUEST, MS_LOG_TAG_INPUT */
//Mock Server Log
var oML = null;
if (bMockLog) {
	oML = new MockLog();
	oML.setCaller(true, true);
	oML.setTimeStamp(true);
}


// new parameter for session storage
var bSessionStorage = oUriParameters.get("use-session-storage");
if (bSessionStorage) {
	window['use-session-storage'] = true;
}

if (!sApp) {
	switch (sDemoApp) {
		case "salesorderdepr":
			sApp = "sap.suite.prototype.salesorder";
			sProject = "./sample.application";
			break;
		case "sttaproducts":
			sApp = "STTA_MP";
			sProject = "./sample.stta.manage.products/webapp";
			break;
		case "products":
			sApp = "ManageProductsNS";
			sProject = "./sample.manage.products/webapp";
			break;
		case "salesorder":
			sApp = "SalesOrdersNS";
			sProject = "./sample.sales.orders/webapp";
			break;
		default:
			sApp = "ManageProductsNS";
			sProject = "./sample.manage.products/webapp";
			break;
	}
}


var appPathMapper = {};
sApp = sApp.replace(/\./g, "/");
appPathMapper[sApp] = sProject;
sap.ui.loader.config({paths:appPathMapper});
if (bResponder) {
	AjaxHelper.getJSON(sProject + "/manifest.json").then(function (data) {
		var manifest = data;

		_startMockServers(sProject, manifest);

		sap.ui.getCore().attachInit(function () {
			// Fake LREP
			// Fake LREP Local Storage Patch
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			_start();
		});
	});
} else {
	_start();
}

function _start() {
	"use strict";

	oML.log(MS_LOG_TAG_FLOW, "_start");

	var oContainer = new sap.ui.core.ComponentContainer({
			name: sApp,
			height: "100%"
		}),
		oShell = new sap.m.Shell("Shell", {
			showLogout: false,
			appWidthLimited: false,
			app: oContainer,
			homeIcon: {
				'phone': 'img/57_iPhone_Desktop_Launch.png',
				'phone@2': 'img/114_iPhone-Retina_Web_Clip.png',
				'tablet': 'img/72_iPad_Desktop_Launch.png',
				'tablet@2': 'img/144_iPad_Retina_Web_Clip.png',
				'favicon': 'img/favicon.ico',
				'precomposed': false
			}
		});

	if (bRTA) {
		var oBox = new sap.m.VBox({
			items : [
				new sap.m.Toolbar({
					content : [
						new sap.m.Button({
							text: "Adapt UI",
							press: function (oEvent) {

								var oRta = new RuntimeAuthoring({
									rootControl : oContainer.getComponentInstance()
										.getAggregation('rootControl')
								});
								oRta.start();
							}
						}),
						new sap.m.Button({
							text: "Reset",
							press: function (oEvent) {
								FakeLrepConnectorLocalStorage.deleteChanges();
								location.reload();
							}
						})
					]
				}),
				oShell
			]
		}).placeAt('content');
	} else {
		oShell.placeAt('content');
	}
}

function _makeCallbackFunction(path) {

	oML.log(MS_LOG_TAG_FLOW, "_makeCallbackFunction");

	return function (oXHR) {
		oXHR.respondFile(200, {}, path);
	};
}

function _startMockServers(appPath, manifest) {

	oML.log(MS_LOG_TAG_FLOW, "_startMockServers");

	var iAutoRespond = (oUriParameters.get("serverDelay") || 1000);
	var oMockServer;
	var dataSource;
	var sMockDataBaseUrl;
	var oDataSources = manifest["sap.app"]["dataSources"];
	var MockServer = MockServer;
	var sUrlMethod = oUriParameters.get("method") || 'GET';
	var iUrlStatusCode = parseInt(oUriParameters.get("statusCode"),10) || 200;
	var sUrlPath = oUriParameters.get("path") || ".*";
	var sMessages = oUriParameters.get("messages") || '';

	MockServer.config({
		autoRespond: true,
		autoRespondAfter: iAutoRespond
	});
	for (var property in oDataSources) {
		oML.log(MS_LOG_TAG_FLOW, "property:", property);
		if (oDataSources.hasOwnProperty(property)) {
			dataSource = oDataSources[property];
			// do we have a mock url in the app descriptor
			if (dataSource.settings && dataSource.settings.localUri) {
				if (typeof dataSource.type === "undefined" || dataSource.type === "OData") {

					oMockServer = new MockServer({
						rootUri: dataSource.uri
					});
					// todo - why do we have 3 instances of the mock server
					oML.log(MS_LOG_TAG_FLOW, "new MockServer.sId:" + oMockServer.sId + " for:" + dataSource.uri);


					if (iMockID > 0) {

						aRequests.push({
							method: "GET",
							path: new RegExp(".*\\?(.*)"), // goes in for each push, even the facetes
							// to do - find the right pattern
							//path: new RegExp("Product\(Pro.*\)\?"),  // only one entity
							response: function (oXhr, sUrlParams) {
								var oHeader = {};
								var oBody = {};

								oHeader = { "sap-message": {
									  "code": "CI_DRAFTBP_MESSAGE/015",
									  "message": "Enter Reconciliation Account under Company Code before saving your entry",
									  "severity": "error",
									  "target": "ReconciliationAccount",
									  "details": [

									  ]
									}
								}
							}
						});

						oML.log(MS_LOG_TAG_RESPONSE, "iUrlStatusCode:", iUrlStatusCode);
						oML.log(MS_LOG_TAG_RESPONSE, "oHeader:", oHeader);
						oML.log(MS_LOG_TAG_RESPONSE, "oBody:", oBody);

						oXhr.respondJSON(iUrlStatusCode, oHeader, oBody);
						return true;
					}


					sMockDataBaseUrl = dataSource.settings.localUri.split("/").slice(0, -1).join("/");
					oMockServer.simulate(appPath + "/" + dataSource.settings.localUri, {
						sMockdataBaseUrl: appPath + "/" + sMockDataBaseUrl,
						bGenerateMissingMockData: true
					});

					var aRequests = oMockServer.getRequests();

					aRequests.push({
							method: sUrlMethod,
							path: new RegExp(".*\\?(.*)"), // goes in for each push, even the facetes
							// to do - find the right pattern
							//path: new RegExp("Product\(Pro.*\)\?"),  // only one entity
							response: function (oXhr, sUrlParams) {
								oML.log(MS_LOG_TAG_REQUESTPUSH, "aRequests.push(*):", sUrlMethod);
								oML.log(MS_LOG_TAG_REQUEST, "oXhr.url:", oXhr.url);

								if (oXhr.url.indexOf("&USE_MOCKSERVER") !== -1) {
									return false;
								}

								var sTestUrl = oXhr.url;
								var aSections = sTestUrl.split("/");

								// we consider only the last section
								sTestUrl = aSections[aSections.length - 1];

								var sSegment = sTestUrl;

								// we do not consider the query parameters for now
								aSections = sTestUrl.split("?$");
								sTestUrl = aSections[0];

								var rExp = new RegExp(sUrlPath);
								if (!rExp.test(sTestUrl)) {
									return false;
								}

								var oHeader = {};
								var oBody = {};
								if (iUrlStatusCode >= 400) {
									oML.log(MS_LOG_TAG_FLOW, "iUrlStatusCode:" + iUrlStatusCode);

									// body contains the error message
									oBody = {
										"error": {
											"code": "XX/999", "message": {
												"lang": "en",
												"value": "Mock-Server created a " + iUrlStatusCode + " response"
											}
											,
											"innererror": {
												"application": {
													"component_id": "XX",
													"service_namespace": "/XX/",
													"service_id": "XXX",
													"service_version": "0001"
												}
												,
												"transactionid": "XXXXXXXXXXXXX",
												"timestamp": "20160104152334.4288470",
												"Error_Resolution": {
													"SAP_Transaction": "Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details",
													"SAP_Note": "See SAP Note 1797736 for error analysis (https://service.sap.com/sap/support/notes/1797736)",
													"Batch_SAP_Note": "See SAP Note 1869434 for details about working with $batch (https://service.sap.com/sap/support/notes/1869434)"
												}
												,
												"errordetails": [{
													"code": "/XXXX/",
													"message": "Mock-Server created a " + iUrlStatusCode + " response",
													"propertyref": "",
													"severity": "error",
													"target": ""
												}]
											}
										}
									};
								} else if (iUrlStatusCode >= 200) {
									oML.log(MS_LOG_TAG_FLOW, "iUrlStatusCode:" + iUrlStatusCode);

									var sUrl;

									if (oXhr.method === 'POST') {
										// hard coded to the same entity for now
										sUrl = "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(" + sUrlParams.replace("&", ',') + ")";
										oML.log(MS_LOG_TAG_REQUEST, "POST hardcoded sUrl:", sUrl);
									} else {
										sUrl = oXhr.url + "&USE_MOCKSERVER";
										oML.log(MS_LOG_TAG_REQUEST, "NO POST USE_MOCKSERVER");
									}

									oML.log(MS_LOG_TAG_AJAXREQUEST,"AjaxHelper.sjax: GET sUrl:", sUrl);
									var oResponse = AjaxHelper.sjax({
										url: sUrl,
										type: "GET"
									});
									oML.log(MS_LOG_TAG_AJAXRESPONSE, "AjaxHelper.sjax: oResponse:", oResponse);

									var aMessages = sMessages.split(",");
									var aDetailMessages = [];
									var oMessage = {};

									function _createMessage(sMessage, count) {
										oML.log(MS_LOG_TAG_FLOW, "_createMessage sMessage:", sMessage);

										var aMessage = sMessage.split("/");
										var sSeverity, sMessageText = "This is a &1 &2 messages created by the mock server &3";
										var bTransient = false;
										var sTarget = aMessage[1] || '';
										if (sTarget === "TRANSIENT") {
											sTarget = "/" + sSegment;
											bTransient = true;
										}

										switch (aMessage[0]) {
											case 'E':
												sSeverity = 'error';
												break;
											case 'W':
												sSeverity = 'warning';
												break;
											case 'I':
												sSeverity = 'information';
												break;
											case 'S' :
												sSeverity = 'success';
										}

										if (bTransient) {
											sMessageText = sMessageText.replace("&1", "transient");
										} else {
											sMessageText = sMessageText.replace("&1", "state");
										}

										sMessageText = sMessageText.replace("&2", sSeverity);

										if (sTarget) {
											sMessageText = sMessageText.replace("&3", " for target " + sTarget);
										} else {
											sMessageText = sMessageText.replace("&3", " without target");
										}

										var _oMessage = {
											"code": "XXX/" + count + count + count,
											"message": sMessageText,
											"severity": sSeverity,
											"target": sTarget
										};
										oML.log(MS_LOG_TAG_RESPONSE,"_oMessage:", _oMessage);
										return _oMessage;
									}

									if (aMessages && aMessages.length > 0) {
										for (var i = 1; i < aMessages.length; i++) {
											aDetailMessages.push(_createMessage(aMessages[i], i));
										}

										oMessage = _createMessage(aMessages[0], 0);
										oMessage.details = aDetailMessages;
									}

									// Add any dummy message to test mockserver with modified header
									oHeader = {
										"location": window.location.protocol + "//" + window.location.host + sUrl.replace("&USE_MOCKSERVER", ""),
										"sap-message": JSON.stringify(oMessage)
									};

									if (oResponse.success) {

										if (oXhr.method === 'POST') {
											// hard coded, change price in actions
											if (oResponse.data.d.Price) {
												oResponse.data.d.Price = '11111';
											}
										}

										if (oResponse.data && oResponse.data.d) {
											oBody = {
												d: oResponse.data.d
											};
										}
									}
								} else {
									oML.log(MS_LOG_TAG_MESSAGE, "UrlStatusCode not supported:", iUrlStatusCode);
									return false;
								}

								oML.log(MS_LOG_TAG_RESPONSE, "iUrlStatusCode:", iUrlStatusCode);
								oML.log(MS_LOG_TAG_RESPONSE, "oHeader:", oHeader);
								oML.log(MS_LOG_TAG_RESPONSE, "oBody:", oBody);

								oXhr.respondJSON(iUrlStatusCode, oHeader, oBody);
								return true;
							}
						}
					);

					aRequests.push(
						{
							method: 'POST',
							path: new RegExp(".*\\?(.*)"),
							response: function (oXhr, sUrlParams) {
							oML.log(MS_LOG_TAG_REQUESTPUSH, "aRequests.push(POST):", sUrlMethod);
							oML.log(MS_LOG_TAG_REQUEST, "oXhr.url:", oXhr.url);

								if (oXhr.url.indexOf("&USE_MOCKSERVER") !== -1) {
									return false;
								}

								var sTestUrl = oXhr.url;
								var aSections = sTestUrl.split("/");
								// we consider only the last section
								sTestUrl = aSections[aSections.length - 1];
								var sSegment = sTestUrl;
								// we do not consider the query parameters for now
								aSections = sTestUrl.split("?$");
								sTestUrl = aSections[0];

								var rExp = new RegExp(sUrlPath);
								if (sUrlMethod === 'POST' && rExp.test(sTestUrl)) {
									// handled by other request
									return false;
								}

								var oHeader = {};
								var oBody = {};
								var sUrl;
								// hard coded to the same entity for now
								sUrl = "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(" + sUrlParams.replace("&", ',') + ")";

								oML.log(MS_LOG_TAG_AJAXREQUEST,"AjaxHelper.sjax: GET sUrl:", sUrl);
								var oResponse = AjaxHelper.sjax({
									url: sUrl,
									type: "GET"
								});
								oML.log(MS_LOG_TAG_AJAXRESPONSE,"AjaxHelper.sjax: oResponse", oResponse);

								oHeader = {
									"location": window.location.protocol + "//" + window.location.host + sUrl
								};

								if (oResponse.success) {

									if (oXhr.method === 'POST') {
										// hard coded, change price in actions
										if (oResponse.data.d.Price) {
										oML.log(MS_LOG_TAG_RESPONSE, "modify price");
											oResponse.data.d.Price = '11111';
										oXhr.respondJSON(iUrlStatusCode, oHeader, oBody);
										}
									}

									if (oResponse.data && oResponse.data.d) {
										oBody = {
											d: oResponse.data.d
										};
									}
								}

								oML.log(MS_LOG_TAG_RESPONSE, "iUrlStatusCode:", iUrlStatusCode);
								oML.log(MS_LOG_TAG_RESPONSE, "oHeader:", oHeader);
								oML.log(MS_LOG_TAG_RESPONSE, "oBody:", oBody);

								oXhr.respondJSON(iUrlStatusCode, oHeader, oBody);
								return true;
							}
						}
					);

					oMockServer.setRequests(aRequests);
					_showAllRequestsInLog(aRequests);

				} else {
					oMockServer = new MockServer({
						requests: [{
							method: "GET",
							// TODO have MockServer fixed and pass just the URL!
							path: new RegExp(MockServer.prototype
								._escapeStringForRegExp(dataSource.uri)),
							response: _makeCallbackFunction(appPath + "/" + dataSource.settings.localUri)
						}]
					});
					oML.log(MS_LOG_TAG_FLOW, "new MockServer.sId:" + oMockServer.sId + " for Callback function:" + appPath + "/" + dataSource.settings.localUri);
					var aCBRequests = oMockServer.getRequests();
					_showAllRequestsInLog(aCBRequests);
				}
				oMockServer.start();
				oML.log(MS_LOG_TAG_FLOW, "MockServer.start: sId:" + oMockServer.sId);
			}
		}
	}
}

}, /* bExport= */ true);
