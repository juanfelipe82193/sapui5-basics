/*global QUnit*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.FixedValuesWithBinding", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (SmartMultiInput, TestUtils, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("fixed-values binding context", {
		before: function () {

		},
		after: function () {

		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			this.oMockServer = TestUtils.createMockServer();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;

				that.oSmartMultiInput = new SmartMultiInput({
					value: {
						path: "Categories/Description"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);
				that.oSmartMultiInput.bindElement({
					path: "/Products('1')"
				});

				that.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();

				that.oSmartMultiInput.attachInitialise(function() {
					that.oSmartMultiInput._oMultiInput.getBinding("tokens").attachDataReceived(function () {
						setTimeout(fnDone, 0); // wait for propagation from the model
					});
				});
			});
		},

		afterEach: function () {
			this.oMockServer.destroy();
			this.oModel.destroy();
			delete this.oModel;
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("smart multi input is rendered correctly", function (assert) {
		var mTestKeys = ["Projector", "Laptop"];

		var aKeys = this.oSmartMultiInput._oMultiComboBox.getSelectedKeys();

		for (var i = 0; i < mTestKeys.length; i++) {
			assert.equal(aKeys[i], mTestKeys[i], "key is correct");
		}

		assert.ok(this.oSmartMultiInput._oMultiComboBox, "multiComboBox is used");
	});

	QUnit.test("MultiComboBox items", function (assert) {
		var aTestItems = [
			{
				key: "Laptop",
				text: "Laptop"
			},
			{
				key: "Projector",
				text: "Projector"
			},
			{
				key: "Soundstation",
				text: "Soundstation"
			}
		];

		var aSuggestItems = this.oSmartMultiInput._oMultiComboBox.getItems();

		for (var i = 0; i < aSuggestItems.length; i++) {
			assert.equal(aSuggestItems[i].getKey(), aTestItems[i].key, "key is correct");
			assert.equal(aSuggestItems[i].getText(), aTestItems[i].text, "text is correct");
		}
	});
});
