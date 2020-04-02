// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI",
	"sap/ushell/appRuntime/ui5/AppRuntimeService",
	"sap/base/util/UriParameters",
	"sap/ui/thirdparty/URI",
	"sap/ui/thirdparty/jquery",
	"sap/ushell/appRuntime/ui5/services/TunnelsAgent",
	"sap/ushell/appRuntime/ui5/services/AppDelegationBootstrap"
], function (AppRuntimePostMessageAPI, AppRuntimeService, UriParameters, URI, jQuery, tunnelsAgent, delegationBootstrap) {
	"use strict";

	function AppLifeCycleAgent (oConfig) {
		var that = this,
			AppResolution,
			fnCreateApplication,
			oCachedApplications = {},
			oRunningApp,
			fnRenderApp,
			eventHandlers = {};

		this.getAppInfo= function (sModule, ofnCreateApplication, ofnRenderApp) {
			sap.ui.require([sModule.replace(/\./g, "/")], function (AppResolution) {
				that.init(AppResolution, ofnCreateApplication, ofnRenderApp);
			});
		};

		this.init = function (oAppResolution, ofnCreateApplication, ofnRenderApp) {
			AppResolution = oAppResolution;
			fnCreateApplication = ofnCreateApplication;
			fnRenderApp = ofnRenderApp;
			//register this create & destroy as a appLifeCycleCommunication handler
			AppRuntimePostMessageAPI.registerCommHandlers({
				"sap.ushell.services.appLifeCycle": {
					"oInboundActions": {
						"create": {
							executeServiceCallFn: function (oMessageData) {
								var oMsg = JSON.parse(oMessageData.oMessage.data),
									sAppId = new UriParameters(oMsg.body.sUrl).get("sap-ui-app-id");
								window.hasher.replaceHash(oMsg.body.sHash);

								//TODO: in order to support startupParameters simply pass oMsg.body.sUrl to the create so that ui5CommponetCreator can create the component with the parameters
								that.create(sAppId, oMsg.body.sUrl);
								return new jQuery.Deferred().resolve().promise();
							}
						},
						"destroy": {
							executeServiceCallFn: function (oMessageData) {
								var oMsg = JSON.parse(oMessageData.oMessage.data);
								that.destroy(oMsg.body.sCacheId);
								return new jQuery.Deferred().resolve().promise();
							}
						},
						"store": {
							executeServiceCallFn: function (oMessageData) {
								var oMsg = JSON.parse(oMessageData.oMessage.data);
								that.store(oMsg.body.sCacheId);
								return new jQuery.Deferred().resolve().promise();
							}
						},
						"restore": {
							executeServiceCallFn: function (oMessageData) {
								var oMsg = JSON.parse(oMessageData.oMessage.data);

								window.hasher.replaceHash(oMsg.body.sHash);
								that.restore(oMsg.body.sCacheId);
								return new jQuery.Deferred().resolve().promise();
							}
						}
					}
				},
				"sap.ushell.eventDelegation": {
					"oInboundActions": {
						"registerEventHandler": {
							executeServiceCallFn: function (oServiceParams) {
								var sEventObject = JSON.parse(oServiceParams.oMessageData.body.sEventObject),
									eventKey = sEventObject.eventKey,
									eventData = sEventObject.eventData;
								if (eventHandlers.hasOwnProperty(eventKey)) {
									var handlersList = eventHandlers[eventKey];
									for (var handlerIndex = 0; handlerIndex < handlersList.length; handlerIndex++) {
										handlersList[handlerIndex](eventData);
									}
								}
								return new jQuery.Deferred().resolve().promise();
							}
						}
					}
				}
			});
			this.initialSetup();
		};

		this.initialSetup = function () {

			delegationBootstrap.bootstrap();

			AppRuntimeService.sendMessageToOuterShell(
				"sap.ushell.services.appLifeCycle.setup", {
					isStateful: true,
					isKeepAlive: true,
					lifecycle: {
						bActive: true,
						bSwitch: true,
						bStorageIdentifier: true
					},
					settings: {
						bTheme: true,
						bLocal: true
					},
					session: {
						bSignOffSupport: true,
						bExtendSessionSupport: true
					}
				});
		};

		this.restore = function (sStorageKey) {
			var oCachedEntry = oCachedApplications[sStorageKey],
				oApp = oCachedEntry.getComponentInstance();

			oCachedEntry.setVisible(true);

			if (oApp) {
				if (oApp.restore) {
					oApp.restore();
				}

				if (oApp.getRouter && oApp.getRouter() && oApp.getRouter().initialize) {
					oApp.getRouter().initialize();
				}

				oRunningApp = oCachedEntry;
			}
		};

		this.store = function (sStorageKey) {
			var oCachedEntry = oRunningApp,
				oApp;

			oCachedApplications[sStorageKey] = oCachedEntry;

			oApp = oCachedEntry.getComponentInstance();
			oCachedEntry.setVisible(false);

			if (oApp) {
				if (oApp.suspend) {
					oApp.suspend();
				}
				if (oApp.getRouter && oApp.getRouter()) {
					oApp.getRouter().stop();
				}
			}
		};

		this.getURLParameters = function (oUrlParameters) {
			return new Promise(function (fnResolve, fnReject) {
				if (oUrlParameters.hasOwnProperty("sap-intent-param")) {
					var sAppStateKey = oUrlParameters["sap-intent-param"];
					AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.CrossApplicationNavigation.getAppStateData", { "sAppStateKey": sAppStateKey })
						.then(function (sParameters) {
							delete oUrlParameters["sap-intent-param"];
							var oUrlParametersExpanded = jQuery.extend({}, oUrlParameters, (new URI("?" + sParameters)).query(true), true);
							fnResolve(oUrlParametersExpanded);
						}, function (sError) {
							fnResolve(oUrlParameters);
						});
				} else {
					fnResolve(oUrlParameters);
				}
			});
		};



		this.create = function (appId, sUrl) {
			var applicationInfoPromis = new Promise(function (fnResolve) {
				AppResolution.getAppInfo(appId).then(function (oAppInfo) {
					fnResolve(oAppInfo);
				});
			}).then(function (oAppInfo) {
				that.getURLParameters(new URI(sUrl).query(true)).then(function (oURLParameters) {
					fnCreateApplication(appId, oURLParameters, oAppInfo)
						.then(function (oResolutionResult) {
							fnRenderApp(oResolutionResult);
						});
				});
			});

			return applicationInfoPromis;
		};

		this.setComponent = function (oApp) {
			oRunningApp = oApp;
		};

		this.destroy = function (sStorageKey) {
			// oCachedApplications[appId].getRouter().stop();
			if (sStorageKey) {
				if (oCachedApplications[sStorageKey] === oRunningApp) {
					oRunningApp = undefined;
				}
				oCachedApplications[sStorageKey].destroy();
				delete oCachedApplications[sStorageKey];
			} else if (oRunningApp) {
				oRunningApp.destroy();
				oRunningApp = undefined;
			}
		};

		this.jsonStringifyFn = function (oJson) {
			var sResult = JSON.stringify(oJson, function (key, value) {
				return (typeof value === "function") ? value.toString() : value;
			});

			return sResult;
		};
	}

	return new AppLifeCycleAgent();
}, true);

