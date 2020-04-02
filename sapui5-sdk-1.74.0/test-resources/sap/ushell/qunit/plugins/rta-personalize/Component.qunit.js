// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global QUnit*/

QUnit.config.autostart = false;
// eslint-disable-next-line no-unused-expressions
window.blanket && window.blanket.options("sap-ui-cover-only", "[sap/ushell/plugins]");
sap.ui.require([
	"jquery.sap.global",
	"sap/ushell/plugins/BaseRTAPluginStatus",
	"sap/ushell/plugins/rta-personalize/Component",
	"sap/ui/fl/EventHistory",
	"sap/m/Button",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/base/util/UriParameters",
	"sap/ui/thirdparty/sinon"
],
function (
	jQuery,
	PluginStatus,
	RTAPlugin,
	EventHistory,
	Button,
	MessageToast,
	MessageBox,
	UriParameters,
	sinon
) {
	"use strict";
	QUnit.start();

	var STATUS_STARTED = PluginStatus.STATUS_STARTED;
	var STATUS_STOPPED = PluginStatus.STATUS_STOPPED;

	var sPersTextKey = "PERSONALIZE_BUTTON_TEXT";
	var sEndPersTextKey = "END_PERSONALIZE_BUTTON_TEXT";

	var sandbox = sinon.sandbox.create();

	QUnit.module("init functionality", {
		beforeEach: function () {
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns({
				getService: function () {
					return {
						attachAppLoaded: function () {},
						detachAppLoaded: function () {},
						getHash: function () {},
						parseShellHash: function () {}
					};
				},
				getRenderer: function () {
					return {
						addActionButton: function () {},
						LaunchpadState: {
							App: {}
						}
					};
				},
				registerDirtyStateProvider: function () {}
			});
			sandbox.stub(RTAPlugin.prototype, "_checkUI5App").returns(true);
			sandbox.stub(RTAPlugin.prototype, "_getCurrentRunningApplication").returns({
				componentInstance: {
					getAggregation: function () {}
				}
			});

			this.oPlugin = new RTAPlugin();
		},
		afterEach: function () {
			this.oPlugin.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("after the rta-personalize plugin is initialized", function (assert) {
			assert.equal(this.oPlugin.mConfig.sComponentName, "sap.ushell.plugins.rta-personalize", "the correct plugin was loaded");
			assert.notOk(this.oPlugin.mConfig.visible, "and visible is set to false initially");
		});

		function parameterizedRenderAndRemoveTest (bControlInstance, assert) {
			var done = assert.async();
			var oAdaptButtonSpy = sandbox.spy(RTAPlugin.prototype, "_adaptButtonVisibility");
			var oFakeObjectPageLayout0 = {
				getId: function () {
					return "layout0";
				},
				getDomRef: function () {
					return true;
				}
			};

			var oFakeObjectPageLayout1 = {
				getId: function () {
					return "layout1";
				},
				getDomRef: function () {
					return true;
				}
			};

			if (!bControlInstance) {
				sandbox.stub(RTAPlugin.prototype, "_getControlInstance", function (sId) {
					if (sId === "layout0") {
						return oFakeObjectPageLayout0;
					}
					return oFakeObjectPageLayout1;
				});
			}

			assert.equal(this.oPlugin._aPersonalizableControls.length, 0, "initially there is no control in the array");

			sap.ui.getCore().getEventBus().publish("sap.ui", "ControlForPersonalizationRendered", bControlInstance ? oFakeObjectPageLayout0 : oFakeObjectPageLayout0.getId());

			assert.equal(this.oPlugin._aPersonalizableControls.length, 1, "then one control is in the array");
			assert.equal(oAdaptButtonSpy.firstCall.args[1], true, "button visibility is set to true");

			sap.ui.getCore().getEventBus().publish("sap.ui", "ControlForPersonalizationRendered", bControlInstance ? oFakeObjectPageLayout0 : oFakeObjectPageLayout0.getId());
			assert.equal(this.oPlugin._aPersonalizableControls.length, 1, "then still only one control is in the array");

			sap.ui.getCore().getEventBus().publish("sap.ui", "ControlForPersonalizationRendered", bControlInstance ? oFakeObjectPageLayout1 : oFakeObjectPageLayout1.getId());
			assert.equal(this.oPlugin._aPersonalizableControls.length, 2, "then two control are in the array");

			oFakeObjectPageLayout0.getDomRef = function () {
				return false;
			};
			// trigger the mutation observer to recheck the personalizable controls
			jQuery("#qunit-fixture").css("background-color", "red");

			setTimeout(function () {
				assert.equal(this.oPlugin._aPersonalizableControls.length, 1, "then one control is in the array");

				oFakeObjectPageLayout1.getDomRef = function () {
					return false;
				};
				// trigger the mutation observer to recheck the personalizable controls
				jQuery("#qunit-fixture").css("background-color", "blue");
				setTimeout(function () {
					assert.equal(this.oPlugin._aPersonalizableControls.length, 0, "then no control is in the array");
					assert.equal(oAdaptButtonSpy.lastCall.args[1], false, "button visibility is set to false");
					done();
				}.bind(this), 0);
			}.bind(this), 0);
		}

		QUnit.test("When personalizable controls get rendered and removed with control in event", function (assert) {
			parameterizedRenderAndRemoveTest.call(this, true, assert);
		});

		QUnit.test("When personalizable controls get rendered and removed with control ID in event", function (assert) {
			parameterizedRenderAndRemoveTest.call(this, false, assert);
		});
	});

	QUnit.module("init functionality with already rendered personalizable controls", {
		beforeEach: function () {
			sandbox.stub(RTAPlugin.prototype, "_getContainer").returns({
				getService: function () {
					return {
						attachAppLoaded: function () {},
						detachAppLoaded: function () {},
						getHash: function () {},
						parseShellHash: function () {}
					};
				},
				getRenderer: function () {
					return {
						addActionButton: function () {},
						LaunchpadState: {
							App: {}
						}
					};
				},
				registerDirtyStateProvider: function () {}
			});
			sandbox.stub(RTAPlugin.prototype, "_checkUI5App").returns(true);
			sandbox.stub(RTAPlugin.prototype, "_getCurrentRunningApplication").returns({
				componentInstance: {
					getAggregation: function () {}
				}
			});
			this.oSearchButton = new Button("search", {text: "search"}).placeAt("qunit-fixture");
			sandbox.stub(RTAPlugin.prototype, "_getFlpSearchButton").returns(this.oSearchButton);

			this.oFakeObjectPageLayout0 = {
				getId: function () {
					return "layout0";
				},
				getDomRef: function () {
					return true;
				},
				setShowFooter: function () {},
				getShowFooter: function () { return true; }
			};
			var oFakeObjectPageLayout1 = {
				getId: function () {
					return "layout1";
				},
				getDomRef: function () {
					return true;
				}
			};
			sandbox.stub(EventHistory, "getHistoryAndStop").returns([
				{
					channelId: "sap.ui",
					eventId: "ControlForPersonalizationRendered",
					parameters: this.oFakeObjectPageLayout0.getId()
				},
				{
					channelId: "sap.ui",
					eventId: "ControlForPersonalizationRendered",
					parameters: oFakeObjectPageLayout1.getId()
				}
			]);
			sandbox.stub(RTAPlugin.prototype, "_triggerStartRta", function () {
				return new Promise(function (fnResolve) {
					this.sStatus = STATUS_STARTED;
					fnResolve();
				}.bind(this));
			});
			sandbox.stub(RTAPlugin.prototype, "_triggerStopRta", function () {
				return new Promise(function (fnResolve) {
					this.sStatus = STATUS_STOPPED;
					fnResolve();
				}.bind(this));
			});
			sandbox.stub(RTAPlugin.prototype, "_getControlInstance", function (sId) {
				if (sId === "layout0") {
					return this.oFakeObjectPageLayout0;
				}
				return oFakeObjectPageLayout1;
			}.bind(this));

			this.oPlugin = new RTAPlugin();

			this.oButton = new Button("PERSONALIZE_Plugin_ActionButton", {
				text: this.oPlugin.i18n.getText(sPersTextKey)
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oPlugin.destroy();
			this.oButton.destroy();
			this.oSearchButton.destroy();
			sandbox.restore();
		}
	}, function () {
		QUnit.test("when the plugin gets initialized", function (assert) {
			assert.equal(this.oPlugin._aPersonalizableControls.length, 2, "then there are two personalizable controls");
		});

		QUnit.test("when a new app is loaded", function (assert) {
			var oAdaptButtonSpy = sandbox.spy(RTAPlugin.prototype, "_adaptButtonVisibility");
			// when a new app is loaded the _onAppLoaded function is called
			this.oPlugin._onAppLoaded();
			assert.equal(this.oPlugin._aPersonalizableControls.length, 0, "then there are no personalizable controls anymore");
			assert.equal(oAdaptButtonSpy.callCount, 1, "the button visibility is changed");
			assert.equal(oAdaptButtonSpy.lastCall.args[1], false, "the button is no longer visible");
		});

		QUnit.test("when the personalize button gets pressed with URL Parameter 'sap-ui-layer' !== 'USER'", function (assert) {
			var oEvent = {
				getSource: function () {
					return {
						getText: function () {
							return this.oPlugin.i18n.getText("PERSONALIZE_BUTTON_TEXT");
						}.bind(this)
					};
				}.bind(this)
			};
			var oMessageBoxStub = sandbox.stub(MessageBox, "information");
			sandbox.stub(UriParameters, "fromURL").returns({
				mParams: {
					"sap-ui-layer": "VENDOR"
				}
			});
			var oStartRtaSpy = sandbox.spy(this.oPlugin, "_startRta");

			this.oPlugin._onAdapt(oEvent);

			assert.equal(oMessageBoxStub.callCount, 1, "then a MessageBox appeared");
			assert.equal(oStartRtaSpy.callCount, 0, "and _startRta was not called");
		});

		QUnit.test("when RTA gets started", function (assert) {
			var oOriginalBrowserObject = jQuery.extend(true, {}, sap.ui.Device.browser);
			sap.ui.Device.browser.firefox = true;
			var oButton = this.oButton;
			var oSearchButton = this.oSearchButton;
			var oMessageToastStub = sandbox.stub(MessageToast, "show");
			var oSetShowFooterVisibility = sandbox.spy(this.oFakeObjectPageLayout0, "setShowFooter");
			var oEventStub = {
				getSource: function () {
					return oButton;
				}
			};
			this.oPlugin._onAdapt(oEventStub);
			assert.equal(oButton.getText(), this.oPlugin.i18n.getText(sEndPersTextKey), "the text of the button got updated");
			assert.notOk(oSearchButton.getVisible(), "the search Button of FLP is invisible");
			assert.equal(oSetShowFooterVisibility.callCount, 1, "the setShowFooter method was called once");
			assert.equal(oSetShowFooterVisibility.firstCall.args[0], false, "the setShowFooter method was with false as parameter");

			this.oPlugin._onAdapt(oEventStub);
			this.oPlugin._switchToDefaultMode();

			assert.equal(oMessageToastStub.callCount, 1, "a MessageToast was shown");
			assert.equal(oButton.getText(), this.oPlugin.i18n.getText(sPersTextKey), "the text of the button got changed back");
			assert.ok(oSearchButton.getVisible(), "the search Button of FLP is visible again");
			assert.equal(oSetShowFooterVisibility.callCount, 2, "the setShowFooter method was called again");
			assert.equal(oSetShowFooterVisibility.lastCall.args[0], true, "the setShowFooter method was with true as parameter");

			sap.ui.Device.browser = oOriginalBrowserObject;
		});

		QUnit.test("when RTA gets started without editable plugins", function (assert) {
			assert.expect(2);
			var oMessageBoxSpy = sandbox.stub(MessageBox, "information");

			this.oPlugin._startRta();
			// This function gets called when RTA is started
			this.oPlugin._onStartHandler({
				getParameter: function () {
					return 0;
				}
			});

			assert.equal(oMessageBoxSpy.callCount, 1, "one messageBox was shown");

			oMessageBoxSpy.firstCall.args[1].onClose();

			return this.oPlugin.oStoppingPromise.then(function () {
				assert.ok(true, "and RTA got stopped again");
			});
		});

		QUnit.test("_loadPlugins", function (assert) {
			var mRtaPlugins = {
				remove: {
					name: "remove",
					getCommandFactory: function () {}
				},
				additionalElements: {
					name: "add",
					getCommandFactory: function () {},
					getAnalyzer: function () {},
					getDialog: function () {}
				},
				contextMenu: {
					setOpenOnClick: function (bEnabled) {
						assert.notOk(bEnabled, "the function was called with false as parameter");
					}
				}
			};
			var oRtaStub = {
				getDefaultPlugins: function () {
					return mRtaPlugins;
				},
				setPlugins: function (mPlugins) {
					mRtaPlugins = mPlugins;
				}
			};
			var oEasyAdd = function () {
				this.name = "easyAdd";
			};
			var oEasyRemove = function () {
				this.name = "easyRemove";
			};
			var oRequireStub = sandbox.stub(sap.ui, "require");
			oRequireStub.withArgs(["sap/ui/rta/plugin/EasyAdd", "sap/ui/rta/plugin/EasyRemove"]).callsArgWithAsync(1, oEasyAdd, oEasyRemove);

			return this.oPlugin._loadPlugins(oRtaStub).then(function () {
				assert.expect(3);
				assert.equal(mRtaPlugins.remove.name, "easyRemove", "the remove plugin got changed");
				assert.equal(mRtaPlugins.additionalElements.name, "easyAdd", "the add plugin got changed");
			});
		});
	});
});