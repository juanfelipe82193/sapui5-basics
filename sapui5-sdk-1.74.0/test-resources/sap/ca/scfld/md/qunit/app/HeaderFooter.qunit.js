/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright
        2009-2014 SAP SE. All rights reserved
    
 */
sap.ui.define([
	"sap/ca/scfld/md/app/DetailHeaderFooterHelper",
	"sap/m/Page"
], function (DetailHeaderFooterHelper, Page) {
	"use strict";
	/*global QUnit */
	var sDefaultLanguage = sap.ui.getCore().getConfiguration().getLanguage();

	QUnit.module("Detail header footer helper", {
		setup: function () {
			sap.ui.getCore().getConfiguration().setLanguage("en-US");
		},
		teardown: function () {
			sap.ui.getCore().getConfiguration().setLanguage(sDefaultLanguage);
		}
	});

	function stubUI (oOptions) {
		oOptions = oOptions || {};

		var oPage = new Page();
		var oView = stubView(oPage);

		sap.ui.controller("myView", {
			getHeaderFooterOptions : function () {
				return oOptions;
			},
			getPage : function () {
				return oPage
			},
			isMainScreen : function () {
				return true;
			}

		});

		return {
			controller : oView.getController(),
			view : oView,
			page : oPage
		};
	}

	function stubView (oPage) {
		sap.ui.jsview("myView", {
			createContent : function() {
				return oPage;
			},
			getController : function() {
				return sap.ui.controller("myView");
			}
		});

		return sap.ui.jsview("viewId", "myView");
	}

	function stubApplicationImpl () {
		var oResourceBundle = {
				getText : function () { return "foo"; }
			},
			oUilibI18nModel = {
				getResourceBundle : function () {
					return oResourceBundle;
				}
			};

		return {
			UilibI18nModel: oUilibI18nModel,
			oCurController : {},
			registerExitModule : this.stub(),
			getResourceBundle : function () {
				return oResourceBundle;
			}
		}
	}

	QUnit.test("Should create the share button in the footer if no options are passed",
			function (assert) {
		// Arrange
		var oUI = stubUI({});

		// System under Test
		var oHeaderFooterHelper = new DetailHeaderFooterHelper(stubApplicationImpl.call(this));

		// Act
		oHeaderFooterHelper.defineDetailHeaderFooter(oUI.controller);

		// Assert
		assert.strictEqual(oUI.page.getFooter().getContentRight().length, 2, "Did create two buttons");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[0].getIcon(), "sap-icon://overflow", "Did set the overflow icon");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[1].getIcon(), "sap-icon://action", "Did set the share icon");
		assert.strictEqual(oUI.controller._oControlStore.oShareSheet.getButtons().length, 1, "did add the save button to the action sheet");
		assert.strictEqual(oUI.controller._oControlStore.oShareSheet.getButtons()[0].getText(), "Save as Tile", "did add the save button to the action sheet");

		// Cleanup
		oUI.view.destroy();
	});

	QUnit.test("Should add some text buttons", function (assert) {
		// Arrange
		var oUI = stubUI({
			buttonList : [{
				sBtnTxt : "ADDITIONAL_BTN1"
			},
			{
				sBtnTxt : "ADDITIONAL_BTN2"
			}]
		});

		// System under Test
		var oHeaderFooterHelper = new DetailHeaderFooterHelper(stubApplicationImpl.call(this));

		// Act
		oHeaderFooterHelper.defineDetailHeaderFooter(oUI.controller);

		// Assert
		assert.strictEqual(oUI.page.getFooter().getContentRight().length, 4, "Did create the buttons");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[0].getText(), "ADDITIONAL_BTN1", "Did add the first button");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[1].getText(), "ADDITIONAL_BTN2", "Did add the second button");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[2].getIcon(), "sap-icon://overflow", "Did set the overflow icon");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[3].getIcon(), "sap-icon://action", "Did set the share icon");

		// Cleanup
		oUI.view.destroy();
	});

	QUnit.test("Should change a button text", function (assert) {
		// Arrange
		var oUI = stubUI({
			buttonList : [{
				sId : "foo",
				sBtnTxt : "ADDITIONAL_BTN1"
			},
			{
				sBtnTxt : "ADDITIONAL_BTN2"
			}]
		});

		// System under Test
		var oHeaderFooterHelper = new DetailHeaderFooterHelper(stubApplicationImpl.call(this));
		oHeaderFooterHelper.defineDetailHeaderFooter(oUI.controller);

		// Act
		oUI.controller._oControlStore.oButtonListHelper.setBtnText("foo", "bar");

		// Assert
		assert.strictEqual(oUI.page.getFooter().getContentRight().length, 4, "Did create all buttons");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[0].getText(), "bar", "Did change the button text");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[1].getText(), "ADDITIONAL_BTN2", "Did add the second button");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[2].getIcon(), "sap-icon://overflow", "Did set the overflow icon");
		assert.strictEqual(oUI.page.getFooter().getContentRight()[3].getIcon(), "sap-icon://action", "Did set the share icon");

		// Cleanup
		oUI.view.destroy();
	});
});