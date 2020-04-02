/*global QUnit */
sap.ui.define([
	"sap/gantt/control/Cell",
	"sap/gantt/config/HierarchyColumn",
	"sap/gantt/config/ColumnAttribute"
], function (Cell, HierarchyColumn, ColumnAttribute) {
	"use strict";

	QUnit.module("Test cell", {
		beforeEach: function () {
			//create cell callback
			var CellCallback = function () { };
			CellCallback.prototype.createCellContent = function () {
				return new sap.m.Label({});
			};
			CellCallback.prototype.updateCellContent = function (oCellContent, oContext, sAttributeName, sObjectType) {
				if (sAttributeName !== undefined) {
					oCellContent.setText(oContext.getProperty(sAttributeName) + "_updated");
				}
			};
			//create model
			var oData = {
				root: {
					id: "NN",
					type: "root",
					plate: "NN",
					0: {
						id: "00",
						type: "che",
						plate: "ABC",
						0: {
							id: "00_0",
							type: "gua",
							plate: "GUA_ABC"
						},
						1: {
							id: "00_1",
							type: "gua",
							plate: "GUA_ABC2"
						}
					},
					1: {
						id: "01",
						type: "che",
						plate: "DEF"
					}
				}
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);
			//create table
			this.oTreeTable = new sap.ui.table.TreeTable().placeAt("content");
			var oCol = new sap.ui.table.Column({
				"label": "ID",
				"template": new Cell({
					columnConfig: new HierarchyColumn({
						key: "h1",
						title: "Id",
						contentType: "1",
						attribute: "id"
					}),
					"cellCallback": new CellCallback()
				})
			});
			this.oTreeTable.addColumn(oCol);
			oCol = new sap.ui.table.Column({
				"label": "Plate No.",
				"template": new Cell({
					columnConfig: new HierarchyColumn({
						key: "h2",
						title: "Name / Plate",
						contentType: "1",
						attributes: [new ColumnAttribute({
							objectTypeKey: "che",
							attribute: "plate"
						}), new ColumnAttribute({
							objectTypeKey: "gua",
							attribute: "serial"
						})]
					}),
					"cellCallback": new CellCallback()
				})
			});
			this.oTreeTable.addColumn(oCol);
			this.oTreeTable._bCallUpdateTableCell = true;
			this.oTreeTable.setModel(oModel);
			this.oTreeTable.bindRows("/root");
			this.fnGetCellTexts = function () {
				this.cellTexts = [[this.oTreeTable.getRows()[0].getCells()[0].getContentToRender().getText()]];
				this.cellTexts[0][1] = this.oTreeTable.getRows()[0].getCells()[1].getContentToRender().getText();
				return this.cellTexts;
			};
		},

		afterEach: function () {
			this.oTreeTable.destroy();
		}
	});

	QUnit.test("Test cell", function (assert) {
		var done = assert.async();
		var that = this;
		setTimeout(function () {
			assert.deepEqual(that.fnGetCellTexts(), [["00_updated", "ABC_updated"]], "Cell content updated");
			done();
		}, 2000);
	});
});
