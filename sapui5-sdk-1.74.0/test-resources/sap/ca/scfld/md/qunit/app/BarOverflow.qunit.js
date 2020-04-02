/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ca/scfld/md/app/BarOverflow",
	"sap/ca/scfld/md/app/BarOverflowLayoutData",
	"sap/m/ActionSheet",
	"sap/m/Bar",
	"sap/m/Button",
	"sap/ui/core/ResizeHandler",
	"sap/m/Select",
	"sap/m/Slider"
], function (jQuery, BarOverflow, BarOverflowLayoutData, ActionSheet, Bar, Button, ResizeHandler,
		Select, Slider) {
	"use strict";
	/*global QUnit */
	QUnit.module("initialization - rendering");

	QUnit.test("Should not handle a sizechange before the bar's initial rendering",
			function (assert) {
		// Arrange
		var oBar = new Bar(),
			oResizeSpy = this.spy(BarOverflow.prototype, "_handleSizeChange");

		// System under Test + Act
		var oBarOverflow = new BarOverflow(oBar, new ActionSheet());

		// Assert
		assert.strictEqual(oResizeSpy.callCount, 0,
			"Did not call handle sizeChange before rendering");

		// Cleanup
		oBarOverflow.destroy();
		oBar.destroy();
	});

	QUnit.test("Should handle a sizechange after the bar's initial rendering", function (assert) {
		// Arrange
		var oBar = new Bar(),
			oResizeSpy = this.spy(BarOverflow.prototype, "_handleSizeChange");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, new ActionSheet());

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// rerender again, we make sure its 2 size changes not 3
		oBar.rerender();
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeSpy.callCount, 2,
			"Did call handle sizeChange after the initial rendering");

		// Cleanup
		oBarOverflow.destroy();
		oBar.destroy();
	});

	QUnit.test("Should handle a sizechange if the bar was already rendered", function (assert) {
		// Arrange
		var oBar = new Bar(),
			oResizeSpy = this.spy(BarOverflow.prototype, "_handleSizeChange");

		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// System under Test + Act
		var oBarOverflow = new BarOverflow(oBar, new ActionSheet());

		// Assert
		assert.strictEqual(oResizeSpy.callCount, 1, "Did call handle sizeChange");

		// Cleanup
		oBarOverflow.destroy();
		oBar.destroy();
	});

	QUnit.module("initialization - resizing");

	QUnit.test("Should handle a resize of the bar", function (assert) {
		// Arrange
		var oBar = new Bar(),
			oResizeSpy = this.spy(BarOverflow.prototype, "_handleSizeChange"),
			oResizeHandlerStub = this.stub(ResizeHandler, "register", jQuery.noop);

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, new ActionSheet());

		// Rendering
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Act
		oResizeHandlerStub.callArg(1);

		// Assert
		assert.strictEqual(oResizeSpy.callCount, 2,
			"Did call handle sizeChange twice initial rendering and size change");

		// Cleanup
		oBarOverflow.destroy();
		oBar.destroy();
	});

	QUnit.module("destruction");

	QUnit.test("Should deregister Sizechange on BarOverflows destruction", function (assert) {
		// Arrange
		var oBar = new Bar();

		this.spy(BarOverflow.prototype, "_handleSizeChange");
		this.stub(ResizeHandler, "register", function () {
			return 42;
		});

		var oDeregisterStub = this.stub(ResizeHandler, "deregister", jQuery.noop);

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, new ActionSheet());

		// Render
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Act
		oBarOverflow.destroy();

		// Assert
		assert.strictEqual(oDeregisterStub.callCount, 1, "Did deregister");
		assert.strictEqual(oDeregisterStub.getCall(0).args[0], 42,
			"Did deregister the correct listener");

		// Cleanup
		oBar.destroy();
	});


	QUnit.test("Should deregister onAfterRendering on BarOverflows destruction", function (assert) {
		// Arrange
		var oBar = new Bar();
		var oResizeSpy = this.spy(BarOverflow.prototype, "_handleSizeChange");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, new ActionSheet());

		// Render
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Act
		oBarOverflow.destroy();

		oBar.rerender();

		// Assert
		assert.strictEqual(oResizeSpy.callCount, 1, "Did call handle sizeChange only once");

		// Cleanup
		oBar.destroy();
	});

	QUnit.module("overflow handling");

	QUnit.test("Should move an overflowing button to the overflow action sheet", function (assert) {
		// Arrange
		var oOverflowingButton = new Button({
			width : "400px"
		});

		var oBar = new Bar({
			contentRight : [oOverflowingButton]
		});
		var oActionSheet = new ActionSheet();
		var oResizeHandler = this.spy();

		jQuery("#qunit-fixture").css("width", "300px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 1, "Did add a button to the action sheet");
		assert.ok(oResizeHandler.calledWith([oOverflowingButton]),
			"The button was the overflowing button");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.test("Should only move overflowing buttons to the action sheet", function (assert) {
		// Arrange
		var oNotOverflowingButton1 = new Button({
			width : "100px"
		});
		var oNotOverflowingButton2 = new Button({
			width : "100px"
		});
		var oOverflowingButton1 = new Button({
			width : "200px"
		});
		var oOverflowingButton2 = new Button({
			width : "200px"
		});

		var oBar = new Bar({
			contentRight : [oNotOverflowingButton1, oNotOverflowingButton2, oOverflowingButton1,
				oOverflowingButton2]
		});
		var oActionSheet = new ActionSheet();
		var oResizeHandler = this.spy();

		jQuery("#qunit-fixture").css("width", "300px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 1, "Did add a button to the action sheet");
		assert.ok(oResizeHandler.calledWith([oOverflowingButton1, oOverflowingButton2]),
			"The button was the overflowing button");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.module("layout data - move to overflow");

	QUnit.test("Should not move Buttons that have moveToOverflow = false", function (assert) {
		// Arrange
		var oNotMoveableButton = new Button({
			width : "150px",
			layoutData : new BarOverflowLayoutData({
				moveToOverflow : false
			})
		});
		var oOverFlowingButton = new Button({
			width : "100px"
		});
		var oNotOverflowingButton = new Button({
			width : "100px"
		});

		var oBar = new Bar({
			contentRight : [ oNotMoveableButton, oNotOverflowingButton, oOverFlowingButton ]
		});
		var oActionSheet = new ActionSheet();
		var oResizeHandler = this.spy();
		jQuery("#qunit-fixture").css("width", "300px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 1, "Did add a button to the action sheet");
		assert.ok(oResizeHandler.calledWith([oOverFlowingButton]),
			"The first overflowing button is in the actionSheet");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.module("layout data - stay in overflow");

	QUnit.test("Should always move Buttons that have stayInOverflow = true", function (assert) {
		// Arrange
		var oSmallButton = new Button({
			width : "100px",
			layoutData : new BarOverflowLayoutData({
				stayInOverflow : true
			})
		});

		var oBar = new Bar({
			contentRight : [ oSmallButton ]
		});
		var oActionSheet = new ActionSheet();
		var oResizeHandler = this.spy();
		jQuery("#qunit-fixture").css("width", "300px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 1, "Did add a button to the action sheet");
		assert.ok(oResizeHandler.calledWith([oSmallButton]),
			"The first overflowing button is in the actionSheet");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	function moveAllButtonsToBar (aButtons) {
		this._oActionSheet.getButtons().forEach(function (oButton) {
			this._oBar.addContentRight(oButton);
		}, this);
	}

	QUnit.test("Should not move Buttons out of the actionSheet that have stayInOverflow = true",
			function (assert) {
		// Arrange
		var oSmallButton = new Button({
			width : "100px"
		});
		var oStayInOverflowButton = new Button({
			width : "100px",
			layoutData : new BarOverflowLayoutData({
				stayInOverflow : true
			})
		});

		var oBar = new Bar({
			contentRight : oStayInOverflowButton
		});
		var oActionSheet = new ActionSheet({
			buttons : oSmallButton
		});
		var oResizeHandler = this.spy(moveAllButtonsToBar);
		jQuery("#qunit-fixture").css("width", "300px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 2, "Did invoke the resize twice");
		assert.ok(oResizeHandler.firstCall.args.length === 0, "First call for clearing the bar");
		assert.ok(oResizeHandler.secondCall.args[0][0] === oStayInOverflowButton,
			"The actionSheet contains the stayInOverflowButton");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.test("Should also move big buttons when a small one has stayInOverflow = true",
			function (assert) {
		// Arrange
		var oSmallButton = new Button({
			width : "100px",
			layoutData : new BarOverflowLayoutData({
				stayInOverflow : true
			})
		});
		var oBigButton = new Button({
			width : "400px"
		});

		var oBar = new Bar({
			contentRight : [ oSmallButton, oBigButton ]
		});
		var oActionSheet = new ActionSheet();
		var oResizeHandler = this.spy();

		jQuery("#qunit-fixture").css("width", "300px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet,oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 1, "Did add both buttons to the action sheet");
		assert.ok(oResizeHandler.calledWith([oBigButton, oSmallButton]),
			"The actionSheet contains the stayInOverflowButton");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.test("Should not reserve space for buttons with stayInOverflow = true",
			function  (assert) {
		// Arrange
		var oSmallButton = new Button({
			width : "100px"
		});
		var oBigButton = new Button({
			width : "400px",
			layoutData : new BarOverflowLayoutData({
				stayInOverflow : true
			})
		});

		var oBar = new Bar({
			contentRight : [ oSmallButton, oBigButton ]
		});
		var oActionSheet = new ActionSheet();
		var oResizeHandler = this.spy();
		jQuery("#qunit-fixture").css("width", "300px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 1, "Did add both buttons to the action sheet");
		assert.ok(oResizeHandler.calledWith([oBigButton]), "The big button is in the actionSheet");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.module("layout data - Overflow button");


	QUnit.test("Should show the overflow button if there is a button in the actionsheet",
			function (assert) {
		// Arrange
		var oOverflowButton = new Button({
			width : "250px",
			layoutData : new BarOverflowLayoutData({
				overflowButton : true
			})
		});
		var oSmallButton = new Button({
			width : "100px",
			layoutData : new BarOverflowLayoutData({
				stayInOverflow : true
			})
		});

		var oBar = new Bar({
			contentRight : [ oSmallButton, oOverflowButton ]
		});
		var oActionSheet = new ActionSheet();
		var oResizeHandler = this.spy();
		jQuery("#qunit-fixture").css("width", "300px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 1, "Called once");
		assert.ok(oResizeHandler.calledWith([oSmallButton]),
			"The small button is in the actionSheet");
		assert.strictEqual(oOverflowButton.getVisible(), true, "overflow is visible");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.module("underflow handling");

	QUnit.test("Should move buttons out of the actionsheet if there is space in the bar and there"
			+ " are stay in overflow buttons", function (assert) {
		// Arrange
		var oSmallButton = new Button({
			width : "150px"
		});
		var oSmallButton2 = new Button({
			width : "100px"
		});
		var oOverflowingButton = new Button({
			width : "100px"
		});
		var oStayInOverflowButton = new Button({
			width : "300px",
			layoutData : new BarOverflowLayoutData({
				stayInOverflow : true
			})
		});

		var oBar = new Bar({
			contentRight : [oSmallButton, oSmallButton2, oOverflowingButton, oStayInOverflowButton]
		});
		var oActionSheet = new ActionSheet();
		var oResizeHandler = this.spy();
		//make the bar small that no buttons fit anymore
		jQuery("#qunit-fixture").css("width", "0px");

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeHandler);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		//make the bar big again to have enough space for all the buttons to fit in there
		jQuery("#qunit-fixture").css("width", "300px");
		//resize handler would trigger this but sinon prevent it from doing so
		oBarOverflow._handleSizeChange();

		// Assert
		assert.strictEqual(oResizeHandler.callCount, 2, "Called twice");
		assert.ok(oResizeHandler.calledWith([oOverflowingButton, oStayInOverflowButton]),
			"Only overflowing buttons are in the actionSheet");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.module("Order of buttons");

	function testButtonOrder(sTestName, oOptions) {
		QUnit.test(sTestName, function (assert) {
			// Arrange
			var oFirstButton = new Button(oOptions.firstButton)
			var oSecondButton = new Button(oOptions.secondButton);
			var oThirdButton = new Button(oOptions.thirdButton);

			var oBar = new Bar({
				contentRight : [ oFirstButton, oSecondButton, oThirdButton ]
			});
			var oActionSheet = new ActionSheet();
			//make the bar small that only the DoNotMoveButton and one small button fits
			jQuery("#qunit-fixture").css("width", "300px");

			// System under Test
			var oBarOverflow = new BarOverflow(oBar, oActionSheet);

			// Act
			oBar.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			//make the bar big again to have enough space for all the buttons to fit in there
			jQuery("#qunit-fixture").css("width", "400px");
			//resize handler would trigger this but sinon prevent it from doing so
			oBarOverflow._handleSizeChange();
			sap.ui.getCore().applyChanges();

			// Assert
			assert.strictEqual(oBar.getContentRight().length, 3, "Did add a buttons to the bar");
			assert.strictEqual(oBar.getContentRight()[0].sId, oFirstButton.sId,
				"The first button is still in the same place");
			assert.strictEqual(oBar.getContentRight()[1].sId, oSecondButton.sId,
				"Second button is correct");
			assert.strictEqual(oBar.getContentRight()[2].sId, oThirdButton.sId,
				"Third one is also correct");

			// Cleanup
			oActionSheet.destroy();
			oBar.destroy();
			oBarOverflow.destroy();
			jQuery("#qunit-fixture").css("width", "");
		});
	}

	testButtonOrder("Buttons should be in the same order if the first one is not moveable", {
		firstButton : {
			width : "150px",
			layoutData : new BarOverflowLayoutData({
				moveToOverflow : false
			})
		},
		secondButton : {
			width : "100px"
		},
		thirdButton : {
			width : "100px"
		}
	});

	testButtonOrder("Buttons should be in the same order if the second one is not moveable", {
		firstButton : {
			width : "150px"
		},
		secondButton : {
			width : "100px",
			layoutData : new BarOverflowLayoutData({
				moveToOverflow : false
			})
		},
		thirdButton : {
			width : "100px"
		}
	});

	testButtonOrder("Buttons should be in the same order if the third one is not moveable", {
		firstButton : {
			width : "150px"
		},
		secondButton : {
			width : "100px"
		},
		thirdButton : {
			width : "100px",
			layoutData : new BarOverflowLayoutData({
				moveToOverflow : false
			})
		}
	});

	QUnit.module("Button text modification");

	QUnit.test("Should move buttons to the action sheet if one gets bigger", function (assert) {
		// Arrange
		var oSmallButton = new Button({
			width : "100px"
		});
		var oGrowingButton = new Button({
			width : "100px"
		});
		jQuery("#qunit-fixture").css("width", "300px");

		var oBar = new Bar({
			contentRight : [ oGrowingButton, oSmallButton ]
		});
		var oActionSheet = new ActionSheet();
		var oResizeSpy = this.spy();

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeSpy);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oGrowingButton.setWidth("250px");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.ok(!oBarOverflow._iTimeout, "Async resize handler not yet registered");
		oBarOverflow.buttonTextChanged();
		assert.ok(oBarOverflow._iTimeout, "Async resize handler registered");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});

	QUnit.module("Non button controls");

	QUnit.test("Should not move a Slider to the ActionSheet", function (assert) {
		// Arrange
		var oSlider = new Slider({
			width : "300px"
		});
		var oOverflowingSelect = new Select({
			width : "100px"
		});
		jQuery("#qunit-fixture").css("width", "50px");

		var oBar = new Bar({
			contentRight : [ oSlider, oOverflowingSelect ]
		});
		var oActionSheet = new ActionSheet();
		var oResizeSpy = this.spy();

		// System under Test
		var oBarOverflow = new BarOverflow(oBar, oActionSheet, oResizeSpy);

		// Act
		oBar.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Assert
		assert.strictEqual(oResizeSpy.callCount, 1, "Did call resize");
		assert.strictEqual(oResizeSpy.firstCall.args.length, 1, "Only contained one control");
		assert.strictEqual(oResizeSpy.firstCall.args[0][0].sId, oOverflowingSelect.sId,
			"The select was moved");

		// Cleanup
		oActionSheet.destroy();
		oBar.destroy();
		oBarOverflow.destroy();
		jQuery("#qunit-fixture").css("width", "");
	});
});
