// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * Created by on 13/06/2019.
 */
sap.ui.define([
	"sap/ushell/appRuntime/ui5/AppRuntimeService"

], function (AppRuntimeService) {
	"use strict";

	function TunnelsAgent () {
		var tunnelsFunctions = {},
			that = this;

		this.reflectEvents = function (oStrategyConfiguration) {
			for (var sStrategyName in oStrategyConfiguration) {
				if (oStrategyConfiguration.hasOwnProperty(sStrategyName)) {
					this.reflectEventEntry(sStrategyName, oStrategyConfiguration[sStrategyName]);
				}
			}
		};

		this.reflectEventEntry = function (sStrategyName, oStrategy) {
			var iInterface = oStrategy.iInterface,
				sFuncName = oStrategy.sFuncName,
				sTunnel = sStrategyName,
				fnSpy = oStrategy.fnSpy,
				fnProxy = oStrategy.fnProxy,
				sError = "",
				fnCallback = function () {
					var oArgs = arguments,
						shouldRun = fnSpy.apply(undefined, arguments);
					if (fnProxy) {
						oArgs = fnProxy.apply(undefined, arguments);
					}
					if (shouldRun) {
						that.callTunnel({
							tunnelName: sTunnel,
							oData: oArgs
						});
					}
				};
			if (!oStrategy.iInterface) {
				sError += "strategy " + sStrategyName + " is missing mandatory property 'iInterface'.\n";
			}
			if (!oStrategy.sFuncName) {
				sError += "strategy " + sStrategyName + " is missing mandatory property 'sFuncName'.\n";
			}
			if (sError) {
				throw sError;
			}

			this.replace({
				iInterface: iInterface,
				sFuncName: sFuncName,
				fnCallback: fnCallback,
				sWrap: "after"
			});
		};

		this.getCallTunnelFunction = function () {
			var tunnelsFunctions = {},
				that = this;
			return function (oParams) {
				var sFuncName = oParams.tunnelName,
					oArgs = oParams.oData;
				if (!tunnelsFunctions[sFuncName]) {
					// request registration
					that.getTunnel(sFuncName)
						.done(function (oRetObj) {
							tunnelsFunctions[sFuncName] = oRetObj.endPoint;
							// Call outer shell function
							tunnelsFunctions[sFuncName].apply(undefined, oArgs);
						});
				} else {
					// Call outer shell function
					tunnelsFunctions[sFuncName].apply(undefined, oArgs);
				}
			};
		};

		this.callTunnel = function (oParams) {
			var sFuncName = oParams.tunnelName,
				oArgs = oParams.oData;
			return new Promise(function(resolve) {
				if (!tunnelsFunctions[sFuncName]) {
					// request registration
					that.getTunnel(sFuncName)
						.done(function (oRetObj) {
							tunnelsFunctions[sFuncName] = oRetObj.endPoint;
							// Call outer shell function
							tunnelsFunctions[sFuncName].apply(undefined, oArgs)
								.done(function(data) {
									resolve(data);
								});
						});
				} else {
					// Call outer shell function
					tunnelsFunctions[sFuncName].apply(undefined, oArgs)
						.done(function(data) {
							resolve(data);
						});
				}
			});
		};

		this.replace = function (oParams) {
			var original = oParams.iInterface[oParams.sFuncName],
				sWrap = oParams.sWrap;
			oParams.iInterface[oParams.sFuncName] = function () {
				if (sWrap === "before") {
					original.apply(this, arguments);
				}
				oParams.fnCallback.apply(undefined, arguments);
				if (sWrap === "after") {
					original.apply(this, arguments);
				}
			};

			return {
				getOriginal: function () { return original; }
			};
		};

		this.useInterface = function (oData) {
			var sInterfaceName = oData.name,
				fnCallback = oData.callback,
				oParams = oData.params;
			var sCommInterface = "sap.ushell.tunnelRegistry." + sInterfaceName;
			AppRuntimeService.sendMessageToOuterShell(sCommInterface, oParams)
				.done(fnCallback);
		};

		this.getTunnel = function (sTunnelName) {
			var sCommInterface = "sap.ushell.tunnelRegistry." + sTunnelName;
			return AppRuntimeService.sendMessageToOuterShell(sCommInterface, {});
		};

		this.usePairedInterface = function (oConfig) {
			var sService = oConfig.sService,
				sMethodName = oConfig.sMethodName,
				fnPackArgs = oConfig.fnPackArgs,
				sCommInterface = sService + "." + sMethodName;

			var callbackFn = function () {
				var oPackedArgs = fnPackArgs.apply(undefined, arguments);
				return AppRuntimeService.sendMessageToOuterShell(sCommInterface, oPackedArgs);
			};

			callbackFn.getPairedInterface = function() {
				return [sService, sMethodName].join('.');
			};

			return callbackFn;
		};
	}

	return new TunnelsAgent();
}, /* bExport= */ true);
