/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveTableColumn
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveTableColumn",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils"
],
function(RemoveTableColumn, Utils) {
	"use strict";
	
	var iIndex = 2;
	var sTypeOfTable;
	
	QUnit.module("RemoveTableColumn revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = RemoveTableColumn.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveTableColumn action");
	});
	
	QUnit.module("Remove TabelColumns applychange Test Module", {
		beforeEach: function() {
			
			var bVisibleColumn1 = true;
			var bVisibleColumn2 = true;
			var bVisibleColumn3 = true;
			
			var aColumns = [{
				id:"Column1",
				getVisible: function() {
					return bVisibleColumn1;
				},
				setVisible: function(bVisibility) {
					bVisibleColumn1 = bVisibility;
				}
			},
			{
				id:"Column2",
				getVisible: function() {
					return bVisibleColumn2; 
				},
				setVisible: function(bVisibility) {
					bVisibleColumn2 = bVisibility;
				},
				destroy: function() {
				}
			},
			{
				id:"Column3",
				getVisible: function() {
					return bVisibleColumn3; 
				},
				setVisible: function(bVisibility) {
					bVisibleColumn3 = bVisibility;
				}
			}]

			var aVisualizations = [{
				Content:{
					splice:function() {
						aColumns[iIndex-1].setVisible(false);
					},
					Columns: aColumns
				}
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
										assert.equal(oPresentationVariant.Visualizations[0].Content.Columns[1].getVisible(), false, "The column is removed")
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
			this.mPropertyBag = {
					modifier: {
						bySelector: function(sRemovedElementId) {
							return {
								getParent: function() {
									return oTable
								}
							}
						}
					}
			}
			this.oChange ={
					getContent: function() {
						return {
							customChanges:[{
								removedElementId: "Column3",
							}]
						}
					}
			}
			this.oGetColumnSpy =  sinon.spy(oTable, "getColumns");
			this.oDestroyColumnSpy = sinon.spy(aColumns[1], "destroy");
			this.oAdaptTableStructureStub = sinon.stub(Utils, "fnAdaptTableStructures").returns()
		},
		afterEach: function() {
			this.oGetColumnSpy.restore();
			this.oDestroyColumnSpy.restore();
			this.oAdaptTableStructureStub.restore();
		}
	});

	QUnit.test("ApplyChange of Responsive Table column", function(assert) {
		sTypeOfTable = "sap.m.Table"
		RemoveTableColumn.applyChange(this.oChange, null, this.mPropertyBag);
		assert.equal(this.oAdaptTableStructureStub.calledOnce, true, "Table Columns has been adapted")
	});
	
	QUnit.test("ApplyChange of UI Table Column", function(assert) {
		sTypeOfTable = "sap.ui.tables.Table"
		RemoveTableColumn.applyChange(this.oChange, null, this.mPropertyBag);
		assert.equal(this.oGetColumnSpy.calledOnce, true, "Reverted to changes done by flex , so that UI State can work.")
		assert.equal(this.oDestroyColumnSpy.calledOnce, true, "Only hidden column destroyed.")
	})
})