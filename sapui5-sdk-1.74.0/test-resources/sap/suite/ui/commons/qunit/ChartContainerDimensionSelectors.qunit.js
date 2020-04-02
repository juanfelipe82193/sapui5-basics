sap.ui.define([
	"sap/suite/ui/commons/ChartContainer",
	"sap/m/Select"
], function(ChartContainer, Select) {
	"use strict";

	QUnit.module("Overwritten functions for DimensionSelector aggregation", {
		beforeEach : function() {
			this.oChartContainer = new ChartContainer();
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			this.oSelect1 = new Select();
			this.oSelect2 = new Select();
			this.oSelect3 = new Select();
		},
		afterEach : function() {
			this.oSelect1 = null;
			this.oSelect2 = null;
			this.oSelect3 = null;
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("Call to ChartContainer addAggregation with dimensionSelectors argument should result in call of addDimensionSelector function", function(assert) {
		//Arrange
		var oSpy = sinon.spy(this.oChartContainer, "addDimensionSelector");
		//Act
		var oReturnVal = this.oChartContainer.addAggregation("dimensionSelectors", this.oSelect1);
		//Assert
		assert.ok(oSpy.calledOnce, "The function addDimensionSelector has been called.");
		assert.equal(oReturnVal, this.oChartContainer, "The function addDimensionSelector returns a reference to the instance of ChartContainer.");
	});

	QUnit.test("Call to ChartContainer getAggregation with dimensionSelectors argument should result in call of getDimensionSelectors function", function(assert) {
		//Arrange
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		var oSpy = sinon.spy(this.oChartContainer, "getDimensionSelectors");
		//Act
		this.oChartContainer.getAggregation("dimensionSelectors", this.oSelect1);
		//Assert
		assert.ok(oSpy.calledOnce, "The function getDimensionSelectors has been called.");
	});

	QUnit.test("Call to ChartContainer indexOfAggregation with dimensionSelectors argument should result in call of indexOfDimensionSelector function", function(assert) {
		//Arrange
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		var oSpy = sinon.spy(this.oChartContainer, "indexOfDimensionSelector");
		//Act
		this.oChartContainer.indexOfAggregation("dimensionSelectors", this.oSelect1);
		//Assert
		assert.ok(oSpy.calledOnce, "The function indexOfDimensionSelector has been called.");
	});

	QUnit.test("Call to ChartContainer insertAggregation with dimensionSelectors argument should result in call of insertDimensionSelector function", function(assert) {
		//Arrange
		var oSpy = sinon.spy(this.oChartContainer, "insertDimensionSelector");
		//Act
		var oReturnVal = this.oChartContainer.insertAggregation("dimensionSelectors", this.oSelect1, 0);
		//Assert
		assert.ok(oSpy.calledOnce, "The function insertDimensionSelector has been called.");
		assert.equal(oReturnVal, this.oChartContainer, "The function insertDimensionSelector returns a reference to the instance of ChartContainer.");
	});

	QUnit.test("Call to ChartContainer destroyAggregation with dimensionSelectors argument should result in call of destroyDimensionSelectors function", function(assert) {
		//Arrange
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer._adjustSelectorDisplay();
		var oSpy = sinon.spy(this.oChartContainer, "destroyDimensionSelectors");
		//Act
		var oReturnVal = this.oChartContainer.destroyAggregation("dimensionSelectors");
		//Assert
		assert.ok(oSpy.calledOnce, "The function destroyDimensionSelectors has been called.");
		assert.equal(oReturnVal, this.oChartContainer, "The function destroyDimensionSelectors returns a reference to the instance of ChartContainer.");
	});

	QUnit.test("Call to ChartContainer removeAggregation with dimensionSelectors argument should result in call of removeDimensionSelector function", function(assert) {
		//Arrange
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer._adjustSelectorDisplay();
		var oSpy = sinon.spy(this.oChartContainer, "removeDimensionSelector");
		//Act
		var oReturnVal = this.oChartContainer.removeAggregation("dimensionSelectors", this.oSelect1);
		//Assert
		assert.ok(oSpy.calledOnce, "The function removeDimensionSelector has been called.");
		assert.equal(oReturnVal, this.oSelect1, "The function removeDimensionSelector returns a reference to the instance of removed object.");
	});

	QUnit.test("Call to ChartContainer removeAllAggregation with dimensionSelectors argument should result in call of removeAllDimensionSelectors function", function(assert) {
		//Arrange
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer._adjustSelectorDisplay();
		var oSpy = sinon.spy(this.oChartContainer, "removeAllDimensionSelectors");
		//Act
		var oReturnVal = this.oChartContainer.removeAllAggregation("dimensionSelectors");
		//Assert
		assert.ok(oSpy.calledOnce, "The function removeAllDimensionSelectors has been called.");
		assert.equal(oReturnVal[0], this.oSelect1, "The function removeAllDimensionSelectors returns a reference to an array of removed objects.");
	});

	QUnit.test("ChartContainer addDimensionSelector is properly using overwritten function of ManagedObject", function(assert) {
		//Act
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer.addAggregation("dimensionSelectors", this.oSelect2);
		//Assert
		assert.strictEqual(this.oChartContainer.getDimensionSelectors().length, 2, "ChartContainer has 2 dimension selectors");
		assert.strictEqual(this.oChartContainer.getAggregation("dimensionSelectors").length, 2, "ChartContainer returns 2 dimension selectors also if called via getAggregation");
	});

	QUnit.test("ChartContainer destroyDimensionSelectors is properly using overwritten function of ManagedObject", function(assert) {
		//Arrange
		var sSelectorId = this.oSelect1.getId();
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer._adjustSelectorDisplay();
		var iToolbarContentSizeBeforeDestroy = this.oChartContainer._oToolBar.getContent().length;
		//Act
		this.oChartContainer.destroyDimensionSelectors();
		//Assert
		assert.strictEqual(this.oChartContainer.getDimensionSelectors().length, 0, "Dimension selectors aggregation has been removed");
		assert.notOk(sap.ui.getCore().byId(sSelectorId), "The Selector control has been destroyed");
		assert.strictEqual(this.oChartContainer._oToolBar.getContent().length, iToolbarContentSizeBeforeDestroy - 1, "Dimension selector has been removed from toolbar as well");
	});

	QUnit.test("ChartContainer removeDimensionSelector is properly using overwritten function of ManagedObject", function(assert) {
		//Arrange
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer.addDimensionSelector(this.oSelect2);
		this.oChartContainer._adjustSelectorDisplay();
		//Act
		var oRemovedSelector = this.oChartContainer.removeDimensionSelector(this.oSelect1);
		//Assert
		assert.strictEqual(this.oChartContainer.getDimensionSelectors().length, 1, "Dimension selectors has been properly removed from the ChartContainer");
		assert.strictEqual(this.oSelect1, oRemovedSelector, "Correct selector has been returned from the removeAggregation");
		assert.strictEqual(this.oChartContainer._oToolBar.indexOfContent(this.oSelect1), -1, "Dimension selector has been deleted from aggregation of ToolBar");
	});

	QUnit.test("ChartContainer removeAllDimensionSelectors is properly using overwritten function of ManagedObject", function(assert) {
		//Arrange
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer.addDimensionSelector(this.oSelect2);
		this.oChartContainer._adjustSelectorDisplay();
		sap.ui.getCore().applyChanges();
		//Act
		var aRemovedSelectors = this.oChartContainer.removeAllDimensionSelectors();
		//Assert
		assert.strictEqual(this.oChartContainer.getDimensionSelectors().length, 0, "Dimension selectors aggregation has been removed from the ChartContainer");
		assert.strictEqual(aRemovedSelectors.length, 2, "Dimension selectors aggregation has been removed from the ChartContainer");
		assert.strictEqual(this.oSelect1, aRemovedSelectors[0], "Correct selector has been returned from the removeAggregation is correct");
		assert.strictEqual(this.oChartContainer._oToolBar.indexOfContent(this.oSelect1), -1, "Dimension selector has been deleted from aggregation of ToolBar");
		assert.strictEqual(this.oChartContainer._oToolBar.indexOfContent(this.oSelect2), -1, "Dimension selector has been deleted from aggregation of ToolBar");
	});

	QUnit.test("ChartContainer insertDimensionSelector is properly using overwritten function of ManagedObject", function(assert) {
		//Arrange
		var sSelectorId = this.oSelect3.getId();
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer.addDimensionSelector(this.oSelect2);
		//Act
		this.oChartContainer.insertDimensionSelector(this.oSelect3, 1);
		//Assert
		assert.strictEqual(this.oChartContainer.getDimensionSelectors()[1].getId(), sSelectorId, "The control has been inserted on correct place");
	});

	QUnit.test("ChartContainer indexOfDimensionSelector is properly using overwritten function of ManagedObject", function(assert) {
		//Arrange
		this.oChartContainer.addDimensionSelector(this.oSelect1);
		this.oChartContainer.addDimensionSelector(this.oSelect2);
		this.oChartContainer.addDimensionSelector(this.oSelect3);
		//Act
		var iIndexOfSelector = this.oChartContainer.indexOfDimensionSelector(this.oSelect3);
		//Assert
		assert.strictEqual(iIndexOfSelector, 2, "Correct index of DimensionSelector has been returned");
	});

});
