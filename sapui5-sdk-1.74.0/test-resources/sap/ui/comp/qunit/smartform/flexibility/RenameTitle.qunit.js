/*globals QUnit*/
sap.ui.define([
	"sap/ui/comp/smartform/flexibility/changes/RenameTitle",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/fl/Change",
	"sap/ui/core/util/reflection/JsControlTreeModifier",
	"sap/ui/core/util/reflection/XmlTreeModifier"

], function (RenameTitleChangeHandler, SmartForm, GroupElement, ChangeWrapper, JsControlTreeModifier, XmlTreeModifier) {
	"use strict";

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RenameTitle with text title property in change content", {
		beforeEach: function () {
			this.oChangeHandler = RenameTitleChangeHandler;
			this.sNewValue = "new title";
			this.oSmartForm = new SmartForm({
				id : "Smartform",
				title :  "old value"
			});

			var mTitleChange = {
					selector : {
					id : "testkey"
				},
				texts : {
					fieldLabel : {
						value : this.sNewValue
					}
				}
			};
			this.oTitleChange = new ChangeWrapper(mTitleChange);

			var oDOMParser = new DOMParser();
			this.oXmlDocument = oDOMParser.parseFromString("<view id='view'><SmartForm xmlns='sap.ui.comp.smartform' id='form' title='OLD_VALUE' /><GroupElement id='GroupElement' label='OLD_VALUE' /></view>", "application/xml");
			this.oXmlSmartForm = this.oXmlDocument.childNodes[0].childNodes[0];
			this.oXmlGroupElement = this.oXmlDocument.childNodes[0].childNodes[1];
		},

		afterEach: function () {
			this.oSmartForm.destroy();
		}

	});

	QUnit.test("applyChanges with JsControlTreeModifier", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oTitleChange, this.oSmartForm, {modifier: JsControlTreeModifier}));

		assert.equal(this.oSmartForm.getTitle(), this.sNewValue);
	});

	QUnit.test("applyChanges with XmlTreeModifier", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oTitleChange, this.oXmlSmartForm, {modifier: XmlTreeModifier, view: this.oXmlDocument}));

		assert.equal(this.oXmlSmartForm.getAttribute("title"), this.sNewValue);
	});

	QUnit.module("sap.ui.comp.smartform.flexibility.changes.RenameTitle with binding property in change content", {
		beforeEach: function () {
			this.oChangeHandler = RenameTitleChangeHandler;
			this.sNewValue = "{i18n>textKey}";
			this.oSmartForm = new SmartForm({
				id : "Smartform",
				title : "old value"
			});

			var mTitleChange = {
					selector : {
					id : "testkey"
				},
				texts : {
					fieldLabel : {
						value : this.sNewValue
					}
				}
			};
			this.oTitleChange = new ChangeWrapper(mTitleChange);

			var oDOMParser = new DOMParser();
			this.oXmlDocument = oDOMParser.parseFromString("<view id='view'><SmartForm xmlns='sap.ui.comp.smartform' id='form' title='OLD_VALUE' /><GroupElement id='GroupElement' label='OLD_VALUE' /></view>", "application/xml");
			this.oXmlSmartForm = this.oXmlDocument.childNodes[0].childNodes[0];
			this.oXmlGroupElement = this.oXmlDocument.childNodes[0].childNodes[1];
		},

		afterEach: function () {
			this.oSmartForm.destroy();
		}

	});


	QUnit.test("applyChanges with JsControlTreeModifier", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oTitleChange, this.oSmartForm, {modifier: JsControlTreeModifier}));

		var oBindingInfo = this.oSmartForm.getBindingInfo("title");

		assert.equal(oBindingInfo.parts[0].path, "textKey", "property value binding path has changed as expected");
		assert.equal(oBindingInfo.parts[0].model, "i18n", "property value binding model has changed as expected");
	});

	QUnit.test("applyChanges with XmlTreeModifier", function (assert) {
		//Call CUT
		assert.ok(this.oChangeHandler.applyChange(this.oTitleChange, this.oXmlSmartForm, {modifier: XmlTreeModifier, view: this.oXmlDocument}));

		assert.equal(this.oXmlSmartForm.getAttribute("title"), this.sNewValue);
	});
});