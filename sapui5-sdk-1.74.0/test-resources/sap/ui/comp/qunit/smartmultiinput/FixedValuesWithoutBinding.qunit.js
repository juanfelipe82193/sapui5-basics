/*global QUnit*/

sap.ui.define("test.sap.ui.comp.qunit.smartmultiinput.FixedValuesWithoutBinding", [
	"sap/ui/comp/smartmultiinput/SmartMultiInput",
	"test-resources/sap/ui/comp/qunit/smartmultiinput/TestUtils",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (SmartMultiInput, TestUtils, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.module("fixed-values without binding context", {
		before: function () {
			this.oMockServer = TestUtils.createMockServer();
		},
		after: function () {
			this.oMockServer.destroy();
		},
		beforeEach: function (assert) {
			var that = this;
			var fnDone = assert.async();

			TestUtils.createDataModel().then(function (oModel) {
				that.oModel = oModel;

				that.oSmartMultiInput = new SmartMultiInput({
					entitySet: "Categories",
					value: {
						path: "Description"
					}
				});

				that.oSmartMultiInput.setModel(that.oModel);

				that.oSmartMultiInput.placeAt("content");
				sap.ui.getCore().applyChanges();

				that.oSmartMultiInput.attachEventOnce("innerControlsCreated", function () {
					fnDone();
				});

			});
		},

		afterEach: function () {
			this.oModel.destroy();
			this.oSmartMultiInput.destroy();
		}
	});

	QUnit.test("multi input is rendered correctly", function (assert) {
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

		var aTokens = this.oSmartMultiInput.getTokens();
		assert.equal(aTokens.length, 0, "number of tokens");

		var aSuggestItems = this.oSmartMultiInput._oMultiComboBox.getItems();

		for (var i = 0; i < aSuggestItems.length; i++) {
			assert.equal(aSuggestItems[i].getKey(), aTestItems[i].key, "key is correct");
			assert.equal(aSuggestItems[i].getText(), aTestItems[i].text, "text is correct");
		}
	});

	QUnit.test("selection change", function (assert) {
		var fnDone = assert.async();

		this.oSmartMultiInput.attachSelectionChange(function () {
			assert.ok(true, "smartMultiInput selectionChange called on inner multiComboBox selectionChange");
			fnDone();
		});

		this.oSmartMultiInput._oMultiComboBox.fireSelectionChange({});
	});

});
