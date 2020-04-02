/* globals QUnit */

sap.ui.define([
	"sap/ui/core/Control", "sap/ui/layout/HorizontalLayout", "sap/ui/comp/filterbar/FilterItem"
], function(Control, HorizontalLayout, FilterItem) {
	"use strict";

	QUnit.module("sap.ui.comp.filterbar.FilterItem", {
		beforeEach: function() {
			this.oFilterItem = new FilterItem();
		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oFilterItem);
	});

	QUnit.test("Checking the properties", function(assert) {
		var oCtrl = new Control();
		this.oFilterItem.setControl(oCtrl);
		this.oFilterItem.setName("NAME");
		this.oFilterItem.setLabel("LABEL");
		this.oFilterItem.setLabelTooltip("Tooltip");
		this.oFilterItem.setControlTooltip("Control Tooltip");
		this.oFilterItem.setVisibleInFilterBar(true);
		this.oFilterItem.setPartOfCurrentVariant(true);

		this.oFilterItem.setMandatory(true);
		this.oFilterItem.setVisible(false);

		assert.equal(this.oFilterItem.getControl(), oCtrl, "not the expected oCtrl instance");
		assert.strictEqual(this.oFilterItem.getName(), "NAME", "not the expected name");
		assert.strictEqual(this.oFilterItem.getLabel(), "LABEL", "not the expected label");
		assert.strictEqual(this.oFilterItem.getLabelTooltip(), "Tooltip", "not the expected label tooltip");
		assert.strictEqual(this.oFilterItem.getControlTooltip(), "Control Tooltip", "not the expected control tooltip");
		assert.strictEqual(this.oFilterItem.getMandatory(), true, "not the expected mandatory flag");
		assert.strictEqual(this.oFilterItem.getVisible(), false, "not the expected visibility flag");

		assert.strictEqual(this.oFilterItem.getVisibleInFilterBar(), true, "not the expected 'visibleInFilterBar' flag");
		assert.strictEqual(this.oFilterItem.getPartOfCurrentVariant(), true, "not the expected 'partOfCurrentVariant' flag");

		var oLabel = this.oFilterItem.getLabelControl();
		assert.ok(oLabel, "label control expected");
		assert.strictEqual(oLabel.getText(), "LABEL", "not the expected label on control");
		assert.strictEqual(oLabel.getTooltip(), "Tooltip", "not the expected tooltip on control");

	});

	QUnit.test("Shall fire an event when the visible property has changed", function(assert) {
		var fEventHandler, sPropertyName;
		fEventHandler = function(oEvent) {
			sPropertyName = oEvent.getParameter("propertyName");
		};
		this.oFilterItem.attachChange(fEventHandler);

		// Call CUT
		this.oFilterItem.setVisible(false);

		assert.equal(sPropertyName, "visible");
	});

	QUnit.test("Shall fire an event when the visibleInFilterBar property has changed", function(assert) {
		var fEventHandler, sPropertyName;
		fEventHandler = function(oEvent) {
			sPropertyName = oEvent.getParameter("propertyName");
		};
		this.oFilterItem.attachChange(fEventHandler);

		// Call CUT
		this.oFilterItem.setVisibleInFilterBar(false);

		assert.equal(sPropertyName, "visibleInFilterBar");
	});

	QUnit.test("Shall return label control", function(assert) {
		assert.ok(this.oFilterItem.getLabelControl());
	});

	QUnit.test("Checking hiddenFilter property", function(assert) {
		assert.ok(!this.oFilterItem.getHiddenFilter());

		this.oFilterItem.setHiddenFilter(true);
		assert.ok(this.oFilterItem.getHiddenFilter());
	});

	QUnit.test("Shall fire an event when the partOfCurrentVariant property has changed", function(assert) {
		var fEventHandler, sPropertyName;
		fEventHandler = function(oEvent) {
			sPropertyName = oEvent.getParameter("propertyName");
		};
		this.oFilterItem.attachChange(fEventHandler);

		// Call CUT
		this.oFilterItem.setPartOfCurrentVariant(false);

		assert.equal(sPropertyName, "partOfCurrentVariant");
	});

	QUnit.test("Check set/get symmetry for control aggregation", function(assert) {
		var oCtrl = new Control();
		this.oFilterItem.setControl(oCtrl);

		assert.equal(oCtrl, this.oFilterItem.getControl());
		assert.equal(oCtrl, this.oFilterItem.getAggregation("control"));

		var oHL = new HorizontalLayout();
		oHL.addContent(oCtrl);

		assert.equal(oCtrl, this.oFilterItem.getControl());
		assert.equal(null, this.oFilterItem.getAggregation("control"));
	});
	QUnit.start();
});
