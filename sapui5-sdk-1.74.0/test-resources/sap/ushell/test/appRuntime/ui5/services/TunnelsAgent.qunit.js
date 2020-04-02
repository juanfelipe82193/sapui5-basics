// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.AppLifeCycleAgent
 */
sap.ui.require([
	"sap/ushell/appRuntime/ui5/services/TunnelsAgent"
], function (tunnelsAgent) {
	"use strict";

	/* global module jQuery sap QUnit sinon */

	module("sap.ushell.appRuntime.ui5.services.TunnelsAgent", {
	});

	QUnit.test("#check reflection of events", function (assert) {
		[
			{
				description: "Empty event",
				oEvents: {

				},
				oExpectedResults: {
					reflectEventEntryCalls: 0,
					replaceCalls: 0
				},
				sMsg: "Empty event"
			},
			{
				description: "Single event",
				oEvents: {
					"evt1": {
						iInterface: {
							fnDummy: function () {}
						},
						sFuncName: "fnDummy",
						fnProxy: function () {
							return arguments;
						},
						fnSpy: function () {
							return true;
						}
					}
				},
				oExpectedResults: {
					reflectEventEntryCalls: 1,
					replaceCalls: 1
				},
				sMsg: "Single event"
			},
			{
				description: "Multiple events",
				oEvents: {
					"evt1": {
						iInterface: {
							fnDummy: function () {}
						},
						sFuncName: "fnDummy",
						fnProxy: function () {
							return arguments;
						},
						fnSpy: function () {
							return true;
						}
					},
					"evt2": {
						iInterface: {
							fnDummy: function () {}
						},
						sFuncName: "fnDummy",
						fnProxy: function () {
							return arguments;
						},
						fnSpy: function () {
							return true;
						}
					},
					"evt3": {
						iInterface: {
							fnDummy: function () {}
						},
						sFuncName: "fnDummy",
						fnProxy: function () {
							return arguments;
						},
						fnSpy: function () {
							return true;
						}
					}
				},
				oExpectedResults: {
					reflectEventEntryCalls: 3,
					replaceCalls: 3
				},
				sMsg: "Multiple events"
			},
			{
				description: "No proxy",
				oEvents: {
					"evt1": {
						iInterface: {
							fnDummy: function () {}
						},
						sFuncName: "fnDummy",
						fnSpy: function () {
							return true;
						}
					}
				},
				oExpectedResults: {
					reflectEventEntryCalls: 1,
					replaceCalls: 1
				},
				sMsg: "No proxy"
			},
			{
				description: "No spy",
				oEvents: {
					"evt1": {
						iInterface: {
							fnDummy: function () {}
						},
						sFuncName: "fnDummy",
						fnProxy: function () {
							return arguments;
						}
					}
				},
				oExpectedResults: {
					reflectEventEntryCalls: 1,
					replaceCalls: 1
				},
				sMsg: "No spy"
			},
			{
				description: "No spy and proxy",
				oEvents: {
					"evt1": {
						iInterface: {
							fnDummy: function () {}
						},
						sFuncName: "fnDummy"
					}
				},
				oExpectedResults: {
					reflectEventEntryCalls: 1,
					replaceCalls: 1
				},
				sMsg: "No spy and proxy"
			},
			{
				description: "No interface",
				oEvents: {
					"evt1": {
						sFuncName: "fnDummy",
						fnProxy: function () {
							return arguments;
						},
						fnSpy: function () {
							return true;
						}
					}
				},
				oExpectedResults: {
					expectedException: "strategy evt1 is missing mandatory property 'iInterface'.\n"
				},
				sMsg: "No interface"
			},
			{
				description: "No funcName",
				oEvents: {
					"evt1": {
						iInterface: {
							fnDummy: function () {}
						},
						fnProxy: function () {
							return arguments;
						},
						fnSpy: function () {
							return true;
						}
					}
				},
				oExpectedResults: {
					expectedException: "strategy evt1 is missing mandatory property 'sFuncName'.\n"
				},
				sMsg: "No funcName"
			},
			{
				description: "No interface and funcName",
				oEvents: {
					"evt1": {
						fnProxy: function () {
							return arguments;
						},
						fnSpy: function () {
							return true;
						}
					}
				},
				oExpectedResults: {
					expectedException: "strategy evt1 is missing mandatory property 'iInterface'.\n" +
						"strategy evt1 is missing mandatory property 'sFuncName'.\n"
				},
				sMsg: "No interface and funcName"
			}

		].forEach(function (oFixture) {
			var oEventRegistries = oFixture.oEvents,
				expectedResult = oFixture.oExpectedResults,
				reflectEventEntryCalls = expectedResult.reflectEventEntryCalls,
				replaceCalls = expectedResult.replaceCalls,
				expectedException = expectedResult.expectedException;

			sinon.spy(tunnelsAgent, "reflectEventEntry");
			sinon.spy(tunnelsAgent, "replace");

			if (expectedException) {
				try {
					tunnelsAgent.reflectEvents(oEventRegistries);
				} catch (ex) {
					assert.equal(expectedException, ex, oFixture.sMsg);
				}
			} else {
				tunnelsAgent.reflectEvents(oEventRegistries);
				assert.equal(tunnelsAgent.reflectEventEntry.callCount, reflectEventEntryCalls, oFixture.sMsg + " - reflectEventEntry call count");
				assert.equal(tunnelsAgent.replace.callCount, replaceCalls, oFixture.sMsg + " - replace call count");
			}
			tunnelsAgent.reflectEventEntry.restore();
			tunnelsAgent.replace.restore();
		});
	});

	QUnit.test("#test callTunnelFunction", function (assert) {
		var defer = jQuery.Deferred(),
			getTunnel = sinon.stub(tunnelsAgent, "getTunnel"),
			endPoint = sinon.spy();
		defer.resolve({
			endPoint: endPoint
		});
		getTunnel.withArgs().returns(defer.promise());
		var testCallTunnel = function () {
			tunnelsAgent.callTunnel({
				tunnelName: "testFunction"
			});
		};

		testCallTunnel();

		assert.equal(tunnelsAgent.getTunnel.callCount, 1, "getTunnel call count");
		assert.equal(tunnelsAgent.getTunnel.callCount, 1, "endPoint is called");

		getTunnel.restore();
	});
});