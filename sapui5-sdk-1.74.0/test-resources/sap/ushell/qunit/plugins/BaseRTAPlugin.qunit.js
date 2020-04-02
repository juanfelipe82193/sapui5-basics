// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global QUnit Promise*/

QUnit.config.autostart = false;
// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");
sap.ui.require([
	"sap/ui/thirdparty/jquery",
	"sap/base/Log",
	"sap/base/util/UriParameters",
	"sap/ushell/plugins/BaseRTAPluginStatus",
	"sap/ushell/plugins/rta/Component",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/thirdparty/sinon-4"
],
function (
	jQuery,
	Log,
	UriParameters,
	PluginStatus,
	RTAPlugin,
	MessageBox,
	BusyIndicator,
	sinon
) {
	"use strict";
	QUnit.start();

	var STATUS_STARTING = PluginStatus.STATUS_STARTING;
	var STATUS_STARTED = PluginStatus.STATUS_STARTED;
	var STATUS_STOPPING = PluginStatus.STATUS_STOPPING;
	var STATUS_STOPPED = PluginStatus.STATUS_STOPPED;

	var sandbox = sinon.sandbox.create();

	function createContainerObject (sApplicationType, bNoRenderer, bNoRendererAfterCallback, assert) {
		var mReturn = {
			getService: function () {
				return {
					attachAppLoaded: function () {},
					detachAppLoaded: function () {},
					getCurrentApplication: function () {
						return {
							applicationType: sApplicationType,
							componentInstance: {
								getAggregation: function () {}
							}
						};
					},
					getHash: function () {},
					parseShellHash: function (oReturn) {
						return oReturn || {
							semanticObject: "a",
							action: "b",
							appSpecificRoute: "c"
						};
					}
				};
			},
			registerDirtyStateProvider: function () {}
		};
		if (bNoRenderer) {
			mReturn.getRenderer = function () {};
			mReturn.attachRendererCreatedEvent = function (fnCallback, oContext) {
				this.fnAttachCallback = fnCallback;
				this.oAttachContext = oContext;
				fnCallback.call(this, {
					getParameter: function () {
						return !bNoRendererAfterCallback ? {
							addActionButton: function (sId, mPropertyBag) {
								this.mAddActionParameters = mPropertyBag;
							}.bind(this),
							LaunchpadState: {
								App: {}
							}
						} : undefined;
					}.bind(this)
				});
			}.bind(this);
			mReturn.detachRendererCreatedEvent = function (fnCallback, oContext) {
				this.fnDetachCallback = fnCallback;
				this.oDetachContext = oContext;
				assert.ok(true, "the event got detached");
			}.bind(this);
		} else {
			mReturn.getRenderer = function () {
				return {
					addActionButton: function (sId, mPropertyBag) {
						this.mAddActionParameters = mPropertyBag;
					}.bind(this),
					LaunchpadState: {
						App: {}
					}
				};
			}.bind(this);
		}
		return mReturn;
	}

	QUnit.module("Start/stop phases", {
		beforeEach: function () {
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns({
				getService: function () {
					return {
						attachAppLoaded: function () {},
						detachAppLoaded: function () {},
						getHash: function () {}
					};
				},
				registerDirtyStateProvider: function () {}
			});
			sandbox.stub(RTAPlugin.prototype, "_getRenderer").returns(jQuery.Deferred().reject());
			sandbox.stub(RTAPlugin.prototype, "_checkUI5App").returns(true);
			sandbox.stub(RTAPlugin.prototype, "_getCurrentRunningApplication").returns({
				componentInstance: {
					getAggregation: function () {}
				}
			});
			sandbox.stub(RTAPlugin.prototype, "_triggerStartRta").callsFake(function () {
				return new Promise(function (fnResolve) {
					this.sStatus = STATUS_STARTING;
					setTimeout(function () {
						this.sStatus = STATUS_STARTED;
						fnResolve();
					}.bind(this), 16);
				}.bind(this));
			});
			sandbox.stub(RTAPlugin.prototype, "_triggerStopRta").callsFake(function () {
				this.sStatus = STATUS_STOPPING;
				return new Promise(function (fnResolve) {
					setTimeout(function () {
						this.sStatus = STATUS_STOPPED;
						fnResolve();
					}.bind(this), 16);
				}.bind(this));
			});

			this.oPlugin = new RTAPlugin();
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		// ---------------------------------- _startRta() ----------------------------------
		QUnit.test("_startRta() with initial status '" + STATUS_STARTING + "'", function (assert) {
			this.oPlugin._startRta();
			assert.equal(this.oPlugin.sStatus, STATUS_STARTING, "initial status is '" + STATUS_STARTING + "'");
			var oStartingPromise = this.oPlugin.oStartingPromise;
			this.oPlugin._startRta();
			assert.equal(this.oPlugin.sStatus, STATUS_STARTING, "status is '" + STATUS_STARTING + "'");
			assert.ok(oStartingPromise === this.oPlugin.oStartingPromise, "starting Promise should be referentially same object");
			return this.oPlugin.oStartingPromise.then(function () {
				assert.equal(this.oPlugin.oStartingPromise, null, "starting Promise was cleaned properly");
			}.bind(this));
		});

		QUnit.test("_startRta() with initial status '" + STATUS_STARTED + "'", function (assert) {
			return this.oPlugin._startRta().then(function () {
				assert.equal(this.oPlugin.sStatus, STATUS_STARTED, "initial status is '" + STATUS_STARTED + "'");
				var fnPromiseResolve = sandbox.spy(Promise, "resolve");
				var oAfterStart = this.oPlugin._startRta().then(function () {
					assert.equal(this.oPlugin.oStartingPromise, null, "starting Promise was cleaned properly");
				}.bind(this));
				assert.ok(this.oPlugin.oStartingPromise instanceof Promise, "starting Promise is a Promise");
				assert.ok(fnPromiseResolve.calledOnce, "starting Promise is Promise.resolve()");
				return oAfterStart;
			}.bind(this));
		});

		QUnit.test("_startRta() with initial status '" + STATUS_STOPPING + "'", function (assert) {
			return this.oPlugin._startRta().then(function () {
				this.oPlugin._stopRta();
				assert.equal(this.oPlugin.sStatus, STATUS_STOPPING, "initial status is '" + STATUS_STOPPING + "'");
				var spy1 = sandbox.spy();
				var spy2 = sandbox.spy();
				this.oPlugin.oStoppingPromise.then(spy1);
				return this.oPlugin._startRta().then(function () {
					spy2();
					assert.ok(spy1.calledBefore(spy2), "start should wait until stop is done");
					assert.equal(this.oPlugin.oStartingPromise, null, "starting Promise was cleaned properly");
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("_startRta() with initial status '" + STATUS_STOPPED + "'", function (assert) {
			assert.equal(this.oPlugin.sStatus, STATUS_STOPPED, "initial status is '" + STATUS_STOPPED + "'");
			this.oPlugin._startRta();
			assert.ok(this.oPlugin.oStartingPromise instanceof Promise, "starting Promise is created");
			assert.equal(this.oPlugin.sStatus, STATUS_STARTING, "status changed to '" + STATUS_STARTING + "'");

			return this.oPlugin.oStartingPromise.then(function () {
				assert.equal(this.oPlugin.sStatus, STATUS_STARTED, "status changed to '" + STATUS_STARTED + "'");
				assert.equal(this.oPlugin.oStartingPromise, null, "starting Promise was cleaned properly");
			}.bind(this));
		});

		// ---------------------------------- _stopRta() ----------------------------------
		QUnit.test("_stopRta() with initial status '" + STATUS_STARTING + "'", function (assert) {
			this.oPlugin._startRta();
			assert.equal(this.oPlugin.sStatus, STATUS_STARTING, "initial status is '" + STATUS_STARTING + "'");
			var spy1 = sandbox.spy();
			var spy2 = sandbox.spy();
			this.oPlugin.oStartingPromise.then(spy1);
			this.oPlugin._stopRta();
			return this.oPlugin.oStoppingPromise.then(function () {
				spy2();
				assert.ok(spy1.calledBefore(spy2), "stop should wait until start is done");
				assert.equal(this.oPlugin.oStoppingPromise, null, "stopping Promise was cleaned properly");
			}.bind(this));
		});

		QUnit.test("_stopRta() with initial status '" + STATUS_STARTED + "'", function (assert) {
			return this.oPlugin._startRta().then(function () {
				assert.equal(this.oPlugin.sStatus, STATUS_STARTED, "initial status is '" + STATUS_STARTED + "'");
				var oAfterStop = this.oPlugin._stopRta().then(function () {
					assert.equal(this.oPlugin.oStoppingPromise, null, "stopping Promise was cleaned properly");
				}.bind(this));
				assert.ok(this.oPlugin.oStoppingPromise instanceof Promise, "stopping Promise is created");
				assert.equal(this.oPlugin.sStatus, STATUS_STOPPING, "status changed to '" + STATUS_STOPPING + "'");
				return oAfterStop;
			}.bind(this));
		});

		QUnit.test("_stopRta() with initial status '" + STATUS_STOPPING + "'", function (assert) {
			return this.oPlugin._startRta().then(function () {
				this.oPlugin._stopRta();
				assert.equal(this.oPlugin.sStatus, STATUS_STOPPING, "initial status is '" + STATUS_STOPPING + "'");
				var oStoppingPromise = this.oPlugin.oStoppingPromise;
				var oAfterStop = this.oPlugin._stopRta().then(function () {
					assert.equal(this.oPlugin.oStoppingPromise, null, "stopping Promise was cleaned properly");
				}.bind(this));
				assert.equal(this.oPlugin.sStatus, STATUS_STOPPING, "status is '" + STATUS_STOPPING + "'");
				assert.ok(oStoppingPromise === this.oPlugin.oStoppingPromise, "stopping Promise should be referentially same object");
				return oAfterStop;
			}.bind(this));
		});

		QUnit.test("_stopRta() with initial status '" + STATUS_STOPPED + "'", function (assert) {
			assert.equal(this.oPlugin.sStatus, STATUS_STOPPED, "initial status is '" + STATUS_STOPPED + "'");
			var fnPromiseResolve = sandbox.spy(Promise, "resolve");
			var oAfterStop = this.oPlugin._stopRta().then(function () {
				assert.equal(this.oPlugin.oStoppingPromise, null, "stopping Promise was cleaned properly");
			}.bind(this));
			assert.ok(this.oPlugin.oStoppingPromise instanceof Promise, "stopping Promise is a Promise");
			assert.ok(fnPromiseResolve.calledOnce, "stopping Promise is Promise.resolve()");
			return oAfterStop;
		});
	});

	QUnit.module("Given an application that is not of type UI5", {
		beforeEach: function () {
			var oContainer = createContainerObject.call(this, "notUI5");
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);

			this.oPlugin = new RTAPlugin();
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when the plugin gets initialized", function (assert) {
			assert.notOk(this.oPlugin._checkUI5App(), "_checkUI5App returns false");
			assert.notOk(this.mAddActionParameters.visible, "and the button gets added with visible false");
		});

		QUnit.test("when a new app of type UI5 gets loaded", function (assert) {
			RTAPlugin.prototype._getContainer.restore();
			var oContainer = createContainerObject.call(this, "UI5");
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);

			assert.ok(this.oPlugin._checkUI5App(), "_checkUI5App returns true");

			var oAdaptButtonVisilibitySpy = sandbox.spy(RTAPlugin.prototype, "_adaptButtonVisibility");

			this.oPlugin._onAppLoaded();
			assert.ok(oAdaptButtonVisilibitySpy.lastCall.args[1], "then the button was set to visible");
		});
	});

	QUnit.module("Given a application that is of type UI5", {
		beforeEach: function () {
			var oContainer = createContainerObject.call(this, "UI5");
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when the plugin gets initialized", function (assert) {
			assert.ok(this.oPlugin._checkUI5App(), "_checkUI5App returns true");
			assert.ok(this.mAddActionParameters.visible, "and the button gets added with visible true");
		});

		QUnit.test("when a new app (not UI5) gets loaded", function (assert) {
			RTAPlugin.prototype._getContainer.restore();
			var oContainer = createContainerObject.call(this, "notUI5");
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);

			assert.notOk(this.oPlugin._checkUI5App(), "_checkUI5App returns false");

			var oAdaptButtonVisilibitySpy = sandbox.spy(RTAPlugin.prototype, "_adaptButtonVisibility");

			this.oPlugin._onAppLoaded();
			assert.notOk(oAdaptButtonVisilibitySpy.lastCall.args[1], "then the button was set to invisible");
		});

		QUnit.test("when RTA gets started with the wrong browser", function (assert) {
			var oOriginalBrowserObject = jQuery.extend(true, {}, sap.ui.Device.browser);
			sap.ui.Device.browser.edge = false;
			sap.ui.Device.browser.msie = false;
			sap.ui.Device.browser.webkit = false;
			sap.ui.Device.browser.firefox = false;

			var oErrorBoxStub = sandbox.stub(MessageBox, "error");
			var oStartRtaStub = sandbox.stub(RTAPlugin.prototype, "_startRta");
			this.oPlugin._onAdapt();

			assert.equal(oErrorBoxStub.callCount, 1, "the Error MessageBox was shown");
			assert.equal(oStartRtaStub.callCount, 0, "_startRta didn't get called");

			sap.ui.Device.browser = oOriginalBrowserObject;
		});

		QUnit.test("when RTA gets started with the correct browser", function (assert) {
			var oOriginalBrowserObject = jQuery.extend(true, {}, sap.ui.Device.browser);
			sap.ui.Device.browser.edge = true;

			var oErrorBoxStub = sandbox.stub(MessageBox, "error");
			var oStartRtaStub = sandbox.stub(RTAPlugin.prototype, "_startRta");
			this.oPlugin._onAdapt();

			assert.equal(oErrorBoxStub.callCount, 0, "the Error MessageBox was not shown");
			assert.equal(oStartRtaStub.callCount, 1, "_startRta got called");

			sap.ui.Device.browser = oOriginalBrowserObject;
		});

		QUnit.test("when RTA gets started with the manifest entry flexEnabled=false", function (assert) {
			sandbox.stub(this.oPlugin, "_checkFlexEnabledOnStart").returns(false);
			var oHandleFlexDisabledStub = sandbox.stub(this.oPlugin, "_handleFlexDisabledOnStart");
			var oStartRtaStub = sandbox.stub(this.oPlugin, "_startRta");

			this.oPlugin._onAdapt();
			assert.equal(oStartRtaStub.callCount, 0, "_startRta didn't get called");
			assert.equal(oHandleFlexDisabledStub.callCount, 1, "_handleFlexDisabledOnStart did get called");
		});

		QUnit.test("when _checkFlexEnabledOnStart is called", function (assert) {
			var oAppDescriptor = {
				"sap.ui5": {
					flexEnabled: true
				}
			};
			sandbox.stub(this.oPlugin, "_getAppDescriptor").returns(oAppDescriptor);
			assert.ok(this.oPlugin._checkFlexEnabledOnStart(), "the function returns true");

			oAppDescriptor["sap.ui5"].flexEnabled = false;
			assert.notOk(this.oPlugin._checkFlexEnabledOnStart(), "the function returns false");

			oAppDescriptor["sap.ui5"].flexEnabled = undefined;
			assert.ok(this.oPlugin._checkFlexEnabledOnStart(), "the function returns true");

			delete oAppDescriptor["sap.ui5"].flexEnabled;
			assert.ok(this.oPlugin._checkFlexEnabledOnStart(), "the function returns true");
		});

		QUnit.test("when _triggerStartRta is called", function (assert) {
			sandbox.stub(BusyIndicator, "show").callsFake(function () {
				assert.ok(true, "BusyIndicator is shown");
			});

			sandbox.stub(BusyIndicator, "hide").callsFake(function () {
				assert.ok(true, "BusyIndicator is hidden again");
			});

			var sEventNames = "";
			var oRtaStub = function (mPropertyBag) {
				this.rootControl = mPropertyBag.rootControl;
				this.flexSettings = mPropertyBag.flexSettings;
				this.attachEvent = function (sName) {
					sEventNames += sName;
				};
				this.start = function () {
					assert.ok(true, "start was called");
					return Promise.resolve();
				};
			};

			sandbox.stub(sap.ui.getCore(), "loadLibraries").returns(Promise.resolve());
			var oRequireStub = sandbox.stub(sap.ui, "require");
			oRequireStub.withArgs(["sap/ui/rta/RuntimeAuthoring"]).callsArgWithAsync(1, oRtaStub);

			return this.oPlugin._triggerStartRta("root").then(function () {
				assert.equal(this.oPlugin._oRTA.rootControl, "root", "the root Control is correct");
				var oFlexSettings = this.oPlugin._oRTA.flexSettings;
				assert.equal(oFlexSettings.layer, this.oPlugin.mConfig.layer, "the layer is correct");
				assert.equal(oFlexSettings.developerMode, this.oPlugin.mConfig.developerMode, "the developerMode is correct");
				assert.equal(sEventNames, "startfailedstop", "all three events got attached");
			}.bind(this));
		});

		QUnit.test("when _triggerStart was called and an 'appClosed' event is published", function (assert) {
			sandbox.stub(BusyIndicator, "show");
			sandbox.stub(BusyIndicator, "hide");
			var oRtaStub = function (mPropertyBag) {
				this.rootControl = mPropertyBag.rootControl;
				this.flexSettings = mPropertyBag.flexSettings;
				this.attachEvent = function (sName) {};
				this.start = function () {
					return Promise.resolve();
				};
			};
			var oStopStub = sandbox.stub(RTAPlugin.prototype, "_stopRta");

			sandbox.stub(sap.ui.getCore(), "loadLibraries").returns(Promise.resolve());
			var oRequireStub = sandbox.stub(sap.ui, "require");
			oRequireStub.withArgs(["sap/ui/rta/RuntimeAuthoring"]).callsArgWithAsync(1, oRtaStub);

			return this.oPlugin._triggerStartRta("root").then(function () {
				sap.ui.getCore().getEventBus().publish("sap.ushell.renderers.fiori2.Renderer", "appClosed");
				assert.ok(oStopStub.called, "the event triggered _stopRta to be called");
			});
		});

		QUnit.test("when _triggerStopRta is called", function (assert) {
			this.oPlugin._oRTA = {
				destroy: function () {
					assert.ok(true, "RTA destroy is called");
				},
				stop: function () {
					return Promise.resolve();
				}
			};
			var oEventBusSpy = sandbox.spy(sap.ui.getCore().getEventBus(), "unsubscribe");

			return this.oPlugin._triggerStopRta().then(function () {
				assert.equal(this.oPlugin.sStatus, STATUS_STOPPED, "the status is set to stopped");
				assert.notOk(this.oPlugin.oStartingPromise, "the promises got cleaned up");
				assert.notOk(this.oPlugin.oStoppingPromise, "the promises got cleaned up");
				assert.equal(this.oPlugin._oRTA, null, "the variable got reset to null");
				assert.equal(oEventBusSpy.callCount, 1, "an event got unsubscribed");
				assert.equal(oEventBusSpy.lastCall.args[1], "appClosed", "the appClosed event got unsubscribed");
			}.bind(this));
		});

		QUnit.test("when navigation is happening", function (assert) {
			this.oPlugin._bDirtyState = true;

			assert.notOk(this.oPlugin._dirtyStateProvider(), "without RTA available dirty state is never set");

			this.oPlugin._oRTA = {
				canUndo: function () {
					return true;
				}
			};
			assert.notOk(this.oPlugin._dirtyStateProvider(), "without RTA started dirty state is never set");

			this.oPlugin.sStatus = STATUS_STARTED;
			this.oPlugin.sOldHash = {
				semanticObject: "a",
				action: "b",
				appSpecificRoute: "d"
			};
			assert.notOk(this.oPlugin._dirtyStateProvider(), "with in-app navigation dirty state is not set");

			this.oPlugin.sOldHash = {
				semanticObject: "a",
				action: "e",
				appSpecificRoute: "c"
			};
			assert.ok(this.oPlugin._dirtyStateProvider(), "with cross-app navigation dirty state is set");

			this.oPlugin.sOldHash = {
				semanticObject: "e",
				action: "b",
				appSpecificRoute: "c"
			};
			assert.ok(this.oPlugin._dirtyStateProvider(), "with cross-app navigation dirty state is set");

			this.oPlugin.sOldHash = {
				semanticObject: "a",
				action: "b",
				appSpecificRoute: "c"
			};
			assert.ok(this.oPlugin._dirtyStateProvider(), "with in-app navigation but no change in appSpecificRoute dirty state is set");
		});
	});

	QUnit.module("Given a UI5 application and restart enabled", {
		beforeEach: function () {
			this.sStorageKey = "sap.ui.rta.restart.CUSTOMER";
			window.sessionStorage.removeItem(this.sStorageKey);
			window.sessionStorage.setItem(this.sStorageKey, true);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("When the plugin gets initialized", function (assert) {
			var oContainer = createContainerObject.call(this, "UI5");
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);
			var oRestartStub = sandbox.stub(RTAPlugin.prototype, "_startRta");
			this.oPlugin = new RTAPlugin();
			assert.equal(oRestartStub.callCount, 1, "then RTA Start is triggered");
			assert.notOk(window.sessionStorage.getItem(this.sStorageKey), "the item got deleted from the storage");
		});
	});

	QUnit.module("Given a UI5 application and restart in VENDOR layer enabled", {
		beforeEach: function () {
			this.sStorageKey = "sap.ui.rta.restart.VENDOR";
			window.sessionStorage.removeItem(this.sStorageKey);
			window.sessionStorage.setItem(this.sStorageKey, true);
			var oStub = sandbox.stub(UriParameters.prototype, "get");
			oStub.withArgs("sap-ui-layer").returns("VENDOR");
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("When the plugin gets initialized", function (assert) {
			var oContainer = createContainerObject.call(this, "UI5");
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);
			var oRestartStub = sandbox.stub(RTAPlugin.prototype, "_startRta");
			this.oPlugin = new RTAPlugin();
			assert.equal(oRestartStub.callCount, 1, "then RTA Start is triggered");
			assert.notOk(window.sessionStorage.getItem(this.sStorageKey), "the item got deleted from the storage");
		});
	});

	QUnit.module("Error handling in the plugin", {
		before: function () {
			this.RtaUtils = sap.ui.requireSync("sap/ui/rta/Utils");
		},
		beforeEach: function () {
			var oContainer = createContainerObject.call(this, "UI5");
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
			this.oBusyIndicatorHideStub = sandbox.stub(BusyIndicator, "hide");
			this.oSwitchToDefaultStub = sandbox.stub(RTAPlugin.prototype, "_switchToDefaultMode");
			this.oMessageBoxErrorStub = sandbox.stub(MessageBox, "error");
			this.oErrorLogStub = sandbox.stub(Log, "error");
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when an error occurs with no specific error", function (assert) {
			var fnDone = assert.async();

			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils"]).callsFake(function (sResourceName, fnResolve) {
				fnResolve(this.RtaUtils);
				assert.strictEqual(this.oMessageBoxErrorStub.callCount, 1, "an error MessageBox is shown");
				fnDone();
			}.bind(this));

			this.oPlugin._errorHandler(new Error());
			assert.strictEqual(this.oBusyIndicatorHideStub.callCount, 1, "the busyIndicator is hidden");
			assert.strictEqual(this.oSwitchToDefaultStub.callCount, 1, "the plugin calls _switchToDefaultMode");
			assert.strictEqual(this.oErrorLogStub.callCount, 1, "an error is logged");
		});

		QUnit.test("when an error occurs with 'Reload triggered' instead of an Error", function (assert) {
			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils"]).callsFake(function (sResourceName, fnResolve) {
				fnResolve(this.RtaUtils);
				assert.strictEqual(this.oMessageBoxErrorStub.callCount, 0, "no error MessageBox is shown");
			}.bind(this));

			this.oPlugin._errorHandler("Reload triggered");
			assert.strictEqual(this.oBusyIndicatorHideStub.callCount, 1, "the busyIndicator is hidden");
			assert.strictEqual(this.oSwitchToDefaultStub.callCount, 0, "the plugin doesn't call _switchToDefaultMode");
			assert.strictEqual(this.oErrorLogStub.callCount, 0, "no error is logged");
		});

		QUnit.test("when an error occurs with an 'Reload triggered' Error", function (assert) {
			var fnDone = assert.async();

			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils"]).callsFake(function (sResourceName, fnResolve) {
				fnResolve(this.RtaUtils);
				assert.strictEqual(this.oMessageBoxErrorStub.callCount, 1, "an error MessageBox is shown");
				fnDone();
			}.bind(this));

			this.oPlugin._errorHandler(new Error("Reload triggered"));
			assert.strictEqual(this.oBusyIndicatorHideStub.callCount, 1, "the busyIndicator is hidden");
			assert.strictEqual(this.oSwitchToDefaultStub.callCount, 1, "the plugin calls _switchToDefaultMode");
			assert.strictEqual(this.oMessageBoxErrorStub.callCount, 1, "an error MessageBox is shown");
			assert.strictEqual(this.oErrorLogStub.callCount, 1, "an error is logged");
		});

		QUnit.test("when an error comes as a string", function (assert) {
			sandbox.stub(sap.ui, "require").withArgs(["sap/ui/rta/Utils"]).callsFake(function (sResourceName, fnResolve) {
				fnResolve(this.RtaUtils);
				assert.strictEqual(this.oMessageBoxErrorStub.callCount, 1, "an error  MessageBox is shown");
			}.bind(this));

			this.oPlugin._errorHandler("Some error happens");
			assert.strictEqual(this.oBusyIndicatorHideStub.callCount, 1, "the busyIndicator is hidden");
			assert.strictEqual(this.oSwitchToDefaultStub.callCount, 1, "the plugin calls _switchToDefaultMode");
			assert.strictEqual(this.oErrorLogStub.callCount, 1, "no error is logged");
		});
	});

	QUnit.module("Given a application that is of type UI5 and a renderer returned in the created callback", {
		beforeEach: function (assert) {
			var oContainer = createContainerObject.call(this, "UI5", true, false, assert);
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when the renderer created event is thrown", function (assert) {
			assert.expect(4);
			this.oPlugin.destroy();
			assert.ok(this.mAddActionParameters.visible, "the action button still got added");
			assert.equal(this.fnAttachCallback, this.fnDetachCallback, "the callback function is the same in attach and detach");
			assert.equal(this.oAttachContext, this.oDetachContext, "the context function is the same in attach and detach");
		});
	});

	QUnit.module("Given a application that is of type UI5 and no renderer returned in the created callback", {
		beforeEach: function (assert) {
			var oContainer = createContainerObject.call(this, "UI5", true, true, assert);
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);
			this.oPlugin = new RTAPlugin();
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when the renderer created event is thrown", function (assert) {
			assert.expect(4);
			this.oPlugin.destroy();
			assert.notOk(this.mAddActionParameters, "the action button didn't get added");
			assert.equal(this.fnAttachCallback, this.fnDetachCallback, "the callback function is the same in attach and detach");
			assert.equal(this.oAttachContext, this.oDetachContext, "the context function is the same in attach and detach");
		});
	});

	QUnit.module("App version validation", {
		beforeEach: function (assert) {
			var oContainer = createContainerObject.call(this, "UI5", true, false, assert);
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns(oContainer);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when no parameter is specified", function (assert) {
			assert.expect(3);
			var oPlugin = new RTAPlugin();
			var oRtaStub = function (mPropertyBag) {
				assert.strictEqual(mPropertyBag.validateAppVersion, true, "then default value is correct");
				this.attachEvent = function (sName) {};
				this.start = function () {
					return Promise.resolve();
				};
			};

			sandbox.stub(sap.ui.getCore(), "loadLibraries").returns(Promise.resolve());
			var oRequireStub = sandbox.stub(sap.ui, "require");
			oRequireStub.withArgs(["sap/ui/rta/RuntimeAuthoring"]).callsArgWithAsync(1, oRtaStub);

			return oPlugin._triggerStartRta("root").then(function () {
				assert.ok(true);
				oPlugin.destroy();
			});
		});
		QUnit.test("when componentData with custom validateAppVersion parameter is specified", function (assert) {
			assert.expect(3);
			var oPlugin = new RTAPlugin({
				componentData: {
					config: {
						validateAppVersion: false
					}
				}
			});
			var oRtaStub = function (mPropertyBag) {
				assert.strictEqual(mPropertyBag.validateAppVersion, false);
				this.attachEvent = function (sName) {};
				this.start = function () {
					return Promise.resolve();
				};
			};

			sandbox.stub(sap.ui.getCore(), "loadLibraries").returns(Promise.resolve());
			var oRequireStub = sandbox.stub(sap.ui, "require");
			oRequireStub.withArgs(["sap/ui/rta/RuntimeAuthoring"]).callsArgWithAsync(1, oRtaStub);

			return oPlugin._triggerStartRta("root").then(function () {
				assert.ok(true);
				oPlugin.destroy();
			});
		});
	});
});