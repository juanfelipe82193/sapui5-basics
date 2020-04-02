/**
 * tests for the sap.suite.ui.generic.template.changeHandler.MoveTableColumns
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/MoveTableColumns",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils"
],
function(MoveTableColumns, Utils) {
	"use strict";
	
	var sTypeOfTable;

	QUnit.module("MoveTableColumns revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = MoveTableColumns.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for MoveTableColumns action");
	});

	QUnit.module("MoveTabelColumns applychange Test Module", {
		beforeEach: function() {
			var aColumns = ["Column1", "Column2", "Column3", "Column4"];

			var aVisualizations = [{
				Content: aColumns
			}];

			var oTable = {
					isA: function(sTableType) {
						return sTypeOfTable === sTableType;
					},
					getParent: function() {
						return {
							getUiState: function() {
								return {
									getPresentationVariant: function() {
										return {
											Visualizations : aVisualizations
										}
									},
									setPresentationVariant: function(oPresentationVariant) {
										assert.equal(oPresentationVariant.Visualizations[0].Content[1],"Column3","The column is moved from source")
										assert.equal(oPresentationVariant.Visualizations[0].Content[2],"Column2", "Index is updated with correct column")
									}
									
								}
							},
							setUiState: function(oUIState) {
								assert.ok(oUIState, "setUiState is called");
							}
						}
					},
					getColumns: function() {
						return aColumns;
					},
					removeColumn: function(sColumn) {
						aColumns = aColumns.filter(function(sValue){
							return sValue != sColumn;
						});
					},
					insertColumn: function(sColumn, iSource) {
						aColumns.splice(iSource, 0, sColumn)
					}
					
			};
			this.oChange ={
					 getDependentControl: function(sTypeOfControl, mPropertyBag) {
						assert.equal(sTypeOfControl, "source", "Got table instance");
						return oTable;
					},
					getContent: function() {
						return {
							movedElements:[{
								sourceIndex: 2,
								targetIndex: 1
							}]
						}
					}
			}
			this.oGetColumnSpy =  sinon.spy(oTable, "getColumns");
			this.oRemoveColumnSpy = sinon.spy(oTable, "removeColumn");
			this.oInsertColumnSpy = sinon.spy(oTable, "insertColumn");
			this.oAdaptTableStructureStub = sinon.stub(Utils, "fnAdaptTableStructures").returns()
		},
		afterEach: function() {
			this.oGetColumnSpy.restore();
			this.oRemoveColumnSpy.restore();
			this.oInsertColumnSpy.restore();
			this.oAdaptTableStructureStub.restore();
		}
	});

	QUnit.test("ApplyChange of Responsive Table column", function(assert) {
		sTypeOfTable = "sap.m.Table"
		MoveTableColumns.applyChange(this.oChange);
		assert.equal(this.oGetColumnSpy.calledOnce && this.oRemoveColumnSpy.calledOnce && this.oInsertColumnSpy.calledOnce, true, "Reverted to changes done by flex , so that UI State can work.")
	});
	
	QUnit.test("ApplyChange of UI Table Column", function(assert) {
		sTypeOfTable = "sap.ui.tables.Table"
		MoveTableColumns.applyChange(this.oChange);
		assert.equal(this.oGetColumnSpy.calledOnce && this.oRemoveColumnSpy.calledOnce && this.oInsertColumnSpy.calledOnce, false, "Reverted to changes done by flex , so that UI State can work.")
	})
})