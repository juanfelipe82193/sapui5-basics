/* globals QUnit */

sap.ui.define([
	"sap/base/Log",
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/comp/navpopover/NavigationPopoverHandler",
	"sap/m/Button",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/layout/form/SimpleForm",
	"sap/ui/core/Title",
	"sap/m/VBox",
	"sap/m/Text",
	"sap/ui/comp/navpopover/SemanticObjectController"
], function(Log, FakeFlpConnector, NavigationPopoverHandler, Button, MockServer, ODataModel, SimpleForm, Title, VBox, Text, SemanticObjectController) {
	"use strict";

	var gButton;
	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler - aPopoverForms", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
			this.oMockServer = new MockServer({
				rootUri: "/MockSrv/"
			});
			this.oMockServer.simulate(
				"test-resources/sap/ui/comp/qunit/navpopover/mockserver/metadata.xml",
				"test-resources/sap/ui/comp/qunit/navpopover/mockserver/"
			);
			this.oMockServer.start();

			this.oModel = new ODataModel("/MockSrv");
			FakeFlpConnector.enableFakeConnector({
				TestObject: {
					links: [
						{
							action: "displayFactSheet",
							intent: "#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: "#/dummyLink2",
							text: "List"
						}
					]
				}
			});
			gButton = new Button({
				text: "button"
			});
			gButton.setModel(this.oModel);
			gButton.placeAt("qunit-fixture");
				sap.ui.getCore().applyChanges();
			this.oModelPromise = this.oModel.getMetaModel().loaded();
		},

		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();

			gButton.destroy();
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("no determination if property 'contactAnnotationPath' is not set", function(assert) {
		var done = assert.async();
		this.oModelPromise.then(function(){
			// system under test
			var oNavigationPopoverHandler = new NavigationPopoverHandler({
				semanticObject: "TestObject",
				fieldName: "fieldA",
				control: gButton
			});

			oNavigationPopoverHandler.setModel(this.oODataMetaModelStub);

			oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
				assert.equal(oEvent.getParameters().popoverForms.length, 0);
				oEvent.getParameters().show();
			});

			// act
			oNavigationPopoverHandler.openPopover().then(function() {
				// assert
				assert.equal(oNavigationPopoverHandler._oPopover.getExtraContent(), null);

				done();

				// cleanup
				oNavigationPopoverHandler.destroy();
			});
		}.bind(this));
	});

	QUnit.test("oPopoverForms are taken over by default", function(assert) {
		var done = assert.async();
		this.oModelPromise.then(function(){

			// system under test
			var oNavigationPopoverHandler = new NavigationPopoverHandler({
				semanticObject: "TestObject",
				fieldName: "fieldA",
				contactAnnotationPath: "",
				control: gButton,
				navigationTargetsObtained: function(oEvent) {
					assert.equal(oEvent.getParameters().popoverForms.length, 1);
					oEvent.getParameters().show();
				}
			});

			// arrange
			gButton.bindElement({
				path: "/ProductCollection('38094020.0')",
				events: {
					change: function(oEvent) {
						// act
						oNavigationPopoverHandler.openPopover().then(function() {
							// assert
							assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent());
							assert.equal(sap.ui.getCore().byId(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent()).getItems().length, 1);

							done();

							// cleanup
							oNavigationPopoverHandler.destroy();
						});
					}
				}
			});
		});
	});

	QUnit.test("pass modified 'popoverForms'", function(assert) {

		var done = assert.async();
		this.oModelPromise.then(function(){

			// system under test
			var sPopoverFormID;
			var oNavigationPopoverHandler = new NavigationPopoverHandler({
				semanticObject: "TestObject",
				fieldName: "fieldA",
				contactAnnotationPath: "",
				control: gButton,
				navigationTargetsObtained: function(oEvent) {
					sPopoverFormID = oEvent.getParameters().popoverForms[0].getId();
					oEvent.getParameters().popoverForms[0].getContent()[0].setText("My Details");
					oEvent.getParameters().show(undefined, undefined, oEvent.getParameters().popoverForms[0]);
				}
			});

			// arrange

			gButton.bindElement({
				path: "/ProductCollection('38094020.0')",
				events: {
					change: function(oEvent) {
						// act
						oNavigationPopoverHandler.openPopover().then(function() {
							// assert
							assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent());
							assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent(), sPopoverFormID);

							done();

							// cleanup
							oNavigationPopoverHandler.destroy();
						});
					}
				}
			});
		});
	});

	QUnit.test("enrich 'aPopoverForms' with 'additionalContent'", function(assert) {
		// system under test
		var sPopoverFormID;
		var sAdditionalFormID;
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			contactAnnotationPath: "",
			control: gButton,
			navigationTargetsObtained: function(oEvent) {
				var aForms = oEvent.getParameters().popoverForms;
				sPopoverFormID = oEvent.getParameters().popoverForms[0].getId();
				oEvent.getParameters().popoverForms[0].getContent()[0].setText("My Details");
				var oAdditionalForm = new SimpleForm({
					maxContainerCols: 1,
					content: [
						new Title({
							text: "Detailed information"
						}), new Text({
							text: "By pressing on the links below a new browser window with image of product will be opened."
						})
					]
				});
				sAdditionalFormID = oAdditionalForm.getId();
				aForms.push(oAdditionalForm);
				oEvent.getParameters().show(undefined, undefined, undefined, new VBox({
					items: aForms
				}));
			}
		});

		// arrange
		var done = assert.async();

		gButton.bindElement({
			path: "/ProductCollection('38094020.0')",
			events: {
				change: function(oEvent) {
					// act
					oNavigationPopoverHandler.openPopover().then(function() {
						// assert
						assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent());
						var oVBox = sap.ui.getCore().byId(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent());
						assert.equal(oVBox.getItems().length, 2);
						assert.equal(oVBox.getItems()[0].getId(), sPopoverFormID);
						assert.equal(oVBox.getItems()[1].getId(), sAdditionalFormID);

						done();

						// cleanup
						oNavigationPopoverHandler.destroy();
					});
				}
			}
		});
	});

	QUnit.start();
});