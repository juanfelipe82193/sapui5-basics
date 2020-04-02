/**
 * tests for the sap.suite.ui.generic.template.lib.BusyHelper
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/BusyHelper", "sap/suite/ui/generic/template/lib/MessageUtils"
], function(sinon, BusyHelper, MessageUtils) {
	"use strict";

	var iBusyIndicatorDelay = {};
	var oTemplateContract = {
		oNavigationHost: {
			getBusyIndicatorDelay: function(){
				return iBusyIndicatorDelay;
			},
			setBusyIndicatorDelay: function(){
				return
			}
		},
		oNavigationObserver: {},
		oApplicationProxy: {}
	};
	var oBusyHelper;

	function fnNoUnbusyReject(assert){
		assert.ok(false, "UnbusyPromise must never be rejected");
	}

	module("Initialization");

	QUnit.test("Test that class can be instantiated", function(assert) {
		oBusyHelper = new BusyHelper(oTemplateContract);
		assert.ok(!oBusyHelper.isBusy(), "Initial busy helper must not be busy");
		//assert.ok(, "Busy helper must not have become busy by removing a busy reason");
		assert.strictEqual(oBusyHelper.getBusyDelay(), 0, "Busy Helper delay 0");
		var done = assert.async();
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		// Promise must already be resolved
		oUnbusyPromise.then(done, fnNoUnbusyReject.bind(null, assert));
	});

	var oSandbox;
	var fnNavigationEnded;
	function getProcessFinished(){
		return { then: fnNavigationEnded };
	}
	var oRemoveTransientMessageSpy;
	var oHandleTransientMessageSpy;

	function fnGeneralSetup(){
		fnNavigationEnded = null;
		oSandbox = sinon.sandbox.create();
		oRemoveTransientMessageSpy = oSandbox.stub(MessageUtils, "removeTransientMessages");
		oHandleTransientMessageSpy = oSandbox.stub(MessageUtils, "handleTransientMessages", function(){
			return Promise.resolve();
		});
		oBusyHelper = new BusyHelper(oTemplateContract);
		assert.strictEqual(oBusyHelper.getBusyDelay(), 0, "Busy Helper delay 0");
	}

	function fnGeneralTeardown(){
			oSandbox.restore();
		}

	module("Test setting busy via setBusyReason", {
		setup: fnGeneralSetup,
		teardown: fnGeneralTeardown
	});

	QUnit.test("Test that setting to busy works", function(assert) {
		var done = assert.async();
		var bBusyNotYetCalled = true;
		oSandbox.stub(oTemplateContract.oNavigationHost, "setBusy", function(bBusy){
			assert.ok(bBusy, "Control must have been set to busy");
			assert.ok(bBusyNotYetCalled, "Control must only be set to busy once");
			bBusyNotYetCalled = false;
			setTimeout(function(){
				assert.ok(!oHandleTransientMessageSpy.called, "Transient messages must not have been displayed");
				assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must still have been removed only once");
				assert.ok(oBusyHelper.isBusy(), "Busy helper must still be busy");
				done();
			}, 100);
		});
		var oInitialUnbusyPromise = oBusyHelper.getUnbusy();
		oBusyHelper.setBusyReason("one", false, false);
		assert.ok(!oBusyHelper.isBusy(), "Busy helper must not have become busy by removing a busy reason");
		assert.strictEqual(oBusyHelper.getUnbusy(), oInitialUnbusyPromise, "Unbusy promise must not have been changed by removing a not existing busy reason");
		assert.ok(!oRemoveTransientMessageSpy.called, "Transient messages must not have been removed due to removing a busy reason");
		assert.ok(!oHandleTransientMessageSpy.called, "Transient messages must not have been handled due to removing a not existing busy reason");
		assert.ok(bBusyNotYetCalled, "Control must not have been set busy by removing a busy reason");
		oBusyHelper.setBusyReason("one", true, false);
		assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must have been removed");
		assert.ok(oBusyHelper.isBusy(), "Busy helper must have become busy");
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		oUnbusyPromise.then(assert.ok.bind(null, false, "Unbusy promise must not be resolved in this scenario"), fnNoUnbusyReject.bind(null, assert));
		oBusyHelper.setBusyReason("two", false, false);
		assert.ok(oBusyHelper.isBusy(), "Busy helper must not have become unbusy by removing another busy reason");
	});

	QUnit.test("Test that setting to busy and immeadiately unbusy works", function(assert) {
		oBusyHelper.setBusyReason("one", true, false);
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		var oUnbusyThen = oSandbox.spy();
		oUnbusyPromise.then(oUnbusyThen, fnNoUnbusyReject.bind(null, assert));
		oBusyHelper.setBusyReason("one", true, false);
		assert.ok(oBusyHelper.isBusy(), "Busy helper must still be busy");
		fnNavigationEnded = function(fnPositive, fnNegative){
			assert.strictEqual(fnPositive, fnNegative, "Reaction on positive and negative display promise must be identical");
			oSandbox.stub(oTemplateContract.oNavigationHost, "setBusy", function(bBusy){
				assert.ok(!bBusy, "Control must not have been set to busy");
			});
			oSandbox.stub(oTemplateContract.oNavigationHost, "setBusyIndicatorDelay", function(iDelay){
				assert.strictEqual(iDelay, 0, "Always start busy indicator at 0");
			});
			fnPositive();
		};
		oSandbox.stub(oTemplateContract.oNavigationObserver, "getProcessFinished", getProcessFinished);
		assert.ok(!oHandleTransientMessageSpy.called, "Transient messages must not have been displayed, yet");
		assert.ok(!oUnbusyThen.called, "UnbusyPromise must not have been resolved, yet");
		oBusyHelper.setBusyReason("one", false, false);
		assert.ok(!oBusyHelper.isBusy(), "Busy helper must have become unbusy by removing the busy reason");
		// Extend the test for some time to ensure that no unexpected calls occur
		var done = assert.async();
		setTimeout(
			function(){
				assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must still have been removed only once");
				assert.ok(oUnbusyThen.calledOnce, "UnbusyPromise must have been resolved");
				done();
			}, 100);
	});

	QUnit.test("Test that setting to busy and asynchronously unbusy works", function(assert) {
		oBusyHelper.setBusyReason("two", true, false);
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		var oUnbusyThen = oSandbox.spy();
		oUnbusyPromise.then(oUnbusyThen, fnNoUnbusyReject.bind(null, assert));
		oBusyHelper.setBusyReason("two", true, false);
		var done = assert.async();
		var bCurrentBusy = false;
		var oNavigationHostBusySpy = oSandbox.stub(oTemplateContract.oNavigationHost, "setBusy", function(bBusy){
			assert.strictEqual(bBusy, !bCurrentBusy, "Busy state of control must be inverted");
			bCurrentBusy = bBusy;
		});
		setTimeout(
			function(){
				oBusyHelper.setBusyReason("two", false, false);
				assert.ok(!oBusyHelper.isBusy(), "Busy helper must be unbusy now");
				fnNavigationEnded = function(fnPositive, fnNegative){
					assert.strictEqual(fnPositive, fnNegative, "Reaction on positive and negative display promise must be identical");
					setTimeout(function(){
						assert.ok(oNavigationHostBusySpy.calledTwice, "Control must have been set busy and unbusy");
						assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must still have been removed only once");
						assert.ok(oUnbusyThen.calledOnce, "Unbusy must have been resolved");
						assert.ok(oHandleTransientMessageSpy.calledOnce, "Transient messages must now have been displayed");
						done();
					}, 100);
					oSandbox.stub(oTemplateContract.oNavigationHost, "setBusyIndicatorDelay", function(iDelay){
						assert.strictEqual(iDelay, iBusyIndicatorDelay, "Only original delay must have been set to the control");
					});
					fnPositive();
				};
				oSandbox.stub(oTemplateContract.oNavigationObserver, "getProcessFinished", getProcessFinished);
			}, 100);
	});

	QUnit.test("Test that setting immediately busy works", function(assert) {
		//var oSetBusyIndicatorDelaySpy = oSandbox.spy(oTemplateContract.oNavigationHost, "setBusyIndicatorDelay");
		var oSetBusySpy = oSandbox.spy(oTemplateContract.oNavigationHost, "setBusy");
		oBusyHelper.setBusyReason("two", true, true);
		//assert.ok(oSetBusyIndicatorDelaySpy.calledOnce, "Busy indicator delay must have been changed");
		//assert.ok(oSetBusyIndicatorDelaySpy.calledWithExactly(0), "Busy indicator delay must have been set to 0");
		assert.ok(oSetBusySpy.calledOnce, "Control must have been set busy");
		assert.ok(oSetBusySpy.calledWithExactly(true), "Control must really have been set busy");
		//assert.ok(oSetBusyIndicatorDelaySpy.calledBefore(oSetBusySpy), "Delay must be changed before control is set busy");
		assert.ok(oBusyHelper.isBusy(), "Busy helper must be busy in this scenario, too");
		assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must have been removed");
		assert.ok(!oHandleTransientMessageSpy.called, "Transient messages must not have been displayed");
	});


	module("Test setting busy via setBusy", {
		setup: fnGeneralSetup,
		teardown: fnGeneralTeardown
	});

	QUnit.test("Test that setting to busy works", function(assert) {
		var done = assert.async();
		var bBusyNotYetCalled = true;
		oSandbox.stub(oTemplateContract.oNavigationHost, "setBusy", function(bBusy){
			assert.ok(bBusy, "Control must have been set to busy");
			assert.ok(bBusyNotYetCalled, "Control must only be set to busy once");
			bBusyNotYetCalled = false;
			setTimeout(function(){
				assert.ok(!oHandleTransientMessageSpy.called, "Transient messages must not have been displayed");
				assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must still have been removed only once");
				assert.ok(oBusyHelper.isBusy(), "Busy helper must still be busy");
				done();
			}, 100);
		});
		var oPromise = new Promise(Function.prototype);
		oBusyHelper.setBusy(oPromise, false);
		assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must have been removed");
		assert.ok(oBusyHelper.isBusy(), "Busy helper must have become busy");
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		oUnbusyPromise.then(assert.ok.bind(null, false, "Unbusy promise must not be resolved in this scenario"), fnNoUnbusyReject.bind(null, assert));
		oBusyHelper.setBusyReason("two", false, false);
		assert.ok(oBusyHelper.isBusy(), "Busy helper must not have become unbusy by removing a busy reason");
	});

	function fnTestResolvedPromise(assert, bResolve){
		var done = assert.async();
		var oPromise = Promise[bResolve ? "resolve" : "reject"]();
		oBusyHelper.setBusy(oPromise, false);
		assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must have been removed");
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		var oUnbusySpy = oSandbox.spy();
		oUnbusyPromise.then(oUnbusySpy, fnNoUnbusyReject.bind(null, assert));
		oSandbox.stub(oTemplateContract.oNavigationHost, "setBusyIndicatorDelay", function(iDelay){
			assert.strictEqual(iDelay, iBusyIndicatorDelay, "Only original delay must have been set to the control");
		});
		fnNavigationEnded = function(fnPositive, fnNegative){
			assert.strictEqual(fnPositive, fnNegative, "Reaction on positive and negative display promise must be identical");
			oSandbox.stub(oTemplateContract.oNavigationHost, "setBusy", function(bBusy){
				assert.ok(!bBusy, "Control must not have been set to busy");
			});
			fnPositive();
		};
		oSandbox.stub(oTemplateContract.oNavigationObserver, "getProcessFinished", getProcessFinished);
		setTimeout(function(){
			assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must still have been removed only once");
			assert.ok(oUnbusySpy.calledOnce, "Unbusy promise must have been resolved");
			assert.ok(!oBusyHelper.isBusy(), "Busy helper must be unbusy");
			assert.ok(oHandleTransientMessageSpy.calledOnce, "Transient messages must now have been displayed");
			done();
		}, 15);
	}

	QUnit.test("Test that setting to busy with a resolved Promise works", function(assert) {
		fnTestResolvedPromise(assert, true);
	});

	QUnit.test("Test that setting to busy with a rejected Promise works", function(assert) {
		fnTestResolvedPromise(assert, false);
	});

	QUnit.test("Test that setting to busy and resolving later works", function(assert) {
		var done = assert.async();
		var fnBusyEnd;
		var oPromise = new Promise(function(fnResolve){
			fnBusyEnd = fnResolve;
		});
		oBusyHelper.setBusy(oPromise, false);
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		var oUnbusySpy = oSandbox.spy();
		oUnbusyPromise.then(oUnbusySpy, fnNoUnbusyReject.bind(null, assert));
		var bCurrentBusy = false;
		var oNavigationHostBusySpy = oSandbox.stub(oTemplateContract.oNavigationHost, "setBusy", function(bBusy){
			assert.strictEqual(bBusy, !bCurrentBusy, "Busy state of control must be inverted");
			bCurrentBusy = bBusy;
		});
		setTimeout(function(){
			fnBusyEnd();
			fnNavigationEnded = function(fnPositive, fnNegative){
				assert.strictEqual(fnPositive, fnNegative, "Reaction on positive and negative display promise must be identical");
				fnPositive();
			};
			oSandbox.stub(oTemplateContract.oNavigationObserver, "getProcessFinished", getProcessFinished);
			oSandbox.stub(oTemplateContract.oNavigationHost, "setBusyIndicatorDelay", function(iDelay){
				assert.strictEqual(iDelay, iBusyIndicatorDelay, "Only original delay must have been set to the control");
			});
			setTimeout(function(){
				assert.ok(!oBusyHelper.isBusy(), "Busy helper must not be busy anymore");
				assert.ok(oUnbusySpy.calledOnce, "Unbusy promise must have been resolved");
				assert.ok(oNavigationHostBusySpy.calledTwice, "Control must have been set busy and unbusy again");
				assert.ok(oHandleTransientMessageSpy.calledOnce, "Transient messages must now have been displayed");
				assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must still have been removed only once");
				done();
			}, 100);
		}, 100);
	});

	QUnit.test("Test that setting immediately busy works", function(assert) {
		//var oSetBusyIndicatorDelaySpy = oSandbox.spy(oTemplateContract.oNavigationHost, "setBusyIndicatorDelay");
		var oSetBusySpy = oSandbox.spy(oTemplateContract.oNavigationHost, "setBusy");
		var fnBusyEnd;
		var oPromise = new Promise(function(fnResolve){
			fnBusyEnd = fnResolve;
		});
		oBusyHelper.setBusy(oPromise, true);
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		var oUnbusySpy = oSandbox.spy();
		oUnbusyPromise.then(oUnbusySpy, fnNoUnbusyReject.bind(null, assert));
		//assert.ok(oSetBusyIndicatorDelaySpy.calledOnce, "Busy indicator delay must have been changed");
		//assert.ok(oSetBusyIndicatorDelaySpy.calledWithExactly(0), "Busy indicator delay must have been set to 0");
		assert.ok(oSetBusySpy.calledOnce, "Control must have been set busy");
		assert.ok(oSetBusySpy.calledWithExactly(true), "Control must really have been set busy");
		//assert.ok(oSetBusyIndicatorDelaySpy.calledBefore(oSetBusySpy), "Delay must be changed before control is set busy");
		assert.ok(oBusyHelper.isBusy(), "Busy helper must be busy in this scenario, too");
		assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must have been removed");
		assert.ok(!oHandleTransientMessageSpy.called, "Transient messages must not have been displayed");
		var done = assert.async();
		setTimeout(function(){
			fnBusyEnd();
			fnNavigationEnded = function(fnPositive, fnNegative){
				assert.strictEqual(fnPositive, fnNegative, "Reaction on positive and negative display promise must be identical");
				fnPositive();
			};
			oSandbox.stub(oTemplateContract.oNavigationObserver, "getProcessFinished", getProcessFinished);
			assert.ok(!oUnbusySpy.called, "Unbusy spy must not yet have been called");
			setTimeout(function(){
				//assert.ok(oSetBusyIndicatorDelaySpy.calledTwice, "Busy indicator delay must have been changed to original value");
				//assert.ok(oSetBusyIndicatorDelaySpy.calledWithExactly(iBusyIndicatorDelay), "Busy indicator delay must have been set back to original value");
				assert.ok(oSetBusySpy.calledTwice, "Control must have been set unbusy");
				assert.ok(oSetBusySpy.calledWithExactly(false), "Control must really have been set unbusy");
				assert.ok(!oBusyHelper.isBusy(), "Busy helper must be unbusy now");
				assert.ok(oRemoveTransientMessageSpy.calledOnce, "Outdated transient messages must still have been removed only once");
				assert.ok(oHandleTransientMessageSpy.calledOnce, "Transient messages must have been displayed");
				assert.ok(oUnbusySpy.calledOnce, "Unbusy spy must not have been called");
				done();
			}, 100);
		}, 100);
	});



	module("Complex scenarios", {
		setup: fnGeneralSetup,
		teardown: fnGeneralTeardown
	});

	QUnit.test("Test a complex scenario with setting and removing busy states", function(assert) {
		var done = assert.async();
		var aPromises = [];
		var aResolves = [];
		var aRejects = [];
		for (var i = 0; i < 3; i++){
			aPromises[i] = new Promise(function(fnResolve, fnReject){
				aResolves.push(fnResolve);
				aRejects.push(fnReject);
			});
		}
		fnNavigationEnded = function(fnPositive, fnNegative){
			assert.strictEqual(fnPositive, fnNegative, "Reaction on positive and negative display promise must be identical");
			fnPositive();
		};
		oSandbox.stub(oTemplateContract.oNavigationObserver, "getProcessFinished", getProcessFinished);
		oBusyHelper.setBusy(aPromises[0]);
		var oUnbusyPromise = oBusyHelper.getUnbusy();
		var oUnbusySpy = oSandbox.spy();
		oUnbusyPromise.then(oUnbusySpy, fnNoUnbusyReject.bind(null, assert));
		oBusyHelper.setBusy(aPromises[1]);
		aResolves[0]();
		var bBusyExpected = true;
		var bIsBusy = false;
		var oNavigationHostBusySpy = oSandbox.stub(oTemplateContract.oNavigationHost, "setBusy", function(bBusy){
			assert.strictEqual(bBusy, bBusyExpected, "Busy state of control must be set correctly");
			bIsBusy = bBusy;
		});
		setTimeout(function(){
			assert.ok(oNavigationHostBusySpy.calledOnce, "Control must have been set busy");
			aRejects[1]();
			oBusyHelper.setBusyReason("three", true);
			oBusyHelper.setBusyReason("four", false);
			setTimeout(function(){
				oBusyHelper.setBusyReason("three", false);
				oBusyHelper.setBusyReason("four", true);
				setTimeout(function(){
					oBusyHelper.setBusy(aPromises[2]);
					oBusyHelper.setBusyReason("four", false);
					assert.ok(oBusyHelper.isBusy(), "Busy helper must be busy now");
					setTimeout(function(){
						aRejects[2]();
						assert.ok(!oUnbusySpy.called, "Unbusy spy must not have been resolved, yet");
						oSandbox.stub(oTemplateContract.oNavigationHost, "setBusyIndicatorDelay", function(iDelay){
							assert.strictEqual(iDelay, iBusyIndicatorDelay, "Only original delay must have been set to the control");
						});
						bBusyExpected = false;
						setTimeout(function(){
							assert.ok(oUnbusySpy.calledOnce, "Unbusy spy must have been resolved");
							assert.ok(!bIsBusy, "Control must be unbusy now");
							assert.ok(!oBusyHelper.isBusy(), "Busy helper must be unbusy now");
							done();
						}, 100);
					}, 100);
				}, 100);
			}, 100);
		}, 100);
	});
});
