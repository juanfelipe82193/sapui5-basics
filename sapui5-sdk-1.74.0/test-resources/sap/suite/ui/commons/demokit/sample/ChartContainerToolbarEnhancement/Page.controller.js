sap.ui.define([ 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/viz/ui5/data/FlattenedDataset', 'sap/viz/ui5/controls/common/feeds/FeedItem', 'sap/m/Label',
				'sap/m/ColumnListItem', 'sap/m/library', 'sap/m/MessageToast', 'sap/m/Column' ],
	function(Controller, JSONModel, FlattenedDataset, FeedItem, Label, ColumnListItem, MobileLibrary, MessageToast, Column) {
	"use strict";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.ChartContainerToolbarEnhancement.Page", {

		/* ============================================================ */
		/* Constants                                                    */
		/* ============================================================ */

		_constants: {
			sampleName: "sap.suite.ui.commons.sample.ChartContainerToolbarEnhancement",
			chartContainerId: "idChartContainer",
			vizFrame: {
				id: "idoVizFrame",
				modulePath: "/ChartContainerData1.json",
				dataset: {
					dimensions: [{
						name: 'Country',
						value: "{Country}"
					}],
					measures: [{
						group: 1,
						name: "Profit",
						value: "{Profit}"
					}, {
						group: 1,
						name: "Target",
						value: "{Target}"
					}, {
						group: 1,
						name: "Forecast",
						value: "{Forecast}"
					}, {
						group: 1,
						name: "Revenue",
						value: "{Revenue}"
					}, {
						group: 1,
						name: "Revenue2",
						value: "{Revenue2}"
					}, {
						group: 1,
						name: "Revenue3",
						value: "{Revenue3}"
					}],
					data: {
						path: "/Products"
					}
				},
				type: "line",
				feedItems: [{
					"uid": "primaryValues",
					"type": "Measure",
					"values": ["Revenue"]
				}, {
					"uid": "axisLabels",
					"type": "Dimension",
					"values": ["Country"]
				}, {
					"uid": "targetValues",
					"type": "Measure",
					"values": ["Target"]
				}]
			},
			table: {
				modulePath: "/ChartContainerData2.json",
				itemBindingPath: "/businessData",
				columnLabelTexts: ["Sales Month", "Marital Status", "Customer Gender", "Sales Quarter", "Cost", "Unit Price", "Gross Profit", "Sales Revenue"],
				templateCellLabelTexts: ["{Sales_Month}", "{Marital Status}", "{Customer Gender}", "{Sales_Quarter}", "{Cost}", "{Unit Price}", "{Gross Profit}", "{Sales Revenue}"]
			}
		},

		/* ============================================================ */
		/* Life-cycle Handling                                          */
		/* ============================================================ */

		onInit: function() {
			// create table content
			var oTable = this.getView().byId("idTable");
			this._createTableContent(oTable);

			//create chart content
			var oVizFrame = this.getView().byId(this._constants.vizFrame.id);
			this._updateVizFrame(oVizFrame);
		},

		/* ============================================================ */
		/* Helper Methods                                               */
		/* ============================================================ */
		/**
		 * Creates table content for the chart container
		 * @param {sap.m.Table} oTable view table
		 * @private
		 */
		_createTableContent: function(oTable) {
			var oTablePath = jQuery.sap.getModulePath(this._constants.sampleName, this._constants.table.modulePath);
			var oTableModel = new JSONModel(oTablePath);
			var oTableConfig = this._constants.table;
			var aColumns = this._createTableColumns(oTableConfig.columnLabelTexts);

			for (var i = 0; i < aColumns.length; i++) {
				oTable.addColumn(aColumns[i]);
			}

			var oTableItemTemplate = new ColumnListItem({
				type: MobileLibrary.ListType.Active,
				cells: this._createLabels(oTableConfig.templateCellLabelTexts)
			});

			oTable.bindItems(oTableConfig.itemBindingPath, oTableItemTemplate, null, null);
			oTable.setModel(oTableModel);
		},
		/**
		 * Calls the message toast show method with the given message.
		 *
		 * @private
		 * @param {String} message Message for message toast
		 */
		_showMessageToast: function(message) {
			MessageToast.show(message);
		},
		/**
		 * Updates the Viz Frame with the necessary data and properties.
		 *
		 * @private
		 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to update
		 */
		_updateVizFrame: function(vizFrame) {
			var oVizFrame = this._constants.vizFrame;
			var oDataset = new FlattenedDataset(this._constants.vizFrame.dataset);
			var oVizFramePath = jQuery.sap.getModulePath(this._constants.sampleName, oVizFrame.modulePath);
			var oModel = new JSONModel(oVizFramePath);

			vizFrame.setDataset(oDataset);
			vizFrame.setModel(oModel);
			this._addFeedItems(vizFrame, oVizFrame.feedItems);
			vizFrame.setVizType(oVizFrame.type);
		},
		/**
		 * Adds the passed feed items to the passed Viz Frame.
		 *
		 * @private
		 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to add feed items to
		 * @param {Object[]} feedItems Feed items to add
		 */
		_addFeedItems: function(vizFrame, feedItems) {
			for (var i = 0; i < feedItems.length; i++) {
				vizFrame.addFeed(new FeedItem(feedItems[i]));
			}
		},
		/**
		 * Creates table columns with labels as headers.
		 *
		 * @private
		 * @param {String[]} labels Column labels
		 * @returns {sap.m.Column[]} Array of columns
		 */
		_createTableColumns: function(labels) {
			var aLabels = this._createLabels(labels);
			return this._createControls(Column, "header", aLabels);
		},
		/**
		 * Creates label control array with the specified texts.
		 *
		 * @private
		 * @param {String[]} labelTexts text array
		 * @returns {sap.m.Column[]} Array of columns
		 */
		_createLabels: function(labelTexts) {
			return this._createControls(Label, "text", labelTexts);
		},
		/**
		 * Creates an array of controls with the specified control type, property name and value.
		 *
		 * @private
		 * @param {sap.ui.core.Control} Control Control type to create
		 * @param {String} prop Property name
		 * @param {Array} propValues Value of the control's property
		 * @returns {sap.ui.core.Control[]} array of the new controls
		 */
		_createControls: function(Control, prop, propValues) {
			var aControls = [];
			var oProps = {};
			for (var i = 0; i < propValues.length; i++) {
				oProps[prop] = propValues[i];
				aControls.push(new Control(oProps));
			}
			return aControls;
		},
		/**
		 * Creates message for a press event on custom button.
		 * @param {sap.ui.base.Event} event the press event object
		 * @private
		 */
		onCustomActionPress: function(event) {
			this._showMessageToast("Custom action press event - " + event.getSource().getId());
		}
	});
	return oPageController;
});
