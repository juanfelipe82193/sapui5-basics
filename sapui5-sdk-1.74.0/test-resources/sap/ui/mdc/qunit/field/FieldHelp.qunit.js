// Use this test page to test the API and features of the FieldHelp.
// The interaction with the Field is tested on the field test page.

/* global QUnit */
/*eslint max-nested-callbacks: [2, 5]*/

sap.ui.define([
	"sap/ui/mdc/field/FieldHelpBase",
	"sap/ui/mdc/field/CustomFieldHelp",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/core/Icon"
], function (
		FieldHelpBase,
		CustomFieldHelp,
		Condition,
		Icon
	) {
	"use strict";

	var iPopoverDuration = 355;
	var oFieldHelp;
	var oField;
	var oField2;
	var iDisconnect = 0;
	var iSelect = 0;
	var aSelectConditions;
	var iOpen = 0;
	var bOpenSuggest;

	var _myDisconnectHandler = function(oEvent) {
		iDisconnect++;
	};

	var _mySelectHandler = function(oEvent) {
		iSelect++;
		aSelectConditions = oEvent.getParameter("conditions");
	};

	var _myOpenHandler = function(oEvent) {
		iOpen++;
		bOpenSuggest = oEvent.getParameter("suggestion");
		// fake Content of Popover
		var oPopover = oFieldHelp.getAggregation("_popover");
		if (oPopover && oPopover.getContent().length == 0) {
			oPopover.addContent(new Icon("I-Pop", {src:"sap-icon://sap-ui5"}));
		}
	};

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
		iOpen = 0;
		bOpenSuggest = undefined;
	};

	QUnit.module("basic features", {
		beforeEach: function() {
			oFieldHelp = new FieldHelpBase("F1-H", {
				disconnect: _myDisconnectHandler,
				open: _myOpenHandler
			});
			_initFields();
		},
		afterEach: _teardown
	});

	QUnit.test("default values", function(assert) {

		assert.equal(oFieldHelp.getConditions().length, 0, "Conditions");
		assert.equal(oFieldHelp.getFilterValue(), "", "FilterValue");
		assert.notOk(oFieldHelp.openByTyping(), "openByTyping");
		assert.equal(oFieldHelp.getTextForKey("A"), "", "getTextForKey");
		assert.notOk(oFieldHelp.getKeyForText("A"), "getKeyForText");
		assert.equal(oFieldHelp.getIcon(), "sap-icon://slim-arrow-down", "Icon for FieldHelp");

	});

	QUnit.test("connect", function(assert) {

		oFieldHelp.connect(oField);
		assert.equal(iDisconnect, 0, "Disconnect not fired");

		oFieldHelp.setConditions([Condition.createCondition("EEQ", ["1", "Test"])]);
		oFieldHelp.setFilterValue("A");
		oFieldHelp.connect(oField2);
		assert.equal(iDisconnect, 1, "Disconnect fired");
		assert.equal(oFieldHelp.getConditions().length, 0, "Conditions");
		assert.equal(oFieldHelp.getFilterValue(), "", "FilterValue");

	});

	QUnit.test("_getField", function(assert) {

		oField.addDependent(oFieldHelp);
		var oMyField = oFieldHelp._getField();
		assert.equal(oMyField.getId(), "I1", "field using aggregation");

		oField.removeDependent(oFieldHelp);
		oFieldHelp.connect(oField2);
		oMyField = oFieldHelp._getField();
		assert.equal(oMyField.getId(), "I2", "field using connect");

	});

	QUnit.test("getFieldPath", function(assert) {

		oField.getFieldPath = function() {
			return "Test";
		};
		oField.addDependent(oFieldHelp);
		oFieldHelp.connect(oField);
		var sFieldPath = oFieldHelp.getFieldPath();
		assert.equal(sFieldPath, "Test", "FieldPath of Field returned");

	});

	QUnit.test("getUIArea", function(assert) {

		var oUIArea = oFieldHelp.getUIArea();
		assert.notOk(oUIArea, "No UIArea found");

		oFieldHelp.connect(oField);
		oUIArea = oFieldHelp.getUIArea();
		assert.ok(oUIArea, "UIArea found");

	});

	QUnit.test("open as aggregation", function(assert) {

		oField.addDependent(oFieldHelp);

		var oPopover = oFieldHelp.getAggregation("_popover");
		assert.notOk(oPopover, "No Popover initial created");

		oFieldHelp.open(); // no suggestion
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				oPopover = oFieldHelp.getAggregation("_popover");
				assert.ok(oPopover, "Popover created by opening");
				if (oPopover) {
					assert.ok(oPopover.isOpen(), "Field help opened");
					assert.equal(oPopover._oOpenBy && oPopover._oOpenBy.getId(), "I1", "Popover opened by field");
					assert.equal(iOpen, 1, "Open event fired");
					assert.notOk(bOpenSuggest, "Open not as suggestion");

					oFieldHelp.close();

					setTimeout( function(){
						assert.notOk(oPopover.isOpen(), "Field help closed");
						fnDone();
					}, iPopoverDuration);  // to wait until popover is closed
				} else {
					fnDone();
				}
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("open using connect", function(assert) {

		oFieldHelp.open();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			assert.notOk(oPopover, "No Popover created if not assigned to field");

			oFieldHelp.connect(oField);
			oFieldHelp.open(true); // suggestion
			oPopover = oFieldHelp.getAggregation("_popover");
			assert.ok(oPopover, "Popover created by opening");
			if (oPopover) {
				assert.ok(oFieldHelp.isOpen(), "Field help opened");
				assert.ok(oPopover.isOpen(), "Popover opened");
				assert.equal(oPopover._oOpenBy.getId(), "I1", "Popover opened by field");
				assert.equal(iOpen, 1, "Open event fired");
				assert.ok(bOpenSuggest, "Open as suggestion");
				var oDomRef = oFieldHelp.getDomRef();
				assert.equal(oDomRef.id, "F1-H-pop", "DomRef of Popover used");
				var oScrollDelegate1 = oFieldHelp.getScrollDelegate();
				var oScrollDelegate2 = oPopover.getScrollDelegate();
				assert.equal(oScrollDelegate1, oScrollDelegate2, "oScrollDelegate of Popover used");

				oFieldHelp.connect(oField2);
				assert.ok(oFieldHelp.isOpen(), "Field help sill opened");
				assert.notOk(oFieldHelp.isOpen(true), "Field help not opened if closing is checked");

				setTimeout( function(){
					assert.notOk(oPopover.isOpen(), "Field help closed");

					oFieldHelp.open();
					assert.ok(oPopover.isOpen(), "Field help opened");
					assert.equal(oPopover._oOpenBy.getId(), "I2", "Popover opened by field2");
					fnDone();
				}, iPopoverDuration); // to wait until popover is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("toggle open", function(assert) {

		oField.addDependent(oFieldHelp);

		oFieldHelp.toggleOpen();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				assert.ok(oPopover.isOpen(), "Field help opened");
				assert.equal(oPopover._oOpenBy.getId(), "I1", "Popover opened by field");

				oFieldHelp.toggleOpen();

				setTimeout( function(){
					assert.notOk(oPopover.isOpen(), "Field help closed");
					oFieldHelp.toggleOpen();
					assert.ok(oPopover.isOpen(), "Field help opened");
					oFieldHelp.toggleOpen();
					oFieldHelp.toggleOpen(); // directly open again during closing
					setTimeout( function(){
						assert.ok(oPopover.isOpen(), "Field help open");
						fnDone();
					}, iPopoverDuration); // to wait until popover is open
				}, iPopoverDuration); // to wait until popover is closed
			} else {
				fnDone();
			}
		});

	});

	QUnit.module("no default content", {
		beforeEach: function() {
			oFieldHelp = new FieldHelpBase("F1-H", {
				disconnect: _myDisconnectHandler
			});
			_initFields();
		},
		afterEach: _teardown
	});

	QUnit.test("_setContent", function(assert) {

		var oContent = new Icon("I3", {src:"sap-icon://sap-ui5"});
		oFieldHelp._setContent(oContent);

		oField.addDependent(oFieldHelp);
		oFieldHelp.open();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			var aContent = oPopover.getContent();
			assert.equal(aContent.length, 1, "Popover has content");
			if (aContent[0]) {
				assert.equal(aContent[0].getId(), "I3", "Popover content");
			}
			oContent.destroy();
			fnDone();
		});

	});

	QUnit.test("_setContent after open", function(assert) {

		var oContent = new Icon("I3", {src:"sap-icon://sap-ui5"});

		oField.addDependent(oFieldHelp);
		oFieldHelp.open();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			assert.notOk(oPopover.isOpen(), "Popover not opened");
			oFieldHelp._setContent(oContent);
			assert.ok(oPopover.isOpen(), "Popover opened");
			var aContent = oPopover.getContent();
			assert.equal(aContent.length, 1, "Popover has content");
			if (aContent[0]) {
				assert.equal(aContent[0].getId(), "I3", "Popover content");
			}
			oContent.destroy();
			fnDone();
		});

	});

	var iBeforeOpen = 0;

	var _myBeforeOpenHandler = function(oEvent) {
		iBeforeOpen++;
	};

	QUnit.module("CustomFieldHelp", {
		beforeEach: function() {
			oFieldHelp = new CustomFieldHelp("F1-H", {
				content: [new Icon("I3", {src:"sap-icon://sap-ui5"})],
				disconnect: _myDisconnectHandler,
				beforeOpen: _myBeforeOpenHandler,
				select: _mySelectHandler
			});
			_initFields();
			oField.addDependent(oFieldHelp);
		},
		afterEach: function() {
			_teardown();
			iBeforeOpen = 0;
		}
	});

	QUnit.test("content display", function(assert) {

		oFieldHelp.open();
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				var oContent = oPopover._getAllContent()[0];
				assert.ok(oContent, "Popover has content");
				assert.equal(oContent.getId(), "I3", "content is Icon");
				assert.notOk(oPopover.getInitialFocus(), "Initial focus on Popover");
				assert.ok(iBeforeOpen > 0, "BeforeOpen event fired");
			}
			fnDone();
		});

	});

	QUnit.test("fireSelectEvent", function(assert) {

		var oCondition = Condition.createItemCondition("A", "B");
		oFieldHelp.fireSelectEvent([oCondition]);
		assert.equal(iSelect, 1, "Select event fired");
		assert.equal(aSelectConditions.length, 1, "One condition selected");
		assert.equal(aSelectConditions[0].values[0], "A", "Selected condition value0");
		assert.equal(aSelectConditions[0].values[1], "B", "Selected condition value1");

	});

});
