// Use this test page to test the API and features of the FieldHelp.
// The interaction with the Field is tested on the field test page.

/* global QUnit */
/*eslint max-nested-callbacks: [2, 5]*/

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/mdc/field/ListFieldHelp",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/core/ListItem",
	"sap/ui/core/Icon",
	"sap/ui/model/FormatException",
	"sap/ui/model/ParseException"
], function (
		qutils,
		ListFieldHelp,
		Condition,
		ListItem,
		Icon,
		FormatException,
		ParseException
	) {
	"use strict";

	var oFieldHelp;
	var oField;
	var oField2;
	var iDisconnect = 0;
	var iSelect = 0;
	var aSelectConditions;
	var iNavigate = 0;
	var sNavigateValue;
	var sNavigateKey;
	var iDataUpdate = 0;
	var iOpen = 0;

	var _myDisconnectHandler = function(oEvent) {
		iDisconnect++;
	};

	var _mySelectHandler = function(oEvent) {
		iSelect++;
		aSelectConditions = oEvent.getParameter("conditions");
	};

	var _myNavigateHandler = function(oEvent) {
		iNavigate++;
		sNavigateValue = oEvent.getParameter("value");
		sNavigateKey = oEvent.getParameter("key");
	};

	var _myDataUpdateHandler = function(oEvent) {
		iDataUpdate++;
	};

	var _myOpenHandler = function(oEvent) {
		iOpen++;
	};

	var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");

	/* first test it without the Field to prevent loading of popup etc. */
	/* use dummy control to simulate Field */

	var _initFields = function() {
		oField = new Icon("I1", {src:"sap-icon://sap-ui5"});
		oField2 = new Icon("I2", {src:"sap-icon://sap-ui5"});

		oField.placeAt("content");
		oField2.placeAt("content");
		sap.ui.getCore().applyChanges();
	};

	var _teardown = function() {
		oFieldHelp.destroy();
		oFieldHelp = undefined;
		oField.destroy();
		oField = undefined;
		oField2.destroy();
		oField2 = undefined;
		iDisconnect = 0;
		iSelect = 0;
		aSelectConditions = undefined;
		iNavigate = 0;
		sNavigateValue = undefined;
		sNavigateKey = undefined;
		iDataUpdate = 0;
		iOpen = 0;
	};

	QUnit.module("ListFieldHelp", {
		beforeEach: function() {
			oFieldHelp = new ListFieldHelp("F1-H", {
				items: [new ListItem({text: "Item1", additionalText: "Text1", key: "I1"}),
				        new ListItem({text: "Item2", additionalText: "Text2", key: "I2"}),
				        new ListItem({text: "X-Item3", additionalText: "Text3", key: "I3"})
				       ],
				disconnect: _myDisconnectHandler,
				select: _mySelectHandler,
				navigate: _myNavigateHandler,
				dataUpdate: _myDataUpdateHandler,
				open: _myOpenHandler
			});
			_initFields();
			oField.addDependent(oFieldHelp);
		},
		afterEach: _teardown
	});

	QUnit.test("default values", function(assert) {

		assert.ok(oFieldHelp.openByTyping(), "openByTyping");

	});

	QUnit.test("List creation", function(assert) {

		assert.notOk(oFieldHelp._oList, "no List created by default");

		oFieldHelp.open();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover", "sap/m/List", "sap/m/DisplayListItem"], function (Popover, List, DisplayListItem) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				assert.equal(iOpen, 1, "Open event fired");
				var oList = oPopover.getContent()[0];
				assert.ok(oList, "Popover has content");
				assert.ok(oList instanceof List, "content is List");
				var aItems = oList.getItems();
				assert.equal(aItems.length, 3, "List has 3 Items");
				assert.ok(aItems[0] instanceof DisplayListItem, "Item is DisplayListItem");
				assert.equal(aItems[0].getLabel(), "Item1", "Text assigned to item");
				assert.equal(aItems[0].getValue(), "Text1", "AdditinalText assigned to item");
				assert.equal(iDataUpdate, 0, "DataUpdate event not fired");
				assert.equal(oPopover.getInitialFocus(), "I1", "Initial focus on Field");
			}
			fnDone();
		});

	});

	QUnit.test("conditions", function(assert) {

		var oCondition = Condition.createCondition("EEQ", ["I2", "Item2"]);
		oFieldHelp.setConditions([oCondition]);

		oFieldHelp.open();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover", "sap/m/List", "sap/m/DisplayListItem"], function (Popover, List, DisplayListItem) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				var oList = oPopover.getContent()[0];
				var aItems = oList.getItems();
				assert.ok(aItems[1].getSelected(), "Item 2 is selected");
				oCondition = Condition.createCondition("EEQ", ["I3"]);
				oFieldHelp.setConditions([oCondition]);
				assert.notOk(aItems[1].getSelected(), "Item 2 is not selected");
				assert.ok(aItems[2].getSelected(), "Item 3 is selected");
			}
			fnDone();
		});

	});

	QUnit.test("FilterValue", function(assert) {

		oFieldHelp.setFilterValue("It");

		oFieldHelp.open();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover", "sap/m/List", "sap/m/DisplayListItem"], function (Popover, List, DisplayListItem) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				var oList = oPopover.getContent()[0];
				var aItems = oList.getItems();
				assert.equal(aItems.length, 2, "List has 2 Items");
				assert.equal(aItems[0].getLabel(), "Item1", "Text assigned to item1");
				assert.equal(aItems[1].getLabel(), "Item2", "Text assigned to item2");
				oFieldHelp.setFilterValue("X");
				aItems = oList.getItems();
				assert.equal(aItems.length, 1, "List has 1 Item");
				assert.equal(aItems[0].getLabel(), "X-Item3", "Text assigned to item1");
			}
			fnDone();
		});

	});

	QUnit.test("navigate", function(assert) {

		oFieldHelp.navigate(1);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover", "sap/m/List", "sap/m/DisplayListItem"], function (Popover, List, DisplayListItem) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				assert.equal(iOpen, 1, "Open event fired");
				assert.ok(oPopover.isOpen(), "Field help opened");
				var oList = oPopover.getContent()[0];
				var aItems = oList.getItems();
				assert.ok(aItems[0].getSelected(), "Item 1 is selected");
				assert.equal(iNavigate, 1, "Navigate event fired");
				assert.equal(sNavigateValue, "Item1", "Navigate event value");
				assert.equal(sNavigateKey, "I1", "Navigate event key");
				var aConditions = oFieldHelp.getConditions();
				assert.equal(aConditions.length, 1, "conditions length");
				assert.equal(aConditions[0].values[0], "I1", "conditions key");

				oFieldHelp.navigate(1);
				assert.ok(aItems[1].getSelected(), "Item 2 is selected");
				assert.equal(iNavigate, 2, "Navigate event fired");
				assert.equal(sNavigateValue, "Item2", "Navigate event value");
				assert.equal(sNavigateKey, "I2", "Navigate event key");
				aConditions = oFieldHelp.getConditions();
				assert.equal(aConditions.length, 1, "conditions length");
				assert.equal(aConditions[0].values[0], "I2", "conditions key");

				oFieldHelp.navigate(-1);
				assert.ok(aItems[0].getSelected(), "Item 1 is selected");
				assert.equal(iNavigate, 3, "Navigate event fired");
				assert.equal(sNavigateValue, "Item1", "Navigate event value");
				assert.equal(sNavigateKey, "I1", "Navigate event key");
				aConditions = oFieldHelp.getConditions();
				assert.equal(aConditions.length, 1, "conditions length");
				assert.equal(aConditions[0].values[0], "I1", "conditions key");

				oFieldHelp.navigate(-1);
				assert.ok(aItems[0].getSelected(), "Item 1 is selected");
				assert.equal(iNavigate, 3, "Navigate event not fired");

				oFieldHelp.navigate(5);
				assert.ok(aItems[2].getSelected(), "Item 3 is selected");
				assert.equal(iNavigate, 4, "Navigate event fired");
				assert.equal(sNavigateValue, "X-Item3", "Navigate event value");
				assert.equal(sNavigateKey, "I3", "Navigate event key");
				aConditions = oFieldHelp.getConditions();
				assert.equal(aConditions.length, 1, "conditions length");
				assert.equal(aConditions[0].values[0], "I3", "conditions key");

				oFieldHelp.setConditions([]); // to initialize
				oFieldHelp.navigate(-1);
				assert.ok(aItems[2].getSelected(), "Item 3 is selected");
				assert.equal(iNavigate, 5, "Navigate event fired");
				assert.equal(sNavigateValue, "X-Item3", "Navigate event value");
				assert.equal(sNavigateKey, "I3", "Navigate event key");
				aConditions = oFieldHelp.getConditions();
				assert.equal(aConditions.length, 1, "conditions length");
				assert.equal(aConditions[0].values[0], "I3", "conditions key");

				oFieldHelp.navigate(1);
				assert.ok(aItems[2].getSelected(), "Item 3 is selected");
				assert.equal(iNavigate, 5, "Navigate event not fired");

				oFieldHelp.navigate(-5);
				assert.ok(aItems[0].getSelected(), "Item 1 is selected");
				assert.equal(iNavigate, 6, "Navigate event fired");
				assert.equal(sNavigateValue, "Item1", "Navigate event value");
				assert.equal(sNavigateKey, "I1", "Navigate event key");
				aConditions = oFieldHelp.getConditions();
				assert.equal(aConditions.length, 1, "conditions length");
				assert.equal(aConditions[0].values[0], "I1", "conditions key");
			}
			fnDone();
		});

	});

	QUnit.test("getTextForKey", function(assert) {

		var sText = oFieldHelp.getTextForKey("I2");
		assert.equal(sText, "Item2", "Text for key");

		sText = oFieldHelp.getTextForKey("");
		assert.equal(sText, null, "No text for empty key");

		sText = oFieldHelp.getTextForKey(null);
		assert.equal(sText, null, "No text for empty key");

		try {
			sText = oFieldHelp.getTextForKey("Test");
		} catch (oError) {
			assert.ok(oError, "Error Fired");
			assert.ok(oError instanceof FormatException, "Error is a FormatException");
			var sError = oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", ["Test"]);
			assert.equal(oError.message, sError, "Error message");
		}

	});

	QUnit.test("getKeyForText", function(assert) {

		var sKey = oFieldHelp.getKeyForText("Item2");
		assert.equal(sKey, "I2", "key for text");

		sKey = oFieldHelp.getKeyForText("");
		assert.equal(sKey, null, "no key for empty text");

		try {
			sKey = oFieldHelp.getKeyForText("X");
		} catch (oError) {
			assert.ok(oError, "Error Fired");
			assert.ok(oError instanceof ParseException, "Error is a ParseException");
			var sError = oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", ["X"]);
			assert.equal(oError.message, sError, "Error message");
		}

	});

	QUnit.test("select item", function(assert) {

		oFieldHelp.open();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover", "sap/m/List", "sap/m/DisplayListItem"], function (Popover, List, DisplayListItem) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				var oList = oPopover.getContent()[0];
				var aItems = oList.getItems();
				setTimeout( function(){
					qutils.triggerEvent("tap", aItems[1].getId());
					setTimeout( function(){
						assert.equal(iSelect, 1, "Select event fired");
						assert.equal(aSelectConditions.length, 1, "one condition returned");
						assert.equal(aSelectConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[0].values[0], "I2", "Condition values[0}");
						assert.equal(aSelectConditions[0].values[1], "Item2", "Condition values[1}");
						var aConditions = oFieldHelp.getConditions();
						assert.equal(aConditions.length, 1, "conditions length");
						assert.equal(aConditions[0].values[0], "I2", "conditions key");
						assert.notOk(oPopover.isOpen(), "Field help closed");
						fnDone();
					}, 500);
				}, 10);
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("dataUpdate", function(assert) {

		var oItem = new ListItem({text: "Item4", additionalText: "Text4", key: "I4"});
		oFieldHelp.addItem(oItem);
		assert.equal(iDataUpdate, 1, "DataUpdateEvent fired by adding item");

		oItem.setText("Test");
		assert.equal(iDataUpdate, 2, "DataUpdateEvent fired by changing item");

		oFieldHelp.removeItem(oItem);
		assert.equal(iDataUpdate, 3, "DataUpdateEvent fired by removing item");

		oItem.setText("X");
		assert.equal(iDataUpdate, 3, "DataUpdateEvent not fired by changing removed item");

		oItem.destroy();

	});

});
