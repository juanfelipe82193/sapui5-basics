// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * Created on 12/06/2019.
 */
sap.ui.define([
	"sap/ui/thirdparty/jquery"
], function (jQuery) {
	"use strict";


	function Tunnels () {
		var that = this,
			fnRegisterShellCommunicationHandler,
			pairedMethods = {};

		this.init = function (fnRegisterShellCommunication) {
			if (!fnRegisterShellCommunication) {
				throw "1 argument expected, 0 received.";
			}
			fnRegisterShellCommunicationHandler = fnRegisterShellCommunication;
		};

		this.createInterface = function (sInterfaceName, fnCallback) {
			var oRequestCalls = {},
				oServiceCalls = {};
			oRequestCalls[sInterfaceName] = {
				sInterfaceName: {
					isActiveOnly: false,
					distributionType: ["URL"]
				}
			};
			oServiceCalls[sInterfaceName] = {
				executeServiceCallFn: function (oServiceParams) {
					var oResp = fnCallback(oServiceParams);
					return new jQuery.Deferred().resolve(oResp).promise();
				}
			};
			fnRegisterShellCommunicationHandler({
				"sap.ushell.tunnelRegistry": {
					oRequestCalls: oRequestCalls,
					oServiceCalls: oServiceCalls
				}
			});
		};

		this.createTunnelServiceCallsInfo = function (oTunnels) {
			return this.createServiceCallInfo(oTunnels);
		};

		this.createTunnelServiceCallsInfoForEvents = function (oEventRegistries) {
			return this.createServiceCallInfo(oEventRegistries, this.createEventEntry);
		};

		this.createServiceCallInfo = function (oRegistry, fnCreateTunnelSetup) {
			var tunnelsServiceCallsInfo = {},
				pair,
				oServiceCall,
				oPairedServiceCall,
				methodName,
				serviceName,
				serviceCall,
				serviceCallMethod,
				oTunnelSetup,
				fnExtractArguments,
				pairKey;
			// Go over the registry
			for (var sEventRegistryId in oRegistry) {
				if (oRegistry.hasOwnProperty(sEventRegistryId)) {
					oServiceCall = {};
					oPairedServiceCall = {};

					oTunnelSetup = oRegistry[sEventRegistryId];
					if (fnCreateTunnelSetup) {
						oTunnelSetup = fnCreateTunnelSetup(oTunnelSetup);
					}
					serviceCallMethod = that.createMethodForServiceCall(oTunnelSetup);
					serviceCall = that.createServiceCall(serviceCallMethod);
					oServiceCall[sEventRegistryId] = serviceCall;
					tunnelsServiceCallsInfo[sEventRegistryId] = {
						oServiceCall: oServiceCall
					};

					pair = oRegistry[sEventRegistryId].pair;
					if (pair && pair.sMethod) {
						methodName = pair.sMethod;
						serviceName = pair.sInterface;
						fnExtractArguments = pair.fnExtractArguments;
						serviceCall = that.createPairedServiceCall({
							fnMethod: serviceCallMethod,
							fnExtractArguments: fnExtractArguments
						});
						oPairedServiceCall[methodName] = serviceCall;
						pairKey = [serviceName, methodName].join('.');
						pairedMethods[pairKey] = {
							serviceCall: serviceCall,
							rawMethod: serviceCallMethod
						};
					}
					tunnelsServiceCallsInfo[sEventRegistryId] = {
						oServiceCall: oServiceCall
					};
				}
			}
			return tunnelsServiceCallsInfo;
		};

		this.createServiceCall = function (fnMethod) {
			return {
				executeServiceCallFn: function (oServiceParams) {
					return new jQuery.Deferred().resolve({
						endPoint: fnMethod
					}).promise();
				}
			};
		};

		this.createPairedServiceCall = function (oData) {
			var fnMethod = oData.fnMethod,
				fnExtractArguments = oData.fnExtractArguments;
			return function (oServiceParams) {
				var aArguments = fnExtractArguments(oServiceParams),
					returnArguments = fnMethod.apply(undefined, aArguments);
				return new jQuery.Deferred().resolve(returnArguments).promise();
			};
		};

		this.createMethodForServiceCall = function (oTunnel) {
			var oInterface = oTunnel.oInterface,
				sFuncName = oTunnel.sFuncName,
				fnSpy = oTunnel.fnSpy;
				return function () {
					if ((fnSpy && fnSpy.apply(undefined, arguments) || !fnSpy)) {
						return oInterface[sFuncName].apply(oInterface, arguments);
					}
				};
		};

		this.createEventEntry = function (oEventRegistry) {
			var oTunnelInterface = {},
				oInterface = oEventRegistry.oInterface,
				sFuncName = oEventRegistry.sFuncName,
				fnProxy = oEventRegistry.fnProxy;

			oTunnelInterface[sFuncName] = function () {
				var oParams = arguments;
				if (fnProxy) {
					oParams = fnProxy.apply(undefined, arguments);
				}
				if (arguments && arguments.length) {
					oInterface[sFuncName].apply(oInterface, oParams);
				} else {
					oInterface[sFuncName].apply(oInterface);
				}
			};
			return {
				oInterface: oTunnelInterface,
				sFuncName: sFuncName,
				fnSpy: oEventRegistry.fnSpy
			};
		};

		this.registerTunnels = function (oTunnels) {
			if (!fnRegisterShellCommunicationHandler) {
				throw "No 'fnRegisterShellCommunicationHandler'. Use 'init' method.";
			}
			var oServiceCallsInfo = that.createTunnelServiceCallsInfo(oTunnels);
			this.createServiceCalls(oServiceCallsInfo);
		};

		this.registerEvents = function (oEventRegistries) {
			if (!fnRegisterShellCommunicationHandler) {
				throw "No 'fnRegisterShellCommunicationHandler'. Use 'init' method.";
			}
			var oServiceCallsInfo = that.createTunnelServiceCallsInfoForEvents(oEventRegistries);
			this.createServiceCalls(oServiceCallsInfo);
		};

		this.createServiceCalls = function (oServiceCallsInfo) {
			var serviceName = "sap.ushell.tunnelRegistry",
				commHandlers = {},
				id,
				serviceCallObj;

			commHandlers[serviceName] = {
				oServiceCalls: {}
			};

			for (id in oServiceCallsInfo) {
				if (oServiceCallsInfo.hasOwnProperty(id)) {
					serviceCallObj = oServiceCallsInfo[id].oServiceCall;
					jQuery.extend(commHandlers[serviceName].oServiceCalls, serviceCallObj);
				}
			}
			fnRegisterShellCommunicationHandler(commHandlers);
		};

		this.getPairedMethod = function (sKey) {
			if (pairedMethods[sKey]) {
				return pairedMethods[sKey].rawMethod;
			}
		};

		this.getPairedServiceCall = function (sKey) {
			if (pairedMethods[sKey]) {
				return pairedMethods[sKey].serviceCall;
			}
		};
	}

	return new Tunnels();
}, /* bExport= */ true);