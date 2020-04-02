sap.ui.define([
	"sap/apf/api",
	"sap/m/App",
	"sap/ui/thirdparty/sinon"
],function(Api, App, sinon) {
	"use strict";

	Api = Api || sap.apf.Api;

	QUnit.module("API Unit Test - start APF", {
		beforeEach : function() {
			//arrange
			var self = this;
			var inject = {
				probe : function(probe) {
					self.oProbe = probe;
				},
				constructors : {
					StartFilterHandler : function(injectStartFilterHandler) {
						self.onBeforeApfStartupPromise = injectStartFilterHandler.instances.onBeforeApfStartupPromise;
					},
					MessageHandler : function() {
						return {
							activateOnErrorHandling : function() {},
							setLifeTimePhaseStartup : function() {},
							loadConfig : function() {},
							setMessageCallback : function() {},
							setLifeTimePhaseRunning : function() {
								if (self.setLifeTimePhaseRunningCallback)
									self.setLifeTimePhaseRunningCallback();
							},
							setTextResourceHandler : function() {},
							check : function() {}
						};
					}
				}
			};
			//act
			self.oApi = new Api(undefined, inject, undefined);
			//stub
			self.stubCreateApplicationLayout = sinon.stub(self.oProbe.uiApi, "createApplicationLayout", function() {
				if (self.createApplicationLayoutCallback) {
					if (self.createApplicationLayoutCallback()) {
						return Promise.resolve();
					}
				}
				return new Promise(function() {});
			});
			self.stubHandleStartup = sinon.stub(self.oProbe.uiApi, "handleStartup", function() {
				if (self.handleStartupCallback)
					if (self.handleStartupCallback()) {
						var deferred = jQuery.Deferred();
						deferred.resolve();
						return deferred;
					}
				return jQuery.Deferred().promise();
			});
			//spy
			self.spyBeforeStartup = sinon.spy();
			self.oApi.setCallbackBeforeApfStartup(self.spyBeforeStartup);
			self.oApi.setCallbackAfterApfStartup(function() {
				if (self.afterStartupCallback) {
					self.afterStartupCallback();
				}
			});
		},
		afterEach : function() {
			this.stubCreateApplicationLayout.restore();
			this.stubHandleStartup.restore();
		}
	});
	QUnit.test("start app without core promise resolved", function(assert) {
		//act
		var app = this.oApi.startApf();
		//assert
		assert.ok(app instanceof App, "startApf() will always return an instance of sap.m.App");
		assert.ok(this.spyBeforeStartup.notCalled, "before startup was not called");
		assert.ok(this.stubCreateApplicationLayout.notCalled, "create application layout was not called");
		assert.ok(this.stubHandleStartup.notCalled, "handle startup was not called");
		// The following assertion does not check, whether the startup succeeded (in fact it won't, as the core promise is never resolved by the resourcePathHandler)
		// We rather check for startupSucceeded() to return its default value, which is true.
		// Whether the startup really succeeds is tested in later tests
		assert.ok(this.oApi.startupSucceeded(), "startupSucceeded is at its default value true");
	});
	QUnit.test("start app with core promise resolved, but without application layout created (check deferred)", function(assert) {
		//arrange
		this.oProbe.corePromise.resolve();
		//assert async
		var done = assert.async();
		this.onBeforeApfStartupPromise.done(function() {
			assert.ok(this.spyBeforeStartup.called, "before startup was called");
			assert.ok(this.stubCreateApplicationLayout.notCalled, "create application layout was not called");
			assert.ok(this.stubHandleStartup.notCalled, "handle startup was not called");
			assert.ok(this.oApi.startupSucceeded(), "startup succeeded");
			done();
		}.bind(this));
		//act
		this.oApi.startApf();
	});
	QUnit.test("start app with core promise resolved, but without application layout created (check callback)", function(assert) {
		//arrange
		this.oProbe.corePromise.resolve();
		//assert async
		var done = assert.async();
		this.createApplicationLayoutCallback = function() {
			assert.ok(this.spyBeforeStartup.called, "before startup was called");
			assert.ok(this.stubHandleStartup.notCalled, "handle startup was not called");
			assert.ok(this.oApi.startupSucceeded(), "startup succeeded");
			done();
			return false;
		}.bind(this);
		//act
		this.oApi.startApf();
	});
	QUnit.test("start app with application layout created, but without startup promise resolved", function(assert) {
		// arrange
		this.oProbe.corePromise.resolve();
		this.createApplicationLayoutCallback = function() {
			return true;
		};
		//assert async
		var done = assert.async();
		this.handleStartupCallback = function() {
			assert.ok(this.spyBeforeStartup.called, "before startup was called");
			assert.ok(this.stubCreateApplicationLayout.called, "create application layout was called");
			assert.ok(this.oApi.startupSucceeded(), "startup succeeded");
			done();
			return false;
		}.bind(this);
		//act
		this.oApi.startApf();
	});
	QUnit.test("start app with start up promise resolved (check after callback)", function(assert) {
		//arrange
		this.oProbe.corePromise.resolve();
		this.createApplicationLayoutCallback = function() {
			return true;
		};
		this.handleStartupCallback = function() {
			return true;
		};
		//assert async
		var done = assert.async();
		this.afterStartupCallback = function() {
			assert.ok(this.spyBeforeStartup.called, "before startup was called");
			assert.ok(this.stubCreateApplicationLayout.called, "create application layout was called");
			assert.ok(this.stubHandleStartup.called, "handle startup was called");
			assert.ok(this.oApi.startupSucceeded(), "startup succeeded");
			done();
		}.bind(this);
		//act
		this.oApi.startApf();
	});
	QUnit.test("start app with start up promise resolved (check message handler callback)", function(assert) {
		//arrange
		this.oProbe.corePromise.resolve();
		this.createApplicationLayoutCallback = function() {
			return true;
		};
		this.handleStartupCallback = function() {
			return true;
		};
		//assert async
		var done = assert.async();
		this.setLifeTimePhaseRunningCallback = function() {
			assert.ok(this.spyBeforeStartup.called, "before startup was called");
			assert.ok(this.stubCreateApplicationLayout.called, "create application layout was called");
			assert.ok(this.stubHandleStartup.called, "handle startup was called");
			assert.ok(this.oApi.startupSucceeded(), "startup succeeded");
			done();
		}.bind(this);
		//act
		this.oApi.startApf();
	});
});