sap.ui.define([
	"sap/suite/ui/generic/template/lib/ShareUtils",
	"sap/ui/model/json/JSONModel",
	"sap/base/util/ObjectPath"
], function(ShareUtils, JSONModel, ObjectPath) {
	"use strict";
	QUnit.module("The static function setStaticShareData");

	QUnit.test("Updates model properties", function(assert) {
		// Arrange
		var oShareModel = {
			setProperty: sinon.stub()
		};
		var oResourceBundle = {
			getText: sinon.stub().returns("DUMMY")
		};
		sinon.stub(sap.ui.getCore(), "getLibraryResourceBundle").returns(oResourceBundle);

		// Act
		ShareUtils.setStaticShareData(null, oShareModel);

		// Assert
		assert.strictEqual(oShareModel.setProperty.callCount, 3, "The function setProperty has been called thrice.");
		assert.ok(oShareModel.setProperty.calledWith("/emailButtonText", "DUMMY"), "The property emailButtonText has been set.");
		assert.ok(oShareModel.setProperty.calledWith("/jamButtonText", "DUMMY"), "The property jamButtonText has been set.");
		assert.ok(oShareModel.setProperty.calledWith("/jamVisible", false), "The property jamVisible has been set.");

		// Cleanup
		sap.ui.getCore().getLibraryResourceBundle.restore();
	});

	QUnit.test("Sets the jamVisible property if the ushell.getUser function exists", function(assert) {
		//A rrange
		var oShareModel = {
			setProperty: sinon.stub()
		};
		var oResourceBundle = {
			getText: Function.prototype
		};
		var fnGetUser = sinon.stub().returns({
			isJamActive: function() {
				return true;
			}
		});
		sinon.stub(sap.ui.getCore(), "getLibraryResourceBundle").returns(oResourceBundle);

		var fnObjectPathGetStub = sinon.stub(ObjectPath, "get").returns(fnGetUser);

		// Act
		ShareUtils.setStaticShareData(null, oShareModel);

		// Assert
		assert.ok(oShareModel.setProperty.calledWith("/jamVisible", true), "The property jamVisible has been set.");

		// Cleanup
		sap.ui.getCore().getLibraryResourceBundle.restore();
		fnObjectPathGetStub.restore();
	});

	QUnit.module("The static function onShareJamPressed");

	QUnit.test("Creates a share dialog and opens it", function(assert) {
		// Arrange
		var oOpenStub = sinon.stub();
		var oStub = sinon.stub(sap.ui.getCore(), "createComponent").returns({
			open: oOpenStub
		});

		// Act
		ShareUtils.openJamShareDialog("SELL_YOUR_CAT");

		// Assert
		assert.strictEqual(oStub.callCount, 1, "The function createComponent has been called once.");

		var oSettings = oStub.firstCall.args[0];
		assert.strictEqual(oSettings.name, "sap.collaboration.components.fiori.sharing.dialog", "The correct fragment name has been passed.");
		assert.strictEqual(oSettings.settings.object.share, "SELL_YOUR_CAT", "The correct fragment share text has been passed.");

		assert.strictEqual(oOpenStub.callCount, 1, "The open function of the component has been called once.");

		// Cleanup
		oStub.restore();
	});

	QUnit.asyncTest("Creates a share dialog and opens it - cFLP senario", function(assert) {
		// Arrange
		var oUshell = sap.ushell;
		sap.ushell = {
			Container: {
				runningInIframe: sinon.stub().returns(true),
				getFLPUrl: sinon.stub().returns(new jQuery.Deferred().resolve("www.cFlp.com").promise())
			}
		};

		var oStub = sinon.stub(sap.ui.getCore(), "createComponent").returns({
			open: function() {
				// Assert
				assert.strictEqual(oStub.callCount, 1, "The function createComponent has been called once.");
				assert.strictEqual(sap.ushell.Container.runningInIframe.callCount, 1, "The function createComponent has been called once.");
				assert.strictEqual(sap.ushell.Container.getFLPUrl.callCount, 1, "The function createComponent has been called once.");

				var oSettings = oStub.firstCall.args[0];
				assert.strictEqual(oSettings.name, "sap.collaboration.components.fiori.sharing.dialog", "The correct fragment name has been passed.");
				assert.strictEqual(oSettings.settings.object.id, "www.cFlp.com", "The correct fragment url has been passed.");
				assert.strictEqual(oSettings.settings.object.share, "SELL_YOUR_CAT", "The correct fragment share text has been passed.");

				// Cleanup
				oStub.restore();
				sap.ushell = oUshell;
				start();
			}
		});

		// Act
		ShareUtils.openJamShareDialog("SELL_YOUR_CAT");
	});

	QUnit.module("The static function openSharePopup", {
		beforeEach: function() {
			this.oModel = new JSONModel();
			this.oFragment = {
				openBy: sinon.stub(),
				getModel: sinon.stub().returns(this.oModel)
			};
			this.oFragmentController = {
				getModelData: function() {}
			};
			this.oGetFragmentStub = sinon.stub().returns(this.oFragment);

			this.oCommonUtils = {
				getDialogFragment: this.oGetFragmentStub
			};
		},
		afterEach: function() {
			this.oModel.destroy();

			this.oGetFragmentStub = null;
			this.oFragment = null;
			this.oModel = null;
			this.oFragmentController = null;
		}
	});

	QUnit.test("Returns the ShareSheet fragment", function(assert) {
		// Arrange
		// Act
		var oResult = ShareUtils.openSharePopup(this.oCommonUtils, null, this.oFragmentController);

		// Assert
		assert.strictEqual(oResult, this.oFragment, "The fragment instance has been returned.");
	});

	QUnit.test("Extends the given fragment controller by the onCancelPressed function", function(assert) {
		// Arrange
		var oController = {
			getModelData: sinon.stub().returns({})
		};

		// Act
		var oPopup = ShareUtils.openSharePopup(this.oCommonUtils, null, oController);
		oPopup.close = sinon.spy();
		oController.onCancelPressed();

		// Assert
		assert.strictEqual(oPopup.close.callCount, 1, "The close function has been called once.");
	});

	QUnit.test("Calls the getDialogFragment function", function(assert) {
		// Arrange
		// Act
		ShareUtils.openSharePopup(this.oCommonUtils, null, this.oFragmentController);

		// Assert
		assert.strictEqual(this.oGetFragmentStub.firstCall.args[0], "sap.suite.ui.generic.template.fragments.ShareSheet", "The correct fragment name is passed.");
		assert.strictEqual(this.oGetFragmentStub.firstCall.args[1], this.oFragmentController, "The correct controller instance is passed.");
		assert.strictEqual(this.oGetFragmentStub.firstCall.args[2], "share", "The correct model name is passed.");
		assert.strictEqual(this.oGetFragmentStub.firstCall.args[3], ShareUtils.setStaticShareData, "The correct creation callback function is passed.");
	});

	QUnit.test("Uses the fragment controller's getModelData function for data merging", function(assert) {
		// Arrange
		var oSpy = sinon.stub(this.oFragmentController, "getModelData").returns({
			title: "custom"
		});

		// Act
		ShareUtils.openSharePopup(this.oCommonUtils, null, this.oFragmentController);

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "The function getModelData has been called once.");
		assert.strictEqual(this.oModel.getProperty("/title"), "custom", "The correct data has been written to the model.");
	});

	QUnit.test("Calls the fragment's openBy function", function(assert) {
		// Arrange
		var oBy = {};

		// Act
		ShareUtils.openSharePopup(this.oCommonUtils, oBy, this.oFragmentController);

		// Assert
		assert.strictEqual(this.oFragment.openBy.callCount, 1, "The function openBy has been called once.");
		assert.strictEqual(this.oFragment.openBy.firstCall.args[0], oBy, "The correct object instance has been passed to openBy.");
	});

	QUnit.test("The ShareUtils getCustomUrl function with hash", function(assert) {
		// Arrange
		var oOriginalHasher;
		if (window.hasher) {
			oOriginalHasher = window.hasher;
		}

		window.hasher = {
			getHash: sinon.stub().returns("SomeAppHash")
		};

		// Act
		var sResult = ShareUtils.getCustomUrl();

		// Assert
		assert.strictEqual(sResult, "#SomeAppHash", "The correct value has been returned.");

		// Cleanup
		window.hasher = oOriginalHasher;
	});

	QUnit.test("The ShareUtils getCustomUrl function without hash", function(assert) {
		// Arrange
		var oOriginalHasher;
		if (window.hasher) {
			oOriginalHasher = window.hasher;
		}

		window.hasher = {
			getHash: sinon.stub().returns("")
		};

		// Act
		var sResult = ShareUtils.getCustomUrl();

		// Assert
		assert.strictEqual(sResult, window.location.href, "The correct value has been returned.");

		// Cleanup
		window.hasher = oOriginalHasher;
	});

	// QUnit.start();
});
