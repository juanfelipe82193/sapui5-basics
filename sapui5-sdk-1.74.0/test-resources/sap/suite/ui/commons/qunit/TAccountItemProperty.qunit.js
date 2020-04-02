sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/taccount/TAccount",
	"sap/suite/ui/commons/taccount/TAccountItem",
	"sap/suite/ui/commons/taccount/TAccountItemProperty",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function (jQuery, TAccount, TAccountItem, TAccountItemProperty, createAndAppendDiv) {
	"use strict";

	createAndAppendDiv("content");

	QUnit.test("TAccountProperty test setting properties", function (assert) {

		var oProperty = new TAccountItemProperty({
			label: "myLabel",
			key: "myKey",
			value: "myValue",
			visible: true
		});

		var oAccount = new TAccount({
			measureOfUnit: "EUR",
			credit: [new TAccountItem({
				value: 300,
				properties: oProperty
			})]
		});

		oAccount.placeAt("content");
		sap.ui.getCore().applyChanges();

		oProperty.setLabel("myLabelChanged");
		oProperty.setKey("myKeyChanged");
		oProperty.setValue("myValueChanged");
		oProperty.setVisible(false);

		sap.ui.getCore().applyChanges();

		assert.equal(oProperty.getDomRef().style.display, "none");
		assert.equal(oProperty.getDomRef().querySelector(".sapSuiteUiCommonsAccountItemLabel").innerText, "myLabelChanged:");
		assert.equal(oProperty.getDomRef().getAttribute("key"), "myKeyChanged");
		assert.equal(oProperty.getDomRef().querySelector(".sapSuiteUiCommonsAccountItemProperty").innerText, "myValueChanged");

		oAccount.destroy();
	});
});
