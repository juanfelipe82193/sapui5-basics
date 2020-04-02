sap.ui.define(["sap/ui/base/Object",
	"sap/suite/ui/generic/template/lib/MessageUtils",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/base/Log",
	"sap/base/util/extend",
	"sap/base/util/isEmptyObject"
], function(BaseObject, MessageUtils, testableHelper, Log, extend, isEmptyObject) {
		"use strict";

		// Class for busy handling
		// This class enables the notion of a 'busy session'.
		// More precisely: At each point in time the app is either in a busy session or is not.
		// Reasons for being in a busy session can be set by calling methods setBusy or setBusyReason (see below).
		// Note that each busy reason has a lifetime.
		// A new busy session is started, as soon as the two following two conditions are fulfilled:
		// - The app is currently not in a busy session
		// - There is at least one (living) busy reason
		// A busy session potentially ends when the number of living busy reasons is reduced to zero. However, the end of the busy session is
		// postponed until a navigation which is currently active has finished and the current thread execution has come to an end. When a new
		// busy reason has been set meanwhile (and is still alive) the busy session is prolonged accordingly.
		//
		// The following features are connected to a busy session:
		// - A busy indication is displayed while the app is in a busy session. This busy indication may either be displayed immediately or with the standard
		//   busy delay (can be parameterized when setting the busy reason)
		// - When a busy session starts all transient messages are removed from the Apps message model
		// - When a busy session ends all transient messages being contained in the message model are displayed to the user and removed from the message model
		// - It is possible to set parameters for a busy session (see parameter oSessionParams of setBusy and setBusyReason).
		//   oSessionParams may be an arbitrary object. However, currently only property actionLabel is evaluated. This may contain a human readable string
		//   that identifies the action that causes the busy session.
		// Moreover, this class provides the possibility to interact with busy sessions/reasons (see methods isBusy and getUnbusy).
		function getMethods(oTemplateContract) {
			var mBusyReasons = {}; // currently living busy reasons of type string
			var bIsBusy = false; // is the app in a busy session
			var bBusyDirty = false; // is it already ensured that fnApplyBusy will be called
			var iBusyPromiseCount = 0; // number of currently living busy reasons of type Promise
			oTemplateContract.oNavigationHost.setBusyIndicatorDelay(0); // This is only a temporary solution .
			//var iBusyDelay = oTemplateContract.oNavigationHost.getBusyIndicatorDelay(); // standard busy delay of the App
			var oUnbusyPromise = Promise.resolve(); // a Promise which is resolved as soon as no busy session is running
			var fnUnbusyResolve = Function.prototype; // function to be called when the current busy session ends
			var oBusySessionParams = {}; // params of this busy session

			// Returns information whether there is currently a living busy reason
			function isBusy(){
				return iBusyPromiseCount !== 0 || !isEmptyObject(mBusyReasons);
			}


			var fnApplyBusyImmediately; // declare here to avoid use before declaration. Function that calls fnApplyBusy with bImmediate = true.
			// This function has the following tasks:
			// - If a busy session is running but no busy reason is available -> end the busy session (and thus display transient messages)
			// - Is a busy session is running set the app to busy, otherwise set it to unbusy
			// Note that ending the busy session will be postponed if a navigation is currently active and parameter bImmediate is false.
			// In this case the busy session might be prolonged if a new busy reason is set in the meantime
			function fnApplyBusy(bImmediate) {
				var bIsBusyNew = isBusy();
				if (bIsBusyNew || bImmediate) {
					bBusyDirty = false;
					oTemplateContract.oNavigationHost.setBusy(bIsBusyNew);
					Log.info("Physical busy state has been changed to " + bIsBusyNew);
					if (bIsBusyNew !== bIsBusy) {
						bIsBusy = bIsBusyNew;
						if (!bIsBusy){ // end of a busy session
							//oTemplateContract.oNavigationHost.setBusyIndicatorDelay(iBusyDelay);
							var aActiveComponents = oTemplateContract && oTemplateContract.oNavigationControllerProxy && oTemplateContract.oNavigationControllerProxy.getActiveComponents();
							if (aActiveComponents){
								for (var iActiveComponent = 0; iActiveComponent < aActiveComponents.length; iActiveComponent++) {
									var sActiveComponent = aActiveComponents[iActiveComponent];
									if (!sActiveComponent) {
										continue;
									}
								    var oController = oTemplateContract.componentRegistry && oTemplateContract.componentRegistry[sActiveComponent] && oTemplateContract.componentRegistry[sActiveComponent].oController;
								    oController && oController.adaptTransientMessageExtension && oController.adaptTransientMessageExtension();
								}
							}
							// exchanging this Promise ensures that the popup for sending the transient messages will be shown before all other popups which are waiting for the busy session to be ended will be displayed
							oUnbusyPromise = Promise.resolve();
							oUnbusyPromise = MessageUtils.handleTransientMessages(oTemplateContract.oApplicationProxy.getDialogFragment, oBusySessionParams.actionLabel);
							oBusySessionParams = {};
							oUnbusyPromise.then(fnUnbusyResolve);
						}
					}
				} else { // postpone removal of busy indicator until navigation visualization is finished
					var oNavigationFinishedPromise = oTemplateContract.oNavigationObserver.getProcessFinished(true);
					oNavigationFinishedPromise.then(fnApplyBusyImmediately, fnApplyBusyImmediately);
				}
			}
			fnApplyBusyImmediately = fnApplyBusy.bind(null, true);

			// Ensure that method fnApplyBusy is called
			// If bImmediate is true the busy delay is temporarily set to 0 and fnApplyBusy is called synchronously.
			// Otherwise the call of fnApplyBusy is postponed until the current thread is finished.
			function fnEnsureApplyBusy(bImmediate) {
				if (bImmediate) {
					//oTemplateContract.oNavigationHost.setBusyIndicatorDelay(0);
					fnApplyBusy();
				} else if (!bBusyDirty) {
					bBusyDirty = true;
					setTimeout(fnApplyBusy, 0);
				}
			}

			// function to be called when any Promise that serves as a busy reason is settled
			function fnBusyPromiseResolved() {
				iBusyPromiseCount--;
				if (!iBusyPromiseCount) {
					fnEnsureApplyBusy(false);
				}
			}

			// this method is called when a busy reason is set. It starts a busy session unless the App is already in a busy session.
			function fnMakeBusy(){
				if (bIsBusy){
					return;  // App is already in a busy session
				}
				// Start a new busy session
				bIsBusy = true;
				oUnbusyPromise = new Promise(function(fnResolve){
					fnUnbusyResolve = fnResolve;
				});
				// All transient messages still being contained in the message model belong to previous actions.
				// Therefore, we remove them. If they have not been shown yet, it is anyway to late to show them when this busy session has ended.
				MessageUtils.removeTransientMessages();
			}

			function logSupportInfo(method, busyEndedPromise, reason) {
				var aStack = [],
					sCaller = "",
					sElementId = oTemplateContract.oNavigationHost.getId(),
					sType = "sap.suite.ui.generic.template.busyHandling";

				// Throw an error to get the caller from the stack
				try {
					throw new Error("Get the stack");
				} catch (e) {
					aStack = e.stack.split(method, 2);
					if (aStack.length >= 2) {
						aStack = aStack[1].split("\n");
						aStack.shift();
					}
					if (aStack.length) {
						sCaller = aStack[0].trim();
					}
				}

				// Make sure that the log level for our "component" is at least INFO, so that the info messages with support info are logged
				if (Log.getLevel(sType) < Log.Level.INFO) {
					Log.setLevel(Log.Level.INFO, sType);
				}
				Log.info("busyHandling: " + method, reason + " called", sType, function() {
					var oSupportInfo = {
						method: method,
						reason: reason,
						promise: busyEndedPromise,
						promisePending: true,
						caller: sCaller,
						callStack: aStack,
						elementId: sElementId,
						type: sType
					};
					function fnPromiseSettled() {
						oSupportInfo.promisePending = false;
					}
					oSupportInfo.promise.then(fnPromiseSettled, fnPromiseSettled);
					return oSupportInfo;
				});
			}

			// Sets or resets a busy reason of type string (parameter sReason).
			// Parameter bIsActive determines whether the busy reason is set or reset.
			// Note that resetting a reason applies to all living reasons using the same string (so calling this method with the same reason does not accumulate)
			// bImmediate is only evaluated when bIsActive is true. In this case it determines whether the busy indication should be displayed immediately or with
			// the usual delay.
			// oSessionParams (optional) can be used to set/overwrite additional params for the busy session. It is also only evaluated when bIsActive is true.
			// Note that it is preferred to use method setBusy to set a busy reason
			function setBusyReason(sReason, bIsActive, bImmediate, oSessionParams) {
				var oBusyEndedPromise;
				if (bIsActive) {
					extend(oBusySessionParams, oSessionParams);
					fnMakeBusy();
					if (!mBusyReasons[sReason]) {
						// Put a promise in the log and memorize the resolve function
						oBusyEndedPromise = new Promise(function(resolve) { mBusyReasons[sReason] = resolve; });
						if (sap.ui.support) { // Only if support assistant is loaded
							logSupportInfo("setBusyReason", oBusyEndedPromise, sReason);
						}
					}
				} else {
					if (mBusyReasons[sReason]) {
						mBusyReasons[sReason](); // support assistant: resolve promise
					}
					delete mBusyReasons[sReason];
				}
				fnEnsureApplyBusy(bIsActive && bImmediate);
			}

			// Sets a Promise (oBusyEndedPromise) as busy reason. This busy reason is alive until the promise is settled.
			// bImmediate determines whether the busy indication should be displayed immediately or with the usual delay.
			// oSessionParams (optional) can be used to set/overwrite additional params for the busy session.
			// Edge case: oBusyEndedPromise is already settled when this method is called (and the app is currently not in a busy session).
			// In this case, nevertheless a (probably short-living) busy session is started, such that the interaction with the message model is as defined above
			function setBusy(oBusyEndedPromise, bImmediate, oSessionParams) {
				extend(oBusySessionParams, oSessionParams);
				iBusyPromiseCount++;
				fnMakeBusy();
				oBusyEndedPromise.then(fnBusyPromiseResolved, fnBusyPromiseResolved);
				fnEnsureApplyBusy(bImmediate);
				if (sap.ui.support) { // Only if support assistant is loaded
					logSupportInfo("setBusy", oBusyEndedPromise, "");
				}
			}

			function getBusyDelay() {
				//return iBusyDelay;
				return 0;
			}

			return {
				setBusyReason: setBusyReason,
				setBusy: setBusy,
				isBusy: isBusy,
				getUnbusy: function(){ // returns a Promise that is resolved as soon as the App is not in a busy session
					return oUnbusyPromise;
				},
				getBusyDelay: getBusyDelay
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.lib.BusyHelper", {
			constructor: function(oTemplateContract) {
				extend(this, (testableHelper.testableStatic(getMethods, "BusyHelper"))(oTemplateContract));
			}
		});
	});
