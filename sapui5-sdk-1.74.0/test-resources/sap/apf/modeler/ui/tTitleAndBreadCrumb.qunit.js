sap.ui.define("sap.apf.modeler.ui.tTitleAndBreadCrumb.qunit", [

], function() {
	'use strict';
	var oTitleBreadCrumbView;
	QUnit.module('Title and Breadcrumb Unit Tests', {
		beforeEach : function(assert) {
			oTitleBreadCrumbView = sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.titleBreadCrumb",
				type : sap.ui.core.mvc.ViewType.XML
			});
		},
		afterEach : function() {
			oTitleBreadCrumbView.destroy();
		}
	});
	QUnit.test("When titleBreadCrumb view and controller loaded", function(assert) {
		assert.ok(oTitleBreadCrumbView, "then, TitleBreadCrumb view is Available");
		assert.strictEqual(typeof oTitleBreadCrumbView.getController, "function", "then, TitleBreadCrumb controller is available");
		assert.strictEqual(typeof oTitleBreadCrumbView.getController().setTitleForDetailPage, "function", "then, setTitleAndBreadCrumb function available in TitleBreadCrumb controller");
		assert.ok(oTitleBreadCrumbView.byId("IdBreadCrumb"), "then, Control for holding Breadcrumb available on UI");
		assert.ok(oTitleBreadCrumbView.byId("IdFormTitle"), "then, Control for holding form title available on UI");
	});
	QUnit.test("When setTitleAndBreadCrumb function sets the title of TitleBreadCrumb", function(assert) {
		oTitleBreadCrumbView.getController().setTitleForDetailPage("Test Title", "Test BreadCrumb");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(oTitleBreadCrumbView.byId("IdFormTitle").getText(), "Test Title", "then, Title set correctly to the detail page form");
	});
});