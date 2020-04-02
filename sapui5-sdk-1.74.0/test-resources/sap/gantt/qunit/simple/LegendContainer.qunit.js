/*global QUnit, sinon*/
sap.ui.define([
	"sap/gantt/simple/LegendContainer",
	"sap/gantt/simple/ListLegend",
	"sap/ui/core/Core"
], function (LegendContainer, ListLegend, Core) {
	"use strict";

	function placeAt(oControl) {
		//Cover onBeforeRendering logic
		oControl.placeAt("qunit-fixture");
		Core.applyChanges();
	}

	QUnit.test("single legend", function(assert) {
		var oLegendContainer = new LegendContainer({
			legends: [new ListLegend("Empty")]
		});

		placeAt(oLegendContainer);
		var oNavContainer = oLegendContainer._oNavContainer;
		assert.strictEqual(oNavContainer.getPages().length, 1, "only 1 page is generated");
		assert.strictEqual(oNavContainer.getWidth(), "200px", "same width applied");
		assert.strictEqual(oNavContainer.getHeight(), "200px", "same height applied");
	});

	QUnit.module("Multiple sections", {
		beforeEach: function() {
			this.oLegendContainer = new LegendContainer({
				width : "900px",
				height : "1200px",
				legends: [
					new ListLegend({title: "First"}),
					new ListLegend({title: "Second"})
				]
			});
			placeAt(this.oLegendContainer);
		},
		afterEach: function() {
			this.oLegendContainer.destroy();
		}
	});

	QUnit.test("construtor", function (assert) {
		var oNavContainer = this.oLegendContainer._oNavContainer;
		assert.ok(oNavContainer instanceof sap.m.NavContainer, "NavContainer generated");
		assert.ok(this.oLegendContainer._sCurrentPageTitle == null, "no current page title at init");

		var aPages = oNavContainer.getPages();
		var aLegends = this.oLegendContainer.getLegends();

		assert.strictEqual(oNavContainer.getWidth(), this.oLegendContainer.getWidth(), "width is set to navigation container correctly");
		assert.strictEqual(oNavContainer.getHeight(), this.oLegendContainer.getHeight(), "width is set to navigation container correctly");
		assert.strictEqual(aPages.length, aLegends.length + 1, "initial page is created so 1 more page added to navigation container");
		assert.ok(aPages[0].getContent()[0].getItems().length == aLegends.length, "Initial page List Item generated");
	});

	QUnit.test("legend navigations", function(assert) {
		var oNavContainer = this.oLegendContainer._oNavContainer;
		var oInitialPage = oNavContainer.getPages()[0];
		var oList = oInitialPage.getContent()[0];

		assert.ok(oList != null, "initial page content is a List control");
		assert.strictEqual(oList.getItems().length, 2, "item in the list has same number of legend");

		var fnToSpy = sinon.spy(oNavContainer, "to");
		var fnBackToTop = sinon.spy(oNavContainer, "backToTop");
		var oFirstItem = oList.getItems()[0];
		var oFirstPage = oNavContainer.getPages()[1];
		oFirstItem.firePress();
		assert.ok(fnToSpy.calledOnce, "navigation to function is called");
		assert.equal(oFirstItem.getTitle(), "First", "First Legend list item is showing");
		assert.strictEqual(oFirstItem.getTitle(), oFirstPage.getTitle(), "The legend title matched");

		oFirstPage.fireNavButtonPress();
		assert.ok(fnBackToTop.calledOnce, "navigation back to intial page now");

		fnToSpy.restore();
		fnBackToTop.restore();
	});

	QUnit.test("Check page numbers", function(assert) {
		var oLC = this.oLegendContainer;
		oLC.rerender();

		var oNC = oLC._oNavContainer;
		var aLegends = oLC.getLegends(),
			aPages = oNC.getPages();
		assert.strictEqual(aPages.length, aLegends.length + 1, "call onBeforeRendering shouldn't create duplicate pages");

		// validate whether current page is restored
		var done = assert.async();
		oNC.to(aPages[1]);
		this.oLegendContainer._oNavContainer.attachAfterNavigate(function(){
			assert.strictEqual(oLC._sCurrentPageTitle, aPages[1].getTitle(), "sCurrent page title is set correctly");
			done();
		});
	});

	QUnit.module("manipulate legends aggregations");
	QUnit.test("addLegend", function(assert) {
		var oLC = new LegendContainer({
			legends: [new ListLegend({title: "First Legend"})]
		});

		assert.strictEqual(oLC._oNavContainer.getPages().length, 0, "no render no pages in NavContainer");

		oLC.addLegend(new ListLegend({title: "Second Legend"}));
		assert.strictEqual(oLC._oNavContainer.getPages().length, 0, "even you add legend aggregation to LegendContainer");

		placeAt(oLC);
		assert.strictEqual(oLC._oNavContainer.getPages().length, 3, "UI5 rendered, so total 3 pages created for NavContainer");

		oLC.removeLegend(oLC.getLegends().length - 1);
		oLC.invalidate();
		Core.applyChanges();
		assert.strictEqual(oLC._oNavContainer.getPages().length, 1, "trigger render, removeLegend take effects, and 1 legend only has 1 page");
	});

});
