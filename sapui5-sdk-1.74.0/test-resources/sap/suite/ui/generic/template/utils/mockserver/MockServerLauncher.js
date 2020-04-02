sap.ui.define(['sap/ui/core/util/MockServer', "./RequestHandler", "./SalesOrderPushFunctions",
		"./ProductPushFunctions", "./PushFunctions", "../Utils", "sap/ui/fl/FakeLrepConnectorLocalStorage", "sap/base/util/deepExtend", "sap/suite/ui/generic/template/lib/AjaxHelper"],
	function(MockServer, RequestHandler, SalesOrderPushFunctions, ProductPushFunctions, PushFunctions, Utils, FakeLrepConnectorLocalStorage, deepExtend, AjaxHelper) {
		"use strict";

/*		// Mokey patch mockserver to be able to resolve navigations in a meaningful way
		(function(){
			// returns an array of properties to be filtered on, each described by an array of navProps and the prop in the target entityset
			function analyzeFilter(sFilter){
				var aResult = [];
				var regex = new RegExp(/(.*) (eq|ne|gt|lt|le|ge) (.*)/);
				sFilter.split(/ +and | or +/).forEach(function(sSingleFilter){
					var oResultEntry = {
						aNavProp: sSingleFilter.match(regex)[1].split("/")
					};
					oResultEntry.sProp = oResultEntry.aNavProp.pop();
					aResult.push(oResultEntry);
				})
				return aResult;
			}

			// add navigation parameters in filter to expand
			var fnOderQueryOptions = MockServer.prototype._orderQueryOptions;
			MockServer.prototype._orderQueryOptions = function(aUrlParams) {
				var aOrderedUrlParams = fnOderQueryOptions.apply(this, arguments);
				var sFilter = aOrderedUrlParams.find(function(sUrlParam){return sUrlParam.startsWith("$filter")});
				analyzeFilter(sFilter.split("$filter=")[1]).forEach(function(oFilterProp){
					var sSingleExpand = oFilterProp.aNavProp.join("/");
					if (sSingleExpand === ""){ return;}
					if (aOrderedUrlParams[0].startsWith("$expand")){
						aOrderedUrlParams[0] += ("," + sSingleExpand);
					} else {
						aOrderedUrlParams.unshift("$expand=" + sSingleExpand);
					}
				});
				console.log("----------------------TEST--------------" + sFilter);
				return aOrderedUrlParams;
			}

			// mockserver overrides navigation property to build __deferred entry -> restore it to be able to define navigation targets
			var fnEnhanceWithMetadata = MockServer.prototype._enhanceWithMetadata;
			MockServer.prototype._enhanceWithMetadata = function(oEntitySet, aMockdata) {
				var aMockdataOrig = jQuery.extend(true, [], aMockdata);
				fnEnhanceWithMetadata.apply(this, arguments);
				aMockdata = jQuery.extend(true, aMockdata, aMockdataOrig);
			}

			var fnResolveNavigationOrg = MockServer.prototype._resolveNavigation;
			MockServer.prototype._resolveNavigation = function(sEntitySetName, oFromRecord, sNavProp) {
				if(oFromRecord[sNavProp]["__result"]){
					return oFromRecord[sNavProp]["__result"];
				} else if(oFromRecord[sNavProp]["__target"]){
					var aResult;
					jQuery.ajax({
						url: this._getRootUri() + oFromRecord[sNavProp]["__target"],
						dataType: "json",
						async: false,
						success: function(oResponse){
							aResult = [oResponse.d];
							}
					});
					return aResult;
				} else {
					return [];
//					return fnResolveNavigationOrg.apply(this, arguments);
				}
			}

			// add null values for all properties to be filtered on (esp. behind navigation) to avoid error message from mock server
			var fnRecursiveOdataQueryFilter = MockServer.prototype._recursiveOdataQueryFilter;
			var iRecursion = 0;
			MockServer.prototype._recursiveOdataQueryFilter = function(aDataSet, sODataQueryValue) {
				if (iRecursion === 0){
					console.log("----------------------TEST--------------" + sODataQueryValue);
					analyzeFilter(sODataQueryValue).forEach(function(oFilterProp){
						aDataSet.forEach(function(oResultEntry){
							var oObject = oResultEntry;
							oFilterProp.aNavProp.forEach(function(sNavProp){
								oObject[sNavProp] = oObject[sNavProp] || {};
								oObject = oObject[sNavProp];
							});
							if(oObject[oFilterProp.sProp] === undefined || oObject[oFilterProp.sProp] === null){
								oObject[oFilterProp.sProp] = "null"; // unfortunately, mockserver treats null wrong for filtering
							}
						});
					});
				}
				iRecursion++;
				var aResult = fnRecursiveOdataQueryFilter.apply(this, arguments);
				iRecursion--;
				return aResult;
			}

		})()
*/

		function makeCallbackFunction(path) {
			return function(oXHR) {
				oXHR.respondFile(200, {}, path);
			};
		}


		function startMockServers(appPath, manifest, sComponentId, iAutoRespond, bMockLog) {
			var oMockServer, dataSource, sMockDataBaseUrl,
				oDataSources = manifest["sap.app"]["dataSources"],
				MockServer = sap.ui.core.util.MockServer;

			manifest = Utils.uniquificationOfDataSourcesInManifest(appPath, manifest);

			sap.ui.core.util.MockServer.config({
				autoRespond: true,
				autoRespondAfter: iAutoRespond
			});
			for (var property in oDataSources) {
				if (oDataSources.hasOwnProperty(property)) {
					dataSource = oDataSources[property];
					//do we have a mock url in the app descriptor
					if (dataSource.settings && dataSource.settings.localUri) {
						if (typeof dataSource.type === "undefined" || dataSource.type === "OData") {
							oMockServer = new MockServer({
								rootUri: dataSource.uri
							});

							var oRequestHandler = new RequestHandler(sComponentId, dataSource.uri, oMockServer);

							sMockDataBaseUrl = dataSource.settings.localUri.split("/").slice(0, -1).join("/");
							oMockServer.simulate(appPath + "/" + dataSource.settings.localUri, {
								sMockdataBaseUrl: appPath + "/" + sMockDataBaseUrl,
								bGenerateMissingMockData: true
							});

							var aRequests = oMockServer.getRequests();


							if (manifest["sap.ui.generic.app"] &&
								manifest["sap.ui.generic.app"].pages &&
								manifest["sap.ui.generic.app"].pages[0] &&
								manifest["sap.ui.generic.app"].pages[0].component &&
								manifest["sap.ui.generic.app"].pages[0].component.name === "sap.suite.ui.generic.template.AnalyticalListPage") {
								ProductPush(aRequests, oMockServer, AjaxHelper);
							} else {


								//general requests e.g. CRUD
								var oPages = manifest["sap.ui.generic.app"].pages;
								var sEntitySet = (oPages[0] || oPages[Object.keys(oPages)[0]]).entitySet;
								switch (sEntitySet) {
									case "C_STTA_SalesOrder_WD_20":
										//SalesOrderPushFunctions.salesorderpush(aRequests, oMockServer);
										PushFunctions.create(aRequests, oMockServer);
										PushFunctions.edit(aRequests, oMockServer);
										PushFunctions.merge(aRequests, oMockServer);
										SalesOrderPushFunctions.salesorderpush(aRequests, oMockServer);
										SalesOrderPushFunctions.save(aRequests, oMockServer);
										break;
									case "STTA_C_MP_Product":
										//SalesOrderPushFunctions.salesorderpush(aRequests, oMockServer);
										PushFunctions.create(aRequests, oMockServer);
										PushFunctions.edit(aRequests, oMockServer);
										PushFunctions.merge(aRequests, oMockServer);
										break;
									default:
										aRequests.push(oRequestHandler.getRequestHandler());
										// Fallback: if none of the above entity sets was found, use all push functions.
										// This is not ideal from performance perspective, but prevents OPA/voter issues for opaTestsALPWithParam.qunit.html.
										// This should be further improved, so that the default case is never reached.
										//SalesOrderPush(aRequests, oMockServer);
										ProductPush(aRequests, oMockServer, AjaxHelper);
										break;
								}

							}


							MockServer.prototype.setRequests.apply(oMockServer, [aRequests]);
							//oMockServer.setRequests(aRequests); // <-- temporary by DraftEnabledMockServer and must not be called until fixed
						} else {
							var rRegEx = dataSource.uri;
							if (dataSource.type !== "MockRegEx") {
								rRegEx = new RegExp(MockServer.prototype
									._escapeStringForRegExp(dataSource.uri) + "([?#].*)?");
							}
							oMockServer = new MockServer({
								requests: [{
									method: "GET",
									//TODO have MockServer fixed and pass just the URL!
									path: rRegEx,
									response: makeCallbackFunction(appPath + "/" + dataSource.settings.localUri)
								}]
							});
						}
						oMockServer.start();
//						 write sent our request and dealt from mockserver into log
                        if (bMockLog){
						oMockServer.attachAfter("GET", function (obj) {
							console.log("---MOCKSERVER-REQUEST");
							console.log(deepExtend({}, obj));
							console.log(obj.mParameters.oXhr.method + " " + obj.mParameters.oXhr.url);
							//console.log(obj.mParameters.oXhr.responseText);
						    //console.log(obj.mParameters.oXhr.responseXML);
						});
                        }
					}
				}
			}
		}


		function stopMockServers() {
			var oMockServer, MockServer = sap.ui.core.util.MockServer;
			if (MockServer && MockServer.destroyAll){
				MockServer.destroyAll();
			} else {
				oMockServer = new MockServer();
				oMockServer.destroyAll();
			}
		}

		function enableFakeConnector() {
			FakeLrepConnectorLocalStorage.enableFakeConnector();
		}

		return {
			startMockServers:     startMockServers,
			stopMockServers:      stopMockServers,
			enableFakeConnector:  enableFakeConnector
		};
	});
