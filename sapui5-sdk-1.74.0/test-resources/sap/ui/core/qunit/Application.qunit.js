/* global QUnit */
sap.ui.define([
	"sap/ui/app/Application",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Control",
	"sap/ui/core/UIComponent",
	"require"
], function (Application, JSONModel, Control, UIComponent, require) {

	QUnit.test("Abstract", function(assert) {
		assert.expect(1);
		var oApp = new Application();
		assert.ok(oApp.getMetadata().isAbstract(), "sap.ui.app.Application is abstract");
		oApp.destroy();
	});

	QUnit.test("Config by Model", function(assert) {
		assert.expect(1);
		var oJSONModel = new JSONModel();
		oJSONModel.setData({
			foo : "bar"
		})
		var oApp = new Application({
			config : oJSONModel
		});
		assert.equal(oApp.getConfig().getProperty("/foo"), "bar", "Model is set right");
		oApp.destroy();
	});

	QUnit.test("Config by URI", function(assert) {
		assert.expect(1);
		var oApp = new Application({
			config : require.toUrl("./testdata/config.json")
		});
		assert.equal(oApp.getConfig().getProperty("/foo"), "bar", "Model is set right");
		oApp.destroy();
	});

	QUnit.test("Config by URI - Error", function(assert) {
		assert.expect(1);
		assert.throws(function() {
			var oApp = new Application({
				config : "someNotExistingUri.json"
			});
		}, /Could not load config file/, "Error is thrown when URI not exists");
		sap.ui.getApplication = undefined;
	});


	QUnit.test("Only one Application is allowed", function(assert) {
		assert.expect(2);
		var oApp = new Application();
		assert.ok(sap.ui.getApplication(), "Application is registered");
		assert.throws(function() {
			var oApp = new Application();
		}, /Only one instance of sap.ui.app.Application is allowed/, "Error is thrown when a second instance is created");
		sap.ui.getApplication = undefined;
	});


	QUnit.test("Root Property exists", function(assert) {
		assert.expect(1);
		var oApp = new Application({
			root : "content"
		});
		assert.equal(oApp.getRoot(), "content", "Root property available");
		oApp.destroy();
	});

	QUnit.test("Main function", function(assert) {
		assert.expect(1);
		var oApp = Application.extend("my.App", {
			main : function() {
				assert.ok(true, "Main function called");
			}
		});
		var oApp = new my.App();
		oApp.destroy();
	});

	QUnit.test("Root Component", function(assert) {
		assert.expect(1);
		Control.extend("my.Control", {
			renderer : function(oRm) {
				oRm.write("<div>works</div>");
			}
		});
		UIComponent.extend("my.Component", {
			createContent : function() {
				return new my.Control();
			}
		});
		var oApp = Application.extend("my.App", {
			createRootComponent : function() {
				return new my.Component();
			}
		});
		var oApp = new my.App({
			root : "content"
		});
		assert.ok(oApp.getRootComponent());
		oApp.destroy();
	});
});
