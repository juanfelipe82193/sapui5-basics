jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
sap.ui.getCore().loadLibrary('sap.m');
(function() {
	"use strict";
	var aTextObjects = [ {
		TextElement : "12345678",
		TextElementDescription : "TIME"
	}, {
		TextElement : "87654321",
		TextElementDescription : "CUSTOMER"
	} ];
	var oTextPoolStub = {
		getTextsByTypeAndLength : sinon.stub().returns(aTextObjects)
	};
	QUnit.module("Text Pool Helper - Unit Test", {
		beforeEach : function() {
			this.oTextPoolStub = oTextPoolStub;
			this.oTextPoolHelper = new sap.apf.modeler.ui.utils.TextPoolHelper(this.oTextPoolStub);
		},
		afterEach : function() {
			return;
		}
	});
//	QUnit.test("setAutoCompleteOn Test", function(assert) {
//		var oInputControl = new sap.m.Input();
//		var oTranslationFormat = {
//			TextElementType : "XTIT",
//			MaximumLength : 60
//		};
//		var oDependenciesForText = {
//			oTranslationFormat : oTranslationFormat,
//			type : "text"
//		};
//		this.oTextPoolHelper.setAutoCompleteOn(oInputControl, oDependenciesForText);
//		assert.ok(oInputControl.getShowSuggestion(), "showSuggestion property on input control is set to true.");
//		var aExpectedArgs = [ "XTIT", 60 ];
//		var aActualArgs = this.oTextPoolStub.getTextsByTypeAndLength.args[0];
//		assert.equal(JSON.stringify(aExpectedArgs), JSON.stringify(aActualArgs), "TextPool API invoked with correct arguments.");
//		var aExpectedData = aTextObjects;
//		var aActualData = oInputControl.getModel().getData().suggestions;
//		assert.equal(aExpectedData[0].TextElementDescription, aActualData[0].suggetionText, "Input control is bound with appropriate data.");
//		assert.equal(aExpectedData[1].TextElementDescription, aActualData[1].suggetionText, "Input control is bound with appropriate data.");
//	});
}());