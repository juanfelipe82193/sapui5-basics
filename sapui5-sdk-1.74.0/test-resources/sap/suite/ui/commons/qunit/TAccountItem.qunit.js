sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/taccount/TAccount",
	"sap/suite/ui/commons/taccount/TAccountItem",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, TAccount, TAccountItem, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	function render(oElement) {
		oElement.placeAt("content");
		sap.ui.getCore().applyChanges();
	}

	QUnit.test("TAccountItem test valid color values", function (assert) {
		var aColor = [
			"#551199",
			"rgb(201, 76, 76)",
			"hsl(0, 100%, 50%)",
			"red",
			"sapUiSuccessBorder"
		];

		for (var iIndex in aColor) {
			var oAccount = new TAccount({
				measureOfUnit: "EUR"
			});

			var oItem = new TAccountItem({
				value: 100,
				color: "#000000"
			});

			oAccount.addDebit(oItem);
			render(oAccount);

			oItem.setColor(aColor[iIndex]);
			assert.equal(oItem.getColor(), aColor[iIndex]);
			oAccount.destroy();
		}
	});

	QUnit.test("TAccountItem test undefined/null color values", function (assert) {
		var aColor = [
			undefined,
			null
		];

		for (var iIndex in aColor) {
			var oAccount = new TAccount({
				measureOfUnit: "EUR"
			});

			var oItem = new TAccountItem({
				value: 100,
				color: "#000000"
			});

			oAccount.addDebit(oItem);
			render(oAccount);

			assert.equal(oItem.getDomRef().querySelector(".sapSuiteUiCommonsAccountColorBar").hasAttribute("style"), true);

			oItem.setColor(aColor[iIndex]);
			render(oAccount);

			assert.equal(oItem.getDomRef().querySelector(".sapSuiteUiCommonsAccountColorBar").hasAttribute("style"), false);
			oAccount.destroy();
		}
	});
});
