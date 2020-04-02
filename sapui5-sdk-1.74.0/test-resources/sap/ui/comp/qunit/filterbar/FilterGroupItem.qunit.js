/*globals QUnit*/

sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/comp/filterbar/FilterGroupItem"
], function (Control, FilterGroupItem) {
	"use strict";

	QUnit.module("sap.ui.comp.filterbar.FilterGroupItem", {
		beforeEach: function () {
			this.oFilterGroupItem = new FilterGroupItem();
		},
		afterEach: function () {
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(this.oFilterGroupItem);
	});

	QUnit.test("Shall fire an event when the visible/groupTitle/visibleInAdvancedArea properties has changed", function (assert) {
		var fEventHandler, sPropertyName;
		fEventHandler = function (oEvent) {
			sPropertyName = oEvent.getParameter("propertyName");
		};
		this.oFilterGroupItem.attachChange(fEventHandler);

		//Call CUT
		this.oFilterGroupItem.setVisible(false);
		assert.equal(sPropertyName, "visible");

		this.oFilterGroupItem.setGroupTitle("Title");
		assert.equal(sPropertyName, "groupTitle");

		this.oFilterGroupItem.setVisibleInAdvancedArea(true);
		assert.equal(sPropertyName, "visibleInFilterBar");

		this.oFilterGroupItem.setVisibleInFilterBar(true);
		assert.equal(sPropertyName, "visibleInFilterBar");
	});

	QUnit.test("checking the label handling", function (assert) {
		this.oFilterGroupItem.setLabel("LABEL");

		var oLabel = this.oFilterGroupItem.getLabelControl();
		assert.ok(oLabel, "label control expected");
		assert.strictEqual(oLabel.getText(), "LABEL", "expected label 'LABEL'");
		assert.strictEqual(oLabel.getTooltip(), "LABEL", "default tooltip expected");

		this.oFilterGroupItem.setLabel("LABEL2");
		this.oFilterGroupItem.setLabelTooltip("Tooltip");
		assert.strictEqual(oLabel.getText(), "LABEL2", "not the expected label 'LABEL2'");
		assert.strictEqual(oLabel.getTooltip(), "Tooltip", "not the expected tooltip 'Tooltip'");
	});


	QUnit.test("Checking the properties", function (assert) {
		var oCtrl = new Control();

		this.oFilterGroupItem.setGroupName("NAME");
		this.oFilterGroupItem.setGroupTitle("TITLE");

		this.oFilterGroupItem.setControl(oCtrl);
		this.oFilterGroupItem.setName("ITEM");
		this.oFilterGroupItem.setLabel("LABEL");

		assert.equal(this.oFilterGroupItem.getGroupName(), "NAME", "not the expected group name");
		assert.equal(this.oFilterGroupItem.getGroupTitle(), "TITLE", "not the expected group title");
		assert.equal(this.oFilterGroupItem.getControl(), oCtrl, "not the expected oCtrl instance");
		assert.equal(this.oFilterGroupItem.getName(), "ITEM", "not the expected item name");
		assert.equal(this.oFilterGroupItem.getLabel(), "LABEL", "not the expected item label");
	});
	QUnit.start();
});

