// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.74.0
 */
sap.ui.define([
	"sap/ushell/components/applicationIntegration/eventDelegation/tunnels"
], function (tunnels) {
	"use strict";

	var that = this;

	function DelegationBootstrap () {
		that = this;
		this.init = function (fnRegisterCommHandler, fnPostMessageToIframe) {
			that.fnRegisterCommHandler = fnRegisterCommHandler;
			that.fnPostMessageToIframe = fnPostMessageToIframe;
			tunnels.init(fnRegisterCommHandler);
		};

		this.bootstrap = function () {
			that.fnRegisterCommHandler({
				"sap.ushell.demo": {
					oRequestCalls: {
						"passCoordinates": {
							isActiveOnly: true,
							distributionType: ["URL"],
							fnResponseHandler: function (oPromoise) {
								oPromoise.then(function (oRespData) {
									Log.info("sap.ushell.dem.passCoordinates:" + oRespData);
								}).catch(function (oError) {
									Log.error("sap.ushell.dem.passCoordinates:" + oError);
								});
							}
						}
					}
				}
			});

			var callbacks = {},
				oInterface = {
					clickCallback: function (event) {
						that.fnPostMessageToIframe("sap.ushell.demo", "passCoordinates", {
							screenX: event.screenX,
							screenY: event.screenY
						}, false);
					},
					keyPressCallback: function (event) {
						// console.log("key press handled!");
					}
				},
				oEvents = {
					"addlistener": {
						oInterface: document,
						sFuncName: "addEventListener",
						fnProxy: function (type, fnCallback, useCapture) {
							var oCallback,
								nUUID;
							if (fnCallback.pairedInterface) {
								oCallback = tunnels.getPairedMethod(fnCallback.pairedInterface);
							} else if (fnCallback.getUUID) {
								nUUID = fnCallback.getUUID();
								if (callbacks[nUUID]) {
									oCallback = callbacks[nUUID]
								} else {
									oCallback = function(event) {
										fnCallback({
											screenX: event.screenX,
											screenY: event.screenY
										})
									};
									callbacks[nUUID] = oCallback;
								}
							} else {
								oCallback = fnCallback;
							}
							return [type, oCallback, useCapture];
						},
						fnSpy: function (eventType) {
							return eventType === "click" || eventType === "keypress";
						}
					},
					"removelistener": {
						oInterface: document,
						sFuncName: "removeEventListener",
						fnProxy: function (type, fnCallback, useCapture) {
							var oCallback;
							if (fnCallback.pairedInterface) {
								oCallback = tunnels.getPairedMethod(fnCallback.pairedInterface);
							} else if (fnCallback.getUUID) {
								oCallback = callbacks[fnCallback.getUUID()];
							} else {
								oCallback = fnCallback;
							}
							return [type, oCallback, useCapture];
						},
						fnSpy: function (eventType) {
							return eventType === "click" || eventType === "keypress";
						}
					},
					"appOpening": {
						oInterface: sap.ui.getCore().getEventBus(),
						sFuncName: "subscribe",
						fnSpy: function (publisher, eventName) {
							return publisher === "launchpad" && eventName === "appOpening";
						}
					}

				},

				oTunnels = {
					"clickCallback": {
						oInterface: oInterface,
						sFuncName: "clickCallback",
						pair: {
							sMethod: "clickCallback",
							sInterface: "sap.ushell.pairedInterface",
							fnExtractArguments: function (oServiceParams) {
								return [{
									screenX: oServiceParams.oMessageData.body.screenX,
									screenY: oServiceParams.oMessageData.body.screenY
								}];
							}
						}
					},
					"keyPressCallback": {
						oInterface: oInterface,
						sFuncName: "keyPressCallback"
					},
					"demoFunction": {
						oInterface: {
							demoFunction: function (oArgs) {
								return "Outer Shell says: Your argument is: " + oArgs.demo;
							}
						},
						sFuncName: "demoFunction"
					}
				};

			tunnels.registerEvents(oEvents);

			tunnels.registerTunnels(oTunnels);
		};

		this.setup = function (fnRegisterShellCommunicationHandler) {
			tunnels.setup(fnRegisterShellCommunicationHandler);
		};

		this.createInterface = function (oConfig) {
			var sInterfaceName = oConfig.name,
				fnCallback = oConfig.callback;
			tunnels.createInterface(sInterfaceName, that.fnRegisterCommHandler, fnCallback);
		};

		this.registerEvents = function(oEvents) {
			tunnels.registerEvents(oEvents);
		};

		this.registerTunnels = function(oTunnels) {
			tunnels.registerTunnels(oTunnels);
		};
	}

	return new DelegationBootstrap();

}, /* bExport= */ true);
