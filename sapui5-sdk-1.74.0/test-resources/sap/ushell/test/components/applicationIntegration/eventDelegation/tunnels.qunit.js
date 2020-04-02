// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.eventDelegation.tunnels
 */
sap.ui.require([
	"sap/ushell/components/applicationIntegration/eventDelegation/tunnels"
], function (tunnels) {
	"use strict";

	/* global module ok deepEqual, jQuery sap QUnit */

	module("sap.ushell.components.applicationIntegration.eventDelegation.tunnels", {
	});


	QUnit.test("#check creation of tunnels for events", function (assert) {
		[
			{
				description: "Empty events",
				oEvents: {

				},
				oExpectedResults: {
					expectedResult: {
					}
				},
				sMsg: "Empty events"
			},
			{
				description: "Single event",
				oEvents: {
					"addmousemove": {
						oInterface: document,
						sFuncName: "addEventListener",
						fnProxy: function(eventName, fnCallback, useCapture) {
							return [eventName, fnCallback, useCapture];
						},
						fnSpy: function() {
							return true
						}
					}
				},
				oExpectedResults: {
					expectedResult: {
						"addmousemove": {
							oServiceCall: {
								"addmousemove": {
									executeServiceCallFn: function (oServiceParams) {
										return new jQuery.Deferred().resolve({
											endPoint: fnMethod
										}).promise();
									}
								}
							}
						}
					}
				},
				sMsg: "Creting single event"
			},
			{
				description: "Multiple events",
				oEvents: {
					"addmousemove": {
						oInterface: document,
						sFuncName: "addEventListener",
						fnProxy: function(eventName, fnCallback, useCapture) {
							return [eventName, fnCallback, useCapture];
						},
						fnSpy: function() {
							return true;
						}
					},
					"removemousemove": {
						oInterface: document,
						sFuncName: "removeEventListener",
						fnProxy: function(eventName, fnCallback, useCapture) {
							return [eventName, fnCallback, useCapture];
						},
						fnSpy: function() {
							return true;
						}
					}
				},
				oExpectedResults: {
					expectedResult: {
						"addmousemove": {
							oServiceCall: {
								"addmousemove": {
									executeServiceCallFn: function (oServiceParams) {
										return new jQuery.Deferred().resolve({
											endPoint: fnMethod
										}).promise();
									}
								}
							}
						},
						"removemousemove": {
							oServiceCall: {
								"removemousemove": {
									executeServiceCallFn: function (oServiceParams) {
										return new jQuery.Deferred().resolve({
											endPoint: fnMethod
										}).promise();
									}
								}
							}
						}
					}
				},
				sMsg: "Creating multiple events"
			},
			{
				description: "No proxy",
				oEvents: {
					"addmousemove": {
						oInterface: document,
						sFuncName: "addEventListener",
						fnSpy: function() {
							return true;
						}
					}
				},
				oExpectedResults: {
					expectedResult: {
						"addmousemove": {
							oServiceCall: {
								"addmousemove": {
									executeServiceCallFn: function (oServiceParams) {
										return new jQuery.Deferred().resolve({
											endPoint: fnMethod
										}).promise();
									}
								}
							}
						}
					}
				},
				sMsg: "Creating event without proxy object"
			},
			{
				description: "No spy",
				oEvents: {
					"addmousemove": {
						oInterface: document,
						sFuncName: "addEventListener",
						fnProxy: function(eventName, fnCallback, useCapture) {
							return [eventName, fnCallback, useCapture];
						}
					}
				},
				oExpectedResults: {
					expectedResult: {
						"addmousemove": {
							oServiceCall: {
								"addmousemove": {
									executeServiceCallFn: function (oServiceParams) {
										return new jQuery.Deferred().resolve({
											endPoint: fnMethod
										}).promise();
									}
								}
							}
						}
					}
				},
				sMsg: "Creating event without spy object"
			}
		].forEach(function (oFixture) {
			var oEventRegistries = oFixture.oEvents,
				expectedResult = oFixture.oExpectedResults.expectedResult,
				oServiceCalls;


			oServiceCalls = tunnels.createTunnelServiceCallsInfoForEvents(oEventRegistries);

			assert.strictEqual(
				JSON.stringify(expectedResult),
				JSON.stringify(oServiceCalls),
				oFixture.sMsg
			);
		});
	});

	QUnit.test("#check creation of tunnels", function (assert) {
		[
			{
				description: "Empty tunnels",
				oEvents: {

				},
				oExpectedResults: {
					expectedResult: {
					}
				},
				sMsg: "Empty tunnels"
			},
			{
				description: "Single tunnel",
				oEvents: {
					"clickCallback": {
						oInterface: {clickCallback: function(){}},
						sFuncName: "clickCallback"
					}
				},
				oExpectedResults: {
					expectedResult: {
						"clickCallback": {
							oServiceCall: {
								"clickCallback": {
									executeServiceCallFn: function (oServiceParams) {
										return new jQuery.Deferred().resolve({
											endPoint: fnMethod
										}).promise();
									}
								}
							}
						}
					}
				},
				sMsg: "Creating single tunnel"
			},
			{
				description: "Multiple tunnels",
				oEvents: {
					"clickCallback1": {
						oInterface: {clickCallback1: function(){}},
						sFuncName: "clickCallback1"
					},
					"clickCallback2": {
						oInterface: {clickCallback2: function(){}},
						sFuncName: "clickCallback2"
					}
				},
				oExpectedResults: {
					expectedResult: {
						"clickCallback1": {
							oServiceCall: {
								"clickCallback1": {
									executeServiceCallFn: function (oServiceParams) {
										return new jQuery.Deferred().resolve({
											endPoint: fnMethod
										}).promise();
									}
								}
							}
						},
						"clickCallback2": {
							oServiceCall: {
								"clickCallback2": {
									executeServiceCallFn: function (oServiceParams) {
										return new jQuery.Deferred().resolve({
											endPoint: fnMethod
										}).promise();
									}
								}
							}
						}
					}
				},
				sMsg: "Creating multiple tunnels"
			}
		].forEach(function (oFixture) {
			var oEventRegistries = oFixture.oEvents,
				expectedResult = oFixture.oExpectedResults.expectedResult,
				oServiceCalls;


			oServiceCalls = tunnels.createTunnelServiceCallsInfo(oEventRegistries);

			assert.strictEqual(
				JSON.stringify(expectedResult),
				JSON.stringify(oServiceCalls),
				oFixture.sMsg
			);
		});
	});
});
